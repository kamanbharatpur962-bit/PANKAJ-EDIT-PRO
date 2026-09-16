const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
    'export type MaskShape = "none" | "linear" | "radial" | "rectangle" | "heart" | "star";',
    'export type MaskShape = "none" | "linear" | "radial" | "rectangle" | "heart" | "star" | "circle" | "horizontal";'
);

fs.writeFileSync('src/types.ts', content);
console.log("Success Types Mask");
