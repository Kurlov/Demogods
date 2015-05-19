package actors.session

import actors.messages._
import akka.actor._
import models.game.GameId
import models.user.UserId
import UserSession._
import concurrent.duration._

class UserSession(userId: UserId, gameFinder: ActorRef) extends FSM[State, Data] {

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
      gameFinder ! FindGame(userId)
  }

  when(FindingGame) {
    case Event(GameFound(gameId), s: ConnectedSocket) =>
      goto(PlayingGame) using ConnectedGame(s.socketRef, gameId)
  }

  when(PlayingGame) {
    case Event(GameFinished, g: ConnectedGame) =>
      goto(Idle) using Uninitialized
    case Event(Terminated(ref), g: ConnectedGame) =>
      goto(WaitingToReconnect)
  }

  onTransition {
    case PlayingGame -> WaitingToReconnect =>
      context.parent ! UserDisconnected(userId)
  }

  when(WaitingToReconnect, stateTimeout = 30 seconds) {
    case Event(UserReconnected, g: ConnectedGame) =>
      goto(PlayingGame)
    case Event(StateTimeout, g: ConnectedGame) =>
      stop()
  }

  whenUnhandled {
    case Event(Terminated(ref), _) =>
      stop()
  }

  initialize()

}


object UserSession {
  def props(userId: UserId, gameFinder: ActorRef) = Props(classOf[UserSession], userId, gameFinder)

  sealed trait State
  case object Idle extends State
  case object FindingGame extends State
  case object PlayingGame extends State
  case object WaitingToReconnect extends State

  sealed trait Data
  case object Uninitialized extends Data
  case class ConnectedSocket(socketRef: ActorRef) extends Data
  case class ConnectedGame(socketRef: ActorRef, gameId: GameId) extends Data

  case class SocketConnected(ref: ActorRef)
  case object FindMeAGame
  case object GameFinished

  //case object UserDisconnected
  case object UserReconnected
}
//States:
//
// Idle -> FindngMatch -> InGame
//
//


//Data:
//
// Uninitialized
// MatchId