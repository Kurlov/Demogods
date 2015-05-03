package actors

import actors.matchMaking.MatchMaker
import play.api.libs.concurrent.Akka
import play.api.Play.current

object Actors {
  val matchMaker = Akka.system.actorOf(MatchMaker.props(), MatchMaker.name)
}
