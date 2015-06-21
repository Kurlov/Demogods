package actors.battle


import akka.actor._
import models.cards.{Card, CreatureCard}

private [battle] sealed trait CreatureEvent

object CreatureEvents {

  case class CreatureRaised(card: CreatureCard, creature: ActorRef) extends CreatureEvent

  case class CreatureAttacked(attacker: ActorPath, victim: ActorPath) extends CreatureEvent

  case class CreatureDamaged(creature: ActorRef, damage: Int) extends CreatureEvent

  case class CreatureDied(creature: ActorRef) extends CreatureEvent

}

private [battle] sealed trait HeroEvent

object HeroEvents {

  case class HeroDamaged(hero: ActorRef, damage: Int) extends HeroEvent

  case class HeroDied(hero: ActorRef) extends HeroEvent
}

private [battle] sealed trait DispenserEvent

object DispenserEvents {

  case class CardPulled(card: Card) extends DispenserEvent

}