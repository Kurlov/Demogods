package actors.battle

import java.util.UUID

import actors.battle.Battle.Data.PlayerData
import actors.battle.Player.{YourTurn, TurnFinished}
import actors.session.UserSession
import akka.actor._
import models.cards.{CreatureCard, Card}
import scala.concurrent.duration._
import services.CardsService
import utils.StringUtils._

private [battle] class Battle(player1Session: ActorRef, player2Session: ActorRef)
  extends FSM[Battle.State, Battle.Data] with PubSub {
  import Battle._

  val turnTimeout = 30.seconds
  val turnTimeoutTimerName = "turnTimeoutTimer"
  val sessions = Set(player1Session, player2Session)
  implicit val battleContext = BattleContext(UUID.fromString(self.path.name))

  subscribe(self, classOf[CreatureEvent])


  startWith(State.WaitingPlayers, Data.UnconfirmedPlayers(Set(player1Session, player2Session)))
  
  when(State.WaitingPlayers) {
    case Event(UserSession.PlayerIsReady, uc: Data.UnconfirmedPlayers) =>
      val newState = uc.copy(uc.sessions - sender())
      if (newState.sessions.isEmpty) {
        val (firstPlayer, secondPlayer) = choosePlayersOrder
        val battleState = initializeBattle()
        goto(State.Player1Turn) using battleState
      } else {
        stay using newState
      }
  }

  when(State.Player1Turn) {
    stateData match {
      case Data.BattleData(p1, p2) => handleTurn(
        activePlayerSession = player1Session,
        activePlayer = p1.player,
        waitingPlayer = p2.player,
        waitingPlayerState = State.Player2Turn
      )
      case _ =>
        FSM.NullFunction
    }
  }

  when(State.Player2Turn) {
    stateData match {
      case Data.BattleData(p1, p2) => handleTurn(
        activePlayerSession = player2Session,
        activePlayer = p2.player,
        waitingPlayer = p1.player,
        waitingPlayerState = State.Player1Turn
      )
      case _ =>
        FSM.NullFunction
    }
  }

  onTransition {
    case State.Player1Turn -> _ =>
      nextStateData match { case Battle.Data.BattleData(p1, p2) =>
        p1.player ! TurnFinished

      }

    case State.Player2Turn -> _ =>
      nextStateData match { case Battle.Data.BattleData(p1, p2) =>
        p2.player ! TurnFinished
      }

    case _ -> State.Player1Turn =>
      nextStateData match { case Battle.Data.BattleData(p1, p2) =>
        p1.player ! YourTurn
      }
      setTurnTimeout()

    case _ -> State.Player2Turn =>
      nextStateData match { case Battle.Data.BattleData(p1, p2) =>
        p2.player ! YourTurn
      }
      setTurnTimeout()
  }

  whenUnhandled {
    case Event(UserSession.UserDisconnected, _) =>
      goto(State.PausedBattle)
    case Event(e: CreatureEvent, _) =>
      import CreatureEvents._
      e match {
        case CreatureRaised(card, ref) =>
          sessions.foreach(_ ! Events.CreatureRaised(card, ref.path.name.asUUID))
        case CreatureAttacked(attacker, victim) =>
          sessions.foreach(_ ! Events.CreatureAttacked(attacker.name.asUUID, victim.name.asUUID))
      }
      stay
  }

  initialize()

  def setTurnTimeout() = {
    cancelTimer(turnTimeoutTimerName)
    setTimer(turnTimeoutTimerName, TurnTimeout, turnTimeout)
  }

  def choosePlayersOrder: (ActorRef, ActorRef) = {
    if (util.Random.nextBoolean()) {
      player1Session -> player2Session
    } else {
      player2Session -> player1Session
    }
  }

  def handleTurn(activePlayerSession: ActorRef,
                 activePlayer: ActorRef,
                 waitingPlayer: ActorRef,
                 waitingPlayerState: Battle.State): StateFunction = {
    def isValidSender = { sender() == activePlayerSession }
    {
      case Event(tc @ Commands.ActivateCard(cardId), _) if isValidSender =>
        activePlayer ! tc
        stay
      case Event(Commands.AttackCreature(subj, obj), _) if isValidSender =>
        val victim = waitingPlayer.path / obj.toString
        context.actorSelection(activePlayer.path / subj.toString) ! Creature.Commands.AttackTarget(victim)
        stay
      case Event(Commands.FinishTurn, _) if isValidSender =>
        goto(waitingPlayerState)
      case Event(TurnTimeout, _) =>
        goto(waitingPlayerState)
    }
  }


  def initializeBattle() = {
    val cards = CardsService.listCards.toList //TODO fix it
    def createData(playerName: String, cards: List[Card]): PlayerData = {
      val creatureMaker = (f: ActorRefFactory, cc: CreatureCard, id: UUID) =>
        f.actorOf(Props(classOf[Creature], cc), id.toString)
      val player = context.actorOf(Player.props(self), playerName)
      val dispenser = context.actorOf(CardDispenser.props(player, cards))
      PlayerData(
        player,
        dispenser
      )
    }
    val player1Data = createData("p1", cards)
    val player2Data = createData("p2", cards)

    Data.BattleData(player1Data, player2Data)
  }


}

object Battle {
  private [battle] sealed trait State
  private [battle] object State {
    case object WaitingPlayers extends State
    case object Player1Turn extends State
    case object Player2Turn extends State
    case object PausedBattle extends State
    case object Finished extends State
  }

  private [battle] sealed trait Data
  private [battle] object Data {
    case class UnconfirmedPlayers(sessions: Set[ActorRef]) extends Data
    case class BattleData(firstPlayerData: PlayerData, secondPlayerData: PlayerData) extends Data
    case class PlayerData(player: ActorRef, dispenser: ActorRef)
  }

  object Commands {
    case class ActivateCard(cardId: UUID)
    case class AttackCreature(creatureId: UUID, targetId: UUID)
    case class AttackPlayerByCreature(creatureId: UUID)
    case object FinishTurn
    case object ExitBattle
  }

  object Events {
    case object BattleStarted
    case class CreatureRaised(card: CreatureCard, creatureId: UUID)
    case class CreatureAttacked(attackerId: UUID, victimId: UUID)
    case class CreatureDamaged(creatureId: UUID, damage: Int)
    case class CreatureDied(creatureId: UUID)
    case object BattleFinished
  }

  private case object TurnTimeout

  def props(player1Session: ActorRef, player2Session: ActorRef) =
    Props(new Battle(player1Session, player2Session))
}
