const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const replacement1 = `  return (
    <nav className="h-[90px] bg-[#181818] flex items-center px-2 z-20 shrink-0 overflow-x-auto no-scrollbar select-none">
      {/* If clip is selected, show back button on far left (Screenshot 3) */}
      {selectedClipId && onDeselectClip && (
        <div className="flex items-center h-full py-3 mr-4">
          <button
            id="btn-toolbar-back-mode"
            onClick={onDeselectClip}
            className="flex items-center justify-center w-10 h-full rounded-[10px] bg-[#2A2A2A] hover:bg-[#333333] text-white active:scale-95 transition-all shrink-0"
            title="Return to Main Tools"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div className="w-[1px] h-3/5 bg-white/10 ml-4" />
        </div>
      )}

      {/* Render active items list based on clip selection */}
      <div className="flex items-center h-full py-3 gap-6 sm:gap-8">
        {(selectedClipId ? clipEditTabs : mainTabs).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={\`tool-btn-\${tab.id}\`}
              onClick={tab.onClick}
              className={\`flex flex-col items-center justify-center transition-all active:scale-95 shrink-0 \${
                isActive ? "text-[#00E5FF]" : "text-white/80 hover:text-white"
              }\`}
            >
              <div className="p-1 mb-1">
                {tab.icon}
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};`;

const targetRegex = /  return \([\s\S]*?<\/nav>\n  \);\n};\s*$/;
content = content.replace(targetRegex, replacement1);

fs.writeFileSync('src/components/Toolbar.tsx', content);
console.log('Done Toolbar');
