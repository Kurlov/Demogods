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
    this.id = backgroundImage;
    this.x = 0.9 * VIEWPORT_W;
    this.sprite = game.add.image(-100, -100, this.id);
    this.fitToScreen();
    
    this.items = [];
    this.elementWidth = 150; //TODO: think of automatic calculation (needs precise sprite sizes)
    
}

/**
  * @method TableZone#fitToScreen
  * @desc Resizes sprite according to user's display size
  */
TableZone.prototype.fitToScreen = function () {
    var originalSpriteHeight = this.sprite.height;
    this.sprite.height = Math.floor(1.2 * VIEWPORT_H / TABLE_ZONES);
    //console.log(this.sprite.height);
    //this.sprite.width = Math.floor(this.sprite.width / (originalSpriteHeight / this.sprite.height));
    this.sprite.width = Math.floor(0.9 * VIEWPORT_W);
};

/**
 * @method TableZone#addItem
 * @desc Adds new {@link PlayingElement} to TableZone
 * @arg {string} id Unique element id
 * @arg {string} imageUrl URL of an image, whil will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @returns {PlayingElement} Element being added
 */
TableZone.prototype.addItem = function (id, imageUrl, attackType) {
    var item = new PlayingElement(id, imageUrl, this.elementWidth * this.items.length, this.y, attackType);
    this.items.push(item);
    return item;
    //activeElements.push(item);
};
/**
  *    @method TableZone#deleteItem
  * @desc Deletes item from the TableZone
  * @arg {string} id Id of element being deleted
  * @returns {boolean} Returns true if successful
  */
TableZone.prototype.deleteItem = function(id) {
    var index = this.getItemIndex(id);
    if (index != -1) {
        this.items[index].destroy();
        this.items.splice(index, 1);
        return true;
    } else {
        return false;
    }
};

/**
 * @method TableZone#getItemIndex
 * @desc Finds index of item by it's id in items array
 * @arg {string} id Id of element
 * @returns {number} Returns index of item, -1 otherwise
 */
TableZone.prototype.getItemIndex = function (id) {
    var index = -1;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};
/**
 * @method TableZone#getItem
 * @desc Finds item by it's id in items array
 * @arg {string} id Id of element
 * @returns {number} Returns  item object, none otherwise
 */
TableZone.prototype.getItem = function (id) {
    var index = this.getItemIndex(id);
    if (index != -1) {
        return this.items[index];
    }
};

/**
 * @method TableZone#moveToPosition
 * @desc moves an item to a new position
 * @param {string} id Id of item being moved
 * @param {number} position New position of element
 */
TableZone.prototype.moveToPosition = function(id, position) {
    var index = this.getItemIndex(id);
    if ((index != position) && (position < this.items.length)) {
        var item = this.items[index];
        this.items.splice(index, 1);
        this.items.splice(position, 0, item);
    }
};
/**
 * @method TableZone#redrawItems
 * @desc Moves all cards to adequate positions if any modifications to items array were made. (e.g. deleting)
 */
TableZone.prototype.redrawItems = function() {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].sprite.x = this.elementWidth * i + this.elementWidth + this.x;
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
        this.y = VIEWPORT_H - this.sprite.height;
    } else {
        this.y = 0;
    }
    this.x = 150;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.width = Math.floor(VIEWPORT_W - this.x);
}

PlayerDeck.prototype = Object.create(TableZone.prototype);
PlayerDeck.prototype.constructor = TableZone;

/**
 * @method PlayerDeck#addItem
 * @desc Adds {@link Card} to player's deck
 * @arg {string} id Unique element id
 * @arg {string} imageUrl URL of an image, whil will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @returns {Card} Element being added
 */
PlayerDeck.prototype.addItem = function (id, imageUrl, attackType) {
    var item = new Card(id, imageUrl, this.elementWidth * this.items.length + this.elementWidth + this.x, this.y + Math.floor(this.sprite.height / 2), attackType);
    this.items.push(item);
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
    this.sprite.x = 0;
    this.sprite.y = 0.17 * VIEWPORT_H;
    this.x = this.sprite.x;
    this.y = this.sprite.y;
    this.sprite.width = VIEWPORT_W;
    this.sprite.height = 0.66 * VIEWPORT_H;
    
    this.opponentItems = [];
}

PlayingArea.prototype = Object.create(TableZone.prototype);
PlayingArea.prototype.constructor = TableZone;

/**
 * @method PlayerDeck#addItem
 * @desc Adds {@link Monster} to player's deck
 * @arg {string} id Unique element id
 * @arg {string} imageUrl URL of an image, which will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @returns {Monster} Element being added
  */
PlayingArea.prototype.addItem = function (id, imageUrl, attackType, health) {
    var item = new Monster(id, imageUrl, this.elementWidth * this.items.length + this.elementWidth + this.x, this.y + Math.floor(this.sprite.height / 4), attackType);
    item.setHealth(health);
    this.items.push(item);
    return item;
};

/**
 * @method PlayerDeck#addopponentItem
 * @desc Adds {@link Monster} to player's deck
 * @arg {string} id Unique element id
 * @arg {string} imageUrl URL of an image, which will be shown ingame
 * @arg {string} attackType Defines attack animation
 * @returns {Monster} Element being added
 */
PlayingArea.prototype.addOpponentItem = function (id, imageUrl, attackType, health) {
    var item = new Monster(id, imageUrl, this.elementWidth * this.items.length + this.elementWidth + this.x, this.y + Math.floor(this.sprite.height / 4), attackType);
    item.setHealth(health);
    this.opponentItems.push(item);
    return item;
};

/**
  * @method PlayingArea#update
  * @desc Calls {@link Monster#update} method for existing Monsters. Must be called on global update
  */
PlayingArea.prototype.update = function() {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].update();
    }
};

