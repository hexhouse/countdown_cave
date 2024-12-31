export default class WSConnection {
  constructor(url) {
    this.url = url;
    this.queue = [];
  }

  connect() {
    if (this.ws)
      this.ws.close();
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
    this.ws.onclose = e => {
      this.open = false;
      setTimeout(() => this.connect(), 1000);
    };
    this.ws.onopen = e => {
      this.open = true;
      this.onopen && this.onopen();
      while (this.queue.length) {
        console.log('dispatching queued message', this.queue[0]);
        this.send(this.queue.shift());
      }
    };
    this.ws.onmessage = e => {
      this.onmessage(e.data instanceof ArrayBuffer ? e.data : JSON.parse(e.data));
    };
  }

  close() {
    this.closed = true;
    this.ws.onclose = null;
    this.ws.close();
  }

  send(msg) {
    if (this.closed)
      return;
    if (this.open) {
      try {
        this.ws.send(msg instanceof ArrayBuffer ? msg : JSON.stringify(msg));
        return;
      } finally {}
    }
    this.queue.push(msg);
  }
}
