enchant();
var game;
var ebone6;
var CubeAndCylinder = Class.create(Cube, {
    initialize : function(scale) {
        Cube.call(this, scale);
        this.cyl = new Cylinder(scale * 2 / 3, scale * 2);
        this.cyl.rotateRoll(Math.PI / 2);
        this.cyl.x = scale;
        this.addChild(this.cyl);
    }
});
var Kona = Class.create(Sphere, {
    initialize : function(scale) {
        Sphere.call(this, scale);
        this.sleep = Math.floor(Math.random() * 10);
        this.life = Math.floor(Math.random() * 50) + 10;
        this.mesh.setBaseColor(parseTempToColor(Math.random(), 1, 0));
        var v = mat4.multiplyVec3(ebone6.rotation, [0, 1, 0]);
        this.on('enterframe', function() {
            if (this.age % 70 === this.sleep) {
                var s = 2 * Math.random() - 1, t = 2 * Math.PI * Math.random(), r = Math.sqrt(1 - s * s);
                var v = mat4.multiplyVec3(ebone6.rotation, [0.2 * r * Math.cos(t), Math.abs(s) * 3 + 1, 0.2 * r * Math.sin(t)]);
                this.vx = v[0];
                this.vy = v[1];
                this.vz = v[2];
                this.ay = 0.3;
                this.x = ebone6.x;
                this.y = ebone6.y + 15;
                this.z = ebone6.z;
                this.ay = 0.1;
            }
            if (this.age % 70 > this.sleep) {
                this.x += this.vx;
                this.vy -= this.ay;
                this.y += this.vy;
                this.z += this.vz;
            }
            if (this.age % 70 > this.sleep + this.life) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
        });
    }
});
window.onload = function() {
    game = new Game(1500, 1000);
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
        scene.getCamera().z = 80;
        scene.getCamera().y = 80;
        scene.getCamera().centerY = 14.5;
        /*var ebone0 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone0);
        var ebone1 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone1);
        var ebone2 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone2);
        var ebone3 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone3);
        var ebone4 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone4);
        var ebone5 = new CubeAndCylinder(0.5 / 2);
        scene.addChild(ebone5);*/
        //var ebone6 = new CubeAndCylinder(0.5 / 2);
        //scene.addChild(ebone6);
        ebone6 = game.assets["kinoko"].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        console.log(ebone6);
        var constraint = function(q) {
            mat = quat4.toMat4(q);
            y = Math.asin(-mat[8]);
            x = Math.atan2(mat[9], mat[10]);
            z = Math.atan2(mat[4], mat[0]);
            if (Math.abs(y / Math.PI * 180) > 30) {
                y = (y > 0) ? Math.PI / 6 : -Math.PI / 6;
            }
            if (Math.abs(z / Math.PI * 180) > 30) {
                z = (z > 0) ? Math.PI / 6 : -Math.PI / 6;
            }
            if (Math.abs(x / Math.PI * 180) > 30) {
                x = (x > 0) ? Math.PI / 6 : -Math.PI / 6;
            }
            tmpz = quat4.create([0, 0, Math.sin(z / 2), Math.cos(z / 2)]);
            tmpy = quat4.create([0, Math.sin(y / 2), 0, Math.cos(y / 2)]);
            tmpx = quat4.create([Math.sin(x / 2), 0, 0, Math.cos(x / 2)]);
            mat4.multiply(quat4.toMat4(tmpz), quat4.toMat4(tmpy), mat);
            mat4.multiply(mat, quat4.toMat4(tmpx));
            return quat4.set(mat3.toQuat4(mat4.toMat3(mat)), q);
        };
        var sky = new Sphere(250);
        sky.mesh.reverse();
        sky.mesh.setBaseColor('#00ffff');
        sky.mesh.texture.ambient = [1.0, 1.0, 1.0, 1.0];
        sky.mesh.texture.diffuse = [0.0, 0.0, 0.0, 1.0];
        sky.mesh.texture.specular = [0.0, 0.0, 0.0, 1.0];
        scene.addChild(sky);
        var effector = new Sprite3D();
        var c = new Cube();
        effector.addChild(c);
        effector.y = 15;
        effector._globalpos = effector._global;
        scene.addChild(effector);
        scene.addChild(game.assets["kinoko"]);
        var sprite = game.assets["kinoko"].childNodes[1];
        var bone0 = sprite.skeleton.childNodes[0];
        bone0.constraint = constraint;
        var bone1 = bone0.childNodes[0];
        bone1.constraint = constraint;
        var bone2 = bone1.childNodes[0];
        bone2.constraint = constraint;
        var bone3 = bone2.childNodes[0];
        bone3.constraint = constraint;
        var bone4 = bone3.childNodes[0];
        bone4.constraint = constraint;
        var bone5 = bone4.childNodes[0];
        bone5.constraint = constraint;
        var bone6 = bone5.childNodes[0];
        bone6.constraint = constraint;
        game.rootScene.on('touchmove', function(e) {
            effector.x = -(160 * game.width / 320 - e.x) / 8 / game.width * 320;
            effector.y = (260 * game.height / 320 - e.y) / 8 / game.height * 320;
            effector._globalpos = effector._global;
        });
        game.on('enterframe', function() {
            if (game.input.up) {
                effector.z -= 1;
                effector._globalpos = effector._global;
            }
            if (game.input.down) {
                effector.z += 1;
                effector._globalpos = effector._global;
            }
            /*ebone0.x = bone0._globalpos[0];
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
             ebone4.x = bone4._globalpos[0];
             ebone4.y = bone4._globalpos[1];
             ebone4.z = bone4._globalpos[2];
             ebone4.rotation = quat4.toMat4(bone4._globalrot);
             ebone5.x = bone5._globalpos[0];
             ebone5.y = bone5._globalpos[1];
             ebone5.z = bone5._globalpos[2];
             ebone5.rotation = quat4.toMat4(bone5._globalrot);*/
            if (game.frame % 2 == 0) {
                sprite.skeleton.addIKControl(effector, bone6, [bone2, bone3, bone4, bone5], Math.PI / 10000, 1);
                sprite.skeleton.solveIKs();
                sprite.skeleton.calculateTableForIds({
                    joint1 : 0,
                    joint2 : 1,
                    joint3 : 2,
                    joint4 : 3,
                    joint5 : 4,
                    joint6 : 5
                });
                sprite.childNodes[0].mesh.udBoneInfo = sprite.childNodes[0].calculateSkeletonTable(sprite.childNodes[0].divisioninfo.dividedIndices, sprite.skeleton.table, 6);
                ebone6.x = bone6._globalpos[0];
                ebone6.y = bone6._globalpos[1] - 15;
                ebone6.z = bone6._globalpos[2];
                ebone6.rotation = quat4.toMat4(bone6._globalrot);
            }
        });
        for (var i = 0; i < 200; i++) {
            var b = new Kona(0.1);
            scene.addChild(b);
        }
    };
    game.start();
};
var parseTempToColor = function(temp, maxTemp, minTemp) {
    qtTemp = (maxTemp - minTemp) / 5;
    if (temp < minTemp) {
        temp = minTemp;
    } else if (temp > maxTemp) {
        temp = maxTemp;
    }
    if (temp < (minTemp + qtTemp)) {
        color = [1 - (temp - minTemp) / qtTemp, 0, 1, 0.5];
    } else if (temp < (minTemp + qtTemp * 2)) {
        color = [0, (temp - minTemp - qtTemp) / qtTemp, 1, 0.5];
    } else if (temp < (minTemp + 3 * qtTemp)) {
        color = [0, 1, (3 - (temp - minTemp) / qtTemp), 0.5];
    } else if (temp < (minTemp + 4 * qtTemp)) {
        color = [(temp - minTemp) / qtTemp - 3, 1, 0, 0.5];
    } else {
        color = [1, ((maxTemp - temp) / qtTemp), 0, 0.5];
    }
    return color;
};
