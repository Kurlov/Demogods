package actors.battle

import java.util.UUID

import actors.battle.BattleLogic.{Counterattack, IncomingAttack}
import akka.actor.{ActorSelection, ActorSystem}
import akka.testkit._
import models.cards.CreatureCard
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}
import concurrent.duration._

class CreatureSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
  with Matchers with BeforeAndAfterAll {

  import Creature._
  import actors.battle.CreatureEvent
  import actors.battle.CreatureEvents._

  def this() = this(ActorSystem("CreatureSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  class CreatureEnv {
    val creatureUUID = UUID.randomUUID()
    val creatureName = creatureUUID.toString
    val battleId = UUID.randomUUID()
    implicit val battleContext = BattleContext(battleId)
    val eventBus = new PubSub {}
    val listener = TestProbe()
    eventBus.subscribe(listener.ref, classOf[CreatureEvent])

    val initAttack = 3
    val initHp = 6
    val cardCost = 3
    val card = CreatureCard(UUID.randomUUID(), "testCard", "testCardDescription", initAttack, initHp, cardCost)
    val creature = TestFSMRef(new Creature(card), creatureName)

    listener.expectMsg(CreatureRaised(card, creature))
  }

  class InactiveCreature extends CreatureEnv {
   creature.setState(State.Inactive, creature.stateData)
  }

  class ActiveCreature extends CreatureEnv {
    creature.setState(State.Active, creature.stateData)
  }

  class DeadCreature extends CreatureEnv {
    creature.setState(State.Dead, creature.stateData)
  }

  trait CheckDeath {
    this: CreatureEnv =>
    val damage = 100
    creature ! IncomingAttack(damage)
    creature.stateName should be (State.Dead)
    creature.stateData should be (Data.Stats(initHp-damage, initAttack))

    listener.expectMsg(CreatureDamaged(creature, damage))
    listener.expectMsg(CreatureDied(creature))
  }

  "A Creature actor" must {

    "be Inactive when created" in new CreatureEnv {
      creature.stateName should be (State.Inactive)
    }

    "handle damage but don't attack when Inactive" in new InactiveCreature {
      val damage = 1
      creature ! IncomingAttack(damage)
      creature.stateData should be (Data.Stats(initHp-damage, initAttack))
      listener.expectMsg(CreatureDamaged(creature, damage))
      expectNoMsg(100.millis)
    }

    "die when got enough damage in inactive state" in new InactiveCreature with CheckDeath

    "become Active when receive WakeUp message" in new InactiveCreature {
      creature ! Commands.WakeUp
      creature.stateName should be (State.Active)
    }

    "handle damage and counterattack when active" in new ActiveCreature {
      val damage = 1
      creature ! IncomingAttack(damage)
      creature.stateData should be (Data.Stats(initHp-damage, initAttack))
      listener.expectMsg(CreatureDamaged(creature, damage))
      creature.stateName should be (State.Active)
      expectMsg(Counterattack(initAttack))
    }

    "counterattack if died when active" in new ActiveCreature with CheckDeath {
      expectMsg(Counterattack(initAttack))
    }

    "attack other creature when received attack command" in new ActiveCreature {
      val targetCreatureProbe = TestProbe()
      creature ! Commands.AttackTarget(targetCreatureProbe.ref.path)
      listener.expectMsg(CreatureAttacked(creature.path, targetCreatureProbe.ref.path))
      targetCreatureProbe.expectMsg(IncomingAttack(initAttack))
    }

    "become inactive after attack" in new ActiveCreature {
      val targetCreatureProbe = TestProbe()
      creature ! Commands.AttackTarget(targetCreatureProbe.ref.path)
      creature.stateName should be (State.Inactive)
    }

    "skip Counterattack messages when Dead" in new DeadCreature {
      creature ! Counterattack(5)
      expectNoMsg(100.millis)
    }

  }
}