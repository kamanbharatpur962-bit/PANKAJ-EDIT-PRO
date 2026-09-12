import React, { useState } from "react";
import { AspectRatio } from "../types";
import { 
  X, 
  HelpCircle, 
  Flame, 
  ChevronDown, 
  Check, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Square,
  Eye,
  Plus
} from "lucide-react";

interface NavbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onBackToHome: () => void;
  onOpenExport: () => void;
  onOpenAIModal: () => void;
  onOpenAddMedia?: () => void;
  isBeforeAfterActive: boolean;
  onToggleBeforeAfter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  onTitleChange,
  aspectRatio,
  onAspectRatioChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onBackToHome,
  onOpenExport,
  onOpenAIModal,
  onOpenAddMedia,
  isBeforeAfterActive,
  onToggleBeforeAfter,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<string>("1080P");
  const [selectedFps, setSelectedFps] = useState<number>(30);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const resolutions = [
    { label: "720P", desc: "Fast export · Smaller file" },
    { label: "1080P", desc: "Full HD · Recommended" },
    { label: "2K / 4K", desc: "Ultra HD · Studio Quality" },
  ];

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-[#0E0E12] border-b border-[#1E1E26] px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left section: X (Exit), ? (Help), 🔥 (AI / Hot Trends) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="btn-navbar-close"
          onClick={onBackToHome}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Exit to Home"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          id="btn-navbar-help"
          onClick={() => setShowHelpModal(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Editing Tips & Shortcuts"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          id="btn-navbar-flame-ai"
          onClick={onOpenAIModal}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#FF5722] hover:bg-[#FF5722]/15 active:scale-95 transition-all relative group"
          title="AI Smart Director & Trending Filters"
        >
          <Flame className="w-5 h-5 fill-current animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF5722]" />
        </button>

        {/* Project Title (Click to rename) */}
        <div className="hidden lg:flex items-center ml-2 border-l border-white/10 pl-3">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                id="input-project-title"
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                autoFocus
                className="bg-[#1C1C24] text-white text-xs font-medium px-2 py-0.5 rounded border border-[#00E5FF]/80 focus:outline-none"
              />
              <button
                onClick={handleTitleSubmit}
                className="p-1 rounded text-[#00E5FF] hover:bg-white/10"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setTempTitle(title);
                setIsEditingTitle(true);
              }}
              className="cursor-pointer group flex items-center gap-1.5"
              title="Tap to rename"
            >
              <span className="text-xs font-medium text-[#BBB] group-hover:text-white transition-colors truncate max-w-[130px]">
                {title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center section: Resolution & Frame Rate Pill (e.g. 1080P ▼) */}
      <div className="relative">
        <button
          id="btn-resolution-dropdown"
          onClick={() => setShowResolutionMenu(!showResolutionMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1C24] hover:bg-[#252532] border border-[#2E2E3E] text-white text-xs font-bold tracking-wide active:scale-95 transition-all shadow-sm"
        >
          <span>{selectedResolution}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#888898]" />
        </button>

        {/* Resolution & FPS Popover Modal */}
        {showResolutionMenu && (
          <div className="absolute top-11 left-1/2 -translate-x-1/2 w-64 bg-[#181822] border border-[#2E2E3E] rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#888898] mb-1.5 px-1">
                Export Resolution
              </div>
              <div className="space-y-1">
                {resolutions.map((res) => (
                  <button
                    key={res.label}
                    onClick={() => setSelectedResolution(res.label)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      selectedResolution === res.label
                        ? "bg-[#00E5FF]/15 text-[#00E5FF] font-bold border border-[#00E5FF]/40"
                        : "text-white/80 hover:bg-[#222230]"
                    }`}
                  >
                    <div>
                      <div>{res.label}</div>
                      <div className="text-[10px] text-[#888898] font-normal">{res.desc}</div>
                    </div>
                    {selectedResolution === res.label && <Check className="w-4 h-4 text-[#00E5FF]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#262636]">
              <div className="text-[10px] uppercase font-bold text-[#888898] mb-1.5 px-1">
                Frame Rate (FPS)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[30, 60].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setSelectedFps(fps)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                      selectedFps === fps
                        ? "bg-[#00E5FF] text-black shadow-sm"
                        : "bg-[#222230] text-white/80 hover:bg-[#2A2A3A]"
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowResolutionMenu(false)}
              className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-all mt-1"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Right section: Vibrant Cyan Export Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="btn-navbar-export"
          onClick={onOpenExport}
          className="h-8 sm:h-9 px-4 sm:px-5 rounded-full bg-[#00E5FF] hover:bg-[#33EAFF] active:scale-95 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/25 transition-all"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export</span>
        </button>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181822] border border-[#2E2E3E] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00E5FF]" />
                Video Editing Guide
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-[#A0A0B0] space-y-2.5">
              <div className="p-2.5 rounded-xl bg-[#20202E]">
                <span className="font-bold text-white">Tap a clip:</span> Select any photo or video clip on the timeline to unlock Split, Speed, Filters, Volume, and Animations.
              </div>
              <div className="p-2.5 rounded-xl bg-[#20202E]">
                <span className="font-bold text-white">White handles:</span> Drag the white left/right handles on a selected clip to trim its start or end duration.
              </div>
              <div className="p-2.5 rounded-xl bg-[#20202E]">
                <span className="font-bold text-white">Bottom tools:</span> All editing tools are placed at the bottom for comfortable one-thumb editing.
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
