package models.creatures

import play.api.libs.json.Json


case class Creature(uuid: String,
                    cardId: String,
                    attack: Int,
                    hp: Int)

object Creature {
  implicit val creatureFormat = Json.format[Creature]
}
