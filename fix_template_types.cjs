const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const newInterface = `export interface TemplateSlot {
  id: number;
  type: "video" | "photo" | "any";
  duration: number;
  transition?: string;
  effect?: string;
}

export interface VideoTemplate {`;

content = content.replace('export interface VideoTemplate {', newInterface);

const oldClipCount = `  clipCount: number;`;
const newSlots = `  clipCount: number;
  slots: TemplateSlot[];`;

content = content.replace(oldClipCount, newSlots);

fs.writeFileSync('src/types.ts', content);
