import React, { useState } from "react";
import { EffectItem, EffectType, TransitionItem, TransitionType, VideoProject } from "../../types";
import { EFFECT_PRESETS, TRANSITION_PRESETS } from "../../data/sampleMedia";
import { Sparkles, Sliders, Play, Trash2, ArrowRightLeft, Plus } from "lucide-react";

interface EffectsPanelProps {
  project: VideoProject;
  currentTime: number;
  onAddEffect: (effect: EffectItem) => void;
  onRemoveEffect: (effectId: string) => void;
  onSetTransition: (transition: TransitionItem) => void;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  project,
  currentTime,
  onAddEffect,
  onRemoveEffect,
  onSetTransition,
}) => {
  const [activeTab, setActiveTab] = useState<"effects" | "transitions">("effects");
  const [selectedEffectIntensity, setSelectedEffectIntensity] = useState<number>(65);

  const handleAddEffectPreset = (p: (typeof EFFECT_PRESETS)[0]) => {
    const newEffect: EffectItem = {
      id: `fx-${Date.now()}`,
      name: p.name,
      type: p.type,
      startTime: parseFloat(currentTime.toFixed(1)),
      duration: 3.0,
      intensity: selectedEffectIntensity,
    };
    onAddEffect(newEffect);
  };

  const handleApplyTransition = (trans: (typeof TRANSITION_PRESETS)[0]) => {
    const newTrans: TransitionItem = {
      id: `trans-${Date.now()}`,
      clipIndex: 0,
      type: trans.type,
      duration: 0.6,
    };
    onSetTransition(newTrans);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E0E0E0] select-none overflow-y-auto p-3 space-y-3">
      {/* Sub Tab selector */}
      <div className="flex items-center gap-2 pb-2 border-b border-[#1A1A1A] shrink-0">
        <button
          onClick={() => setActiveTab("effects")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "effects"
              ? "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 shadow-sm"
              : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618]"
          }`}
        >
          Visual Effects Overlay
        </button>
        <button
          onClick={() => setActiveTab("transitions")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "transitions"
              ? "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 shadow-sm"
              : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618]"
          }`}
        >
          Cinematic Transitions
        </button>
      </div>

      {/* 1. Effects Grid */}
      {activeTab === "effects" && (
        <div className="space-y-3">
          {/* Intensity Slider */}
          <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#E0E0E0]">Effect Intensity</span>
              <span className="font-mono text-[#FFB347] font-semibold">{selectedEffectIntensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={selectedEffectIntensity}
              onChange={(e) => setSelectedEffectIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EFFECT_PRESETS.map((fx) => (
              <button
                key={fx.id}
                onClick={() => handleAddEffectPreset(fx)}
                className="p-3 rounded-xl bg-[#161618] border border-[#222] hover:border-[#333] text-left transition-all active:scale-95 group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#E0E0E0] group-hover:text-[#FFB347]">
                    {fx.name}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-[#666] group-hover:text-[#FFB347]" />
                </div>
                <div className="text-[10px] text-[#888]">{fx.description}</div>
              </button>
            ))}
          </div>

          {/* Active Effects List */}
          {project.effects.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-semibold text-[#E0E0E0]">
                Active Effects in Project ({project.effects.length})
              </div>
              {project.effects.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#161618] border border-[#222] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB347]" />
                    <span className="font-semibold text-[#E0E0E0]">{item.name}</span>
                    <span className="text-[10px] text-[#888]">
                      Starts: {item.startTime}s • Duration: {item.duration}s
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveEffect(item.id)}
                    className="text-[#888] hover:text-[#FF4444] p-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Transitions */}
      {activeTab === "transitions" && (
        <div className="space-y-3">
          <div className="text-xs font-medium text-[#E0E0E0]">
            Cut Transitions Between Timeline Clips
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TRANSITION_PRESETS.map((t) => {
              const isActive = project.transitions.some((pt) => pt.type === t.type);
              return (
                <button
                  key={t.id}
                  onClick={() => handleApplyTransition(t)}
                  className={`p-3 rounded-xl border text-left transition-all active:scale-95 ${
                    isActive
                      ? "bg-[#FFB347]/15 border-[#FFB347] text-[#FFB347] shadow-sm"
                      : "bg-[#161618] border-[#222] hover:border-[#333] text-[#E0E0E0]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{t.name}</span>
                    <ArrowRightLeft className="w-3 h-3 text-[#FFB347]" />
                  </div>
                  <div className="text-[9px] text-[#888]">{t.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
