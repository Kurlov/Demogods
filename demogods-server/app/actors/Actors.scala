package actors

import play.api.libs.concurrent.Akka
import play.api.Play.current

object Actors {
  val gameFinder = Akka.system.actorOf(MatchMaker.props(), MatchMaker.name)
}
