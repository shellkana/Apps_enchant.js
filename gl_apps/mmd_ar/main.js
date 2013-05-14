enchant();

var game;
var video, imageData, detector;

// PMDファイルのパス
var MODEL_PATH = 'model/Miku_Hatsune_Metal.pmd';

// VMDファイルのパス
var MOTION_PATH = 'motion/kishimen.vmd';

window.onload = function() {
    game = new Core(800, 600);
    // v0.2.1よりgame.preloadから読み込めるようになった.
    game.preload(MODEL_PATH, MOTION_PATH);
    var posit = new POS.Posit(20, game.width);
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

    game.onload = function() {

        var scene = new Scene3D();
        scene.getCamera().z = 0;
        scene.getCamera().centerZ = -1;

        // PMDファイル読み込み.
        // colladaの読み込みと同様にcloneかsetして使用する.
        var miku = game.assets[MODEL_PATH].clone();

        // VMDファイル読み込み
        miku.pushAnimation(game.assets[MOTION_PATH]);
        miku.rotatePitch(Math.PI / 2);
        miku.loop = true;
        var cube = new PlaneXY();
        cube.z = 0;
        cube.addChild(miku);
        miku.scale(0.1, 0.1, 0.1);
        scene.addChild(cube);
        game.rootScene.on('enterframe', function() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                snapshot();
                //var markers = detector.detect(imageData);
                //drawCorners(markers);
                //drawId(markers);
            }
        });
        var cvl = new SceneTexture();
        var root = new Sprite(game.width, game.height);
        root.backgroundColor = "red";
        cvl.addChild(root);
        var surface = new Surface(game.width, game.height);
        context = surface.context;
        root.image = surface;
        //game.rootScene.addChild(root);
        function snapshot() {
            context.drawImage(video, 0, 0, game.width, game.height);
            imageData = context.getImageData(0, 0, game.width, game.height);
            var markers = detector.detect(imageData);
            drawCorners(markers);
            drawId(markers);
            if (markers.length > 0) {
                var corners = markers[0].corners;
                for (var i = 0; i < corners.length; ++i) {
                    var corner = corners[i];
                    corner.x = corner.x - (game.width / 2);
                    corner.y = (game.height / 2) - corner.y;
                }
                var pose = posit.pose(corners);
                cube.x = pose.bestTranslation[0] / 17;
                cube.y = pose.bestTranslation[1] / 17;
                cube.z = -pose.bestTranslation[2] / 9;
                var b = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1];
                var mat = [pose.bestRotation[0][0], pose.bestRotation[1][0], pose.bestRotation[2][0], 0, pose.bestRotation[0][1], pose.bestRotation[1][1], pose.bestRotation[2][1], 0, pose.bestRotation[0][2], pose.bestRotation[1][2], pose.bestRotation[2][2], 0, 0, 0, 0, 1];
                cube.rotation = mat4.multiply(mat4.multiply(b, mat, mat4.create()), b);
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
        ita.z = -49;
        ita.scaleX = game.width / game.height;
        ita.mesh.texture.src = cvl._element;
        scene.addChild(ita);
        optimizeSprite3dForTextureScene(ita);

        var label = new Label('0');
        label.font = '24px helvetica';
        game.rootScene.addChild(label);
        var c = 0;
        setInterval(function() {
            label.text = c;
            c = 0;
        }, 1000);
        game.rootScene.addEventListener('enterframe', function(e) {
            c++;
        });

    };
    game.start();
};
