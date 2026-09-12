import React, { useState, useRef, useCallback, useEffect } from "react";
import { ColorGrading, VideoProject } from "../../types";
import { 
  Eye, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Sliders,
  Palette,
  Disc,
  Layers,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react";

interface ColorGradingPanelProps {
  project: VideoProject;
  onUpdateGrading: (grading: Partial<ColorGrading>) => void;
  onResetGrading: () => void;
  isBeforeAfterActive: boolean;
  onToggleBeforeAfter: () => void;
}

interface Point {
  x: number; // 0 to 1
  y: number; // 0 to 1
}

type CurveChannel = "master" | "red" | "green" | "blue";

export const ColorGradingPanel: React.FC<ColorGradingPanelProps> = ({
  project,
  onUpdateGrading,
  onResetGrading,
  isBeforeAfterActive,
  onToggleBeforeAfter,
}) => {
  // Main view: Default to "curves" (Tone Curve Graph) as requested!
  const [activeTab, setActiveTab] = useState<"curves" | "wheels" | "hsl">("curves");
  const [activeChannel, setActiveChannel] = useState<CurveChannel>("master");
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // HSL Color
  const [activeHslColor, setActiveHslColor] = useState<
    "red" | "yellow" | "green" | "cyan" | "blue" | "magenta"
  >("red");

  const grading = project.colorGrading;

  // Retrieve current channel's curve points
  const getChannelPoints = (ch: CurveChannel): Point[] => {
    switch (ch) {
      case "red":
        return grading.redCurve?.length ? grading.redCurve : [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 1, y: 1 }];
      case "green":
        return grading.greenCurve?.length ? grading.greenCurve : [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 1, y: 1 }];
      case "blue":
        return grading.blueCurve?.length ? grading.blueCurve : [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 1, y: 1 }];
      case "master":
      default:
        return grading.masterCurve?.length ? grading.masterCurve : [
          { x: 0, y: 0 },
          { x: 0.25, y: 0.25 },
          { x: 0.75, y: 0.75 },
          { x: 1, y: 1 }
        ];
    }
  };

  const currentPoints = getChannelPoints(activeChannel);

  // Update points for active channel
  const setChannelPoints = (newPoints: Point[]) => {
    // Keep points sorted by x
    const sorted = [...newPoints].sort((a, b) => a.x - b.x);
    switch (activeChannel) {
      case "red":
        onUpdateGrading({ redCurve: sorted });
        break;
      case "green":
        onUpdateGrading({ greenCurve: sorted });
        break;
      case "blue":
        onUpdateGrading({ blueCurve: sorted });
        break;
      case "master":
      default:
        onUpdateGrading({ masterCurve: sorted });
        break;
    }
  };

  // Convert normalized point (0..1) to SVG coordinates (0..200)
  // In SVG, y=0 is top, so y_svg = (1 - y) * 200
  const toSvgX = (x: number) => x * 200;
  const toSvgY = (y: number) => (1 - y) * 200;

  // Convert SVG coordinate back to normalized 0..1
  const fromSvgX = (svgX: number) => Math.max(0, Math.min(1, svgX / 200));
  const fromSvgY = (svgY: number) => Math.max(0, Math.min(1, 1 - svgY / 200));

  // Generate smooth SVG path through points using Catmull-Rom to Cubic Bezier
  const generateCurvePath = (pts: Point[]): string => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${toSvgX(pts[0].x)} ${toSvgY(pts[0].y)}`;

    const svgPts = pts.map((p) => ({ x: toSvgX(p.x), y: toSvgY(p.y) }));
    let d = `M ${svgPts[0].x} ${svgPts[0].y}`;

    for (let i = 0; i < svgPts.length - 1; i++) {
      const p0 = i > 0 ? svgPts[i - 1] : svgPts[i];
      const p1 = svgPts[i];
      const p2 = svgPts[i + 1];
      const p3 = i < svgPts.length - 2 ? svgPts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return d;
  };

  // Channel color scheme
  const channelColors: Record<CurveChannel, { stroke: string; fill: string; border: string; glow: string }> = {
    master: { stroke: "#FFB347", fill: "#FFB347", border: "#FFB347", glow: "rgba(255, 179, 71, 0.4)" },
    red: { stroke: "#ef4444", fill: "#ef4444", border: "#ef4444", glow: "rgba(239, 68, 68, 0.4)" },
    green: { stroke: "#10b981", fill: "#10b981", border: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
    blue: { stroke: "#3b82f6", fill: "#3b82f6", border: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },
  };

  // Add a point by clicking on graph canvas
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || isDragging) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickSvgX = ((e.clientX - rect.left) / rect.width) * 200;
    const clickSvgY = ((e.clientY - rect.top) / rect.height) * 200;

    const normX = parseFloat(fromSvgX(clickSvgX).toFixed(3));
    const normY = parseFloat(fromSvgY(clickSvgY).toFixed(3));

    // Avoid adding duplicate point too close to existing point
    const isClose = currentPoints.some((p) => Math.hypot(p.x - normX, p.y - normY) < 0.08);
    if (!isClose && currentPoints.length < 8) {
      const updated = [...currentPoints, { x: normX, y: normY }].sort((a, b) => a.x - b.x);
      setChannelPoints(updated);
      const newIdx = updated.findIndex((p) => p.x === normX && p.y === normY);
      setSelectedPointIndex(newIdx);
    }
  };

  // Start dragging a control point
  const handlePointDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.stopPropagation();
    setSelectedPointIndex(index);
    setIsDragging(true);

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const svgX = ((clientX - rect.left) / rect.width) * 200;
      const svgY = ((clientY - rect.top) / rect.height) * 200;

      let newX = fromSvgX(svgX);
      const newY = fromSvgY(svgY);

      // Lock endpoints to x=0 and x=1 if first or last
      if (index === 0) newX = 0;
      else if (index === currentPoints.length - 1) newX = 1;
      else {
        const prevX = currentPoints[index - 1].x + 0.02;
        const nextX = currentPoints[index + 1].x - 0.02;
        newX = Math.max(prevX, Math.min(nextX, newX));
      }

      const updated = currentPoints.map((p, i) => (i === index ? { x: newX, y: newY } : p));
      setChannelPoints(updated);
    };

    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // Delete selected control point
  const handleDeletePoint = () => {
    if (selectedPointIndex === null || currentPoints.length <= 2) return;
    if (selectedPointIndex === 0 || selectedPointIndex === currentPoints.length - 1) return; // Keep endpoints
    const updated = currentPoints.filter((_, i) => i !== selectedPointIndex);
    setChannelPoints(updated);
    setSelectedPointIndex(null);
  };

  // Direct numeric input change for selected point (In 0..255, Out 0..255)
  const handlePointCoordChange = (axis: "x" | "y", val255: number) => {
    if (selectedPointIndex === null) return;
    const clamped = Math.max(0, Math.min(255, val255)) / 255;
    const updated = currentPoints.map((p, i) => {
      if (i !== selectedPointIndex) return p;
      if (axis === "x") {
        if (i === 0) return { ...p, x: 0 };
        if (i === currentPoints.length - 1) return { ...p, x: 1 };
        return { ...p, x: clamped };
      } else {
        return { ...p, y: clamped };
      }
    });
    setChannelPoints(updated);
  };

  // Curve Presets (One-click professional tone shapes)
  const curvePresets = [
    {
      name: "S-Curve (Film)",
      desc: "Deep contrast & punch",
      apply: () =>
        setChannelPoints([
          { x: 0, y: 0 },
          { x: 0.25, y: 0.16 },
          { x: 0.5, y: 0.5 },
          { x: 0.75, y: 0.84 },
          { x: 1, y: 1 },
        ]),
    },
    {
      name: "Matte Shadows",
      desc: "Lifted vintage black",
      apply: () =>
        setChannelPoints([
          { x: 0, y: 0.14 },
          { x: 0.35, y: 0.38 },
          { x: 0.7, y: 0.72 },
          { x: 1, y: 0.94 },
        ]),
    },
    {
      name: "High Dynamic",
      desc: "Aggressive contrast",
      apply: () =>
        setChannelPoints([
          { x: 0, y: 0 },
          { x: 0.2, y: 0.1 },
          { x: 0.8, y: 0.9 },
          { x: 1, y: 1 },
        ]),
    },
    {
      name: "Soft Roll-off",
      desc: "Gentle film highlights",
      apply: () =>
        setChannelPoints([
          { x: 0, y: 0 },
          { x: 0.3, y: 0.32 },
          { x: 0.7, y: 0.72 },
          { x: 1, y: 0.92 },
        ]),
    },
    {
      name: "Linear Reset",
      desc: "Flat baseline",
      apply: () =>
        setChannelPoints([
          { x: 0, y: 0 },
          { x: 0.5, y: 0.5 },
          { x: 1, y: 1 },
        ]),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C] text-[#E0E0E0] select-none overflow-y-auto p-3.5 space-y-4 pb-20">
      {/* Top Bar: Subtabs + Raw View & Reset */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E1E28]">
        <div className="flex items-center gap-1.5">
          {[
            { id: "curves", label: "Tone Curve Graph", icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: "wheels", label: "Color Wheels", icon: <Disc className="w-3.5 h-3.5" /> },
            { id: "hsl", label: "HSL Channels", icon: <Palette className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 shadow-sm"
                  : "text-[#8E8E9F] hover:text-white hover:bg-[#161622]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            id="btn-grading-compare"
            onClick={onToggleBeforeAfter}
            className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-xl border transition-all ${
              isBeforeAfterActive
                ? "bg-[#FFB347]/20 text-[#FFB347] border-[#FFB347]"
                : "text-[#8E8E9F] bg-[#141419] border-[#22222A] hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isBeforeAfterActive ? "Raw" : "Graded"}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetGrading}
            className="p-1.5 rounded-xl text-[#8E8E9F] hover:text-[#FF5252] hover:bg-[#FF5252]/10 transition-colors"
            title="Reset All Color Grading"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Tone Curve Graph (कर्व ग्राफ) - Prominent Interactive Graph */}
      {activeTab === "curves" && (
        <div className="space-y-4">
          {/* Channel Selector Pills */}
          <div className="flex items-center justify-between bg-[#141419] p-2 rounded-2xl border border-[#22222A]">
            <div className="flex items-center gap-1.5">
              {[
                { id: "master", label: "RGB Master", color: "text-[#FFB347]" },
                { id: "red", label: "Red (R)", color: "text-red-400" },
                { id: "green", label: "Green (G)", color: "text-emerald-400" },
                { id: "blue", label: "Blue (B)", color: "text-blue-400" },
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChannel(ch.id as CurveChannel);
                    setSelectedPointIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeChannel === ch.id
                      ? "bg-white/10 text-white border border-white/20 shadow-sm"
                      : "text-[#8E8E9F] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={ch.color}>{ch.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setChannelPoints([
                  { x: 0, y: 0 },
                  { x: 0.5, y: 0.5 },
                  { x: 1, y: 1 },
                ]);
                setSelectedPointIndex(null);
              }}
              className="text-[11px] text-[#8E8E9F] hover:text-[#FFB347] px-2 py-1"
            >
              Reset Channel
            </button>
          </div>

          {/* Interactive SVG Tone Curve Graph Canvas */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-[#141419] p-4 rounded-2xl border border-[#22222A]">
            {/* SVG Graph */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-[#08080C] rounded-2xl border border-[#262634] p-2 shadow-inner flex items-center justify-center">
              <svg
                ref={svgRef}
                className="w-full h-full cursor-crosshair overflow-visible"
                viewBox="0 0 200 200"
                onClick={handleSvgClick}
              >
                {/* Graph Background Grid (4x4 Quadrants) */}
                <line x1="0" y1="50" x2="200" y2="50" stroke="#1A1A24" strokeWidth="1" />
                <line x1="0" y1="100" x2="200" y2="100" stroke="#222230" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="200" y2="150" stroke="#1A1A24" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="200" stroke="#1A1A24" strokeWidth="1" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="#222230" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1="150" y1="0" x2="150" y2="200" stroke="#1A1A24" strokeWidth="1" />

                {/* Diagonal 45-degree Reference Line */}
                <line x1="0" y1="200" x2="200" y2="0" stroke="#333344" strokeWidth="1.2" strokeDasharray="4 4" />

                {/* Curve Shadow & Main Curve Path */}
                <path
                  d={generateCurvePath(currentPoints)}
                  fill="none"
                  stroke={channelColors[activeChannel].stroke}
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 6px ${channelColors[activeChannel].glow})`,
                  }}
                />

                {/* Draggable Control Points */}
                {currentPoints.map((pt, idx) => {
                  const sx = toSvgX(pt.x);
                  const sy = toSvgY(pt.y);
                  const isSelected = selectedPointIndex === idx;

                  return (
                    <g
                      key={`pt-${idx}`}
                      onMouseDown={(e) => handlePointDragStart(e, idx)}
                      onTouchStart={(e) => handlePointDragStart(e, idx)}
                      className="cursor-grab active:cursor-grabbing group"
                    >
                      {/* Outer pulse when selected */}
                      {isSelected && (
                        <circle
                          cx={sx}
                          cy={sy}
                          r="9"
                          fill="none"
                          stroke={channelColors[activeChannel].stroke}
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-pulse"
                        />
                      )}
                      {/* Interactive Point Circle */}
                      <circle
                        cx={sx}
                        cy={sy}
                        r={isSelected ? "6" : "5"}
                        fill={channelColors[activeChannel].fill}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-transform duration-100 group-hover:scale-125"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Corner labels */}
              <span className="absolute bottom-1 left-2 text-[8px] font-mono text-[#5A5A6E]">Shadows (0)</span>
              <span className="absolute top-1 right-2 text-[8px] font-mono text-[#5A5A6E]">Highlights (255)</span>
            </div>

            {/* Right Side: Selected Point Controls & Curve Presets */}
            <div className="flex-1 w-full space-y-3">
              {/* Active Point Coordinates Box */}
              <div className="bg-[#1C1C24] p-3 rounded-xl border border-[#2A2A38] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>Selected Node {selectedPointIndex !== null ? `#${selectedPointIndex + 1}` : "(Click graph to add)"}</span>
                  {selectedPointIndex !== null &&
                    selectedPointIndex > 0 &&
                    selectedPointIndex < currentPoints.length - 1 && (
                      <button
                        onClick={handleDeletePoint}
                        className="flex items-center gap-1 text-[10px] text-[#FF5252] hover:underline"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete node</span>
                      </button>
                    )}
                </div>

                {selectedPointIndex !== null ? (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Input X (0..255) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#8E8E9F]">
                        <span>Input X</span>
                        <span className="font-mono text-white">
                          {Math.round(currentPoints[selectedPointIndex].x * 255)}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={Math.round(currentPoints[selectedPointIndex].x * 255)}
                        disabled={selectedPointIndex === 0 || selectedPointIndex === currentPoints.length - 1}
                        onChange={(e) => handlePointCoordChange("x", parseInt(e.target.value) || 0)}
                        className="w-full h-7 bg-[#0A0A0E] text-center font-mono text-xs font-bold text-[#FFB347] border border-[#2E2E3E] rounded-lg focus:outline-none"
                      />
                    </div>

                    {/* Output Y (0..255) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#8E8E9F]">
                        <span>Output Y</span>
                        <span className="font-mono text-white">
                          {Math.round(currentPoints[selectedPointIndex].y * 255)}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={Math.round(currentPoints[selectedPointIndex].y * 255)}
                        onChange={(e) => handlePointCoordChange("y", parseInt(e.target.value) || 0)}
                        className="w-full h-7 bg-[#0A0A0E] text-center font-mono text-xs font-bold text-[#FFB347] border border-[#2E2E3E] rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#7A7A8E] py-1">
                    Click anywhere on the curve to add a control point. Drag points up to brighten or down to darken that tonal zone.
                  </div>
                )}
              </div>

              {/* Quick Curve Presets */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#8E8E9F]">Curve Presets (ग्राफ प्रीसेट)</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {curvePresets.map((cp) => (
                    <button
                      key={cp.name}
                      onClick={cp.apply}
                      className="p-2 rounded-xl bg-[#1C1C24] hover:bg-[#242430] border border-[#282834] hover:border-[#FFB347]/40 text-left transition-all active:scale-[0.98]"
                    >
                      <div className="text-xs font-medium text-white">{cp.name}</div>
                      <div className="text-[9px] text-[#7A7A8E]">{cp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Color Wheels Tab */}
      {activeTab === "wheels" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "lift", label: "Shadows (Lift)", val: grading.lift },
              { id: "gamma", label: "Midtones (Gamma)", val: grading.gamma },
              { id: "gain", label: "Highlights (Gain)", val: grading.gain },
            ].map((wheel) => (
              <div
                key={wheel.id}
                className="bg-[#141419] rounded-2xl p-3 border border-[#22222A] flex flex-col items-center space-y-2.5"
              >
                <span className="text-xs font-semibold text-white">{wheel.label}</span>

                {/* Simulated 2D Color Wheel Disc */}
                <div
                  className="w-24 h-24 rounded-full relative cursor-pointer shadow-inner border border-[#333340]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)",
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const dx = e.clientX - rect.left - cx;
                    const dy = e.clientY - rect.top - cy;
                    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                    const hue = (angle + 360) % 360;
                    const sat = Math.min(1, Math.hypot(dx, dy) / cx);

                    onUpdateGrading({
                      [wheel.id]: {
                        ...wheel.val,
                        hue: Math.round(hue),
                        saturation: parseFloat(sat.toFixed(2)),
                      },
                    });
                  }}
                >
                  {/* Center cursor pin */}
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white bg-black/60 absolute shadow-[0_0_8px_#fff]"
                    style={{
                      left: `calc(50% + ${
                        Math.cos((wheel.val.hue * Math.PI) / 180) *
                        wheel.val.saturation *
                        40
                      }px - 8px)`,
                      top: `calc(50% + ${
                        Math.sin((wheel.val.hue * Math.PI) / 180) *
                        wheel.val.saturation *
                        40
                      }px - 8px)`,
                    }}
                  />
                </div>

                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[10px] text-[#8E8E9F]">
                    <span>Luminance</span>
                    <span className="font-mono text-[#FFB347]">{wheel.val.luminance.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={wheel.val.luminance}
                    onChange={(e) =>
                      onUpdateGrading({
                        [wheel.id]: { ...wheel.val, luminance: Number(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 bg-[#1C1C26] rounded-lg cursor-pointer accent-[#FFB347]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HSL Tab */}
      {activeTab === "hsl" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["red", "yellow", "green", "cyan", "blue", "magenta"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveHslColor(c)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  activeHslColor === c ? "border-[#FFB347] ring-2 ring-[#FFB347]/30" : "border-transparent opacity-80"
                }`}
                style={{
                  backgroundColor:
                    c === "red"
                      ? "#dc2626"
                      : c === "yellow"
                      ? "#d97706"
                      : c === "green"
                      ? "#16a34a"
                      : c === "cyan"
                      ? "#0891b2"
                      : c === "blue"
                      ? "#2563eb"
                      : "#c026d3",
                }}
              >
                {c.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="bg-[#141419] rounded-2xl p-4 border border-[#22222A] space-y-3">
            <div className="text-xs font-semibold text-white capitalize">
              {activeHslColor} Channel Tuning
            </div>

            {/* Hue */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white">
                <span>Hue Shift</span>
                <span className="font-mono text-[#FFB347]">{grading.hsl[activeHslColor].h}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={grading.hsl[activeHslColor].h}
                onChange={(e) =>
                  onUpdateGrading({
                    hsl: {
                      ...grading.hsl,
                      [activeHslColor]: {
                        ...grading.hsl[activeHslColor],
                        h: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full h-1.5 bg-[#1C1C26] rounded-lg cursor-pointer accent-[#FFB347]"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white">
                <span>Saturation</span>
                <span className="font-mono text-[#FFB347]">{grading.hsl[activeHslColor].s}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={grading.hsl[activeHslColor].s}
                onChange={(e) =>
                  onUpdateGrading({
                    hsl: {
                      ...grading.hsl,
                      [activeHslColor]: {
                        ...grading.hsl[activeHslColor],
                        s: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full h-1.5 bg-[#1C1C26] rounded-lg cursor-pointer accent-[#FFB347]"
              />
            </div>

            {/* Lightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white">
                <span>Luminance / Lightness</span>
                <span className="font-mono text-[#FFB347]">{grading.hsl[activeHslColor].l}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={grading.hsl[activeHslColor].l}
                onChange={(e) =>
                  onUpdateGrading({
                    hsl: {
                      ...grading.hsl,
                      [activeHslColor]: {
                        ...grading.hsl[activeHslColor],
                        l: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full h-1.5 bg-[#1C1C26] rounded-lg cursor-pointer accent-[#FFB347]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
