const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

content = content.replace(
    'renderFrame(ctx, width, height, project, currentTime, {',
    'renderFrame(ctx, baseWidth, baseHeight, project, currentTime, {'
);

fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
console.log("Success Preview Perf 2");
