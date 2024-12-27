// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

setHeight(width * 0.1);

shader((x, y) => {
  return (1-Math.pow((Math.sin((y*2-1)*Math.PI*10*(x*2-1)+now)/2), 1)) * 0.4;
});

const textSize = height * 0.6;
ctx.font = `bold ${textSize}px "Impact"`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

ctx.fillText(`${Math.floor(timeLeft)} seconds until 2025`, width / 2, height/2);