export default class Layer {
  constructor(el) {
    this.el = el;
    this.visible = true;

    const obs = new IntersectionObserver(entries => {
      this.setVisible(entries[0].isIntersecting);
    });
    obs.observe(el);

    this.init();
  }
  setVisible(visible) {
    if (visible == this.visible)
      return;
    this.visible = visible;
    if (visible)
      this.show();
    else
      this.hide();
  }
  init() {}
  show() {}
  hide() {}
  draw() {}
  stateChanged() {}
}
