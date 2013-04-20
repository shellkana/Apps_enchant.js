enchant();
var game;
var video, imageData, detector;
window.onload = function() {
    game = new Game(480, 320);
    var posit = new POS.Posit(15, 480);
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
            //this.rotateYaw(0.01);
            //this.rotateRoll(0.01);
            //this.z += cube.vz;
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
        game.rootScene.on('enterframe', function() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                snapshot();
                var markers = detector.detect(imageData);
                //drawCorners(markers);
                //drawId(markers);
            }
        });
        var cvl = new SceneTexture();
        var root = new Sprite(480, 320);
        root.backgroundColor = "red";
        cvl.addChild(root);
        var surface = new Surface(480, 320);
        context = surface.context;
        root.image = surface;
        //game.rootScene.addChild(root);
        function snapshot() {
            context.drawImage(video, 0, 0, 480, 320);
            imageData = context.getImageData(0, 0, 480, 320);
            var markers = detector.detect(imageData);
            drawCorners(markers);
            drawId(markers);
            if (markers.length > 0) {
                var corners = markers[0].corners;
                for (var i = 0; i < corners.length; ++i) {
                    var corner = corners[i];
                    corner.x = corner.x - (480 / 2);
                    corner.y = (320 / 2) - corner.y;
                }
                var pose = posit.pose(corners);
                cube.x = pose.bestTranslation[0] / 10;
                cube.y = pose.bestTranslation[1] / 10;
                cube.z = -pose.bestTranslation[2] / 10;
                cube.rotation = [pose.bestRotation[0][0], pose.bestRotation[0][1], pose.bestRotation[0][2], 0, pose.bestRotation[1][0], pose.bestRotation[1][1], pose.bestRotation[1][2], 0, pose.bestRotation[2][0], pose.bestRotation[2][1], pose.bestRotation[2][2], 0, 0, 0, 0, 1];
            }
        }

        function drawCorners(markers) {
            var corners, corner, i, j;

            context.lineWidth = 3;

            for ( i = 0; i !== markers.length; ++i) {
                corners = markers[i].corners;

                context.strokeStyle = "red";
                context.beginPath();

                for ( j = 0; j !== corners.length; ++j) {
                    corner = corners[j];
                    context.moveTo(corner.x, corner.y);
                    corner = corners[(j + 1) % corners.length];
                    context.lineTo(corner.x, corner.y);
                }

                context.stroke();
                context.closePath();

                context.strokeStyle = "green";
                context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
            }
        }

        function drawId(markers) {
            var corners, corner, x, y, i, j;

            context.strokeStyle = "blue";
            context.lineWidth = 1;

            for ( i = 0; i !== markers.length; ++i) {
                corners = markers[i].corners;

                x = Infinity;
                y = Infinity;

                for ( j = 0; j !== corners.length; ++j) {
                    corner = corners[j];

                    x = Math.min(x, corner.x);
                    y = Math.min(y, corner.y);
                }

                context.strokeText(markers[i].id, x, y)
            }
        }

        var ita = new PlaneXY(8.5);
        ita.z = -40;
        ita.scaleX = 1.5;
        ita.mesh.texture.src = cvl._element;
        scene.addChild(ita);
        optimizeSprite3dForTextureScene(ita);
    };
    game.start();
};
