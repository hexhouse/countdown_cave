class TextRenderer {
  constructor(gl, font = "sans-serif") {
    const renderCanvas = document.createElement('canvas');
    this.gl = gl;
    renderCanvas.width = 2048;
    renderCanvas.height = 2048;
    this.renderCanvas = renderCanvas;
    this.ctx = renderCanvas.getContext('2d');

    this.ctx.font = `bold ${this.fontSize}px ${font}`;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.drawText("");
  }
  render(text) {
    const { renderCanvas, ctx, lineHeight } = this;
    ctx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
    let yPosition = Math.max(0, renderCanvas.height/2 - lineHeight/2);
    yPosition += lineHeight;
    const width = ctx.measureText(text).width;
    ctx.fillText(text, renderCanvas.width/2, yPosition);
    this.tex.w = renderCanvas.width;
    this.tex.h = renderCanvas.height;
  }

  get fontSize() {
    return Math.ceil(this.renderCanvas.height / 5);
  }
  get lineHeight() {
    return this.fontSize * 1.25;
  }

  drawText(text) {
    if (text == this.lastDrawnText)
      return false;
    const { renderCanvas, gl } = this;
    if (!this.tex) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.tex = {
        w: 0, h: 0, tex,
      };
    }

    this.render(text);
    this.lastDrawnText = text;

    gl.bindTexture(gl.TEXTURE_2D, this.tex.tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, this.renderCanvas,
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    return true;
  }
}

const oldSchoolTextRenderer = new TextRenderer(ctx.canvas.gl, "Segment7");
ctx.uniforms.nye_count = ctx.globalTextures.nye_count = oldSchoolTextRenderer.tex;
ctx.uniformsChanged();
console.log(oldSchoolTextRenderer.tex);

const { config, state } = window.ctx;

return () => {
  const left = Math.floor((config.midnight - ctx.now())/1000);
  const h = Math.floor(left / 3600);
  const m = Math.floor(left / 60 % 60);
  const s = Math.floor(left % 60);
  const str = (h||m)
    ? `${h.toFixed(0)}${m?':'+m.toFixed(0).padStart(2, '0'):''}:${s.toFixed(0).padStart(2, '0')}`
    : s;

  oldSchoolTextRenderer.drawText(str);
  // ctx.uniforms.nye_count = ctx.globalTextures.nye_count = oldSchoolTextRenderer.tex;
};
