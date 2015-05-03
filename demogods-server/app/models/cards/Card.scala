package models.cards

import play.api.libs.json.{Format, Json}


trait Card {
  def uuid: String
}