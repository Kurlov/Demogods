/**
 * @file Contains Playing element class and its children. Responsible for cards, players and monsters logics and render on the table.
 * @author Petrov Alexnader exesa@yandex.ru
 * @requires Phaser.js
 * @requires globals.js
 * @requires animations.js
 */



/**
 * @class 
 * @classdesc Playing element class. Ancestor of main playing elements on table, such as cards, player and monsters
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @arg {string} attackType Defines animation, used during attack action
 */
function PlayingElement(id, imageUrl, x, y, attackType) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.sprite = game.add.image(x, y, this.imageUrl);
    if (game.cache.checkImageKey(imageUrl)) {
        this.fitToScreen();
    } else {
        dynamicImageLoad(this.id, this.imageUrl, this);
    }


    this.sprite.anchor = new Phaser.Point(0.5, 0.5);

    this.attackType = attackType;

    this.sprite.events.onDragStart.add(this.savePosition, this);
    this.sprite.events.onDragStop.add(this.onDragStop, this);
    this.sprite.events.onInputOver.add(this.onHover, this);
    this.sprite.events.onInputOut.add(this.onHoverOut, this);
    
    this._prevX = null;
    this._prevY = null;


}
PlayingElement.prototype.loadSprite = function() {
    this.sprite.loadTexture(this.imageUrl);
};

/** @method PlayingElement#onDragStop 
  * @desc DragnDrop stop event handler
  */
PlayingElement.prototype.onDragStop = function() {

    attackSignal.dispatch(this);
    this.restorePosition();
};

/** @method PlayingElement#fitToScreen 
  * @desc Resizes sprite according to user's display size
  */
PlayingElement.prototype.fitToScreen = function() {
    var originalSpriteHeight = this.sprite.height;
    this.sprite.height = Math.floor(VIEWPORT_H / TABLE_ZONES);
    //console.log(this.sprite.height);
    this.sprite.width = Math.floor(this.sprite.width / (originalSpriteHeight / this.sprite.height));
    
};

/**
 * @method PlayingElement#onHover
 * @desc Item's hover event handler
 */
PlayingElement.prototype.onHover = function() {
    this.sprite.blendMode = PIXI.blendModes.ADD;
};
/**
 * @method PlayingElement#onHoverOut
 * @desc Item's hover out event handler
 */
PlayingElement.prototype.onHoverOut = function() {
    this.sprite.blendMode = PIXI.blendModes.NORMAL;
};

/** @method PlayingElement#destroy 
  * @desc destroys object
  */
PlayingElement.prototype.destroy = function() {
    attackSignal.remove(this.checkIntersections, this);
    this.sprite.destroy();
};

/** @method PlayingElement#attack
  * @desc Plays attack animation
  * @arg {PlayingElement} target Object being attacked
  * @returns {Phaser.Tween} Tween being played
  */
PlayingElement.prototype.attack = function(target) {
    Animations[this.attackType](this, target);
};

/** @method PlayingElement#getBounds
  * @desc Returns rectangle, occupied by element
  * @returns {Phaser.Rectangle}
  */
PlayingElement.prototype.getBounds = function() {
    return this.sprite.getBounds();
};

/**
  * @method PlayingElement#savePosition
  * @desc Saves current element posistion
  */
PlayingElement.prototype.savePosition = function() {
    this._prevX = this.sprite.x;
    this._prevY = this.sprite.y;
};

/**
  * @method PlayingElement#restorePosition
  * @desc restores position, previously saved by {@link PlayingElement#savePosition}
  */
PlayingElement.prototype.restorePosition = function() {
    if ((this._prevX != null) && (this._prevY != null)) {
        this.sprite.x = this._prevX;
        this.sprite.y = this._prevY;
    }
};

/**
  * @method PlayingElement#checkIntersections
  * @desc checks if current element intersects any other in game. Returns true and calls PlayingElement#onIntersection if so
  * @returns {Boolean}
  */
PlayingElement.prototype.checkIntersections = function(attacker) {
    if (Phaser.Rectangle.intersects(new Phaser.Rectangle(attacker.sprite.x, attacker.sprite.y, 2, 2),
                                    this.sprite.getBounds()) && attacker != this) {
        attacker.onIntersection(this);
    }
};

/**
  * @method PlayingElement#onIntersection 
  * @desc Intersection event handler
  * @arg {PlayingElement} target Object being attacked
  */
PlayingElement.prototype.onIntersection = function(target) {
    this.restorePosition();
    this.attack(target);
};

/**
 * @class 
 * @classdesc Card class. Represents player's cards on playing table.
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @arg {number} price Price of card
 * @extends PlayingElement
 */ 
function Card(id, imageUrl, x, y, price) {
    PlayingElement.apply(this, arguments);
    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag();

    var priceStyle = { font: String(Math.floor(this.sprite.height / 5)) + 'px Arial', fill: '#ffffff'};
    this.priceText = game.add.text(this.sprite.x, this.sprite.y, '0', priceStyle);

    this.attackLevel = 0;
    this.health = 0;
    this.price = 0;

    var healthStyle = { font: String(Math.floor(this.sprite.height / 5)) + 'px Arial', fill: '#00ff00'};
    this.healthText = game.add.text(this.sprite.x, this.sprite.y + 40, '0', healthStyle);

    var attackStyle = { font: String(Math.floor(this.sprite.height / 5)) + 'px Arial', fill: '#ff0000'};
    this.attackText = game.add.text(this.sprite.x, this.sprite.y + 20, '0', attackStyle);
}

