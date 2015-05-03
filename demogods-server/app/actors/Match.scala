package actors

import akka.actor._
import models.cards.Card
import models.creatures.Creature
import scala.util.Random
import models.player.PlayerState

class Match(player1uuid: String, player2uuid: String, matchId: String) extends Actor {
  import Match._

  type UserId = String

  //var gameState = Map[UserId, PlayerState]()
  var gameState = Map(player1uuid -> PlayerState.mock, player2uuid -> PlayerState.mock)


  def receive = if (Random.nextBoolean()) {
    playerTurn(player1uuid)
  } else {
    playerTurn(player2uuid)
  }

  def playerTurn(playerId: String): Receive = {
    case GetStateForUser(userId) =>
        sender() ! gameState(userId)
  }

}

object Match {
  case class GetStateForUser(userId: String)
  case object NotYourTurn

  def props(player1uuid: String, player2uuid: String, matchId: String) =
    Props(new Match(player1uuid, player2uuid, matchId))
}
