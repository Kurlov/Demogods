package actors.battle

import actors.battle.CardDispenser.PullCard
import akka.actor.{Props, ActorRef, Actor}
import models.cards.Card
import DispenserEvents.CardPulled


class CardDispenser(cards: Seq[Card])(implicit battleContext: BattleContext) extends Actor with PubSub {

  def receive = working(cards)

  def working(remainingCards: Seq[Card]): Receive = {
    case PullCard =>
      val maybeCard = remainingCards.headOption
      maybeCard.foreach { card =>
        publish(CardPulled(card))
        context.become(working(remainingCards.tail))
      }
  }
}

object CardDispenser {
  def props(cards: Seq[Card])(implicit battleContext: BattleContext) =
    Props(new CardDispenser(cards))

  case object PullCard
}