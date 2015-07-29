package actors.session

import java.util.UUID

import actors.session.PlayJsonSocketHelper
import actors.session.SocketProtocol._
import org.scalatest._

class SocketProtocolSpec extends FlatSpec with Matchers {

  val socketHelper = new PlayJsonSocketHelper {}

  def test(wsm: WebSocketMessage) = assert(wsm == socketHelper.fromJson(socketHelper.toJson(wsm)).get)


  "PlayJsonSocketHelper" should "correctly serialize FindBattle" in {
    test(FindBattle)
  }

  it should "correctly serialize ExitBattle" in {
    test(ExitBattle)
  }

  it should "correctly serialize JoinBattle" in {
    test(JoinBattle)
  }

  it should "correctly serialize ActivateCard" in {
    test(ActivateCard(UUID.randomUUID()))
  }

  it should "correctly serialize ApplyCreature" in {
    test(AttackCreature(UUID.randomUUID(), UUID.randomUUID()))
  }
  it should "correctly serialize AttackPlayerByCreature" in {
    test(AttackHeroByCreature(UUID.randomUUID()))
  }

  it should "correctly serialize FinishTurn" in {
    test(FinishTurn)
  }

  it should "correctly serialize BattleFound" in {
    test(BattleFound("foo"))
  }

  it should "correctly serialize BattlePaused" in {
    test(BattlePaused)
  }

  it should "correctly serialize BattleResumed" in {
    test(BattleResumed)
  }

  it should "correctly serialize BattleFinished" in {
    test(BattleFinished)
  }

  it should "correctly serialize FirstPlayerSelected" in {
    test(FirstPlayerSelected(UUID.randomUUID()))
  }

  it should "correctly serialize CardPulled" in {
    test(CardPulled(UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCardActivated" in {
    test(EnemyCardActivated(UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCreatureApplied" in {
    test(EnemyCreatureApplied(UUID.randomUUID(), UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCardPulled" in {
    test(EnemyCardPulled)
  }

  it should "correctly serialize EnemyTurnFinished" in {
    test(EnemyTurnFinished)
  }

  it should "correctly serialize EnemyDisconnected" in {
    test(EnemyDisconnected)
  }

  it should "correctly serialize CreatureRaised" in {
    test(CreatureRaised(UUID.randomUUID(), UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCreatureRaised" in {
    test(EnemyCreatureRaised(UUID.randomUUID(), UUID.randomUUID()))
  }

}
