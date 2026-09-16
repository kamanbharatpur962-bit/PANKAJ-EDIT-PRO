const fs = require('fs');
let content = fs.readFileSync('src/utils/videoRenderer.ts', 'utf8');

content = content.replace(
    'case "linear": // Split/Linear half\n      ctx.rect(-hw, 0, width, hh);\n      break;',
    'case "linear": // Split/Linear half\n      ctx.rect(-hw, 0, width, hh);\n      break;\n    case "horizontal":\n      ctx.rect(-hw, -hh * 0.3, width, height * 0.6);\n      break;'
);

fs.writeFileSync('src/utils/videoRenderer.ts', content);
console.log("Success MaskRenderer Horizontal");
