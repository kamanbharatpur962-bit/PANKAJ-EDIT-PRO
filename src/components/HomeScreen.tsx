import React from "react";
import { AspectRatio, VideoProject, VideoTemplate } from "../types";
import { 
  User,
  Search,
  Bell,
  Settings,
  Plus,
  Scissors,
  Wand2,
  Subtitles,
  UserMinus,
  MonitorUp,
  Camera,
  Monitor,
  LayoutGrid,
  ListFilter,
  Film
} from "lucide-react";

interface HomeScreenProps {
  onNewProject: (aspectRatio: AspectRatio, template?: VideoTemplate) => void;
  onOpenProject: (project: VideoProject) => void;
  onQuickEdit: () => void;
  onOpenSmartCutDirectly: () => void;
  onOpenAddMediaModal?: () => void;
  onOpenNewProjectPicker?: (initialRatio?: AspectRatio) => void;
  currentProject: VideoProject;
  savedProjects: VideoProject[];
  drafts: VideoProject[];
  exportedVideos: {
    id: string;
    title: string;
    url: string;
    date: string;
    resolution: string;
    duration: number;
    size: string;
  }[];
  onDeleteProject?: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNewProject,
  onOpenProject,
  onQuickEdit,
  onOpenSmartCutDirectly,
  onOpenAddMediaModal,
  onOpenNewProjectPicker,
  currentProject,
  savedProjects,
}) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E8F8F9] to-[#FFFFFF] text-black overflow-y-auto select-none font-sans relative">
      {/* Top Header */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-10">
        <button className="flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-colors">
          <User className="w-[26px] h-[26px] text-[#111111]" strokeWidth={2.2} />
        </button>
        <div className="flex items-center gap-5">
          <button className="flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-colors">
            <Search className="w-[26px] h-[26px] text-[#111111]" strokeWidth={2.2} />
          </button>
          <button className="flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-colors">
            <Bell className="w-[26px] h-[26px] text-[#111111]" strokeWidth={2.2} />
          </button>
          <button className="flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-colors">
            <Settings className="w-[26px] h-[26px] text-[#111111]" strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-5 pb-8 space-y-7">
        
        {/* Hero "New project" Banner */}
        <button 
          onClick={() => {
            if (onOpenNewProjectPicker) onOpenNewProjectPicker("9:16");
            else if (onOpenAddMediaModal) onOpenAddMediaModal();
            else onNewProject("9:16");
          }}
          className="w-full relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4CE5E7] via-[#65CAFC] to-[#78AEFF] aspect-[2.4/1] max-h-[160px] flex items-center justify-center gap-3.5 transition-transform active:scale-95 shadow-sm"
        >
          <div className="w-[30px] h-[30px] bg-[#111111] rounded-[8px] flex items-center justify-center">
            <Plus className="w-[22px] h-[22px] text-white" strokeWidth={3} />
          </div>
          <span className="text-[22px] font-bold text-[#111111] tracking-tight">New project</span>
        </button>

        {/* Quick Tools Grid */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-3">
          {/* Item 1: AutoCut */}
          <button onClick={onQuickEdit} className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <Scissors className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight">AutoCut</span>
          </button>
          
          {/* Item 2: Retouch */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <Wand2 className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight">Retouch</span>
          </button>

          {/* Item 3: Auto captions */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <Subtitles className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight">Auto captions</span>
          </button>

          {/* Item 4: Remove background */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <UserMinus className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight text-center">Remove<br/>background</span>
          </button>

          {/* Item 5: Enhance quality */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <MonitorUp className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight text-center">Enhance<br/>quality</span>
          </button>

          {/* Item 6: Camera */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <Camera className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight">Camera</span>
          </button>

          {/* Item 7: Teleprompter */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform">
              <Monitor className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-medium text-[#111111] leading-tight">Teleprompter</span>
          </button>

          {/* Item 8: All tools */}
          <button className="flex flex-col items-center gap-2.5 group">
            <div className="w-full aspect-square max-w-[80px] bg-[#F4F4F6] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform relative">
              <LayoutGrid className="w-7 h-7 text-[#111111]" strokeWidth={1.8} />
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF453A]"></div>
              <span className="text-[12px] font-medium text-[#111111] leading-tight">All tools</span>
            </div>
          </button>
        </div>

        {/* Projects Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-[#111111] tracking-tight">Projects</h2>
            <button className="flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-colors">
              <ListFilter className="w-6 h-6 text-[#111111]" strokeWidth={2.2} />
            </button>
          </div>
          
          <div className="space-y-4">
            {savedProjects.length > 0 ? (
              savedProjects.map((proj) => (
                <div 
                  key={proj.id} 
                  onClick={() => onOpenProject(proj)}
                  className="flex items-center gap-4 bg-transparent rounded-[16px] hover:bg-black/5 transition-colors cursor-pointer p-1 -mx-1"
                >
                  <div className="w-[72px] h-[72px] bg-[#EAEAEA] rounded-[16px] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                    {proj.thumbnail ? (
                      <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="w-6 h-6 text-black/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#111111] truncate text-[15px] mb-0.5">{proj.title || "Untitled Project"}</h3>
                    <p className="text-[13px] text-[#888888]">{proj.duration.toFixed(1)}s • {proj.clips.length} clips</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[13px] text-[#888888] py-10 bg-[#F4F4F6] rounded-[24px]">
                No projects yet. Tap "New project" to begin.
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};