Card.prototype = Object.create(PlayingElement.prototype);
Card.prototype.constructor = PlayingElement;

/** @method Card#destroy
 * @desc destroys object
 * @override
 */
Card.prototype.destroy = function() {
    spawnSignal.remove(this.checkIntersections, this);
    this.sprite.destroy();
    this.priceText.destroy();
    this.healthText.destroy();
    this.attackText.destroy();
};

/**
 * @method Card#onDragStop
 * @desc Drag'n'Drop finish handler
 * @override
 */
Card.prototype.onDragStop = function() {
    spawnSignal.dispatch(this);
};

/**
 * @method Card#spawn
 * @desc Perform a spawn action (use a card);
 */
Card.prototype.spawn = function() {
    Animations['spawn'](this);
    cardDeathSignal.dispatch(this);
};

/**
 * @method Card#setPrice
 * @desc Set displayed price of the card
 * @param {number} price Desired price
 */
Card.prototype.setPrice = function (price) {
    this.priceText.text = price;
    this.price = price;
};

/**
 * @method Card#update
 * @desc Redraws elements of card. Must be called on Phaser.State.Update()
 */
Card.prototype.update = function() {
    this.priceText.x = this.sprite.x;
    this.priceText.y = this.sprite.y;

    this.attackText.x = this.sprite.x;
    this.attackText.y = this.sprite.y + 20;

    this.healthText.x = this.sprite.x;
    this.healthText.y = this.sprite.y + 40;
};

/**
 * @method Card#setHealth
 * @desc Set displayed health level
 * @param {number} health Desired helth level
 */
Card.prototype.setHealth = function(health) {
    this.healthText.text = health;
    this.health = health;
};

/**
 * @method Card#setAttack
 * @desc Set displayed attack level
 * @param {number} attack Desired attack level
 */
Card.prototype.setAttack = function(attack) {
    this.attackText.text = attack;
    this.attackLevel = attack;
};


 /**
 * @class 
 * @classdesc Monster class. Represents monsters spawned on playing table.
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @extends PlayingElement
 */
function Monster(id, imageUrl, x, y) {
    PlayingElement.apply(this, arguments);
    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag();

    this.attackLevel = 0;
    this.health = 0;

    var healthStyle = { font: String(Math.floor(this.sprite.height / 5)) + 'px Arial', fill: '#00ff00'};
    this.healthText = game.add.text(this.sprite.x, this.sprite.y, '0', healthStyle);

    var attackStyle = { font: String(Math.floor(this.sprite.height / 5)) + 'px Arial', fill: '#ff0000'};
    this.attackText = game.add.text(this.sprite.x, this.sprite.y + 20, '0', attackStyle);

    attackSignal.add(this.checkIntersections, this);
    onSpawn.dispatch();
}

Monster.prototype = Object.create(PlayingElement.prototype);
Monster.prototype.constructor = PlayingElement;

/**
  * @method Monster#setHealth
  * @desc Sets health level of this Monster.
  * @arg {number} health Desired health level
  */
Monster.prototype.setHealth = function(health) {
    this.healthText.text = health;
    this.health = health;
};

/**
 * @method Monster#setAttack
 * @desc Set displayed attack level
 * @param {number} attack Desired attack level
 */
Monster.prototype.setAttack = function(attack) {
    this.attackText.text = attack;
    this.attackLevel = attack;
};

/**
 * @method Monster#destroy();
 * @desc Destroys object
 * @override
 */
Monster.prototype.destroy = function() {
    attackSignal.remove(this.checkIntersections, this);
    this.sprite.destroy();
    this.health.text= '';
    this.health.destroy();
    onDeath.dispatch();
};

/**
  * @method Mosnter#update
  * @desc Redraws monster on call. Must be called on global update.
  */
Monster.prototype.update = function() {
    this.healthText.x = this.sprite.x;
    this.healthText.y = this.sprite.y;
    this.attackText.x = this.sprite.x;
    this.attackText.y = this.sprite.y + 20;
};

/**
 * @method Monster#attack
 * @param {PlayingElement} target Target of attack
 * @override
 */
Monster.prototype.attack = function(target) {
    PlayingElement.prototype.attack.call(this, target);
    onAttack.dispatch();
    console.log("Attacking");
};

/**
 * @class 
 * @classdesc Player class. Represents players icon and health level
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @extends PlayingElement
 */
function Player(id, imageUrl, x, y) {
    PlayingElement.apply(this, arguments);
    this.sprite.inputEnabled = true;
    
    var healthStyle = { font: String(Math.floor(this.sprite.height / 5)) + 'px Arial', fill: '#ffffff'};
    this.health = game.add.text(this.sprite.x, this.sprite.y, '0', healthStyle);
}

Player.prototype = Object.create(PlayingElement.prototype);
Player.prototype.constructor = PlayingElement;

/**
  * @method Player#setHealth
  * @desc Sets health level of this Monster.
  * @arg {number} health Desired health level
  */
Player.prototype.setHealth = function(health) {
    this.health.text = health;
};

/**
 * @method Player#destroy
 * @desc Destroys object
 * @override
 */
Player.prototype.destroy = function() {
    this.sprite.destroy();
    this.health.text = '';
    this.health.destroy();
};




