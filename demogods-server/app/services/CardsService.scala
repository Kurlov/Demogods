package services

import java.util.UUID

import com.typesafe.config.ConfigFactory
import models.cards._
import play.api.libs.json._
import scala.io.{Codec, Source}
import java.io.File

object CardsService {
  private val conf = ConfigFactory.load
  private val cardsPath = conf.getString("cards-directory")
  private val cardsFiles = new File(s"$cardsPath/data").listFiles().toSeq

  private implicit val creatureCardReads = Json.reads[CreatureCard]

  private implicit val cardReads: Reads[Card] = {
    (__ \ "type").read[String].flatMap[Card] {
      case "creature" => __.read[CreatureCard].asInstanceOf[Reads[Card]]
    }
  }
  private val cards = cardsFiles.map{f =>
    val card = Json.parse(Source.fromFile(f)(Codec.UTF8).mkString).validate[CreatureCard]
      .getOrElse(throw new Exception(s"Can't parse card file ${f.getName}"))
    card.uuid -> card
  }.toMap

  def listCards = cards.values

  def findCardById(id: UUID): Option[Card] = cards.get(id)
}
