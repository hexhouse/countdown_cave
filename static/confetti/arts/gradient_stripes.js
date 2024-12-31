// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

setHeight(width * 0.1);

shader((x, y) => {
  return (x + now * 0.3 + y * 0.1) * 10 % 1;
});

ctx.fillStyle = "black";
ctx.fillRect(width  - width/1.98, height - (height/2),  width  - width/2.6, height - (height/4.))

const textSize = height * 0.35;
ctx.font = `${textSize}px "skanus"`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = "white";
ctx.fillText(`Printed ${Math.floor(timeLeft)} seconds before 2025`, width  - width/4, height - (height/4.));