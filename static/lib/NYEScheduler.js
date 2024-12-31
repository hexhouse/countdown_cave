class Schedule {
  constructor(onEvents) {
    this.events = [];
    this.cursor = 0;
    this.onEvents = onEvents;
  }
  reset() {
    this.cursor = 0;
  }
  load(events) {
    this.events = events.slice().sort(([a, b]) => a[0] - b[0]);
    this.reset();
    this.advanceTo(ctx.now());
  }
  advanceTo(t) {
    const ret = [];
    while (this.cursor < this.events.length) {
      const nextEvent = this.events[this.cursor];
      if (nextEvent[0] > t)
        break;
      ret.push(nextEvent[1]);
      this.cursor++;
    }
    if (ret.length)
      this.onEvents(ret);
  }
  peek() {
    return this.events[this.cursor];
  }
}

export default class NYEScheduler {
  constructor(onEvents) {
    this.onEvents = onEvents;
    this.schedule = new Schedule(e => this.handleEvents(e));
    this.timeout = null;
  }
  scheduleNext() {
    if (this.timeout)
      clearTimeout(this.timeout);
    this.timeout = null;

    const now = ctx.now();
    const nextItem = this.schedule.peek();
    if (!nextItem)
      return;
    const minTimeout = 10000;
    this.timeout = setTimeout(
      () => this.onTimer(), 
      Math.min(minTimeout, (nextItem[0] - now)/config.timekeeper.speed));
  }
  load(schedule) {
    this.schedule.load(schedule);
    this.schedule.advanceTo(ctx.now());
    this.scheduleNext();
  }
  handleEvents(e) {
    this.scheduleNext();
    this.onEvents(e);
  }
  onTimer() {
    this.schedule.advanceTo(ctx.now());
    this.scheduleNext();
  }
}

