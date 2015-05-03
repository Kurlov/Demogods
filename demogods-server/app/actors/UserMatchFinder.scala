package actors

import java.util.UUID

import akka.actor._
import play.api.libs.json.{Json, JsValue}
import scala.concurrent.duration._

class UserMatchFinder(userId: String, out: ActorRef, gameFinder: ActorRef) extends Actor {

  import UserMatchFinder._

  implicit val ec = context.system.dispatcher

  override def preStart() = {
    gameFinder ! FindMeAMatch(userId)
  }

  def receive = {
    case gf: GameFound => out ! Json.toJson(gf)(matchFoundFormat)
  }
}

object UserMatchFinder {
  def props(userId: String, out: ActorRef, gameFinder: ActorRef) =
    Props(new UserMatchFinder(userId, out, gameFinder))

  case class GameFound(matchId: String)
  implicit val matchFoundFormat = Json.format[GameFound]

  case class FindMeAMatch(userId: String)
}