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
 * @desc Signal for intersection check for {@link PlayingElement}
 * @private
 * @type {Phaser.Signal}
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.Signal.html}
 */
var attackSignal = new Phaser.Signal();

/**
 * @global
 * @desc Signal dispatched when {@link PlayingElement} attack happens
 * @type {Phaser.Signal}
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.Signal.html}
 */
var onAttack = new Phaser.Signal();

/**
 * @global
 * @desc Signal dispatched when {@link Monster} spawns on table
 * @type {Phaser.Signal}
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.Signal.html}
 */
var onSpawn = new Phaser.Signal();

/**
 * @global
 * @desc Signal dispatched when {@link Monster} dies
 * @type {Phaser.Signal}
 * @see {@link http://phaser.io/docs/2.4.2/Phaser.Signal.html}
 */
var onDeath = new Phaser.Signal();

/**
 * @global
 * @function dynamicImageLoad
 * @desc Does sprite loading 'on the fly', after preload state. Used by {@link PlayingElement}
 * @param {string} id Unique id of sprite (same as card's id)
 * @param {string} imageUrl URL where sprite should be obtained
 * @param {PlayingElement} item Item which sprite being added
 */
function dynamicImageLoad(id, imageUrl, item) {
    var loader = new Phaser.Loader(game);
    loader.image(imageUrl, imageUrl);
    loader.onLoadComplete.add(function() {item.loadSprite(); item.fitToScreen();});
    loader.start();
    
    console.log(game.cache.checkImageKey(id));
}