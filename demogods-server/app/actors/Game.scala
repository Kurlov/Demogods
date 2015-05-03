package actors

import akka.actor._
import scala.util.Random


class Game(player1uuid: String, player2uuid: String, matchId: String) extends Actor {

  def receive = if (Random.nextBoolean()) {
    player1turn
  } else {
    player2turn
  }

  def player1turn: Receive = {
    ???
  }

  def player2turn: Receive = {
    ???
  }
}

object Game {

  case class GetStateForUser(userId: String)

  def props(player1uuid: String, player2uuid: String, matchId: String) =
    Props(new Game(player1uuid, player2uuid, matchId))
}
