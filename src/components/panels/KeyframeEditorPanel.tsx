import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { 
  VideoProject, 
  Clip, 
  Keyframe, 
  KeyframeEasing 
} from "../../types";
import { 
  interpolateItemKeyframes, 
  applyKeyframeEasing 
} from "../../utils/videoRenderer";
import { 
  Diamond, 
  Plus, 
  Minus, 
  Trash2, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  X, 
  Activity, 
  Move, 
  ZoomIn, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  SlidersHorizontal,
  Crosshair,
  Gauge
} from "lucide-react";

interface KeyframeEditorPanelProps {
  project: VideoProject;
  selectedClipId: string | null;
  currentTime: number;
  onSelectClip: (clipId: string) => void;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onSeekTime: (time: number) => void;
  onClose: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

type PropertyKey = "scale" | "rotation" | "x" | "y" | "opacity";

interface PropertyConfig {
  key: PropertyKey;
  label: string;
  unit: string;
  color: string;
  trackBg: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  format: (v: number) => string;
}

const PROPERTY_CONFIGS: PropertyConfig[] = [
  {
    key: "x",
    label: "Position X",
    unit: "px",
    color: "#00E5FF",
    trackBg: "rgba(0, 229, 255, 0.12)",
    min: -300,
    max: 300,
    step: 1,
    defaultVal: 0,
    format: (v) => `${Math.round(v)}px`,
  },
  {
    key: "y",
    label: "Position Y",
    unit: "px",
    color: "#38BDF8",
    trackBg: "rgba(56, 189, 248, 0.12)",
    min: -300,
    max: 300,
    step: 1,
    defaultVal: 0,
    format: (v) => `${Math.round(v)}px`,
  },
  {
    key: "scale",
    label: "Scale",
    unit: "x",
    color: "#F59E0B",
    trackBg: "rgba(245, 158, 11, 0.12)",
    min: 0.1,
    max: 3.5,
    step: 0.05,
    defaultVal: 1.0,
    format: (v) => `${v.toFixed(2)}x`,
  },
  {
    key: "rotation",
    label: "Rotation",
    unit: "°",
    color: "#10B981",
    trackBg: "rgba(16, 185, 129, 0.12)",
    min: -360,
    max: 360,
    step: 1,
    defaultVal: 0,
    format: (v) => `${Math.round(v)}°`,
  },
  {
    key: "opacity",
    label: "Opacity",
    unit: "%",
    color: "#A855F7",
    trackBg: "rgba(168, 85, 247, 0.12)",
    min: 0,
    max: 1.0,
    step: 0.02,
    defaultVal: 1.0,
    format: (v) => `${Math.round(v * 100)}%`,
  },
];

const EASING_OPTIONS: { id: KeyframeEasing; label: string; desc: string; path: string }[] = [
  { id: "linear", label: "Linear", desc: "Constant speed", path: "M 4 28 L 36 4" },
  { id: "ease-in", label: "Ease In", desc: "Slow acceleration", path: "M 4 28 Q 26 28, 36 4" },
  { id: "ease-out", label: "Ease Out", desc: "Smooth deceleration", path: "M 4 28 Q 14 4, 36 4" },
  { id: "ease-in-out", label: "Ease In-Out", desc: "Cinematic S-curve", path: "M 4 28 C 16 28, 24 4, 36 4" },
  { id: "bounce", label: "Bounce", desc: "Elastic rebound", path: "M 4 28 Q 14 0, 20 28 Q 26 12, 30 28 L 36 28" },
  { id: "elastic", label: "Elastic", desc: "Dynamic snap overshoot", path: "M 4 28 C 12 4, 18 34, 26 0 C 30 10, 33 2, 36 4" },
];

export const KeyframeEditorPanel: React.FC<KeyframeEditorPanelProps> = ({
  project,
  selectedClipId,
  currentTime,
  onSelectClip,
  onUpdateClip,
  onSeekTime,
  onClose,
  isPlaying = false,
  onTogglePlay,
}) => {
  // Active clip resolution
  const activeClip = useMemo(() => {
    return project.clips.find((c) => c.id === selectedClipId) || project.clips[0] || null;
  }, [project.clips, selectedClipId]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<"tracks" | "graph">("tracks");
  const [selectedProperty, setSelectedProperty] = useState<PropertyKey>("scale");
  const [selectedKfIndex, setSelectedKfIndex] = useState<number>(0);
  const [draggingKfIndex, setDraggingKfIndex] = useState<number | null>(null);

  // Timeline track container ref for coordinate translation
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingPlayheadRef = useRef(false);

  // Clip duration calculations
  const clipSpeed = activeClip?.speed || 1.0;
  const clipDuration = activeClip 
    ? Math.max(0.5, (activeClip.trimEnd - activeClip.trimStart) / clipSpeed) 
    : 5.0;

  // Relative playhead position inside active clip (0 to clipDuration)
  const relClipTime = useMemo(() => {
    if (!activeClip) return 0;
    const rawRel = (currentTime - activeClip.startTime);
    return Math.max(0, Math.min(clipDuration, rawRel));
  }, [currentTime, activeClip, clipDuration]);

  // Keyframes list sorted by time
  const keyframes: Keyframe[] = useMemo(() => {
    if (!activeClip || !activeClip.keyframes) return [];
    return [...activeClip.keyframes].sort((a, b) => a.time - b.time);
  }, [activeClip]);

  // Ensure selectedKfIndex is within valid range
  useEffect(() => {
    if (keyframes.length === 0) {
      setSelectedKfIndex(0);
    } else if (selectedKfIndex >= keyframes.length) {
      setSelectedKfIndex(keyframes.length - 1);
    }
  }, [keyframes.length, selectedKfIndex]);

  const activeKf = keyframes[selectedKfIndex] || null;

  // Live interpolated values at current playhead
  const currentValues = useMemo(() => {
    if (!activeClip) return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 };
    return interpolateItemKeyframes(activeClip, relClipTime * clipSpeed);
  }, [activeClip, relClipTime, clipSpeed]);

  // Helper to seek timeline to clip-relative time
  const seekRelativeTime = useCallback((timeInClip: number) => {
    if (!activeClip) return;
    const clampedTime = Math.max(0, Math.min(clipDuration, timeInClip));
    const globalTime = activeClip.startTime + clampedTime;
    onSeekTime(parseFloat(globalTime.toFixed(3)));
  }, [activeClip, clipDuration, onSeekTime]);

  // Check if a keyframe is near the current playhead
  const keyframeAtPlayheadIndex = useMemo(() => {
    return keyframes.findIndex((k) => Math.abs(k.time - relClipTime) < 0.08);
  }, [keyframes, relClipTime]);

  // Add / Toggle keyframe at current playhead
  const handleToggleKeyframeAtPlayhead = () => {
    if (!activeClip) return;
    const existingIdx = keyframeAtPlayheadIndex;

    if (existingIdx >= 0) {
      // Remove keyframe
      const updated = keyframes.filter((_, idx) => idx !== existingIdx);
      onUpdateClip(activeClip.id, { keyframes: updated });
    } else {
      // Add new keyframe with current interpolated values
      const newKf: Keyframe = {
        id: `kf-${Date.now()}`,
        time: parseFloat(relClipTime.toFixed(2)),
        x: Math.round(currentValues.x),
        y: Math.round(currentValues.y),
        scale: parseFloat(currentValues.scale.toFixed(2)),
        rotation: Math.round(currentValues.rotation),
        opacity: parseFloat(currentValues.opacity.toFixed(2)),
        easing: "ease-in-out",
      };
      const updated = [...keyframes, newKf].sort((a, b) => a.time - b.time);
      onUpdateClip(activeClip.id, { keyframes: updated });
      const newIdx = updated.findIndex((k) => k.id === newKf.id || k.time === newKf.time);
      if (newIdx >= 0) setSelectedKfIndex(newIdx);
    }
  };

  // Update selected keyframe attributes
  const handleUpdateActiveKeyframe = (updates: Partial<Keyframe>) => {
    if (!activeClip || !activeKf) return;
    const copy = [...keyframes];
    const targetIdx = selectedKfIndex;
    if (targetIdx < 0 || targetIdx >= copy.length) return;

    copy[targetIdx] = {
      ...copy[targetIdx],
      ...updates,
    };

    // If time was updated, re-sort
    if (updates.time !== undefined) {
      copy.sort((a, b) => a.time - b.time);
      const updatedIdx = copy.findIndex((k) => k === copy[targetIdx]);
      if (updatedIdx >= 0) setSelectedKfIndex(updatedIdx);
    }

    onUpdateClip(activeClip.id, { keyframes: copy });
  };

  // Delete specific keyframe
  const handleDeleteKeyframe = (index: number) => {
    if (!activeClip) return;
    const updated = keyframes.filter((_, idx) => idx !== index);
    onUpdateClip(activeClip.id, { keyframes: updated });
    if (selectedKfIndex >= updated.length) {
      setSelectedKfIndex(Math.max(0, updated.length - 1));
    }
  };

  // Jump to previous / next keyframe
  const handleJumpPrevKeyframe = () => {
    if (keyframes.length === 0) return;
    const prev = [...keyframes].reverse().find((k) => k.time < relClipTime - 0.05);
    if (prev) {
      seekRelativeTime(prev.time);
      const idx = keyframes.findIndex((k) => k.time === prev.time);
      if (idx >= 0) setSelectedKfIndex(idx);
    } else {
      seekRelativeTime(keyframes[0].time);
      setSelectedKfIndex(0);
    }
  };

  const handleJumpNextKeyframe = () => {
    if (keyframes.length === 0) return;
    const next = keyframes.find((k) => k.time > relClipTime + 0.05);
    if (next) {
      seekRelativeTime(next.time);
      const idx = keyframes.findIndex((k) => k.time === next.time);
      if (idx >= 0) setSelectedKfIndex(idx);
    } else {
      const lastIdx = keyframes.length - 1;
      seekRelativeTime(keyframes[lastIdx].time);
      setSelectedKfIndex(lastIdx);
    }
  };

  // Timeline scrub handling
  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-keyframe-diamond]")) return; // handled by diamond drag

