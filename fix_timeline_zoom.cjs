const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Update zoom limits
content = content.replace(/Math.min\(180,/g, 'Math.min(500,');
content = content.replace(/zoomLevel \+ 8\)\)/g, 'zoomLevel + 20))');
content = content.replace(/zoomLevel - 8\)\)/g, 'zoomLevel - 20))');
content = content.replace(/Math.min\(250,/g, 'Math.min(500,');

fs.writeFileSync('src/components/Timeline.tsx', content);
console.log("Success Fix Zoom Limits");
