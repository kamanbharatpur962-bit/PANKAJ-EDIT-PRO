const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const targetStr = '{/* Media Playback & Action Bar directly below preview (matching screenshot) */}';
const startIndex = content.indexOf(targetStr);

const replace = `{/* Media Playback & Action Bar directly below preview (matching screenshot) */}
      <div className="w-full mt-3 flex items-center justify-between px-2 text-[#A0A0B0] relative">
        {/* Left: Fullscreen Toggle */}
        <div className="flex-1 flex justify-start">
          <button
            id="btn-player-fullscreen"
            onClick={toggleFullscreen}
            className="p-1 rounded-lg text-white/70 hover:text-white active:scale-95 transition-all"
            title="Fullscreen Preview"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Play / Pause */}
        <div className="flex-1 flex justify-center">
          <button
            id="btn-play-pause-center"
            onClick={onTogglePlay}
            className="w-10 h-10 flex items-center justify-center text-white active:scale-95 transition-all"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </button>
        </div>

        {/* Right: Keyframe Diamond, Copy/Off, Undo, Redo */}
        <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6">
          {onToggleKeyframe && (
            <button
              id="btn-player-keyframe"
              onClick={onToggleKeyframe}
              disabled={!selectedClipId}
              className={\`relative transition-all active:scale-95 \${
                selectedClipId
                  ? "text-white/80 hover:text-white"
                  : "text-white/20 cursor-not-allowed"
              }\`}
              title="Add Keyframe at Playhead"
            >
              <Diamond className="w-5 h-5 fill-transparent" strokeWidth={1.5} />
              {selectedClipId && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black border border-white flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white leading-none mb-[1px]">+</span>
                </div>
              )}
            </button>
          )}

          <div className="flex items-center gap-1 opacity-50 cursor-not-allowed" title="Template Off (Coming Soon)">
             <div className="relative flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <div className="absolute -bottom-[2px] -right-[6px] bg-black px-[2px] rounded text-[7px] font-bold text-white border border-white">OFF</div>
             </div>
          </div>

          <button
            id="btn-player-undo"
            onClick={onUndo}
            disabled={!canUndo}
            className="text-white/70 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed active:scale-95 transition-all"
            title="Undo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-player-redo"
            onClick={onRedo}
            disabled={!canRedo}
            className="text-white/70 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed active:scale-95 transition-all"
            title="Redo"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};`;

if (startIndex !== -1) {
    content = content.substring(0, startIndex) + replace;
    fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
    console.log("Success Preview");
} else {
    console.log("Target not found!");
}
