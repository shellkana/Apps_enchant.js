/*
 * mini gama sample
 */
enchant();
var LargeLabel = Class.create(Label, {
    initialize: function(text) {
        Label.call(this, text);
        this.font = "50px sans-serif"
        this.width = (this._boundWidth + 10 > 320) ? this._boundWidth + 10 : 320;
        this.text = text;
        this.textAlign = "center";
    }
});
//右から出てきて左に消えていくラベルがでてくるシーン
var RuleScene = Class.create(Scene, {
    initialize: function(text) {
        Scene.call(this);
        var ll = new LargeLabel(text);
        ll.y = 160 - 25;
        ll.x = 320;
        ll.tl.moveTo(-ll.width, 160 - 25, 100).then(function() {
            enchant.Core.instance.popScene();
        });
        this.addChild(ll);
        this.ontouchend = function() {}
    }
});
window.onload = function() {
    var core = new Core();
    core.fps = 60;
    core.preload("image/1_haikei.png", "image/1_shuriken.png", "http://a0.twimg.com/profile_images/1766614482/twitter_normal.png");
    core.onload = function() {
        core.rootScene.backgroundColor = "#eeeeee";
        var back = new Sprite(640, 960);
        back.image = core.assets["image/1_haikei.png"];
        back.scale(1 / 2, 1 / 2);
        back.y = -335;
        back.x = -160;
        core.rootScene.addChild(back);
        var ruleScene = new RuleScene("重なったらタップ");
        core.pushScene(ruleScene);
        var scene = core.rootScene;
        var g1 = new Group();
        var sikaku1 = new Sprite(112, 112);
        sikaku1.image = core.assets["http://a0.twimg.com/profile_images/1766614482/twitter_normal.png"];
        console.log(core.assets["http://a0.twimg.com/profile_images/1766614482/twitter_normal.png"].toDataURL()); //.toDataUrl());
        console.log(core.assets["http://a0.twimg.com/profile_images/1766614482/twitter_normal.png"].context.getImageData(0, 0, 112, 112));
        //sikaku1.rotation = 45;
        sikaku1.x = 25;
        sikaku1.y = 25;
        sikaku1.originX = 0;
        sikaku1.originY = 0;
        sikaku1.scale(1 / 2, 1 / 2);
        g1.x = 104;
        g1.y = 104;
        g1.addChild(sikaku1);
        g1.onenterframe = function() {
            this.rotation += 9 / 2;
        };
        scene.addChild(g1);
        var g2 = new Group();
        var sikaku2 = new Sprite(112, 112);
        sikaku2.image = core.assets["image/1_shuriken.png"];
        //sikaku2.rotation = 45;
        sikaku2.x = -55 - 32;
        sikaku2.y = -55 - 32;
        sikaku2.originX = 0;
        sikaku2.originY = 0;
        sikaku2.scale(1 / 2, 1 / 2);
        g2.addChild(sikaku2);
        g2.x = 320 - 104;
        g2.y = 320 - 104;
        g2.onenterframe = function() {
            this.rotation += 9 / 2;
            if (this.rotation % 360 == 0) {
                sikaku2.backgroundColor = "white";
                sikaku2.tl.delay(2).then(function() {
                    sikaku2.backgroundColor = null;
                });
            }
        };
        scene.addChild(g2);
        scene.ontouchend = function() {
            alert("score:" + ((g1.rotation % 360 > 180) ? 360 - g1.rotation % 360 : g1.rotation % 360) + "度のずれ");
            core.stop();
        }
    }
    core.start();
}