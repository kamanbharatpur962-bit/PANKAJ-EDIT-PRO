const fs = require('fs');
let content = fs.readFileSync('src/components/TemplatesScreen.tsx', 'utf8');

const oldCategories = `const CATEGORIES = [
  "All", "Cinematic", "Trending", "Beat Sync", "Velocity", "Travel", "Birthday", "Wedding", "Instagram/Reels", "Shorts", "Status", "Photo + Video"
];`;

const newCategories = `const CATEGORIES = [
  "All", "Trending", "Cinematic", "Beat Sync", "Photo Slideshow", "Travel", "Birthday", "Festival", "Status/Reels", "Slow Motion", "Transition", "Memories"
];`;

content = content.replace(oldCategories, newCategories);
fs.writeFileSync('src/components/TemplatesScreen.tsx', content);
