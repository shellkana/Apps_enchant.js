enchant();
var game;
window.onload = function() {
    game = new Game(320, 320);
    game.preload({
        enchant : '../../v0.7.0/images/enchant-sphere.png',
        kinoko : 'kinoko.dae'
    });
    game.onload = function() {
        /**
         * 3D用のシーンを定義する.
         * Sprite3DはScene3Dに追加することで画面に表示される.
         */
        var scene = new Scene3D();
        scene.getCamera().z = 100;
        var sky = new Sphere(250);
        sky.mesh.reverse();
        sky.mesh.setBaseColor('#00ffff');
        sky.mesh.texture.ambient = [1.0, 1.0, 1.0, 1.0];
        sky.mesh.texture.diffuse = [0.0, 0.0, 0.0, 1.0];
        sky.mesh.texture.specular = [0.0, 0.0, 0.0, 1.0];
        scene.addChild(sky);
        var c=new Cube();
        c.y=15;
        scene.addChild(c);
        console.log(game.assets["kinoko"]);
        scene.addChild(game.assets["kinoko"]);
        var sprite = game.assets["kinoko"].childNodes[1];
        console.log(sprite.skeleton);
        console.log(sprite.childNodes[0].mesh);
        console.log(game.assets["kinoko"].childNodes[0]);
    };
    game.start();
};
