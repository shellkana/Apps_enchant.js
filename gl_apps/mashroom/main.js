enchant();
/**
 * boneをcubeとそれをつなぐcylinderで実体化する
 */
var SkeletonEntity = Class.create(Cube, {
    initialize : function(scale) {
        Cube.call(this, scale / 2);
        this._scale = scale;
    },
    addChildBone : function(bone) {
        this.addChild(bone);
        bone.scale(this._scale, this._scale, this._scale);
    }
});
var BoneEntity = Class.create(Sprite3D, {
    initialize : function(name, pos, rotation) {
        Sprite3D.call(this);
        this.cube = new Cube();
        this.cube.translate(pos[0], pos[1], pos[2]);
        this.addChild(this.cube);
        console.log(this.cube.globalY);
    }
});
window.onload = function() {
    var game = new Core(320, 320);
    game.onload = function() {
        var scene = new Scene3D();
        var ske = new SkeletonEntity(0.1);
        scene.addChild(ske);
        var bone0 = new BoneEntity("bone0", vec3.create([0, 2.5, 0]), quat4.create([0, 0, 0, 1]));
        ske.addChildBone(bone0);
    };
    game.start();
};
