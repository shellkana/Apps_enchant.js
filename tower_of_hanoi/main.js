/**
 * enchant.jsを利用したハノイの塔
 */
enchant();
var Hanoi = Class.create(Group, {
    initialize : function(max) {
        Group.call(this);
        this.rings = [];
        this.heights = [max, 0, 0];
        this.n
        this.a
        this.b
        this.c
        this.stack = [];
        this.stack_index = 0;
        for (var i = 0; i < max; i++) {
            this.rings[i] = new Ring(i, max);
            this.addChild(this.rings[i]);
        }
    },
    solve : function(n, a, b, c) {
        if (n > 0) {
            this.solve(n - 1, a, c, b);
            this.move(n, a, c, 18);
            this.solve(n - 1, b, a, c);
        }
    },
    solve2 : function(n, a, b, c) {
        this.push(n, a, b, c);
        while (this.pop()) {
            this.push(this.n, this.a, this.b, this.c);
            while (1) {
                if (this.n == 0) {
                    this.pop();
                    break;
                }
                this.push(this.n - 1, this.a, this.c, this.b);
            }
            if (this.pop()) {
                if (this.n == 0)
                    continue;
                this.move(this.n, this.a, this.c, 18);
                this.push(this.n - 1, this.b, this.a, this.c);
            }
        }
    },
    push : function(n, a, b, c) {
        this.n = this.stack[this.stack_index++] = n;
        this.a = this.stack[this.stack_index++] = a;
        this.b = this.stack[this.stack_index++] = b;
        this.c = this.stack[this.stack_index++] = c;
    },
    pop : function() {
        if (this.stack_index == 0)
            return false;
        this.c = this.stack[--this.stack_index];
        this.b = this.stack[--this.stack_index];
        this.a = this.stack[--this.stack_index];
        this.n = this.stack[--this.stack_index];
        return true;
    },
    move : function(num, from, to, frame) {
        this.tl.delay(frame).then(function() {
            var h = Core.instance.height;
            var w = Core.instance.width;
            this.rings[num - 1].tl.rotateBy(60, frame / 3).and().moveTo(from * w / 3, 0, frame / 3).moveTo(to * w / 3, 0, frame / 3).rotateBy(-60, frame / 3).and().moveTo(to * w / 3, h * (1 - (1 + this.heights[to]) / 10), frame / 3);
            this.heights[from]--;
            this.heights[to]++;
        });
    }
});
var Ring = Class.create(Sprite, {
    initialize : function(num, max) {
        Sprite.call(this, Core.instance.width / 3, Core.instance.height / 10);
        var weight = (num + 1) / max;
        var surface = new Surface(this.width | 0, this.height);
        var context = surface.context;
        context.beginPath();
        context.fillStyle = 'rgba(252, 0, 0, 1)';
        context.fillRect(this.width * (1 - weight ) / 2, 0, this.width * weight, this.height);
        this.image = surface;
        this.y = Core.instance.height - this.height * (max - num);
    }
});
window.onload = function() {
    var game = new Core(320, 320);
    game.onload = function() {
        var hanoi = new Hanoi(6);
        game.rootScene.addChild(hanoi);
        hanoi.solve2(6, 0, 1, 2);
    };
    game.start();
};
