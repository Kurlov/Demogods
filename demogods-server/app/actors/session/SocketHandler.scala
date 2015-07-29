package actors.session

import actors.session.SocketHandler.HereIsYourSession
import akka.actor._
import models.user.UserId
import play.api.libs.json.JsValue


class SocketHandler(userId: UserId, out: ActorRef, sessionManager: ActorRef) extends Actor with ActorLogging with Stash {
  this: JsonSocketHelper =>

  import SocketProtocol._
  def receive = {
    case HereIsYourSession(sessionRef) =>
      unstashAll()
      context.watch(sessionRef)
      context.become({
        case json: JsValue =>
          fromJson(json) match {
            case Some(uc: UserCommand) => sessionRef ! uc
            case _ => out ! wrapUnknown(json)
          }

        case se: ServerEvent =>
          out ! toJson(se)

        case Terminated(session) => sessionManager ! SessionManager.UserConnected(userId)
      })

    case msg => stash()
  }

  override def preStart() = {
    sessionManager ! SessionManager.UserConnected(userId)
  }
}

object SocketHandler {
  def props(userId: UserId, out: ActorRef, sessionManager: ActorRef) =
    Props(new SocketHandler(userId, out, sessionManager) with PlayJsonSocketHelper)

  case class HereIsYourSession(session: ActorRef)
}