const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              {activeTab === "speed" && (`;
const maskCode = `              {activeTab === "mask" && selectedClipId && (
                <div className="absolute inset-0 bg-[#181818] z-20 flex flex-col rounded-t-[24px]">
                  <MaskPanel
                    clip={project.clips.find(c => c.id === selectedClipId)!}
                    onUpdate={(updates) => handleUpdateClip(selectedClipId, updates)}
                    onClose={() => setActiveTab(null)}
                  />
                </div>
              )}

`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, maskCode + targetStr);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Success Mask App");
} else {
    console.log("Target not found!");
}
