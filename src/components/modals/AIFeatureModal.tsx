import React, { useState, useEffect } from "react";
import { 
  X, 
  Wand2, 
  Subtitles, 
  UserMinus, 
  MonitorUp, 
  Camera, 
  Monitor, 
  LayoutGrid, 
  Sparkles,
  ChevronRight,
  UploadCloud
} from "lucide-react";

interface AIFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: string;
}

export const AIFeatureModal: React.FC<AIFeatureModalProps> = ({
  isOpen,
  onClose,
  featureId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [isOpen]);

  // Simulate processing
  useEffect(() => {
    let interval: number;
    if (isProcessing && progress < 100) {
      interval = window.setInterval(() => {
        setProgress(p => Math.min(100, p + Math.random() * 15));
      }, 500);
    } else if (progress >= 100) {
      setTimeout(() => {
        setIsProcessing(false);
        // We could auto-close here or show a success state
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing, progress]);

  if (!isOpen) return null;

  const featureDetails = {
    autocut: {
      title: "AutoCut",
      desc: "Automatically remove silence, bad takes, and filler words using intelligent video analysis.",
      icon: <Sparkles className="w-8 h-8 text-[#00E5FF]" />,
      action: "Select video to AutoCut"
    },
    retouch: {
      title: "AI Retouch",
      desc: "Smooth skin, whiten teeth, and enhance facial features automatically using advanced AI.",
      icon: <Wand2 className="w-8 h-8 text-[#FFB347]" />,
      action: "Select video to retouch"
    },
    auto_captions: {
      title: "Auto Captions",
      desc: "Generate highly accurate subtitles in 50+ languages with perfectly synced cinematic text animations.",
      icon: <Subtitles className="w-8 h-8 text-[#00E5FF]" />,
      action: "Upload video for captions"
    },
    remove_background: {
      title: "Remove Background",
      desc: "Instantly rotoscope subjects and replace or remove backgrounds without a green screen.",
      icon: <UserMinus className="w-8 h-8 text-[#FF453A]" />,
      action: "Select video to isolate"
    },
    enhance_quality: {
      title: "Enhance Quality",
      desc: "Upscale resolution, remove noise, and sharpen details for 4K professional output.",
      icon: <MonitorUp className="w-8 h-8 text-[#32D74B]" />,
      action: "Choose low-res video"
    },
    camera: {
      title: "Pro Camera",
      desc: "Record directly into the studio with manual controls, LUT previews, and cinematic stabilization.",
      icon: <Camera className="w-8 h-8 text-[#BF5AF2]" />,
      action: "Open camera view"
    },
    animations: {
      title: "Pro Animations",
      desc: "Access 200+ advanced 3D transitions, cinematic camera movements, and keyframe-driven visual effects.",
      icon: <Sparkles className="w-8 h-8 text-[#FF9F0A]" />,
      action: "Open Animations Library"
    },
    teleprompter: {
      title: "AI Teleprompter",
      desc: "Record flawlessly while reading your script. The AI automatically scrolls at your speaking pace.",
      icon: <Monitor className="w-8 h-8 text-[#FF9F0A]" />,
      action: "Create new script"
    },
    all_tools: {
      title: "All AI Tools",
      desc: "Access the complete suite of advanced AI models including voice cloning, auto-reframing, and more.",
      icon: <LayoutGrid className="w-8 h-8 text-[#5E5CE6]" />,
      action: "Explore all tools"
    }
  };

  const details = featureDetails[featureId as keyof typeof featureDetails] || {
    title: "AI Feature",
    desc: "Experience the power of advanced video processing models.",
    icon: <Sparkles className="w-8 h-8 text-[#FFB347]" />,
    action: "Try it out"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121218] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            {details.icon}
            <h2 className="text-lg font-bold text-white">{details.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-[#1C1C24] flex items-center justify-center mb-6 shadow-inner border border-white/5 relative overflow-hidden">
             {/* Glow effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFB347]/10 to-transparent animate-pulse" />
             {details.icon}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{details.title} Pro</h3>
          <p className="text-sm text-[#888892] mb-8 leading-relaxed max-w-[280px]">
            {details.desc}
          </p>

          {isProcessing ? (
            <div className="w-full space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#00E5FF] animate-pulse">Processing media...</span>
                <span className="text-white">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-[#1C1C24] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#007AFF] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsProcessing(true)}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-[#E0E0E0] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-5 h-5" />
              <span>{details.action}</span>
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#0A0A0F] border-t border-white/5 flex items-center justify-between text-xs text-[#888892]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Studio Premium
          </span>
          <button className="flex items-center hover:text-white transition-colors">
            Learn more <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
