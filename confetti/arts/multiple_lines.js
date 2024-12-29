// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

const textSize = width * 0.05;
const lineHeight = textSize * 1.25;

ctx.font = `${textSize}px monospace`;
ctx.textAlign = 'center';

ctx.lineWidth = 4;
ctx.rect(0, 0, width, height);
ctx.stroke();

const longText = "Happy New Year New Year New Year New Year New Year New Year New Year New Year New Year New Year!";
const lines = wrapLine(longText, width);

setHeight(lineHeight * lines.length + lineHeight / 2);

for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i], width / 2, textSize * 1.25 * (1+i));
}
