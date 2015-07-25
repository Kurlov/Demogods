/**
  * @global
  * @type {number}
  * @desc User's viewport width
  */
var VIEWPORT_W = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
/**
  * @global
  * @type {number}
  * @desc User's viewport height
  */
var VIEWPORT_H = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
/**
  * @global
  * @constant
  * @type {number}
  * @desc Number of lines of elements, which should fit into screen
  */
var TABLE_ZONES = 6; //weirdly big number, actual is 5
/**
  * @global
  * @type {Array}
  * @desc Contains all existing PlayingElements for intersection detection.
  */
var activeElements = []; // necessary for intersection detection; might need to re-implement using bus

function dynamicImageLoad(id, imageUrl, item) {
    var loader = new Phaser.Loader(game);
    loader.image(id, imageUrl);
    loader.onLoadComplete.add(function() {item.loadSprite(); item.fitToScreen();});
    loader.start();
    
    console.log(game.cache.checkImageKey(id));
}