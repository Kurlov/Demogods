package actors.session

import actors.messages.{UserDisconnected, UserConnected}
import akka.actor.{Props, Terminated, ActorRef, Actor}
import models.user.UserId

class SessionManager(gameFinder: ActorRef) extends Actor {

  override def receive = waitingConnections(Map.empty)

  def waitingConnections(waitingReconnection: Map[UserId, ActorRef]): Receive = {
    case UserConnected(userId) =>
      waitingReconnection get userId match {
        case Some(session) =>
          completeConnection(socket = sender(), session)
          context become waitingConnections(waitingReconnection - userId)
        case None =>
          val session = context.watch(context.actorOf(UserSession.props(userId, gameFinder)))
          val socket = context.sender()
          completeConnection(socket, session)
      }
    case UserDisconnected(userId) =>
      context become waitingConnections(waitingReconnection + (userId -> sender()))

    case Terminated(sessionRef) =>
      waitingReconnection find (_._2 == sessionRef) foreach { case (userId, _) =>
        context become waitingConnections(waitingReconnection - userId)
      }
  }

  private def completeConnection(socket: ActorRef, session: ActorRef) = {
    session ! UserSession.SocketConnected(socket)
    socket ! SocketActor.HereIsYourSession(session)
  }
}

object SessionManager {
  def props(gameFinder: ActorRef) = Props(classOf[SessionManager], gameFinder)
}
