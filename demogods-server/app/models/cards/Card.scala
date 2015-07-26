package models.cards

import java.util.UUID


sealed trait Card {
  def uuid: UUID
  def cost: Int
}

case class CreatureCard(uuid: UUID,
                        name: String,
                        description: String,
                        damage: Int,
                        health: Int,
                        cost: Int) extends Card