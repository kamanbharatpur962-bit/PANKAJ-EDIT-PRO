const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const targetStr = `    // Use internal logical resolution of 1080p
    const width = 1080;
    let height = 1920;
    if (project.aspectRatio === "16:9") height = 608;
    else if (project.aspectRatio === "1:1") height = 1080;
    else if (project.aspectRatio === "4:5") height = 1350;
    else if (project.aspectRatio === "21:9") height = 460;

    canvas.width = width;
    canvas.height = height;`;

const perfStr = `    // Use internal logical resolution of 1080p
    const baseWidth = 1080;
    let baseHeight = 1920;
    if (project.aspectRatio === "16:9") baseHeight = 608;
    else if (project.aspectRatio === "1:1") baseHeight = 1080;
    else if (project.aspectRatio === "4:5") baseHeight = 1350;
    else if (project.aspectRatio === "21:9") baseHeight = 460;

    // Dynamic resolution scaling for smooth playback (50% scale while playing)
    const scale = isPlaying ? 0.5 : 1.0;
    const width = Math.floor(baseWidth * scale);
    const height = Math.floor(baseHeight * scale);

    canvas.width = width;
    canvas.height = height;
    
    // Scale the context so drawing operations don't need to change
    ctx.scale(scale, scale);`;

content = content.replace(targetStr, perfStr);
fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
console.log("Success Preview Perf");
