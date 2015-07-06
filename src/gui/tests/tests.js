var gui = new GUI();

QUnit.test( "Playing Element creating test", function( assert ) {
  assert.ok( new PlayingElement('test', 'test.png', 0, 0) instanceof PlayingElement, "Passed!" );
});