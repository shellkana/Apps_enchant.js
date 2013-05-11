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
        ll.x = 320;
        ll.tl.moveTo(-ll.width, 160 - 25, 100).then(function() {
            enchant.Core.instance.popScene();
        });
        this.addChild(ll);
        this.ontouchend = function() {
        }
    }
});
var Wave = Class.create(Group, {
    initialize : function(num) {
        Group.call(this);
        for (var i = 0; i < num; i++) {
            this.addChild(new WaveSprite(320 / num * i))
        }
    }
});
var WaveSprite = Class.create(Sprite, {
    initialize : function(x) {
        Sprite.call(this, 45, 41);
        this.image = enchant.Core.instance.assets["image/3_suiteki.png"]
        //this.backgroundColor = "black";
        this.x = x;
        this.y = 155 + Math.sin(this.x / 20) * 50;
        this.onenterframe = function() {
            this.y = 155 + Math.sin(this.x / 20 + Core.instance.frame / 10*Math.PI) * 50 * Math.sin(Core.instance.frame / 20);
        }
    }
})
window.onload = function() {
    var core = new Core();
    core.fps = 60;
    core.preload("image/3_haikei.png","image/3_suiteki.png");
    core.onload = function() {
        core.rootScene.backgroundColor = "#eeeeee";
        var back = new Sprite(640, 960);
        back.image = core.assets["image/3_haikei.png"];
        back.scale(1 / 2, 1 / 2);
        back.y = -335;
        back.x = -160;
        core.rootScene.addChild(back);
        var ruleScene = new RuleScene("振幅最大でタップ");
        core.pushScene(ruleScene);
        var scene = core.rootScene;
        var wave = new Wave(50);
        scene.addChild(wave);
        scene.ontouchstart = function() {
            alert("score:" + (1 - Math.abs(Math.sin(core.frame / 20))) + "のずれ");
            core.stop();
        }
    }
    core.start();
}
