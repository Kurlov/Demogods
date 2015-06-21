package actors.battle

import java.util.UUID

import akka.actor._
import HeroEvents._

import scala.util.Try

class Hero(implicit battleContext: BattleContext) extends Actor with PubSub {

  var hp = 30

  require(Try(UUID.fromString(self.path.name)).toOption.nonEmpty, "name must be a valid UUID")

  def receive = {
    case BattleLogic.IncomingAttack(damage) => handleDamage(damage)
  }

  def handleDamage(damage: Int) = {
    hp -= damage
    publish(HeroDamaged(self, damage))
    checkDeath()
  }

  def checkDeath() = {
    if (hp <= 0) {
      publish(HeroDied(self))
    }
  }
}

object Hero {

  def props(implicit battleContext: BattleContext) = Props(new Hero)

}