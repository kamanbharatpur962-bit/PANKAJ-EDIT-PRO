const fs = require('fs');
let content = fs.readFileSync('src/utils/videoRenderer.ts', 'utf8');

const targetStr = `function applyMaskShape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shape: string,
  invert: boolean
) {
  const hw = width / 2;
  const hh = height / 2;

  ctx.beginPath();
  switch (shape) {
    case "radial":
      ctx.arc(0, 0, Math.min(hw, hh) * 0.8, 0, Math.PI * 2);
      break;
    case "rectangle":
      ctx.rect(-hw * 0.8, -hh * 0.8, width * 0.8, height * 0.8);
      break;
    case "heart": {
      const s = Math.min(width, height) * 0.003;
      ctx.moveTo(0, -50 * s);
      ctx.bezierCurveTo(-50 * s, -120 * s, -150 * s, -70 * s, -150 * s, 20 * s);
      ctx.bezierCurveTo(-150 * s, 100 * s, -40 * s, 160 * s, 0, 200 * s);
      ctx.bezierCurveTo(40 * s, 160 * s, 150 * s, 100 * s, 150 * s, 20 * s);
      ctx.bezierCurveTo(150 * s, -70 * s, 50 * s, -120 * s, 0, -50 * s);
      break;
    }
    case "star": {
      const spikes = 5;
      const outerRadius = Math.min(hw, hh) * 0.8;
      const innerRadius = outerRadius * 0.45;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        let sx = Math.cos(rot) * outerRadius;
        let sy = Math.sin(rot) * outerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
        sx = Math.cos(rot) * innerRadius;
        sy = Math.sin(rot) * innerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
      }
      ctx.closePath();
      break;
    }
    default:
      ctx.rect(-hw, -hh, width, height);
  }
  ctx.clip();
}`;

const replaceStr = `function applyMaskShape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shape: string,
  invert: boolean
) {
  const hw = width / 2;
  const hh = height / 2;

  ctx.beginPath();
  
  if (invert) {
      // Create a large outer rectangle to invert the clipping area
      ctx.rect(-width * 2, -height * 2, width * 4, height * 4);
  }
  
  switch (shape) {
    case "circle":
      ctx.arc(0, 0, Math.min(hw, hh) * 0.8, 0, Math.PI * 2, invert);
      break;
    case "radial": // Using radial as Mirror/Split
      ctx.rect(-hw, -hh * 0.25, width, height * 0.5);
      break;
    case "linear": // Split/Linear half
      ctx.rect(-hw, 0, width, hh);
      break;
    case "rectangle":
      ctx.rect(-hw * 0.8, -hh * 0.8, width * 1.6, height * 1.6);
      break;
    case "heart": {
      const s = Math.min(width, height) * 0.003;
      if (invert) ctx.moveTo(0, -50 * s); // dummy move to start
      ctx.moveTo(0, -50 * s);
      ctx.bezierCurveTo(-50 * s, -120 * s, -150 * s, -70 * s, -150 * s, 20 * s);
      ctx.bezierCurveTo(-150 * s, 100 * s, -40 * s, 160 * s, 0, 200 * s);
      ctx.bezierCurveTo(40 * s, 160 * s, 150 * s, 100 * s, 150 * s, 20 * s);
      ctx.bezierCurveTo(150 * s, -70 * s, 50 * s, -120 * s, 0, -50 * s);
      break;
    }
    case "star": {
      const spikes = 5;
      const outerRadius = Math.min(hw, hh) * 0.8;
      const innerRadius = outerRadius * 0.45;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        let sx = Math.cos(rot) * outerRadius;
        let sy = Math.sin(rot) * outerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
        sx = Math.cos(rot) * innerRadius;
        sy = Math.sin(rot) * innerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
      }
      ctx.closePath();
      break;
    }
    default:
      ctx.rect(-hw, -hh, width, height);
  }
  
  // Actually apply clipping (using non-zero winding rule which works with the invert trick for basic shapes)
  ctx.clip("evenodd");
}`;

if (content.includes('function applyMaskShape(')) {
    // We will do a substring replacement since the indentation might differ slightly
    const startIdx = content.indexOf('function applyMaskShape(');
    const endIdx = content.indexOf('}', content.indexOf('ctx.clip();')) + 1;
    const oldFunc = content.substring(startIdx, endIdx);
    
    content = content.replace(oldFunc, replaceStr);
    fs.writeFileSync('src/utils/videoRenderer.ts', content);
    console.log("Success Mask renderer");
} else {
    console.log("Target not found!");
}
