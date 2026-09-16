const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Add MeScreen import
if (!content.includes('import { MeScreen }')) {
  content = content.replace('import { TemplatesScreen } from "./TemplatesScreen";', 
    'import { TemplatesScreen } from "./TemplatesScreen";\nimport { MeScreen } from "./MeScreen";');
}

// Ensure the onRestoreProjects logic is available or can be passed.
// Wait, HomeScreen doesn't have setSavedProjects directly. It receives savedProjects from App.tsx. 
// We should probably add an onRestoreProjects prop to HomeScreen.
if (!content.includes('onRestoreProjects?: (projects: VideoProject[]) => void;')) {
  content = content.replace('onCreateProjectWithMedia?: (clips: Clip[], aspectRatio: AspectRatio) => void;',
    'onCreateProjectWithMedia?: (clips: Clip[], aspectRatio: AspectRatio) => void;\n  onRestoreProjects?: (projects: VideoProject[]) => void;');
}

content = content.replace('onCreateProjectWithMedia,\n  onOpenFeature,',
  'onCreateProjectWithMedia,\n  onRestoreProjects,\n  onOpenFeature,');

// Replace the Me tab placeholder
const oldMe = `<span className={\`text-[11px] font-semibold \${activeTab === 'me' ? 'text-[#4CE5E7]' : 'text-[#888]'}\`}>Me</span>`;
// This tab is in the navigation. The conditional rendering for 'me' tab should be implemented.
const meRenderLogic = `if (activeTab === 'me') {
    return (
      <div className="flex flex-col h-full bg-[#0D1017] text-white overflow-hidden font-sans">
        <div className="flex-1 overflow-hidden">
          <MeScreen 
             onBack={() => setActiveTab('home')} 
             savedProjects={savedProjects}
             onRestoreProjects={(projects) => {
               if (onRestoreProjects) onRestoreProjects(projects);
             }}
          />
        </div>
        <nav className="absolute bottom-0 left-0 right-0 h-[75px] bg-[#0A0C11] flex items-center justify-around px-2 z-50">
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <Home className="w-[26px] h-[26px] text-[#888]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-[#888]">Home</span>
          </button>
          <button onClick={() => setActiveTab('templates')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <MonitorPlay className="w-[26px] h-[26px] text-[#888]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-[#888]">Templates</span>
          </button>
          <button onClick={() => setActiveTab('me')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <div className="w-[26px] h-[26px] rounded-full border-[2.2px] flex items-center justify-center border-[#4CE5E7] text-[#4CE5E7]">
              <div className="w-[10px] h-[10px] rounded-full border-[2.2px] border-current"></div>
            </div>
            <span className="text-[11px] font-semibold text-[#4CE5E7]">Me</span>
            <div className="absolute bottom-2 w-[32px] h-[3px] bg-[#4CE5E7] rounded-full"></div>
          </button>
          <button onClick={() => setActiveTab('more')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <div className="w-[26px] h-[26px] flex items-center justify-center text-[#888]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="16,4 4,12 16,20"></polygon></svg>
            </div>
            <span className="text-[11px] font-semibold text-[#888]">More</span>
          </button>
        </nav>
      </div>
    );
  }`;

if (!content.includes('activeTab === \'me\'')) {
  // It should be inserted where activeTab === 'templates' is checked.
  content = content.replace('if (activeTab === \'templates\') {', meRenderLogic + '\n\n  if (activeTab === \'templates\') {');
}

fs.writeFileSync('src/components/HomeScreen.tsx', content);
