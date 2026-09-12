import React, { useState } from "react";
import { TemplateCategory, TemplateItem } from "../../types";
import { VIDEO_TEMPLATES } from "../../data/sampleMedia";
import { LayoutTemplate, Play, Sparkles, Smartphone, Monitor } from "lucide-react";

interface TemplatesPanelProps {
  onApplyTemplate: (template: TemplateItem) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onApplyTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");

  const categories: { id: TemplateCategory | "all"; label: string }[] = [
    { id: "all", label: "All Templates" },
    { id: "reels", label: "Reels / Shorts" },
    { id: "cinematic", label: "Cinematic" },
    { id: "beat_sync", label: "Beat-Sync" },
    { id: "travel", label: "Travel Vlog" },
    { id: "wedding", label: "Wedding" },
    { id: "birthday", label: "Birthday" },
    { id: "motivational", label: "Motivational" },
    { id: "status", label: "Status" },
  ];

  const filteredTemplates =
    activeCategory === "all"
      ? VIDEO_TEMPLATES
      : VIDEO_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E0E0E0] select-none overflow-y-auto p-3 space-y-3">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-[#1A1A1A] overflow-x-auto no-scrollbar shrink-0">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 shadow-sm"
                : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group relative rounded-xl overflow-hidden bg-[#161618] border border-[#222] hover:border-[#FFB347]/50 transition-all flex flex-col justify-between shadow-md"
          >
            {/* Thumbnail banner with gradient overlay */}
            <div className="relative h-28 w-full overflow-hidden bg-[#050505] flex items-center justify-center">
              <img
                src={tmpl.previewUrl}
                alt={tmpl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161618] via-[#161618]/40 to-transparent" />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0A0A0A]/80 text-[#FFB347] backdrop-blur-sm border border-[#FFB347]/30">
                  {tmpl.category.replace("_", " ")}
                </span>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#0A0A0A]/80 text-[#888]">
                  {tmpl.aspectRatio}
                </span>
              </div>

              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#888] bg-[#0A0A0A]/90 px-1.5 py-0.5 rounded">
                {tmpl.duration}s
              </div>
            </div>

            {/* Template Info & Action */}
            <div className="p-3 flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold text-[#E0E0E0] group-hover:text-[#FFB347] transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-[10px] text-[#888] mt-0.5 line-clamp-1">
                  {tmpl.description}
                </p>
              </div>

              <button
                id={`btn-apply-template-${tmpl.id}`}
                onClick={() => onApplyTemplate(tmpl)}
                className="px-3 py-1.5 rounded-lg bg-[#FFB347] text-[#0A0A0A] font-semibold text-xs hover:bg-[#FFA327] active:scale-95 transition-all shadow-sm shrink-0"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
