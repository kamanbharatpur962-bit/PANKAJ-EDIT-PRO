import React, { useState } from "react";
import { Clip } from "../../types";
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpDown, 
  Check, 
  Film, 
  Image as ImageIcon,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

interface ReorderClipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (clipId: string) => void;
  onApplyReorder: (reorderedClips: Clip[]) => void;
}

export const ReorderClipsModal: React.FC<ReorderClipsModalProps> = ({
  isOpen,
  onClose,
  clips,
  selectedClipId,
  onSelectClip,
  onApplyReorder,
}) => {
  const [localClips, setLocalClips] = useState<Clip[]>(clips);

  // Sync with clips prop when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalClips([...clips]);
    }
  }, [isOpen, clips]);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: "left" | "right" | "first" | "last") => {
    const list = [...localClips];
    const item = list[index];

    if (direction === "left" && index > 0) {
      list[index] = list[index - 1];
      list[index - 1] = item;
    } else if (direction === "right" && index < list.length - 1) {
      list[index] = list[index + 1];
      list[index + 1] = item;
    } else if (direction === "first" && index > 0) {
      list.splice(index, 1);
      list.unshift(item);
    } else if (direction === "last" && index < list.length - 1) {
      list.splice(index, 1);
      list.push(item);
    }

    setLocalClips(list);
    onSelectClip(item.id);
  };

  const handleSave = () => {
    onApplyReorder(localClips);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-[#121218] border border-[#2A2A38] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#181822]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Reorder Clips <span className="text-xs px-2 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] font-mono">आगे-पीछे करें</span>
              </h2>
              <p className="text-xs text-white/50">
                फोटो या वीडियो क्लिप्स का क्रम बदलें (Move earlier or later)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clips List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
          {localClips.map((clip, index) => {
            const isSelected = clip.id === selectedClipId;
            const clipDur = ((clip.trimEnd - clip.trimStart) / (clip.speed || 1)).toFixed(1);
            const isPhoto = clip.url?.match(/\.(jpg|jpeg|png|webp|avif)/i) || clip.type === "photo";

            return (
              <div
                key={clip.id}
                onClick={() => onSelectClip(clip.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1E1E2C] border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10"
                    : "bg-[#161620] border-white/5 hover:border-white/20"
                }`}
              >
                {/* Index badge */}
                <div className="w-6 h-6 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-white/70 shrink-0">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 flex items-center justify-center">
                  {clip.url ? (
                    <img src={clip.url} alt={clip.name} className="w-full h-full object-cover" />
                  ) : isPhoto ? (
                    <ImageIcon className="w-5 h-5 text-white/40" />
                  ) : (
                    <Film className="w-5 h-5 text-white/40" />
                  )}
                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 rounded text-[8px] font-mono text-white">
                    {clipDur}s
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">
                      {clip.name}
                    </span>
                    {clip.speed !== 1 && (
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF]">
                        {clip.speed}x
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                    <span>{isPhoto ? "Photo" : "Video"}</span>
                    <span>•</span>
                    <span>Position: #{index + 1} of {localClips.length}</span>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Jump to first */}
                  <button
                    onClick={() => handleMove(index, "first")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white/80 hover:text-white transition-all active:scale-95"
                    title="Send to very beginning"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Move Left / Earlier */}
                  <button
                    onClick={() => handleMove(index, "left")}
                    disabled={index === 0}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/30 disabled:opacity-20 text-[#00E5FF] font-bold text-xs transition-all active:scale-95"
                    title="Move clip backward (पीछे करें)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पीछे</span>
                  </button>

                  {/* Move Right / Later */}
                  <button
                    onClick={() => handleMove(index, "right")}
                    disabled={index === localClips.length - 1}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/30 disabled:opacity-20 text-[#00E5FF] font-bold text-xs transition-all active:scale-95"
                    title="Move clip forward (आगे करें)"
                  >
                    <span>आगे</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Jump to last */}
                  <button
                    onClick={() => handleMove(index, "last")}
                    disabled={index === localClips.length - 1}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white/80 hover:text-white transition-all active:scale-95"
                    title="Send to very end"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-[#181822]">
          <span className="text-xs text-white/50">
            {localClips.length} क्लिप्स क्रमानुसार सेट हैं
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#00E5FF] text-black text-xs font-bold hover:bg-[#00E5FF]/90 shadow-lg shadow-[#00E5FF]/20 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Order (सेट करें)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
