import React, { useRef, useState, useCallback, useEffect } from "react";
import { Clip, AspectRatio } from "../../types";
import { SAMPLE_MEDIA_CLIPS } from "../../data/sampleMedia";
import { 
  X, 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Plus, 
  Smartphone, 
  Cloud, 
  Sliders, 
  Check, 
  Trash2, 
  Sparkles, 
  Link2, 
  Play, 
  Layers, 
  Info,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Monitor,
  Square
} from "lucide-react";

export interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClip: (clip: Clip) => void;
  onAddClips?: (clips: Clip[], replaceExisting?: boolean) => void;
  isNewProjectMode?: boolean;
  initialAspectRatio?: AspectRatio;
  onCreateProjectWithMedia?: (clips: Clip[], aspectRatio: AspectRatio) => void;
  onStartBlankProject?: (aspectRatio: AspectRatio) => void;
}

export interface GalleryMediaItem {
  id: string;
  name: string;
  type: "video" | "photo";
  url: string;
  thumbnail: string;
  duration: number;
  category: string;
}

// Curated Photos & Videos displayed on screen for immediate selection
export const CURATED_GALLERY_MEDIA: GalleryMediaItem[] = [
  // Videos
  {
    id: "gal-vid-1",
    name: "Cyberpunk City Nights",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80",
    duration: 6.5,
    category: "Urban / Drone",
  },
  {
    id: "gal-vid-2",
    name: "Golden Hour Coast",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    duration: 7.2,
    category: "Ocean / Travel",
  },
  {
    id: "gal-vid-3",
    name: "Alpine Mountain Drone",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41551-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    duration: 8.0,
    category: "Nature / 4K",
  },
  {
    id: "gal-vid-4",
    name: "Neon Street Motion",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-an-acoustic-guitar-42352-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    duration: 5.8,
    category: "Cinematic",
  },
  {
    id: "gal-vid-5",
    name: "Aesthetic Coffee Macro",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-into-a-grinder-41484-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    duration: 6.0,
    category: "Lifestyle",
  },
  {
    id: "gal-vid-6",
    name: "Sunset Wedding Walk",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
    duration: 7.5,
    category: "Wedding",
  },
  {
    id: "gal-vid-7",
    name: "Tokyo Night Expressway",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41551-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=600&auto=format&fit=crop&q=80",
    duration: 6.0,
    category: "City / Night",
  },
  {
    id: "gal-vid-8",
    name: "Tropical Waves Serenity",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    duration: 7.0,
    category: "Ocean",
  },
  {
    id: "gal-vid-9",
    name: "Sunset Road Trip Journey",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80",
    duration: 6.2,
    category: "Travel",
  },

  // Photos
  {
    id: "gal-pho-1",
    name: "Golden Hour Mountain",
    type: "photo",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Landscape / 4K",
  },
  {
    id: "gal-pho-2",
    name: "Cyberpunk Tokyo Street",
    type: "photo",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Urban / Neon",
  },
  {
    id: "gal-pho-3",
    name: "Cinematic Portrait Studio",
    type: "photo",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Portrait / Studio",
  },
  {
    id: "gal-pho-4",
    name: "Sunset Ocean Waves",
    type: "photo",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Beach / Sunset",
  },
  {
    id: "gal-pho-5",
    name: "Vintage Aesthetic Roadster",
    type: "photo",
    url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Vintage / Auto",
  },
  {
    id: "gal-pho-6",
    name: "Minimalist Coffee Journal",
    type: "photo",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Lifestyle / Cozy",
  },
  {
    id: "gal-pho-7",
    name: "Neon Cyber Silhouette",
    type: "photo",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Aesthetic / Glow",
  },
  {
    id: "gal-pho-8",
    name: "Alpine Emerald Lake",
    type: "photo",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Mountain / Lake",
  },
  {
    id: "gal-pho-9",
    name: "Golden Autumn Forest",
    type: "photo",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=70",
    duration: 4.0,
    category: "Nature / Foliage",
  },
];

// Preset Cloud Google Photos Sample Media for quick testing
const GOOGLE_PHOTOS_SAMPLE_MEDIA = [
  {
    id: "gphoto-1",
    name: "Golden Hour Mountain",
    type: "photo" as const,
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=60",
    duration: 4,
    category: "Nature",
  },
  {
    id: "gphoto-2",
    name: "Cyberpunk Tokyo Street",
    type: "photo" as const,
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=60",
    duration: 4,
    category: "Urban",
  },
  {
    id: "gphoto-3",
    name: "Cinematic Portrait Studio",
    type: "photo" as const,
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=60",
    duration: 4,
    category: "Portrait",
  },
  {
    id: "gphoto-4",
    name: "Sunset Ocean Waves",
    type: "photo" as const,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=60",
    duration: 4,
    category: "Sunset",
  },
];

