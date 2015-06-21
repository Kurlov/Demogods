package actors.battle

import java.util.UUID

import akka.actor._
import models.cards.CreatureCard
import CreatureEvents._

import scala.util.Try

class Creature(card: CreatureCard)(implicit battleContext: BattleContext)
  extends FSM[Creature.State, Creature.Data] with PubSub {

  import Creature._
  import BattleLogic._

  require(Try(UUID.fromString(self.path.name)).toOption.nonEmpty, "name must be a valid UUID")

  publish(CreatureRaised(card, self))

  startWith(State.Inactive, Data.Stats(hp = card.health, attack = card.damage))

  when(State.Inactive) {
    case Event(Commands.WakeUp, _) =>
      goto(State.Active)
    case Event(IncomingAttack(damage), s: Data.Stats) => withHpCheck {
      stay using attacked(damage, s)
    }
  }

  when(State.Active) {
    case Event(Commands.AttackTarget(target), s: Data.Stats) => withHpCheck {
      publish(CreatureAttacked(self.path, target))
      context.actorSelection(target) ! IncomingAttack(s.attack)
      goto(State.Inactive)
    }

    case Event(IncomingAttack(damage), s: Data.Stats) => withHpCheck {
      stay using attacked(damage, s) replying Counterattack(s.attack)
    }
  }

  when(State.Dead) {
    //ignore because dead
    case Event(Counterattack(damage), _) =>
      stay
  }

  whenUnhandled {
    case Event(Counterattack(damage), s: Data.Stats) => withHpCheck {
      stay using attacked(damage, s)
    }
  }

  onTransition {
    case _ -> State.Dead =>
      publish(CreatureDied(self))
  }

  initialize()

  def attacked(damage: Int, s: Data.Stats) = {
    publish(CreatureDamaged(self, damage))
    s.copy(hp = s.hp - damage)
  }

  def withHpCheck(block: => State): State = {
    val state = block
    state.stateData match {
      case s: Data.Stats if s.hp <= 0 =>
        state.copy(stateName = State.Dead)
      case _ => state
    }
  }
}

object Creature {

  sealed trait State
  private[battle] object State {
    case object Inactive extends State
    case object Active extends State
    case object Dead extends State
  }

  sealed trait Data
  private[battle] object Data {
    case class Stats(hp: Int, attack: Int, extraAttacks: Int = 0) extends Data
  }

  object Commands {
    case object WakeUp
    case class AttackTarget(target: ActorPath)
  }

  def props(card: CreatureCard, battle: ActorRef)(implicit battleContext: BattleContext) =
    Props(new Creature(card)(battleContext))

}