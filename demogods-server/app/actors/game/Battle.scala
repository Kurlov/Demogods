package actors.game

import akka.actor._

import scala.util.Random

class Battle(player1uuid: String, player2uuid: String, matchId: String) extends Actor {
  import Battle._

  type UserId = String

  //var gameState = Map[UserId, PlayerState]()
//  var gameState = Map(player1uuid -> PlayerState.mock, player2uuid -> PlayerState.mock)


  def receive = if (Random.nextBoolean()) {
    playerTurn(player1uuid)
  } else {
    playerTurn(player2uuid)
  }

  def playerTurn(playerId: String): Receive = {
    case GetStateForUser(userId) =>
//        sender() ! gameState(userId)
  }

}

object Battle {
  case class GetStateForUser(userId: String)
  case object NotYourTurn

  def props(player1uuid: String, player2uuid: String, matchId: String) =
    Props(new Battle(player1uuid, player2uuid, matchId))
}
