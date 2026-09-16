const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Use a simple custom SVG for "More" that looks like a left-pointing triangle
const moreIcon = `<div className={\`w-[26px] h-[26px] flex items-center justify-center \${activeTab === 'more' ? 'text-[#4CE5E7]' : 'text-[#888]'}\`}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
               <polygon points="15 3 21 9 15 15"></polygon>
               <line x1="9" y1="9" x2="21" y2="9"></line>
               <line x1="9" y1="21" x2="3" y2="15"></line>
               <line x1="21" y1="15" x2="3" y2="15"></line>
             </svg>
          </div>`;

const newMoreIcon = `<div className={\`w-[26px] h-[26px] flex items-center justify-center \${activeTab === 'more' ? 'text-[#4CE5E7]' : 'text-[#888]'}\`}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <polygon points="16,4 4,12 16,20"></polygon>
             </svg>
          </div>`;

content = content.replace(moreIcon, newMoreIcon);
fs.writeFileSync('src/components/HomeScreen.tsx', content);
