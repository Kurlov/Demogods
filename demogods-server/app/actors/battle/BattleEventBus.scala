package actors.battle

import java.util.UUID

import akka.actor.ActorRef
import akka.event.EventBus
import akka.util.Subclassification

case class MsgEnvelope(battleId: UUID, payload: AnyRef)
case class BattleBusClassifier(battleId: UUID, clazz: Class[_])

class StartsWithSubclassification extends Subclassification[BattleBusClassifier] {
  override def isEqual(x: BattleBusClassifier, y: BattleBusClassifier): Boolean =
    x == y

  override def isSubclass(x: BattleBusClassifier, y: BattleBusClassifier): Boolean =
    x.battleId == y.battleId && y.clazz.isAssignableFrom(x.clazz)
}

import akka.event.SubchannelClassification

/**
 * Publishes the payload of the MsgEnvelope when the topic of the
 * MsgEnvelope starts with the String specified when subscribing.
 */
class BattleEventBus extends EventBus with SubchannelClassification {
  type Event = MsgEnvelope
  type Classifier = BattleBusClassifier
  type Subscriber = ActorRef

  // Subclassification is an object providing `isEqual` and `isSubclass`
  // to be consumed by the other methods of this classifier
  override protected val subclassification: Subclassification[Classifier] =
    new StartsWithSubclassification

  // is used for extracting the classifier from the incoming events
  override protected def classify(event: Event): Classifier =
    BattleBusClassifier(event.battleId, event.payload.getClass)

  // will be invoked for each event for all subscribers which registered
  // themselves for the event’s classifier
  override protected def publish(event: Event, subscriber: Subscriber): Unit = {
    subscriber ! event.payload
  }
}



object BattleEventBus extends BattleEventBus