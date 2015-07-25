/**
  * @file GUI class, which holds main GUI API, and states object.
  * @author Petrov Alexander exesa@yandex.ru
  * @requires playingElements.js
  * @requires phaser.min.js
  * @requires globals.js
  * @requires tableZones.js
  */


var states = {};

/**
  * @class
  * @classDesc State class, represents playing game state
  * @arg {GUI} Main GUI object
  * @implements Phaser.State
  */
states.play = function(gui) {
    this.monster1 = null;
    this.gui = gui;
    this.player1 = null;
    this.player2 = null;
    this.playingTable = null;
};

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
    this.game.add.plugin(Phaser.Plugin.Debug);
};

states.play.prototype.create = function() {
    this.player1Deck = new PlayerDeck('player_deck', false);
    this.player2Deck = new PlayerDeck('player_deck1', true);
    this.playingTable = new PlayingArea('playing_table', 0, 300);
    
    this.player1 = new Player('player', 'assets/cards/player.png', 0, 0);
    this.player2 = new Player('player1', 'assets/cards/player1.png', 0, 600);
    
    this.addItems();
    this.setHealth();
};

states.play.prototype.update = function() {
    this.playingTable.update();
    this.addItems();
    this.setHealth();
};
/**
  * @method play#addItems
  * @desc Adds items from object pool to actual {@link TableZone}
  */
states.play.prototype.addItems = function() {
    for (var i = 0; i < this.gui.player1Items.length; i++) {
        var item = this.gui.player1Items.shift();
        this.player1Deck.addItem(item.id, item.imageUrl);
    }
    for (i = 0; i < this.gui.player2Items.length; i++) {
        item = this.gui.player2Items.shift();
        this.player2Deck.addItem(item.id, item.imageUrl);
    }
    for (i = 0; i < this.gui.playingTableItems.length; i++) {
        item = this.gui.playingTableItems.shift();
        this.playingTable.addItem(item.id, item.imageUrl, item.health);
    }
};
/**
  * @method play#setHealth
  * @desc sets players health from object pool
  */
states.play.prototype.setHealth = function() {
    this.player1.setHealth(this.gui.player1Health);
    this.player2.setHealth(this.gui.player2Health);
};

/**
  * @class
  * @classDesc State class, represents main menu state
  * @implements Phaser.State
  */
states.mainMenu = function() {
    this.logo = null;
    this.button = null;
};

states.mainMenu.prototype.preload = function() {
    this.load.image('logo', 'assets/cards/logo.png');
    this.load.image('button_out', 'assets/cards/button_out.png');
    this.load.image('button_over', 'assets/cards/button_over.png');
};

states.mainMenu.prototype.create = function() {
    this.logo = game.add.image(VIEWPORT_W / 2 - 400, 100, 'logo');
    this.button = game.add.button(VIEWPORT_W / 2 - 48, 500, 'button_out',  this.goPlay, this, 'button_over', 'button_out');
};

/**
  * @method mainMenu#goPlay
  * @desc starts a playing state
  */
states.mainMenu.prototype.goPlay  = function() {
    game.state.start('play');
};

/**
  * @class
  * @classDesc Main GUI class. Use this to create GUI instance and control it
  */
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

/**
  * @method GUI#showMainMenu
  * @desc Shows main menu
  */
GUI.prototype.showMainMenu = function() {
    game.state.start('mainMenu');
};
/**
  * @method GUI#play
  * @desc Stars playing session
  */
GUI.prototype.play = function() {
    game.state.start('play');
};
/**
  * @method GUI#addPlayer1Card
  * @desc Adds card to the first player's deck
  * @arg {string} _id Unique id of the {@link Card}
  * @arg {string} _imageUrl URL to an image, whick will be shown ingame
  */
GUI.prototype.addPlayer1Card = function(_id, _imageUrl) {
    this.player1Items.push({id: _id, imageUrl: _imageUrl});
};
/**
  * @method GUI#addPlayer2Card
  * @desc Adds card to the second player's deck
  * @arg {string} _id Unique id of the {@link Card}
  * @arg {string} _imageUrl URL to an image, whick will be shown ingame
  */
