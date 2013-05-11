/*
 *one tap gama sample
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
})
window.onload = function() {
    var core = new Core();
    core.fps = 60;
    core.preload("image/2_haikei.png", "image/2_ki.png", "image/2_kisen.png");
    core.onload = function() {
        core.rootScene.backgroundColor = "#eeeeee";
        var back = new Sprite(640, 960);
        back.image = core.assets["image/2_haikei.png"];
        back.scale(1 / 2, 1 / 2);
        back.y = -335;
        back.x = -160;
        core.rootScene.addChild(back);
        var ruleScene = new RuleScene("落ちてくる木を線のところで切れ");
        core.pushScene(ruleScene);
        var kirisen = new Sprite(320, 2);
        kirisen.y = 160
        kirisen.backgroundColor = "red";
        core.rootScene.addChild(kirisen);
        var group = new Group();
        group.vy = 0;
        var wood = new Sprite(133, 540);
        wood.image = core.assets["image/2_ki.png"];
        wood.originX = 0;
        wood.originY = 0;
        wood.scale(270 / 540, 270 / 540);
        group.addChild(wood);
        var kisen = new Sprite(111, 24);
        kisen.image = core.assets["image/2_kisen.png"];
        kisen.scale(1 / 2, 1 / 2);
        kisen.x = -20;
        group.addChild(kisen);
        var sen = new Sprite(50, 2);
        //sen.backgroundColor = "red";
        sen.x = 10;
        sen.y = Math.random() * 250 + 10;
        kisen.y = sen.y - 12;
        group.addChild(sen);
        core.rootScene.addChild(group);
        group.tl.moveTo(160 - 25, -320, 10).then(function() {
            group.on('enterframe', function() {
                this.vy += 0.2;
                this.y += this.vy;
            });
        });
        core.rootScene.on("touchstart", function() {
            alert("score:" + (group.y + sen.y - kirisen.y) + "ずれ");
            core.stop();
        })
    }
    core.start();
}
