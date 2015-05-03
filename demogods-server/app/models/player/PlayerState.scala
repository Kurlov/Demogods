package models.player

import models.cards.{CreatureCard, Card}
import models.creatures.Creature
import play.api.libs.json.Json

case class PlayerState(activeCards: Seq[Card], creatures: Seq[Creature], remainingCards: Seq[Card])


object PlayerState {
  def mock = {
    val activeCards = Seq(CreatureCard("uuid","name","description",1,2,3))
    val creatures = Seq(Creature("uuid", "cardId", 1,2))
    PlayerState(activeCards,creatures,activeCards)
  }
}