/**
  * @file GUI class, which holds main GUI API, and states object.
  * @author Petrov Alexander exesa@yandex.ru
  * @requires playingElements.js
  * @requires phaser.js
  * @requires globals.js
  * @requires tableZones.js
  */


var states = {};



/**
 * @class
 * @classDesc State class, represents main menu state
 * @implements Phaser.State
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.State.html}
 */
states.mainMenu = function(gui) {
    this.logo = null;
    this.playButton = null;
    this.lobbyButton = null;

    this.gui = gui;
};

states.mainMenu.prototype.preload = function() {
    this.load.image('logo', 'assets/cards/logo.png');
    this.load.image('button_out', 'assets/cards/button_out.png');
    this.load.image('button_over', 'assets/cards/button_over.png');
    this.load.image('lobbyButton', 'assets/cards/lobbyButton.png');
};

states.mainMenu.prototype.create = function() {
    this.logo = game.add.image(VIEWPORT_W / 2 - 400, 100, 'logo');
    this.playButton = game.add.button(VIEWPORT_W / 2 - 48, 500, 'button_out',  this.goPlay, this);
    this.lobbyButton = game.add.button(VIEWPORT_W / 2 - 48, 600, 'lobbyButton',  this.goLobby, this);
};

/**
 * @method states.mainMenu#goPlay
 * @desc starts a playing state
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.State.html}
 */
states.mainMenu.prototype.goPlay = function() {
    game.state.start('play');


};

states.mainMenu.prototype.goLobby = function() {
    game.state.start('lobby');
};


/**
 * @class
 * @classDesc State class, represents lobby state
 * @implements Phaser.State
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.State.html}
 */
states.lobby = function() {
    this.playButton = null;
    this.menuButton = null;
};

states.lobby.prototype.preload = function() {
    game.load.image('playButton', 'assets/cards/playButton.png');
    game.load.image('menuButton', 'assets/cards/menuButton.png');
};

states.lobby.prototype.create = function() {
    this.playButton = game.add.button(0, 0, 'playButton', this.goPlay, this);
    this.menuButton = game.add.button(0, 0, 'menuButton', this.goMainMenu, this);

    this.menuButton.width = Math.floor(0.5 * this.menuButton.width);
    this.menuButton.height = this.menuButton.width;
    this.playButton.width = Math.floor(0.5 * this.playButton.width);
    this.playButton.height = this.playButton.width;

    this.menuButton.y = Math.floor(0.95 * VIEWPORT_H) - this.menuButton.height;
    this.playButton.y = Math.floor(0.95 * VIEWPORT_H) - this.playButton.height;
    this.menuButton.x = Math.floor(0.05 * VIEWPORT_W);
    this.playButton.x = Math.floor(0.95 * VIEWPORT_W) - this.playButton.width;

    this.username = game.add.text(0.1 * VIEWPORT_W, 0.1 * VIEWPORT_H, '...', { font: String(20) + 'px Arial', fill: '#ffffff'});
    this.opponentName = game.add.text(0.7 * VIEWPORT_W, 0.1 * VIEWPORT_H, '...', { font: String(20) + 'px Arial', fill: '#ffffff'});
};

states.lobby.prototype.update = function() {

};

/**
 * @method states.lobby#goPlay
 * @desc Starts a playing state
 */
states.lobby.prototype.goPlay = function() {
    game.state.start('play');
};

/**
 * @method states.lobby#goMainMenu
 * @desc Starts a main menu state
 */
states.lobby.prototype.goMainMenu = function() {
    game.state.start('mainMenu');
};

/**
 * @method states.lobby#setMyName
 * @desc sets user's name, which is displayed
 * @arg {string} name Username
 */
states.lobby.prototype.setMyName = function(name) {
    this.username.text = name;
};

/**
 * @method states.lobby#setOpponentName
 * @desc sets opponent's name, which is displayed
 * @arg {string} name Opponent's name
 */
states.lobby.prototype.setOpponentName = function(name) {
    this.opponentName.text = name;
};

