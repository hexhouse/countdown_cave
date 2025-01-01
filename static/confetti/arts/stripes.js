// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

setHeight(width * 0.1);

shader((x, y) => {
  return (x + now * 0.3 + y * 0.1) * 10 % 1 > 0.5;
});

const textSize = width * 0.03;
const padding = width * 0.01;

ctx.font = `${textSize}px "skanus"`;
ctx.textAlign = 'right';
ctx.textBaseline = 'bottom';

const textToPrint = `Printed ${Math.floor(timeLeft)} seconds before 2025`;
const tw = ctx.measureText(textToPrint).width;

ctx.fillStyle = "black";
ctx.fillRect(width - tw - padding * 2, height - textSize * 1.5, tw + padding * 2, textSize * 1.5);

ctx.fillStyle = "white";
ctx.fillText(`Printed ${Math.floor(timeLeft)} seconds before 2025`, width - padding, height - padding / 2);
