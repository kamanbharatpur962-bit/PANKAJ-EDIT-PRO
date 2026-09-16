import React, { useState, useRef } from "react";
import { VideoTemplate, VideoProject, Clip, AspectRatio, TransitionItem, TemplateSlot } from "../types";
import { Search, Play, ChevronLeft, Film, Clock, Sparkles, Loader2, Music, CheckCircle2, Image as ImageIcon, Plus, X, Video } from "lucide-react";
import { templates } from "../data/templates";

interface TemplatesScreenProps {
  onBack: () => void;
  onOpenProject: (project: VideoProject) => void;
}

const CATEGORIES = [
  "All", "Trending", "Cinematic", "Beat Sync", "Photo Slideshow", "Travel", "Birthday", "Festival", "Status/Reels", "Slow Motion", "Transition", "Memories"
];

// Helper to generate an ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ onBack, onOpenProject }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
  
  // Media Picker State
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [slotMedia, setSlotMedia] = useState<Record<number, { url: string, type: 'video'|'photo', file: File }>>({});
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredTemplates = activeCategory === "All" 
    ? templates 
    : templates.filter(t => t.category.includes(activeCategory) || activeCategory.includes(t.category));

  const handleUseTemplate = () => {
    // Open the media picker screen
    setSlotMedia({});
    setShowMediaPicker(true);
  };

  const handleSlotClick = (slotId: number) => {
    setActiveSlotId(slotId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeSlotId !== null) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith("video/");
      const url = URL.createObjectURL(file);
      
      setSlotMedia(prev => ({
        ...prev,
        [activeSlotId]: { url, type: isVideo ? "video" : "photo", file }
      }));
      setActiveSlotId(null);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeSlotMedia = (slotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlotMedia(prev => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  const processTemplate = async () => {
    if (!selectedTemplate) return;
    
    // Check if all slots are filled
    const allFilled = selectedTemplate.slots.every(slot => slotMedia[slot.id]);
    if (!allFilled) {
       setErrorMsg("Please fill all media slots before generating.");
       setTimeout(() => setErrorMsg(""), 3000);
       return;
    }
    
    setErrorMsg("");
    setIsProcessing(true);
    setProgress(0);

    // Simulate smart processing
    for (let i = 0; i <= 100; i += 8) {
      setProgress(Math.min(i, 100));
      await new Promise(r => setTimeout(r, 150));
    }

    // Map slots to actual clips
    const newClips: Clip[] = [];
    const transitions: TransitionItem[] = [];
    let currentTime = 0;

    selectedTemplate.slots.forEach((slot, index) => {
      const media = slotMedia[slot.id];
      const duration = slot.duration;
      
      const newClip: Clip = {
        id: `clip_${generateId()}`,
        name: media.file.name,
        type: media.type,
        url: media.url,
        duration: media.type === 'video' ? Math.max(duration, 5) : duration, // Estimate for video
        startTime: currentTime,
        trimStart: 0,
        trimEnd: duration,
        speed: 1,
        reversed: false,
        volume: 100,
        muted: false,
        fadeIn: 0,
        fadeOut: 0,
        x: 0, y: 0, scale: 1, rotation: 0, opacity: 1,
        blendMode: "normal",
        keyframes: [],
        animationId: slot.effect
      };
      
      newClips.push(newClip);

      // Add transition if specified and not the last clip
      if (slot.transition && index < selectedTemplate.slots.length - 1) {
        transitions.push({
          id: `tr_${generateId()}`,
          type: slot.transition as any,
          duration: 0.5,
          startTime: currentTime + duration - 0.25
        });
      }

      currentTime += duration;
    });

    const newProject: VideoProject = {
      id: `proj_tpl_${Date.now()}`,
      title: `${selectedTemplate.name} Project`,
      aspectRatio: selectedTemplate.aspectRatio,
      duration: currentTime,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      thumbnail: newClips[0]?.url || selectedTemplate.previewUrl,
      clips: newClips,
      audioTracks: [
         { id: "audio_tpl", name: selectedTemplate.musicTitle, url: "", startTime: 0, trimStart: 0, trimEnd: currentTime, volume: 100, fadeIn: 1, fadeOut: 2, speed: 1, muted: false }
      ],
      textTracks: selectedTemplate.projectPreset?.textTracks || [],
      lyrics: [],
      effects: selectedTemplate.projectPreset?.effects || [],
      transitions: transitions,
      activeFilter: selectedTemplate.projectPreset?.activeFilter || "none",
      filterIntensity: selectedTemplate.projectPreset?.filterIntensity || 100,
      colorGrading: { exposure: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0, sharpen: 0 },
      beatMarkers: selectedTemplate.projectPreset?.beatMarkers || []
    };

    setIsProcessing(false);
    setShowMediaPicker(false);
    setSelectedTemplate(null);
    setSlotMedia({});
    
    // Pass the generated project to the editor
    onOpenProject(newProject);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1017] text-white font-sans">
      {/* Header */}
      <header className="flex flex-col gap-4 px-5 py-4 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold tracking-tight">Templates</h1>
        </div>
        
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search templates (e.g. Velocity, Beat Sync)" 
            className="w-full bg-[#1A1D24] text-white rounded-full py-2.5 pl-11 pr-4 text-[14px] outline-none placeholder:text-white/40 border border-transparent focus:border-[#4CE5E7]/30 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? "bg-[#4CE5E7] text-[#0A0C11]" 
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map(tpl => (
            <div 
              key={tpl.id} 
              onClick={() => setSelectedTemplate(tpl)}
              className="relative aspect-[9/16] rounded-[16px] overflow-hidden group cursor-pointer border border-white/5"
            >
              <img src={tpl.previewUrl} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-[#4CE5E7] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {tpl.badge}
                </span>
                <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white flex items-center gap-1">
                   {tpl.aspectRatio}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                <h3 className="text-[14px] font-bold leading-tight drop-shadow-md line-clamp-2">{tpl.name}</h3>
                <div className="flex items-center gap-3 text-[11px] text-white/80 font-medium">
                  <span className="flex items-center gap-1"><Film className="w-3 h-3" /> {tpl.slots?.length || tpl.clipCount} clips</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tpl.duration}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTemplates.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-white/40">
              <Film className="w-12 h-12 mb-3" />
              <p>No templates found for this category.</p>
           </div>
        )}
      </main>

      {/* Hidden file input for single slot picker */}
      <input 
        type="file" 
        accept="video/*,image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {/* Template Detail Modal */}
      {selectedTemplate && !showMediaPicker && !isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="bg-[#111116] w-full sm:w-[400px] h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col shadow-2xl border border-white/10 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
             {/* Modal Header */}
             <div className="relative w-full aspect-[9/16] max-h-[45vh] shrink-0 bg-black">
                <img src={selectedTemplate.previewUrl} alt={selectedTemplate.name} className="w-full h-full object-contain" />
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                   <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-105 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                   </button>
                </div>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#4CE5E7]/20 text-[#4CE5E7] px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">{selectedTemplate.category}</span>
                      <span className="bg-white/10 text-white/80 px-2 py-0.5 rounded text-[11px] font-medium">{selectedTemplate.aspectRatio}</span>
                   </div>
                   <h2 className="text-[24px] font-bold">{selectedTemplate.name}</h2>
                   <p className="text-[13px] text-white/60 mt-2">{selectedTemplate.description}</p>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-white/5">
                   <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-white/50">Required Media</span>
                      <span className="text-[14px] font-semibold flex items-center gap-1.5"><Film className="w-4 h-4 text-[#4CE5E7]" /> {selectedTemplate.slots?.length || selectedTemplate.clipCount} Slots</span>
                   </div>
                   <div className="w-[1px] h-8 bg-white/10"></div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-white/50">Total Duration</span>
                      <span className="text-[14px] font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#4CE5E7]" /> {selectedTemplate.duration}s</span>
                   </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1A1D24] p-3 rounded-[12px]">
                   <div className="w-10 h-10 bg-[#4CE5E7]/10 rounded-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#4CE5E7]" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[13px] font-bold">{selectedTemplate.musicTitle}</span>
                      <span className="text-[11px] text-white/50">Auto beat-sync & effects included</span>
                   </div>
                </div>
             </div>

             {/* Modal Footer */}
             <div className="p-4 bg-[#0A0C11] border-t border-white/5">
                <button 
                  onClick={handleUseTemplate}
                  className="w-full py-4 bg-gradient-to-r from-[#4CE5E7] to-[#78AEFF] text-[#0A0C11] text-[16px] font-bold rounded-[16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(76,229,231,0.3)]"
                >
                  Use Template
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Template Media Selection Picker */}
      {selectedTemplate && showMediaPicker && !isProcessing && (
        <div className="fixed inset-0 z-[100] bg-[#0D1017] flex flex-col animate-in slide-in-from-right-full duration-300 font-sans">
           {/* Top Bar */}
           <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0A0C11]">
              <button 
                onClick={() => setShowMediaPicker(false)}
                className="flex items-center gap-1 text-white/70 hover:text-white"
              >
                 <ChevronLeft className="w-6 h-6" />
                 <span className="text-[15px] font-medium">Cancel</span>
              </button>
              <h2 className="text-[16px] font-bold">Select Media</h2>
              <div className="w-16"></div> {/* spacer */}
           </div>

           {/* Error Message */}
           {errorMsg && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#FF453A] text-white px-4 py-3 rounded-[12px] text-sm z-[200] shadow-xl text-center font-medium animate-in slide-in-from-top-4">
              {errorMsg}
            </div>
           )}

           {/* Media Slots Grid */}
           <div className="flex-1 overflow-y-auto p-5">
              <p className="text-white/60 text-[14px] mb-6">
                 Tap on a slot to add a photo or video. The template requires {selectedTemplate.slots.length} clips.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {selectedTemplate.slots.map((slot, index) => {
                    const media = slotMedia[slot.id];
                    return (
                       <div key={slot.id} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between px-1">
                             <span className="text-[13px] font-bold text-white/90">Slot {index + 1}</span>
                             <span className="text-[11px] text-white/50 font-mono">{slot.duration}s</span>
                          </div>
                          
                          <div 
                             onClick={() => handleSlotClick(slot.id)}
                             className={`relative aspect-[3/4] rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-colors ${
                               media ? 'border-transparent' : 'border-white/20 hover:border-[#4CE5E7]/50 bg-white/5 hover:bg-white/10'
                             }`}
                          >
                             {media ? (
                                <>
                                  <img src={media.url} alt="Selected" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <span className="text-white text-xs font-semibold">Replace</span>
                                  </div>
                                  <button 
                                    onClick={(e) => removeSlotMedia(slot.id, e)}
                                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#FF453A] transition-colors"
                                  >
                                     <X className="w-3.5 h-3.5 text-white" />
                                  </button>
                                  {/* Media Type Icon */}
                                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                                     {media.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                  </div>
                                </>
                             ) : (
                                <>
                                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                     <Plus className="w-5 h-5 text-white/60 group-hover:text-[#4CE5E7]" />
                                  </div>
                                  <span className="text-[12px] text-white/50 group-hover:text-[#4CE5E7] font-medium">Add Media</span>
                                </>
                             )}
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>

           {/* Bottom Action */}
           <div className="p-5 bg-[#0A0C11] border-t border-white/5 shrink-0">
              <button 
                 onClick={processTemplate}
                 className={`w-full py-4 text-[16px] font-bold rounded-[16px] transition-all flex items-center justify-center gap-2 ${
                   selectedTemplate.slots.every(s => slotMedia[s.id])
                     ? "bg-gradient-to-r from-[#4CE5E7] to-[#78AEFF] text-[#0A0C11] shadow-[0_0_15px_rgba(76,229,231,0.3)] hover:opacity-90 active:scale-95"
                     : "bg-white/10 text-white/40 cursor-not-allowed"
                 }`}
              >
                 Generate Video
              </button>
           </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-[#0A0C11] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300 font-sans">
           <div className="w-full max-w-sm flex flex-col items-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle 
                      cx="64" cy="64" r="60" fill="none" 
                      stroke="#4CE5E7" strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 60} 
                      strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)} 
                      className="transition-all duration-300 ease-out"
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="flex flex-col items-center">
                    <span className="text-[28px] font-bold text-white tracking-tight">{progress}%</span>
                 </div>
              </div>
              
              <div className="flex flex-col items-center gap-2 text-center">
                 <h3 className="text-[22px] font-bold text-white">Auto-Editing...</h3>
                 <p className="text-[14px] text-white/60 max-w-[250px]">
                   {progress < 25 ? "Analyzing selected media..." : 
                    progress < 50 ? "Trimming clips to beat..." : 
                    progress < 75 ? "Applying cinematic effects..." : 
                    "Finalizing transitions & colors..."}
                 </p>
              </div>

              {/* Status checklist */}
              <div className="w-full flex flex-col gap-4 mt-4 bg-white/5 p-5 rounded-[20px] border border-white/5">
                 <div className="flex items-center gap-3 text-[14px]">
                    <CheckCircle2 className={`w-5 h-5 transition-colors ${progress >= 25 ? 'text-[#4CE5E7]' : 'text-white/20'}`} />
                    <span className={progress >= 25 ? 'text-white' : 'text-white/40'}>Smart clip cropping</span>
                 </div>
                 <div className="flex items-center gap-3 text-[14px]">
                    <CheckCircle2 className={`w-5 h-5 transition-colors ${progress >= 50 ? 'text-[#4CE5E7]' : 'text-white/20'}`} />
                    <span className={progress >= 50 ? 'text-white' : 'text-white/40'}>Music beat synchronization</span>
                 </div>
                 <div className="flex items-center gap-3 text-[14px]">
                    <CheckCircle2 className={`w-5 h-5 transition-colors ${progress >= 75 ? 'text-[#4CE5E7]' : 'text-white/20'}`} />
                    <span className={progress >= 75 ? 'text-white' : 'text-white/40'}>Transitions & visual effects</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
