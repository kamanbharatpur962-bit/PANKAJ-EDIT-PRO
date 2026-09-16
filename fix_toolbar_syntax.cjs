const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

content = content.replace('Subtitles,\\n  Mic2,', 'Subtitles,\\n  Mic2,');
// Wait, the previous replacement added a literal \n in the file instead of a newline. Let's fix it properly.
content = content.replace('Subtitles,\\\\n  Mic2,', 'Subtitles,\\n  Mic2,');
// let's just do a clean replacement
content = content.replace(/Subtitles,(\\\\)n  Mic2,/, 'Subtitles,\\n  Mic2,');
content = content.replace(/Subtitles,\\n  Mic2,/, 'Subtitles,\n  Mic2,');

fs.writeFileSync('src/components/Toolbar.tsx', content);
console.log("Success Fix Syntax");
