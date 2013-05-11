/*
 * stopwatch gama sample
 */
enchant();
var LargeLabel = Class.create(Label, {
    initialize : function(text) {
        Label.call(this, text);
        this.color="white";
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
    core.preload("image/6_haikei.png", "image/6_bana-.png");
    core.onload = function() {
        core.rootScene.backgroundColor = "#eeeeee";
        var back = new Sprite(640, 960);
        back.image = core.assets["image/6_haikei.png"];
        back.scale(1 / 2, 1 / 2);
        back.y = -335;
        back.x = -160;
        core.rootScene.addChild(back);
        var ruleScene = new RuleScene("2秒と4秒で止めろ");
        core.pushScene(ruleScene);
        var targettime1 = 2;
        var targettime2 = 4;
        var tapcounter = 0;
        var time = 0;
        var bana = new Sprite(640, 147);
        bana.image = core.assets["image/6_bana-.png"];
        bana.originX = 0;
        bana.originY = 0;
        bana.scale(1 / 2, 1 / 2);
        bana.y = 20;
        core.rootScene.addChild(bana);
        var label = new LargeLabel("0.00");
        label.y = 40;
        core.rootScene.addChild(label);
        var stoptime1 = new LargeLabel("3.00-0.00");
        var stoptime2 = new LargeLabel("6.00-0.00");
        core.rootScene.on('enterframe', function() {
            time += 1 / core.fps;
            label.text = (time >= 0.99) ? time.toPrecision(3) : (time < 0.1) ? time.toPrecision(1) : time.toPrecision(2);
        });
        core.rootScene.ontouchstart = function() {
            if (tapcounter === 0) {
                tapcounter = 1;
                stoptime1.text = time.toPrecision(3);
                stoptime1.y = 40 + 73.5;
                this.addChild(stoptime1);
            } else if (tapcounter === 1) {
                stoptime2.text = time.toPrecision(3);
                stoptime2.y = 40 + 147;
                this.addChild(stoptime2);
                alert("score:" + (Math.abs(targettime1 - stoptime1.text) + Math.abs(targettime2 - stoptime2.text)).toPrecision(3) + "秒のずれ");
                core.stop();
            }
        }
    }
    core.start();
}
