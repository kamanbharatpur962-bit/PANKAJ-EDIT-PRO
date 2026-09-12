import React from "react";
import { 
  Scissors, 
  Music, 
  Type, 
  Layers, 
  Sparkles, 
  FileText, 
  Smartphone, 
  Sliders, 
  SlidersHorizontal, 
  Smile, 
  Palette,
  ChevronLeft,
  Gauge,
  PlaySquare,
  Trash2,
  Volume2,
  Crop,
  Repeat,
  Copy,
  RotateCcw,
  Diamond,
  Split as SplitIcon,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown
} from "lucide-react";

export type ActiveToolTab = 
  | "edit" 
  | "audio" 
  | "audioMixer"
  | "text" 
  | "overlay" 
  | "effects" 
  | "captions" 
  | "aspect" 
  | "filters" 
  | "adjust" 
  | "stickers" 
  | "background"
  | "speed"
  | "animations"
  | "volume"
  | "crop"
  | "color"
  | "song_to_text"
  | "ai"
  | "templates"
  | "keyframe";

interface ToolbarProps {
  activeTab: ActiveToolTab | null;
  onSelectTab: (tab: ActiveToolTab | null) => void;
  selectedClipId: string | null;
  onDeselectClip?: () => void;
  onSelectActiveClip?: () => void;
  onSplitClip?: () => void;
  onDeleteClip?: () => void;
  onDuplicateClip?: () => void;
  onReverseClip?: () => void;
  onReplaceClip?: () => void;
  onToggleKeyframe?: () => void;
  onOpenAddMedia?: () => void;
  onMoveClipLeft?: () => void;
  onMoveClipRight?: () => void;
  onOpenReorderModal?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTab, 
  onSelectTab,
  selectedClipId,
  onDeselectClip,
  onSelectActiveClip,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip,
  onReverseClip,
  onReplaceClip,
  onToggleKeyframe,
  onOpenAddMedia,
  onMoveClipLeft,
  onMoveClipRight,
  onOpenReorderModal,
}) => {
  // Mode 1: Main bottom tools when no clip is selected (Screenshots 1 & 2)
  const mainTabs = [
    {
      id: "edit",
      label: "Edit",
      icon: <Scissors className="w-5 h-5" />,
      onClick: () => {
        if (onSelectActiveClip) onSelectActiveClip();
        else onSelectTab("edit");
      }
    },
    {
      id: "audio",
      label: "Audio",
      icon: <Music className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "audio" ? null : "audio")
    },
    {
      id: "audioMixer",
      label: "Mixer",
      icon: <SlidersHorizontal className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "audioMixer" ? null : "audioMixer")
    },
    {
      id: "text",
      label: "Text",
      icon: <Type className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "text" ? null : "text")
    },
    {
      id: "overlay",
      label: "Overlay",
      icon: <Layers className="w-5 h-5" />,
      onClick: () => {
        if (onOpenAddMedia) onOpenAddMedia();
        else onSelectTab(activeTab === "overlay" ? null : "overlay");
      }
    },
    {
      id: "effects",
      label: "Effects",
      icon: <Sparkles className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "effects" ? null : "effects")
    },
    {
      id: "animations",
      label: "Animations",
      icon: <PlaySquare className="w-5 h-5 text-[#00E5FF]" />,
      onClick: () => onSelectTab(activeTab === "animations" ? null : "animations")
    },
    {
      id: "captions",
      label: "Captions",
      icon: <FileText className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "captions" ? null : "captions")
    },
    {
      id: "aspect",
      label: "Aspect ratio",
      icon: <Smartphone className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "aspect" ? null : "aspect")
    },
    {
      id: "filters",
      label: "Filters",
      icon: <Sliders className="w-5 h-5 text-[#FFB347]" />,
      onClick: () => onSelectTab(activeTab === "filters" ? null : "filters")
    },
    {
      id: "adjust",
      label: "Adjust",
      icon: <SlidersHorizontal className="w-5 h-5 text-[#38bdf8]" />,
      onClick: () => onSelectTab(activeTab === "adjust" ? null : "adjust")
    },
    {
      id: "color",
      label: "Color Grading",
      icon: <Palette className="w-5 h-5 text-[#10b981]" />,
      onClick: () => onSelectTab(activeTab === "color" ? null : "color")
    },
    {
      id: "stickers",
      label: "Stickers",
      icon: <Smile className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "stickers" ? null : "stickers")
    },
    {
      id: "background",
      label: "Background",
      icon: <Palette className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "background" ? null : "background")
    },
    {
      id: "keyframe",
      label: "Keyframes",
      icon: <Diamond className="w-5 h-5 text-[#FFB347]" />,
      onClick: () => onSelectTab(activeTab === "keyframe" ? null : "keyframe")
    },
  ];

  // Mode 2: Clip Edit tools when a clip IS SELECTED on timeline (Screenshot 3)
  const clipEditTabs = [
    {
      id: "move-left",
      label: "Move Left",
      icon: <ArrowLeft className="w-5 h-5 text-[#00E5FF]" />,
      onClick: onMoveClipLeft
    },
    {
      id: "move-right",
      label: "Move Right",
      icon: <ArrowRight className="w-5 h-5 text-[#00E5FF]" />,
      onClick: onMoveClipRight
    },
    {
      id: "reorder",
      label: "Reorder",
      icon: <ArrowUpDown className="w-5 h-5 text-[#F59E0B]" />,
      onClick: onOpenReorderModal
    },
    {
      id: "split",
      label: "Split",
      icon: <SplitIcon className="w-5 h-5" />,
      onClick: onSplitClip
    },
    {
      id: "keyframe",
      label: "Keyframes",
      icon: <Diamond className="w-5 h-5 text-[#FFB347]" />,
      onClick: () => onSelectTab(activeTab === "keyframe" ? null : "keyframe")
    },
    {
      id: "speed",
      label: "Speed",
      icon: <Gauge className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "speed" ? null : "speed")
    },
    {
      id: "animations",
      label: "Animations",
      icon: <PlaySquare className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "animations" ? null : "animations")
    },
    {
      id: "effects",
      label: "Effects",
      icon: <Sparkles className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "effects" ? null : "effects")
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="w-5 h-5 text-[#FF5252]" />,
      onClick: onDeleteClip
    },
    {
      id: "volume",
      label: "Volume",
      icon: <Volume2 className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "volume" ? null : "volume")
    },
    {
      id: "crop",
      label: "Crop",
      icon: <Crop className="w-5 h-5" />,
      onClick: () => onSelectTab(activeTab === "crop" ? null : "crop")
    },
    {
      id: "filters",
      label: "Filters",
      icon: <Sliders className="w-5 h-5 text-[#FFB347]" />,
      onClick: () => onSelectTab(activeTab === "filters" ? null : "filters")
    },
    {
      id: "adjust",
      label: "Adjust",
      icon: <SlidersHorizontal className="w-5 h-5 text-[#38bdf8]" />,
      onClick: () => onSelectTab(activeTab === "adjust" ? null : "adjust")
    },
    {
      id: "color",
      label: "Color Grading",
      icon: <Palette className="w-5 h-5 text-[#10b981]" />,
      onClick: () => onSelectTab(activeTab === "color" ? null : "color")
    },
    {
      id: "replace",
      label: "Replace",
      icon: <Repeat className="w-5 h-5" />,
      onClick: onReplaceClip || onOpenAddMedia
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: <Copy className="w-5 h-5" />,
      onClick: onDuplicateClip
    },
    {
      id: "reverse",
      label: "Reverse",
      icon: <RotateCcw className="w-5 h-5" />,
      onClick: onReverseClip
    },
  ];

  return (
    <nav className="h-16 sm:h-18 bg-[#0E0E12] border-t border-[#1C1C26] flex items-center px-2 z-20 shrink-0 overflow-x-auto no-scrollbar select-none">
      {/* If clip is selected, show back button on far left (Screenshot 3) */}
      {selectedClipId && onDeselectClip && (
        <button
          id="btn-toolbar-back-mode"
          onClick={onDeselectClip}
          className="flex flex-col items-center justify-center min-w-[50px] py-1.5 px-2 mr-1 rounded-xl bg-[#1C1C24] hover:bg-[#282834] text-white active:scale-95 transition-all shrink-0"
          title="Return to Main Tools"
        >
          <div className="p-1 rounded-lg text-white">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-[#888898]">
            Back
          </span>
        </button>
      )}

      {/* Render active items list based on clip selection */}
      <div className="flex items-center gap-1 sm:gap-2">
        {(selectedClipId ? clipEditTabs : mainTabs).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tool-btn-${tab.id}`}
              onClick={tab.onClick}
              className={`relative flex flex-col items-center justify-center min-w-[54px] sm:min-w-[62px] py-1 px-1.5 rounded-xl transition-all active:scale-95 shrink-0 ${
                isActive
                  ? "text-[#00E5FF] font-semibold bg-[#00E5FF]/10"
                  : "text-[#9090A0] hover:text-white hover:bg-[#1A1A24]"
              }`}
            >
              {/* Active top line */}
              {isActive && (
                <div className="absolute top-0 w-6 h-0.5 bg-[#00E5FF] rounded-full shadow-[0_0_8px_#00E5FF]" />
              )}

              <div className={`p-1 rounded-lg transition-colors ${isActive ? "text-[#00E5FF]" : "text-white/80"}`}>
                {tab.icon}
              </div>

              <span className="text-[10px] mt-0.5 whitespace-nowrap font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