/**
 * @class
 * @classDesc State class, represents playing game state
 * @arg {GUI} Main GUI object
 * @implements Phaser.State
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.State.html}
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
    //this.load.image('cyan_card', 'assets/cards/cyan.png');
    //this.load.image('yellow_card', 'assets/cards/yellow.png');
    //static
    this.load.image('player', 'assets/cards/player.png');
    this.load.image('player1', 'assets/cards/player1.png');
    this.load.image('monster', 'assets/cards/monster.png');
    this.load.image('player_deck', 'assets/cards/playerDeck.png');
    this.load.image('player_deck1', 'assets/cards/playerDeck.png');
    this.load.image('playing_table', 'assets/cards/playingTable.png');
    this.load.image('energy_ball', 'assets/cards/energy_ball.png');
    this.load.image('lightning1', 'assets/cards/lightning1.png');
    this.load.image('lightning2', 'assets/cards/lightning2.png');
    this.load.image('lightning3', 'assets/cards/lightning3.png');
    this.load.image('lightning4', 'assets/cards/lightning4.png');
    this.load.image('smoke', 'assets/cards/smoke.png');
    this.load.image('spark', 'assets/cards/spark.png');
    this.game.add.plugin(Phaser.Plugin.Debug);
};

states.play.prototype.create = function() {
    this.player1Deck = new PlayerDeck('player_deck', false);
    this.player2Deck = new PlayerDeck('player_deck1', true);
    this.playingTable = new PlayingArea('playing_table', 0, 300);

    this.player1 = new Player('player', 'assets/cards/player.png', 75, 75);
    this.player2 = new Player('player1', 'assets/cards/player1.png', 75, 675);

    /// *** debug only ***
    this.populateSignal = new Phaser.Signal();
    this.populateSignal.add(this.populate, this);

    this.populate();

    this.populateKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.populateKey.onDown = this.populateSignal;
    //***********************
};

states.play.prototype.update = function() {
    this.playingTable.update();
    this.player1Deck.update();
    this.player2Deck.update();
};

/**
 * @method states.play#populate
 * @desc Adds cards and monsters to playing table using GUI API. For testing purposes.
 */
states.play.prototype.populate = function() {
    this.gui.setPlayer1Health(20);
    this.gui.setPlayer2Health(30);
    this.gui.addPlayer1Card('cyan_card1', 'assets/cards/cyan.png', 'lightning',1, 2 ,3);
    this.gui.addPlayer1Card('cyan_card2', 'assets/cards/cyan.png', 'lightning',2, 2, 3);
    this.gui.addPlayer1Card('cyan_card3', 'assets/cards/cyan.png', 'lightning',3, 2, 3);
    this.gui.addPlayer1Card('cyan_card4', 'assets/cards/cyan.png', 'lightning',4, 2, 3);
    this.gui.addPlayer1Card('cyan_card5', 'assets/cards/cyan.png', 'lightning',5, 2, 3);
    this.gui.addPlayer2Card('yellow_card', 'assets/cards/yellow.png', 'lightning', 10, 2, 3);
    this.gui.addMonster('monster1', 'assets/cards/monster.png', 'energyBall', 15, 3);
    this.gui.addMonster('monster2', 'assets/cards/monster.png', 'energyBall', 30, 3);
    this.gui.addOpponentMonster('monster3', 'assets/cards/monster.png', 'energyBall', 30, 4);
    this.gui.addOpponentMonster('monster4', 'assets/cards/monster.png', 'energyBall', 55, 4);
};



/**
  * @class
  * @classDesc Main GUI class. Use this to create GUI instance and control it
  */
function GUI() {
    game = new Phaser.Game(VIEWPORT_W, VIEWPORT_H, Phaser.CANVAS, '');

    game.state.add('mainMenu', new states.mainMenu(this));
    game.state.add('lobby', new states.lobby());
    game.state.add('play', new states.play(this));

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
 * @arg {string} id Unique id of the {@link Card}
 * @arg {string} imageUrl URL to an image, whick will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @arg {number} price Mana points necessary to use a card
 * @arg {number} attackLevel Damage done by creature spawned by this card
 * @arg {number} health Health points of creature done spawned by this card
 * @returns {@link Card} Item being added, false otherwise
 */
GUI.prototype.addPlayer1Card = function(id, imageUrl, attackType, price, attackLevel, health) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player1Deck.addItem(id, imageUrl, attackType, price, attackLevel, health);
    } else {
        return false;
    }
};

/**
 * @method GUI#addPlayer2Card
 * @desc Adds card to the second player's deck
 * @arg {string} id Unique id of the {@link Card}
 * @arg {string} imageUrl URL to an image, which will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @arg {number} price Mana points necessary to use a card
 * @arg {number} attackLevel Damage done by creature spawned by this card
 * @arg {number} health Health points of creature done spawned by this card
 * @returns {@link Card} Item being added, false otherwise
 */
