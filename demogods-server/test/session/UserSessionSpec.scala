package session

import java.util.UUID

import actors.game.Battle
import actors.gameFinding.GameFinder
import actors.session._
import akka.actor._
import akka.testkit._
import com.typesafe.config.ConfigFactory
import models.user.UserId
import org.scalatest._
import scala.concurrent.duration._


class UserSessionSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
  with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("UserSessionSpec"))

  override def afterAll {
    TestKit.shutdownActorSystem(system)
  }

  ConfigFactory.invalidateCaches()

  val userId = UserId(UUID.randomUUID())
  val name = "player"

  import UserSession._

  "A UserSessionSpec actor" must {

    class TestedSession {
      val gameFinderProbe = TestProbe()
      val socketProbe = TestProbe()
      val battleProbe = TestProbe()
      val session = TestFSMRef(
        new UserSession(userId, gameFinderProbe.ref) {override val reconnectionTimeout = 100 millis}
      )
    }

    "handle socket connection when Idle" in new TestedSession {
      session ! SocketConnected(socketProbe.ref)
      session.stateName should be (Idle)
      session.stateData should be (ConnectedSocket(socketProbe.ref))
    }

    "become finding game when got FindGame command" in new TestedSession {
      session.setState(Idle, ConnectedSocket(socketProbe.ref))
      session ! FindMeAGame
      gameFinderProbe.expectMsg(GameFinder.FindGame(userId))
      session.stateName should be (FindingGame)
      session.stateData should be (ConnectedSocket(socketProbe.ref))
    }

    "start waiting players confirmation when the game is found" in new TestedSession {
      session.setState(FindingGame, ConnectedSocket(socketProbe.ref))
      session ! GameFinder.GameFound(battleProbe.ref, name)
      socketProbe.expectMsg(SocketProtocol.GameFound(name))
      session.stateName should be (WaitingPlayersConfirmation)
      session.stateData should be (ConnectedBattle(socketProbe.ref, battleProbe.ref, name))
    }

    "start forward playerReady signal to game" in new TestedSession {
      session.setState(WaitingPlayersConfirmation, ConnectedBattle(socketProbe.ref, battleProbe.ref, name))
      session ! SocketProtocol.StartGame
      battleProbe.expectMsg(PlayerIsReady)
    }

    "become PlayingGame when got confirmation from battle" in new TestedSession {
      val data = ConnectedBattle(socketProbe.ref, battleProbe.ref, name)
      session.setState(WaitingPlayersConfirmation, data)
      session ! Battle.GameStarted
      session.stateName should be (PlayingGame)
      session.stateData should be (data)
    }

    "forward commands to battle when playing game" in new TestedSession {
      val data = ConnectedBattle(socketProbe.ref, battleProbe.ref, name)
      val uuid1 = UUID.randomUUID()
      val uuid2 = UUID.randomUUID()
      session.setState(PlayingGame, data)
      session ! SocketProtocol.ApplyCreature(uuid1,uuid2)
      battleProbe.expectMsg(Battle.ApplyCreature(uuid1, uuid2))
      session ! SocketProtocol.ThrowCard(uuid1)
      battleProbe.expectMsg(Battle.ThrowCard(uuid1))
      session ! SocketProtocol.FinishTurn
      battleProbe.expectMsg(Battle.FinishTurn)
    }

    "handle closed socket during playing game" in new TestedSession {
      session.setState(PlayingGame, ConnectedBattle(socketProbe.ref, battleProbe.ref, name))
      session.watch(socketProbe.ref)
      system.stop(socketProbe.ref)
      battleProbe.expectMsg(UserDisconnected)
      session.stateName should be (WaitingToReconnect)
      session.stateData should be (WaitingReconnection(battleProbe.ref, name))
    }

    "disconnect and reconnect" in new TestedSession {
      session.setState(PlayingGame, ConnectedBattle(socketProbe.ref, battleProbe.ref, name))
      session.watch(socketProbe.ref)
      system.stop(socketProbe.ref)
      battleProbe.expectMsg(UserDisconnected)
      val newSocketProbe = TestProbe()
      session ! SocketConnected(newSocketProbe.ref)
      session.stateName should be (PlayingGame)
      session.stateData should be (ConnectedBattle(newSocketProbe.ref, battleProbe.ref, name))
    }

    "handle reconnection while WaitingToReconnect" in new TestedSession {
      session.setState(WaitingToReconnect, WaitingReconnection(battleProbe.ref, name))
      session ! SocketConnected(socketProbe.ref)
      battleProbe.expectMsg(UserReconnected)
      session.stateName should be (PlayingGame)
      session.stateData should be (ConnectedBattle(socketProbe.ref, battleProbe.ref, name))
    }

    "shutdown due to timeout" in new TestedSession {
      val probe = TestProbe()
      session.setState(PlayingGame, ConnectedBattle(socketProbe.ref, battleProbe.ref, name))
      session.watch(socketProbe.ref)
      system.stop(socketProbe.ref)
      probe.watch(session)
      probe.expectTerminated(session, 200 millis)
    }
  }


}
