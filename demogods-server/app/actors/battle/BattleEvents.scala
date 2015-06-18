package actors.battle


import akka.actor._
import models.cards.CreatureCard

sealed trait CreatureEvent

object CreatureEvents {

  case class CreatureRaised(card: CreatureCard, creature: ActorRef) extends CreatureEvent

  case class CreatureDamaged(creature: ActorRef, damage: Int) extends CreatureEvent

  case class CreatureDied(creature: ActorRef) extends CreatureEvent

}