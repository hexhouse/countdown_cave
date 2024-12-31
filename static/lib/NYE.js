import NYEScheduler from '/lib/NYEScheduler.js';

export const config = {
  timekeeper: {
    shift: 0,
    speed: 1,
  },
};

export const state = {};

const configURL = new URL('config.js', location);
const videosDir = new URL('/countdown_videos/', location);

const scheduler = new NYEScheduler((events) => {
  for (const event of events) {
    if (event.state)
      Object.assign(state, event.state);
  }
  console.log('STATE', state);

  document.body.dataset.phase = state.phase;
  timer.classList.toggle('visible', state.ambientCountdown);

  window.dispatchEvent(new Event('nye.statechanged'));
});

const reloadConfig = async () => {
  const [videoList, cfgText] = await Promise.all([
    fetch(videosDir).then(r => r.json()),
    fetch('config.js', { cache: 'reload' }).then(r => r.text()),
  ]);

  Object.assign(config, new Function(cfgText)());
  config.videos = videoList.map(v => new URL(encodeURIComponent(v.name), videosDir));
  console.log('CONFIG', config);

  const schedule = Object.keys(config.schedule).map(k => [
    +new Date(k),
    config.schedule[k]]);
  scheduler.load(schedule);

  clock.classList.toggle('visible', config.debug);
};

reloadConfig();

window.addEventListener('sourcechange', e => {
  if (e.detail == configURL.href) {
    e.preventDefault();
    reloadConfig();
  }
});

