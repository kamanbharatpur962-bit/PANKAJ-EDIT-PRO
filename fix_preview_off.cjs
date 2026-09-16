const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const targetStr = `          <div className="flex items-center gap-1 opacity-50 cursor-not-allowed" title="Template Off (Coming Soon)">
             <div className="relative flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <div className="absolute -bottom-[2px] -right-[6px] bg-black px-[2px] rounded text-[7px] font-bold text-white border border-white">OFF</div>
             </div>
          </div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, "");
    fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
    console.log("Success");
} else {
    console.log("Target not found!");
}
