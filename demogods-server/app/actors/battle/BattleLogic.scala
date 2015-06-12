package actors.battle

object BattleLogic {
  private [battle] case class IncomingAttack(damage: Int)
  private [battle] case class Counterattack(damage: Int)
}
