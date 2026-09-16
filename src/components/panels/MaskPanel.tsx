import React from "react";
import { 
  Ban, 
  Minus, 
  Split, 
  Circle, 
  Square, 
  Heart, 
  Star,
  FlipVertical,
  SquareSplitHorizontal
} from "lucide-react";
import { VideoClip, MaskShape } from "../../types";

interface MaskPanelProps {
  clip: VideoClip;
  onUpdate: (updates: Partial<VideoClip>) => void;
  onClose: () => void;
}

export const MaskPanel: React.FC<MaskPanelProps> = ({ clip, onUpdate, onClose }) => {
  const currentMask = clip.maskShape || "none";
  const isInverted = clip.maskInvert || false;

  const maskTypes: { id: MaskShape; label: string; icon: React.ReactNode }[] = [
    { id: "none", label: "None", icon: <Ban className="w-5 h-5" /> },
    { id: "linear", label: "Linear", icon: <Minus className="w-5 h-5" /> },
    { id: "horizontal", label: "Horizontal", icon: <SquareSplitHorizontal className="w-5 h-5" /> },
    { id: "radial", label: "Mirror", icon: <Split className="w-5 h-5" /> },
    { id: "circle", label: "Circle", icon: <Circle className="w-5 h-5" /> },
    { id: "rectangle", label: "Rectangle", icon: <Square className="w-5 h-5" /> },
    { id: "heart", label: "Heart", icon: <Heart className="w-5 h-5" /> },
    { id: "star", label: "Star", icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full bg-[#181818] rounded-t-2xl border-t border-white/5 animate-slide-up flex flex-col h-[280px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <h3 className="text-white font-medium text-sm">Mask</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Mask Types */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4">
          {maskTypes.map((mask) => {
            const isActive = currentMask === mask.id;
            return (
              <button
                key={mask.id}
                onClick={() => onUpdate({ maskShape: mask.id })}
                className={`flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-xl transition-all ${
                  isActive 
                    ? "bg-white/10 border border-[#00E5FF] text-[#00E5FF]" 
                    : "bg-black/30 border border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="mb-2">
                  {mask.icon}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{mask.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mask Properties (only show if a mask is selected) */}
        {currentMask !== "none" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm font-medium flex items-center gap-2">
                <FlipVertical className="w-4 h-4" />
                Invert Mask
              </span>
              <button
                onClick={() => onUpdate({ maskInvert: !isInverted })}
                className={`w-12 h-6 rounded-full relative transition-colors ${isInverted ? 'bg-[#00E5FF]' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isInverted ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            {/* If we needed feather/blur for mask we could add it here */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Feather (Blur Amount)</span>
                <span className="text-white/60 text-xs">{clip.blurAmount || 0}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={clip.blurAmount || 0}
                onChange={(e) => onUpdate({ blurAmount: parseInt(e.target.value) })}
                className="w-full accent-[#00E5FF] bg-white/10 h-1.5 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
