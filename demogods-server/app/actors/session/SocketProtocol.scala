package actors.session

import java.util.UUID


object SocketProtocol {

  private [session] sealed trait WebSocketMessage
  private [session] trait UserCommand extends WebSocketMessage
  private [session] trait ServerEvent extends WebSocketMessage

  //user commands
  private [session] case object FindBattle extends UserCommand
  private [session] case object JoinBattle extends UserCommand
  private [session] case class ActivateCard(cardId: UUID) extends UserCommand
  private [session] case class AttackCreature(creatureId: UUID, target: UUID) extends UserCommand
  private [session] case class AttackHeroByCreature(creatureId: UUID) extends UserCommand
  private [session] case object FinishTurn extends UserCommand
  private [session] case object ExitBattle extends UserCommand

  //acknowledgements
  private [session] case class Ok(id: Long)

  //server evnts

  //game events
  private [session] case class BattleFound(enemyName: String) extends ServerEvent
  private [session] case object BattlePaused extends ServerEvent
  private [session] case object BattleResumed extends ServerEvent
  private [session] case object BattleFinished extends ServerEvent
  private [session] case class FirstPlayerSelected(userId: UUID) extends ServerEvent
  private [session] case class CardPulled(cardId: UUID) extends ServerEvent
  private [session] case class CreatureRaised(cardId: UUID, creatureId: UUID) extends ServerEvent
  private [session] case class CreatureDied(creatureId: UUID) extends ServerEvent

  //enemy actions
  private [session] case class EnemyCardActivated(cardId: UUID) extends ServerEvent
  private [session] case class EnemyCreatureApplied(creatureId: UUID, target: UUID) extends ServerEvent
  private [session] case class EnemyCreatureRaised(cardId: UUID, creatureId: UUID) extends ServerEvent
  private [session] case object EnemyCardPulled extends ServerEvent
  private [session] case object EnemyTurnFinished extends ServerEvent
  private [session] case object EnemyDisconnected  extends ServerEvent

}
