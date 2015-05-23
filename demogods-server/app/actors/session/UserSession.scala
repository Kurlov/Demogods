package actors.session

import actors.game.Battle
import actors.gameFinding.GameFinder
import akka.actor._
import com.typesafe.config.ConfigFactory
import models.user.UserId
import UserSession._
import concurrent.duration._

class UserSession(userId: UserId, gameFinder: ActorRef) extends FSM[State, Data] {

  val reconnectionTimeout = defaultReconnectionTimeout

  startWith(Idle, Uninitialized)

  when(Idle) {
    case Event(SocketConnected(ref), Uninitialized) =>
      context.watch(ref)
      stay using ConnectedSocket(ref)
    case Event(FindMeAGame, s: ConnectedSocket) =>
      goto(FindingGame)
  }

  onTransition {
    case Idle -> FindingGame =>
      gameFinder ! GameFinder.FindGame(userId)
  }

  when(FindingGame) {
    case Event(GameFinder.GameFound(battleRef, enemyName), s: ConnectedSocket) =>
      goto(WaitingPlayersConfirmation) using ConnectedBattle(s.socketRef, battleRef, enemyName)
  }

  onTransition {
    case FindingGame -> WaitingPlayersConfirmation =>
      nextStateData match {
        case ConnectedBattle(socketRef, battleRef, enemyName) => socketRef ! SocketProtocol.GameFound(enemyName)
      }
  }

  when(WaitingPlayersConfirmation) {
    case Event(SocketProtocol.StartGame, cg: ConnectedBattle) =>
      cg.battleRef ! PlayerIsReady
      stay()

    case Event(Battle.GameStarted, cg: ConnectedBattle) =>
      goto(PlayingGame)
  }

  when(PlayingGame) {
    case Event(uc: SocketProtocol.UserCommand, ConnectedBattle(socketRef, battleRef, enemyName)) =>
      uc match {
        case SocketProtocol.ThrowCard(cardId) =>
          battleRef ! Battle.ThrowCard(cardId)
        case SocketProtocol.ApplyCreature(creatureId, targetId) =>
          battleRef ! Battle.ApplyCreature(creatureId, targetId)
        case SocketProtocol.FinishTurn =>
          battleRef ! Battle.FinishTurn
        case SocketProtocol.ExitGame =>
          battleRef ! Battle.ExitGame
      }
      stay()
    case Event(GameFinished, g: ConnectedBattle) =>
      goto(Idle) using Uninitialized
    case Event(Terminated(ref), g: ConnectedBattle) =>
      goto(WaitingToReconnect) using WaitingReconnection(g.battleRef, g.enemyName) forMax reconnectionTimeout
  }

  onTransition {
    case PlayingGame -> WaitingToReconnect =>
      println("timeout: " + reconnectionTimeout)
      stateData match {
        case g: ConnectedBattle => g.battleRef ! UserDisconnected
      }
  }

  when(WaitingToReconnect) {
    case Event(SocketConnected(socketRef), wr: WaitingReconnection) =>
      context.watch(socketRef)
      goto(PlayingGame) using ConnectedBattle(socketRef, wr.battleRef, wr.enemyName)
    case Event(StateTimeout, _) =>
      stop()
  }

  onTransition {
    case WaitingToReconnect -> PlayingGame =>
      stateData match {
        case wr: WaitingReconnection => wr.battleRef ! UserReconnected
      }
  }

  whenUnhandled {
    case Event(Terminated(ref), _) =>
      stop()

    case Event(e, s) =>
      log.warning("received unhandled request {} in state {}/{}", e, stateName, s)
      stay()
  }

  initialize()

}


object UserSession {
  def props(userId: UserId, gameFinder: ActorRef) = Props(classOf[UserSession], userId, gameFinder)

  sealed trait State
  case object Idle extends State
  case object FindingGame extends State
  case object WaitingPlayersConfirmation extends State
  case object PlayingGame extends State
  case object WaitingToReconnect extends State

  sealed trait Data
  case object Uninitialized extends Data
  case class ConnectedSocket(socketRef: ActorRef) extends Data
  case class ConnectedBattle(socketRef: ActorRef, battleRef: ActorRef, enemyName: String) extends Data
  case class WaitingReconnection(battleRef: ActorRef, enemyName: String) extends Data

  case class SocketConnected(ref: ActorRef)
  case object FindMeAGame
  case object GameFinished
  case object PlayerIsReady
  case object UserDisconnected
  case object UserReconnected

  val defaultReconnectionTimeout = Duration(ConfigFactory.load().getInt("user-session.reconnection-timeout"), SECONDS)
}