package actors.session

import java.util.UUID


object SocketProtocol {

  sealed trait WebSocketMessage
  //user commands
  case object FindGame extends WebSocketMessage
  case object ExitGame extends WebSocketMessage
  case class ThrowCard(cardId: UUID) extends WebSocketMessage
  case class ApplyCreature(creatureId: UUID, target: UUID) extends WebSocketMessage
  case object FinishTurn extends WebSocketMessage

  //server evnts

  //game events
  case class GameFound(enemyId: UUID, enemyName: UUID) extends WebSocketMessage
  case object GamePaused extends WebSocketMessage
  case object GameResumed extends WebSocketMessage
  case object GameFinished extends WebSocketMessage
  case class FirstPlayerSelected(userId: UUID) extends WebSocketMessage
  case class CardPulled(cardId: UUID) extends WebSocketMessage

  //enemy actions
  case class EnemyCardThrown(cardId: UUID) extends WebSocketMessage
  case class EnemyCreatureApplied(creatureId: UUID, target: UUID) extends WebSocketMessage
  case object EnemyCardPulled extends WebSocketMessage
  case object EnemyTurnFinished extends WebSocketMessage
  case object EnemyDisconnected  extends WebSocketMessage

}
