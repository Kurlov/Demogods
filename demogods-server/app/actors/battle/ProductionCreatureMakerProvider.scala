package actors.battle

import java.util.UUID

import actors.battle.BattleContext
import akka.actor.{Actor, Props, ActorRef, ActorRefFactory}
import models.cards.CreatureCard


trait ProductionCreatureMakerProvider extends CreatureMakerProvider {
  this: Actor =>
  implicit def battleContext: BattleContext
  override def creatureMaker: (ActorRefFactory, CreatureCard, UUID) => ActorRef =
    (f: ActorRefFactory, cc: CreatureCard, id: UUID) => f.actorOf(Creature.props(cc), id.toString)
}
