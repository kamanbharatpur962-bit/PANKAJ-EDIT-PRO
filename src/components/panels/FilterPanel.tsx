import React, { useMemo, useRef, useState, useEffect } from "react";
import { ColorGrading, FilterType, VideoProject } from "../../types";
import {
  FILTERS_300,
  FILTER_CATEGORIES,
  FilterCategory,
  FilterPreset300,
  getPresetCSSFilter,
} from "../../data/filters300";
import { LUT_PRESETS } from "../../data/sampleMedia";
import {
  Sliders,
  Sparkles,
  Upload,
  Check,
  Search,
  RotateCcw,
  Eye,
  X,
  Bookmark,
  ChevronRight,
  SlidersHorizontal,
  Wand2,
  Image as ImageIcon,
  Film,
  Save,
  Plus,
  Minus
} from "lucide-react";

// Representative High-Quality Photographs for Each Filter Category/Type
// Shows authentic model face for Portrait, movie still for Cinematic, food plate for Food, etc.
export const CATEGORY_SAMPLE_PHOTOS: Record<string, string> = {
  Portrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=75",
  Cinematic: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=350&auto=format&fit=crop&q=75",
  Nature: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=350&auto=format&fit=crop&q=75",
  Neon: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=350&auto=format&fit=crop&q=75",
  "Black & White": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=350&auto=format&fit=crop&q=75",
  Moody: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=350&auto=format&fit=crop&q=75",
  Retro: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=350&auto=format&fit=crop&q=75",
  Vintage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=350&auto=format&fit=crop&q=75",
  Travel: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&auto=format&fit=crop&q=75",
  Wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=350&auto=format&fit=crop&q=75",
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=350&auto=format&fit=crop&q=75",
  HDR: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=350&auto=format&fit=crop&q=75",
  Aesthetic: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=350&auto=format&fit=crop&q=75",
};

export interface CustomFilterPreset {
  id: string;
  name: string;
  baseFilter: FilterType;
  intensity: number;
  warmth: number;
  tint: number;
  contrast: number;
  saturation: number;
  grain: number;
  fade: number;
}

interface FilterPanelProps {
  project: VideoProject;
  onUpdateFilter: (filter: FilterType, intensity: number) => void;
  onUpdateLUT: (lutName: string, lutIntensity: number) => void;
  onUpdateGrading?: (grading: Partial<ColorGrading>) => void;
  isBeforeAfterActive?: boolean;
  onToggleBeforeAfter?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  project,
  onUpdateFilter,
  onUpdateLUT,
  onUpdateGrading,
  isBeforeAfterActive = false,
  onToggleBeforeAfter,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  
  // Preview mode toggle: "type_photo" (category specific photo) or "my_video" (user project frame)
  const [previewThumbnailMode, setPreviewThumbnailMode] = useState<"type_photo" | "my_video">("type_photo");

