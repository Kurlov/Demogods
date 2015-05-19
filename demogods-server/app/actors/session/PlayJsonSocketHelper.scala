package actors.session

import play.api.libs.json._

trait PlayJsonSocketHelper extends JsonSocketHelper {
  import SocketProtocol._

  private implicit val ThrowCardFormat = Json.format[ThrowCard]
  private implicit val GameFoundFormat = Json.format[GameFound]
  private implicit val ApplyCreatureFormat = Json.format[ApplyCreature]
  private implicit val FirstPlayerSelectedFormat = Json.format[FirstPlayerSelected]
  private implicit val CardPulledFormat = Json.format[CardPulled]
  private implicit val EnemyCardThrownFormat = Json.format[EnemyCardThrown]
  private implicit val EnemyCreatureAppliedFormat = Json.format[EnemyCreatureApplied]

  private def readDataToWSM[T : Reads]: Reads[WebSocketMessage] =
    (__ \ "data").read[T].asInstanceOf[Reads[WebSocketMessage]]

  private implicit val wsmReads: Reads[WebSocketMessage] = {
    import Reads.pure
    (__ \ "type").read[String].flatMap[WebSocketMessage] {
      case "FindGame" => pure(FindGame)
      case "ExitGame" => pure(ExitGame)
      case "ThrowCard" => readDataToWSM[ThrowCard]
      case "ApplyCreature" => readDataToWSM[ApplyCreature]
      case "FinishTurn" => pure(FinishTurn)
      case "GameFound" => readDataToWSM[GameFound]
      case "GamePaused" => pure(GamePaused)
      case "GameResumed" => pure(GameResumed)
      case "GameFinished" => pure(GameFinished)
      case "FirstPlayerSelected" => readDataToWSM[FirstPlayerSelected]
      case "CardPulled" => readDataToWSM[CardPulled]
      case "EnemyCardThrown" => readDataToWSM[EnemyCardThrown]
      case "EnemyCreatureApplied" => readDataToWSM[EnemyCreatureApplied]
      case "EnemyCardPulled" => pure(EnemyCardPulled)
      case "EnemyTurnFinished" => pure(EnemyTurnFinished)
      case "EnemyDisconnected" => pure(EnemyDisconnected)
    }
  }

  private def objWrites(typeName: String): JsValue = Json.obj("type" -> typeName)
  private def classWrites[T : Writes](data: T) = Json.obj("type" -> data.getClass.getSimpleName, "data" -> data)

  private implicit val wsmWrites = new Writes[WebSocketMessage] {
    def writes(wsm: WebSocketMessage) = wsm match {
      case FindGame => objWrites("FindGame")
      case ExitGame => objWrites("ExitGame")
      case tc: ThrowCard => classWrites(tc)
      case ac: ApplyCreature => classWrites(ac)
      case FinishTurn => objWrites("FinishTurn")
      case gf: GameFound => classWrites(gf)
      case GamePaused => objWrites("GamePaused")
      case GameResumed => objWrites("GameResumed")
      case GameFinished => objWrites("GameFinished")
      case fps: FirstPlayerSelected => classWrites(fps)
      case cp: CardPulled => classWrites(cp)
      case ect: EnemyCardThrown => classWrites(ect)
      case eca: EnemyCreatureApplied => classWrites(eca)
      case EnemyCardPulled => objWrites("EnemyCardPulled")
      case EnemyTurnFinished => objWrites("EnemyTurnFinished")
      case EnemyDisconnected => objWrites("EnemyDisconnected")
    }
  }

  override def fromJson(json: JsValue): Option[WebSocketMessage] = json.validate[WebSocketMessage].asOpt

  override def toJson(wsm: WebSocketMessage): JsValue = Json.toJson(wsm)

  def wrapUnknown(json: JsValue): JsValue = Json.toJson(Map("unknown json" -> json))

}