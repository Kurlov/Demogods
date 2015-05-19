package session

import java.util.UUID

import actors.messages.UserConnected
import actors.session.{SocketProtocol, PlayJsonSocketHelper, SocketActor}
import actors.session.SocketActor.HereIsYourSession
import models.user.UserId
import org.scalatest._
import akka.actor._
import akka.testkit._
import play.api.libs.json.Json
import scala.concurrent.duration._

class SocketActorSpec(_system: ActorSystem) extends TestKit(_system) with ImplicitSender with WordSpecLike
  with Matchers with BeforeAndAfterAll {

  def this() = this(ActorSystem("SocketActorSpec"))

  override def afterAll {
    TestKit.shutdownActorSystem(system)
  }

  val jsonHelper = new PlayJsonSocketHelper {}
  val userId = UserId(UUID.randomUUID())

  def socketAndEnvironment = {
    val outProbe = TestProbe()
    val sessionMangerProbe = TestProbe()
    val sessionProbe = TestProbe()
    val socket = system.actorOf(SocketActor.props(userId, outProbe.ref, sessionMangerProbe.ref))
    socket ! HereIsYourSession(sessionProbe.ref)
    (socket, outProbe, sessionMangerProbe, sessionProbe)
  }


  "An SocketActor actor" must {

    "send UserConnected messages to session manager on start" in {
      val outProbe = TestProbe()
      val sessionMangerProbe = TestProbe()
      system.actorOf(SocketActor.props(userId, outProbe.ref, sessionMangerProbe.ref))
      sessionMangerProbe.expectMsg(UserConnected(userId))
    }

    "use received session" in {
      val outProbe = TestProbe()
      val sessionMangerProbe = TestProbe()
      val sessionProbe = TestProbe()
      val socket = system.actorOf(SocketActor.props(userId, outProbe.ref, sessionMangerProbe.ref))
      socket ! HereIsYourSession(sessionProbe.ref)
      socket ! jsonHelper.toJson(SocketProtocol.FindGame)
      sessionProbe.expectMsg(SocketProtocol.FindGame)
    }

    "handle UserCommand as json" in {
      val (socket, outProbe, sessionMangerProbe, sessionProbe) = socketAndEnvironment
      socket ! jsonHelper.toJson(SocketProtocol.FindGame)
      sessionProbe.expectMsg(SocketProtocol.FindGame)
    }

    "reject ServerEvent as json" in {
      val gameFound = SocketProtocol.GameFound(UUID.randomUUID(), "foo")
      val (socket, outProbe, sessionMangerProbe, sessionProbe) = socketAndEnvironment
      val json = jsonHelper.toJson(gameFound)
      val wrappedJson = jsonHelper.wrapUnknown(json)
      socket ! json
      sessionProbe.expectNoMsg(150.millis)
      outProbe.expectMsg(wrappedJson)
    }

    "accept ServerEvent as case class" in {
      val gameFound = SocketProtocol.GameFound(UUID.randomUUID(), "foo")
      val (socket, outProbe, sessionMangerProbe, sessionProbe) = socketAndEnvironment
      val json = jsonHelper.toJson(gameFound)
      socket ! gameFound
      outProbe.expectMsg(json)
    }

    "reject unknown json" in {
      val (socket, outProbe, sessionMangerProbe, sessionProbe) = socketAndEnvironment
      val unknownJson = Json.toJson(Map("unknown" -> "json"))
      socket ! unknownJson
      outProbe.expectMsg(jsonHelper.wrapUnknown(unknownJson))
    }

  }
}
