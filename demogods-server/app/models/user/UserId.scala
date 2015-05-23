package models.user

import java.util.UUID

case class UserId(id: UUID) {
  override def toString = s"user-${id.toString}"
}
