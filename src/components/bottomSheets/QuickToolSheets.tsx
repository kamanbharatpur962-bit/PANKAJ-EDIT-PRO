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
  Flame
} from "lucide-react";
import { ANIMATIONS_200, ANIMATION_CATEGORIES, AnimationCategory, AnimationPreset200 } from "../../data/animations200";

interface SheetHeaderProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  onReset?: () => void;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ title, icon, onClose, onReset }) => (
  <div className="h-10 px-4 border-b border-[#22222E] flex items-center justify-between bg-[#121218] shrink-0">
    <div className="flex items-center gap-2 text-white font-semibold text-xs">
      <span className="text-[#00E5FF]">{icon}</span>
      <span>{title}</span>
    </div>
    <div className="flex items-center gap-2">
      {onReset && (
        <button
          onClick={onReset}
          className="text-[11px] text-[#888898] hover:text-white px-2 py-0.5 rounded transition-colors"
        >
          Reset
        </button>
      )}
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-full bg-[#00E5FF] text-black font-bold flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#00E5FF]/20"
        title="Apply and Close"
      >
        <Check className="w-4 h-4 stroke-[3]" />
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

export const AnimationsSheet: React.FC<AnimationsSheetProps> = ({ clip, onUpdateClip, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<AnimationCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState<number>(clip.animationDuration || 0.6);

  // Filter 200+ presets based on category and search query
  const filteredAnimations = useMemo(() => {
    return ANIMATIONS_200.filter((anim) => {
      const matchesCategory =
        activeCategory === "All" || anim.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        anim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (anim.tag && anim.tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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

  return (
    <div className="bg-[#121218] text-white flex flex-col h-full overflow-hidden">
      <SheetHeader
        title={`Clip Animations (${ANIMATIONS_200.length}+ Presets)`}
        icon={<Sparkles className="w-4 h-4 text-[#00E5FF]" />}
        onClose={onClose}
        onReset={clip.animationId ? handleClearAnimation : undefined}
      />

      {/* Search Bar & Animation Duration Control */}
      <div className="px-3 pt-2.5 pb-1.5 space-y-2 shrink-0 border-b border-[#1C1C28]">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 relative flex items-center bg-[#181822] rounded-xl px-2.5 py-1.5 border border-white/10 focus-within:border-[#00E5FF]/60 transition-colors">
            <Search className="w-3.5 h-3.5 text-white/50 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 200+ animations (zoom, bounce, 3D, whip, beat...)"
              className="bg-transparent text-xs text-white placeholder-white/40 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/40 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Duration Slider Quick Display */}
          <div className="flex items-center gap-1.5 bg-[#181822] px-2.5 py-1.5 rounded-xl border border-white/10 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-bold text-white/90 w-8 text-right">
              {duration.toFixed(1)}s
            </span>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={duration}
              onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
              className="w-16 accent-[#00E5FF] cursor-pointer h-1.5 bg-black/40 rounded-lg"
              title="Animation Duration"
            />
          </div>
        </div>

        {/* Category Filter Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {ANIMATION_CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? ANIMATIONS_200.length
                : ANIMATIONS_200.filter((a) => a.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? "bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20"
                    : "bg-[#1C1C26] text-white/70 hover:text-white hover:bg-[#262634]"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    isSelected ? "bg-black/20 text-black font-extrabold" : "text-white/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 200+ Presets Scrollable Grid */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar min-h-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {/* 1. None / Remove Card */}
          <button
            onClick={handleClearAnimation}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 text-center group ${
              !clip.animationId
                ? "bg-[#00E5FF]/15 border-[#00E5FF] shadow-sm shadow-[#00E5FF]/20"
                : "bg-[#181822] hover:bg-[#222230] border-white/5"
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-black/40 flex items-center justify-center text-white/50 group-hover:text-white mb-1.5">
              <Ban className="w-4 h-4 text-[#FF5252]" />
            </div>
            <span className="text-[11px] font-bold text-white/90">None</span>
            <span className="text-[9px] text-white/40 mt-0.5">No animation</span>
          </button>

          {/* 2. List of Filtered Animation Cards */}
          {filteredAnimations.map((anim) => {
            const isSelected = clip.animationId === anim.id;

            return (
              <button
                key={anim.id}
                onClick={() => handleSelectAnimation(anim)}
                className={`relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all active:scale-95 text-center group ${
                  isSelected
                    ? "bg-[#00E5FF]/20 border-[#00E5FF] shadow-md shadow-[#00E5FF]/20 ring-1 ring-[#00E5FF]"
                    : "bg-[#181822] hover:bg-[#222230] border-white/5 hover:border-white/20"
                }`}
                title={`${anim.name} • ${anim.description}`}
              >
                {/* Tag Badge (HOT, 3D, PRO, TREND, VIRAL) */}
                {anim.tag && (
                  <span
                    className={`absolute top-1.5 right-1.5 text-[8px] font-extrabold px-1 rounded-md tracking-wider ${
                      anim.tag === "HOT" || anim.tag === "VIRAL"
                        ? "bg-[#FF5252] text-white"
                        : anim.tag === "3D"
                        ? "bg-[#A855F7] text-white"
                        : anim.tag === "PRO"
                        ? "bg-[#F59E0B] text-black"
                        : "bg-[#00E5FF] text-black"
                    }`}
                  >
                    {anim.tag}
                  </span>
                )}

                {/* Animated Icon Preview Box */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 transition-transform group-hover:scale-110 ${
                    isSelected
                      ? "bg-[#00E5FF] text-black font-bold"
                      : "bg-black/50 text-[#00E5FF]"
                  }`}
                >
                  {anim.category === "Beat & Flash" ? (
                    <Zap className="w-4 h-4" />
                  ) : anim.tag === "HOT" ? (
                    <Flame className="w-4 h-4 text-[#FF5252]" />
                  ) : anim.type === "in" ? (
                    <span className="text-[10px] font-extrabold uppercase">IN</span>
                  ) : anim.type === "out" ? (
                    <span className="text-[10px] font-extrabold uppercase">OUT</span>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                {/* Animation Name */}
                <span
                  className={`text-[11px] font-semibold truncate w-full text-center leading-tight ${
                    isSelected ? "text-[#00E5FF] font-bold" : "text-white/90"
                  }`}
                >
                  {anim.name}
                </span>

                {/* Subtitle / Category info */}
                <span className="text-[9px] text-white/40 mt-0.5 truncate w-full">
                  {anim.category} • {anim.duration}s
                </span>

                {/* Selected Indicator Check */}
                {isSelected && (
                  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#00E5FF] text-black flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredAnimations.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center text-white/40">
            <Search className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No animations matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-2 text-xs text-[#00E5FF] underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
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
