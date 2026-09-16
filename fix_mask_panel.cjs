const fs = require('fs');
let content = fs.readFileSync('src/components/panels/MaskPanel.tsx', 'utf8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/panels/MaskPanel.tsx', content);
console.log("Success Fix Mask Panel");
