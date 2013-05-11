/**
 * @fileOverview
 * SceneTexture.gl.enchant.js
 * @version 0.2.0
 * @require enchant.js v0.6.2+
 * @require gl.enchant.js v0.3.6+
 * @author kamakiri01
 *
 * @description
 * This library provides smooth animation Texture for 3D objects.
 * Sameness of freestyle with enchant.js gaming is possible in texture construction.
 *
 */
var SceneTexture = enchant.Class.create(enchant.CanvasLayer,{
    initialize: function(){
        enchant.CanvasLayer.call(this);

        /**
         * NOTE:
         * If you force want to use enchant.js v0.6.0, change code,
         * this._scene = new Scene();
         * 
         * Notest.
         */
        this._scene = new CanvasScene();
        var that = this;
        
        enchant.Core.instance.rootScene.addEventListener('enterframe', function(e){
            that.dispatchEvent(e);
            that.dispatchEvent(enchant.Event.RENDER);
        });

        this.addEventListener('enterframe', function(e){
            this._onexitframe(new enchant.Event(enchant.Event.RENDER));
        });

        this.addEventListener('enterframe', function(e){

            var nodes = this.childNodes.slice();
            var push = Array.prototype.push;

            while (nodes.length) {
                var node = nodes.pop();
                node.age++;
                node.dispatchEvent(e);

                if(node.childNodes){
                    push.apply(nodes, node.childNodes);
                };

                if(enchant.Core.instance.age<1){
                    this._startRendering();
                };
            };
        });
    }
});

/**
 * Add drowing event to parent object.
 * Must be applied for parent object at once.
 */
var optimizeSprite3dForTextureScene = function(target, arg){
    if(target instanceof enchant.gl.Sprite3D){
        var rate;
        if(arg == undefined){
            rate = 1;
        }else{
            rate = arg;
        };
        target._refreshRate = rate;

        target.addEventListener('enterframe', function(){
            if(this.age % this._refreshRate ==0 && this.age != 0){
                this.mesh.texture._write();
            };
        });
    };
}
