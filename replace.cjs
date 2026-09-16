const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const target = `{/* Right: Keyframe Diamond, Undo, Redo */}`;
const replace = `        {/* Right: Empty space to balance */}
        <div className="flex items-center gap-1.5 min-w-[50px] justify-end text-white/50 text-[10px] font-mono">
          {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}
        </div>
      </div>

      {/* Floating Keyframe Button (Top Right Corner) */}
      {onToggleKeyframe && (
        <button
          id="btn-player-keyframe-top"
          onClick={onToggleKeyframe}
          disabled={!selectedClipId}
          className={\`absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full shadow-xl border backdrop-blur-md transition-all active:scale-95 \${
            selectedClipId
              ? "bg-black/60 border-white/20 text-white hover:text-[#00E5FF] hover:border-[#00E5FF]"
              : "bg-black/40 border-white/5 text-white/20 cursor-not-allowed hidden"
          }\`}
          title="Add/Remove Keyframe"
        >
          <Diamond className="w-5 h-5 fill-transparent" strokeWidth={1.5} />
          {selectedClipId && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-black/80 border border-white/20 flex items-center justify-center">
              <span className="text-[11px] font-bold text-white leading-none mb-[1px]">+</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};`;

const startIndex = content.indexOf(target);
if (startIndex !== -1) {
  content = content.substring(0, startIndex) + replace;
  fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
  console.log("Success");
} else {
  console.log("Target not found!");
}
