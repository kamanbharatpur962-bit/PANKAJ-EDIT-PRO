const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const regex = /category:\s*\|([^;]+);/m;
const newCategories = `category: 
    | "Cinematic"
    | "Trending"
    | "Slow Motion"
    | "Beat Sync"
    | "Velocity"
    | "Show Motion"
    | "Travel"
    | "Birthday"
    | "Wedding"
    | "Instagram/Reels"
    | "Shorts"
    | "Status"
    | "Photo + Video"
    | "Beat Music";`;

content = content.replace(/category:\s*[\s\S]*?Festival videos";/, newCategories);
fs.writeFileSync('src/types.ts', content);
console.log("Updated categories in types.ts");
