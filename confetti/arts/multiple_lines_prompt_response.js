// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

const padding = 0.02 * width;

const textSize = width * 0.025;
const lineHeight = textSize * 1.25;
const responseTextSize = width * 0.07;
const responseLineHeight = responseTextSize * 1.25;

ctx.lineWidth = 4;
ctx.rect(0, 0, width, height);
ctx.fillStyle = 'black'; 
ctx.fill();
ctx.fillStyle = 'white'; 


// setHeight(lineHeight * promptLines.length + lineHeight / 2);

let yPosition = padding/2;

ctx.font = `${textSize}px monospace`;

const promptText = window.promptText;
const promptLines = wrapLine(promptText, width - padding * 2);

for (let i = 0; i < promptLines.length; i++) {
  yPosition += textSize * 1.25;
  ctx.fillText(promptLines[i], padding, yPosition);
}

yPosition += lineHeight/2;

ctx.font = `${responseTextSize}px skanus`;
ctx.textAlign = 'center';

const responseText =window.responseText;
const responseLines = wrapLine(responseText, width - padding * 2);

for (let i = 0; i < responseLines.length; i++) {
  yPosition += responseTextSize * 1.25;
  ctx.fillText(responseLines[i], width/2, yPosition);
}

setHeight(yPosition + responseTextSize/2 + padding);

const smallTextSize = width * 0.025;
ctx.font = `${smallTextSize}px "skanus"`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

ctx.fillText(`Printed ${Math.floor(timeLeft)} seconds before 2025`, width  - width/5.5, height - (width/35));