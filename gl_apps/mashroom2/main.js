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
        var skeleton = new Skeleton();
        var bone0 = new Bone("bone0", vec3.create([0, 0, 1]), vec3.create([0, 0, 0]), quat4.identity());
        skeleton.addChild(bone0);
        var bone1 = new Bone("bone1", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.identity());
        bone0.addChild(bone1);
        var bone2 = new Bone("bone2", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.identity());
        bone1.addChild(bone2);
        var bone3 = new Bone("bone3", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.identity());
        bone2.addChild(bone3);
        skeleton.solveFKs();
        console.log(bone0);
        var effector = new Sphere(0.1);
        effector.lat = 0;
        effector.lon = 90;
        effector._globalpos = vec3.create();
        effector.on("enterframe", function() {
            if (game.input.up) {
                this.lon++;
            }
            if (game.input.down) {
                this.lon--;
            }
            if (game.input.left) {
                this.lat++;
            }
            if (game.input.right) {
                this.lat--;
            }
            var r = 2.3;
            this.z = r * Math.sin(this.lon / 180 * Math.PI);
            this.x = r * Math.cos(this.lon / 180 * Math.PI) * Math.sin(this.lat / 180 * Math.PI);
            this.y = r * Math.cos(this.lon / 180 * Math.PI) * Math.cos(this.lat / 180 * Math.PI);
            this._globalpos = this._global
        });
        scene.addChild(effector);
        game.rootScene.on('touchend', function() {
            skeleton.addIKControl(effector, bone3, [ bone1, bone2], Math.PI / 5, 1);
            skeleton.solveIKs();
        });
        game.on('enterframe', function() {
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
