import React, { useState } from "react";
import { Keyframe, KeyframeEasing, TextAnimation, TextItem, VideoProject } from "../../types";
import { TEXT_TITLE_PRESETS } from "../../data/sampleMedia";
import { 
  Type, 
  Sparkles, 
  Trash2, 
  Plus, 
  Palette, 
  Move,
  Check,
  Activity
} from "lucide-react";

interface TextPanelProps {
  project: VideoProject;
  currentTime: number;
  onAddTextItem: (item: TextItem) => void;
  onUpdateTextItem: (id: string, updates: Partial<TextItem>) => void;
  onDeleteTextItem: (id: string) => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({
  project,
  currentTime,
  onAddTextItem,
  onUpdateTextItem,
  onDeleteTextItem,
}) => {
  const [selectedTextId, setSelectedTextId] = useState<string | null>(
    project.textTracks[0]?.id || null
  );
  const [selectedTextKfIndex, setSelectedTextKfIndex] = useState<number>(0);

  const activeText = project.textTracks.find((t) => t.id === selectedTextId);

  const fonts = [
    { name: "Montserrat", family: "'Montserrat', sans-serif" },
    { name: "Cinzel (Cinematic)", family: "'Cinzel', serif" },
    { name: "JetBrains Mono", family: "'JetBrains Mono', monospace" },
    { name: "Impact Block", family: "Impact, sans-serif" },
    { name: "Georgia Classic", family: "Georgia, serif" },
  ];

  const handleApplyPreset = (preset: (typeof TEXT_TITLE_PRESETS)[0]) => {
    const newItem: TextItem = {
      id: `text-${Date.now()}`,
      text: preset.name.toUpperCase(),
      startTime: parseFloat(currentTime.toFixed(1)),
      duration: 3.5,
      x: 50,
      y: preset.category === "lower_third" ? 82 : 48,
      fontSize: preset.category === "lower_third" ? 22 : 36,
      fontFamily: preset.fontFamily,
      color: preset.color,
      outlineColor: preset.outlineColor,
      outlineWidth: preset.outlineWidth,
      shadowColor: preset.shadowColor,
      shadowBlur: preset.shadowBlur,
      shadowOffsetX: preset.shadowOffsetX || 0,
      shadowOffsetY: preset.shadowOffsetY || 0,
      animation: preset.animation,
      keyframes: [],
    };
    onAddTextItem(newItem);
    setSelectedTextId(newItem.id);
  };

  const handleAddDefaultText = () => {
    const newItem: TextItem = {
      id: `text-${Date.now()}`,
      text: "CINEMATIC TITLE",
      startTime: parseFloat(currentTime.toFixed(1)),
      duration: 3.0,
      x: 50,
      y: 50,
      fontSize: 34,
      fontFamily: "'Cinzel', serif",
      color: "#ffffff",
      outlineColor: "transparent",
      outlineWidth: 0,
      shadowColor: "#000000",
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      animation: "pop_up",
      keyframes: [],
    };
    onAddTextItem(newItem);
    setSelectedTextId(newItem.id);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E0E0E0] select-none overflow-y-auto p-3 space-y-3">
      {/* Title Presets Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#E0E0E0]">Cinematic Title Presets</span>
          <button
            onClick={handleAddDefaultText}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 hover:bg-[#FFB347]/25 transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Add Custom Text</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEXT_TITLE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="p-2.5 rounded-xl bg-[#161618] border border-[#222] hover:border-[#333] text-left transition-all active:scale-95 group"
            >
              <div
                className="text-xs font-bold truncate group-hover:text-[#FFB347]"
                style={{ color: p.color }}
              >
                {p.name}
              </div>
              <div className="text-[9px] text-[#888] capitalize mt-0.5">
                {p.category.replace("_", " ")} • {p.animation}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Text Track List & Editor */}
      {activeText ? (
        <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E0E0E0]">Edit Active Text Layer</span>
            <button
              onClick={() => onDeleteTextItem(activeText.id)}
              className="text-xs text-[#FF4444] hover:text-red-300 flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>

          {/* Text input */}
          <input
            id="input-text-content"
            type="text"
            value={activeText.text}
            onChange={(e) => onUpdateTextItem(activeText.id, { text: e.target.value })}
            className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg px-2.5 py-1.5 text-xs text-[#E0E0E0] font-semibold focus:outline-none focus:border-[#FFB347]"
          />

          {/* Font & Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] text-[#888] mb-1">Font Family</div>
              <select
                value={activeText.fontFamily}
                onChange={(e) => onUpdateTextItem(activeText.id, { fontFamily: e.target.value })}
                className="w-full bg-[#0A0A0A] text-xs text-[#E0E0E0] px-2 py-1.5 rounded-lg border border-[#222] focus:outline-none focus:border-[#FFB347]"
              >
                {fonts.map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#888] mb-1">
                <span>Font Size</span>
                <span className="font-mono text-[#FFB347] font-semibold">{activeText.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="80"
                value={activeText.fontSize}
                onChange={(e) =>
                  onUpdateTextItem(activeText.id, { fontSize: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Position & Animation */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] text-[#888] mb-1">Animation Style</div>
              <select
                value={activeText.animation}
                onChange={(e) =>
                  onUpdateTextItem(activeText.id, { animation: e.target.value as any })
                }
                className="w-full bg-[#0A0A0A] text-xs text-[#E0E0E0] px-2 py-1.5 rounded-lg border border-[#222] focus:outline-none focus:border-[#FFB347]"
              >
                <option value="none">None</option>
                <option value="pop_up">Pop Up</option>
                <option value="slide">Slide In</option>
                <option value="typewriter">Typewriter</option>
                <option value="glow_pulse">Glow Pulse</option>
                <option value="fade">Fade In/Out</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#888] mb-1">
                <span>Vertical Position Y</span>
                <span className="font-mono text-[#FFB347] font-semibold">{activeText.y}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={activeText.y}
                onChange={(e) => onUpdateTextItem(activeText.id, { y: Number(e.target.value) })}
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Color & Stroke */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#888]">Color:</span>
              <input
                type="color"
                value={activeText.color || "#ffffff"}
                onChange={(e) => onUpdateTextItem(activeText.id, { color: e.target.value })}
                className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#888]">Outline:</span>
              <input
                type="color"
                value={activeText.outlineColor || "#000000"}
                onChange={(e) => onUpdateTextItem(activeText.id, { outlineColor: e.target.value })}
                className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#888]">Glow:</span>
              <input
                type="color"
                value={activeText.shadowColor || "#FFB347"}
                onChange={(e) => onUpdateTextItem(activeText.id, { shadowColor: e.target.value })}
                className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Text Keyframe Animation Section */}
          <div className="pt-2 border-t border-[#222] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E0E0E0]">
                <Activity className="w-3.5 h-3.5 text-[#FFB347]" />
                <span>Text Keyframe Animation</span>
              </div>
              <button
                onClick={() => {
                  const relTime = Math.max(0, parseFloat((currentTime - activeText.startTime).toFixed(2)));
                  const newKf: Keyframe = {
                    time: relTime,
                    x: activeText.x || 0,
                    y: activeText.y || 50,
                    scale: activeText.scale || 1.0,
                    rotation: activeText.rotation || 0,
                    opacity: activeText.opacity ?? 1.0,
                    easing: "ease-in-out",
                  };
                  const currentKfs = activeText.keyframes || [];
                  const updated = [...currentKfs.filter((k) => Math.abs(k.time - relTime) > 0.05), newKf].sort(
                    (a, b) => a.time - b.time
                  );
                  onUpdateTextItem(activeText.id, { keyframes: updated });
                  setSelectedTextKfIndex(updated.findIndex((k) => k.time === relTime));
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFB347]/15 border border-[#FFB347]/40 text-[#FFB347] text-[11px] font-medium hover:bg-[#FFB347]/25 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Add Keyframe</span>
              </button>
            </div>

            {/* List of text keyframes */}
            <div className="space-y-1">
              {(activeText.keyframes || []).length === 0 ? (
                <div className="text-[11px] text-[#666] py-1">
                  No text keyframes. Add a keyframe to smoothly animate position, scale, rotation, and opacity with custom easing.
                </div>
              ) : (
                <div className="space-y-1 max-h-[110px] overflow-y-auto pr-0.5">
                  {activeText.keyframes.map((kf, i) => {
                    const isSelected = i === selectedTextKfIndex;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedTextKfIndex(i)}
                        className={`flex items-center justify-between p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#25201A] border-[#FFB347]"
                            : "bg-[#141418] border-[#222]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rotate-45 ${
                              isSelected ? "bg-[#FFB347]" : "bg-[#666]"
                            }`}
                          />
                          <span className="font-mono text-[#E0E0E0] font-semibold">{kf.time}s</span>
                          <span className="text-[10px] font-mono text-[#FFB347] uppercase px-1 rounded bg-black/40">
                            {kf.easing || "linear"}
                          </span>
                          <span className="text-[10px] text-[#888]">
                            Scale: {kf.scale.toFixed(1)}x, Rot: {kf.rotation}°
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const filtered = (activeText.keyframes || []).filter((_, idx) => idx !== i);
                            onUpdateTextItem(activeText.id, { keyframes: filtered });
                          }}
                          className="text-[#FF4444] hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active text keyframe editor */}
            {activeText.keyframes && activeText.keyframes.length > 0 && (
              <div className="bg-[#101014] p-2.5 rounded-xl border border-[#202028] space-y-2">
                {(() => {
                  const kf = activeText.keyframes[Math.min(selectedTextKfIndex, activeText.keyframes.length - 1)];
                  if (!kf) return null;

                  const updateKf = (updates: Partial<Keyframe>) => {
                    const copy = [...activeText.keyframes];
                    const idx = Math.min(selectedTextKfIndex, copy.length - 1);
                    copy[idx] = { ...copy[idx], ...updates };
                    onUpdateTextItem(activeText.id, { keyframes: copy });
                  };

                  return (
                    <>
                      <div className="flex items-center justify-between text-[11px] text-[#888]">
                        <span>Easing Function:</span>
                        <div className="flex items-center gap-1">
                          {(["linear", "ease-in", "ease-out", "ease-in-out", "bounce", "elastic"] as KeyframeEasing[]).map(
                            (eType) => (
                              <button
                                key={eType}
                                onClick={() => updateKf({ easing: eType })}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono capitalize transition-all ${
                                  (kf.easing || "linear") === eType
                                    ? "bg-[#FFB347] text-black font-bold"
                                    : "bg-[#181820] text-[#888] hover:text-white"
                                }`}
                              >
                                {eType}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[10px] text-[#888]">
                            <span>Scale</span>
                            <span className="font-mono text-[#FFB347]">{kf.scale.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.3"
                            max="2.5"
                            step="0.05"
                            value={kf.scale}
                            onChange={(e) => updateKf({ scale: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-[#1A1A1A] rounded cursor-pointer accent-[#FFB347]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] text-[#888]">
                            <span>Rotation</span>
                            <span className="font-mono text-[#FFB347]">{kf.rotation}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            value={kf.rotation}
                            onChange={(e) => updateKf({ rotation: parseInt(e.target.value) })}
                            className="w-full h-1 bg-[#1A1A1A] rounded cursor-pointer accent-[#FFB347]"
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-[#666]">
          No text selected. Tap a title preset above to insert into preview.
        </div>
      )}
    </div>
  );
};
