// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

setHeight(width * 0.1);

shader((x, y) => {
  return (x + now * 0.3 + y * 0.1) * 10 % 1;
});
