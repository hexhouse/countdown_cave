const common = [
  "/shaders/util/header.js",
  "/shaders/nye/nye.js",
  // "/shaders/util/align2.s4r",
  "/shaders/nye/video.s4r",
  {
    path: "/shaders/nye/nye.s4r",
    if(ctx) {
      return ctx.params.nyeCountdownFade > 0;
    }
  },
];

return {
  default: [ ...common ],
  wall: [
    ...common,
    "/shaders/nye/map_wall.s4r",

    {
      path: "/shaders/util/black.frag",
      if(ctx) {
        return ctx.nye.state.phase == 'blackout';
      }
    },
  ],
}
