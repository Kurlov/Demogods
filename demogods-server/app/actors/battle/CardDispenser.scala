package actors.battle

import actors.battle.CardDispenser.{CardPulled, PullCard}
import akka.actor.{Props, ActorRef, Actor}
import models.cards.Card


class CardDispenser(player: ActorRef, session: ActorRef, cards: Seq[Card]) extends Actor {

  def receive = working(cards)

  def working(remainingCards: Seq[Card]): Receive = {
    case PullCard =>
      val maybeCard = remainingCards.headOption
      maybeCard.foreach { card =>
        player ! CardPulled(card)
        session ! CardPulled(card)
        context.become(working(remainingCards.tail))
      }
  }
}

object CardDispenser {
  def props(player: ActorRef, session: ActorRef, cards: Seq[Card]) =
    Props(classOf[CardDispenser], player, session, cards)

  case object PullCard
  case class CardPulled(card: Card)
}