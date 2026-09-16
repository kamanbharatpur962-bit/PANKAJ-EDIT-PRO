const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

if (content.includes('PenSquare')) {
    content = content.replace(/PenSquare/g, 'Edit');
    fs.writeFileSync('src/components/HomeScreen.tsx', content);
    console.log("Replaced PenSquare with Edit");
}
