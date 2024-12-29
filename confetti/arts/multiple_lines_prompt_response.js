// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

const textSize = width * 0.02;
const lineHeight = textSize * 1.25;

ctx.font = `${textSize}px monospace`;
ctx.textAlign = 'center';

ctx.lineWidth = 4;
ctx.rect(0, 0, width, height);
ctx.stroke(); 

const promptText = "What is a secret you haven't told anyone this year?";
const promptLines = wrapLine(promptText, width);
const responseText = "I found nudes my father took of my mother before I was born";
const responseLines = wrapLine(responseText, width);


setHeight(lineHeight * promptLines.length + lineHeight / 2);

for (let i = 0; i < promptLines.length; i++) {
  ctx.fillText(promptLines[i], width / 2, textSize * 1.25 * (1+i));
}


setHeight(lineHeight * responseLines.length + lineHeight / 2);

for (let i = 0; i < responseLines.length; i++) {
  ctx.fillText(responseLines[i], width / 2, textSize * 1.25 * (1+i));
}
