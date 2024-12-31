import Layer from '/lib/Layer.js';

const planeMesh = new Float32Array([
  -1, 1, 0, -1, -1, 0,
  1, 1, 0, 1, -1, 0,
]);

export default class GPULayer extends Layer {
  get contextOptions() {
    return {
      /* alpha: true, */
      antialias: false,
      /* powerPreference: 'low-power', */
    };
  }

  get vs() {
    return `
    attribute vec3 p_in;
    varying vec3 p;
    void main() {
      p = p_in;
      gl_Position = vec4(p_in, 1.);
    }
    `;
  }

  get fs() {
    return `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1,0,0,1);
    }
    `;
  }

  init() {
    this.downscale ||= 1;
    this.initGl();

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.el);
  }
  initGl() {
    const gl = this.el.getContext('webgl', this.contextOptions);
    this.gl = gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, this.vs);
    gl.compileShader(vs);
    // console.log(gl.getShaderInfoLog(vs));
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, this.fs);
    gl.compileShader(fs);
    // console.log(gl.getShaderInfoLog(fs));
    const prog = this.prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    // if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    //   console.log(gl.getProgramInfoLog(prog));
    //   return;
    // }
    gl.useProgram(prog);
    this.aspectLoc = gl.getUniformLocation(prog, "aspect");
    this.tLoc = gl.getUniformLocation(prog, "t");
    this.resolutionLoc = gl.getUniformLocation(prog, "resolution");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, planeMesh, gl.STATIC_DRAW);

    const pLoc = gl.getUniformLocation(prog, "p_in");
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 3, gl.FLOAT, false, 0, 0);
  }

  resize() {
    const {el, gl} = this;
    // console.log(this.downscale);
    el.width = el.clientWidth * devicePixelRatio / this.downscale;
    el.height = el.clientHeight * devicePixelRatio / this.downscale;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(this.aspectLoc, el.width / el.height);
    gl.uniform2f(this.resolutionLoc, el.width, el.height);
    this.draw();
  }
  draw() {
    this.drawAt(performance.now());
  }

  drawAt(now) {
    const {gl} = this;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(this.tLoc, (now/1000) % (2 << 12));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, planeMesh.length / 3);
  }
}
