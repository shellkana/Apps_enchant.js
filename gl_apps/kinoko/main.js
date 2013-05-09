enchant();
var game;
window.onload = function() {
    game = new Game(320, 320);
    game.preload({
        enchant : '../../v0.7.0/images/enchant-sphere.png',
        kinoko : 'kuma_run.dae'
    });
    game.onload = function() {
        /**
         * 3D用のシーンを定義する.
         * Sprite3DはScene3Dに追加することで画面に表示される.
         */
        var scene = new Scene3D();
        /**
         * 球体型のオブジェクトをつくる.
         * primitive.gl.enchant.js内のクラスを使用している.
         * primitive.gl.enchant.js内定義されている基本図形はSprite3Dを継承している.
         */
        var ball = new Sphere();
        /**
         * テクスチャを設定する.
         * Sprite3Dのmeshプロパティが表示上の実体となる.
         * テクスチャのソースはpreloadでロードしたデータの他に, canvasオブジェクト, imageオブジェクト, 画像のURLを表す文字列が使用できる.
         */
        ball.mesh.texture.src = game.assets['enchant'];
        ball.z = -20;
        scene.getCamera().z=100;
        console.log(game.assets["kinoko"]);
        scene.addChild(game.assets["kinoko"]);
        

    };
    game.start();
};
