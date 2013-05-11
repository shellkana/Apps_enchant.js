/**
 * nyaky_proto
 */
enchant();
var Nyaky = Class.create(Group, {
    initialize : function() {
        Group.call(this);
        this.mode = 0;
        this.children = [];
        this.maxlength = 7;
        this.minlength = 2;
        this.xlength = 7;
        this.f = 0;
        this.d = 1;
        this.theta = 0;
        var i;
        for ( i = 0; i < 7; i++) {
            this.children[i] = new Sprite(31, 31);
            this.children[i].x = 32 * i;
            this.children[i].backgroundColor = "green";
            this.addChild(this.children[i]);
        }
        this.move = [];
        this.move[0] = function(obj) {
            obj.f = 0;
        };
        this.move[1] = function(obj) {
            obj.f++;
            obj.theta = obj.f / Math.PI / 10;
            obj.xlength = obj.minlength + (obj.maxlength - obj.minlength) / 2 + Math.sin(obj.theta) * (obj.maxlength - obj.minlength) / 2;
            var i;
            for ( i = 0; i < 7; i++) {
                obj.children[i].x = obj.xlength * 32 * i / 7;
            }
        };
        this.move[2] = function(obj) {
            if (obj.children[0].x < 0) {
                obj.d = 1;
            }
            if (obj.children[6].x > 640) {
                obj.d = -1;
            }
            obj.f += obj.d;
            obj.theta = obj.f / Math.PI / 10;
            obj.xlength = obj.minlength + (obj.maxlength - obj.minlength) / 2 + Math.sin(obj.theta) * (obj.maxlength - obj.minlength) / 2;
            var i;
            for ( i = 0; i < 7; i++) {
                if (Math.cos(obj.theta) > 0) {
                    obj.children[i].x = obj.children[0].x + obj.xlength * 32 * i / 7;
                } else {
                    obj.children[6 - i].x = obj.children[6].x - obj.xlength * 32 * i / 7;
                }
            }
        };
        this.move[3] = function(obj) {
            this[2](obj);
            var i = 0;
            for ( i = 0; i < 7; i++) {
                obj.children[i].y = -60 * Math.abs(Math.cos(obj.theta / 2 + Math.PI / 4)) * Math.sin(Math.PI * i / 6);
            }
        };
        this.on("enterframe", function() {
            this.move[this.mode](this);
        });
    }
});
window.onload = function() {
    var game = new Core(640, 320);
    game.onload = function() {
        var n = new Nyaky();
        n.y = 160 - 16;
        var texts = ["四角を並べる", "伸縮させる<br />obj.f++;<br />obj.theta = obj.f / Math.PI / 10;<br />obj.xlength = obj.minlength + (obj.maxlength - obj.minlength) / 2 +<br />        Math.sin(obj.theta) * (obj.maxlength - obj.minlength) / 2;", "前に進める<br />if (Math.cos(obj.theta) > 0) {<br />    obj.children[i].x = obj.children[0].x + obj.xlength * 32 * i / 7;<br />} else {<br />    obj.children[6 - i].x = obj.children[6].x - obj.xlength * 32 * i / 7;<br />}", "形状をかえる<br />obj.children[i].y = -60 * Math.abs(Math.cos(obj.theta / 2 + Math.PI / 4)) * Math.sin(Math.PI * i / 6);"];
        var i;
        var labels = [];
        for ( i = 0; i < 4; i++) {
            labels[i] = new Label(texts[i]);
            labels[i].width = game.width;
            if (i !== 0) {
                labels[i].x = game.width;
            }
            labels[i].y = 10;
            game.rootScene.addChild(labels[i]);
        }
        game.rootScene.addChild(n);
        game.rootScene.on("touchend", function() {
            n.mode++;
            labels[n.mode - 1].tl.moveTo(0, 320, 10);
            labels[n.mode].tl.moveTo(0, 10, 10);
        });
    };
    game.start();
};
