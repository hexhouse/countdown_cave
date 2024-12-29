// global variables:
// ctx, canvas, width, height, setHeight, timeLeft, now, shader

// Try uncommenting this...
// setHeight(80 + 50 * Math.sin(now * 2.1));

const textSize = height * 0.6;
ctx.font = `${textSize}px fungal2`;
ctx.textAlign = 'center';

ctx.lineWidth = 4;

ctx.rect(0, 0, width, height);
ctx.stroke();

ctx.translate(width/2, height/2);
ctx.rotate(Math.sin(now * 1.1) * 0.1);
ctx.translate(-width/2, -height/2);
ctx.fillText("⏱☎♡ happy new year ♡☎⏱", width / 2 + width / 4 * Math.sin(now * 1), height/2 + textSize/4);


// todos
// make it randomly white on black or black on white
// make a module that always no matter what says the number of seconds til midnight i.e. "Printed 498264 seconds til 2025"