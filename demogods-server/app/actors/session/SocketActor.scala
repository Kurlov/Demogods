package actors.session

import actors.messages.UserConnected
import actors.session.SocketActor.HereIsYourSession
import akka.actor._
import models.user.UserId
import play.api.libs.json.JsValue


class SocketActor(userId: UserId, out: ActorRef, sessionManager: ActorRef) extends Actor with ActorLogging with Stash {
  this: JsonSocketHelper =>

  import SocketProtocol._
  //noinspection UnitInMap
  def receive = {
    case HereIsYourSession(sessionRef) =>
      unstashAll()
      context.become({
        case json: JsValue =>
          fromJson(json) match {
            case Some(uc: UserCommand) => sessionRef ! uc
            case _ => out ! wrapUnknown(json)
          }

        case se: ServerEvent =>
          out ! toJson(se)
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