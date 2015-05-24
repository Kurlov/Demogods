package session

import java.util.UUID

import actors.session.SessionManager.UserConnected
import akka.actor.{ActorRefFactory, ActorSystem}
import akka.testkit._
import models.user.UserId
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpecLike}
import actors.session.{UserSession, SocketHandler, SessionManager}


class SessionManagerSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("SessionManagerSpec"))

  override def afterAll {
    TestKit.shutdownActorSystem(system)
  }

  val userId = UserId(UUID.randomUUID())
  val name = "player"

  "A SessionManager actor" must {
    "introduce session for socket" in {
      val sessionProbe = TestProbe()
      val socketProbe = TestProbe()
      val maker = (_: ActorRefFactory, _: UserId, _: UserId => String) => sessionProbe.ref
      val manager = TestActorRef(SessionManager.props(maker))
      socketProbe.send(manager, UserConnected(userId))
      sessionProbe.expectMsg(UserSession.SocketConnected(socketProbe.ref))
      socketProbe.expectMsg(SocketHandler.HereIsYourSession(sessionProbe.ref))
    }
  }
}