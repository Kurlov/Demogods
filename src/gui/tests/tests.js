var gui = new GUI();

QUnit.module("Playing elements");
QUnit.test( "Playing Element creating", function( assert ) {
  assert.ok( new PlayingElement('test', 'test.png', 0, 0) instanceof PlayingElement);
});

QUnit.test( "Card creating", function( assert ) {
  assert.ok( new Card('test', 'test.png', 0, 0) instanceof Card);
});

QUnit.test( "Monster creating", function( assert ) {
  assert.ok( new Monster('test', 'test.png', 0, 0) instanceof Monster);
});

QUnit.test( "Player creating", function( assert ) {
  assert.ok( new Player('test', 'test.png', 0, 0) instanceof Player);
});

QUnit.test( "attack", function( assert ) {
    var item1 = new Card('test_attack', 'tests/energy_ball.png', 500, 0);
    var item2 = new Card('test_attack2', 'tests/energy_ball.png', 500, 0);
    assert.ok(item1.attack(item2) instanceof Phaser.Tween );
});

QUnit.test( "getBounds", function( assert ) {
    var item1 = new Card('test_attack', 'tests/energy_ball.png', 500, 0);
    assert.ok(item1.getBounds() instanceof Phaser.Rectangle );
});

QUnit.test( "savePosition", function( assert ) {
    var item1 = new Card('test_attack', 'tests/energy_ball.png', 300, 0);
    item1.savePosition();
    assert.ok((item1._prevX == 300) && (item1._prevY == 0));
});

QUnit.test( "restorePosition", function( assert ) {
    var item1 = new Card('test_attack', 'tests/energy_ball.png', 300, 0);
    item1.savePosition();
    item1._sprite.x = 1000;
    item1._sprite.y = 1000;
    item1.restorePosition();
    assert.ok((item1._sprite.x == 300) && (item1._sprite.y == 0));
});

QUnit.test( "Monster.setHealth()", function( assert ) {
    item = new Monster('test', 'test.png', 0, 0);
    item.setHealth(120);
    assert.ok(item._health.text == 120);
});

QUnit.test( "Monster.update()", function( assert ) {
    item = new Monster('test', 'test.png', 0, 0);
    item._sprite.x = 200;
    item._sprite.y = 200;
    item.update();
    assert.ok((item._health.x == 200) && (item._health.y == 200));
});

QUnit.test( "Player.setHealth()", function( assert ) {
    item = new Player('test', 'test.png', 0, 0);
    item.setHealth(120);
    assert.ok(item._health.text == 120);
});

QUnit.module("Table zones");
QUnit.test( "TableZone creating", function( assert ) {
    assert.ok( new TableZone('test.png') instanceof TableZone);
});

QUnit.test( "PlayerDeck creating", function( assert ) {
    assert.ok( new PlayerDeck('test.png', true) instanceof PlayerDeck);
});

QUnit.test( "PlayingArea creating", function( assert ) {
    assert.ok( new PlayingArea('test.png', 0, 0) instanceof PlayingArea);
});

QUnit.test( "TableZone.addItem()", function( assert ) {
    var zone = new TableZone('test.png');
    var playingElement = zone.addItem('pe_test', 'test.png');
    assert.ok(playingElement instanceof PlayingElement);
    assert.ok(playingElement._id = 'pe_test');
});

QUnit.test( "TableZone.deleteItem()", function( assert ) {
    var zone = new TableZone('test.png');
    zone.addItem('pe_test2', 'test.png');
    zone.deleteItem('pe_test2');
    var index = -1;
    for (var i = 0; i < zone._items.length; i++) {
        if (zone._items[i]._id == 'pe_test2') {
            index = i;
        }
    }
    assert.ok(index == -1);
});

QUnit.test("TableZone.getItemIndex()", function(assert) {
    var zone = new TableZone('test.png');
    zone.addItem('T1', 'test.png');
    zone.addItem('T2', 'test.png');
    assert.ok(zone.getItemIndex("T2") == 1);
});

QUnit.test("TableZone.getItem()", function(assert) {
    var zone = new TableZone('test.png');
    zone.addItem('GI1', 'test.png');
    zone.addItem('GI2', 'test.png');
    assert.ok(zone.getItem("GI1") instanceof PlayingElement);
});


QUnit.test("TableZone.moveToPosition()", function(assert) {
    var zone = new TableZone('test.png');
    zone.addItem('TZ1', 'test.png');
    zone.addItem('TZ2', 'test.png');
    zone.addItem('TZ3', 'test.png');
    zone.moveToPosition("TZ3", 0);
    assert.ok(zone._items[0]._id == "TZ3");
});

QUnit.test( "PlayerDeck.addItem()", function( assert ) {
    var zone = new PlayerDeck('test.png', true);
    var playingElement = zone.addItem('pe_test3', 'test.png');
    assert.ok(playingElement instanceof Card);
    assert.ok(playingElement._id = 'pe_test3');
});

QUnit.test( "PlayingArea.addItem()", function( assert ) {
    var zone = new PlayingArea('test.png', 0, 0);
    var playingElement = zone.addItem('pe_test4', 'test.png', 95);
    assert.ok(playingElement instanceof Monster);
    assert.ok(playingElement._id = 'pe_test4');
    assert.ok(playingElement._health.text == 95);
});

QUnit.test( "PlayingArea.update()", function( assert ) {
    var zone = new PlayingArea('test.png', 0, 0);
    zone.addItem('pe_test4', 'test.png', 95);
    zone._items[0]._sprite.x = 500;
    zone._items[0]._sprite.y = 500;
    zone.update();
    assert.ok(zone._items[0]._health.x == 500);
    assert.ok(zone._items[0]._health.y == 500);
});

QUnit.module("Global");
QUnit.test("TABLE_ZONES > 0", function( assert ) {
    assert.ok(TABLE_ZONES > 0);
});

QUnit.module("API");
//QUnit.test("showMainMenu", function( assert ) {
//  var done = assert.async();
//  gui.showMainMenu();
//  setTimeout(function() {
//    assert.ok(gui._tg.state.getCurrentState() instanceof states.mainMenu);
//    assert.ok(gui._tg.state.current == 'mainMenu');
//    done();
//  }, 50);
//});
//
//QUnit.test("play", function( assert ) {
//  var done = assert.async();
//  gui.play();
//  setTimeout(function() {
//    assert.ok(gui._tg.state.getCurrentState() instanceof states.play);
//    assert.ok(gui._tg.state.current == 'play');
//    done();
//  }, 100);
//});

QUnit.test("addPlayer1Card()", function( assert ) {
    var numOfItems = gui.player1Items.length;
    gui.addPlayer1Card('api', 'api.png');
    assert.ok(gui.player1Items.length - numOfItems == 1);
});

QUnit.test("addPlayer2Card()", function( assert ) {
    var numOfItems = gui.player2Items.length;
    gui.addPlayer2Card('api2', 'api2.png');
    assert.ok(gui.player2Items.length - numOfItems == 1);
});

QUnit.test("addMonster()", function( assert ) {
    var numOfItems = gui.playingTableItems.length;
    gui.addMonster('api3', 'api3.png', 50);
    assert.ok(gui.playingTableItems.length - numOfItems == 1);
});
//QUnit.test("attack()", function(assert) {
//    gui.play();
//    gui.addPlayer1Card('a1', 'a1.png');
//    gui.addPlayer1Card('a2', 'a2.png');
//    assert.ok(gui.attack('a1', 'a2') instanceof Phaser.Tween);
//});






