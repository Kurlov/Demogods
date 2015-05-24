package actors.session

import akka.actor.{ActorRefFactory, Props, ActorRef, Actor}
import models.user.UserId

class SessionManager(sessionMaker: (ActorRefFactory, UserId, UserId => String) => ActorRef) extends Actor {
  import SessionManager._

  def receive = {
    case UserConnected(userId) =>
      val socket = sender()
      val session = context.child(sessionName(userId)) getOrElse
        sessionMaker(context, userId, sessionName)
      completeConnection(socket, session)
  }

  private def completeConnection(socket: ActorRef, session: ActorRef) = {
    session ! UserSession.SocketConnected(socket)
    socket ! SocketHandler.HereIsYourSession(session)
  }

  def sessionName(userId: UserId): String = s"session-$userId"
}

object SessionManager {
  case class UserDisconnected(userId: UserId)
  case class UserConnected(userId: UserId)
  def props(sessionMaker: (ActorRefFactory, UserId, UserId => String) => ActorRef) = Props(classOf[SessionManager], sessionMaker)
  val name = "sessionManger"
}
