import React, { useState, useMemo } from "react";
import { AspectRatio, Clip, VideoProject } from "../../types";
import { 
  Check, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Volume2, 
  VolumeX, 
  Gauge, 
  Crop as CropIcon, 
  Sparkles, 
  Smartphone, 
  Palette, 
  Smile, 
  Maximize,
  RotateCcw,
  Search,
  Ban,
  Zap,
  Clock,
  Flame,
  LogIn,
  LogOut,
  Repeat,
  Layers,
  Video,
  Activity
} from "lucide-react";
import { ANIMATIONS_200, ANIMATION_CATEGORIES, AnimationCategory, AnimationPreset200 } from "../../data/animations200";

interface SheetHeaderProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  onReset?: () => void;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ title, icon, onClose, onReset }) => (
  <div className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-white/5 bg-[#181818]">
    <div className="flex items-center gap-2 text-white font-medium text-[15px]">
      <span className="text-[#00E5FF] opacity-80">{icon}</span>
      <span>{title}</span>
    </div>
    <div className="flex items-center gap-3">
      {onReset && (
        <button
          onClick={onReset}
          className="text-[12px] text-white/50 hover:text-white transition-colors"
        >
          Reset
        </button>
      )}
      <button
        onClick={onClose}
        className="p-1.5 active:scale-95 transition-transform"
        title="Apply and Close"
      >
        <Check className="w-6 h-6 text-white" strokeWidth={2} />
      </button>
    </div>
  </div>
);

// 1. SPEED DRAWER
interface SpeedSheetProps {
  clip: Clip;
  onUpdateClip: (updates: Partial<Clip>) => void;
  onClose: () => void;
}

export const SpeedSheet: React.FC<SpeedSheetProps> = ({ clip, onUpdateClip, onClose }) => {
  const currentSpeed = clip.speed || 1.0;
  const presets = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0];

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full">
      <SheetHeader
        title={`Speed: ${currentSpeed.toFixed(1)}x`}
        icon={<Gauge className="w-4 h-4" />}
        onClose={onClose}
        onReset={() => onUpdateClip({ speed: 1.0 })}
      />
      <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
        {/* Preset speed chips */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1">
          {presets.map((s) => (
            <button
              key={s}
              onClick={() => onUpdateClip({ speed: s })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                Math.abs(currentSpeed - s) < 0.05
                  ? "bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/30 scale-105"
                  : "bg-[#1C1C26] text-white/70 hover:text-white hover:bg-[#282836]"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Speed Continuous Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#888898] font-mono">
            <span>0.1x Slow Motion</span>
            <span className="text-[#00E5FF] font-bold text-xs">{currentSpeed.toFixed(2)}x</span>
            <span>10.0x Fast Forward</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={currentSpeed}
            onChange={(e) => onUpdateClip({ speed: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#252532] accent-[#00E5FF] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// 2. VOLUME DRAWER
interface VolumeSheetProps {
  clip: Clip;
  onUpdateClip: (updates: Partial<Clip>) => void;
  onClose: () => void;
}

export const VolumeSheet: React.FC<VolumeSheetProps> = ({ clip, onUpdateClip, onClose }) => {
  const volume = clip.volume ?? 100;
  const isMuted = clip.muted ?? false;
  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full">
      <SheetHeader
        title={`Volume: ${isMuted ? "Muted" : `${Math.round(volume)}%`}`}
        icon={<Volume2 className="w-4 h-4" />}
        onClose={onClose}
        onReset={() => onUpdateClip({ volume: 100, muted: false, fadeIn: 0, fadeOut: 0 })}
      />
      <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
        {/* Main Volume Slider & Mute */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateClip({ muted: !isMuted })}
            className={`p-2.5 rounded-xl transition-all ${
              isMuted ? "bg-[#FF5252]/20 text-[#FF5252]" : "bg-[#1C1C26] text-white hover:bg-[#282836]"
            }`}
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] text-[#888898]">
              <span>Level</span>
              <span className="text-[#00E5FF] font-mono font-bold">{Math.round(volume)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={volume}
              disabled={isMuted}
              onChange={(e) => onUpdateClip({ volume: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-[#252532] accent-[#00E5FF] rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Fade In & Fade Out */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1 bg-[#181822] p-2.5 rounded-xl border border-white/5">
            <div className="flex justify-between text-[10px] text-[#888898]">
              <span>Fade In</span>
              <span className="text-white font-mono">{fadeIn.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={fadeIn}
              onChange={(e) => onUpdateClip({ fadeIn: parseFloat(e.target.value) })}
              className="w-full h-1 bg-[#252532] accent-[#00E5FF] rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-[#181822] p-2.5 rounded-xl border border-white/5">
            <div className="flex justify-between text-[10px] text-[#888898]">
              <span>Fade Out</span>
              <span className="text-white font-mono">{fadeOut.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={fadeOut}
              onChange={(e) => onUpdateClip({ fadeOut: parseFloat(e.target.value) })}
              className="w-full h-1 bg-[#252532] accent-[#00E5FF] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. CROP & TRANSFORM DRAWER
interface CropSheetProps {
  clip: Clip;
  onUpdateClip: (updates: Partial<Clip>) => void;
  onClose: () => void;
}

export const CropSheet: React.FC<CropSheetProps> = ({ clip, onUpdateClip, onClose }) => {
  const rotation = clip.rotation || 0;
  const scale = clip.scale || 1.0;

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full">
      <SheetHeader
        title="Crop & Transform"
        icon={<CropIcon className="w-4 h-4" />}
        onClose={onClose}
        onReset={() => onUpdateClip({ rotation: 0, scale: 1.0, x: 0, y: 0 })}
      />
      <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
        {/* Quick Transform Action Buttons */}
        <div className="flex items-center justify-around gap-2">
          <button
            onClick={() => onUpdateClip({ rotation: (rotation + 90) % 360 })}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#1C1C26] hover:bg-[#282836] text-white active:scale-95 transition-all flex-1"
          >
            <RotateCw className="w-5 h-5 text-[#00E5FF]" />
            <span className="text-[10px] text-white/70">Rotate 90°</span>
          </button>

          <button
            onClick={() => onUpdateClip({ scale: scale < 0 ? Math.abs(scale) : -scale })}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#1C1C26] hover:bg-[#282836] text-white active:scale-95 transition-all flex-1"
          >
            <FlipHorizontal className="w-5 h-5 text-[#00E5FF]" />
            <span className="text-[10px] text-white/70">Mirror H</span>
          </button>

          <button
            onClick={() => onUpdateClip({ rotation: (rotation + 180) % 360 })}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#1C1C26] hover:bg-[#282836] text-white active:scale-95 transition-all flex-1"
          >
            <FlipVertical className="w-5 h-5 text-[#00E5FF]" />
            <span className="text-[10px] text-white/70">Flip V</span>
          </button>
        </div>

        {/* Zoom & Scale Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#888898]">
            <span>Zoom Scale</span>
            <span className="text-[#00E5FF] font-mono font-bold">{Math.abs(scale).toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.05"
            value={Math.abs(scale)}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdateClip({ scale: scale < 0 ? -val : val });
            }}
            className="w-full h-1.5 bg-[#252532] accent-[#00E5FF] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// 4. ANIMATIONS DRAWER
interface AnimationsSheetProps {
  clip: Clip;
  onUpdateClip: (updates: Partial<Clip>) => void;
  onClose: () => void;
}

// 4. ANIMATIONS DRAWER (200+ Professional Animations)
interface AnimationsSheetProps {
  clip: Clip;
  onUpdateClip: (updates: Partial<Clip>) => void;
  onClose: () => void;
}

const getAnimationImage = (anim: AnimationPreset200) => {
  if (anim.category === "Beat & Flash") {
    return "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=100&h=100&fit=crop&q=80";
  } else if (anim.category === "3D & Warp") {
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80";
  } else if (anim.category === "Cinematic Camera") {
    return "https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=100&h=100&fit=crop&q=80";
  } else if (anim.type === "in") {
    return "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop&q=80";
  } else if (anim.type === "out") {
    return "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=100&h=100&fit=crop&q=80";
  } else if (anim.type === "combo") {
    return "https://images.unsplash.com/photo-1557683316-973673baf926?w=100&h=100&fit=crop&q=80";
  } else if (anim.type === "loop") {
    return "https://images.unsplash.com/photo-1557682260-96773eb01377?w=100&h=100&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80";
};

export const AnimationsSheet: React.FC<AnimationsSheetProps> = ({ clip, onUpdateClip, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<AnimationCategory>("In");
  const [duration, setDuration] = useState<number>(clip.animationDuration || 0.6);

  // Filter 200+ presets based on category
  const filteredAnimations = useMemo(() => {
    return ANIMATIONS_200.filter((anim) => {
      if (activeCategory === "All") return true;
      return anim.category === activeCategory;
    });
  }, [activeCategory]);

  const handleSelectAnimation = (anim: AnimationPreset200) => {
    onUpdateClip({
      animationId: anim.id,
      animationType: anim.type,
      animationDuration: duration,
    });
  };

  const handleClearAnimation = () => {
    onUpdateClip({
      animationId: undefined,
      animationType: undefined,
    });
  };

  const handleDurationChange = (newDur: number) => {
    setDuration(newDur);
    if (clip.animationId) {
      onUpdateClip({ animationDuration: newDur });
    }
  };

  // Main UI
  return (
    <div className="flex-1 bg-[#181818] text-white flex flex-col h-full overflow-hidden">
      {/* Header with Tabs and Checkmark */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-6 h-full overflow-x-auto no-scrollbar mask-fade-right pr-4">
          {["In", "Out", "Combo", "Loop", "3D & Warp"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveCategory(tab as AnimationCategory)}
              className={`h-full relative text-[15px] font-medium transition-colors whitespace-nowrap ${activeCategory === tab ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              {tab}
              {activeCategory === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00E5FF] rounded-t-full shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
              )}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-1.5 active:scale-95 transition-transform shrink-0 ml-2">
          <Check className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* 200+ Presets Scrollable Grid */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar min-h-0">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-3 gap-y-5">
          {/* 1. None / Remove Card */}
          <button
            onClick={handleClearAnimation}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-full aspect-square rounded-[14px] flex items-center justify-center transition-all ${
              !clip.animationId
                ? "border-[1.5px] border-white bg-black/60 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                : "border border-transparent bg-[#222222] group-hover:bg-[#2A2A2A]"
            }`}>
              <Ban className="w-7 h-7 text-white/40" strokeWidth={1.5} />
            </div>
            <span className={`text-[11px] whitespace-nowrap ${!clip.animationId ? "text-white font-medium" : "text-white/60"}`}>None</span>
          </button>

          {/* 2. List of Filtered Animation Cards */}
          {filteredAnimations.map((anim) => {
            const isSelected = clip.animationId === anim.id;
            return (
              <button
                key={anim.id}
                onClick={() => handleSelectAnimation(anim)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-full aspect-square rounded-[14px] overflow-hidden flex items-center justify-center relative transition-all ${
                  isSelected
                    ? "border-[1.5px] border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-[0.98]"
                    : "border border-transparent bg-[#222222] group-hover:bg-[#2A2A2A]"
                }`}>
                  <img 
                    src={getAnimationImage(anim)} 
                    alt={anim.name} 
                    className={`w-full h-full object-cover transition-opacity ${isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`} 
                  />
                  {anim.tag && (
                    <span className="absolute top-1 right-1 text-[8px] font-bold bg-black/60 backdrop-blur-md px-1 rounded text-white border border-white/10">
                      {anim.tag}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] whitespace-nowrap truncate w-full px-1 text-center ${isSelected ? "text-white font-medium" : "text-white/60"}`}>
                  {anim.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Slider (only show if animation is selected) */}
      {clip.animationId && (
        <div className="px-5 py-3 border-t border-white/5 bg-[#181818] shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-medium text-white/80 w-16">Duration</span>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={duration}
              onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
              className="flex-1 accent-[#00E5FF] h-1.5 bg-[#2A2A2A] rounded-full appearance-none cursor-pointer"
            />
            <span className="text-[12px] font-mono text-white/80 w-8 text-right">{duration.toFixed(1)}s</span>
          </div>
        </div>
      )}
    </div>
  );
};


// 5. ASPECT RATIO DRAWER
interface AspectRatioSheetProps {
  project: VideoProject;
  onSelectRatio: (ratio: AspectRatio) => void;
  onClose: () => void;
}

export const AspectRatioSheet: React.FC<AspectRatioSheetProps> = ({ project, onSelectRatio, onClose }) => {
  const ratios: { id: AspectRatio; label: string; sub: string; iconClass: string }[] = [
    { id: "9:16", label: "9:16", sub: "TikTok / Reels", iconClass: "w-4 h-7" },
    { id: "16:9", label: "16:9", sub: "YouTube", iconClass: "w-7 h-4" },
    { id: "1:1", label: "1:1", sub: "Instagram Post", iconClass: "w-6 h-6" },
    { id: "4:5", label: "4:5", sub: "Feed Portrait", iconClass: "w-5 h-6" },
    { id: "21:9", label: "21:9", sub: "Cinematic Film", iconClass: "w-8 h-3.5" },
  ];

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full">
      <SheetHeader
        title={`Canvas Ratio: ${project.aspectRatio}`}
        icon={<Smartphone className="w-4 h-4" />}
        onClose={onClose}
      />
      <div className="p-4 flex items-center justify-around gap-2 overflow-x-auto no-scrollbar">
        {ratios.map((r) => {
          const isSelected = project.aspectRatio === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRatio(r.id)}
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all border shrink-0 min-w-[72px] ${
                isSelected
                  ? "bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-lg shadow-[#00E5FF]/20"
                  : "bg-[#1C1C26] border-white/5 text-white/70 hover:text-white hover:bg-[#282836]"
              }`}
            >
              <div className="h-10 flex items-center justify-center">
                <div className={`border-2 rounded ${r.iconClass} ${isSelected ? "border-[#00E5FF]" : "border-white/50"}`} />
              </div>
              <span className="text-xs font-bold mt-1">{r.label}</span>
              <span className="text-[9px] text-[#888898]">{r.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 6. BACKGROUND DRAWER
interface BackgroundSheetProps {
  project: VideoProject;
  onUpdateProject: (updates: Partial<VideoProject>) => void;
  onClose: () => void;
}

export const BackgroundSheet: React.FC<BackgroundSheetProps> = ({ project, onUpdateProject, onClose }) => {
  const colors = [
    "#000000",
    "#0E0E12",
    "#181824",
    "#1E293B",
    "#00E5FF",
    "#FF5252",
    "#FFB347",
    "#9D68FF",
    "#47BD47",
  ];

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full">
      <SheetHeader
        title="Canvas Background"
        icon={<Palette className="w-4 h-4" />}
        onClose={onClose}
      />
      <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
        <div className="text-xs font-semibold text-white/80">Background Colors & Canvas Blur</div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => onUpdateProject({ title: project.title })}
              className="w-9 h-9 rounded-xl border-2 border-white/20 hover:border-white transition-all shrink-0 shadow-md active:scale-95"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. STICKERS DRAWER
interface StickersSheetProps {
  onAddSticker: (emoji: string) => void;
  onClose: () => void;
}

export const StickersSheet: React.FC<StickersSheetProps> = ({ onAddSticker, onClose }) => {
  const stickerList = [
    "🔥", "✨", "🚀", "❤️", "⚡", "🎬", "💯", "👑", "💥", "🎵",
    "👏", "😎", "🌟", "🎉", "💎", "⭐", "🏆", "👀", "🙌", "🎯",
  ];

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full">
      <SheetHeader
        title="Stickers & Overlays"
        icon={<Smile className="w-4 h-4" />}
        onClose={onClose}
      />
      <div className="p-3 grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto no-scrollbar">
        {stickerList.map((stk) => (
          <button
            key={stk}
            onClick={() => onAddSticker(stk)}
            className="text-2xl p-2 rounded-xl bg-[#1C1C26] hover:bg-[#282836] border border-white/5 active:scale-110 transition-all flex items-center justify-center shadow-sm"
          >
            {stk}
          </button>
        ))}
      </div>
    </div>
  );
};
