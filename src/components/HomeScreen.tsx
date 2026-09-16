import React, { useState, useRef } from "react";
import { AspectRatio, VideoProject, VideoTemplate } from "../types";
import { TemplatesScreen } from "./TemplatesScreen";
import { MeScreen } from "./MeScreen";
import { processVideoFile, processPhotoFile } from "../utils/media";
import { Clip } from "../types";
import { 
  Search,
  Bell,
  Settings,
  Plus,
  Zap,
  Wand2,
  UserMinus,
  Camera,
  LayoutGrid,
  MoreVertical,
  Home,
  Film,
  UserCircle,
  ChevronRight,
  MonitorPlay,
  Edit
} from "lucide-react";

interface HomeScreenProps {
  onNewProject: (aspectRatio: AspectRatio, template?: VideoTemplate) => void;
  onOpenProject: (project: VideoProject) => void;
  onQuickEdit: () => void;
  onOpenAddMediaModal?: () => void;
  onOpenNewProjectPicker?: (initialRatio?: AspectRatio) => void;
  onCreateProjectWithMedia?: (clips: Clip[], aspectRatio: AspectRatio) => void;
  onRestoreProjects?: (projects: VideoProject[]) => void;
  onOpenFeature?: (featureId: string) => void;
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
  onOpenAddMediaModal,
  onOpenNewProjectPicker,
  onCreateProjectWithMedia,
  onRestoreProjects,
  onOpenFeature,
  savedProjects,
}) => {
  const [activeTab, setActiveTab] = useState("home");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesBatch = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const newClips: Clip[] = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (file.type.startsWith("video")) {
        const clip = await processVideoFile(file);
        newClips.push(clip);
      } else if (file.type.startsWith("image") || file.name.match(/\.(jpg|jpeg|png|webp|gif|avif|bmp)$/i)) {
        const clip = await processPhotoFile(file);
        newClips.push(clip);
      }
    }

    setIsProcessing(false);
    if (newClips.length > 0 && onCreateProjectWithMedia) {
      onCreateProjectWithMedia(newClips, "9:16");
    }
  };

  
  if (activeTab === 'templates') {
    return (
      <div className="flex flex-col h-full bg-[#0D1017] text-white overflow-hidden font-sans">
        <div className="flex-1 overflow-hidden">
          <TemplatesScreen 
             onBack={() => setActiveTab('home')} 
             onOpenProject={onOpenProject} 
          />
        </div>
        {/* We need to extract the bottom navigation to reuse it, or just copy it here */}
        <nav className="absolute bottom-0 left-0 right-0 h-[75px] bg-[#0A0C11] flex items-center justify-around px-2 z-50">
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <Home className="w-[26px] h-[26px] text-[#888]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-[#888]">Home</span>
          </button>
          <button onClick={() => setActiveTab('templates')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <MonitorPlay className="w-[26px] h-[26px] text-[#4CE5E7]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-[#4CE5E7]">Templates</span>
            <div className="absolute bottom-2 w-[32px] h-[3px] bg-[#4CE5E7] rounded-full"></div>
          </button>
          <button onClick={() => setActiveTab('me')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <div className="w-[26px] h-[26px] rounded-full border-[2.2px] flex items-center justify-center border-[#888] text-[#888]">
              <div className="w-[10px] h-[10px] rounded-full border-[2.2px] border-current"></div>
            </div>
            <span className="text-[11px] font-semibold text-[#888]">Me</span>
          </button>
          <button onClick={() => setActiveTab('more')} className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative">
            <div className="w-[26px] h-[26px] flex items-center justify-center text-[#888]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="16,4 4,12 16,20"></polygon></svg>
            </div>
            <span className="text-[11px] font-semibold text-[#888]">More</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0D1017] text-white overflow-hidden font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <button className="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        <div className="flex items-center gap-5">
          <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Search className="w-[26px] h-[26px] text-white" strokeWidth={2.2} />
          </button>
          <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative">
            <Bell className="w-[26px] h-[26px] text-white" strokeWidth={2.2} />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF453A] border-2 border-[#0D1017] rounded-full"></div>
          </button>
          <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Settings className="w-[26px] h-[26px] text-white" strokeWidth={2.2} />
          </button>
        </div>
      </header>
      <input 
        type="file" 
        accept="video/*,image/*" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (e.target.files) handleFilesBatch(e.target.files);
          e.target.value = '';
        }} 
      />
      
      {/* Loading Overlay for file processing */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#4CE5E7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-white text-lg font-bold">Processing Media...</h2>
        </div>
      )}

      <main className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto no-scrollbar pb-20">
        <div className="px-5 space-y-7">
          
          {/* Hero "New project" Banner */}
          <button 
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className="w-full relative overflow-hidden rounded-[20px] aspect-[2.1/1] flex items-center p-5 transition-transform active:scale-95 shadow-[0_4px_30px_rgba(0,229,255,0.15)] ring-[1px] ring-[#00E5FF]/40 group"
          >
            {/* Background Image / Gradient matching the screenshot */}
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full h-full object-cover opacity-90 scale-105" 
                 alt="landscape"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#031535] via-[#031535]/80 to-transparent"></div>
               {/* Silhouette placeholder for the person on the right */}
               <div className="absolute right-2 bottom-0 w-[40%] h-[90%] bg-contain bg-no-repeat bg-bottom opacity-90" style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3248/3248101.png')", filter: "brightness(0) invert(0)" }}></div>
            </div>

            <div className="relative z-10 flex items-center justify-between w-full h-full">
              <div className="flex items-center gap-4">
                {/* Clapperboard Icon */}
                <div className="w-[68px] h-[68px] bg-[#4CE5E7] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(76,229,231,0.6)]">
                  <div className="relative w-full h-full flex flex-col items-center justify-center pt-2">
                    <div className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="absolute top-1.5 left-6 w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-white/50"></div>
                    <Plus className="w-9 h-9 text-[#031535]" strokeWidth={3.5} />
                  </div>
                </div>
                
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[34px] font-bold text-white tracking-tight" style={{ fontFamily: "'Caveat', 'Brush Script MT', cursive" }}>New project</span>
                  <span className="text-[13px] text-white/80 font-medium tracking-wide">Create &nbsp;•&nbsp; Edit &nbsp;•&nbsp; Share</span>
                </div>
              </div>

              {/* Arrow Button */}
              <div className="w-8 h-8 rounded-full bg-[#111116]/60 backdrop-blur-md flex items-center justify-center border border-white/20 mt-auto mb-2">
                <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Quick Tools Grid */}
          <div className="grid grid-cols-4 gap-y-6 gap-x-4">
            {/* Item 1: AutoCut */}
            <button onClick={() => onOpenFeature?.('autocut')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#293BBE] to-[#6021A5] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="w-8 h-7 border-[2.5px] border-white rounded-[6px] relative flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-white absolute -bottom-1 -right-1" strokeWidth={1} />
                  <div className="w-2 h-2 rounded-full bg-white absolute top-1.5 left-2"></div>
                </div>
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight">AutoCut</span>
            </button>
            
            {/* Item 2: Retouch */}
            <button onClick={() => onOpenFeature?.('retouch')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#A02170] to-[#51115A] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="relative">
                  <div className="w-7 h-8 border-[2.5px] border-white rounded-full flex items-end justify-center pb-1">
                     <div className="w-3 h-1.5 border-b-[2px] border-white rounded-full"></div>
                  </div>
                  <div className="absolute -top-1 -right-2">
                     <Wand2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight">Retouch</span>
            </button>

            {/* Item 3: Auto captions */}
            <button onClick={() => onOpenFeature?.('auto_captions')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#108B89] to-[#0D4459] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="relative">
                  <div className="w-9 h-7 border-[2.5px] border-white rounded-[6px] flex items-center justify-center gap-0.5">
                    <span className="text-white text-[10px] font-extrabold font-mono">C</span>
                    <span className="text-white text-[10px] font-extrabold font-mono">C</span>
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-[2px] border-white rounded-sm rotate-45"></div>
                </div>
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight text-center">Auto captions</span>
            </button>

            {/* Item 4: Remove background */}
            <button onClick={() => onOpenFeature?.('remove_background')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#A54724] to-[#521020] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="relative">
                  <UserMinus className="w-8 h-8 text-white" strokeWidth={2} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#521020]/50 mix-blend-multiply"></div>
                </div>
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight text-center">Remove<br/>background</span>
            </button>

            {/* Item 5: Enhance quality */}
            <button onClick={() => onOpenFeature?.('enhance_quality')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#137A92] to-[#0E3550] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                 <div className="w-9 h-7 border-[2.5px] border-white rounded-[6px] flex items-center justify-center relative">
                  <span className="text-white text-[11px] font-extrabold tracking-tighter">HD</span>
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-b-[4px]"></div>
                 </div>
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight text-center">Enhance<br/>quality</span>
            </button>

            {/* Item 6: Camera */}
            <button onClick={() => onOpenFeature?.('camera')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#451B92] to-[#200F51] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <Camera className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight">Camera</span>
            </button>

            {/* Item 7: Teleprompter */}
            <button onClick={() => onOpenFeature?.('teleprompter')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#BC8719] to-[#60370E] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="w-9 h-7 border-[2.5px] border-white rounded-[6px] flex flex-col items-center justify-center gap-[2px] px-1.5">
                  <div className="w-full h-[2px] bg-white rounded-full"></div>
                  <div className="w-full h-[2px] bg-white rounded-full"></div>
                  <div className="w-2/3 h-[2px] bg-white rounded-full self-start"></div>
                </div>
              </div>
              <span className="text-[12px] font-medium text-white/90 leading-tight">Teleprompter</span>
            </button>

            {/* Item 8: All tools */}
            <button onClick={() => onOpenFeature?.('all_tools')} className="flex flex-col items-center gap-2.5 group">
              <div className="w-full aspect-square bg-gradient-to-br from-[#1E3067] to-[#0A102A] rounded-[22px] flex items-center justify-center group-active:scale-95 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <LayoutGrid className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]"></div>
                <span className="text-[12px] font-medium text-white/90 leading-tight">All tools</span>
              </div>
            </button>
          </div>

          {/* Projects Section */}
          <section className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-[4px] h-[22px] bg-[#4CE5E7] rounded-full"></div>
                <h2 className="text-[22px] font-bold text-white tracking-tight">Projects</h2>
              </div>
              <button className="flex items-center gap-1.5 text-[#4CE5E7] hover:text-[#78FFFF] transition-colors group px-2 py-1">
                <span className="text-[13px] font-medium">Manage</span>
                <Edit className="w-[14px] h-[14px]" strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="space-y-4">
              {savedProjects.length > 0 ? (
                savedProjects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => onOpenProject(proj)}
                    className="flex items-start gap-4 bg-transparent rounded-[16px] hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-[88px] h-[88px] bg-[#1A1D24] rounded-[18px] flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/5 relative">
                      {proj.thumbnail ? (
                        <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-7 h-7 text-white/20" />
                      )}
                      {/* Subtitle duration badge could go here */}
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-bold text-white truncate text-[16px] mb-1.5">
                        {proj.title || "Untitled Project"}
                      </h3>
                      <div className="text-[13px] text-white/60 font-medium mb-1">
                        {new Date(proj.updatedAt || Date.now()).toLocaleDateString('en-GB')} {new Date(proj.updatedAt || Date.now()).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="text-[13px] text-white/60 font-medium">
                        {Math.round(proj.duration * 1.5)}MB &nbsp;&nbsp;|&nbsp;&nbsp; {Math.floor(proj.duration / 60).toString().padStart(2, '0')}:{(Math.floor(proj.duration) % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <button className="p-1 mt-1 text-white/50 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-4 bg-transparent rounded-[16px] hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-[88px] h-[88px] bg-[#1A1D24] rounded-[18px] flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/5">
                        <img src="https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-bold text-white truncate text-[16px] mb-1.5">20260914-01</h3>
                      <div className="text-[13px] text-white/60 font-medium mb-1">14/09/2026 16:59</div>
                      <div className="text-[13px] text-white/60 font-medium">19MB &nbsp;&nbsp;|&nbsp;&nbsp; 00:25</div>
                    </div>
                    <button className="p-1 mt-1 text-white/50 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 h-[75px] bg-[#0A0C11] flex items-center justify-around px-2 z-50">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative"
        >
          <Home className={`w-[26px] h-[26px] ${activeTab === 'home' ? 'text-[#4CE5E7]' : 'text-[#888]'}`} strokeWidth={2.2} />
          <span className={`text-[11px] font-semibold ${activeTab === 'home' ? 'text-[#4CE5E7]' : 'text-[#888]'}`}>Home</span>
          {activeTab === 'home' && (
            <div className="absolute bottom-2 w-[32px] h-[3px] bg-[#4CE5E7] rounded-full"></div>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('templates')}
          className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative"
        >
          <MonitorPlay className={`w-[26px] h-[26px] ${activeTab === 'templates' ? 'text-[#4CE5E7]' : 'text-[#888]'}`} strokeWidth={2.2} />
          <span className={`text-[11px] font-semibold ${activeTab === 'templates' ? 'text-[#4CE5E7]' : 'text-[#888]'}`}>Templates</span>
        </button>

        <button 
          onClick={() => setActiveTab('me')}
          className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative"
        >
          <div className={`w-[26px] h-[26px] rounded-full border-[2.2px] flex items-center justify-center ${activeTab === 'me' ? 'border-[#4CE5E7] text-[#4CE5E7]' : 'border-[#888] text-[#888]'}`}>
            <div className="w-[10px] h-[10px] rounded-full border-[2.2px] border-current"></div>
          </div>
          <span className={`text-[11px] font-semibold ${activeTab === 'me' ? 'text-[#4CE5E7]' : 'text-[#888]'}`}>Me</span>
        </button>

        <button 
          onClick={() => setActiveTab('more')}
          className="flex flex-col items-center justify-center gap-1.5 w-16 h-full relative"
        >
          <div className={`w-[26px] h-[26px] flex items-center justify-center ${activeTab === 'more' ? 'text-[#4CE5E7]' : 'text-[#888]'}`}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <polygon points="16,4 4,12 16,20"></polygon>
             </svg>
          </div>
          <span className={`text-[11px] font-semibold ${activeTab === 'more' ? 'text-[#4CE5E7]' : 'text-[#888]'}`}>More</span>
        </button>
      </nav>
    </div>
  );
};
