import React from "react";
import { ColorGrading, VideoProject } from "../../types";
import { 
  Sun, 
  Contrast, 
  Droplet, 
  Thermometer, 
  Sparkles, 
  Eye, 
  RotateCcw, 
  Disc, 
  Feather, 
  Flame, 
  Focus,
  Wand2,
  SlidersHorizontal,
  Plus,
  Minus
} from "lucide-react";

interface AdjustPanelProps {
  project: VideoProject;
  onUpdateGrading: (grading: Partial<ColorGrading>) => void;
  onResetGrading: () => void;
  isBeforeAfterActive: boolean;
  onToggleBeforeAfter: () => void;
}

interface AdjustItemConfig {
  id: keyof ColorGrading;
  label: string;
  hindiLabel: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  unit: string;
  displayMultiplier: number; // for displaying integer numbers like -100 to +100
  formatVal: (val: number) => number;
}

export const AdjustPanel: React.FC<AdjustPanelProps> = ({
  project,
  onUpdateGrading,
  onResetGrading,
  isBeforeAfterActive,
  onToggleBeforeAfter,
}) => {
  const grading = project.colorGrading;

  const adjustItems: AdjustItemConfig[] = [
    {
      id: "brightness",
      label: "Brightness",
      hindiLabel: "ब्राइटनेस",
      icon: <Sun className="w-4 h-4 text-[#FFB347]" />,
      min: -1.0,
      max: 1.0,
      step: 0.01,
      defaultVal: 0,
      unit: "",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
    {
      id: "contrast",
      label: "Contrast",
      hindiLabel: "कंट्रास्ट",
      icon: <Contrast className="w-4 h-4 text-[#38bdf8]" />,
      min: 0.5,
      max: 2.0,
      step: 0.02,
      defaultVal: 1.0,
      unit: "%",
      displayMultiplier: 100,
      formatVal: (v) => Math.round((v - 1.0) * 100),
    },
    {
      id: "saturation",
      label: "Saturation",
      hindiLabel: "सैचुरेशन",
      icon: <Droplet className="w-4 h-4 text-[#ec4899]" />,
      min: 0.0,
      max: 2.0,
      step: 0.02,
      defaultVal: 1.0,
      unit: "%",
      displayMultiplier: 100,
      formatVal: (v) => Math.round((v - 1.0) * 100),
    },
    {
      id: "exposure",
      label: "Exposure",
      hindiLabel: "एक्सपोजर",
      icon: <Sparkles className="w-4 h-4 text-[#facc15]" />,
      min: -1.0,
      max: 1.0,
      step: 0.01,
      defaultVal: 0,
      unit: "EV",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
    {
      id: "highlights",
      label: "Highlights",
      hindiLabel: "हाइलाइट्स",
      icon: <Sun className="w-4 h-4 text-[#fb923c]" />,
      min: -1.0,
      max: 1.0,
      step: 0.01,
      defaultVal: 0,
      unit: "",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
    {
      id: "shadows",
      label: "Shadows",
      hindiLabel: "शैडोज़",
      icon: <Flame className="w-4 h-4 text-[#94a3b8]" />,
      min: -1.0,
      max: 1.0,
      step: 0.01,
      defaultVal: 0,
      unit: "",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
    {
      id: "temperature",
      label: "Warmth (Temp)",
      hindiLabel: "तापमान / वार्मथ",
      icon: <Thermometer className="w-4 h-4 text-[#f97316]" />,
      min: -50,
      max: 50,
      step: 1,
      defaultVal: 0,
      unit: "K",
      displayMultiplier: 1,
      formatVal: (v) => Math.round(v),
    },
    {
      id: "tint",
      label: "Tint (Green/Pink)",
      hindiLabel: "टिंट (हरा/गुलाबी)",
      icon: <Droplet className="w-4 h-4 text-[#a855f7]" />,
      min: -50,
      max: 50,
      step: 1,
      defaultVal: 0,
      unit: "",
      displayMultiplier: 1,
      formatVal: (v) => Math.round(v),
    },
    {
      id: "vignette",
      label: "Vignette",
      hindiLabel: "विगनेट (किनारों का अंधेरा)",
      icon: <Disc className="w-4 h-4 text-[#64748b]" />,
      min: 0,
      max: 1.0,
      step: 0.02,
      defaultVal: 0,
      unit: "%",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
    {
      id: "sharpen",
      label: "Sharpness",
      hindiLabel: "शार्पनेस / क्लेरिटी",
      icon: <Focus className="w-4 h-4 text-[#2dd4bf]" />,
      min: 0,
      max: 1.0,
      step: 0.02,
      defaultVal: 0,
      unit: "%",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
    {
      id: "fade",
      label: "Film Fade (Matte)",
      hindiLabel: "फिल्म फेड / मैट",
      icon: <Feather className="w-4 h-4 text-[#e2e8f0]" />,
      min: 0,
      max: 1.0,
      step: 0.02,
      defaultVal: 0,
      unit: "%",
      displayMultiplier: 100,
      formatVal: (v) => Math.round(v * 100),
    },
  ];

  // Helper to handle direct numeric input change
  const handleNumberInputChange = (item: AdjustItemConfig, inputNumber: number) => {
    if (isNaN(inputNumber)) return;
    
    let internalVal: number;
    if (item.id === "contrast" || item.id === "saturation") {
      // Input is percentage delta from 0 (-50% to +100%) -> internal 0.5 to 2.0
      internalVal = 1.0 + inputNumber / 100;
    } else if (item.displayMultiplier === 100) {
      internalVal = inputNumber / 100;
    } else {
      internalVal = inputNumber;
    }

    const clamped = Math.max(item.min, Math.min(item.max, internalVal));
    onUpdateGrading({ [item.id]: clamped });
  };

  // Step button increment/decrement
  const handleStep = (item: AdjustItemConfig, direction: number) => {
    const currentVal = (grading[item.id] as number) ?? item.defaultVal;
    const currentNumber = item.formatVal(currentVal);
    const stepSize = item.displayMultiplier === 1 ? 5 : 5;
    const newNumber = currentNumber + direction * stepSize;
    handleNumberInputChange(item, newNumber);
  };

  // Fast quick presets
  const quickPresets = [
    {
      name: "Auto Fix",
      desc: "Balanced light & pop",
      apply: () =>
        onUpdateGrading({
          exposure: 0.08,
          contrast: 1.12,
          saturation: 1.15,
          highlights: -0.05,
          shadows: 0.08,
        }),
    },
    {
      name: "Golden Warmth",
      desc: "Sunset tone & glow",
      apply: () =>
        onUpdateGrading({
          temperature: 18,
          tint: 2,
          saturation: 1.18,
          contrast: 1.08,
        }),
    },
    {
      name: "Crisp Clean",
      desc: "Punchy contrast & detail",
      apply: () =>
        onUpdateGrading({
          contrast: 1.25,
          sharpen: 0.25,
          highlights: 0.05,
          shadows: -0.05,
          temperature: -4,
        }),
    },
    {
      name: "Matte Film",
      desc: "Lifted vintage black",
      apply: () =>
        onUpdateGrading({
          fade: 0.22,
          contrast: 0.95,
          vignette: 0.15,
          temperature: 6,
        }),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C] text-[#E0E0E0] select-none overflow-y-auto p-3.5 space-y-4 pb-20">
      {/* Top Header with Raw/Adjusted Compare and Reset All */}
      <div className="flex items-center justify-between bg-[#141419] p-3 rounded-2xl border border-[#22222A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/15 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Manual Adjustments</h3>
            <p className="text-[10px] text-[#8E8E9F]">Set exact numerical values or drag sliders</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Before / After toggle */}
          <button
            id="btn-adjust-compare"
            onClick={onToggleBeforeAfter}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isBeforeAfterActive
                ? "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]"
                : "bg-[#1C1C24] text-[#8E8E9F] border-[#2A2A36] hover:text-white"
            }`}
            title="Toggle raw vs adjusted"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isBeforeAfterActive ? "Raw View" : "Adjusted"}</span>
          </button>

          {/* Reset All */}
          <button
            id="btn-adjust-reset-all"
            onClick={onResetGrading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#8E8E9F] hover:text-[#FF5252] bg-[#1C1C24] hover:bg-[#FF5252]/10 border border-[#2A2A36] transition-all"
            title="Reset all adjustments to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Tap Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8E8E9F]">
          <Wand2 className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Quick Adjust Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickPresets.map((qp) => (
            <button
              key={qp.name}
              onClick={qp.apply}
              className="flex flex-col items-start p-2 rounded-xl bg-[#141419] hover:bg-[#1C1C24] border border-[#22222A] hover:border-[#38bdf8]/40 transition-all text-left active:scale-[0.98]"
            >
              <span className="text-xs font-medium text-white">{qp.name}</span>
              <span className="text-[9px] text-[#7A7A8E]">{qp.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Numerical Adjust Controls List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#8E8E9F] px-1">
          <span>Parameters (संख्या द्वारा सेट करें)</span>
          <span className="text-[10px] text-[#38bdf8]">Exact Numeric Input Enabled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {adjustItems.map((item) => {
            const currentVal = (grading[item.id] as number) ?? item.defaultVal;
            const displayNumber = item.formatVal(currentVal);
            const isNonDefault = Math.abs(currentVal - item.defaultVal) > 0.001;

            return (
              <div
                key={item.id}
                className={`bg-[#141419] rounded-xl p-3 border transition-all space-y-2 ${
                  isNonDefault
                    ? "border-[#38bdf8]/40 shadow-sm bg-[#161622]"
                    : "border-[#22222A] hover:border-[#2E2E3C]"
                }`}
              >
                {/* Header: Icon, Label & Numeric Input Box */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#1C1C24] text-white/80">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {isNonDefault && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                        )}
                      </div>
                      <span className="text-[9px] text-[#7A7A8E]">{item.hindiLabel}</span>
                    </div>
                  </div>

                  {/* Number Input + Steppers + Reset */}
                  <div className="flex items-center gap-1">
                    {/* Stepper Minus */}
                    <button
                      type="button"
                      onClick={() => handleStep(item, -1)}
                      className="w-6 h-6 rounded-lg bg-[#1C1C26] hover:bg-[#282836] text-[#8E8E9F] hover:text-white flex items-center justify-center transition-colors active:scale-90"
                      title="Decrease by 5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    {/* Direct Number Input Field */}
                    <div className="relative flex items-center">
                      <input
                        id={`input-number-${item.id}`}
                        type="number"
                        min={item.formatVal(item.min)}
                        max={item.formatVal(item.max)}
                        step="1"
                        value={displayNumber}
                        onChange={(e) => handleNumberInputChange(item, parseFloat(e.target.value))}
                        className="w-14 h-6 text-center font-mono text-xs font-bold text-[#38bdf8] bg-[#0A0A0E] border border-[#2E2E3E] rounded-lg focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
                        title="Type exact number"
                      />
                      {item.unit && (
                        <span className="text-[9px] text-[#6A6A7E] ml-1 font-mono">{item.unit}</span>
                      )}
                    </div>

                    {/* Stepper Plus */}
                    <button
                      type="button"
                      onClick={() => handleStep(item, 1)}
                      className="w-6 h-6 rounded-lg bg-[#1C1C26] hover:bg-[#282836] text-[#8E8E9F] hover:text-white flex items-center justify-center transition-colors active:scale-90"
                      title="Increase by 5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    {/* Reset single control to default */}
                    {isNonDefault && (
                      <button
                        type="button"
                        onClick={() => onUpdateGrading({ [item.id]: item.defaultVal })}
                        className="w-6 h-6 rounded-lg text-[#7A7A8E] hover:text-[#FF5252] hover:bg-[#FF5252]/10 flex items-center justify-center transition-colors ml-0.5"
                        title="Reset to default 0"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Range Slider for fluid visual adjustment */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[9px] font-mono text-[#5A5A6E] w-6 text-right">
                    {item.formatVal(item.min)}
                  </span>
                  <input
                    id={`slider-adjust-${item.id}`}
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={currentVal}
                    onChange={(e) =>
                      onUpdateGrading({ [item.id]: parseFloat(e.target.value) })
                    }
                    className="flex-1 h-1.5 bg-[#1C1C26] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
                  />
                  <span className="text-[9px] font-mono text-[#5A5A6E] w-6">
                    {item.formatVal(item.max)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
