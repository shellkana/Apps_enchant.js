/*
 * stopwatch gama sample
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
        ll.scaleX = 4;
        ll.scaleY = 4;
        //ll.x = 320;
        ll.tl.scaleTo(0.5, 0.5, 40, enchant.Easing.QUAD_EASEOUT).delay(25).moveTo(-320, 160 - 25, 25).then(function() {
            enchant.Core.instance.popScene();
        });
        this.addChild(ll);
        this.ontouchend = function() {
        }
    }
})
window.onload = function() {
    var core = new Core();
    core.fps = 60
    core.preload("image/4_haikei.png", "image/4_hibana.png");
    core.onload = function() {
        core.rootScene.backgroundColor = "#eeeeee";
        var back = new Sprite(640, 960);
        back.image = core.assets["image/4_haikei.png"];
        back.scale(1 / 2, 1 / 2);
        back.y = -335;
        back.x = -160
        core.rootScene.addChild(back);
        var ruleScene = new RuleScene("赤い線をなぞれ");
        core.pushScene(ruleScene);
        var scene = core.rootScene;
        var tapcount = 0;
        var v = 3;
        var target1 = 20 + 140 * Math.random();
        var target2 = 170 + 140 * Math.random();
        var bsen1 = new Sprite(2, 320);
        bsen1.backgroundColor = "green";
        bsen1.x = 100;
        scene.addChild(bsen1);
        var bsen2 = new Sprite(2, 320);
        bsen2.x = 320 - 100;
        bsen2.backgroundColor = "green";
        scene.addChild(bsen2);
        var rsen1 = new Sprite(2, target1);
        rsen1.backgroundColor = "red";
        rsen1.x = 100;
        scene.addChild(rsen1);
        var rsen2 = new Sprite(2, target2 - target1);
        rsen2.y = target1;
        rsen2.x = 320 - 100;
        rsen2.backgroundColor = "red";
        scene.addChild(rsen2);
        var rsen3 = new Sprite(2, 320 - target2);
        rsen3.y = target2;
        rsen3.x = 100;
        rsen3.backgroundColor = "red";
        scene.addChild(rsen3);
        var g = new Group();
        scene.addChild(g);
        var hibana = new Sprite(247, 140);
        hibana.image = core.assets["image/4_hibana.png"];
        //hibana.originX = 0;
        //hibana.originY = 0;
        hibana.scale(1 / 2, 1 / 2)
        hibana.x = 40 - 247 / 4;
        hibana.y = -20 - 140 / 4;
        var frame = 0;
        hibana.on('enterframe', function() {
            this.scaleX = Math.random() * (1 - Math.floor((core.frame % 6) / 2)) / 2;
            this.scaleY = Math.floor(this.scaleX);
        });
        g.addChild(hibana);
        g.onenterframe = function() {
            this.y += v;
            if (tapcount === 0) {
                rsen1.height -= v;
                rsen1.y += v;
            } else if (tapcount === 1) {
                rsen2.height -= v;
                rsen2.y += v;
            } else if (tapcount === 2) {
                rsen3.height -= v;
                rsen3.y += v;
            }
            if (this.y > 320) {
                alert("score:" + (Math.abs(rsen1.height) + Math.abs(rsen2.height)) + "のずれ");
                core.stop();
            }
        };
        scene.ontouchstart = function() {
            if (tapcount === 0) {
                g.x = 120;
                g.y = target1;
            } else if (tapcount === 1) {
                g.x = 0;
                g.y = target2;
            }
            if (tapcount !== 2) {
                tapcount += 1;
            }

        }
    }
    core.start();
}
