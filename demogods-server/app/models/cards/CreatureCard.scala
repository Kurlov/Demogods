package models.cards

import play.api.libs.json.Json


case class CreatureCard(uuid: String,
                        name: String,
                        description: String,
                        attack: Int,
                        health: Int,
                        cost: Int) extends Card

case object CreatureCard {
  implicit val creatureCardFormat = Json.format[CreatureCard]
}