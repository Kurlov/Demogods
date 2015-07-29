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
  * @method mainMenu#goPlay
  * @desc starts a playing state
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
 */
states.lobby = function() {
    this.user = '';
    this.opponent = '';
    this.playButton = null;
    this.menuButton = null;
};

states.lobby.prototype.preload = function() {
    game.load.image('playButton', 'assets/cards/playButton.png');
    game.load.image('menuButton', 'assets/cards/menuButton.png');
};

states.lobby.prototype.create = function() {
    this.playButton = game.add.button(VIEWPORT_W * 0.8, VIEWPORT_H * 0.7, 'playButton', this.goPlay, this);
    this.menuButton = game.add.button(VIEWPORT_W * 0.05, VIEWPORT_H * 0.7, 'menuButton', this.goMainMenu, this);


};

states.lobby.prototype.update = function() {

};

/**
 * @method lobby#goPlay
 * @desc Starts a playing state
 */
states.lobby.prototype.goPlay = function() {
    game.state.start('play');
};

/**
 * @method lobby#goMainMenu
 * @desc Starts a main menu state
 */
states.lobby.prototype.goMainMenu = function() {
    game.state.start('mainMenu');
};

/**
 * @method lobby#setMyName
 * @desc sets user's name, which is displayed
 */
states.lobby.prototype.setMyName = function(name) {
    this.user = name;
};

/**
 * @method lobby#setOpponentsName
 * @desc sets opponent's name, which is displayed
 */
states.lobby.prototype.setOpponentsName = function(name) {
    this.opponent = name;
};

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
    this.load.spritesheet('lightning', 'assets/cards/lightning.png', 512, 64);
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

    this.populateSignal = new Phaser.Signal();
    this.populateSignal.add(this.populate, this);

    this.populate();

    this.populateKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.populateKey.onDown = this.populateSignal;
};

states.play.prototype.update = function() {
    this.playingTable.update();
};

/**
 * @method play#populate
 * @desc Adds cards and monsters to playing table using GUI API. For testing purposes.
 */
states.play.prototype.populate = function() {
    this.gui.setPlayer1Health(20);
    this.gui.setPlayer2Health(30);
    this.gui.addPlayer1Card('cyan_card', 'assets/cards/cyan.png');
    this.gui.addPlayer2Card('yellow_card', 'assets/cards/yellow.png');
    this.gui.addMonster('monster1', 'assets/cards/monster.png', 15);
    this.gui.addMonster('monster2', 'assets/cards/monster.png', 30);
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
 * @arg {string} _id Unique id of the {@link Card}
 * @arg {string} _imageUrl URL to an image, whick will be shown ingame
 * @returns {@link Card} Item being added, false otherwise
 */
GUI.prototype.addPlayer1Card = function(id, imageUrl) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player1Deck.addItem(id, imageUrl);
    } else {
        return false;

    }
};

/**
 * @method GUI#addPlayer2Card
 * @desc Adds card to the second player's deck
 * @arg {string} _id Unique id of the {@link Card}
 * @arg {string} _imageUrl URL to an image, whick will be shown ingame
 * @returns {@link Card} Item being added, false otherwise
 */
GUI.prototype.addPlayer2Card = function(id, imageUrl) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().player2Deck.addItem(id, imageUrl);
    } else {
        return false;
    }
};

/**
 * @method GUI#addMonster
 * @desc Adds monster to the playing table
 * @arg {string} _id Unique id of the {@link Card}
 * @arg {string} _imageUrl URL to an image, whick will be shown ingame
 * @arg {number} _health Monster's health
 * @returns {@link Monster} Item being added, false otherwise
 */
GUI.prototype.addMonster = function(id, imageUrl, health) {
    if (game.state.current === 'play') {
        return game.state.getCurrentState().playingTable.addItem(id, imageUrl, health);
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
