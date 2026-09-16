const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const typeDef = `
export type ActiveToolTab = 
  | "edit"
  | "audio"
  | "text" 
  | "overlay" 
  | "effects" 
  | "captions" 
  | "aspect" 
  | "filters" 
  | "adjust" 
  | "stickers" 
  | "background"
  | "speed"
  | "animations"
  | "volume"
  | "crop"
  | "color"
  | "song_to_text"
  | "ai"
  | "templates"
  | "keyframe"
  | "mask";
`;

if (!content.includes('export type ActiveToolTab')) {
    content += typeDef;
    fs.writeFileSync('src/types.ts', content);
    console.log("Added ActiveToolTab to types.ts");
} else {
    console.log("Already exists");
}
