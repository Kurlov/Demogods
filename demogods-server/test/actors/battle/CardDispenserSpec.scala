package actors.battle

import java.util.UUID

import akka.actor.ActorSystem
import akka.testkit._
import models.cards.CreatureCard
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}
import concurrent.duration._
import DispenserEvents.CardPulled

class CardDispenserSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
  with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("CardDispenserSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  class DispenserEnv {
    val battleId = UUID.randomUUID()
    implicit val battleContext = BattleContext(battleId)
    val eventBus = new PubSub {}
    val listener = TestProbe()
    eventBus.subscribe(listener.ref, classOf[HeroEvent])
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
    val dispenser = system.actorOf(CardDispenser.props(cards))
  }

  "Card dispenser" must {
    "give the card when requested" in new DispenserEnv {
      dispenser ! CardDispenser.PullCard
      listener.expectMsg(CardPulled(cards.head))
    }

    "give no card when empty" in new DispenserEnv {
      dispenser ! CardDispenser.PullCard
      listener.expectMsg(CardPulled(cards.head))
      dispenser ! CardDispenser.PullCard
      listener.expectMsg(CardPulled(cards(1)))
      dispenser ! CardDispenser.PullCard
      listener.expectNoMsg(100.millis)
    }
  }
}
