package actors.battle

import java.util.UUID

import akka.actor.{ActorRef, ActorRefFactory, Actor}
import models.cards.CreatureCard


trait CreatureMakerProvider {
  this: Actor =>
  def creatureMaker: (ActorRefFactory, CreatureCard, UUID) => ActorRef
}
