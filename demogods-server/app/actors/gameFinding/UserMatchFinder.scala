package actors.gameFinding

import akka.actor._
import models.user.UserId
import play.api.libs.json.Json

class UserMatchFinder(userId: UserId, out: ActorRef, matchMaker: ActorRef) extends Actor {

  import UserMatchFinder._

  implicit val ec = context.system.dispatcher

  override def preStart() = {
    //matchMaker ! FindGame(userId)
  }

  def receive = {
    //case gf: GameFound => out ! Json.toJson(gf)(matchFoundFormat)
    case _ =>
  }
}

object UserMatchFinder {
  def props(userId: UserId, out: ActorRef, matchMaker: ActorRef) =
    Props(new UserMatchFinder(userId, out, matchMaker))

  //implicit val matchFoundFormat = Json.format[GameFound]

}