import React, { useEffect, useRef, useState } from "react";
import { VideoProject } from "../types";
import { renderFrame } from "../utils/videoRenderer";
import { 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  RotateCw,
  Diamond,
  Split
} from "lucide-react";

interface PreviewPlayerProps {
  project: VideoProject;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onTogglePlay: () => void;
  isBeforeAfterActive: boolean;
  onToggleBeforeAfter: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleKeyframe?: () => void;
  selectedClipId?: string | null;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  project,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  isBeforeAfterActive,
  onToggleBeforeAfter,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onToggleKeyframe,
  selectedClipId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Aspect ratio styling dimensions - optimized for phone & desktop preview
  const getAspectRatioClasses = () => {
    switch (project.aspectRatio) {
      case "9:16":
        return "aspect-[9/16] h-[34vh] sm:h-[40vh] max-h-[420px]";
      case "16:9":
        return "aspect-[16/9] w-full max-w-[500px] h-auto";
      case "1:1":
        return "aspect-square h-[32vh] sm:h-[38vh] max-h-[380px]";
      case "4:5":
        return "aspect-[4/5] h-[34vh] sm:h-[40vh] max-h-[400px]";
      case "21:9":
        return "aspect-[21/9] w-full max-w-[550px] h-auto";
      default:
        return "aspect-[9/16] h-[34vh] max-h-[400px]";
    }
  };

  // Render canvas frame on time change or project updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use internal logical resolution of 1080p
    const width = 1080;
    let height = 1920;
    if (project.aspectRatio === "16:9") height = 608;
    else if (project.aspectRatio === "1:1") height = 1080;
    else if (project.aspectRatio === "4:5") height = 1350;
    else if (project.aspectRatio === "21:9") height = 460;

    canvas.width = width;
    canvas.height = height;

    renderFrame(ctx, width, height, project, currentTime, {
      showBeforeAfter: isBeforeAfterActive,
      showSafeZones: false,
      isPlaying,
    });
  }, [project, currentTime, isBeforeAfterActive, isPlaying]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center bg-[#09090C] pt-2 pb-1.5 px-3 select-none w-full shrink-0"
    >
      {/* Canvas Viewport Frame */}
      <div className="relative flex items-center justify-center w-full max-w-full overflow-hidden">
        <div
          className={`relative rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center transition-all ${
            selectedClipId ? "ring-1 ring-[#00E5FF]/40" : "border border-[#1A1A22]"
          } ${getAspectRatioClasses()}`}
          onClick={onTogglePlay}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Quick Play Indicator Overlay on Pause */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none transition-opacity">
              <div className="w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                <Play className="w-4 h-4 ml-0.5 fill-current" />
              </div>
            </div>
          )}

          {/* Top floating studio badge */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[9px] font-mono tracking-wider text-white/70 flex items-center gap-1.5 pointer-events-none">
            <span className="text-[#00E5FF] font-semibold">{project.aspectRatio}</span>
            <span className="text-white/20">|</span>
            <span>HD</span>
          </div>

          {/* Before / After active indicator */}
          {isBeforeAfterActive && (
            <div className="absolute top-2 left-2 bg-[#FFB347] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-lg">
              RAW
            </div>
          )}

          {/* Active Filter badge */}
          {project.activeFilter !== "none" && !isBeforeAfterActive && (
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md border border-white/10 text-[#00E5FF] text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <span>{project.activeFilter}</span>
            </div>
          )}
        </div>
      </div>

      {/* Media Playback & Action Bar directly below preview (matching screenshot) */}
      <div className="w-full max-w-md mt-2 flex items-center justify-between px-3 text-[#A0A0B0]">
        {/* Left: Fullscreen Toggle */}
        <button
          id="btn-player-fullscreen"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Fullscreen Preview"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Center: Play / Pause */}
        <button
          id="btn-play-pause-center"
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Right: Keyframe Diamond, Undo, Redo */}
        <div className="flex items-center gap-1.5">
          {onToggleKeyframe && (
            <button
              id="btn-player-keyframe"
              onClick={onToggleKeyframe}
              disabled={!selectedClipId}
              className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                selectedClipId
                  ? "text-white/80 hover:text-[#00E5FF] hover:bg-white/10"
                  : "text-white/20 cursor-not-allowed"
              }`}
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
};
