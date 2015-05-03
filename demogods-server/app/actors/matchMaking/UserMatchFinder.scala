package actors.matchMaking

import akka.actor._
import play.api.libs.json.Json

class UserMatchFinder(userId: String, out: ActorRef, matchMaker: ActorRef) extends Actor {

  import UserMatchFinder._

  implicit val ec = context.system.dispatcher

  override def preStart() = {
    matchMaker ! FindMeAMatch(userId)
  }

  def receive = {
    case gf: MatchFound => out ! Json.toJson(gf)(matchFoundFormat)
  }
}

object UserMatchFinder {
  def props(userId: String, out: ActorRef, matchMaker: ActorRef) =
    Props(new UserMatchFinder(userId, out, matchMaker))

  case class MatchFound(matchId: String)
  implicit val matchFoundFormat = Json.format[MatchFound]

  case class FindMeAMatch(userId: String)
}