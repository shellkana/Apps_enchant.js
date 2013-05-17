/*var PARTICLE_VERTEX_SHADER_SOURCE = '\n\
 attribute vec3 aVertexPosition;\n\
 \n\
 uniform mat4 uMVMatrix;\n\
 uniform mat4 uPMatrix;\n\
 \n\
 void main(void) {\n\
 gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
 }\n\
 ';
 var PARTICLE_FRAGMENT_SHADER_SOURCE = '\n\
 precision mediump float;\n\
 \n\
 void main(void) {\n\
 gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\
 }\n\
 ';*/
enchant();
var game;
var PMesh = Class.create(Mesh, {
    initialize : function() {
        Mesh.call(this);
        var deltaBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
        this._addAttribute(deltaBuffer, 'delta');
    },
    _addAttribute : function(buffer, prop) {
        this['_' + prop] = buffer;
        Object.defineProperty(this, prop, {
            get : function() {
                return this['_' + prop]._array;
            },
            set : function(array) {
                this['_' + prop]._array = array;
                this['_' + prop]._bufferData();
            }
        });
    }
});
var Particle = Class.create(Sprite3D, {
    initialize : function(numParticle, size) {
        Sprite3D.call(this);
        this.mesh = new PMesh();
        this.mesh.vertices = [-1.7320508, -1, 0.0, 1.7320508, -1, 0.0, 0.0, 2.0, 0.0];
        this.mesh.normals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
        this.mesh.colors = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.mesh.texCoords = [1.0, 1.0, 0.0, 1.0, 0.0, 0.0];
        this.mesh.indices = [0, 1, 2];
    }
});
window.onload = function() {
    game = new Game(320, 320);
    game.preload({
        enchant : '../../v0.7.0/images/enchant-sphere.png'
    });
    game.onload = function() {
        /**
         * 3D用のシーンを定義する.
         * Sprite3DはScene3Dに追加することで画面に表示される.
         */
        var scene = new Scene3D();
        scene.getCamera().z = 100;
        /**
         * 球体型のオブジェクトをつくる.
         * primitive.gl.enchant.js内のクラスを使用している.
         * primitive.gl.enchant.js内定義されている基本図形はSprite3Dを継承している.
         */
        //var ball = new Sphere();
        var particle = new Particle(100, 10);
        particle.indices = [0, 1, 2];
        particle.delta = [-1.7320508, -1, 0, 1.7320508, -1, 0, 0, 2, 0];

        scene.addChild(particle);
    };
    game.start();
};
