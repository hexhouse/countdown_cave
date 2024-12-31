import { config, state } from '/lib/NYE.js';
import Layer from '/lib/Layer.js';

const randomChoice = a => a[Math.floor(Math.random() * a.length)];

export default class VideoPlayer extends Layer {
  constructor(parentEl) {
    super(parentEl);
    this.videoEls = [];
    for (let i = 0; i < 1; i++) {
      const videoEl = document.createElement('video');
      videoEl.muted = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.addEventListener('ended', e => {
        this.chooseVideo();
      });
      videoEl.addEventListener('error', e => {
        this.chooseVideo();
      });
      // this.el.appendChild(videoEl);
      this.videoEls.push(videoEl);
    }
    this.needVideo = true;
    this.chooseVideo();
  }
  chooseVideo() {
    if (!config.videos) {
      this.needVideo = true;
      return;
    }
    const src = randomChoice(config.videos);
    this.videoEls[0].src = src;
    this.videoEls[0].play();
    this.needVideo = false;
  }
  stateChanged() {
    if (this.needVideo)
      this.chooseVideo();
  }
};

