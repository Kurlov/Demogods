package models.creatures

import java.util.UUID


case class Creature(id: UUID,
                    cardId: UUID,
                    attack: Int,
                    hp: Int)
