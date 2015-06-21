package actors.battle

import java.util.UUID

import akka.actor.{ActorRefFactory, Props, ActorRef, Actor}
import models.cards.{CreatureCard, Card}


class Player(battle: ActorRef,
             dispenserMaker: ActorRefFactory => ActorRef,
             creatureMaker: (ActorRefFactory, CreatureCard, UUID) => ActorRef)
  extends Actor {

  import Player._
  import DispenserEvents.CardPulled

  type CreatureRef = ActorRef

  val InitEnergy = 1
  val maxPossibleEnergy = 10

  var energy = PlayerEnergy(current = InitEnergy, available = InitEnergy, maxPossible = maxPossibleEnergy)
  var cards = List.empty[Card]
  var creatures = List.empty[CreatureRef]
  val dispenser = dispenserMaker(context)

  def receive = {
    case YourTurn => handleNewTurn()
    case Battle.Commands.ActivateCard(cardId) =>
      cards.find(_.id == cardId).foreach(activateCard)
    case CardPulled(card) => cards = card :: cards
    case TurnFinished => handleFinishedTurn()
      
  }

  def activateCard(card: Card) = card match {
    case cc: CreatureCard if energy.canBeActivated(cc) =>
      energy = energy.subtracted(cc)
      cards = cards.filterNot(_ == card)
      val creatureId = UUID.randomUUID()
      creatureMaker(context, cc, creatureId)
  }

  def handleNewTurn() = {
    energy = energy.increased.full
    dispenser ! CardDispenser.PullCard
  }

  def handleFinishedTurn() = {
    creatures.foreach(_ ! Creature.Commands.WakeUp)
  }
}

object Player {
  def props(battle: ActorRef,
            dispenserMaker: ActorRefFactory => ActorRef,
            creatureMaker: (ActorRefFactory, CreatureCard, UUID) => ActorRef) =
    Props(new Player(battle, dispenserMaker, creatureMaker))

  case object YourTurn
  case object TurnFinished

  case class PlayerEnergy(current: Int, available: Int, maxPossible: Int) {
    require(current >=0 && available >= 0 && maxPossible > 0)
    def canBeActivated(card: Card) = current >= card.cost
    def subtracted(activatedCard: Card) = {
      require(canBeActivated(activatedCard))
      copy(current = current - activatedCard.cost)
    }
    def increased = copy(available = (available + 1) min maxPossible)
    def full = copy(current = available)
  }
}

