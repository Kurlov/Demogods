package actors

import actors.gameFinding.GameFinder
import actors.session.{UserSession, SessionManager}
import akka.actor.{Props, ActorRefFactory}
import models.user.UserId
import play.api.libs.concurrent.Akka
import play.api.Play.current

object Actors {
  val gameFinder = Akka.system.actorOf(GameFinder.props(), GameFinder.name)
  val sessionMaker = (f: ActorRefFactory,
                      userId: UserId,
                      nameFunc: UserId => String) =>
    f.actorOf(UserSession.props(userId, gameFinder), nameFunc(userId))
  val sessionManager = Akka.system.actorOf(SessionManager.props(sessionMaker), SessionManager.name)
}
