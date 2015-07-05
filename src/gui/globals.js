var VIEWPORT_W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var VIEWPORT_H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var TABLE_ZONES = 6; //weirdly big number, actual is 5

var activeElements = []; // necessary for intersection detection; might need to re-implement using bus

function dynamicImageLoad(id, imageUrl, sprite, x, y, fallback) {
	var image = game.add.image(x,y, fallback);
	var loader = new Phaser.Loader(game);
	loader.image(id, imageUrl);
	loader.onFileComplete.addOnce(_fileComplete, sprite);
	loader.start();
	
	console.log(game.cache.checkImageKey(id));
	return image;
}

function _fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    if (success) this.loadTexture(cacheKey);
}