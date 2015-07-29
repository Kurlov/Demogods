package actors.gameFinding

import java.util.UUID
import actors.battle.Battle
import akka.actor._
import models.user.UserId


class GameFinder extends Actor {
  import GameFinder._

  var waitingUsers = Map[ActorRef, UserId]()

  def receive = {
    case FindGame(userId) =>
      if (waitingUsers.isEmpty) {
        waitingUsers += (context.watch(sender()) -> userId)
      } else {
        val user1 = waitingUsers.head
        val user2 = sender() -> userId
        createMatch(user1, user2)
      }
    case Terminated(ref) => waitingUsers -= ref
  }

  def createMatch(user1: (ActorRef, UserId), user2: (ActorRef, UserId)): Unit = {
    val name = "foo"
    val players = Seq(user1._1, user2._1)
    val matchId = UUID.randomUUID().toString
    val game = context.actorOf(Battle.props(user1._1, user2._1), matchId)
    players.foreach(_ ! GameFound(game, name))
  }
}

object GameFinder {
  case class FindGame(userId: UserId)
  case class GameFound(ref: ActorRef, enemyName: String)

  def props() = Props(new GameFinder)

  val name = "gameFinder"

}
