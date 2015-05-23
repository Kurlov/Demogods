package actors

import actors.gameFinding.GameFinder
import actors.session.SessionManager
import play.api.libs.concurrent.Akka
import play.api.Play.current

object Actors {
  val gameFinder = Akka.system.actorOf(GameFinder.props(), GameFinder.name)
  val sessionManager = Akka.system.actorOf(SessionManager.props(gameFinder), SessionManager.name)
}
