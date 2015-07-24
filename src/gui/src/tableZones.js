/**
  * @file Contains TableZone class and its children. Responsible for rendering zones background and cards manipulation
  * @author Petrov Alexander exesa@yandex.ru
  * @requires playingElements.js
  * @requires Phaser.js
  * @requires globals.js
  */

/**
 * @class
 * @classdesc TableZone class. Provides interface for card manipulation on the table zone (player cards, active monsters, etc). Renders zone background.
 * @arg {string} backgroundImage URL to image, which will be rendered as zone's background
 */
function TableZone(backgroundImage) {
	this._id = backgroundImage;
	this._x = 0.9 * VIEWPORT_W;
	this._sprite = game.add.image(-100, -100, this._id);
	this.fitToScreen();
	
	this._items = [];
	this._elementWidth = 150; //TODO: think of automatic calculation (needs precise sprite sizes)
	
}

/**
  * @method TableZone#fitToScreen
  * @desc Resizes sprite according to user's display size
  */
TableZone.prototype.fitToScreen = function () {
	var originalSpriteHeight = this._sprite.height;
	this._sprite.height = Math.floor(1.2 * VIEWPORT_H / TABLE_ZONES);
	//console.log(this._sprite.height);
	//this._sprite.width = Math.floor(this._sprite.width / (originalSpriteHeight / this._sprite.height));
	this._sprite.width = Math.floor(0.9 * VIEWPORT_W);
};

/**
  * @method TableZone#addItem
  * @desc Adds new {@link PlayingElement} to TableZone
  * @arg {string} id Unique element id
  * @arg {string} imageUrl URL of an image, whil will be shown ingame
  * @returns {PlayingElement} Element being added
  */
TableZone.prototype.addItem = function (id, imageUrl) {
	var item = new PlayingElement(id, imageUrl, this._elementWidth * this._items.length, this._y);
	this._items.push(item);
	return item;
	//activeElements.push(item);
};
/**
  *	@method TableZone#deleteItem
  * @desc Deletes item from the TableZone
  * @arg {string} id Id of element being deleted
  * @returns {boolean} Returns true if successful
  */
TableZone.prototype.deleteItem = function(id) {
	var index = -1;
	for (var i = 0; i < this._items.length; i++) {
		if (this._items[i]._id === id) {
			index = i;
			break;
		}
	}
	this._items[index].destroy();
	if (index != -1) {
		this._items.splice(index, 1);
		return true;
	} else {
		return false;
	}
};

/**
 * @class
 * @classdesc PlayerDeck class. Implements zone responsible for players cards.
 * @arg {string} backgroundImage URL to image, which will be rendered as zone's background
 * @arg {boolean} bottom Should it be rendered on bottom of the screen?
 * @extends TableZone
 */
function PlayerDeck(backgroundImage, bottom) {
	TableZone.apply(this, arguments);
	if (bottom) {
		this._y = VIEWPORT_H - this._sprite.height;
	} else {
		this._y = 0;
	}
	this._x = 150;
	this._sprite.x = this._x;
	this._sprite.y = this._y;
	this._sprite.width = Math.floor(VIEWPORT_W - this._x);
}

PlayerDeck.prototype = Object.create(TableZone.prototype);
PlayerDeck.prototype.constructor = TableZone;

/**
  * @method PlayerDeck#addItem
  * @desc Adds {@link Card} to player's deck
  * @arg {string} id Unique element id
  * @arg {string} imageUrl URL of an image, whil will be shown ingame
  * @returns {Card} Element being added
  */
PlayerDeck.prototype.addItem = function (id, imageUrl) {
	var item = new Card(id, imageUrl, this._elementWidth * this._items.length + this._x, this._y);
	this._items.push(item);
	return item;
	//activeElements.push(item);
};

/**
 * @class
 * @classdesc PlayingArea class. Implements zone responsible for center of the screen, where deployed monsters belong.
 * @arg {string} backgroundImage URL to image, which will be rendered as zone's background
 * @arg {boolean} bottom Should it be rendered on bottom of the screen?
 * @extends TableZone
 */
function PlayingArea(backgroundImage, x, y) {
	TableZone.apply(this, arguments);
	this._sprite.x = 0;
	this._sprite.y = 0.17 * VIEWPORT_H;
	this._x = this._sprite.x;
	this._y = this._sprite.y;
	this._sprite.width = VIEWPORT_W;
	this._sprite.height = 0.66 * VIEWPORT_H;
}

PlayingArea.prototype = Object.create(TableZone.prototype);
PlayingArea.prototype.constructor = TableZone;

/**
  * @method PlayerDeck#addItem
  * @desc Adds {@link Monster} to player's deck
  * @arg {string} id Unique element id
  * @arg {string} imageUrl URL of an image, whil will be shown ingame
  * @returns {Monster} Element being added
  */
PlayingArea.prototype.addItem = function (id, imageUrl, health) {
	var item = new Monster(id, imageUrl, this._elementWidth * this._items.length, this._y + 50);
	item.setHealth(health);
	this._items.push(item);
	return item;
	//activeElements.push(item);
};


/**
  * @method PlayingArea#update
  * @desc Calls {@link Monster#update} method for existing Monsters. Must be called on global update
  */
PlayingArea.prototype.update = function() {
	for (var i = 0; i < this._items.length; i++) {
		this._items[i].update();
	}
};

