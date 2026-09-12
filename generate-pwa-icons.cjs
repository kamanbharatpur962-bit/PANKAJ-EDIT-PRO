const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0D0D12';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Circle
  ctx.fillStyle = '#00E5FF';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Play triangle
  ctx.fillStyle = '#0D0D12';
  ctx.beginPath();
  ctx.moveTo(size * 0.45, size * 0.35);
  ctx.lineTo(size * 0.45, size * 0.65);
  ctx.lineTo(size * 0.65, size * 0.5);
  ctx.closePath();
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', filename), buffer);
  console.log(`Created ${filename}`);
}

createIcon(192, 'pwa-192x192.png');
createIcon(512, 'pwa-512x512.png');
createIcon(192, 'apple-touch-icon.png');
createIcon(64, 'favicon.ico');
