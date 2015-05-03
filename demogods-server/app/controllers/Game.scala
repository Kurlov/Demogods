package controllers

import actors.Match.GetStateForUser
import actors.matchMaking.MatchMaker
import akka.util.Timeout
import models.cards.CreatureCard
import models.creatures.Creature
import play.api.libs.json.{JsError, Json}
import play.api.mvc._
import play.api.libs.concurrent.Akka
import scala.concurrent.Future
import scala.concurrent.duration._
import play.api.Play.current
import akka.pattern.ask
import models.player.PlayerState

object Game extends Controller {
  implicit val pstFormat = Json.format[PlayerStateJson]


  def showGame = Action.async(BodyParsers.parse.json) { implicit rq =>


    implicit val showGameFmt = Json.format[ShowGame]

    val parsed = rq.body.validate[ShowGame]


    def getGameState(userId: String, matchId: String): Future[Result] = {
      implicit val ec = Akka.system.dispatcher
      Akka.system.actorSelection(s"/user/${MatchMaker.name}/$matchId").resolveOne(100 millis) flatMap { ref =>
        implicit val timeout = Timeout(1.second)
        (ref ? GetStateForUser(userId)).mapTo[PlayerState] map { ps =>
          val pst = PlayerStateJson(
            userId,
            ps.creatures,
            ps.activeCards.map(_.asInstanceOf[CreatureCard]),
            ps.remainingCards.length)
          val json = Json.toJson(pst)
          Ok(json)
        }
      }
    }

    parsed.fold(
      errors => {
        Future.successful(
          BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toFlatJson(errors)))
        )
      },
      sg => {
        getGameState(sg.userId, sg.matchId)
      }
    )
  }
}

case class PlayerStateJson(userId: String, creatures: Seq[Creature], cards: Seq[CreatureCard], remainingCards: Int)

case class ShowGame(matchId: String, userId: String)
