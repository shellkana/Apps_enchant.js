enchant();
var CubeAndCylinder = Class.create(Cube, {
    initialize : function(scale) {
        Cube.call(this, scale);
        this.cyl = new Cylinder(scale * 2 / 3, scale * 2);
        this.cyl.rotatePitch(Math.PI / 2);
        this.cyl.z = scale;
        this.addChild(this.cyl);
    }
});
window.onload = function() {
    var game = new Core(320, 320);
    game.onload = function() {
        var scene = new Scene3D();
        var ebone0 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone0);
        var ebone1 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone1);
        var ebone2 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone2);
        var ebone3 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone3);
        scene.getCamera().y = 20;
        scene.getCamera().z = -2;
        scene.getCamera().centerZ = 2;
        var skeleton = new Skeleton();
        var bone0 = new Bone("bone0", vec3.create([0, 0, 0]), vec3.create([0, 0, 0]), quat4.identity());
        skeleton.addChild(bone0);
        var bone1 = new Bone("bone1", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.identity());
        bone0.addChild(bone1);
        var mat = mat4.create();
        var constraint = function(q) {
            mat = quat4.toMat4(q);
            var y = Math.asin(-mat[8]);
            var x = Math.atan2(mat[9], mat[10]);
            var z = Math.atan2(mat[4], mat[0]);
            if (Math.abs(y / Math.PI * 180) > 45) {
                y = (y > 0) ? Math.PI / 4 : -Math.PI / 4;
            }
            if (Math.abs(z / Math.PI * 180) > 45) {
                z = (z > 0) ? Math.PI / 4 : -Math.PI / 4;
            }
            if (Math.abs(x / Math.PI * 180) > 45) {
                x = (x > 0) ? Math.PI / 4 : -Math.PI / 4;
            }
            var tmpz = new Quat(0, 0, 1, z);
            var tmpy = new Quat(0, 1, 0, y);
            var tmpx = new Quat(1, 0, 0, x);
            mat = mat4.create()
            mat4.multiply(tmpz.toMat4([]), tmpy.toMat4([]), mat);
            mat4.multiply(mat, tmpx.toMat4([]));
            quat4.set(mat3.toQuat4(mat4.toMat3(mat), mat3.create(), quat4.create()), q);
        };
        var bone2 = new Bone("bone2", vec3.create([0, 0, 2]), vec3.create([0, 0, 1]), quat4.identity());
        bone1.addChild(bone2);
        var bone3 = new Bone("bone3", vec3.create([0, 0, 3]), vec3.create([0, 0, 1]), quat4.identity());
        bone2.addChild(bone3);
        var bone4 = new Bone("bone4", vec3.create([0, 0, 4]), vec3.create([0, 0, 1]), quat4.identity());
        bone3.addChild(bone4);
        bone1.constraint = constraint;
        bone2.constraint = constraint;
        bone3.constraint = constraint;
        skeleton.solveFKs();
        console.log(bone0);
        var effector = new Sphere(0.1);
        effector.lat = 0;
        effector.lon = 90;
        effector.z = 4;
        effector._globalpos = vec3.create();
        var parent = new Sprite3D();
        parent.addChild(effector);
        scene.addChild(parent);
        var offsetX = 0;
        var offsetY = 0;
        var theta = 0;
        var phi = 0;
        var matrix = mat4.create();

        game.rootScene.addEventListener('touchstart', function(e) {
            offsetX = Math.floor(e.x);
            offsetY = Math.floor(e.y);
        });
        game.rootScene.on('touchmove', function(e) {
            effector.x = (160 - e.x) / 45;
            effector.z = (260 - e.y) / 45;
            effector._globalpos = effector._global;
            /*theta -= (e.x - offsetX) / 160;
             offsetX = e.x;
             phi -= (e.y - offsetY) / 160;
             offsetY = e.y;
             mat4.identity(matrix);
             mat4.rotateX(matrix, -phi);
             mat4.rotateY(matrix, -theta);
             parent.rotation = matrix;*/
            skeleton.addIKControl(effector, bone4, [bone1, bone2, bone3], Math.PI / 10000, 1);
            skeleton.solveIKs();
        });
        game.on('enterframe', function() {
            if (game.input.up) {
                effector.y -= 0.1;
            }
            if (game.input.down) {
                effector.y += 0.1;
            }
            ebone0.x = bone0._globalpos[0];
            ebone0.y = bone0._globalpos[1];
            ebone0.z = bone0._globalpos[2];
            ebone0.rotation = quat4.toMat4(bone0._globalrot);

            ebone1.x = bone1._globalpos[0];
            ebone1.y = bone1._globalpos[1];
            ebone1.z = bone1._globalpos[2];
            ebone1.rotation = quat4.toMat4(bone1._globalrot);

            ebone2.x = bone2._globalpos[0];
            ebone2.y = bone2._globalpos[1];
            ebone2.z = bone2._globalpos[2];
            ebone2.rotation = quat4.toMat4(bone2._globalrot);
            ebone3.x = bone3._globalpos[0];
            ebone3.y = bone3._globalpos[1];
            ebone3.z = bone3._globalpos[2];
            ebone3.rotation = quat4.toMat4(bone3._globalrot);
        });
    }
    game.start();
};
