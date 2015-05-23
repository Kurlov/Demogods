package actors.session

import java.util.UUID


object SocketProtocol {

  sealed trait WebSocketMessage
  trait UserCommand extends WebSocketMessage
  trait ServerEvent extends WebSocketMessage

  //user commands
  case object FindGame extends UserCommand
  case object StartGame extends UserCommand
  case class ThrowCard(cardId: UUID) extends UserCommand
  case class ApplyCreature(creatureId: UUID, target: UUID) extends UserCommand
  case object FinishTurn extends UserCommand
  case object ExitGame extends UserCommand

  //server evnts

  //game events
  case class GameFound(enemyName: String) extends ServerEvent
  case object GamePaused extends ServerEvent
  case object GameResumed extends ServerEvent
  case object GameFinished extends ServerEvent
  case class FirstPlayerSelected(userId: UUID) extends ServerEvent
  case class CardPulled(cardId: UUID) extends ServerEvent
  case class CreatureRaised(cardId: UUID, creatureId: UUID) extends ServerEvent

  //enemy actions
  case class EnemyCardThrown(cardId: UUID) extends ServerEvent
  case class EnemyCreatureApplied(creatureId: UUID, target: UUID) extends ServerEvent
  case class EnemyCreatureRaised(cardId: UUID, creatureId: UUID) extends ServerEvent
  case object EnemyCardPulled extends ServerEvent
  case object EnemyTurnFinished extends ServerEvent
  case object EnemyDisconnected  extends ServerEvent

}
