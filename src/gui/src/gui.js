var states = {};

states.play = function(gui) {
	this.monster1 = null;
	this.gui = gui;
	this.player1 = null;
	this.player2 = null;
	this.playingTable = null;
}

states.play.prototype.preload = function() {
	//dynamic
	this.load.image('cyan_card', 'assets/cards/cyan.png');
	this.load.image('yellow_card', 'assets/cards/yellow.png');
	//static
	this.load.image('player', 'assets/cards/player.png');
	this.load.image('player1', 'assets/cards/player1.png');
	this.load.image('monster', 'assets/cards/monster.png');
	this.load.image('player_deck', 'assets/cards/playerDeck.png');
	this.load.image('player_deck1', 'assets/cards/playerDeck.png');
	this.load.image('playing_table', 'assets/cards/playingTable.png');
	this.load.image('energy_ball', 'assets/cards/energy_ball.png');
}

states.play.prototype.create = function() {
	this.player1Deck = new PlayerDeck('player_deck', false);
	this.player2Deck = new PlayerDeck('player_deck1', true);
	this.playingTable = new PlayingArea('playing_table', 0, 300);
	
	this.player1 = new Player('player', 'assets/cards/player.png', 0, 0);
	this.player2 = new Player('player1', 'assets/cards/player1.png', 0, 600);
	
	this.addItems();
	this.setHealth();
}

states.play.prototype.update = function() {
	this.playingTable.update();
	this.addItems();
	this.setHealth();
}

states.play.prototype.addItems = function() {
	for (var i = 0; i < this.gui.player1Items.length; i++) {
		var item = this.gui.player1Items.shift();
		this.player1Deck.addItem(item.id, item.imageUrl);
	}
	for (var i = 0; i < this.gui.player2Items.length; i++) {
		var item = this.gui.player2Items.shift();
		this.player2Deck.addItem(item.id, item.imageUrl);
	}
	for (var i = 0; i < this.gui.playingTableItems.length; i++) {
		var item = this.gui.playingTableItems.shift();
		this.playingTable.addItem(item.id, item.imageUrl, item.health);
	}
}

states.play.prototype.setHealth = function() {
	this.player1.setHealth(this.gui.player1Health);
	this.player2.setHealth(this.gui.player2Health);
}

states.mainMenu = function() {
	this.logo = null;
	this.button = null;
}

states.mainMenu.prototype.preload = function() {
	this.load.image('logo', 'assets/cards/logo.png');
	this.load.image('button_out', 'assets/cards/button_out.png');
	this.load.image('button_over', 'assets/cards/button_over.png');
}

states.mainMenu.prototype.create = function() {
	this.logo = game.add.image(VIEWPORT_W / 2 - 400, 100, 'logo');
	this.button = game.add.button(VIEWPORT_W / 2 - 48, 500, 'button_out',  this.goPlay, this, 'button_over', 'button_out');
}

states.mainMenu.prototype.goPlay  = function() {
	game.state.start('play');
}

function GUI() {	
	this.player1Items = [];
	this.player2Items = [];
	this.playingTableItems = [];
	this.player1Health = 0;
	this.player2Health = 0;
	this.player1Deck = null;
	this.player2Deck = null;
	this.playingTable = null;
	this.player1 = null;
	this.player2 = null;
	

	game = new Phaser.Game(VIEWPORT_W, VIEWPORT_H, Phaser.CANVAS, '');
	game.state.add('play', new states.play(this));
	game.state.add('mainMenu', new states.mainMenu());
	this._tg = game;
}

GUI.prototype.showMainMenu = function() {
	game.state.start('mainMenu');
}

GUI.prototype.play = function() {
	game.state.start('play');
}

GUI.prototype.addPlayer1Card = function(_id, _imageUrl) {
	this.player1Items.push({id: _id, imageUrl: _imageUrl});
}

GUI.prototype.addPlayer2Card = function(_id, _imageUrl) {
	this.player2Items.push({id: _id, imageUrl: _imageUrl});
}

GUI.prototype.addMonster = function(_id, _imageUrl, _health) {
	this.playingTableItems.push({id: _id, imageUrl: _imageUrl, health: _health});
}

GUI.prototype.deletePlayer1Card = function(id) {
	if (game.state.current === 'play') {
		return game.state.getCurrentState().player1Deck.deleteItem(id);
	} else {
		return false;
	}
}

GUI.prototype.deletePlayer2Card = function(id) {
	if (game.state.current === 'play') {
		return game.state.getCurrentState().player2Deck.deleteItem(id);
	} else {
		return false;
	}
}

GUI.prototype.deleteMonster = function(id) {
	if (game.state.current === 'play') {
	console.log("deleting monster");
		return game.state.getCurrentState().playingTable.deleteItem(id);
	} else {
		return false;
	}
}

GUI.prototype.setPlayer1Health = function(health) {
	this.player1Health = health;
}

GUI.prototype.setPlayer2Health = function(health) {
	this.player2Health = health;
}

