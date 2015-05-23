package models.cards

import java.util.UUID


case class CreatureCard(id: UUID,
                        name: String,
                        description: String,
                        damage: Int,
                        health: Int,
                        cost: Int) extends Card