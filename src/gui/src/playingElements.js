/**
  * @file Contains Playing element class and its children. Responsible for cards, players and monsters logics and render on the table.
  * @author Petrov Alexnader exesa@yandex.ru
  * @requires Phaser.js
  * @requires globals.js
  */



/**
 * @class 
 * @classdesc Playing element class. Ancestor of main playing elements on table, such as cards, player and monsters
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 */
function PlayingElement(id, imageUrl, x, y) {
    this._id = id;
    this._imageUrl = imageUrl;
    this._x = x;
    this._y = y;
        
    
    
    this._sprite = game.add.image(this._x, this._y, this._id);
    //this._sprite.blendMode = PIXI.blendModes.ADD;
    this.fitToScreen();
    this._sprite.events.onDragStart.add(this.savePosition, this);
    this._sprite.events.onDragStop.add(this.onDragStop, this);
    this._sprite.events.onInputOver.add(this.onHover, this);
    this._sprite.events.onInputOut.add(this.onHoverOut, this);
    //TODO: implement dynamic image load
    //dynamicImageLoad(this._id, this._imageUrl, this.cardSprite, this._x, this._y, this.cardSprite);
    //this.cardSprite.loadTexture(this.id);
    
    this._prevX = null;
    this._prevY = null;
    
}
/** @method PlayingElement#onDragStop 
  * @desc DragnDrop stop event handler
  * @returns {@link PlayingElement#checkIntersections} result
  */
PlayingElement.prototype.onDragStop = function() {
        var intersects = this.checkIntersections();
        this.restorePosition();
        return intersects;
};

/** @method PlayingElement#fitToScreen 
  * @desc Resizes sprite according to user's display size
  */
PlayingElement.prototype.fitToScreen = function() {
    var originalSpriteHeight = this._sprite.height;
    this._sprite.height = Math.floor(VIEWPORT_H / TABLE_ZONES);
    //console.log(this._sprite.height);
    this._sprite.width = Math.floor(this._sprite.width / (originalSpriteHeight / this._sprite.height));
    
};

/**
 * @method PlayingElement#onHover
 * @desc Item's hover event handler
 */
PlayingElement.prototype.onHover = function() {
    this._sprite.blendMode = PIXI.blendModes.ADD;
};
/**
 * @method PlayingElement#onHoverOut
 * @desc Item's hover out event handler
 */
PlayingElement.prototype.onHoverOut = function() {
    this._sprite.blendMode = PIXI.blendModes.NORMAL;
};

/** @method PlayingElement#destroy 
  * @desc destroys object
  */
PlayingElement.prototype.destroy = function() {
    this._sprite.destroy();
};

/** @method PlayingElement#attack
  * @desc Plays attack animation
  * @arg {PlayingElement} target Object being attacked
  * @returns {Phaser.Tween} Tween being played
  */
PlayingElement.prototype.attack = function(target) {
    var energyBall = game.add.image(this._sprite.x, this._sprite.y, 'energy_ball');
    var tween = game.add.tween(energyBall);
    function d() {
        energyBall.destroy();
    }
    tween.to( { x: target._x, y: target._y }, 400);
    
    tween.onComplete.add(d);
    return tween.start();
};

/** @method PlayingElement#getBounds
  * @desc Returns rectangle, occupied by element
  * @returns {Phaser.Rectangle}
  */
PlayingElement.prototype.getBounds = function() {
    return this._sprite.getBounds();
};

/**
  * @method PlayingElement#savePosition
  * @desc Saves current element posistion
  */
PlayingElement.prototype.savePosition = function() {
    this._prevX = this._sprite.x;
    this._prevY = this._sprite.y;
};

/**
  * @method PlayingElement#restorePosition
  * @desc restores position, previously saved by {@link PlayingElement#savePosition}
  */
PlayingElement.prototype.restorePosition = function() {
    if ((this._prevX != null) && (this._prevY != null)) {
        this._sprite.x = this._prevX;
        this._sprite.y = this._prevY;
    }
};

/**
  * @method PlayingElement#checkIntersections
  * @desc checks if current element intersects any other in game. Returns true and calls PlayingElement#onIntersection if so
  * @returns {Boolean}
  */
PlayingElement.prototype.checkIntersections = function() {
    var index = -1;
    for (var i = 0; i < activeElements.length; i++) {
        if (Phaser.Rectangle.intersects(new Phaser.Rectangle(this._sprite.x + Math.floor(this._sprite.width / 2), 
                                                             this._sprite.y + Math.floor(this._sprite.height / 2), 
                                                             2, 
                                                             2), 
                                        activeElements[i].getBounds()) && 
           (this != activeElements[i])) {
                index = i;
                break;
            }
    }
    if (index != -1) {
        this.onIntersection(activeElements[index]);
        return true;
    } else {
        return false;
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
 * @extends PlayingElement
 */ 
function Card(id, imageUrl, x, y) {
    PlayingElement.apply(this, arguments);
    this._sprite.inputEnabled = true;
    this._sprite.input.enableDrag();
    activeElements.push(this);
}

Card.prototype = Object.create(PlayingElement.prototype);
Card.prototype.constructor = PlayingElement;

Card.prototype.destroy = function() {
    var gindex = -1;
    for (var i = 0; i < activeElements.length; i++) {
        if (activeElements[i]._id === this._id) {
            gindex = i;
            break;
        }
    }
    //activeElements[gindex].destroy();
    if (gindex != -1) {
        activeElements.splice(gindex, 1);
    }
    
    this._sprite.destroy();
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
    this._sprite.inputEnabled = true;
    this._sprite.input.enableDrag();

    
    var healthStyle = { font: String(Math.floor(this._sprite.height / 5)) + "px Arial", fill: "#ffffff"};
    this._health = game.add.text(this._sprite.x, this._sprite.y, '0', healthStyle);
    activeElements.push(this);
    
}

Monster.prototype = Object.create(PlayingElement.prototype);
Monster.prototype.constructor = PlayingElement;

/**
  * @method Monster#setHealth
  * @desc Sets health level of this Monster.
  * @arg {number} Health level
  */
Monster.prototype.setHealth = function(health) {
    this._health.text = health;
};

Monster.prototype.destroy = function() {
    var gindex = -1;
    for (var i = 0; i < activeElements.length; i++) {
        if (activeElements[i]._id === this._id) {
            gindex = i;
            break;
        }
    }
    //activeElements[gindex].destroy();
    if (gindex != -1) {
        activeElements.splice(gindex, 1);
    }

    this._sprite.destroy();
    this._health.text= '';
    this._health.destroy();
};

/**
  * @method Mosnter#update
  * @desc Redraws monster on call. Must be called on global update.
  */
Monster.prototype.update = function() {
    this._health.x = this._sprite.x;
    this._health.y = this._sprite.y;
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
    this._sprite.inputEnabled = true;
    
    var healthStyle = { font: String(Math.floor(this._sprite.height / 5)) + "px Arial", fill: "#ffffff"};
    this._health = game.add.text(this._sprite.x, this._sprite.y, '0', healthStyle);
}

Player.prototype = Object.create(PlayingElement.prototype);
Player.prototype.constructor = PlayingElement;

/**
  * @method Player#setHealth
  * @desc Sets health level of this Monster.
  * @arg {number} Health level
  */
Player.prototype.setHealth = function(health) {
    this._health.text = health;
};

Player.prototype.destroy = function() {
    this._sprite.destroy();
    this._health.text = '';
    this._health.destroy();
};




