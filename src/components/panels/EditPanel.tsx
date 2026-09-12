import React, { useState } from "react";
import { Clip, Keyframe, KeyframeEasing, MaskShape, VideoProject } from "../../types";
import { 
  Scissors, 
  Crop, 
  RotateCw, 
  Copy, 
  Play, 
  Gauge, 
  Sparkles, 
  Eye, 
  Crosshair, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  Plus, 
  Trash2,
  Minimize2,
  ZoomIn,
  Move,
  Activity,
  ChevronRight,
  Wind
} from "lucide-react";

interface EditPanelProps {
  project: VideoProject;
  selectedClipId: string | null;
  currentTime: number;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onSplitClip: () => void;
  onDuplicateClip: () => void;
  onDeleteClip: () => void;
  onAddKeyframe: (clipId: string, keyframe: Keyframe) => void;
  onRemoveKeyframe: (clipId: string, time: number) => void;
  onOpenKeyframeEditor?: () => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({
  project,
  selectedClipId,
  currentTime,
  onUpdateClip,
  onSplitClip,
  onDuplicateClip,
  onDeleteClip,
  onAddKeyframe,
  onRemoveKeyframe,
  onOpenKeyframeEditor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "basic" | "speed" | "transform" | "chroma" | "mask" | "keyframes" | "tracking"
  >("basic");
  const [selectedKfIndex, setSelectedKfIndex] = useState<number>(0);

  const clip = project.clips.find((c) => c.id === selectedClipId) || project.clips[0];
  if (!clip) {
    return (
      <div className="p-4 text-center text-slate-400 text-xs">
        No clip selected. Tap a clip on the timeline to edit.
      </div>
    );
  }

  const relClipTime = Math.max(0, currentTime - clip.startTime) * clip.speed;

  // Motion Blur intensity helper (ranges from 0 to 1)
  const currentMotionBlurIntensity = typeof clip.motionBlurIntensity === "number"
    ? Math.max(0, Math.min(1, clip.motionBlurIntensity))
    : typeof clip.motionBlur === "number"
      ? Math.max(0, Math.min(1, clip.motionBlur))
      : clip.motionBlur ? 0.5 : 0;

  const handleMotionBlurIntensityChange = (val: number) => {
    const intensity = Math.max(0, Math.min(1, Number.isFinite(val) ? val : 0));
    onUpdateClip(clip.id, {
      motionBlurIntensity: intensity,
      motionBlur: intensity,
    });
  };

  const handleToggleMotionBlur = () => {
    if (currentMotionBlurIntensity > 0) {
      handleMotionBlurIntensityChange(0);
    } else {
      handleMotionBlurIntensityChange(0.5);
    }
  };

  // Keyframe helper updater
  const handleUpdateSelectedKeyframe = (updates: Partial<Keyframe>) => {
    if (!clip.keyframes || clip.keyframes.length === 0) return;
    const newKfs = [...clip.keyframes];
    const index = Math.min(selectedKfIndex, newKfs.length - 1);
    if (index >= 0 && index < newKfs.length) {
      newKfs[index] = { ...newKfs[index], ...updates };
      onUpdateClip(clip.id, { keyframes: newKfs });
    }
  };

  // Apply Keyframe Presets
  const applyKeyframePreset = (presetName: string) => {
    const clipDur = (clip.trimEnd - clip.trimStart) / clip.speed;
    let newKeyframes: Keyframe[] = [];

    switch (presetName) {
      case "ken_burns":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          { time: parseFloat(clipDur.toFixed(2)), x: 15, y: -10, scale: 1.3, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
      case "cinematic_drift":
        newKeyframes = [
          { time: 0, x: -40, y: 0, scale: 1.1, rotation: 0, opacity: 1.0, easing: "ease-out" },
          { time: parseFloat(clipDur.toFixed(2)), x: 40, y: 0, scale: 1.1, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
      case "bounce_pop":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 0.2, rotation: -10, opacity: 0, easing: "bounce" },
          { time: parseFloat(Math.min(0.6, clipDur * 0.3).toFixed(2)), x: 0, y: 0, scale: 1.05, rotation: 2, opacity: 1.0, easing: "ease-out" },
          { time: parseFloat(Math.min(0.9, clipDur * 0.45).toFixed(2)), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "linear" },
        ];
        break;
      case "whip_spin":
        newKeyframes = [
          { time: 0, x: 0, y: 0, scale: 1.4, rotation: -45, opacity: 0.3, easing: "ease-out" },
          { time: parseFloat(Math.min(0.7, clipDur * 0.35).toFixed(2)), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
      case "fade_glide":
        newKeyframes = [
          { time: 0, x: 0, y: 35, scale: 0.95, rotation: 0, opacity: 0, easing: "ease-out" },
          { time: parseFloat(Math.min(1.0, clipDur * 0.4).toFixed(2)), x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
        ];
        break;
      default:
        break;
    }

    if (newKeyframes.length > 0) {
      onUpdateClip(clip.id, { keyframes: newKeyframes });
      setSelectedKfIndex(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E0E0E0] select-none overflow-y-auto p-3">
      {/* Sub tabs */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-[#1A1A1A] overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: "basic", label: "Basic Edit" },
          { id: "speed", label: "Speed & Ramp" },
          { id: "transform", label: "Transform & Crop" },
          { id: "chroma", label: "Chroma Key" },
          { id: "mask", label: "Masking & Blur" },
          { id: "keyframes", label: "Keyframes" },
          { id: "tracking", label: "Tracking & Stable" },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeSubTab === sub.id
                ? "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 shadow-sm"
                : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618]"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Sub Tab Content */}
      <div className="py-3 flex-1">
        {/* 1. Basic Edit (Split, Trim, Volume, Reverse, Freeze, Duplicate) */}
        {activeSubTab === "basic" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                id="btn-sub-split"
                onClick={onSplitClip}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#161618] hover:bg-[#202024] border border-[#222] active:scale-95 transition-all text-xs font-medium"
              >
                <Scissors className="w-4 h-4 text-[#FFB347] mb-1" />
                <span>Split</span>
              </button>

              <button
                id="btn-sub-duplicate"
                onClick={onDuplicateClip}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#161618] hover:bg-[#202024] border border-[#222] active:scale-95 transition-all text-xs font-medium"
              >
                <Copy className="w-4 h-4 text-[#47BD47] mb-1" />
                <span>Duplicate</span>
              </button>

              <button
                id="btn-sub-reverse"
                onClick={() => onUpdateClip(clip.id, { reversed: !clip.reversed })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs font-medium ${
                  clip.reversed
                    ? "bg-[#FFB347]/20 border-[#FFB347]/50 text-[#FFB347]"
                    : "bg-[#161618] border-[#222] hover:bg-[#202024]"
                }`}
              >
                <RotateCw className="w-4 h-4 mb-1" />
                <span>{clip.reversed ? "Reversed" : "Reverse"}</span>
              </button>

              <button
                id="btn-sub-freeze"
                onClick={() => onUpdateClip(clip.id, { isFrozen: !clip.isFrozen })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs font-medium ${
                  clip.isFrozen
                    ? "bg-[#FFB347]/20 border-[#FFB347]/50 text-[#FFB347]"
                    : "bg-[#161618] border-[#222] hover:bg-[#202024]"
                }`}
              >
                <Play className="w-4 h-4 mb-1" />
                <span>Freeze</span>
              </button>

              <button
                id="btn-sub-rotate"
                onClick={() =>
                  onUpdateClip(clip.id, { rotation: ((clip.rotation || 0) + 90) % 360 })
                }
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#161618] hover:bg-[#202024] border border-[#222] active:scale-95 transition-all text-xs font-medium"
              >
                <RotateCw className="w-4 h-4 text-[#FFB347] mb-1" />
                <span>Rotate 90°</span>
              </button>

              <button
                id="btn-sub-delete"
                onClick={onDeleteClip}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#FF4444]/15 hover:bg-[#FF4444]/25 border border-[#FF4444]/30 active:scale-95 transition-all text-xs font-medium text-[#FF4444]"
              >
                <Trash2 className="w-4 h-4 text-[#FF4444] mb-1" />
                <span>Delete</span>
              </button>
            </div>

            {/* Volume slider */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#E0E0E0]">Clip Audio Volume</span>
                <span className="font-mono text-[#FFB347] font-semibold">{clip.volume}%</span>
              </div>
              <input
                id="slider-clip-volume"
                type="range"
                min="0"
                max="200"
                value={clip.volume}
                onChange={(e) => onUpdateClip(clip.id, { volume: Number(e.target.value) })}
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
            </div>

            {/* Fade in / Fade out */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Fade In</span>
                  <span className="font-mono text-[#FFB347]">{clip.fadeIn || 0}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={clip.fadeIn || 0}
                  onChange={(e) => onUpdateClip(clip.id, { fadeIn: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Fade Out</span>
                  <span className="font-mono text-[#FFB347]">{clip.fadeOut || 0}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={clip.fadeOut || 0}
                  onChange={(e) => onUpdateClip(clip.id, { fadeOut: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Motion Blur Checkbox */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between hover:border-[#333] transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="checkbox-motion-blur"
                  checked={Boolean(clip.motionBlur)}
                  onChange={(e) => onUpdateClip(clip.id, { motionBlur: e.target.checked })}
                  className="w-4 h-4 rounded border-[#333] bg-[#0A0A0A] text-[#00E5FF] accent-[#00E5FF] cursor-pointer"
                />
                <label htmlFor="checkbox-motion-blur" className="cursor-pointer select-none">
                  <div className="text-xs font-semibold text-[#E0E0E0] flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Motion Blur</span>
                    {clip.motionBlur && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold border border-[#00E5FF]/40">
                        ON
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#888]">
                    Apply subtle cinematic motion blur during playback and motion
                  </div>
                </label>
              </div>

              <button
                type="button"
                id="btn-toggle-motion-blur"
                onClick={() => onUpdateClip(clip.id, { motionBlur: !clip.motionBlur })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  clip.motionBlur
                    ? "bg-[#00E5FF] text-[#050505] shadow-[0_0_10px_rgba(0,229,255,0.3)] font-bold"
                    : "bg-[#222] text-[#888] hover:text-white"
                }`}
              >
                {clip.motionBlur ? "ENABLED" : "OFF"}
              </button>
            </div>
          </div>
        )}

        {/* 2. Speed Control & Speed Ramp */}
        {activeSubTab === "speed" && (
          <div className="space-y-4">
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#E0E0E0]">Playback Speed</span>
                <span className="text-xs font-mono font-semibold text-[#FFB347] px-2 py-0.5 rounded bg-[#FFB347]/15 border border-[#FFB347]/30">
                  {clip.speed}x
                </span>
              </div>
              <input
                id="slider-clip-speed"
                type="range"
                min="0.2"
                max="4.0"
                step="0.1"
                value={clip.speed}
                onChange={(e) => onUpdateClip(clip.id, { speed: Number(e.target.value) })}
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
              <div className="flex gap-2">
                {[0.5, 1.0, 1.5, 2.0, 3.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateClip(clip.id, { speed: s })}
                    className={`flex-1 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                      clip.speed === s
                        ? "bg-[#FFB347] text-[#0A0A0A] font-bold"
                        : "bg-[#161618] border border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024]"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Ramp Presets */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
              <div className="text-xs font-medium text-[#E0E0E0] flex items-center justify-between">
                <span>Speed Ramp Curves</span>
                <span className="text-[10px] text-[#666]">Dynamic velocity shifts</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "none", name: "Linear Normal", desc: "1.0x constant" },
                  { id: "hero", name: "Hero Moment", desc: "1.5x → 0.3x → 1.5x" },
                  { id: "bullet_time", name: "Bullet Time", desc: "2.0x → 0.2x drop" },
                  { id: "flash", name: "Flash Montage", desc: "0.4x → 3.0x rush" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      onUpdateClip(clip.id, {
                        speedRampPreset: preset.id as any,
                        speed: preset.id === "hero" ? 0.4 : preset.id === "flash" ? 2.2 : 1.0,
                      })
                    }
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      clip.speedRampPreset === preset.id
                        ? "bg-[#FFB347]/15 border-[#FFB347] text-[#FFB347]"
                        : "bg-[#161618] border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024]"
                    }`}
                  >
                    <div className="text-xs font-semibold">{preset.name}</div>
                    <div className="text-[10px] text-[#888] mt-0.5">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Blur Checkbox in Speed & Velocity */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between hover:border-[#333] transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="checkbox-motion-blur-speed"
                  checked={Boolean(clip.motionBlur)}
                  onChange={(e) => onUpdateClip(clip.id, { motionBlur: e.target.checked })}
                  className="w-4 h-4 rounded border-[#333] bg-[#0A0A0A] text-[#00E5FF] accent-[#00E5FF] cursor-pointer"
                />
                <label htmlFor="checkbox-motion-blur-speed" className="cursor-pointer select-none">
                  <div className="text-xs font-semibold text-[#E0E0E0] flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Motion Blur on Speed Ramp</span>
                    {clip.motionBlur && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold border border-[#00E5FF]/40">
                        ON
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#888]">
                    Blurs rapid speed transitions for cinematic motion smoothing
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={() => onUpdateClip(clip.id, { motionBlur: !clip.motionBlur })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  clip.motionBlur
                    ? "bg-[#00E5FF] text-[#050505] shadow-[0_0_10px_rgba(0,229,255,0.3)] font-bold"
                    : "bg-[#222] text-[#888] hover:text-white"
                }`}
              >
                {clip.motionBlur ? "ENABLED" : "OFF"}
              </button>
            </div>
          </div>
        )}

        {/* 3. Transform, Scale, Position, Crop & PIP */}
        {activeSubTab === "transform" && (
          <div className="space-y-3">
            {/* Scale */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
              <div className="flex justify-between text-xs font-medium text-[#E0E0E0]">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#FFB347]" /> Scale / Zoom
                </span>
                <span className="font-mono text-[#FFB347]">{(clip.scale || 1.0).toFixed(2)}x</span>
              </div>
              <input
                id="slider-clip-scale"
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={clip.scale || 1.0}
                onChange={(e) => onUpdateClip(clip.id, { scale: Number(e.target.value) })}
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
            </div>

            {/* Position X / Y */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Pan X</span>
                  <span className="font-mono text-[#FFB347]">{clip.x || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  value={clip.x || 0}
                  onChange={(e) => onUpdateClip(clip.id, { x: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Pan Y</span>
                  <span className="font-mono text-[#FFB347]">{clip.y || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  value={clip.y || 0}
                  onChange={(e) => onUpdateClip(clip.id, { y: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Overlay / PIP Blend Mode */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
              <div className="flex justify-between text-xs font-medium text-[#E0E0E0]">
                <span>PIP Overlay Blend Mode</span>
                <span className="text-[10px] text-[#FFB347] font-semibold uppercase">{clip.blendMode || "normal"}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(["normal", "screen", "multiply", "overlay", "lighten"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => onUpdateClip(clip.id, { blendMode: b })}
                    className={`py-1.5 rounded-lg text-[10px] font-medium uppercase transition-all ${
                      clip.blendMode === b
                        ? "bg-[#FFB347]/20 text-[#FFB347] border border-[#FFB347]"
                        : "bg-[#161618] border border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Chroma Key */}
        {activeSubTab === "chroma" && (
          <div className="space-y-3">
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#E0E0E0]">Chroma Key (Green/Blue Screen)</div>
                <div className="text-[10px] text-[#888]">Remove background colors cleanly</div>
              </div>
              <button
                id="btn-toggle-chroma"
                onClick={() => onUpdateClip(clip.id, { chromaKeyEnabled: !clip.chromaKeyEnabled })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  clip.chromaKeyEnabled
                    ? "bg-[#47BD47] text-[#050505] shadow-[0_0_10px_rgba(71,189,71,0.4)]"
                    : "bg-[#222] text-[#888]"
                }`}
              >
                {clip.chromaKeyEnabled ? "ENABLED" : "OFF"}
              </button>
            </div>

            {clip.chromaKeyEnabled && (
              <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-3">
                {/* Color presets */}
                <div>
                  <div className="text-xs font-medium text-[#888] mb-1.5">Keying Color</div>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "Green", color: "#00ff00" },
                      { label: "Blue", color: "#0055ff" },
                      { label: "Cyan", color: "#00ffff" },
                      { label: "Magenta", color: "#ff00ff" },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => onUpdateClip(clip.id, { chromaColor: c.color })}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs border ${
                          clip.chromaColor === c.color ? "border-[#FFB347]" : "border-[#222]"
                        }`}
                        style={{ backgroundColor: c.color + "22" }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-[11px] font-medium text-[#E0E0E0]">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tolerance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#888]">
                    <span>Color Tolerance</span>
                    <span className="font-mono text-[#FFB347]">{clip.chromaTolerance || 40}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={clip.chromaTolerance || 40}
                    onChange={(e) =>
                      onUpdateClip(clip.id, { chromaTolerance: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Softness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#888]">
                    <span>Edge Softness</span>
                    <span className="font-mono text-[#FFB347]">{clip.chromaSoftness || 10}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={clip.chromaSoftness || 10}
                    onChange={(e) =>
                      onUpdateClip(clip.id, { chromaSoftness: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Masking & Blur */}
        {activeSubTab === "mask" && (
          <div className="space-y-3">
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
              <div className="text-xs font-medium text-[#E0E0E0]">Mask Shape</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(["none", "linear", "radial", "rectangle", "heart", "star"] as MaskShape[]).map(
                  (shape) => (
                    <button
                      key={shape}
                      onClick={() => onUpdateClip(clip.id, { maskShape: shape })}
                      className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                        clip.maskShape === shape
                          ? "bg-[#5E6AD2]/20 border-[#5E6AD2] text-[#8E9BFF]"
                          : "bg-[#161618] border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024]"
                      }`}
                    >
                      {shape}
                    </button>
                  )
                )}
              </div>
              {clip.maskShape !== "none" && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onUpdateClip(clip.id, { maskInvert: !clip.maskInvert })}
                    className="text-xs font-medium text-[#FFB347] hover:underline"
                  >
                    {clip.maskInvert ? "Inverted Mask" : "Invert Mask"}
                  </button>
                </div>
              )}
            </div>

            {/* Blur */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2">
              <div className="flex justify-between text-xs font-medium text-[#E0E0E0]">
                <span>Static Blur Filter Amount</span>
                <span className="font-mono text-[#FFB347]">{clip.blurAmount || 0}px</span>
              </div>
              <input
                id="slider-clip-blur"
                type="range"
                min="0"
                max="40"
                value={clip.blurAmount || 0}
                onChange={(e) => onUpdateClip(clip.id, { blurAmount: Number(e.target.value) })}
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
            </div>

            {/* Motion Blur Checkbox */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between hover:border-[#333] transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="checkbox-motion-blur-mask"
                  checked={Boolean(clip.motionBlur)}
                  onChange={(e) => onUpdateClip(clip.id, { motionBlur: e.target.checked })}
                  className="w-4 h-4 rounded border-[#333] bg-[#0A0A0A] text-[#00E5FF] accent-[#00E5FF] cursor-pointer"
                />
                <label htmlFor="checkbox-motion-blur-mask" className="cursor-pointer select-none">
                  <div className="text-xs font-semibold text-[#E0E0E0] flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Motion Blur</span>
                    {clip.motionBlur && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold border border-[#00E5FF]/40">
                        ON
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#888]">
                    Applies subtle dynamic blur during playback motion and velocity shifts
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={() => onUpdateClip(clip.id, { motionBlur: !clip.motionBlur })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  clip.motionBlur
                    ? "bg-[#00E5FF] text-[#050505] shadow-[0_0_10px_rgba(0,229,255,0.3)] font-bold"
                    : "bg-[#222] text-[#888] hover:text-white"
                }`}
              >
                {clip.motionBlur ? "ENABLED" : "OFF"}
              </button>
            </div>
          </div>
        )}

        {/* 6. Keyframes */}
        {activeSubTab === "keyframes" && (
          <div className="space-y-3">
            {/* Header with Add Keyframe */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FFB347]" />
                  <span>Keyframe Motion & Easing</span>
                </div>
                <div className="text-[10px] text-[#888]">
                  Playhead at clip: <strong className="text-[#FFB347] font-mono">{relClipTime.toFixed(2)}s</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenKeyframeEditor && (
                  <button
                    onClick={onOpenKeyframeEditor}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium active:scale-95 transition-all"
                    title="Open full timeline keyframe and curve editor"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#FFB347]" />
                    <span>Timeline Editor</span>
                  </button>
                )}
                <button
                  id="btn-add-keyframe"
                  onClick={() => {
                    const newTime = parseFloat(relClipTime.toFixed(2));
                    onAddKeyframe(clip.id, {
                      time: newTime,
                      x: clip.x || 0,
                      y: clip.y || 0,
                      scale: clip.scale || 1.0,
                      rotation: clip.rotation || 0,
                      opacity: clip.opacity ?? 1.0,
                      easing: "ease-in-out",
                    });
                    setSelectedKfIndex((clip.keyframes || []).length);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFB347]/15 border border-[#FFB347]/40 text-[#FFB347] text-xs font-medium active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Keyframe</span>
                </button>
              </div>
            </div>

            {/* Cinematic Animation Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                1-Click Motion Presets
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: "ken_burns", label: "Ken Burns Zoom", desc: "Slow cinematic push" },
                  { id: "cinematic_drift", label: "Cinematic Drift", desc: "Horizontal camera pan" },
                  { id: "bounce_pop", label: "Bounce Pop", desc: "Dynamic impact pop" },
                  { id: "whip_spin", label: "Whip Spin", desc: "Fast rotational settle" },
                  { id: "fade_glide", label: "Fade & Glide", desc: "Smooth reveal entry" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyKeyframePreset(preset.id)}
                    className="p-2 rounded-lg bg-[#161618] hover:bg-[#202028] border border-[#222] hover:border-[#FFB347]/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#FFB347] transition-colors">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-[#888] truncate">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Keyframe List with selection */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider flex items-center justify-between">
                <span>Clip Keyframe Timeline ({(clip.keyframes || []).length})</span>
                <span className="text-[10px] lowercase text-[#666]">tap keyframe to inspect</span>
              </div>

              {(clip.keyframes || []).length === 0 ? (
                <div className="text-center py-4 text-xs text-[#666] bg-[#161618] rounded-xl border border-[#222]">
                  No keyframes added yet. Move playhead and tap "Add Keyframe", or choose a preset above.
                </div>
              ) : (
                <div className="space-y-1 max-h-[140px] overflow-y-auto pr-0.5">
                  {clip.keyframes.map((kf, i) => {
                    const isSelected = i === selectedKfIndex;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedKfIndex(i)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#25201A] border-[#FFB347] shadow-sm"
                            : "bg-[#161618] border-[#222] hover:border-[#333]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rotate-45 ${
                              isSelected
                                ? "bg-[#FFB347] shadow-[0_0_6px_#FFB347]"
                                : "bg-[#888]"
                            }`}
                          />
                          <span className="font-mono text-[#E0E0E0] font-bold">{kf.time}s</span>
                          <span className="text-[10px] font-mono text-[#FFB347] uppercase px-1.5 py-0.2 rounded bg-black/40 border border-[#333]">
                            {kf.easing || "linear"}
                          </span>
                          <span className="text-[10px] text-[#888] hidden sm:inline">
                            Scale: {kf.scale.toFixed(1)}x, Rot: {kf.rotation}°, Op: {Math.round((kf.opacity ?? 1) * 100)}%
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveKeyframe(clip.id, kf.time);
                            if (selectedKfIndex >= (clip.keyframes?.length || 1) - 1) {
                              setSelectedKfIndex(Math.max(0, (clip.keyframes?.length || 1) - 2));
                            }
                          }}
                          className="text-[#FF4444] hover:text-red-300 p-1"
                          title="Delete Keyframe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Keyframe Inspector & Easing Curves */}
            {clip.keyframes && clip.keyframes.length > 0 && (
              <div className="bg-[#141418] rounded-xl p-3 border border-[#26262E] space-y-3">
                {(() => {
                  const activeKf = clip.keyframes[Math.min(selectedKfIndex, clip.keyframes.length - 1)];
                  if (!activeKf) return null;

                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rotate-45 bg-[#FFB347] shadow-[0_0_6px_#FFB347]" />
                          <span className="text-xs font-bold text-white">
                            Editing Keyframe #{selectedKfIndex + 1} at {activeKf.time}s
                          </span>
                        </div>
                        <span className="text-[10px] text-[#888]">
                          {(selectedKfIndex + 1)} of {clip.keyframes.length}
                        </span>
                      </div>

                      {/* Easing Curve Selector */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-[#888]">
                          <span className="font-semibold text-[#D0D0D8]">Interpolation Easing:</span>
                          <span className="font-mono text-[#FFB347] uppercase text-[11px] font-bold">
                            {activeKf.easing || "linear"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                          {(
                            [
                              { id: "linear", label: "Linear", path: "M 4 28 L 36 4" },
                              { id: "ease-in", label: "Ease In", path: "M 4 28 Q 24 28, 36 4" },
                              { id: "ease-out", label: "Ease Out", path: "M 4 28 Q 16 4, 36 4" },
                              { id: "ease-in-out", label: "Ease In-Out", path: "M 4 28 C 16 28, 24 4, 36 4" },
                              { id: "bounce", label: "Bounce", path: "M 4 28 Q 14 0, 20 28 Q 26 12, 30 28 L 36 28" },
                              { id: "elastic", label: "Elastic", path: "M 4 28 C 12 4, 18 34, 26 0 C 30 10, 33 2, 36 4" },
                            ] as const
                          ).map((ease) => (
                            <button
                              key={ease.id}
                              onClick={() => handleUpdateSelectedKeyframe({ easing: ease.id })}
                              className={`p-1.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                                (activeKf.easing || "linear") === ease.id
                                  ? "bg-[#FFB347]/20 border-[#FFB347] text-[#FFB347] shadow-sm"
                                  : "bg-[#101014] border-[#222] text-[#888] hover:text-white hover:bg-[#181820]"
                              }`}
                            >
                              <svg width="40" height="32" viewBox="0 0 40 32" className="overflow-visible">
                                <path
                                  d={ease.path}
                                  fill="none"
                                  stroke={
                                    (activeKf.easing || "linear") === ease.id
                                      ? "#FFB347"
                                      : "#666"
                                  }
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="text-[10px] font-semibold">{ease.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Property Sliders (Scale, Rotation, X, Y, Opacity) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Scale */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-[#888]">
                            <span>Scale</span>
                            <span className="font-mono text-[#FFB347]">
                              {activeKf.scale.toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="3.0"
                            step="0.05"
                            value={activeKf.scale}
                            onChange={(e) =>
                              handleUpdateSelectedKeyframe({ scale: parseFloat(e.target.value) })
                            }
                            className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer accent-[#FFB347]"
                          />
                        </div>

                        {/* Rotation */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-[#888]">
                            <span>Rotation</span>
                            <span className="font-mono text-[#FFB347]">{activeKf.rotation}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            value={activeKf.rotation}
                            onChange={(e) =>
                              handleUpdateSelectedKeyframe({ rotation: parseInt(e.target.value) })
                            }
                            className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer accent-[#FFB347]"
                          />
                        </div>

                        {/* Position X */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-[#888]">
                            <span>Position X (Offset)</span>
                            <span className="font-mono text-[#FFB347]">{activeKf.x || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-150"
                            max="150"
                            step="2"
                            value={activeKf.x || 0}
                            onChange={(e) =>
                              handleUpdateSelectedKeyframe({ x: parseInt(e.target.value) })
                            }
                            className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer accent-[#FFB347]"
                          />
                        </div>

                        {/* Position Y */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-[#888]">
                            <span>Position Y (Offset)</span>
                            <span className="font-mono text-[#FFB347]">{activeKf.y || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-150"
                            max="150"
                            step="2"
                            value={activeKf.y || 0}
                            onChange={(e) =>
                              handleUpdateSelectedKeyframe({ y: parseInt(e.target.value) })
                            }
                            className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer accent-[#FFB347]"
                          />
                        </div>

                        {/* Opacity */}
                        <div className="space-y-1 sm:col-span-2">
                          <div className="flex justify-between text-xs text-[#888]">
                            <span>Layer Opacity</span>
                            <span className="font-mono text-[#FFB347]">
                              {Math.round((activeKf.opacity ?? 1.0) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1.0"
                            step="0.05"
                            value={activeKf.opacity ?? 1.0}
                            onChange={(e) =>
                              handleUpdateSelectedKeyframe({ opacity: parseFloat(e.target.value) })
                            }
                            className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer accent-[#FFB347]"
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* 7. Tracking & Stabilization */}
        {activeSubTab === "tracking" && (
          <div className="space-y-3">
            {/* Video Stabilization */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#47BD47]" />
                <div>
                  <div className="text-xs font-semibold text-[#E0E0E0]">Gyro Video Stabilization</div>
                  <div className="text-[10px] text-[#888]">Smooth out shaky camera motion</div>
                </div>
              </div>
              <button
                onClick={() => onUpdateClip(clip.id, { stabilized: !clip.stabilized })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  clip.stabilized
                    ? "bg-[#47BD47] text-[#050505] shadow-[0_0_10px_rgba(71,189,71,0.4)]"
                    : "bg-[#222] text-[#888]"
                }`}
              >
                {clip.stabilized ? "ACTIVE" : "OFF"}
              </button>
            </div>

            {/* Motion Tracking */}
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-[#FFB347]" />
                <div>
                  <div className="text-xs font-semibold text-[#E0E0E0]">AI Motion Tracking Target</div>
                  <div className="text-[10px] text-[#888]">Pin text and stickers to moving subjects</div>
                </div>
              </div>
              <button
                onClick={() => onUpdateClip(clip.id, { motionTracking: !clip.motionTracking })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  clip.motionTracking
                    ? "bg-[#FFB347] text-[#050505] shadow-[0_0_10px_rgba(255,179,71,0.4)]"
                    : "bg-[#222] text-[#888]"
                }`}
              >
                {clip.motionTracking ? "PINNED" : "OFF"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
