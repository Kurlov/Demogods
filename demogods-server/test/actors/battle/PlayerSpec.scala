package actors.battle

import java.util.UUID

import akka.actor._
import akka.testkit.{TestActorRef, TestProbe, ImplicitSender, TestKit}
import models.cards.CreatureCard
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}

import scala.util.Random


class PlayerSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("PlayerSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  class PlayerEnv {
    val heroName = (1 to 10).map(_ => Random.nextPrintableChar()).toString()
    val creatureProbe = TestProbe()
    val creatureMaker = (_: ActorRefFactory, _: CreatureCard, _: UUID) => creatureProbe.ref
    val dispenserProbe = TestProbe()
    val dispenserMaker = (_: ActorRefFactory) => dispenserProbe.ref
    val battleProbe = TestProbe()
    val battleId = UUID.randomUUID()
    trait TestCreatureMakerProvider extends CreatureMakerProvider {
      this: Actor =>
      override def creatureMaker: (ActorRefFactory, CreatureCard, UUID) => ActorRef =
        (_: ActorRefFactory, _: CreatureCard, _: UUID) => creatureProbe.ref
    }
    implicit val battleContext = BattleContext(battleId)
    val player = TestActorRef[Player](Props(new Player(battleProbe.ref) with TestCreatureMakerProvider))
  }

  class PlayerWithCard extends PlayerEnv {
    private val initAttack = 3
    private val initHp = 6
    private val cardCost = 1
    val card = CreatureCard(UUID.randomUUID(), "testCard", "testCardDescription", initAttack, initHp, cardCost)
  }

  "Player actor" must {
    "be created with 1 energy" in new PlayerEnv {
      player.underlyingActor.energy.current should be (1)
    }

    "increase energy with new turn" in new PlayerEnv {
      player.underlyingActor.energy.current should be (1)
      player ! Player.YourTurn
      player.underlyingActor.energy.current should be (2)
      player ! Player.YourTurn
      player.underlyingActor.energy.current should be (3)
    }

    "add pulled card to storage" in new PlayerWithCard {
      player ! DispenserEvents.CardPulled(card, player)
      player.underlyingActor.cards should be (List(card))
    }

    "spend energy on card activation" in new PlayerWithCard {
      player ! Player.YourTurn
      player ! DispenserEvents.CardPulled(card, player)
      val energy = player.underlyingActor.energy.current
      player ! Battle.Commands.ActivateCard(card.uuid)
      player.underlyingActor.cards should be (List.empty)
      player.underlyingActor.energy.current should be (energy - card.cost)
    }

    "restore energy on new turn" in new PlayerWithCard {
      player ! Player.YourTurn
      player ! DispenserEvents.CardPulled(card, player)
      player ! Battle.Commands.ActivateCard(card.uuid)
      player ! Player.YourTurn
      player.underlyingActor.energy.current should be (player.underlyingActor.energy.available)
    }
  }

}
