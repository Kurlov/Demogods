package actors.battle

import java.util.UUID

import akka.actor.ActorSystem
import akka.testkit._
import models.cards.CreatureCard
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}
import concurrent.duration._

class CardDispenserSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
  with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("CardDispenserSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  class DispenserEnv {
    val playerProbe = TestProbe()
    val sessionProbe = TestProbe()
    val cards =
      Seq(
        CreatureCard(
          UUID.randomUUID(),
          "card 1",
          "card 1 description",
          1,
          2,
          3
        ), CreatureCard(
          UUID.randomUUID(),
          "card 2",
          "card 2 description",
          4,
          5,
          6
        )
      )
    val dispenser = system.actorOf(CardDispenser.props(playerProbe.ref, sessionProbe.ref, cards))
  }

  "Card dispenser" must {
    "give the card when requested" in new DispenserEnv {
      dispenser ! CardDispenser.PullCard
      playerProbe.expectMsg(CardDispenser.CardPulled(cards.head))
      sessionProbe.expectMsg(CardDispenser.CardPulled(cards.head))
    }

    "give no card when empty" in new DispenserEnv {
      dispenser ! CardDispenser.PullCard
      playerProbe.expectMsg(CardDispenser.CardPulled(cards.head))
      sessionProbe.expectMsg(CardDispenser.CardPulled(cards.head))
      dispenser ! CardDispenser.PullCard
      playerProbe.expectMsg(CardDispenser.CardPulled(cards(1)))
      sessionProbe.expectMsg(CardDispenser.CardPulled(cards(1)))
      dispenser ! CardDispenser.PullCard
      playerProbe.expectNoMsg(100.millis)
      sessionProbe.expectNoMsg(100.millis)
    }
  }
}
