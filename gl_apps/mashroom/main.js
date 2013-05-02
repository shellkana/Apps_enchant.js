enchant();
/**
 * boneをcubeとそれをつなぐcylinderで実体化する
 */
var CubeAndCylinder = Class.create(Cube, {
    initialize : function(scale) {
        Cube.call(this, scale);
        this.cyl = new Cylinder(scale * 2 / 3, scale * 2);
        this.cyl.rotatePitch(Math.PI / 2);
        this.cyl.z = scale;
        this.addChild(this.cyl);
    }
});
var SkeletonEntity = Class.create(CubeAndCylinder, {
    initialize : function(scale) {
        CubeAndCylinder.call(this, scale / 2);
        this._bposition = vec3.create();
        vec3.set(position, this._bposition);
        this._brotation = quat4.create();
        quat4.set(rotation, this._brotation);
        this._name = name;
        this._origin = vec3.create();
        vec3.set(head, this._origin);
        this._globalpos = vec3.create();
        vec3.set(head, this._globalpos);
        this._globalrot = quat4.identity();
        this._scale = scale;
        this.childBones = [];
        this.mesh.setBaseColor("#00ff00");
    },
    addChildBone : function(bone) {
        this.childBones.push(bone);
        this.addChild(bone);
        bone.skescale = this._scale;
        bone.cube.scale(this._scale, this._scale, this._scale);
    },
    solveIK : function(effector, target, bones, maxangle, irteration) {

    },
    solveFKs : function() {
        for (var i = 0, l = this.childBones.length; i < l; i++) {
            child = this.childBones[i];
            child._solveFK();
        }
    }
});
var BoneEntity = Class.create(Sprite3D, {
    initialize : function(name, head, position, rotation) {
        Sprite3D.call(this);
        this.childBones = [];
        this._bposition = vec3.create();
        vec3.set(position, this._bposition);
        this._brotation = quat4.create();
        quat4.set(rotation, this._brotation);
        this._name = name;
        this._origin = vec3.create();
        vec3.set(head, this._origin);
        this._globalpos = vec3.create();
        vec3.set(head, this._globalpos);
        this._globalrot = quat4.identity();
        this.cube = new CubeAndCylinder(1 / 2);
        this.addChild(this.cube);
        this.translate(position[0], position[1], position[2]);
        this.skescale = 1;
    },
    addChildBone : function(bone) {
        this.addChild(bone);
        this.childBones.push(bone);
        bone.skescale = this.skescale;
        bone.cube.scale(this.skescale, this.skescale, this.skescale);
    },
    _solveFK : function() {
        var child;
        this._applyPose();
        for (var i = 0, l = this.childBones.length; i < l; i++) {
            child = this.childBones[i];
            child._solveFK();
        }
    },
    _applyPose : function() {
        var parent = this.parentNode;
        quat4.multiply(parent._globalrot, this._brotation, this._globalrot);
        quat4.multiplyVec3(parent._globalrot, this._bposition, this._globalpos);
        vec3.add(parent._globalpos, this._globalpos, this._globalpos);
    },
    _solve : function(quat) {
        quat4.normalize(quat, this._brotation);
        this._solveFK();
    }
});
window.onload = function() {
    var game = new Core(320, 320);
    game.onload = function() {
        var scene = new Scene3D();
        scene.getCamera().y = 20;
        scene.getCamera().z = -2;
        var ske = new SkeletonEntity(0.5);
        scene.addChild(ske);
        var bone0 = new BoneEntity("bone0", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.create([0, 0, 0, 1]));
        ske.addChildBone(bone0);
        var bone1 = new BoneEntity("bone1", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.create([0, 0, 0, 1]));
        bone0.addChildBone(bone1);
        var target = new BoneEntity("target", vec3.create([0, 0, 1]), vec3.create([0, 0, 1]), quat4.create([0, 0, 0, 1]));
        bone1.addChildBone(target);
        ske.solveFKs();
        console.log(bone1._globalpos);
        var effector = new Sphere(0.1);
        effector.lat = 0;
        effector.lon = 90;
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
            this.z = 2 * Math.sin(this.lon / 180 * Math.PI);
            this.x = 2 * Math.cos(this.lon / 180 * Math.PI) * Math.sin(this.lat / 180 * Math.PI);
            this.y = 2 * Math.cos(this.lon / 180 * Math.PI) * Math.cos(this.lat / 180 * Math.PI);
            ske.solveIK(effector, target, [bone0, bone1, target], Math.PI / 2, 20);
        });
        scene.addChild(effector);
    };
    game.start();
};
