import React, { useState, useEffect } from "react";
import { Clip, SmartCutAnalysis, SmartCutSegment, VideoProject } from "../../types";
import { 
  Scissors, 
  Sparkles, 
  X, 
  Check, 
  VolumeX, 
  PauseCircle, 
  EyeOff, 
  Repeat, 
  SlidersHorizontal, 
  ArrowRight, 
  RotateCcw,
  Clock,
  Zap,
  CheckSquare,
  Square,
  Play
} from "lucide-react";

interface SmartCutModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  onApplyCuts: (cutsToApply: SmartCutSegment[]) => void;
  onSeekToTime?: (time: number) => void;
}

export const SmartCutModal: React.FC<SmartCutModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyCuts,
  onSeekToTime,
}) => {
  const [sensitivity, setSensitivity] = useState<"conservative" | "balanced" | "aggressive">("balanced");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<SmartCutAnalysis | null>(null);
  const [segments, setSegments] = useState<SmartCutSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  // Fetch or re-run analysis
  const runSmartCutAnalysis = async (currentSensitivity = sensitivity) => {
    if (!project.clips || project.clips.length === 0) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/smart-cut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clips: project.clips,
          sensitivity: currentSensitivity,
        }),
      });

      if (response.ok) {
        const data: SmartCutAnalysis = await response.json();
        setAnalysis(data);
        setSegments(data.segments);
        if (data.segments.length > 0) {
          setSelectedSegmentId(data.segments[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to run Smart Cut analysis:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runSmartCutAnalysis(sensitivity);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle selection of a cut
  const toggleSegment = (id: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  // Select all or none
  const toggleSelectAll = (select: boolean) => {
    setSegments((prev) => prev.map((s) => ({ ...s, selected: select })));
  };

  // Adjust cut boundaries
  const adjustSegmentBoundary = (id: string, deltaStart: number, deltaEnd: number) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStart = Math.max(0, parseFloat((s.startTime + deltaStart).toFixed(2)));
        const newEnd = Math.max(newStart + 0.2, parseFloat((s.endTime + deltaEnd).toFixed(2)));
        const newDur = parseFloat((newEnd - newStart).toFixed(2));
        return {
          ...s,
          startTime: newStart,
          endTime: newEnd,
          duration: newDur,
        };
      })
    );
  };

  // Calculations for active cuts
  const activeCuts = segments.filter((s) => s.selected);
  const totalOriginalDur = analysis?.totalOriginalDuration || project.duration || 10;
  const activeCutSeconds = activeCuts.reduce((acc, curr) => acc + curr.duration, 0);
  const activeProjectedDur = Math.max(0.5, totalOriginalDur - activeCutSeconds);
  const activeReductionPercent =
    totalOriginalDur > 0 ? Math.round((activeCutSeconds / totalOriginalDur) * 100) : 0;

  const handleApply = () => {
    onApplyCuts(activeCuts);
    onClose();
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "silence":
        return <VolumeX className="w-3.5 h-3.5 text-amber-400" />;
      case "dead_air":
        return <PauseCircle className="w-3.5 h-3.5 text-sky-400" />;
      case "low_motion":
        return <EyeOff className="w-3.5 h-3.5 text-indigo-400" />;
      case "repetitive_action":
        return <Repeat className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Scissors className="w-3.5 h-3.5 text-[#FFB347]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div 
        id="modal-smart-cut"
        className="w-full max-w-2xl bg-[#0D0D10] border border-[#26262B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1E1E24] flex items-center justify-between bg-gradient-to-r from-[#14141A] to-[#0D0D10]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFB347]/20 to-[#FF8C00]/30 border border-[#FFB347]/40 flex items-center justify-center text-[#FFB347]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">AI Smart Cut</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/30">
                  Concise Edit
                </span>
              </div>
              <p className="text-xs text-[#888892]">
                Automatically detect & prune dead air, silence gaps, and repetitive pauses
              </p>
            </div>
          </div>
          <button
            id="btn-close-smart-cut"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181820] hover:bg-[#22222C] text-[#888892] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Controls: Sensitivity selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131318] p-3 rounded-xl border border-[#202028]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D0D0D8]">
              <SlidersHorizontal className="w-4 h-4 text-[#FFB347]" />
              <span>Cut Pacing Sensitivity:</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0A0A0D] p-1 rounded-lg border border-[#1C1C24]">
              {(
                [
                  { id: "conservative", label: "Conservative", desc: "Dead air only" },
                  { id: "balanced", label: "Balanced", desc: "Natural concise" },
                  { id: "aggressive", label: "Aggressive", desc: "Fast-paced reel" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSensitivity(mode.id);
                    runSmartCutAnalysis(mode.id);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    sensitivity === mode.id
                      ? "bg-[#FFB347] text-black font-bold shadow-sm"
                      : "text-[#888892] hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics summary card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#131318] border border-[#202028]">
              <div className="text-[10px] uppercase font-bold text-[#777782] tracking-wider mb-1">
                Original Duration
              </div>
              <div className="text-base font-mono font-bold text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#888892]" />
                {totalOriginalDur.toFixed(1)}s
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131318] border border-[#202028]">
              <div className="text-[10px] uppercase font-bold text-[#777782] tracking-wider mb-1">
                Identified Cuts
              </div>
              <div className="text-base font-mono font-bold text-[#FF4444] flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-[#FF4444]" />
                -{activeCutSeconds.toFixed(1)}s
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131318] border border-[#202028]">
              <div className="text-[10px] uppercase font-bold text-[#777782] tracking-wider mb-1">
                Concise Duration
              </div>
              <div className="text-base font-mono font-bold text-[#47BD47] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#47BD47]" />
                {activeProjectedDur.toFixed(1)}s
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131318] border border-[#202028]">
              <div className="text-[10px] uppercase font-bold text-[#777782] tracking-wider mb-1">
                Time Saved
              </div>
              <div className="text-base font-mono font-bold text-[#FFB347]">
                {activeReductionPercent}% Faster
              </div>
            </div>
          </div>

          {/* Timeline Visual Cut Preview Ribbon */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#888892]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB347]" />
                Timeline Cut Strip Preview
              </span>
              <span className="text-[11px] font-mono">
                {activeCuts.length} of {segments.length} cuts enabled
              </span>
            </div>

            <div className="h-9 w-full bg-[#0A0A0D] border border-[#24242C] rounded-xl overflow-hidden relative flex items-center">
              {/* Visual kept clip background */}
              <div className="absolute inset-0 bg-[#1E293B]/40" />

              {/* Cut segments overlaid in red/amber hatched */}
              {segments.map((seg) => {
                const leftPercent = (seg.startTime / totalOriginalDur) * 100;
                const widthPercent = (seg.duration / totalOriginalDur) * 100;
                const isCurrent = seg.id === selectedSegmentId;

                return (
                  <div
                    key={seg.id}
                    onClick={() => {
                      setSelectedSegmentId(seg.id);
                      if (onSeekToTime) onSeekToTime(seg.startTime);
                    }}
                    className={`absolute h-full cursor-pointer transition-all ${
                      seg.selected
                        ? isCurrent
                          ? "bg-[#FF4444]/60 border-2 border-white z-20"
                          : "bg-[#FF4444]/40 border-x border-[#FF4444] z-10 hover:bg-[#FF4444]/60"
                        : "bg-slate-700/30 border-x border-slate-600 opacity-40"
                    }`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(1.5, widthPercent)}%`,
                    }}
                    title={`${seg.reasonLabel}: ${seg.startTime}s - ${seg.endTime}s (-${seg.duration}s)`}
                  />
                );
              })}

              <div className="relative z-20 px-3 w-full flex items-center justify-between pointer-events-none text-[10px] font-mono text-[#888892]">
                <span>0.0s</span>
                <span>{(totalOriginalDur / 2).toFixed(1)}s</span>
                <span>{totalOriginalDur.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Segment Review & Fine-Tuning List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Review Proposed AI Cuts ({segments.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSelectAll(true)}
                  className="text-[11px] font-medium text-[#FFB347] hover:underline"
                >
                  Select All
                </button>
                <span className="text-[#444]">•</span>
                <button
                  onClick={() => toggleSelectAll(false)}
                  className="text-[11px] font-medium text-[#888892] hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-3 bg-[#131318] rounded-xl border border-[#202028]">
                <div className="w-8 h-8 rounded-full border-2 border-[#FFB347] border-t-transparent animate-spin" />
                <span className="text-xs text-[#888892]">Analyzing video footage for dead air & redundant frames...</span>
              </div>
            ) : segments.length === 0 ? (
              <div className="py-8 text-center bg-[#131318] rounded-xl border border-[#202028] text-xs text-[#888892]">
                No redundant or silent segments found at this sensitivity level.
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {segments.map((seg, idx) => {
                  const isCurrent = seg.id === selectedSegmentId;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => setSelectedSegmentId(seg.id)}
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-[#181822] border-[#FFB347]/70 shadow-md"
                          : seg.selected
                          ? "bg-[#131318] border-[#22222A] hover:border-[#333340]"
                          : "bg-[#0F0F14] border-[#181820] opacity-60"
                      }`}
                    >
                      {/* Left: Checkbox + Reason badge */}
                      <div className="flex items-start sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSegment(seg.id);
                          }}
                          className="mt-0.5 sm:mt-0 text-[#FFB347] hover:scale-110 transition-transform"
                        >
                          {seg.selected ? (
                            <CheckSquare className="w-4 h-4 text-[#FFB347]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#666]" />
                          )}
                        </button>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-[#20202A]">
                              {getReasonIcon(seg.reason)}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {seg.reasonLabel}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                              -{seg.duration}s
                            </span>
                          </div>
                          <div className="text-[11px] text-[#888892] flex items-center gap-2">
                            <span>Clip: <strong className="text-slate-300">{seg.clipName}</strong></span>
                            <span>•</span>
                            <span className="font-mono">{seg.startTime}s → {seg.endTime}s</span>
                            <span>•</span>
                            <span className="text-amber-300/80">
                              {Math.round(seg.confidence * 100)}% AI confidence
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Boundary adjustment & preview */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#888892] bg-[#0A0A0D] px-2 py-1 rounded-lg border border-[#202028]">
                          <span>Trim:</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustSegmentBoundary(seg.id, -0.1, 0);
                            }}
                            className="w-5 h-5 rounded hover:bg-[#202028] text-white flex items-center justify-center font-bold"
                            title="Expand cut left by 0.1s"
                          >
                            -
                          </button>
                          <span className="text-[#FFB347] font-semibold">{seg.duration}s</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustSegmentBoundary(seg.id, 0.1, 0);
                            }}
                            className="w-5 h-5 rounded hover:bg-[#202028] text-white flex items-center justify-center font-bold"
                            title="Shorten cut left by 0.1s"
                          >
                            +
                          </button>
                        </div>

                        {onSeekToTime && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSeekToTime(seg.startTime);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#20202C] hover:bg-[#2B2B3C] text-xs font-semibold text-[#D0D0D8] flex items-center gap-1"
                            title="Jump playhead to this cut"
                          >
                            <Play className="w-3 h-3 text-[#FFB347] fill-current" />
                            <span>Preview</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-[#1E1E24] bg-[#0D0D10] flex items-center justify-between">
          <button
            onClick={() => runSmartCutAnalysis(sensitivity)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#888892] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Analyze</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A0A0AA] hover:bg-[#181820] transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-confirm-smart-cut"
              onClick={handleApply}
              disabled={activeCuts.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB347] to-[#FF8C00] text-black font-bold text-xs shadow-lg shadow-[#FFB347]/20 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Scissors className="w-4 h-4" />
              <span>Apply {activeCuts.length} Cuts (-{activeCutSeconds.toFixed(1)}s)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
