/*var PARTICLE_VERTEX_SHADER_SOURCE = '\n\
 uniform mat4 modelViewMatrix;\n\
 uniform mat4 projectionMatrix;\n\
 uniform float size,time;\n\
 attribute vec2 delta;\n\
 attribute vec3 random0,random1,random2,random3;\n\
 varying vec2 texcoord;\n\
 varying vec3 color;\n\
 void main(){\n\
 texcoord=delta;\n\
 vec3 pos=random0*time+random1*time*time+random2*time*time*time;\n\
 gl_Position=projectionMatrix*(modelViewMatrix*vec4(pos,1)+vec4(delta,0,0)*size);\n\
 color=(vec3(1,1,1)+random3)/2.;\n\
 }\n\
 ';
 var PARTICLE_FRAGMENT_SHADER_SOURCE = '\n\
 #ifdef GL_ES\n\
 precision mediump float;\n\
 #endif\n\
 uniform bool sampleFlag;\n\
 varying vec2 texcoord;\n\
 varying vec3 color;\n\
 void main(void){\n\
 float r2=dot(texcoord,texcoord);\n\
 if(r2>1.){\n\
 if(sampleFlag)r2=0.5;//ビルボードの輪郭が見えるように\n\
 else discard;//正三角形の内接円内部だけ描画したいならこちら\n\
 }\n\
 gl_FragColor=vec4(color*(1.-r2)*(1.-r2),1);\n\
 }\n\
 ';*/
enchant.gl.Core.prototype._original_start = enchant.gl.Core.prototype.start;
enchant.gl.Core.prototype.start = function() {
    enchant.gl.PARTICLE_SHADER_PROGRAM = new enchant.gl.Shader(PARTICLE_VERTEX_SHADER_SOURCE, PARTICLE_FRAGMENT_SHADER_SOURCE);
    this._original_start();
};

enchant();
var game;
var Particle = Class.create(Sprite3D, {
    initialize : function(numParticle, size) {
        Sprite3D.call(this);
        this.mesh = new Mesh();
        this.program = enchant.gl.PARTICLE_SHADER_PROGRAM;
        var deltaBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.TEXCOORDS);
        var random0Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
        var random1Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
        var random2Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
        var random3Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
        var indicesBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.INDICES);
        this._addAttribute(deltaBuffer, 'delta');
        this._addAttribute(random0Buffer, 'random0');
        this._addAttribute(random1Buffer, 'random1');
        this._addAttribute(random2Buffer, 'random2');
        this._addAttribute(random3Buffer, 'random3');
        this._addAttribute(indicesBuffer, 'indices');
        var sqrt3 = Math.sqrt(3);
        var delta = [];
        var indices = [];
        for (var i = 0; i < numParticle; i++) {
            delta.push(-1.7320508, -1);
            delta.push(1.7320508, -1);
            delta.push(0, 2);
            indices.push(i * 3);
            indices.push(i * 3 + 1);
            indices.push(i * 3 + 2);
        }
        this.indices = indices;
        this.delta = new Float32Array(delta);
        var rndArr = [];
        for (var j = 0; j < numParticle; j++) {
            var s = 2 * Math.random() - 1, t = 2 * Math.PI * Math.random(), r = Math.sqrt(1 - s * s);
            var x = r * Math.cos(t), y = r * Math.sin(t), z = s;
            //3頂点で共通の乱数値 これを使ってパーティクルの位置をVertexShaderで決定する
            rndArr.push(x, y, z);
            rndArr.push(x, y, z);
            rndArr.push(x, y, z);
        }
        this.random0 = new Float32Array(rndArr);
        this.random1 = new Float32Array(rndArr);
        this.random2 = new Float32Array(rndArr);
        this.random3 = new Float32Array(rndArr);
        this.size = size;
        this.time = 0;
        this.sampleFrag = false;
    },
    _addAttribute : function(buffer, prop) {
        this['_' + prop] = buffer;
        Object.defineProperty(this, prop, {
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
    },
    _render : function() {
        this.time += 0.1;
        this.projectionMatrix = mat4.identity();
        this.modelViewMatrix = mat4.identity();
        var attributes = {
            delta : this._delta,
            random0 : this._random0,
            random1 : this._random1,
            random2 : this._random2,
            random3 : this._random3
        };

        var uniforms = {
            projectionMatrix : this.projectionMatrix,
            modelViewMatrix : this.modelViewMatrix,
            sampleFrag : this.sampleFrag,
            size : this.size,
            time : this.time
        };
        var length = this.indices.length;
        enchant.Core.instance.GL.renderElements(this._indices, 0, length, attributes, uniforms);
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
        //        scene.getCamera().x=10;
        /**
         * 球体型のオブジェクトをつくる.
         * primitive.gl.enchant.js内のクラスを使用している.
         * primitive.gl.enchant.js内定義されている基本図形はSprite3Dを継承している.
         */
        var ball = new Sphere();
        var particle = new Particle(100, 0.4);
        scene.addChild(particle);
        /**
         * テクスチャを設定する.
         * Sprite3Dのmeshプロパティが表示上の実体となる.
         * テクスチャのソースはpreloadでロードしたデータの他に, canvasオブジェクト, imageオブジェクト, 画像のURLを表す文字列が使用できる.
         */
        ball.mesh.texture.src = game.assets['enchant'];
        ball.z = -20;

        ball.addEventListener('enterframe', function(e) {
            /**
             * オブジェクトを回転させる.
             * rotateYawはオブジェクトのY軸回転.
             */
            this.rotateYaw(0.01);
        });
        scene.addChild(ball);

        var cube = new Cube();
        cube.z = 0;
        cube.vz = -0.1;

        cube.addEventListener('enterframe', function(e) {
            /**
             * オブジェクトを回転させる.
             * rotateRollはオブジェクトのZ軸回転.
             */
            this.rotateYaw(0.01);
            this.rotateRoll(0.01);
            this.z += cube.vz;
            /**
             * オブジェクト同士の当たり判定を計算する.
             * 当たり判定は Sprite3D が持つ Bounding オブジェクト同士で行われる.
             * Bounding オブジェクトを変えることで当たり判定の方法を変更することができる.
             */
            if (this.intersect(ball)) {
                cube.vz = -cube.vz;
                console.log('hit!');
            }
            if (this.z > 0) {
                cube.vz = -cube.vz;
            }
        });
        scene.addChild(cube);
    };
    game.start();
};
