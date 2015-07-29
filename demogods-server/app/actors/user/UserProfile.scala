package actors.user


import akka.persistence.PersistentActor

class UserProfile extends PersistentActor {
  import UserProfile._

  override def persistenceId: String = self.path.parent.name + "-" + self.path.name

  var state = State(name = "Player", rating = 0)

  override def receiveCommand: Receive = {
    case ChangeRating(amount) => persist(RatingChanged(amount))(updateState)
    case ChangeName(newName) => persist(NameChanged(newName))(updateState)

    case GetName => sender() ! Name(state.name)
    case GetRating => sender() ! Rating(state.rating)
  }

  override def receiveRecover: Receive = {
    case e: Event => updateState(e)
  }

  def updateState(e: Event): Unit = state = state.updated(e)

}

object UserProfile {
  case class State(name: String,
                   rating: Int) {
    def updated(e: Event) = e match {
      case NameChanged(newName) => copy(name = newName)
      case RatingChanged(amount) => copy(rating = (rating + amount) max 0)
    }
  }

  sealed trait Event
  case class NameChanged(newName: String) extends Event
  case class RatingChanged(amount: Int) extends Event

  case class ChangeName(newName: String)
  case class ChangeRating(amount: Int)

  case object GetName
  case class Name(name: String)

  case object GetRating
  case class Rating(amount: Int)
}