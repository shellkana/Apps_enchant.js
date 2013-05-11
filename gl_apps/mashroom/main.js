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
var _tmpinv = quat4.create();
var _tmpve = vec3.create();
var _tmpvt = vec3.create();
var _tmpaxis = vec3.create();
var _tmpquat = quat4.create();

var SkeletonEntity = Class.create(CubeAndCylinder, {
    initialize : function(scale) {
        CubeAndCylinder.call(this, scale / 2);
        this._origin = vec3.create();
        this._bposition = vec3.create();
        this._brotation = quat4.identity();
        this._globalpos = vec3.create();
        this._globalrot = quat4.identity();
        this._iks = [];
        this._scale = scale;
        this.childBones = [];
        this.mesh.setBaseColor("#00ff00");
    },
    addChildBone : function(bone) {
        this.childBones.push(bone);
        this.addChild(bone);
        bone.parentBone = this;
        bone.skescale = this._scale;
        bone.cube.scale(this._scale, this._scale, this._scale);
    },
    solveIK : function(effector, target, bones, maxangle, iteration) {
        var len, origin;
        vec3.subtract(target._origin, target.parentNode._origin, _tmpinv);
        var threshold = vec3.length(_tmpinv) * 0.1;
        for (var i = 0; i < iteration; i++) {
            vec3.subtract(target._globalpos, effector._global, _tmpinv);
            len = vec3.length(_tmpinv);
            if (len < threshold) {
                break;
            }
            for (var j = 0, ll = bones.length; j < ll; j++) {
                origin = bones[j];
                this._ccd(effector, target, origin, maxangle, threshold);
            }
        }
    },
    _ccd : function(effector, target, origin, maxangle, threshold) {
        vec3.subtract(effector._global, origin._globalpos, _tmpve);
        vec3.subtract(target._globalpos, origin._globalpos, _tmpvt);
        vec3.cross(_tmpvt, _tmpve, _tmpaxis);
        var elen = vec3.length(_tmpve);
        var tlen = vec3.length(_tmpvt);
        var alen = vec3.length(_tmpaxis);

        if (elen < threshold || tlen < threshold || alen < threshold) {
            return;
        }
        var rad = Math.acos(vec3.dot(_tmpve, _tmpvt) / elen / tlen);

        if (rad > maxangle) {
            rad = maxangle;
        }
        vec3.scale(_tmpaxis, Math.sin(rad / 2) / alen, _tmpquat);
        _tmpquat[3] = Math.cos(rad / 2);
        quat4.inverse(origin.parentNode._globalrot, _tmpinv);
        quat4.multiply(_tmpinv, _tmpquat, _tmpquat);
        quat4.multiply(_tmpquat, origin._globalrot, _tmpquat);

        if (origin.constraint) {
            origin.constraint(_tmpquat);
        }

        origin._solve(_tmpquat);
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
        this.onenterframe = function() {
            this.rotation = quat4.toMat4(this._brotation);
        };
        this.constraint = null;
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
        var parent = this.parentBone;
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
        var effector = new Sphere(0.1);
        effector.lat = 0;
        effector.lon = 90;
        console.log(effector);
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
                ske.solveIK(this, target, [bone0, bone1, target], Math.PI * 4, 20);
            }
            var r = 1.5;
            this.z = r * Math.sin(this.lon / 180 * Math.PI);
            this.x = r * Math.cos(this.lon / 180 * Math.PI) * Math.sin(this.lat / 180 * Math.PI);
            this.y = r * Math.cos(this.lon / 180 * Math.PI) * Math.cos(this.lat / 180 * Math.PI);
        });
        scene.addChild(effector);
    };
    game.start();
};
