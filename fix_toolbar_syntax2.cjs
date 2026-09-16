const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

content = content.replace(/\\n/g, '\n');

fs.writeFileSync('src/components/Toolbar.tsx', content);
console.log("Success Fix Syntax 2");