    const rect = timelineTrackRef.current?.getBoundingClientRect();
    if (!rect) return;

    isDraggingPlayheadRef.current = true;
    const updateTimeFromPointer = (clientX: number) => {
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const pct = x / rect.width;
      const targetTime = pct * clipDuration;
      seekRelativeTime(targetTime);
    };

    updateTimeFromPointer(e.clientX);

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingPlayheadRef.current) return;
      updateTimeFromPointer(moveEv.clientX);
    };

    const onPointerUp = () => {
      isDraggingPlayheadRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Dragging keyframe diamond horizontally along the timeline
  const handleDiamondDragStart = (e: React.PointerEvent, kfIndex: number) => {
    e.stopPropagation();
    const rect = timelineTrackRef.current?.getBoundingClientRect();
    if (!rect || !activeClip) return;

    setDraggingKfIndex(kfIndex);
    setSelectedKfIndex(kfIndex);

    const onMove = (moveEv: PointerEvent) => {
      const x = Math.max(0, Math.min(rect.width, moveEv.clientX - rect.left));
      const pct = x / rect.width;
      const newTime = parseFloat((pct * clipDuration).toFixed(2));

      const updated = [...keyframes];
      updated[kfIndex] = { ...updated[kfIndex], time: newTime };
      updated.sort((a, b) => a.time - b.time);

      onUpdateClip(activeClip.id, { keyframes: updated });
      seekRelativeTime(newTime);
    };

    const onUp = () => {
      setDraggingKfIndex(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // 1-Click Motion Presets
  const handleApplyPreset = (presetType: string) => {
    if (!activeClip) return;
    const dur = clipDuration;
    let newKeyframes: Keyframe[] = [];

    switch (presetType) {
      case "ken_burns":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          { time: parseFloat(dur.toFixed(2)), x: 0, y: 0, scale: 1.35, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
      case "whip_spin":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 1.0, rotation: -180, opacity: 0.2, easing: "ease-out" },
          { time: Math.min(dur, 0.8), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-out" },
        ];
        break;
      case "bounce_impact":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 0.2, rotation: 0, opacity: 0, easing: "bounce" },
          { time: Math.min(dur, 0.7), x: 0, y: 0, scale: 1.2, rotation: 0, opacity: 1.0, easing: "bounce" },
          { time: Math.min(dur, 1.1), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-out" },
        ];
        break;
      case "cinematic_drift":
        newKeyframes = [
          { time: 0, x: -70, y: 0, scale: 1.1, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          { time: parseFloat(dur.toFixed(2)), x: 70, y: 0, scale: 1.1, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
      case "fade_glide":
        newKeyframes = [
          { time: 0, x: 0, y: 50, scale: 0.95, rotation: 0, opacity: 0, easing: "ease-out" },
          { time: Math.min(dur, 0.9), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-out" },
        ];
        break;
      case "pulse_loop":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          { time: Math.min(dur, 0.6), x: 0, y: 0, scale: 1.2, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          { time: Math.min(dur, 1.2), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          { time: Math.min(dur, 1.8), x: 0, y: 0, scale: 1.2, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
    }

    onUpdateClip(activeClip.id, { keyframes: newKeyframes });
    setSelectedKfIndex(0);
    seekRelativeTime(0);
  };

  // Interactive 2D Joystick/Pad Drag
  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeKf) return;
    const rect = e.currentTarget.getBoundingClientRect();

    const updateXY = (clientX: number, clientY: number) => {
      const offsetX = clientX - (rect.left + rect.width / 2);
      const offsetY = clientY - (rect.top + rect.height / 2);
      const maxDist = rect.width / 2;

      // Scale to -200px .. +200px range
      const targetX = Math.round((offsetX / maxDist) * 200);
      const targetY = Math.round((offsetY / maxDist) * 200);

      handleUpdateActiveKeyframe({
        x: Math.max(-250, Math.min(250, targetX)),
        y: Math.max(-250, Math.min(250, targetY)),
      });
    };

    updateXY(e.clientX, e.clientY);

    const onMove = (moveEv: PointerEvent) => updateXY(moveEv.clientX, moveEv.clientY);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // Generate SVG curve points for Graph View
  const curvePoints = useMemo(() => {
    if (keyframes.length < 2) return "";
    const width = 600;
    const height = 180;
    const pad = 24;
    const plotW = width - pad * 2;
    const plotH = height - pad * 2;

    const activeProp = PROPERTY_CONFIGS.find((p) => p.key === selectedProperty)!;
    const minVal = activeProp.min;
    const maxVal = activeProp.max;
    const valSpan = maxVal - minVal || 1;

    const points: string[] = [];
    const steps = 120;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * clipDuration;
      const interp = interpolateItemKeyframes(activeClip!, t * clipSpeed);
      const val = interp[selectedProperty] ?? activeProp.defaultVal;

      const normX = pad + (t / clipDuration) * plotW;
      const normY = height - pad - ((val - minVal) / valSpan) * plotH;
      points.push(`${i === 0 ? "M" : "L"} ${normX.toFixed(1)} ${normY.toFixed(1)}`);
    }

    return points.join(" ");
  }, [keyframes, selectedProperty, clipDuration, clipSpeed, activeClip]);

  if (!activeClip) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-white/50 text-xs">
        No clip selected for keyframe editing.
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col bg-[#0F0F14] text-white select-none transition-all duration-200 ${
        isExpanded ? "fixed inset-x-0 bottom-0 top-16 z-50 shadow-2xl border-t border-[#2A2A38]" : "h-full"
      }`}
    >
      {/* 1. TOP HEADER & CLIP/VIEW SWITCHER */}
      <div className="h-12 px-3 border-b border-[#1F1F2C] bg-[#14141C] flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Diamond Icon & Title */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#FFB347]/15 border border-[#FFB347]/30 text-[#FFB347]">
            <Diamond className="w-3.5 h-3.5 fill-[#FFB347]" />
            <span className="text-xs font-bold tracking-wide">Keyframe Editor</span>
          </div>

          {/* Clip Selector if multiple clips exist */}
          {project.clips.length > 1 && (
            <div className="flex items-center gap-1 bg-[#1A1A26] px-2 py-0.5 rounded-lg border border-white/10 text-xs">
              <span className="text-white/40 text-[10px]">Clip:</span>
              <select
                value={activeClip.id}
                onChange={(e) => onSelectClip(e.target.value)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer max-w-[110px] truncate"
              >
                {project.clips.map((c, i) => (
                  <option key={c.id} value={c.id} className="bg-[#181822] text-white">
                    #{i + 1} {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Relative Playhead Time Badge */}
          <div className="flex items-center gap-1 font-mono text-[11px] bg-black/40 px-2 py-1 rounded-md border border-white/5">
            <span className="text-[#FFB347] font-bold">{relClipTime.toFixed(2)}s</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">{clipDuration.toFixed(2)}s</span>
          </div>

          {/* Total Keyframes Count */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-md">
            <span>{keyframes.length} Keyframes</span>
          </div>
        </div>

        {/* Header Right: Controls & View Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Toggle: Timeline Tracks vs Interpolation Graph */}
          <div className="flex items-center bg-[#1A1A24] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveView("tracks")}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeView === "tracks"
                  ? "bg-[#FFB347] text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Tracks
            </button>
            <button
              onClick={() => setActiveView("graph")}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                activeView === "graph"
                  ? "bg-[#FFB347] text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Curve Graph</span>
            </button>
          </div>

          {/* Play / Pause Toggle */}
          {onTogglePlay && (
            <button
              onClick={onTogglePlay}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#FFB347]" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Expand / Minimize Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
            title={isExpanded ? "Minimize panel" : "Expand Keyframe Studio"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Panel */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
            title="Close editor"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TIMELINE TRANSPORT & KEYFRAME STEPPERS */}
      <div className="h-10 px-3 bg-[#111118] border-b border-[#1E1E28] flex items-center justify-between text-xs shrink-0 gap-2 overflow-x-auto no-scrollbar">
        {/* Left: Keyframe Steppers & Add/Remove Diamond */}
        <div className="flex items-center gap-1.5">
          {/* Jump to Prev Keyframe */}
          <button
            onClick={handleJumpPrevKeyframe}
            disabled={keyframes.length === 0}
            className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#1C1C26] hover:bg-[#252534] disabled:opacity-30 disabled:hover:bg-[#1C1C26] text-white/90 text-[11px] font-semibold transition-colors"
            title="Jump to Previous Keyframe"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* ADD / REMOVE KEYFRAME AT PLAYHEAD */}
          <button
            onClick={handleToggleKeyframeAtPlayhead}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm ${
              keyframeAtPlayheadIndex >= 0
                ? "bg-[#FF5252]/20 border border-[#FF5252]/40 text-[#FF5252] hover:bg-[#FF5252]/30"
                : "bg-[#FFB347] text-black hover:bg-[#FFA327] font-semibold"
            }`}
            title={keyframeAtPlayheadIndex >= 0 ? "Remove keyframe at playhead" : "Add keyframe at playhead"}
          >
            <Diamond className={`w-3 h-3 ${keyframeAtPlayheadIndex >= 0 ? "fill-[#FF5252]" : "fill-black"}`} />
            <span>{keyframeAtPlayheadIndex >= 0 ? "Remove Keyframe" : "Add Keyframe"}</span>
          </button>

          {/* Jump to Next Keyframe */}
          <button
            onClick={handleJumpNextKeyframe}
            disabled={keyframes.length === 0}
            className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#1C1C26] hover:bg-[#252534] disabled:opacity-30 disabled:hover:bg-[#1C1C26] text-white/90 text-[11px] font-semibold transition-colors"
            title="Jump to Next Keyframe"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Delete active selected keyframe */}
          {activeKf && (
            <button
              onClick={() => handleDeleteKeyframe(selectedKfIndex)}
              className="p-1.5 text-[#FF5252] hover:bg-[#FF5252]/20 rounded-md transition-colors ml-1"
              title="Delete Selected Keyframe"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center / Right: Quick 1-Click Motion Presets */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-white/40 hidden md:inline uppercase tracking-wider font-semibold mr-1">
            Motion Presets:
          </span>
          {[
            { id: "ken_burns", label: "Ken Burns" },
            { id: "bounce_impact", label: "Bounce" },
            { id: "whip_spin", label: "Whip Spin" },
            { id: "cinematic_drift", label: "Drift" },
            { id: "fade_glide", label: "Glide" },
            { id: "pulse_loop", label: "Pulse" },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#FFB347]/20 hover:text-[#FFB347] border border-white/10 text-[10px] text-white/80 transition-all active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: TIMELINE TRACKS OR GRAPH EDITOR */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* VIEW A: MULTI-CHANNEL TIMELINE TRACKS */}
        {activeView === "tracks" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar p-3 space-y-3">
            {/* TIMELINE RULER & PLAYHEAD SCRUBBER */}
            <div className="bg-[#14141C] rounded-xl border border-white/10 p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FFB347]" />
                  <span>Interactive Keyframe Timeline</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  Drag diamonds to shift timing • Tap track to seek
                </span>
              </div>

              {/* Scrubbable Timeline Area */}
              <div 
                ref={timelineTrackRef}
                onPointerDown={handleTimelinePointerDown}
                className="relative h-10 bg-[#0C0C10] rounded-lg border border-white/5 cursor-pointer overflow-visible select-none"
              >
                {/* Ruler Ticks */}
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none text-[9px] font-mono text-white/40 items-center">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const t = (i / 5) * clipDuration;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-[1px] h-2 bg-white/20" />
                        <span className="mt-0.5">{t.toFixed(1)}s</span>
                      </div>
                    );
                  })}
                </div>

                {/* Connecting Easing Gradient Bar */}
                {keyframes.length >= 2 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#FFB347]/30 via-[#00E5FF]/30 to-[#A855F7]/30 rounded-full pointer-events-none"
                    style={{
                      left: `${(keyframes[0].time / clipDuration) * 100}%`,
                      width: `${((keyframes[keyframes.length - 1].time - keyframes[0].time) / clipDuration) * 100}%`,
                    }}
                  />
                )}

                {/* Keyframe Diamonds on Master Track */}
                {keyframes.map((kf, i) => {
                  const leftPct = (kf.time / clipDuration) * 100;
                  const isSelected = i === selectedKfIndex;
                  const isDragging = i === draggingKfIndex;

                  return (
                    <div
                      key={kf.id || i}
                      data-keyframe-diamond="true"
                      onPointerDown={(e) => handleDiamondDragStart(e, i)}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rotate-45 cursor-ew-resize z-20 transition-transform ${
                        isSelected
                          ? "bg-[#FFB347] ring-2 ring-white shadow-[0_0_8px_#FFB347] scale-125"
                          : "bg-white/80 hover:bg-[#FFB347] hover:scale-110"
                      } ${isDragging ? "ring-4 ring-[#00E5FF] scale-150 z-30" : ""}`}
                      style={{ left: `${leftPct}%` }}
                      title={`Keyframe #${i + 1} at ${kf.time}s (${kf.easing || "ease-in-out"})`}
                    >
                      {/* Tooltip on drag */}
                      {isDragging && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 -rotate-45 bg-black/90 px-1.5 py-0.5 rounded text-[9px] font-mono text-[#00E5FF] border border-[#00E5FF] whitespace-nowrap">
                          {kf.time}s
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Playhead Needle (Global Time Cursor) */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white z-30 pointer-events-none shadow-[0_0_8px_white]"
                  style={{ left: `${(relClipTime / clipDuration) * 100}%` }}
                >
                  <div className="w-3 h-3 -translate-x-[5px] -translate-y-1 rounded-full bg-white border border-black shadow" />
                </div>
              </div>
            </div>

            {/* PARAMETER LANES (Position, Scale, Rotation, Opacity) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider px-1">
                Parameter Channels & Interpolation
              </div>

              {PROPERTY_CONFIGS.map((prop) => {
                const currentVal = currentValues[prop.key];
                const isPropSelected = selectedProperty === prop.key;

                return (
                  <div
                    key={prop.key}
                    onClick={() => setSelectedProperty(prop.key)}
                    className={`rounded-xl border p-2.5 transition-all cursor-pointer ${
                      isPropSelected
                        ? "bg-[#161622] border-[#FFB347]/40 shadow-sm"
                        : "bg-[#121218] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: prop.color }} 
                        />
                        <span className="text-xs font-bold text-white">
                          {prop.label}
                        </span>
                      </div>

                      {/* Current Live Interpolated Value */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-white/40">Current:</span>
                        <span 
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10"
                          style={{ color: prop.color }}
                        >
                          {prop.format(currentVal)}
                        </span>
                      </div>
                    </div>

                    {/* Lane Track with Keyframe Dots */}
                    <div className="relative h-6 bg-[#0A0A0E] rounded-md border border-white/5 overflow-hidden">
                      {/* Range Fill Indicator */}
                      <div 
                        className="absolute inset-y-0 left-0 opacity-20"
                        style={{
                          backgroundColor: prop.color,
                          width: `${Math.max(0, Math.min(100, ((currentVal - prop.min) / (prop.max - prop.min)) * 100))}%`
                        }}
                      />

                      {/* Keyframe Nodes on Lane */}
                      {keyframes.map((kf, i) => {
                        const val = kf[prop.key] ?? prop.defaultVal;
                        const leftPct = (kf.time / clipDuration) * 100;
                        const isSelected = i === selectedKfIndex;

                        return (
                          <div
                            key={i}
                            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border ${
                              isSelected
                                ? "bg-white border-black shadow-[0_0_6px_white] scale-110"
                                : "bg-black/60 border-white/40"
                            }`}
                            style={{ 
                              left: `${leftPct}%`,
                              borderColor: prop.color
                            }}
                            title={`KF #${i + 1}: ${prop.format(val)}`}
                          />
                        );
                      })}

                      {/* Lane Playhead Line */}
                      <div
                        className="absolute inset-y-0 w-[1.5px] bg-white opacity-70 pointer-events-none"
                        style={{ left: `${(relClipTime / clipDuration) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW B: INTERPOLATION GRAPH / CURVE EDITOR */}
        {activeView === "graph" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar p-3 space-y-3">
            {/* Property Selector Tabs for Curve Plot */}
            <div className="flex items-center justify-between bg-[#14141C] p-1 rounded-xl border border-white/10">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {PROPERTY_CONFIGS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedProperty(p.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedProperty === p.key
                        ? "bg-white/15 text-white shadow"
                        : "text-white/50 hover:text-white"
                    }`}
                    style={{
                      borderBottom: selectedProperty === p.key ? `2px solid ${p.color}` : "none"
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Current Graph Value Readout */}
              <div className="px-2 py-0.5 font-mono text-xs font-bold text-[#FFB347]">
                {PROPERTY_CONFIGS.find((p) => p.key === selectedProperty)?.format(currentValues[selectedProperty])}
              </div>
            </div>

            {/* SVG Interpolation Curve Plot */}
            <div className="bg-[#0C0C10] rounded-xl border border-white/10 p-2 relative overflow-hidden">
              <div className="text-[10px] text-white/40 font-mono flex items-center justify-between mb-1">
                <span>Value Curve over Time</span>
                <span>Tension Easing: {activeKf?.easing || "ease-in-out"}</span>
              </div>

              <svg 
                viewBox="0 0 600 180" 
                className="w-full h-36 bg-[#08080C] rounded-lg border border-white/5 overflow-visible"
              >
                {/* Background Grid Lines */}
                <line x1="24" y1="90" x2="576" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="24" y1="45" x2="576" y2="45" stroke="rgba(255,255,255,0.04)" />
                <line x1="24" y1="135" x2="576" y2="135" stroke="rgba(255,255,255,0.04)" />

                {/* Vertical Time Guides */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line 
                    key={i} 
                    x1={24 + (i / 4) * 552} 
                    y1="10" 
                    x2={24 + (i / 4) * 552} 
                    y2="170" 
                    stroke="rgba(255,255,255,0.05)" 
                  />
                ))}

                {/* Plotted Interpolation Curve */}
                {curvePoints && (
                  <path
                    d={curvePoints}
                    fill="none"
                    stroke={PROPERTY_CONFIGS.find((p) => p.key === selectedProperty)?.color || "#FFB347"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Playhead Vertical Line */}
                <line
                  x1={24 + (relClipTime / clipDuration) * 552}
                  y1="10"
                  x2={24 + (relClipTime / clipDuration) * 552}
                  y2="170"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.9"
                />

                {/* Playhead Tracking Dot on Curve */}
                {(() => {
                  const prop = PROPERTY_CONFIGS.find((p) => p.key === selectedProperty)!;
                  const curVal = currentValues[selectedProperty];
                  const normX = 24 + (relClipTime / clipDuration) * 552;
                  const normY = 180 - 24 - ((curVal - prop.min) / (prop.max - prop.min || 1)) * 132;
                  return (
                    <circle
                      cx={normX}
                      cy={normY}
                      r="5"
                      fill="#FFFFFF"
                      stroke={prop.color}
                      strokeWidth="2.5"
                    />
                  );
                })()}

                {/* Keyframe Nodes on Curve */}
                {keyframes.map((kf, idx) => {
                  const prop = PROPERTY_CONFIGS.find((p) => p.key === selectedProperty)!;
                  const val = kf[selectedProperty] ?? prop.defaultVal;
                  const cx = 24 + (kf.time / clipDuration) * 552;
                  const cy = 180 - 24 - ((val - prop.min) / (prop.max - prop.min || 1)) * 132;
                  const isSelected = idx === selectedKfIndex;

                  return (
                    <g key={idx} onClick={() => setSelectedKfIndex(idx)} className="cursor-pointer">
                      <rect
                        x={cx - 5}
                        y={cy - 5}
                        width="10"
                        height="10"
                        transform={`rotate(45 ${cx} ${cy})`}
                        fill={isSelected ? "#FFB347" : "#FFFFFF"}
                        stroke="#000"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Easing Preset Selector for Movement Interpolation */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider flex items-center justify-between">
                <span>Movement Interpolation Curve (Easing)</span>
                <span className="text-[#FFB347] font-mono text-[11px] font-bold uppercase">
                  {activeKf?.easing || "ease-in-out"}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {EASING_OPTIONS.map((opt) => {
                  const isSelected = (activeKf?.easing || "ease-in-out") === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleUpdateActiveKeyframe({ easing: opt.id })}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                        isSelected
                          ? "bg-[#FFB347]/20 border-[#FFB347] text-[#FFB347] shadow-sm"
                          : "bg-[#14141C] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <svg width="36" height="28" viewBox="0 0 40 32" className="overflow-visible">
                        <path
                          d={opt.path}
                          fill="none"
                          stroke={isSelected ? "#FFB347" : "#888"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-[10px] font-bold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. BOTTOM PRECISION VALUE EDITOR DOCK: When Keyframe is Selected */}
        <div className="border-t border-[#1F1F2C] bg-[#12121A] p-3 shrink-0">
          {activeKf ? (
            <div className="space-y-2.5">
              {/* Header: Selected Keyframe Index & Timestamp */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rotate-45 bg-[#FFB347] shadow-[0_0_6px_#FFB347]" />
                  <span className="font-bold text-white">
                    Keyframe #{selectedKfIndex + 1} of {keyframes.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-[11px]">Timestamp:</span>
                  <div className="flex items-center gap-1 bg-[#1A1A26] px-2 py-0.5 rounded border border-white/10">
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max={clipDuration}
                      value={activeKf.time}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) handleUpdateActiveKeyframe({ time: val });
                      }}
                      className="w-12 bg-transparent font-mono text-[#FFB347] text-xs font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-white/50">s</span>
                  </div>
                </div>
              </div>

              {/* CONTROLS GRID: 2D Joystick (Position) + Sliders for Scale, Rotation, Opacity */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                {/* Col 1: 2D XY Position Joystick & Steppers */}
                <div className="bg-[#181824] p-2 rounded-xl border border-white/10 flex items-center gap-2.5">
                  {/* Interactive Joystick Pad */}
                  <div
                    onPointerDown={handleJoystickPointerDown}
                    className="w-16 h-16 bg-[#0E0E14] rounded-lg border border-white/15 relative cursor-crosshair shrink-0 flex items-center justify-center overflow-hidden"
                    title="Drag to reposition X & Y in 2D space"
                  >
                    {/* Crosshairs */}
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10" />

                    {/* Joystick Handle */}
                    <div
                      className="w-3.5 h-3.5 rounded-full bg-[#00E5FF] border border-white shadow-[0_0_6px_#00E5FF] absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        left: `${50 + ((activeKf.x || 0) / 200) * 40}%`,
                        top: `${50 + ((activeKf.y || 0) / 200) * 40}%`,
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-white/70">
                      <span>Position (X, Y)</span>
                      <button
                        onClick={() => handleUpdateActiveKeyframe({ x: 0, y: 0 })}
                        className="text-[10px] text-[#00E5FF] hover:underline"
                        title="Reset to center (0,0)"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                      <div className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5 flex justify-between">
                        <span className="text-white/40">X:</span>
                        <span className="text-[#00E5FF] font-bold">{Math.round(activeKf.x || 0)}px</span>
                      </div>
                      <div className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5 flex justify-between">
                        <span className="text-white/40">Y:</span>
                        <span className="text-[#38BDF8] font-bold">{Math.round(activeKf.y || 0)}px</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Scale Control Slider */}
                <div className="bg-[#181824] p-2 rounded-xl border border-white/10 space-y-1">
                  <div className="flex justify-between text-[11px] text-white/70 font-semibold">
                    <span>Scale</span>
                    <span className="font-mono text-[#F59E0B] font-bold">
                      {(activeKf.scale ?? 1.0).toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.05"
                    value={activeKf.scale ?? 1.0}
                    onChange={(e) => handleUpdateActiveKeyframe({ scale: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-[#0E0E14] rounded-lg cursor-pointer accent-[#F59E0B]"
                  />
                  <div className="flex justify-between gap-1 pt-0.5">
                    {[0.5, 1.0, 1.5, 2.0].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleUpdateActiveKeyframe({ scale: s })}
                        className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 hover:bg-white/10 rounded text-white/60"
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Col 3: Rotation Control Slider */}
                <div className="bg-[#181824] p-2 rounded-xl border border-white/10 space-y-1">
                  <div className="flex justify-between text-[11px] text-white/70 font-semibold">
                    <span>Rotation</span>
                    <span className="font-mono text-[#10B981] font-bold">
                      {Math.round(activeKf.rotation || 0)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={activeKf.rotation || 0}
                    onChange={(e) => handleUpdateActiveKeyframe({ rotation: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-[#0E0E14] rounded-lg cursor-pointer accent-[#10B981]"
                  />
                  <div className="flex justify-between gap-1 pt-0.5">
                    {[-90, 0, 90, 180].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleUpdateActiveKeyframe({ rotation: r })}
                        className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 hover:bg-white/10 rounded text-white/60"
                      >
                        {r}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Col 4: Opacity Control Slider */}
                <div className="bg-[#181824] p-2 rounded-xl border border-white/10 space-y-1">
                  <div className="flex justify-between text-[11px] text-white/70 font-semibold">
                    <span>Opacity</span>
                    <span className="font-mono text-[#A855F7] font-bold">
                      {Math.round((activeKf.opacity ?? 1.0) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.05"
                    value={activeKf.opacity ?? 1.0}
                    onChange={(e) => handleUpdateActiveKeyframe({ opacity: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-[#0E0E14] rounded-lg cursor-pointer accent-[#A855F7]"
                  />
                  <div className="flex justify-between gap-1 pt-0.5">
                    {[0.25, 0.5, 0.75, 1.0].map((o) => (
                      <button
                        key={o}
                        onClick={() => handleUpdateActiveKeyframe({ opacity: o })}
                        className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 hover:bg-white/10 rounded text-white/60"
                      >
                        {Math.round(o * 100)}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-white/40 flex items-center justify-center gap-2">
              <Diamond className="w-3.5 h-3.5 text-[#FFB347]" />
              <span>
                No keyframe selected. Move playhead and tap <strong className="text-[#FFB347]">"Add Keyframe"</strong> to begin animating.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
