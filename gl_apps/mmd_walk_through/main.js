enchant();

var game;

// PMDファイルのパス
var MODEL_PATH = 'model/Miku_Hatsune_Ver2.pmd';

// VMDファイルのパス
var MOTION_PATH = 'motion/running.vmd';
var MOTION_PATH2 = 'motion/kishimen.vmd';

window.onload = function() {
	game = new Game(1200, 800);
	game.keybind('Z'.charCodeAt(0), 'a');
	game.keybind('X'.charCodeAt(0), 'b');

	// v0.2.1よりgame.preloadから読み込めるようになった.
	game.preload(MODEL_PATH, MOTION_PATH, MOTION_PATH2);
	game.onload = function() {

		var scene = new Scene3D();
		scene.backgroundColor = [0.5, 0.5, 0.5, 1];
		var light = new DirectionalLight();
		scene.setDirectionalLight(light);
		var camera = new Camera3D();
		camera.x = 0;
		camera.y = 150;
		camera.z = 10;
		camera.centerX = 0;
		camera.centerY = 0;
		camera.centerZ = 5;
		camera.upVectorX = 0;
		camera.upVectorY = 0;
		camera.upVectorZ = 1;
		scene.setCamera(camera);
		var floor = new PlaneXY();
		floor.z = 0;
		floor.scale(250, 250, 1);
		floor.mesh.texture = new Texture("floor.png");
		scene.addChild(floor);
		var sky = new Sphere(250);
		sky.mesh.reverse();
		sky.mesh.setBaseColor('#00ffff');
		sky.mesh.texture.ambient = [1.0, 1.0, 1.0, 1.0];
		sky.mesh.texture.diffuse = [0.0, 0.0, 0.0, 1.0];
		sky.mesh.texture.specular = [0.0, 0.0, 0.0, 1.0];
		scene.addChild(sky);

		// PMDファイル読み込み.
		// colladaの読み込みと同様にcloneかsetして使用する.
		var miku = game.assets[MODEL_PATH].clone();
		miku.rotationSet(new Quat(0, 1, 1, Math.PI));
		miku.scale(0.3, 0.3, 0.3);
		scene.addChild(miku);
		var shadow = new PlaneXZ();
		shadow.y = 0.1;
		shadow.z = -0.2;
		shadow.scale(4, 1, 10);
		shadow.mesh.setBaseColor([0, 0, 0, 1.0]);
		miku.addChild(shadow);

		// VMDファイル読み込み
		miku.pushAnimation(game.assets[MOTION_PATH2]);
		miku.mode = 0;
		miku.rotZ = 0;
		camera.rotZ = 0;
		miku.addEventListener('enterframe', function() {
			if (game.input.left && game.input.up) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				camera.rotZ -= 0.01;
				this.rotZ = camera.rotZ - Math.PI / 4;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (game.input.right && game.input.up) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				camera.rotZ += 0.01;
				this.rotZ = camera.rotZ + Math.PI / 4;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (game.input.down && game.input.left) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				camera.rotZ -= 0.01;
				this.rotZ = camera.rotZ - Math.PI * 3 / 4;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (game.input.down && game.input.right) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				camera.rotZ += 0.01;
				this.rotZ = camera.rotZ + Math.PI * 3 / 4;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;

			} else if (game.input.left) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				camera.rotZ -= 0.02;
				this.rotZ = camera.rotZ - Math.PI / 2;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (game.input.right) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				camera.rotZ += 0.02;
				this.rotZ = camera.rotZ + Math.PI / 2;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (game.input.up) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				this.rotZ = camera.rotZ;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (game.input.down) {
				if (miku.mode === 0) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH]);
					miku.mode = 1;
				}
				var pre = this.rotZ;
				this.rotZ = camera.rotZ - Math.PI;
				this.rotateYaw(-this.rotZ + pre);
				this.x += Math.sin(this.rotZ) * 0.5;
				this.y += Math.cos(this.rotZ) * 0.5;
			} else if (camera.rotZ != this.rotZ) {
				if (miku.mode === 1) {
					miku.clearAnimation();
					miku.pushAnimation(game.assets[MOTION_PATH2]);
					miku.mode = 0;
				}
			} else if (miku.mode === 1) {
				miku.clearAnimation();
				miku.pushAnimation(game.assets[MOTION_PATH2]);
				miku.mode = 0;
			}
			shadow.scaleZ = 4 + miku.mode * 6;
			shadow.z = (1 - miku.mode) * 0.85;
			this.x = Math.min(Math.max(-125, this.x), 125);
			this.y = Math.min(Math.max(-125, this.y), 125);

			if (game.input.a) {
				camera.rotZ -= 0.03;
			} else {
				if (this.z > 0) {
					this.z -= 0.2;
					if (this.z < 0) {
						this.z = 0;
					}
				}
			}
			if (game.input.b) {
				camera.rotZ += 0.03;
			}
			if (game.input.a && game.input.b) {
				camera.rotZ = this.rotZ;
			}

			camera.x = this.x - Math.sin(camera.rotZ) * 50;
			camera.centerX -= (camera.centerX - this.x) / 3;
			camera.centerZ = this.z + 2;
			camera.y = this.y - Math.cos(camera.rotZ) * 50;
			camera.centerY -= (camera.centerY - this.y) / 3;
		});
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
