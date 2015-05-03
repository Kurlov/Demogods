package actors.matchMaking

import java.util.UUID

import actors.Match
import UserMatchFinder.{FindMeAMatch, MatchFound}
import akka.actor._



class MatchMaker extends Actor{

  type UserId = String

  var waitingUsers = Map[ActorRef, UserId]()

  def receive = {
    case FindMeAMatch(userId) =>
      if (waitingUsers.isEmpty) {
        waitingUsers += (context.watch(sender()) -> userId)
      } else {
        val user1 = waitingUsers.head
        val user2 = sender() -> userId
        createMatch(user1, user2)
      }
    case Terminated(ref) => waitingUsers -= ref
  }

  def createMatch(user1: (ActorRef, String), user2: (ActorRef, String)): Unit = {
    val players = Seq(user1._1, user2._1)
    val matchId = UUID.randomUUID().toString
    players.foreach(_ ! MatchFound(matchId))
    context.actorOf(Match.props(user1._2, user2._2, matchId), matchId)
  }
}

object MatchMaker {

  val name = "matchMaker"

  def props() = Props(new MatchMaker)
}
