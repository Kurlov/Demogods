package actors.session

import akka.actor.{Props, ActorRef, Actor}
import models.user.UserId

class SessionManager(gameFinder: ActorRef) extends Actor {
  import SessionManager._

  def receive = {
    case UserConnected(userId) =>
      val socket = sender()
      val session = context.child(sessionName(userId)) getOrElse
        context.actorOf(UserSession.props(userId, gameFinder), sessionName(userId))
      completeConnection(socket, session)
  }

  private def completeConnection(socket: ActorRef, session: ActorRef) = {
    session ! UserSession.SocketConnected(socket)
    socket ! SocketHandler.HereIsYourSession(session)
  }

  private def sessionName(userId: UserId): String = s"session-$userId"
}

object SessionManager {
  case class UserDisconnected(userId: UserId)
  case class UserConnected(userId: UserId)
  def props(gameFinder: ActorRef) = Props(classOf[SessionManager], gameFinder)
  val name = "sessionManger"
}
