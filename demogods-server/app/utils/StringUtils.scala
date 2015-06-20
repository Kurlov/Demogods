package utils

import java.util.UUID

object StringUtils {
  implicit class StringOps(val s: String) extends AnyVal {
    def asUUID: UUID = UUID.fromString(s)
  }
}

