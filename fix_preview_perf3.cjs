const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const oldStr = `    canvas.width = width;
    canvas.height = height;
    
    // Scale the context so drawing operations don't need to change
    ctx.scale(scale, scale);`;

const newStr = `    canvas.width = width;
    canvas.height = height;
    
    // Reset transform and scale the context so drawing operations don't need to change
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);`;

if (content.includes('ctx.scale(scale, scale);')) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
    console.log("Success Preview Perf 3");
}
