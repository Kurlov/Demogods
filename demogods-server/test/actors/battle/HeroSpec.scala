package actors.battle

import java.util.UUID

import actors.battle.BattleLogic.IncomingAttack
import actors.battle.HeroEvents.{HeroDied, HeroDamaged}
import akka.actor.ActorSystem
import akka.testkit.{TestProbe, ImplicitSender, TestKit}
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}


class HeroSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
  with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("HeroSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  class HeroEnv {
    val heroUUID = UUID.randomUUID()
    val heroName = heroUUID.toString
    val battleId = UUID.randomUUID()
    implicit val battleContext = BattleContext(battleId)
    val eventBus = new PubSub {}
    val listener = TestProbe()
    eventBus.subscribe(listener.ref, classOf[HeroEvent])

    val hero = system.actorOf(Hero.props, heroName)
  }

  "A Hero" must {
    "report about damage" in new HeroEnv {
      val damage = 5
      hero ! IncomingAttack(damage)
      listener.expectMsg(HeroDamaged(hero, damage))
    }

    "die when got enough damage" in new HeroEnv {
      val damage = 100
      hero ! IncomingAttack(damage)
      listener.expectMsg(HeroDamaged(hero, damage))
      listener.expectMsg(HeroDied(hero))
    }
  }

}
