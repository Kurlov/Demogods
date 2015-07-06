var gui = new GUI();

QUnit.test( "Playing Element creating", function( assert ) {
  assert.ok( new PlayingElement('test', 'test.png', 0, 0) instanceof PlayingElement, "Passed!" );
});

QUnit.test( "Card creating", function( assert ) {
  assert.ok( new Card('test', 'test.png', 0, 0) instanceof Card, "Passed!" );
});

QUnit.test( "Monster creating", function( assert ) {
  assert.ok( new Monster('test', 'test.png', 0, 0) instanceof Monster, "Passed!" );
});

QUnit.test( "Player creating", function( assert ) {
  assert.ok( new Player('test', 'test.png', 0, 0) instanceof Player, "Passed!" );
});