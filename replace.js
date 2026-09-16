const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const target = `        {/* Right: Keyframe Diamond, Undo, Redo */}
        <div className="flex items-center gap-1.5">
          {onToggleKeyframe && (
            <button
              id="btn-player-keyframe"
              onClick={onToggleKeyframe}
              disabled={!selectedClipId}
              className={\`p-1.5 rounded-lg transition-all active:scale-95 \${
                selectedClipId
                  ? "text-white/80 hover:text-[#00E5FF] hover:bg-white/10"
                  : "text-white/20 cursor-not-allowed"
              }\`}
              title="Add Keyframe at Playhead"
            >
              <Diamond className="w-4 h-4" />
            </button>
          )}
          {onUndo && (
            <button
              id="btn-player-undo"
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed active:scale-95 transition-all"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {onRedo && (
            <button
              id="btn-player-redo"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed active:scale-95 transition-all"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};`;

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
              ? "bg-[#181822]/80 border-white/20 text-white hover:text-[#00E5FF] hover:border-[#00E5FF]"
              : "bg-black/40 border-white/5 text-white/20 cursor-not-allowed hidden"
          }\`}
          title="Add/Remove Keyframe"
        >
          <Diamond className="w-5 h-5 fill-transparent" strokeWidth={1.5} />
          {selectedClipId && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#181822] border border-white/20 flex items-center justify-center">
              <span className="text-[11px] font-bold text-white leading-none mb-[1px]">+</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
