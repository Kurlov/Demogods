package actors.battle

import akka.actor.{ActorRef, Actor}


trait PubSub {
  def subscribe(subscriber: ActorRef, channel: Class[_])(implicit context: BattleContext) =
    BattleEventBus.subscribe(subscriber, BattleBusClassifier(context.battleId, channel))
  def publish(msg: AnyRef)(implicit context: BattleContext) =
    BattleEventBus.publish(MsgEnvelope(context.battleId, msg))
  def unsubscribe(subscriber: ActorRef, channel: Class[_])(implicit context: BattleContext) =
    BattleEventBus.unsubscribe(subscriber, BattleBusClassifier(context.battleId, channel))
  def unsubscribe(subscriber: ActorRef) =
    BattleEventBus.unsubscribe(subscriber)
}
