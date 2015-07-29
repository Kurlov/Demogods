package actors.battle

import java.util.UUID

import actors.session.UserSession
import actors.session.UserSession.PlayerIsReady
import akka.actor.ActorSystem
import akka.testkit.{TestFSMRef, TestProbe, ImplicitSender, TestKit}
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}


class BattleSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
with Matchers with BeforeAndAfterAll {

  import Battle._

  def this() = this(ActorSystem("BattleSpec"))

  override def afterAll() {
    TestKit.shutdownActorSystem(system)
  }

  class BattleEnv {
    val battleId = UUID.randomUUID()
    val battleName = battleId.toString
    val eventBus = new PubSub {}
    val session1 = TestProbe()
    val session2 = TestProbe()
    val battle = TestFSMRef[Battle.State, Battle.Data, Battle](new Battle(session1.ref, session2.ref), battleName)
  }

  "A Battle actor" must {
    "start with waiting players" in new BattleEnv {
      battle.stateName shouldBe State.WaitingPlayers
      battle.stateData shouldBe Data.UnconfirmedPlayers(Set(session1.ref, session2.ref))
    }

    "wait other player to connect" in new BattleEnv {
      battle.receive(UserSession.PlayerIsReady, session1.ref)
      battle.stateName shouldBe State.WaitingPlayers
      battle.stateData shouldBe Data.UnconfirmedPlayers(Set(session2.ref))
    }

    "start game when all players connected" in new BattleEnv {
      battle.receive(UserSession.PlayerIsReady, session1.ref)
      battle.receive(UserSession.PlayerIsReady, session2.ref)
    }

  }

}