GUI.prototype.addPlayer2Card = function(_id, _imageUrl) {
    this.player2Items.push({id: _id, imageUrl: _imageUrl});
};
/**
  * @method GUI#addMonster
  * @desc Adds monster to the playing table
  * @arg {string} _id Unique id of the {@link Card}
  * @arg {string} _imageUrl URL to an image, whick will be shown ingame
  * @arg {number} _health Monster's health
  */
GUI.prototype.addMonster = function(_id, _imageUrl, _health) {
    this.playingTableItems.push({id: _id, imageUrl: _imageUrl, health: _health});
};
/**
  * @method GUI#deletePlayer1Card
  * @desc Deletes card from the first player's deck
  * @arg id Id of the card being deleted
  */
GUI.prototype.deletePlayer1Card = function(id) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player1Deck.deleteItem(id);
    } else {
        return false;
    }
};
/**
  * @method GUI#deletePlayer2Card
  * @desc Deletes card from the second player's deck
  * @arg id Id of the card being deleted
  */
GUI.prototype.deletePlayer2Card = function(id) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player2Deck.deleteItem(id);
    } else {
        return false;
    }
};
/**
  * @method GUI#deleteMonster
  * @desc Deletes monster from the playing table
  * @arg id Id of the monster being deleted
  */
GUI.prototype.deleteMonster = function(id) {
    if (game.state.current === 'play') {
    console.log("deleting monster");
        return game.state.getCurrentState().playingTable.deleteItem(id);
    } else {
        return false;
    }
};

/**
  * @method GUI#setPlayer1Health
  * @desc Sets the first player's health
  * @arg {number} health Desired health level
  */
GUI.prototype.setPlayer1Health = function(health) {
    this.player1Health = health;
};

/**
  * @method GUI#setPlayer1Health
  * @desc Sets the second player's health
  * @arg {number} health Desired health level
  */
GUI.prototype.setPlayer2Health = function(health) {
    this.player2Health = health;
};

/**
 * @method GUI#movePlayer1Card
 * @param {string} id Id of item being moved
 * @param {number} position New position of item
 */
GUI.prototype.movePlayer1Card = function(id, position) {
    if (game.state.current === 'play') {
        game.state.getCurrentState().player1Deck.moveToPosition(id, position);
    }
};

/**
 * @method GUI#movePlayer1Card
 * @param {string} id Id of item being moved
 * @param {number} position New position of item
 */
GUI.prototype.movePlayer2Card = function(id, position){
    if (game.state.current === 'play') {
        game.state.getCurrentState().player2Deck.moveToPosition(id, position);

    }
};

/**
 * @method GUI#movePlayer1Card
 * @param {string} id Id of item being moved
 * @param {number} position New position of item
 */
GUI.prototype.moveMonster = function(id, position) {
    if (game.state.current === 'play') {
        game.state.getCurrentState().playingTable.moveToPosition(id, position);

    }
};

GUI.prototype.attack = function(attacker, target) {
    if (game.state.current === 'play') {
        var from1 = game.state.getCurrentState().player1Deck.getItem(attacker);
        var from2 = game.state.getCurrentState().player2Deck.getItem(attacker);
        var from3 = game.state.getCurrentState().playingTable.getItem(attacker);
        var to1 = game.state.getCurrentState().player1Deck.getItem(target);
        var to2 = game.state.getCurrentState().player2Deck.getItem(target);
        var to3 = game.state.getCurrentState().playingTable.getItem(target);

        var from;
        var to;

        if (from1 != undefined) {
            from = from1;
        }
        if (from2 != undefined) {
            from = from2;
        }
        if (from3 != undefined) {
            from = from3;
        }
        if (to1 != undefined) {
            to = to1;
        }
        if (to2 != undefined) {
            to = to2;
        }
        if (to3 != undefined) {
            to = to3;
        }

        if ((from != undefined) && (to != undefined)) {
            return from.attack(to);
        }
    }
};
