package actors.battle

import java.util.UUID

import akka.actor.ActorSystem
import akka.testkit.{TestProbe, ImplicitSender, TestKit}
import org.scalatest._

class BattleBusSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("CardDispenserSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  val bus = new BattleEventBus
  val probe = TestProbe()

  trait TestTrait
  case object TestObject extends TestTrait

  "BattleEventBus" must {
    "publish event to subscriber" in {
      val battleId = UUID.randomUUID()
      val msg = MsgEnvelope(battleId, TestObject)
      bus.subscribe(probe.ref, BattleBusClassifier(battleId, classOf[TestTrait]))
      bus.publish(msg)
      probe.expectMsg(msg.payload)
    }
  }
}
