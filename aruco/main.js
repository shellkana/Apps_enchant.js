enchant();
var game;
var video, imageData, detector;
window.onload = function() {
    game = new Game(480, 320);
    video = document.getElementById("video");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video : true
        }, successCallback, errorCallback);

        function successCallback(stream) {
            if (window.webkitURL) {
                video.src = window.webkitURL.createObjectURL(stream);
            } else {
                video.src = stream;
            }
        }

        function errorCallback(error) {
        }

        detector = new AR.Detector();
    }
    game.preload('enchant-sphere.png');
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
        var ita = new PlaneXY(8.5);
        ita.z = -40;
        scene.addChild(ita);
        var ball = new Sphere();
        /**
         * テクスチャを設定する.
         * Sprite3Dのmeshプロパティが表示上の実体となる.
         * テクスチャのソースはpreloadでロードしたデータの他に, canvasオブジェクト, imageオブジェクト, 画像のURLを表す文字列が使用できる.
         */
        ball.mesh.texture.src = game.assets['enchant-sphere.png'];
        ball.z = -20;

        ball.addEventListener('enterframe', function(e) {
            /**
             * オブジェクトを回転させる.
             * rotateYawはオブジェクトのY軸回転.
             */
            this.rotateYaw(0.01);
        });
        scene.addChild(ball);

        var cube = new Cube();
        cube.z = 0;
        cube.vz = -0.1;

        cube.addEventListener('enterframe', function(e) {
            /**
             * オブジェクトを回転させる.
             * rotateRollはオブジェクトのZ軸回転.
             */
            this.rotateYaw(0.01);
            this.rotateRoll(0.01);
            this.z += cube.vz;
            /**
             * オブジェクト同士の当たり判定を計算する.
             * 当たり判定は Sprite3D が持つ Bounding オブジェクト同士で行われる.
             * Bounding オブジェクトを変えることで当たり判定の方法を変更することができる.
             */
            if (this.intersect(ball)) {
                cube.vz = -cube.vz;
                console.log('hit!');
            }
            if (this.z > 0) {
                cube.vz = -cube.vz;
            }
        });
        scene.addChild(cube);
        game.on('enterframe', function() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                snapshot();
                //var markers = detector.detect(imageData);
                //drawCorners(markers);
                //drawId(markers);
            }
        });
        var root = new Sprite(480, 320);
        var surface = new Surface(480, 320);
        root.image = surface;
        game.rootScene.addChild(480, 320);
        function snapshot() {
            surface.context.drawImage(video, 0, 0, 480, 320);
            imageData = context.getImageData(0, 0, 480, 320);
        }

    };
    game.start();
};
