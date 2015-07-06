/*
 * tableZone class. Provides interface for card manipulation on the table zone (player cards, active monsters, etc). Renders zone background.
 */
function TableZone(backgroundImage) {
	this._id = backgroundImage
	this._x = 0.9 * VIEWPORT_W;
	this._sprite = game.add.image(-100, -100, this._id);
	this.fitToScreen();
	
	this._items = [];
	this._elementWidth = 150; //TODO: think of automatic calculation (needs precise sprite sizes)
	
}

TableZone.prototype.fitToScreen = function () {
	var originalSpriteHeight = this._sprite.height;
	this._sprite.height = Math.floor(1.2 * VIEWPORT_H / TABLE_ZONES);
	//console.log(this._sprite.height);
	//this._sprite.width = Math.floor(this._sprite.width / (originalSpriteHeight / this._sprite.height));
	this._sprite.width = Math.floor(0.9 * VIEWPORT_W);
}

//add PlayingElement to TableZone
TableZone.prototype.addItem = function (id, imageUrl) {
	var item = new PlayingElement(id, imageUrl, this._elementWidth * this._items.length, this._y);
	this._items.push(item);
	//activeElements.push(item);
}

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
	}
}


/*
 * PlayerDeck zone class. 
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

PlayerDeck.prototype.addItem = function (id, imageUrl) {
	var item = new Card(id, imageUrl, this._elementWidth * this._items.length + this._x, this._y);
	this._items.push(item);
	//activeElements.push(item);
}

/*
 * PlayingArea zone class, where monsters spawn
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

PlayingArea.prototype.addItem = function (id, imageUrl, health) {
	var item = new Monster(id, imageUrl, this._elementWidth * this._items.length, this._y + 50);
	item.setHealth(health);
	this._items.push(item);
	//activeElements.push(item);
}



PlayingArea.prototype.update = function() {
	for (var i = 0; i < this._items.length; i++) {
		this._items[i].update();
	}
}

