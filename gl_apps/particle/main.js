var PARTICLE_VERTEX_SHADER_SOURCE = '\n\
 attribute vec3 aVertexPosition;\n\
 \n\
 uniform mat4 uMVMatrix;\n\
 uniform mat4 uProjMat;\n\
 \n\
 void main(void) {\n\
 gl_Position = uProjMat * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
 }\n\
 ';
 var PARTICLE_FRAGMENT_SHADER_SOURCE = '\n\
 precision mediump float;\n\
 \n\
 void main(void) {\n\
 gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\
 }\n\
 ';
var PMesh = enchant.Class.create({
    initialize : function() {
        this.__count = 0;
        this._appear = false;
        this._delta = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
        this._indices = new enchant.gl.Buffer(enchant.gl.Buffer.INDICES);
    },
    _deleteBuffer : function() {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (this[prop] instanceof enchant.gl.Buffer) {
                    this[prop]._delete();
                }
            }
        }
    },
    _createBuffer : function() {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (this[prop] instanceof enchant.gl.Buffer) {
                    this[prop]._create();
                    this[prop]._bufferData();
                }
            }
        }
    },
    _controlBuffer : function() {
        if (this._appear) {
            if (this.__count <= 0) {
                this._appear = false;
                this._deleteBuffer();
            }
        } else {
            if (this.__count > 0) {
                this._appear = true;
                this._createBuffer();
            }
        }
    },
    _count : {
        get : function() {
            return this.__count;
        },
        set : function(c) {
            this.__count = c;
            this._controlBuffer();
        }
    }
});
PMesh.prototype.indices = [];
PMesh.prototype.delta = [];
'delta indices'.split(' ').forEach(function(prop) {
    Object.defineProperty(PMesh.prototype, prop, {
        get : function() {
            return this['_' + prop]._array;
        },
        set : function(array) {
            this['_' + prop]._array = array;
            if (this._appear) {
                this['_' + prop]._bufferData();
            }
        }
    });
});
var Particle = enchant.Class.create(enchant.gl.Sprite3D, {
    initialize : function(numParticle, size) {
        enchant.gl.Sprite3D.call(this);
        this.program = enchant.gl.PARTICLE_SHADER_PROGRAM;
        this.mesh = new PMesh();
        this.mesh.delta = [-1.7320508, -1, 0.0, 1.7320508, -1, 0.0, 0.0, 2.0, 0.0];
        //this.mesh.normals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
        //this.mesh.colors = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        //this.mesh.texCoords = [1.0, 1.0, 0.0, 1.0, 0.0, 0.0];
        this.mesh.indices = [0, 1, 2];
        this.uMVMatrix = mat4.identity();
        this.pmatrix = mat4.identity();
    },
    _render : function() {
        var core = enchant.Core.instance;
        var scene = core.currentScene3D;
        mat4.multiply(scene._camera.mat, this.tmpMat, this.uMVMatrix);
        core.GL.currentProgram.setAttributes({
            aVertexPosition : this.mesh._delta
        });
        if(core.frame<10)        console.log(scene._camera);
        core.GL.currentProgram.setUniforms({
            uMVMatrix : this.uMVMatrix,
            uProjMat : scene._camera._projMat
        });
        var length = this.mesh.indices.length;
        enchant.Core.instance.GL.renderElements(this.mesh._indices, 0, length);
    }
});
enchant.gl.Core.prototype._original_start = enchant.gl.Core.prototype.start;
enchant.gl.Core.prototype.start = function() {
    enchant.gl.PARTICLE_SHADER_PROGRAM = new enchant.gl.Shader(PARTICLE_VERTEX_SHADER_SOURCE, PARTICLE_FRAGMENT_SHADER_SOURCE);
    this._original_start();
};
enchant();
var game;
window.onload = function() {
    game = new Core(320, 320);
    game.preload({
        enchant : '../../v0.7.0/images/enchant-sphere.png'
    });
    game.onload = function() {
        var scene = new Scene3D();
        scene.getCamera().z = 100;
        var particle = new Particle(100, 10);
        scene.addChild(particle);
    };
    game.start();
};
