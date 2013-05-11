/*
 * huriko game sample
 */
enchant();
var LargeLabel = Class.create(Label, {
    initialize : function(text) {
        Label.call(this, text);
        this.font = "50px sans-serif"
        this.width = (this._boundWidth + 10 > 320) ? this._boundWidth + 10 : 320;
        this.text = text;
        this.textAlign = "center";
    }
});
//右から出てきて左に消えていくラベルがでてくるシーン
var RuleScene = Class.create(Scene, {
    initialize : function(text) {
        Scene.call(this);
        var ll = new LargeLabel(text);
        ll.y = 160 - 25;
        ll.x = 320;
        ll.tl.moveTo(-ll.width, 160 - 25, 100).then(function() {
            enchant.Core.instance.popScene();
        });
        this.addChild(ll);
        this.ontouchend = function() {
        }
    }
});
var Pendulum = Class.create(Group, {
    initialize : function(num, height, img1, img2) {
        Group.call(this);
        var g1 = new Group();
        g1.x = height + (10 + 4.5) * 2;
        var s1 = new Sprite(40, 40);
        s1.originX = 0;
        s1.originY = 0;
        s1.scale(9 * 2 / 40, 9 * 2 / 40);
        //s1.backgroundColor = "green";
        s1.image = img1;
        s1.y = height;
        s1.x = -4.5 * 2;
        g1.addChild(s1);
        this.addChild(g1);
        g1.rotation = 20 + Math.random() * 90;
        g1.vtheta = 0;
        g1.onenterframe = function() {
            this.vtheta += 0.2 * Math.sin(this.rotation / 180 * Math.PI);
            this.rotation -= this.vtheta;
            if (this.rotation < 0) {
                this.rotation = 0;
                g2.vtheta = this.vtheta;
                this.vtheta = 0;
            }
        }
        var g2 = new Group();
        g2.x = height + (num * 9 + 4.5 + 1) * 2;
        var s2 = new Sprite(40, 40);
        s2.image = img1;
        s2.originX = 0;
        s2.originY = 0;
        s2.scale(9 * 2 / 40, 9 * 2 / 40);
        //s2.backgroundColor = "green";
        s2.y = height;
        s2.x = -4.5 * 2;
        g2.addChild(s2);
        this.addChild(g2);
        g2.rotation = 0;
        g2.vtheta = 0;
        g2.onenterframe = function() {
            this.vtheta += 0.2 * Math.sin(this.rotation / 180 * Math.PI);
            this.rotation -= this.vtheta;
            if (this.rotation > 0) {
                this.rotation = 0;
                g1.vtheta = this.vtheta;
                this.vtheta = 0;
            }
        }
        for (var i = 0; i < num - 2; i++) {
            var s = new Sprite(40, 40);
            //s.backgroundColor = "black";
            s.originX = 0;
            s.originY = 0;
            s.scale(9 * 2 / 40, 9 * 2 / 40);
            s.image = img2;
            s.x = height + (9 + 10 + i * 9) * 2;
            s.y = height;
            this.addChild(s);
        }

    }
});
window.onload = function() {
    var core = new Core();
    core.fps = 60;
    core.preload("image/5_ball1.png", "image/5_ball2.png", "image/5_haikei.png");
    core.onload = function() {
        core.rootScene.backgroundColor = "#eeeeee";

        var back = new Sprite(640, 960);
        back.image = core.assets["image/5_haikei.png"];
        back.scale(1 / 2, 1 / 2);
        back.y = -335;
        back.x = -160;
        core.rootScene.addChild(back);
        var ruleScene = new RuleScene("振り子がそろったらタップ");
        core.pushScene(ruleScene);
        var scene = core.rootScene;
        var pendulum = new Pendulum(7, 75, core.assets["image/5_ball1.png"], core.assets["image/5_ball2.png"]);
        pendulum.y = 110;
        scene.addChild(pendulum);
        scene.ontouchstart = function() {
            console.log(pendulum);
            alert("score:" + Math.max(pendulum.childNodes[0].rotation, -pendulum.childNodes[1].rotation) + "のずれ");
            core.stop();
        }
    }
    core.start();
}
