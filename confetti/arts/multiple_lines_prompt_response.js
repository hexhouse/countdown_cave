// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

const padding = 0.02 * width;

const textSize = width * 0.03;
const lineHeight = textSize * 1.25;

const responseTextSize = width * 0.04;
const responseLineHeight = responseTextSize * 1.25;

ctx.lineWidth = 4;
ctx.rect(0, 0, width, height);
ctx.stroke(); 


// setHeight(lineHeight * promptLines.length + lineHeight / 2);

let yPosition = padding/2;

ctx.font = `${textSize}px monospace`;

const promptText = "What is a secret you haven't told anyone this year?";
const promptLines = wrapLine(promptText, width - padding * 2);

for (let i = 0; i < promptLines.length; i++) {
  yPosition += textSize * 1.25;
  ctx.fillText(promptLines[i], padding, yPosition);
}

yPosition += lineHeight/2;

ctx.font = `${responseTextSize}px monospace`;
ctx.textAlign = 'center';

const responseText = "I found nudes my father took of my mother before I was born";
const responseLines = wrapLine(responseText, width - padding * 2);

for (let i = 0; i < responseLines.length; i++) {
  yPosition += responseTextSize * 1.25;
  ctx.fillText(responseLines[i], width/2, yPosition);
}

setHeight(yPosition + responseTextSize/2 + padding);
