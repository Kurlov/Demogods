/*
 * Playing element class. Ancestor of main playing elements on table, such as cards, player and monsters
 */
function PlayingElement(id, imageUrl, x, y) {
	this._id = id;
	this._imageUrl = imageUrl;
	this._x = x;
	this._y = y;
		
	function onDragStop() {
		this.checkIntersections();
		this.restorePosition();
	}
	
	this._sprite = game.add.image(this._x, this._y, this._id);
	this.fitToScreen();
	this._sprite.events.onDragStart.add(this.savePosition, this);
	this._sprite.events.onDragStop.add(onDragStop, this);
	//TODO: implement dynamic image load
	//dynamicImageLoad(this._id, this._imageUrl, this.cardSprite, this._x, this._y, this.cardSprite);
	//this.cardSprite.loadTexture(this.id);
	
	this._prevX = null;
	this._prevY = null;
	
}

// Calculates size of playing element depending on viewport dimensions
PlayingElement.prototype.fitToScreen = function() {
	var originalSpriteHeight = this._sprite.height;
	this._sprite.height = Math.floor(VIEWPORT_H / TABLE_ZONES);
	//console.log(this._sprite.height);
	this._sprite.width = Math.floor(this._sprite.width / (originalSpriteHeight / this._sprite.height));
	
}

PlayingElement.prototype.destroy = function() {
	this._sprite.destroy();
}

PlayingElement.prototype.attack = function(target) {
	var energyBall = game.add.image(this._sprite.x, this._sprite.y, 'energy_ball');
	var tween = game.add.tween(energyBall);
	function d() {
		energyBall.destroy();
	}
	tween.to( { x: target._x, y: target._y }, 400);
	
	tween.onComplete.add(d);
	tween.start();
}

PlayingElement.prototype.getBounds = function() {
	return this._sprite.getBounds();
}

PlayingElement.prototype.savePosition = function() {
	this._prevX = this._sprite.x;
	this._prevY = this._sprite.y;
}

PlayingElement.prototype.restorePosition = function() {
	if ((this._prevX != null) && (this._prevY != null)) {
		this._sprite.x = this._prevX;
		this._sprite.y = this._prevY;
	}
}

PlayingElement.prototype.checkIntersections = function() {
	for (var i = 0; i < activeElements.length; i++) {
		if (Phaser.Rectangle.intersects(new Phaser.Rectangle(this._sprite.x + Math.floor(this._sprite.width / 2), 
															 this._sprite.y + Math.floor(this._sprite.height / 2), 
															 2, 
															 2), 
										activeElements[i].getBounds()) && 
		   (this != activeElements[i])) {
			this.onIntersection(activeElements[i]);
		}
	}
}

PlayingElement.prototype.onIntersection = function(target) {
	this.restorePosition();
	this.attack(target);
}

/*
 * Card class. Represents player's cards on playing table.
 */ 
function Card(id, imageUrl, x, y) {
	PlayingElement.apply(this, arguments);
	this._sprite.inputEnabled = true;
	this._sprite.input.enableDrag();
	
}

Card.prototype = Object.create(PlayingElement.prototype);
Card.prototype.constructor = PlayingElement;

Card.prototype.destroy = function() {
	this._sprite.destroy();
}

/*
 * Monster class. Represents monsters spawned on playing table.
 */ 
function Monster(id, imageUrl, x, y) {
	PlayingElement.apply(this, arguments);
	this._sprite.inputEnabled = true;
	this._sprite.input.enableDrag();

	
	var healthStyle = { font: String(Math.floor(this._sprite.height / 5)) + "px Arial", fill: "#ffffff"};;
	this._health = game.add.text(this._sprite.x, this._sprite.y, '0', healthStyle);
	
	
}

Monster.prototype = Object.create(PlayingElement.prototype);
Monster.prototype.constructor = PlayingElement;

Monster.prototype.setHealth = function(health) {
	this._health.text = health;
}

Monster.prototype.destroy = function() {
	this._sprite.destroy();
	this._health.text= '';
	this._health.destroy();
}

//Redraws monster on call. Must be called on global update.
Monster.prototype.update = function() {
	this._health.x = this._sprite.x;
	this._health.y = this._sprite.y;
}

/*
 * Player class. Represents player's icon with stats.
 */ 
function Player(id, imageUrl, x, y) {
	PlayingElement.apply(this, arguments);
	this._sprite.inputEnabled = true;
	
	var healthStyle = { font: String(Math.floor(this._sprite.height / 5)) + "px Arial", fill: "#ffffff"};
	this._health = game.add.text(this._sprite.x, this._sprite.y, '0', healthStyle);
}

Player.prototype = Object.create(PlayingElement.prototype);
Player.prototype.constructor = PlayingElement;

Player.prototype.setHealth = function(health) {
	this._health.text = health;
}

Player.prototype.destroy = function() {
	this._sprite.destroy();
	this._health.text = '';
	this._health.destroy();
}




