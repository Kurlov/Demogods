package actors.session

import actors.messages.UserConnected
import actors.session.SocketActor.HereIsYourSession
import akka.actor._
import models.user.UserId
import play.api.libs.json.{Json, JsValue}


class SocketActor(userId: UserId, out: ActorRef, sessionManager: ActorRef) extends Actor with Stash {
  this: JsonSocketHelper =>

  var session: ActorRef = _

  import SocketProtocol._
  //noinspection UnitInMap
  def receive = {
    case HereIsYourSession(sessionRef) =>
      session = sessionRef
      unstashAll()
      context.become({
        case json: JsValue =>
          fromJson(json) map {
            case FindGame => session ! UserSession.FindMeAGame
          } getOrElse {
            out ! Json.parse( s"""{"error": "unknown json: ${Json.stringify(json)}"}""")
          }

        case wsm: WebSocketMessage =>
          out ! toJson(wsm)
      })

    case msg => stash()
  }

  override def preStart() = {
    sessionManager ! UserConnected(userId)
  }
}

object SocketActor {
  def props(userId: UserId, out: ActorRef, sessionManager: ActorRef) =
    Props(new SocketActor(userId, out, sessionManager) with PlayJsonSocketHelper)

  case class HereIsYourSession(session: ActorRef)
}