GUI.prototype.addPlayer2Card = function(id, imageUrl, attackType, price, attackLevel, health) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player2Deck.addItem(id, imageUrl, attackType, price, attackLevel, health);
    } else {
        return false;
    }
};

/**
 * @method GUI#addMonster
 * @desc Adds monster to the playing table
 * @arg {string} id Unique id of the {@link Card}
 * @arg {string} imageUrl URL to an image, which will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @arg {number} health Monster's health
 * @arg {number} attackLevel Monster's attack points
 * @returns {@link Monster} Item being added, false otherwise
 */
GUI.prototype.addMonster = function(id, imageUrl, attackType, health, attackLevel) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().playingTable.addItem(id, imageUrl, attackType, health, attackLevel);
    } else {
        return false;
    }
};

/**
 * @method GUI#addOpponentMonster
 * @desc Adds monster to the playing table
 * @arg {string} id Unique id of the {@link Card}
 * @arg {string} imageUrl URL to an image, which will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @arg {number} health Monster's health
 * @arg {number} attackLevel Monster's attack points
 * @returns {@link Monster} Item being added, false otherwise
 */
GUI.prototype.addOpponentMonster = function(id, imageUrl, attackType, health, attackLevel) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().playingTable.addOpponentItem(id, imageUrl, attackType, health, attackLevel);
    } else {
        return false;
    }
};

/**
 * @method GUI#deletePlayer1Card
 * @desc Deletes card from the first player's deck
 * @arg id Id of the card being deleted
 * @returns {boolean} True if successful, false otherwise
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
 * @returns {boolean} True if successful, false otherwise
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
 * @returns {boolean} True if successful, false otherwise
 */
GUI.prototype.deleteMonster = function(id) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().playingTable.deleteItem(id);
    } else {
        return false;
    }
};

/**
 * @method GUI#setPlayer1Health
 * @desc Sets the first player's health
 * @arg {number} health Desired health level
 * @returns {boolean} True if successful, false otherwise
 */
GUI.prototype.setPlayer1Health = function(health) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player1.setHealth(health);
    } else {
        return false;
    }
};

/**
 * @method GUI#setPlayer1Health
 * @desc Sets the second player's health
 * @arg {number} health Desired health level
 * @returns {boolean} True if successful, false otherwise
 */
GUI.prototype.setPlayer2Health = function(health) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player2.setHealth(health);
    } else {
        return false;
    }
};

/**
 * @method GUI#movePlayer1Card
 * @desc Moves card to another position
 * @param {string} id Id of item being moved
 * @param {number} position New position of item
 */
GUI.prototype.movePlayer1Card = function(id, position) {
    if (game.state.current === 'play') {
        game.state.getCurrentState().player1Deck.moveToPosition(id, position);
    }
};

/**
 * @method GUI#movePlayer2Card
 * @desc Moves card to another position
 * @param {string} id Id of item being moved
 * @param {number} position New position of item
 */
GUI.prototype.movePlayer2Card = function(id, position){
    if (game.state.current === 'play') {
        game.state.getCurrentState().player2Deck.moveToPosition(id, position);

    }
};

/**
 * @method GUI#moveMonster
 * @desc Move monster to another position
 * @param {string} id Id of item being moved
 * @param {number} position New position of item
 */
GUI.prototype.moveMonster = function(id, position) {
    if (game.state.current === 'play') {
        game.state.getCurrentState().playingTable.moveToPosition(id, position);

    }
};
/**
 * @method GUI#attack
 * @desc Manually trigger attack action
 * @param {string} attacker Id of attacker object
 * @param {string} target Id of target object
 * @returns {Phaser.Tween}
 */
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

/**
 * @method GUI#setMyName
 * @desc Sets user's name in lobby screen
 * @param {string} name Name of user
 */
GUI.prototype.setMyName = function(name) {
    if (game.state.current == 'lobby') {
        game.state.getCurrentState().setMyName(name);
    }
};

/**
 * @method GUI#setOpponentName
 * @desc Sets user's name in lobby screen
 * @param {string} name Name of opponent
 */
GUI.prototype.setOpponentName = function(name) {
    if (game.state.current == 'lobby') {
        game.state.getCurrentState().setOpponentName(name);
    }
};
