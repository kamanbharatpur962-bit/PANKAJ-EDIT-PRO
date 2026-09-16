const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              {activeTab === "speed" && (
                <div className="absolute inset-0 bg-[#181818] z-20 flex flex-col rounded-t-[24px]">
                  <PanelHeader 
                    title="Speed & Ramp" 
                    icon={<Gauge className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)} 
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <EditPanel 
                      clip={project.clips.find(c => c.id === selectedClipId) || project.clips[0]} 
                      onUpdate={(clipId, updates) => {
                        if (clipId) handleUpdateClip(clipId, updates);
                      }} 
                    />
                  </div>
                </div>
              )}`;

const maskCode = `
              {activeTab === "mask" && selectedClipId && (
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
    content = content.replace(targetStr, targetStr + maskCode);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Success Mask App");
} else {
    console.log("Target not found!");
}
