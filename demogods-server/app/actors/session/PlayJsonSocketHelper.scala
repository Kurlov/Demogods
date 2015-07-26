package actors.session

import play.api.libs.json._

trait PlayJsonSocketHelper extends JsonSocketHelper {
  import SocketProtocol._

  private implicit val ActivateCardFormat = Json.format[ActivateCard]
  private implicit val BattleFoundFormat = Json.format[BattleFound]
  private implicit val ApplyCreatureFormat = Json.format[AttackCreature]
  private implicit val FirstPlayerSelectedFormat = Json.format[FirstPlayerSelected]
  private implicit val CardPulledFormat = Json.format[CardPulled]
  private implicit val EnemyCardActivatedFormat = Json.format[EnemyCardActivated]
  private implicit val EnemyCreatureAppliedFormat = Json.format[EnemyCreatureApplied]
  private implicit val CreatureRaisedFormat = Json.format[CreatureRaised]
  private implicit val EnemyCreatureRaisedFormat = Json.format[EnemyCreatureRaised]
  private implicit val AttackHeroByCreatureFormat = Json.format[AttackHeroByCreature]

  private def readDataToWSM[T : Reads]: Reads[WebSocketMessage] =
    (__ \ "data").read[T].asInstanceOf[Reads[WebSocketMessage]]

  private implicit val wsmReads: Reads[WebSocketMessage] = {
    import Reads.pure
    (__ \ "type").read[String].flatMap[WebSocketMessage] {
      case "FindBattle" => pure(FindBattle)
      case "JoinBattle" => pure(JoinBattle)
      case "ExitBattle" => pure(ExitBattle)
      case "ActivateCard" => readDataToWSM[ActivateCard]
      case "AttackCreature" => readDataToWSM[AttackCreature]
      case "FinishTurn" => pure(FinishTurn)
      case "BattleFound" => readDataToWSM[BattleFound]
      case "BattlePaused" => pure(BattlePaused)
      case "BattleResumed" => pure(BattleResumed)
      case "BattleFinished" => pure(BattleFinished)
      case "FirstPlayerSelected" => readDataToWSM[FirstPlayerSelected]
      case "CardPulled" => readDataToWSM[CardPulled]
      case "EnemyCardActivated" => readDataToWSM[EnemyCardActivated]
      case "EnemyCreatureApplied" => readDataToWSM[EnemyCreatureApplied]
      case "EnemyCardPulled" => pure(EnemyCardPulled)
      case "EnemyTurnFinished" => pure(EnemyTurnFinished)
      case "EnemyDisconnected" => pure(EnemyDisconnected)
      case "CreatureRaised" => readDataToWSM[CreatureRaised]
      case "EnemyCreatureRaised" => readDataToWSM[EnemyCreatureRaised]
    }
  }

  private def objWrites(typeName: String): JsValue = Json.obj("type" -> typeName)
  private def classWrites[T : Writes](data: T) = Json.obj("type" -> data.getClass.getSimpleName, "data" -> data)

  private implicit val wsmWrites = new Writes[WebSocketMessage] {
    def writes(wsm: WebSocketMessage) = wsm match {
      case FindBattle => objWrites("FindGame")
      case JoinBattle => objWrites("StartGame")
      case ExitBattle => objWrites("ExitGame")
      case tc: ActivateCard => classWrites(tc)
      case ac: AttackCreature => classWrites(ac)
      case ap: AttackHeroByCreature => classWrites(ap)
      case FinishTurn => objWrites("FinishTurn")
      case gf: BattleFound => classWrites(gf)
      case BattlePaused => objWrites("BattlePaused")
      case BattleResumed => objWrites("GameResumed")
      case BattleFinished => objWrites("GameFinished")
      case fps: FirstPlayerSelected => classWrites(fps)
      case cp: CardPulled => classWrites(cp)
      case ect: EnemyCardActivated => classWrites(ect)
      case eca: EnemyCreatureApplied => classWrites(eca)
      case EnemyCardPulled => objWrites("EnemyCardPulled")
      case EnemyTurnFinished => objWrites("EnemyTurnFinished")
      case EnemyDisconnected => objWrites("EnemyDisconnected")
      case cr: CreatureRaised => classWrites(cr)
      case ecr: EnemyCreatureRaised => classWrites(ecr)
    }
  }

  override def fromJson(json: JsValue): Option[WebSocketMessage] = json.validate[WebSocketMessage].asOpt

  override def toJson(wsm: WebSocketMessage): JsValue = Json.toJson(wsm)

  def wrapUnknown(json: JsValue): JsValue = Json.toJson(Map("unknown json" -> json))

}