const RATIO_OPTIONS: { ratio: AspectRatio; label: string; icon: React.ReactNode; desc: string }[] = [
  { ratio: "9:16", label: "9:16", icon: <Smartphone className="w-3.5 h-3.5" />, desc: "Reels / Shorts" },
  { ratio: "16:9", label: "16:9", icon: <Monitor className="w-3.5 h-3.5" />, desc: "YouTube 16:9" },
  { ratio: "1:1", label: "1:1", icon: <Square className="w-3.5 h-3.5" />, desc: "Square Post" },
  { ratio: "4:5", label: "4:5", icon: <Smartphone className="w-3.5 h-3.5" />, desc: "Feed Portrait" },
  { ratio: "21:9", label: "21:9", icon: <Film className="w-3.5 h-3.5" />, desc: "Cinematic" },
];

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  isOpen,
  onClose,
  onAddClip,
  onAddClips,
  isNewProjectMode = false,
  initialAspectRatio = "9:16",
  onCreateProjectWithMedia,
  onStartBlankProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"gallery" | "gphotos" | "stock" | "settings">("gallery");
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(initialAspectRatio);

  // Media staging list
  const [stagedClips, setStagedClips] = useState<Clip[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  // Gallery media filter
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "video" | "photo">("all");

  // Settings state
  const [defaultPhotoDuration, setDefaultPhotoDuration] = useState<number>(4.0);
  const [autoKenBurns, setAutoKenBurns] = useState<boolean>(true);
  const [importPlacement, setImportPlacement] = useState<"append" | "replace">("append");

  // Google Photos / URL input state
  const [cloudUrl, setCloudUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // Drag-and-drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Helper to convert preset item to full Clip
  const createClipFromGalleryItem = useCallback((item: GalleryMediaItem): Clip => {
    return {
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: item.name,
      url: item.url,
      thumbnail: item.thumbnail,
      type: item.type,
      duration: item.duration,
      startTime: 0,
      trimStart: 0,
      trimEnd: item.duration,
      speed: 1.0,
      reversed: false,
      volume: 100,
      muted: item.type === "photo",
      fadeIn: item.type === "photo" ? 0.3 : 0,
      fadeOut: item.type === "photo" ? 0.3 : 0,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      blurAmount: 0,
      blurType: "gaussian",
      blendMode: "normal",
      maskShape: "none",
      maskInvert: false,
      keyframes:
        item.type === "photo" && autoKenBurns
          ? [
              { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
              { time: item.duration, x: 8, y: -4, scale: 1.08, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
            ]
          : [],
      chromaKeyEnabled: false,
      chromaColor: "#00ff00",
      chromaTolerance: 40,
      chromaSoftness: 10,
      stabilized: false,
      motionTracking: false,
    };
  }, [autoKenBurns]);

  // When opening in New Project mode, automatically pre-select 1 video and 1 photo so screen par photo aur video turant aati hain!
  useEffect(() => {
    if (isOpen && isNewProjectMode && stagedClips.length === 0) {
      const v = CURATED_GALLERY_MEDIA.find((m) => m.type === "video");
      const p = CURATED_GALLERY_MEDIA.find((m) => m.type === "photo");
      const initial: Clip[] = [];
      if (v) initial.push(createClipFromGalleryItem(v));
      if (p) initial.push(createClipFromGalleryItem(p));
      if (initial.length > 0) {
        setStagedClips(initial);
      }
    }
  }, [isOpen, isNewProjectMode, createClipFromGalleryItem]);

  // Check if item is currently staged
  const isItemStaged = (item: { url: string; name: string }) => {
    return stagedClips.some((c) => c.url === item.url || c.name === item.name);
  };

  // Get order index in staging tray
  const getStagedIndex = (item: { url: string; name: string }) => {
    const idx = stagedClips.findIndex((c) => c.url === item.url || c.name === item.name);
    return idx >= 0 ? idx + 1 : null;
  };

  // Toggle selection of media item
  const handleToggleGalleryItem = (item: GalleryMediaItem) => {
    const existingIndex = stagedClips.findIndex((c) => c.url === item.url || c.name === item.name);
    if (existingIndex >= 0) {
      setStagedClips((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      setStagedClips((prev) => [...prev, createClipFromGalleryItem(item)]);
    }
  };

  // Quick 1-tap demo pack (1 video + 1 photo)
  const handleQuickSelectDemo = () => {
    const v = CURATED_GALLERY_MEDIA.find((m) => m.type === "video");
    const p = CURATED_GALLERY_MEDIA.find((m) => m.type === "photo");
    const demoClips: Clip[] = [];
    if (v) demoClips.push(createClipFromGalleryItem(v));
    if (p) demoClips.push(createClipFromGalleryItem(p));
    setStagedClips(demoClips);
  };

  // Move clip left/right in staging tray
  const handleMoveClip = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index > 0) {
      setStagedClips((prev) => {
        const copy = [...prev];
        const tmp = copy[index - 1];
        copy[index - 1] = copy[index];
        copy[index] = tmp;
        return copy;
      });
    } else if (direction === "right" && index < stagedClips.length - 1) {
      setStagedClips((prev) => {
        const copy = [...prev];
        const tmp = copy[index + 1];
        copy[index + 1] = copy[index];
        copy[index] = tmp;
        return copy;
      });
    }
  };

  if (!isOpen) return null;

  // Helper to read true video metadata and capture thumbnail frame
  const processVideoFile = (file: File): Promise<Clip> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const finishWithFallback = (dur: number) => {
        resolve({
          id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          url,
          thumbnail: "",
          type: "video",
          duration: dur,
          startTime: 0,
          trimStart: 0,
          trimEnd: dur,
          speed: 1.0,
          reversed: false,
          volume: 100,
          muted: false,
          fadeIn: 0,
          fadeOut: 0,
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          blurAmount: 0,
          blurType: "gaussian",
          blendMode: "normal",
          maskShape: "none",
          maskInvert: false,
          keyframes: [],
          chromaKeyEnabled: false,
          chromaColor: "#00ff00",
          chromaTolerance: 40,
          chromaSoftness: 10,
          stabilized: false,
          motionTracking: false,
        });
      };

      video.onloadedmetadata = () => {
        const rawDuration = video.duration;
        const dur = isFinite(rawDuration) && rawDuration > 0 ? parseFloat(rawDuration.toFixed(2)) : 10;
        
        // Seek to capture a nice thumbnail
        video.currentTime = Math.min(1.0, dur * 0.2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 320;
          canvas.height = 180;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, 320, 180);
            const thumbUrl = canvas.toDataURL("image/jpeg", 0.7);
            const rawDuration = video.duration;
            const dur = isFinite(rawDuration) && rawDuration > 0 ? parseFloat(rawDuration.toFixed(2)) : 10;
            
            resolve({
              id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: file.name.replace(/\.[^/.]+$/, ""),
              url,
              thumbnail: thumbUrl,
              type: "video",
              duration: dur,
              startTime: 0,
              trimStart: 0,
              trimEnd: dur,
              speed: 1.0,
              reversed: false,
              volume: 100,
              muted: false,
              fadeIn: 0,
              fadeOut: 0,
              x: 0,
              y: 0,
              scale: 1.0,
              rotation: 0,
              opacity: 1.0,
              blurAmount: 0,
              blurType: "gaussian",
              blendMode: "normal",
              maskShape: "none",
              maskInvert: false,
              keyframes: [],
              chromaKeyEnabled: false,
              chromaColor: "#00ff00",
              chromaTolerance: 40,
              chromaSoftness: 10,
              stabilized: false,
              motionTracking: false,
            });
            return;
          }
        } catch {
          // Fallback if canvas capture fails
        }
        finishWithFallback(isFinite(video.duration) && video.duration > 0 ? video.duration : 10);
      };

      video.onerror = () => {
        finishWithFallback(10);
      };

      // Timeout safety fallback
      setTimeout(() => {
        finishWithFallback(10);
      }, 2500);
    });
  };

  // Helper to process photo file
  const processPhotoFile = (file: File): Promise<Clip> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        // Optional subtle Ken Burns keyframes
        const keyframes = autoKenBurns
          ? [
              { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" as const },
              { time: defaultPhotoDuration, x: 8, y: -6, scale: 1.08, rotation: 0, opacity: 1.0, easing: "ease-in-out" as const },
            ]
          : [];

        resolve({
          id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          url,
          thumbnail: url,
          type: "photo",
          duration: defaultPhotoDuration,
          startTime: 0,
          trimStart: 0,
          trimEnd: defaultPhotoDuration,
          speed: 1.0,
          reversed: false,
          volume: 100,
          muted: true,
          fadeIn: 0,
          fadeOut: 0,
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          blurAmount: 0,
          blurType: "gaussian",
          blendMode: "normal",
          maskShape: "none",
          maskInvert: false,
          keyframes,
          chromaKeyEnabled: false,
          chromaColor: "#00ff00",
          chromaTolerance: 40,
          chromaSoftness: 10,
          stabilized: false,
          motionTracking: false,
        });
      };

      img.onerror = () => {
        resolve({
          id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          url,
          thumbnail: url,
          type: "photo",
          duration: defaultPhotoDuration,
          startTime: 0,
          trimStart: 0,
          trimEnd: defaultPhotoDuration,
          speed: 1.0,
          reversed: false,
          volume: 100,
          muted: true,
          fadeIn: 0,
          fadeOut: 0,
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          blurAmount: 0,
          blurType: "gaussian",
          blendMode: "normal",
          maskShape: "none",
          maskInvert: false,
          keyframes: [],
          chromaKeyEnabled: false,
          chromaColor: "#00ff00",
          chromaTolerance: 40,
          chromaSoftness: 10,
          stabilized: false,
          motionTracking: false,
        });
      };
    });
  };

  // Handle files batch from input or drag-and-drop
  const handleFilesBatch = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setProcessingStatus(`Analyzing ${files.length} file(s) from Gallery...`);

    const newClips: Clip[] = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setProcessingStatus(`Processing ${i + 1}/${fileArray.length}: ${file.name}...`);
      if (file.type.startsWith("video")) {
        const clip = await processVideoFile(file);
        newClips.push(clip);
      } else if (file.type.startsWith("image") || file.name.match(/\.(jpg|jpeg|png|webp|gif|avif|bmp)$/i)) {
        const clip = await processPhotoFile(file);
        newClips.push(clip);
      }
    }

    setIsProcessing(false);
    setProcessingStatus("");

    if (newClips.length > 0) {
      setStagedClips((prev) => [...prev, ...newClips]);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesBatch(e.dataTransfer.files);
    }
  };

  // Remove a staged clip
  const handleRemoveStagedClip = (id: string) => {
    setStagedClips((prev) => prev.filter((c) => c.id !== id));
  };

  // Import via Google Photos or Web Image/Video URL
  const handleImportCloudUrl = () => {
    setUrlError("");
    if (!cloudUrl.trim()) {
      setUrlError("Please enter a valid Google Photos, Drive or image/video link");
      return;
    }

    const trimmed = cloudUrl.trim();
    setIsFetchingUrl(true);

    // Detect if image or video
    const isVideo = trimmed.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i);
    const clipName = "Cloud Media " + (stagedClips.length + 1);

    if (isVideo) {
      const video = document.createElement("video");
      video.src = trimmed;
      video.preload = "metadata";
      video.muted = true;
      video.onloadedmetadata = () => {
        setIsFetchingUrl(false);
        const dur = isFinite(video.duration) && video.duration > 0 ? parseFloat(video.duration.toFixed(2)) : 10;
        const newClip: Clip = {
          id: `clip-cloud-${Date.now()}`,
          name: clipName,
          url: trimmed,
          thumbnail: trimmed,
          type: "video",
          duration: dur,
          startTime: 0,
          trimStart: 0,
          trimEnd: dur,
          speed: 1.0,
          reversed: false,
          volume: 100,
          muted: false,
          fadeIn: 0,
          fadeOut: 0,
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          blurAmount: 0,
          blurType: "gaussian",
          blendMode: "normal",
          maskShape: "none",
          maskInvert: false,
          keyframes: [],
          chromaKeyEnabled: false,
          chromaColor: "#00ff00",
          chromaTolerance: 40,
          chromaSoftness: 10,
          stabilized: false,
          motionTracking: false,
        };
        setStagedClips((prev) => [...prev, newClip]);
        setCloudUrl("");
      };
      video.onerror = () => {
        setIsFetchingUrl(false);
        setUrlError("Could not load video from link. Please check if link is public and accessible.");
      };
    } else {
      // Treat as image/photo
      const img = new Image();
      img.src = trimmed;
      img.onload = () => {
        setIsFetchingUrl(false);
        const newClip: Clip = {
          id: `clip-cloud-${Date.now()}`,
          name: clipName,
          url: trimmed,
          thumbnail: trimmed,
          type: "photo",
          duration: defaultPhotoDuration,
          startTime: 0,
          trimStart: 0,
          trimEnd: defaultPhotoDuration,
          speed: 1.0,
          reversed: false,
          volume: 100,
          muted: true,
          fadeIn: 0,
          fadeOut: 0,
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          blurAmount: 0,
          blurType: "gaussian",
          blendMode: "normal",
          maskShape: "none",
          maskInvert: false,
          keyframes: autoKenBurns
            ? [
                { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
                { time: defaultPhotoDuration, x: 6, y: -4, scale: 1.06, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
              ]
            : [],
          chromaKeyEnabled: false,
          chromaColor: "#00ff00",
          chromaTolerance: 40,
          chromaSoftness: 10,
          stabilized: false,
          motionTracking: false,
        };
        setStagedClips((prev) => [...prev, newClip]);
        setCloudUrl("");
      };
      img.onerror = () => {
        setIsFetchingUrl(false);
        setUrlError("Could not preview photo link. Verify it is a direct image URL or public Google Photos link.");
      };
    }
  };

  // Select a preset Google Photos / Sample clip
  const handleSelectPreset = (item: {
    name: string;
    url: string;
    thumbnail: string;
    type: "video" | "photo";
    duration: number;
  }) => {
    const newClip: Clip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: item.name,
      url: item.url,
      thumbnail: item.thumbnail,
      type: item.type,
      duration: item.duration,
      startTime: 0,
      trimStart: 0,
      trimEnd: item.duration,
      speed: 1.0,
      reversed: false,
      volume: 100,
      muted: item.type === "photo",
      fadeIn: 0,
      fadeOut: 0,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      blurAmount: 0,
      blurType: "gaussian",
      blendMode: "normal",
      maskShape: "none",
      maskInvert: false,
      keyframes: item.type === "photo" && autoKenBurns
        ? [
            { time: 0, x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
            { time: item.duration, x: 10, y: -5, scale: 1.1, rotation: 0, opacity: 1.0, easing: "ease-in-out" },
          ]
        : [],
      chromaKeyEnabled: false,
      chromaColor: "#00ff00",
      chromaTolerance: 40,
      chromaSoftness: 10,
      stabilized: false,
      motionTracking: false,
    };
    setStagedClips((prev) => [...prev, newClip]);
  };

  // Final commit: Add all staged clips into the project
  const handleCommitStagedClips = (replaceMode: boolean = false) => {
    if (stagedClips.length === 0) return;

    if (onAddClips) {
      onAddClips(stagedClips, replaceMode);
    } else {
      stagedClips.forEach((c) => onAddClip(c));
    }
    setStagedClips([]);
    onClose();
  };

  const totalStagedDuration = stagedClips.reduce((acc, c) => acc + (c.trimEnd - c.trimStart) / c.speed, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="bg-[#0D0D12] border border-[#262632] rounded-2xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1E1E28] flex items-center justify-between bg-[#12121A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFB347] to-[#FF8C00] flex items-center justify-center text-black font-bold shadow-md shadow-[#FFB347]/20">
              {isNewProjectMode ? <Plus className="w-4 h-4 stroke-[3]" /> : <Film className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{isNewProjectMode ? "New Project: Select Media" : "Add Photos & Videos"}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFB347]/20 text-[#FFB347] font-semibold">
                  {isNewProjectMode ? "Step 1: Pick Media" : "Gallery & Cloud"}
                </span>
              </h3>
              <p className="text-[10px] text-[#9090A0]">
                {isNewProjectMode
                  ? "Select multiple photos and videos from your device before proceeding to the editing tools"
                  : "गैलरी या गूगल फोटो से फोटो-वीडियो जोड़ें और एडिट करें"}
              </p>
            </div>
          </div>
          <button
            id="btn-close-add-media"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#888] hover:text-white hover:bg-[#1E1E28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector for New Project */}
        {isNewProjectMode && (
          <div className="px-5 py-2.5 border-b border-[#1E1E28] bg-[#101017] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>1. Project Canvas Format</span>
                <span className="text-[10px] text-[#FFB347] font-mono font-semibold">({selectedRatio})</span>
              </span>
              <span className="text-[10px] text-[#888898]">Choose your video format</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {RATIO_OPTIONS.map((opt) => (
                <button
                  key={opt.ratio}
                  type="button"
                  id={`btn-ratio-${opt.ratio.replace(":", "-")}`}
                  onClick={() => setSelectedRatio(opt.ratio)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all ${
                    selectedRatio === opt.ratio
                      ? "bg-[#FFB347] border-[#FFB347] text-black font-bold shadow-md shadow-[#FFB347]/20 scale-[1.02]"
                      : "bg-[#161622] border-[#252535] text-[#9090A0] hover:text-white hover:border-[#353545]"
                  }`}
                >
                  <div className="mb-0.5">{opt.icon}</div>
                  <span className="text-[11px] leading-tight font-bold">{opt.label}</span>
                  <span className={`text-[8px] leading-tight truncate ${selectedRatio === opt.ratio ? "text-black/80 font-medium" : "text-[#707080]"}`}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#1C1C26] bg-[#0E0E14] px-3 gap-1">
          <button
            id="tab-media-gallery"
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "gallery"
                ? "border-[#FFB347] text-[#FFB347]"
                : "border-transparent text-[#888896] hover:text-[#E0E0E0]"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Device Gallery</span>
          </button>

          <button
            id="tab-media-gphotos"
            onClick={() => setActiveTab("gphotos")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "gphotos"
                ? "border-[#FFB347] text-[#FFB347]"
                : "border-transparent text-[#888896] hover:text-[#E0E0E0]"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Google Photos</span>
          </button>

          <button
            id="tab-media-stock"
            onClick={() => setActiveTab("stock")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "stock"
                ? "border-[#FFB347] text-[#FFB347]"
                : "border-transparent text-[#888896] hover:text-[#E0E0E0]"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Cinema Stock</span>
          </button>

          <button
            id="tab-media-settings"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all ml-auto ${
              activeTab === "settings"
                ? "border-[#FFB347] text-[#FFB347]"
                : "border-transparent text-[#888896] hover:text-[#E0E0E0]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 no-scrollbar">
          {/* TAB 1: DEVICE GALLERY & CURATED MEDIA (PHOTOS & VIDEOS) */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              {/* Media Sub-Filter Tabs and Action Toolbar */}
              <div className="bg-[#14141E] border border-[#222230] rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-[#0D0D14] rounded-xl border border-[#20202C]">
                  <button
                    type="button"
                    onClick={() => setMediaTypeFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      mediaTypeFilter === "all"
                        ? "bg-[#FFB347] text-black shadow-md shadow-[#FFB347]/20"
                        : "text-[#A0A0B0] hover:text-white hover:bg-[#1E1E2C]"
                    }`}
                  >
                    <span>All Media</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                      {CURATED_GALLERY_MEDIA.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaTypeFilter("video")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      mediaTypeFilter === "video"
                        ? "bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20"
                        : "text-[#A0A0B0] hover:text-white hover:bg-[#1E1E2C]"
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Videos</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                      {CURATED_GALLERY_MEDIA.filter((m) => m.type === "video").length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaTypeFilter("photo")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      mediaTypeFilter === "photo"
                        ? "bg-[#E11D48] text-white shadow-md shadow-[#E11D48]/20"
                        : "text-[#A0A0B0] hover:text-white hover:bg-[#1E1E2C]"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photos</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                      {CURATED_GALLERY_MEDIA.filter((m) => m.type === "photo").length}
                    </span>
                  </button>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={handleQuickSelectDemo}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FFB347]/15 border border-[#FFB347]/40 text-[#FFB347] hover:bg-[#FFB347]/25 text-[11px] font-bold flex items-center gap-1 transition-all"
                    title="Pre-select 1 Video + 1 Photo for instant start"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Demo Pack (Video + Photo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#20202E] border border-[#303042] text-white hover:border-[#FFB347] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Upload className="w-3 h-3 text-[#FFB347]" />
                    <span>Browse Files</span>
                  </button>
                </div>
              </div>

              {/* Curated Photos & Videos Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Gallery Media</span>
                    <span className="text-[10px] font-normal text-[#888898]">
                      (Tap to select / deselect photos and videos)
                    </span>
                  </div>
                  {stagedClips.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setStagedClips([])}
                      className="text-[10px] text-red-400 hover:text-red-300 font-medium"
                    >
                      Deselect All ({stagedClips.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {CURATED_GALLERY_MEDIA.filter(
                    (m) => mediaTypeFilter === "all" || m.type === mediaTypeFilter
                  ).map((item) => {
                    const staged = isItemStaged(item);
                    const orderIdx = getStagedIndex(item);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleGalleryItem(item)}
                        className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all border ${
                          staged
                            ? "border-[#FFB347] ring-2 ring-[#FFB347]/30 shadow-lg shadow-[#FFB347]/20 scale-[1.01]"
                            : "border-[#222230] hover:border-[#444458] bg-[#12121A] hover:bg-[#161622]"
                        }`}
                      >
                        {/* Media Image / Thumbnail */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Top Left: Type & Duration Badge */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10">
                            {item.type === "video" ? (
                              <>
                                <Film className="w-2.5 h-2.5 text-[#00E5FF]" />
                                <span className="text-[9px] font-bold font-mono text-[#00E5FF]">
                                  {item.duration}s
                                </span>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-2.5 h-2.5 text-[#FFB347]" />
                                <span className="text-[9px] font-bold font-mono text-[#FFB347]">
                                  PHOTO
                                </span>
                              </>
                            )}
                          </div>

                          {/* Top Right: Multi-select circle indicator */}
                          <div className="absolute top-1.5 right-1.5">
                            {staged ? (
                              <div className="w-5 h-5 rounded-full bg-[#FFB347] text-black flex items-center justify-center font-extrabold text-[10px] shadow-md">
                                {orderIdx ? (
                                  <span>#{orderIdx}</span>
                                ) : (
                                  <Check className="w-3 h-3 stroke-[3]" />
                                )}
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-white/60 bg-black/40 group-hover:border-white transition-colors" />
                            )}
                          </div>

                          {/* Center Play Indicator for videos on hover */}
                          {item.type === "video" && !staged && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                              <div className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Title & Category Footer */}
                        <div className="p-2 bg-[#12121A] border-t border-[#1C1C26]">
                          <div className="text-xs font-semibold text-white truncate group-hover:text-[#FFB347] transition-colors">
                            {item.name}
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[9px] text-[#888898]">{item.category}</span>
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                item.type === "video"
                                  ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                                  : "bg-[#FFB347]/10 text-[#FFB347]"
                              }`}
                            >
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upload Custom Device Media Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-[#FFB347] bg-[#FFB347]/10 scale-[1.01]"
                    : "border-[#2E2E3E] hover:border-[#FFB347] bg-[#101018] hover:bg-[#141420]"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFB347]/15 text-[#FFB347] flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">
                      Upload from Device Files
                    </div>
                    <div className="text-[10px] text-[#888898]">
                      Drag and drop custom MP4, MOV, JPG, PNG or tap to browse
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) handleFilesBatch(e.target.files);
                  }}
                  className="hidden"
                />
              </div>

              {/* Instructions Banner */}
              <div className="bg-[#14141E] border border-[#222230] rounded-xl p-2.5 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#FFB347] shrink-0 mt-0.5" />
                <div className="text-[10px] text-[#A0A0B2] leading-relaxed">
                  <span className="font-semibold text-white">Quick Tip:</span> Tap any photo or video above to select multiple items. They will be added sequentially to your project timeline!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE PHOTOS & CLOUD */}
          {activeTab === "gphotos" && (
            <div className="space-y-4">
              {/* Google Photos Direct Launcher */}
              <div className="bg-gradient-to-br from-[#1A1A28] to-[#12121A] border border-[#333346] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] p-[2px] shadow-lg">
                    <div className="w-full h-full bg-[#12121A] rounded-[10px] flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-[#FFB347]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Google Photos Integration
                    </h4>
                    <p className="text-[11px] text-[#9090A4] mt-0.5">
                      Select photos/videos backed up in your Google Photos library
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FFB347] text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#FFB347]/20 whitespace-nowrap"
                >
                  Pick from Google Photos
                </button>
              </div>

              {/* URL Import (Public shared links, Google Photos links, Direct URLs) */}
              <div className="bg-[#14141E] border border-[#222230] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#FFB347]" />
                  <span className="text-xs font-bold text-white">
                    Paste Google Photos or Direct Media URL
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={cloudUrl}
                    onChange={(e) => {
                      setCloudUrl(e.target.value);
                      setUrlError("");
                    }}
                    placeholder="https://photos.google.com/... or image/video link"
                    className="flex-1 bg-[#0A0A10] border border-[#2A2A38] focus:border-[#FFB347] rounded-xl px-3 py-2 text-xs text-[#E0E0E0] outline-none font-mono"
                  />
                  <button
                    onClick={handleImportCloudUrl}
                    disabled={isFetchingUrl}
                    className="px-4 py-2 bg-[#20202E] hover:bg-[#2A2A3E] text-xs font-semibold text-[#FFB347] border border-[#FFB347]/30 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {isFetchingUrl ? "Loading..." : "Import Link"}
                  </button>
                </div>
                {urlError && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {urlError}
                  </p>
                )}
              </div>

              {/* Curated Google Photos Test Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB347]" />
                    <span>Quick Test Photos (High Resolution)</span>
                  </span>
                  <span className="text-[10px] text-[#808090]">Tap to add to project</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GOOGLE_PHOTOS_SAMPLE_MEDIA.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPreset(item)}
                      className="group relative rounded-xl overflow-hidden bg-[#161622] border border-[#252535] hover:border-[#FFB347] text-left transition-all active:scale-95"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[9px] text-[#888898] flex items-center justify-between mt-0.5">
                          <span className="text-[#FFB347] font-medium">{item.category}</span>
                          <span>{item.duration}s</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STOCK FOOTAGE */}
          {activeTab === "stock" && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white">
                Cinematic High Definition Footage
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_MEDIA_CLIPS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectPreset(sample)}
                    className="group relative rounded-xl overflow-hidden bg-[#161622] border border-[#252535] hover:border-[#FFB347] text-left transition-all active:scale-95"
                  >
                    <img
                      src={sample.thumbnail}
                      alt={sample.name}
                      className="w-full h-24 object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2.5">
                      <div className="text-xs font-semibold text-white truncate">
                        {sample.name}
                      </div>
                      <div className="text-[10px] text-[#888898] flex items-center justify-between mt-1">
                        <span className="capitalize text-[#FFB347]">{sample.type}</span>
                        <span>{sample.duration}s</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IMPORT SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* Photo Display Duration */}
              <div className="bg-[#14141E] border border-[#222230] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white">
                    Default Photo Duration
                  </div>
                  <span className="font-mono text-xs font-bold text-[#FFB347]">
                    {defaultPhotoDuration.toFixed(1)}s
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={defaultPhotoDuration}
                  onChange={(e) => setDefaultPhotoDuration(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#252535] rounded-lg cursor-pointer accent-[#FFB347]"
                />
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 8, 10].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setDefaultPhotoDuration(sec)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        defaultPhotoDuration === sec
                          ? "bg-[#FFB347] text-black"
                          : "bg-[#20202C] text-[#A0A0B0] hover:text-white"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#888898]">
                  Determines how long each imported photo stays on screen before transitioning.
                </p>
              </div>

              {/* Ken Burns Dynamic Motion */}
              <div className="bg-[#14141E] border border-[#222230] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">
                    Cinematic Ken Burns Effect
                  </div>
                  <div className="text-[10px] text-[#888898] mt-0.5">
                    Adds subtle slow zoom and pan keyframes to imported photos
                  </div>
                </div>
                <button
                  onClick={() => setAutoKenBurns(!autoKenBurns)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    autoKenBurns ? "bg-[#FFB347]" : "bg-[#282838]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoKenBurns ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Placement Preference */}
              <div className="bg-[#14141E] border border-[#222230] rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-white">
                  Timeline Placement
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setImportPlacement("append")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      importPlacement === "append"
                        ? "border-[#FFB347] bg-[#FFB347]/10 text-white font-bold"
                        : "border-[#252535] bg-[#12121A] text-[#888898]"
                    }`}
                  >
                    <div>Append to End</div>
                    <div className="text-[10px] opacity-70">Add after last clip</div>
                  </button>
                  <button
                    onClick={() => setImportPlacement("replace")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      importPlacement === "replace"
                        ? "border-[#FFB347] bg-[#FFB347]/10 text-white font-bold"
                        : "border-[#252535] bg-[#12121A] text-[#888898]"
                    }`}
                  >
                    <div>Start Fresh Project</div>
                    <div className="text-[10px] opacity-70">Replace current timeline</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="bg-[#161622] border border-[#FFB347]/40 rounded-xl p-3 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#FFB347] border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="text-xs font-medium text-white truncate">
                {processingStatus || "Processing media..."}
              </div>
            </div>
          )}

          {/* STAGED CLIPS SELECTION TRAY */}
          {stagedClips.length > 0 && (
            <div className="bg-[#14141E] border border-[#2B2B3C] rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FFB347]" />
                  <span className="text-xs font-bold text-white">
                    Selected Items ({stagedClips.length})
                  </span>
                  <span className="text-[10px] font-mono text-[#FFB347] bg-[#FFB347]/15 px-1.5 py-0.5 rounded">
                    ~{totalStagedDuration.toFixed(1)}s
                  </span>
                </div>
                <button
                  onClick={() => setStagedClips([])}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Horizontal scrollable thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {stagedClips.map((clip, idx) => (
                  <div
                    key={clip.id}
                    className="relative rounded-xl overflow-hidden bg-[#1E1E2C] border border-[#303042] shrink-0 w-28 group"
                  >
                    {clip.thumbnail ? (
                      <img
                        src={clip.thumbnail}
                        alt={clip.name}
                        className="w-full h-16 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-16 bg-[#161620] flex items-center justify-center text-[#666]">
                        {clip.type === "video" ? <Film className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                      </div>
                    )}

                    {/* Order index badge */}
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-white font-bold">
                      #{idx + 1}
                    </div>

                    <button
                      onClick={() => handleRemoveStagedClip(clip.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors opacity-80 group-hover:opacity-100"
                      title="Remove clip"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="p-1 text-[9px] truncate text-[#D0D0D8]">
                      {clip.name}
                    </div>

                    <div className="px-1 pb-1 flex items-center justify-between text-[8px] text-[#888898]">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveClip(idx, "left")}
                          className="p-0.5 rounded hover:bg-[#303040] disabled:opacity-20 text-[#CCC] hover:text-white transition-opacity"
                          title="Move Earlier"
                        >
                          <ChevronLeft className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === stagedClips.length - 1}
                          onClick={() => handleMoveClip(idx, "right")}
                          className="p-0.5 rounded hover:bg-[#303040] disabled:opacity-20 text-[#CCC] hover:text-white transition-opacity"
                          title="Move Later"
                        >
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="uppercase text-[#FFB347] font-semibold">{clip.type}</span>
                      <span>{clip.duration.toFixed(1)}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#1C1C26] bg-[#101016] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#888898]">
            {stagedClips.length > 0 ? (
              <span>
                Selected: <strong className="text-white">{stagedClips.length} {stagedClips.length === 1 ? "item" : "items"}</strong> ({totalStagedDuration.toFixed(1)}s)
              </span>
            ) : (
              <span>
                {isNewProjectMode
                  ? "Select multiple photos and videos from your device"
                  : "Select files from Gallery or Google Photos"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#888898] hover:text-white hover:bg-[#1C1C28] transition-colors"
            >
              Cancel
            </button>

            {isNewProjectMode ? (
              <>
                {stagedClips.length === 0 ? (
                  <>
                    {onStartBlankProject && (
                      <button
                        id="btn-start-blank-timeline"
                        onClick={() => {
                          onStartBlankProject(selectedRatio);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl border border-[#2B2B3C] text-xs font-medium text-[#BBB] hover:text-white hover:bg-[#1C1C26] transition-colors"
                      >
                        Start Blank
                      </button>
                    )}
                    <button
                      id="btn-quick-demo-pack"
                      onClick={handleQuickSelectDemo}
                      className="px-3 py-2 rounded-xl bg-[#FFB347]/20 border border-[#FFB347]/40 text-[#FFB347] text-xs font-bold hover:bg-[#FFB347]/30 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Video + Photo</span>
                    </button>
                    <button
                      id="btn-newproj-select-files"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFB347] to-[#FF8C00] text-black text-xs font-bold shadow-md shadow-[#FFB347]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Files</span>
                    </button>
                  </>
                ) : (
                  <button
                    id="btn-proceed-to-editing"
                    onClick={() => {
                      if (onCreateProjectWithMedia) {
                        onCreateProjectWithMedia(stagedClips, selectedRatio);
                      } else if (onAddClips) {
                        onAddClips(stagedClips, true);
                      }
                      setStagedClips([]);
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB347] to-[#FF8C00] text-black text-xs font-extrabold shadow-lg shadow-[#FFB347]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Editing Tools ({stagedClips.length})</span>
                    <ArrowRight className="w-4 h-4 fill-current stroke-[2.5]" />
                  </button>
                )}
              </>
            ) : (
              stagedClips.length > 0 && (
                <button
                  id="btn-confirm-add-media"
                  onClick={() => handleCommitStagedClips(importPlacement === "replace")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFB347] to-[#FF8C00] text-black text-xs font-bold shadow-md shadow-[#FFB347]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 fill-current" />
                  <span>
                    {importPlacement === "replace"
                      ? `Start Fresh with ${stagedClips.length} Item(s)`
                      : `Add ${stagedClips.length} to Timeline`}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
