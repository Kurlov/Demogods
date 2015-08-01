/**
 * @global
 * @desc Animation object. Stores functions responsible for animation.
 */
var Animations = {
    energyBall: function(item, target) {
      var energyBall = game.add.image(item.sprite.x, item.sprite.y, 'energy_ball');
      energyBall.anchor = new Phaser.Point(0.5, 0.5);
      var tween = game.add.tween(energyBall);
      function d() {
          energyBall.destroy();
      }
      tween.to( { x: target.sprite.x, y: target.sprite.y }, 400);
    
      tween.onComplete.add(d);
      return tween.start();
    },
    
    lightning: function(item, target) {
        var lightning1 = game.add.rope(0, 0, 'lightning1', null, [new Phaser.Point(item.sprite.x, item.sprite.y), new Phaser.Point(target.sprite.x, target.sprite.y)]);
        var lightning2 = game.add.rope(0, 0, 'lightning2', null, [new Phaser.Point(item.sprite.x, item.sprite.y), new Phaser.Point(target.sprite.x, target.sprite.y)]);
        var lightning3 = game.add.rope(0, 0, 'lightning3', null, [new Phaser.Point(item.sprite.x, item.sprite.y), new Phaser.Point(target.sprite.x, target.sprite.y)]);
        var lightning4 = game.add.rope(0, 0, 'lightning4', null, [new Phaser.Point(item.sprite.x, item.sprite.y), new Phaser.Point(target.sprite.x, target.sprite.y)]);

        lightning1.bringToTop();
        lightning2.bringToTop();
        lightning3.bringToTop();
        lightning4.bringToTop();

        var tween1 = game.add.tween(lightning1);
        var tween2 = game.add.tween(lightning2);
        var tween3 = game.add.tween(lightning3);
        var tween4 = game.add.tween(lightning4);

        tween1.to( {x: 0, y: 0 }, 50);
        tween1.onComplete.add(tw1);
        tween2.to( {x: 0, y: 0 }, 50);
        tween2.onComplete.add(tw2);
        tween3.to( {x: 0, y: 0 }, 50);
        tween3.onComplete.add(tw3);
        tween4.to( {x: 0, y: 0 }, 50);
        tween4.onComplete.add(tw4);

        var smoke = game.add.emitter(target.sprite.x, target.sprite.y, 50);
        smoke.gravity = -400;
        smoke.setAlpha(1, 0, 1600);
        smoke.makeParticles('smoke', null, 50);

        var sparks = game.add.emitter(target.sprite.x, target.sprite.y, 10);
        sparks.gravity = 100;
        sparks.setAlpha(1, 0, 2000);
        sparks.setScale(0.1, 0.3, 0.1, 0.3);
        sparks.makeParticles('spark', null, 10);

        function tw1() {
            lightning1.destroy();
            lightning2.bringToTop();
            tween2.start();
            smoke.start(true, 800, null, 50);
            sparks.start(true, 1000, null, 10);
        }
        function tw2() {
            lightning2.destroy();
            lightning3.bringToTop();
            tween3.start();
            smoke.start(true, 800, null, 50);
            sparks.start(true, 1000, null, 10);
        }
        function tw3() {
            lightning3.destroy();
            lightning4.bringToTop();
            tween4.start();
            smoke.start(true, 800, null, 50);
            sparks.start(true, 1000, null, 10);
        }
        function tw4() {
            lightning4.destroy();
            stop();
            smoke.start(true, 800, null, 50);
            sparks.start(true, 1000, null, 10);
        }
        function stop() {
            smoke.start(true, 800, null, 50);
            sparks.start(true, 1000, null, 10);
            sparks.start(true, 1000, null, 10);
        }

        return tween1.start();
    }
};