  // Filter Customization Drawer State
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customWarmth, setCustomWarmth] = useState<number>(project.colorGrading?.temperature || 0);
  const [customTint, setCustomTint] = useState<number>(project.colorGrading?.tint || 0);
  const [customContrastDelta, setCustomContrastDelta] = useState<number>(0);
  const [customSaturationDelta, setCustomSaturationDelta] = useState<number>(0);
  const [customGrain, setCustomGrain] = useState<number>(0);
  const [customFade, setCustomFade] = useState<number>(Math.round((project.colorGrading?.fade || 0) * 100));
  const [customPresetName, setCustomPresetName] = useState<string>("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // User's custom created filters stored in localStorage
  const [myCustomFilters, setMyCustomFilters] = useState<CustomFilterPreset[]>(() => {
    try {
      const saved = localStorage.getItem("pankaj_custom_filters");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteFilters, setFavoriteFilters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("pankaj_fav_filters");
      return saved ? JSON.parse(saved) : ["Cinematic Gold", "Hollywood", "Cyberpunk", "Golden Hour"];
    } catch {
      return ["Cinematic Gold", "Hollywood", "Cyberpunk", "Golden Hour"];
    }
  });

  const toggleFavorite = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setFavoriteFilters((prev) => {
      const updated = prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name];
      try {
        localStorage.setItem("pankaj_fav_filters", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleLUTImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const lutName = file.name.replace(/\.[^/.]+$/, "");
      onUpdateLUT(lutName, 100);
    }
  };

  // Sync custom controls when grading or activeFilter changes
  useEffect(() => {
    if (project.colorGrading) {
      setCustomWarmth(project.colorGrading.temperature || 0);
      setCustomTint(project.colorGrading.tint || 0);
      setCustomFade(Math.round((project.colorGrading.fade || 0) * 100));
    }
  }, [project.colorGrading]);

  // Handle fine customization changes
  const applyCustomization = (updates: {
    warmth?: number;
    tint?: number;
    contrastDelta?: number;
    saturationDelta?: number;
    fade?: number;
  }) => {
    if (!onUpdateGrading) return;
    const newWarmth = updates.warmth !== undefined ? updates.warmth : customWarmth;
    const newTint = updates.tint !== undefined ? updates.tint : customTint;
    const newContrastDelta = updates.contrastDelta !== undefined ? updates.contrastDelta : customContrastDelta;
    const newSatDelta = updates.saturationDelta !== undefined ? updates.saturationDelta : customSaturationDelta;
    const newFade = updates.fade !== undefined ? updates.fade : customFade;

    onUpdateGrading({
      temperature: newWarmth,
      tint: newTint,
      contrast: Math.max(0.5, Math.min(2.0, 1.0 + newContrastDelta / 100)),
      saturation: Math.max(0.0, Math.min(2.0, 1.0 + newSatDelta / 100)),
      fade: newFade / 100,
    });
  };

  // Save customized filter
  const handleSaveCustomFilter = () => {
    const nameToSave = customPresetName.trim() || `${project.activeFilter} Custom`;
    const newCustom: CustomFilterPreset = {
      id: `custom-${Date.now()}`,
      name: nameToSave,
      baseFilter: project.activeFilter,
      intensity: project.filterIntensity,
      warmth: customWarmth,
      tint: customTint,
      contrast: customContrastDelta,
      saturation: customSaturationDelta,
      grain: customGrain,
      fade: customFade,
    };

    const updated = [newCustom, ...myCustomFilters];
    setMyCustomFilters(updated);
    try {
      localStorage.setItem("pankaj_custom_filters", JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSaveSuccessMsg(`Saved "${nameToSave}" to Custom Presets!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    setCustomPresetName("");
  };

  // Reset custom filter adjustments
  const handleResetCustomization = () => {
    setCustomWarmth(0);
    setCustomTint(0);
    setCustomContrastDelta(0);
    setCustomSaturationDelta(0);
    setCustomGrain(0);
    setCustomFade(0);
    if (onUpdateGrading) {
      onUpdateGrading({
        temperature: 0,
        tint: 0,
        contrast: 1.0,
        saturation: 1.0,
        fade: 0,
      });
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: FILTERS_300.length };
    for (const f of FILTERS_300) {
      counts[f.category] = (counts[f.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered list based on category & search query
  const filteredPresets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cleanNum = q.startsWith("#") ? q.slice(1) : q;

    return FILTERS_300.filter((filter) => {
      // Category match
      if (selectedCategory !== "All" && filter.category !== selectedCategory) {
        return false;
      }

      // Query match (by name, ID, category)
      if (q) {
        const matchesName = filter.name.toLowerCase().includes(q);
        const matchesCategory = filter.category.toLowerCase().includes(q);
        const matchesId = filter.id.toString() === cleanNum;
        return matchesName || matchesCategory || matchesId;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const activePreset = useMemo(() => {
    return FILTERS_300.find((f) => f.name === project.activeFilter);
  }, [project.activeFilter]);

  // Project fallback image
  const projectPreviewImage = project.clips[0]?.thumbnail || project.thumbnail || CATEGORY_SAMPLE_PHOTOS["Cinematic"];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C] text-[#E0E0E0] select-none p-3 space-y-3.5 pb-20 overflow-y-auto">
      {/* 1. Header Controls: Active Preset, Intensity & Compare Original */}
      <div className="bg-[#141419] rounded-2xl p-3.5 border border-[#22222A] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347]/15 flex items-center justify-center text-[#FFB347] border border-[#FFB347]/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white">Active Filter:</span>
                <span className="text-xs font-bold text-[#FFB347]">
                  {project.activeFilter === "none" ? "None (Raw)" : project.activeFilter}
                </span>
              </div>
              <p className="text-[10px] text-[#8E8E9F]">
                {activePreset ? `${activePreset.category} #${activePreset.id}` : "Select any of 300 photographic filters"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Customize Filter Toggle Button */}
            <button
              id="btn-filter-customize-toggle"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isCustomizing
                  ? "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8] shadow-sm shadow-[#38bdf8]/20"
                  : "bg-[#1C1C24] text-[#8E8E9F] border-[#2A2A36] hover:text-white"
              }`}
              title="Fine-tune and customize active filter"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isCustomizing ? "Close Customize" : "Customize Filter"}</span>
            </button>

            {/* Before / After toggle */}
            {onToggleBeforeAfter && (
              <button
                id="btn-filter-compare"
                onClick={onToggleBeforeAfter}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isBeforeAfterActive
                    ? "bg-[#FFB347]/20 text-[#FFB347] border-[#FFB347]"
                    : "bg-[#1C1C24] text-[#8E8E9F] border-[#2A2A36] hover:text-white"
                }`}
                title="Toggle Before / After"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isBeforeAfterActive ? "Raw" : "Filtered"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Intensity Slider with exact number input */}
        <div className="space-y-1.5 bg-[#0C0C10] p-2.5 rounded-xl border border-[#1E1E28]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8E8E9F] font-medium">Filter Intensity (तीव्रता)</span>
            <div className="flex items-center gap-1">
              <input
                id="input-filter-intensity-number"
                type="number"
                min="0"
                max="100"
                value={project.filterIntensity}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                  onUpdateFilter(project.activeFilter, val);
                }}
                className="w-12 h-6 text-center font-mono text-xs font-bold text-[#FFB347] bg-[#161620] border border-[#2E2E3E] rounded-md focus:outline-none"
              />
              <span className="text-[10px] text-[#6A6A7E] font-mono">%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="slider-filter-intensity"
              type="range"
              min="0"
              max="100"
              value={project.filterIntensity}
              onChange={(e) => onUpdateFilter(project.activeFilter, Number(e.target.value))}
              className="flex-1 h-1.5 bg-[#1C1C24] rounded-lg appearance-none cursor-pointer accent-[#FFB347]"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {[25, 50, 75, 85, 100].map((val) => (
              <button
                key={val}
                onClick={() => onUpdateFilter(project.activeFilter, val)}
                className={`flex-1 py-0.5 text-[10px] font-mono rounded-lg transition-all ${
                  project.filterIntensity === val
                    ? "bg-[#FFB347] text-black font-bold"
                    : "bg-[#161620] text-[#7A7A8E] hover:text-white"
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CUSTOMIZE FILTER PANEL (फ़िल्टर कस्टमाइज़ करें) */}
      {isCustomizing && (
        <div className="bg-[#141419] rounded-2xl p-4 border border-[#38bdf8]/40 shadow-xl space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#22222E] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8]">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Customize Active Filter</h4>
                <p className="text-[10px] text-[#7A7A8E]">Adjust warmth, tint, contrast, grain & fade on top of {project.activeFilter}</p>
              </div>
            </div>

            <button
              onClick={handleResetCustomization}
              className="flex items-center gap-1 text-[11px] text-[#8E8E9F] hover:text-[#FF5252] bg-[#1C1C24] px-2 py-1 rounded-lg border border-[#2A2A34] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Customization Sliders with Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Warmth / Temp */}
            <div className="bg-[#181820] p-2.5 rounded-xl border border-[#242432] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8E8E9F]">Filter Warmth</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="-50"
                    max="50"
                    value={customWarmth}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCustomWarmth(val);
                      applyCustomization({ warmth: val });
                    }}
                    className="w-12 h-5 text-center font-mono text-xs font-bold text-[#f97316] bg-[#0E0E14] border border-[#2A2A3A] rounded focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={customWarmth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomWarmth(val);
                  applyCustomization({ warmth: val });
                }}
                className="w-full h-1.5 bg-[#121218] rounded-lg cursor-pointer accent-[#f97316]"
              />
            </div>

            {/* Tint */}
            <div className="bg-[#181820] p-2.5 rounded-xl border border-[#242432] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8E8E9F]">Filter Tint</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="-50"
                    max="50"
                    value={customTint}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCustomTint(val);
                      applyCustomization({ tint: val });
                    }}
                    className="w-12 h-5 text-center font-mono text-xs font-bold text-[#a855f7] bg-[#0E0E14] border border-[#2A2A3A] rounded focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={customTint}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomTint(val);
                  applyCustomization({ tint: val });
                }}
                className="w-full h-1.5 bg-[#121218] rounded-lg cursor-pointer accent-[#a855f7]"
              />
            </div>

            {/* Contrast Delta */}
            <div className="bg-[#181820] p-2.5 rounded-xl border border-[#242432] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8E8E9F]">Extra Contrast</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="-50"
                    max="50"
                    value={customContrastDelta}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCustomContrastDelta(val);
                      applyCustomization({ contrastDelta: val });
                    }}
                    className="w-12 h-5 text-center font-mono text-xs font-bold text-[#38bdf8] bg-[#0E0E14] border border-[#2A2A3A] rounded focus:outline-none"
                  />
                  <span className="text-[9px] text-[#6A6A7E] font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={customContrastDelta}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomContrastDelta(val);
                  applyCustomization({ contrastDelta: val });
                }}
                className="w-full h-1.5 bg-[#121218] rounded-lg cursor-pointer accent-[#38bdf8]"
              />
            </div>

            {/* Saturation Delta */}
            <div className="bg-[#181820] p-2.5 rounded-xl border border-[#242432] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8E8E9F]">Extra Saturation</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="-50"
                    max="50"
                    value={customSaturationDelta}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCustomSaturationDelta(val);
                      applyCustomization({ saturationDelta: val });
                    }}
                    className="w-12 h-5 text-center font-mono text-xs font-bold text-[#ec4899] bg-[#0E0E14] border border-[#2A2A3A] rounded focus:outline-none"
                  />
                  <span className="text-[9px] text-[#6A6A7E] font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={customSaturationDelta}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomSaturationDelta(val);
                  applyCustomization({ saturationDelta: val });
                }}
                className="w-full h-1.5 bg-[#121218] rounded-lg cursor-pointer accent-[#ec4899]"
              />
            </div>

            {/* Film Fade / Lifted Blacks */}
            <div className="bg-[#181820] p-2.5 rounded-xl border border-[#242432] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8E8E9F]">Vintage Fade (Matte)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customFade}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCustomFade(val);
                      applyCustomization({ fade: val });
                    }}
                    className="w-12 h-5 text-center font-mono text-xs font-bold text-[#e2e8f0] bg-[#0E0E14] border border-[#2A2A3A] rounded focus:outline-none"
                  />
                  <span className="text-[9px] text-[#6A6A7E] font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={customFade}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomFade(val);
                  applyCustomization({ fade: val });
                }}
                className="w-full h-1.5 bg-[#121218] rounded-lg cursor-pointer accent-[#e2e8f0]"
              />
            </div>

            {/* Analog Film Grain */}
            <div className="bg-[#181820] p-2.5 rounded-xl border border-[#242432] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8E8E9F]">Analog Film Grain</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customGrain}
                    onChange={(e) => setCustomGrain(parseInt(e.target.value) || 0)}
                    className="w-12 h-5 text-center font-mono text-xs font-bold text-[#FFB347] bg-[#0E0E14] border border-[#2A2A3A] rounded focus:outline-none"
                  />
                  <span className="text-[9px] text-[#6A6A7E] font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={customGrain}
                onChange={(e) => setCustomGrain(Number(e.target.value))}
                className="w-full h-1.5 bg-[#121218] rounded-lg cursor-pointer accent-[#FFB347]"
              />
            </div>
          </div>

          {/* Save As Custom Preset */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-[#22222E]">
            <input
              type="text"
              placeholder="Custom Preset Name (e.g. My Golden Glow)..."
              value={customPresetName}
              onChange={(e) => setCustomPresetName(e.target.value)}
              className="flex-1 h-8 bg-[#0E0E14] px-3 text-xs text-white placeholder-[#5A5A6E] border border-[#2A2A3A] rounded-xl focus:outline-none focus:border-[#38bdf8]"
            />
            <button
              onClick={handleSaveCustomFilter}
              className="w-full sm:w-auto px-4 py-2 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Custom Preset</span>
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium">
              {saveSuccessMsg}
            </div>
          )}
        </div>
      )}

      {/* 3. Search & Preview Mode Switcher ("Type Photos" vs "My Video Frame") */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A8E]" />
          <input
            id="input-filter-search"
            type="text"
            placeholder="Search 300 filters by name, #ID, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 bg-[#141419] border border-[#22222A] rounded-xl text-xs text-white placeholder-[#7A7A8E] focus:outline-none focus:border-[#FFB347] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7A8E] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Preview Image Mode Toggle: Category Type Photo vs My Clip */}
        <div className="flex items-center gap-1 bg-[#141419] p-1 rounded-xl border border-[#22222A] shrink-0">
          <button
            onClick={() => setPreviewThumbnailMode("type_photo")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              previewThumbnailMode === "type_photo"
                ? "bg-[#FFB347] text-black font-bold shadow-sm"
                : "text-[#8E8E9F] hover:text-white"
            }`}
            title="Show category-specific photo (face for portrait, food for food, etc.)"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Type Photos</span>
          </button>
          <button
            onClick={() => setPreviewThumbnailMode("my_video")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              previewThumbnailMode === "my_video"
                ? "bg-[#FFB347] text-black font-bold shadow-sm"
                : "text-[#8E8E9F] hover:text-white"
            }`}
            title="Show active project clip frame"
          >
            <Film className="w-3 h-3" />
            <span>My Clip</span>
          </button>
        </div>
      </div>

      {/* 4. Category Filter Tabs with Counts */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0 select-none">
        {FILTER_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? "bg-[#FFB347] text-black shadow-md shadow-[#FFB347]/20 font-bold"
                  : "bg-[#141419] text-[#8E8E9F] hover:text-white hover:bg-[#1A1A22] border border-[#22222E]"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-black/20 text-black font-bold" : "bg-[#20202A] text-[#7A7A8E]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* My Custom Presets (if user saved any) */}
      {myCustomFilters.length > 0 && selectedCategory === "All" && !searchQuery && (
        <div className="space-y-2 bg-[#121218] p-3 rounded-2xl border border-[#2A2A38]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#38bdf8] flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Saved Custom Filters ({myCustomFilters.length})</span>
            </span>
            <button
              onClick={() => {
                setMyCustomFilters([]);
                localStorage.removeItem("pankaj_custom_filters");
              }}
              className="text-[10px] text-[#7A7A8E] hover:text-[#FF5252]"
            >
              Clear Custom
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {myCustomFilters.map((cf) => (
              <button
                key={cf.id}
                onClick={() => {
                  onUpdateFilter(cf.baseFilter, cf.intensity);
                  if (onUpdateGrading) {
                    onUpdateGrading({
                      temperature: cf.warmth,
                      tint: cf.tint,
                      contrast: 1.0 + cf.contrast / 100,
                      saturation: 1.0 + cf.saturation / 100,
                      fade: cf.fade / 100,
                    });
                  }
                }}
                className="p-2 rounded-xl bg-[#1A1A24] hover:bg-[#222230] border border-[#2E2E40] text-left transition-all"
              >
                <div className="text-xs font-semibold text-white truncate">{cf.name}</div>
                <div className="text-[10px] text-[#FFB347]">{cf.baseFilter} ({cf.intensity}%)</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Filter Grid (300 presets with Real Photographic Preview Matching Its Type) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="text-[11px] font-medium text-[#9E9EAF]">
            Showing <span className="text-white font-semibold">{filteredPresets.length}</span> of 300 presets
            {selectedCategory !== "All" && (
              <span className="text-[#FFB347] ml-1">in {selectedCategory}</span>
            )}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[10px] text-[#FFB347] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {filteredPresets.length === 0 ? (
          <div className="p-8 text-center bg-[#141419] rounded-2xl border border-[#22222E] space-y-2">
            <Sparkles className="w-7 h-7 text-[#606075] mx-auto" />
            <p className="text-xs text-[#A0A0B0] font-medium">No filters found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs text-[#FFB347] hover:underline"
            >
              View all 300 filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {/* None / Original Preset Card */}
            <button
              id="btn-filter-none"
              onClick={() => onUpdateFilter("none", 0)}
              className={`relative flex flex-col rounded-xl p-2 border transition-all text-left ${
                project.activeFilter === "none"
                  ? "bg-[#FFB347]/15 border-[#FFB347] ring-2 ring-[#FFB347]/30 shadow-md shadow-[#FFB347]/15"
                  : "bg-[#141419] border-[#22222E] hover:border-[#353545] hover:bg-[#1B1B22]"
              }`}
            >
              <div className="w-full h-16 rounded-lg mb-2 relative overflow-hidden bg-black border border-[#2E2E3C] flex items-center justify-center">
                <img
                  src={previewThumbnailMode === "my_video" ? projectPreviewImage : CATEGORY_SAMPLE_PHOTOS["Portrait"]}
                  alt="Raw Original"
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white uppercase">
                  Raw
                </div>
                {project.activeFilter === "none" && (
                  <div className="absolute inset-0 bg-[#FFB347]/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#FFB347] flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-black stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-semibold text-white truncate">Original</span>
                <span className="text-[9px] text-[#6E6E82]">#0</span>
              </div>
              <span className="text-[9px] text-[#808092] truncate">No Filter</span>
            </button>

            {filteredPresets.map((f: FilterPreset300) => {
              const isSelected = project.activeFilter === f.name;
              const isFav = favoriteFilters.includes(f.name);
              const previewCSS = getPresetCSSFilter(f.name, 100);

              // Select photographic image matching filter category/type
              const samplePhoto =
                previewThumbnailMode === "my_video"
                  ? projectPreviewImage
                  : CATEGORY_SAMPLE_PHOTOS[f.category] || CATEGORY_SAMPLE_PHOTOS["Cinematic"];

              return (
                <button
                  key={f.id}
                  id={`btn-filter-${f.id}-${f.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => onUpdateFilter(f.name, project.filterIntensity || 85)}
                  className={`group relative flex flex-col rounded-xl p-2 border transition-all active:scale-[0.98] text-left ${
                    isSelected
                      ? "bg-[#FFB347]/15 border-[#FFB347] ring-2 ring-[#FFB347]/30 shadow-lg shadow-[#FFB347]/15"
                      : "bg-[#141419] border-[#22222E] hover:border-[#FFB347]/40 hover:bg-[#1A1A22]"
                  }`}
                >
                  {/* Visual Photographic Preview with Applied Filter */}
                  <div className="w-full h-16 rounded-lg mb-2 relative overflow-hidden shadow-inner border border-[#2A2A38]/50 bg-black">
                    {/* Realistic photographic background matching filter type */}
                    <img
                      src={samplePhoto}
                      alt={f.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{
                        filter: previewCSS || undefined,
                      }}
                      onError={(e) => {
                        // Fallback to gradient if image blocked
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />

                    {/* Gradient fallback backdrop */}
                    <div
                      className="absolute inset-0 -z-10"
                      style={{
                        background: f.gradient,
                        filter: previewCSS || undefined,
                      }}
                    />

                    {/* Filter ID & Category Pill */}
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 backdrop-blur-sm text-[8px] font-mono font-bold text-white/90">
                      #{f.id}
                    </div>

                    {/* Bookmark Favorite */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, f.name)}
                      className={`absolute top-1 right-1 p-0.5 rounded transition-colors ${
                        isFav ? "text-[#FFB347]" : "text-white/40 hover:text-white"
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${isFav ? "fill-[#FFB347]" : ""}`} />
                    </button>

                    {/* Active Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#FFB347] flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 text-black stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filter Name & Category */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-semibold text-white truncate group-hover:text-[#FFB347] transition-colors">
                      {f.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full mt-0.5">
                    <span className="text-[9px] text-[#808092] truncate">
                      {f.category}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-mono font-bold text-[#FFB347]">
                        {project.filterIntensity}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. LUT Library Import */}
      <div className="pt-2 border-t border-[#1C1C24] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white">3D LUTs (.cube)</span>
            <span className="text-[10px] text-[#7A7A8E]">Broadcast grading tables</span>
          </div>

          <label className="flex items-center gap-1 px-2.5 py-1 bg-[#1C1C24] hover:bg-[#252532] text-white text-[11px] font-medium rounded-xl border border-[#2E2E3C] cursor-pointer transition-colors active:scale-95">
            <Upload className="w-3 h-3 text-[#FFB347]" />
            <span>Import LUT</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".cube,.3dl"
              onChange={handleLUTImport}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LUT_PRESETS.map((lut) => (
            <button
              key={lut.id}
              onClick={() => onUpdateLUT(lut.name, 100)}
              className={`flex flex-col p-2 rounded-xl text-left border transition-all ${
                project.colorGrading.lutName === lut.name
                  ? "bg-[#FFB347]/15 border-[#FFB347] text-white"
                  : "bg-[#141419] border-[#22222E] text-[#9A9AB0] hover:text-white hover:bg-[#1A1A22]"
              }`}
            >
              <span className="text-xs font-medium truncate">{lut.name}</span>
              <span className="text-[9px] text-[#6A6A7E] truncate">{lut.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
