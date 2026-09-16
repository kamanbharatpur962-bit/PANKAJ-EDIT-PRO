const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const replacement = `import React from "react";
import {
  Scissors,
  Music,
  Type,
  ImageIcon,
  Star,
  Subtitles,
  Smartphone,
  Sliders,
  SlidersHorizontal,
  Palette,
  Smile,
  Diamond,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Split as SplitIcon,
  Gauge,
  PlaySquare,
  Sparkles,
  Trash2,
  Volume2,
  Crop,
  Repeat,
  Copy,
  RotateCcw,
  ChevronLeft,
  Square,
  Aperture,
  SquareDashed,
  Wand2
} from "lucide-react";
import { ActiveToolTab } from "../types";

// NOTE: Added more icon imports above for cleaner icons

type ActiveToolTabType = ActiveToolTab | null;

interface ToolbarProps {
  activeTab: ActiveToolTabType;
  onSelectTab: (tab: ActiveToolTabType) => void;
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
      icon: <Scissors className="w-[22px] h-[22px]" />,
      onClick: () => {
        if (onSelectActiveClip) onSelectActiveClip();
        else onSelectTab("edit");
      }
    },
    {
      id: "audio",
      label: "Audio",
      icon: <Music className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "audio" ? null : "audio")
    },
    {
      id: "text",
      label: "Text",
      icon: <Type className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "text" ? null : "text")
    },
    {
      id: "overlay",
      label: "Overlay",
      icon: <ImageIcon className="w-[22px] h-[22px]" />,
      onClick: () => {
        if (onOpenAddMedia) onOpenAddMedia();
        else onSelectTab(activeTab === "overlay" ? null : "overlay");
      }
    },
    {
      id: "effects",
      label: "Effects",
      icon: <Star className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "effects" ? null : "effects")
    },
    {
      id: "captions",
      label: "Captions",
      icon: <Subtitles className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "captions" ? null : "captions")
    },
    {
      id: "aspect",
      label: "Aspect ratio",
      icon: <Square className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "aspect" ? null : "aspect")
    },
    {
      id: "filters",
      label: "Filters",
      icon: <Aperture className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "filters" ? null : "filters")
    },
    {
      id: "adjust",
      label: "Adjust",
      icon: <SlidersHorizontal className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "adjust" ? null : "adjust")
    },
    {
      id: "stickers",
      label: "Stickers",
      icon: <Smile className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "stickers" ? null : "stickers")
    },
    {
      id: "background",
      label: "Background",
      icon: <SquareDashed className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "background" ? null : "background")
    },
  ];

  // Mode 2: Clip Edit tools when a clip IS SELECTED on timeline (Screenshot 3)
  const clipEditTabs = [
    {
      id: "split",
      label: "Split",
      icon: <SplitIcon className="w-[22px] h-[22px]" />,
      onClick: onSplitClip
    },
    {
      id: "speed",
      label: "Speed",
      icon: <Gauge className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "speed" ? null : "speed")
    },
    {
      id: "animations",
      label: "Animations",
      icon: <PlaySquare className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "animations" ? null : "animations")
    },
    {
      id: "effects",
      label: "Effects",
      icon: <Wand2 className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "effects" ? null : "effects")
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="w-[22px] h-[22px]" />,
      onClick: onDeleteClip
    },
    {
      id: "volume",
      label: "Volume",
      icon: <Volume2 className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "volume" ? null : "volume")
    },
    {
      id: "crop",
      label: "Crop",
      icon: <Crop className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "crop" ? null : "crop")
    },
    {
      id: "filters",
      label: "Filters",
      icon: <Aperture className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "filters" ? null : "filters")
    },
    {
      id: "adjust",
      label: "Adjust",
      icon: <SlidersHorizontal className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "adjust" ? null : "adjust")
    },
    {
      id: "replace",
      label: "Replace",
      icon: <Repeat className="w-[22px] h-[22px]" />,
      onClick: onReplaceClip || onOpenAddMedia
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: <Copy className="w-[22px] h-[22px]" />,
      onClick: onDuplicateClip
    },
    {
      id: "reverse",
      label: "Reverse",
      icon: <RotateCcw className="w-[22px] h-[22px]" />,
      onClick: onReverseClip
    },
  ];

  return (
    <nav className="h-[90px] bg-[#181818] flex items-center px-4 z-20 shrink-0 overflow-x-auto no-scrollbar select-none">
      {/* If clip is selected, show back button on far left (Screenshot 3) */}
      {selectedClipId && onDeselectClip && (
        <div className="flex items-center h-full py-3 mr-5">
          <button
            id="btn-toolbar-back-mode"
            onClick={onDeselectClip}
            className="flex items-center justify-center w-10 h-full rounded-lg bg-[#2A2A2A] hover:bg-[#333333] text-white active:scale-95 transition-all shrink-0"
            title="Return to Main Tools"
          >
            <ChevronLeft className="w-[26px] h-[26px]" strokeWidth={2.5} />
          </button>
          <div className="w-[1px] h-2/5 bg-white/20 ml-5" />
        </div>
      )}

      {/* Render active items list based on clip selection */}
      <div className="flex items-center h-full py-3 gap-[26px] sm:gap-8">
        {(selectedClipId ? clipEditTabs : mainTabs).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={\`tool-btn-\${tab.id}\`}
              onClick={tab.onClick}
              className={\`flex flex-col items-center justify-center transition-all active:scale-95 shrink-0 \${
                isActive ? "text-white" : "text-white/60 hover:text-white"
              }\`}
            >
              <div className="p-1 mb-0.5">
                {tab.icon}
              </div>
              <span className="text-[11px] tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
`
fs.writeFileSync('src/components/Toolbar.tsx', replacement);
console.log('Done Toolbar');
