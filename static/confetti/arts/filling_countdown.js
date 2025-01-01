// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

const padding = 0.02 * width;

const textSize = width * 0.03;
const lineHeight = textSize * 1.25;
const responseTextSize = width * 0.07;
const responseLineHeight = responseTextSize * 1.25;




function calculateFillPercentage() {
  const now = new Date(reserve.now());
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Start time is 8 PM (20:00)
  const startHour = 20;
  // End time is midnight (24:00)
  const endHour = 24;

  if (hours < startHour) {
      return 0; // Before 8 PM, fill 0%
  }

  // Calculate the total seconds from 8 PM to midnight
  const totalSeconds = (endHour - startHour) * 3600;
  // Calculate the current seconds from 8 PM
  const currentSeconds = ((hours - startHour) * 3600) + (minutes * 60) + seconds;

  // Calculate the fill percentage
  const fillPercentage = (currentSeconds / totalSeconds) * 100;
  return fillPercentage;
}


      // Calculate the fill width based on the percentage
      const fillPercentage = calculateFillPercentage();
      const fillWidth = canvas.width * (fillPercentage / 100);

      // Fill the canvas based on the calculated percentage
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, fillWidth, canvas.height);

      // Display the fill percentage on the canvas
      ctx.fillStyle = 'white';
      ctx.font = '13px Arial';
      ctx.fillText(`${fillPercentage.toFixed(2)}% filled`, 10, 30);





ctx.lineWidth = 4;
// ctx.rect(0, 0, width, height);
// ctx.fillStyle = 'white'; 
ctx.fill();
ctx.fillStyle = 'black'; 

// setHeight(lineHeight * promptLines.length + lineHeight / 2);

let yPosition = padding/2;

ctx.font = `${textSize}px monospace`;

yPosition += lineHeight/2;

ctx.font = `${responseTextSize}px skanus`;
ctx.textAlign = 'center';

const responseText = "this confetti fills til midnight";
const responseLines = wrapLine(responseText, width - padding * 2);

for (let i = 0; i < responseLines.length; i++) {
  yPosition += responseTextSize * 1.25;
  ctx.fillText(responseLines[i], width/2, yPosition);
}

setHeight(yPosition + responseTextSize/2 + padding);
