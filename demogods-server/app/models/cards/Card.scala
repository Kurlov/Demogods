package models.cards

import java.util.UUID


sealed trait Card {
  def id: UUID
  def cost: Int
}

case class CreatureCard(id: UUID,
                        name: String,
                        description: String,
                        damage: Int,
                        health: Int,
                        cost: Int) extends Card