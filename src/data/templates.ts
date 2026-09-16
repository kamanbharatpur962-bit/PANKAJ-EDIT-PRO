import { VideoTemplate } from "../types";

export const templates: VideoTemplate[] = [
  {
    id: "tpl_trending_01",
    name: "TikTok Viral Flash",
    category: "Trending",
    aspectRatio: "9:16",
    duration: 8.0,
    previewUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
    description: "Fast-paced cuts with flash transitions and trendy music.",
    badge: "Hot",
    clipCount: 5,
    slots: [
      { id: 1, type: "video", duration: 2.0, transition: "flash" },
      { id: 2, type: "video", duration: 1.5, transition: "flash", effect: "zoom_in" },
      { id: 3, type: "any", duration: 1.0, transition: "flash" },
      { id: 4, type: "any", duration: 1.5, transition: "flash" },
      { id: 5, type: "any", duration: 2.0, effect: "bounce" }
    ],
    musicTitle: "Viral Beat Drop",
    defaultFilter: "vivid",
    projectPreset: {
      activeFilter: "vivid",
      filterIntensity: 60,
    }
  },
  {
    id: "tpl_reels_01",
    name: "IG Viral 3D Zoom",
    category: "Status/Reels",
    aspectRatio: "9:16",
    duration: 7.5,
    previewUrl: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=600&auto=format&fit=crop",
    description: "The classic 3D zoom photo trend for Instagram reels. 11 Photos needed!",
    badge: "Top 1",
    clipCount: 11,
    slots: [
      { id: 1, type: "photo", duration: 2.5, transition: "zoom_in", effect: "zoom_in" },
      { id: 2, type: "photo", duration: 0.5, transition: "flash" },
      { id: 3, type: "photo", duration: 0.5, transition: "flash" },
      { id: 4, type: "photo", duration: 0.5, transition: "flash" },
      { id: 5, type: "photo", duration: 0.5, transition: "flash" },
      { id: 6, type: "photo", duration: 0.5, transition: "flash" },
      { id: 7, type: "photo", duration: 0.5, transition: "flash" },
      { id: 8, type: "photo", duration: 0.5, transition: "flash" },
      { id: 9, type: "photo", duration: 0.5, transition: "flash" },
      { id: 10, type: "photo", duration: 0.5, transition: "flash" },
      { id: 11, type: "photo", duration: 0.5, effect: "bounce" }
    ],
    musicTitle: "Phonk Drift 3D",
    defaultFilter: "cyberpunk",
    projectPreset: {
      activeFilter: "cyberpunk",
      filterIntensity: 80,
    }
  },
  {
    id: "tpl_aesthetic_01",
    name: "Aesthetic Photo Dump",
    category: "Photo Slideshow",
    aspectRatio: "9:16",
    duration: 12.0,
    previewUrl: "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?q=80&w=600&auto=format&fit=crop",
    description: "Soft aesthetic transitions perfect for monthly recaps.",
    badge: "Aesthetic",
    clipCount: 8,
    slots: [
      { id: 1, type: "any", duration: 1.5, transition: "crossfade", effect: "pan_right" },
      { id: 2, type: "any", duration: 1.5, transition: "crossfade", effect: "pan_left" },
      { id: 3, type: "any", duration: 1.5, transition: "crossfade", effect: "zoom_in" },
      { id: 4, type: "any", duration: 1.5, transition: "crossfade", effect: "zoom_out" },
      { id: 5, type: "any", duration: 1.5, transition: "crossfade", effect: "pan_right" },
      { id: 6, type: "any", duration: 1.5, transition: "crossfade", effect: "pan_left" },
      { id: 7, type: "any", duration: 1.5, transition: "crossfade" },
      { id: 8, type: "any", duration: 1.5, effect: "zoom_in" }
    ],
    musicTitle: "Lofi Chill Vibes",
    defaultFilter: "retro",
    projectPreset: {
      activeFilter: "retro",
      filterIntensity: 50,
    }
  },
  {
    id: "tpl_velocity_01",
    name: "Smooth Velocity Edit",
    category: "Slow Motion",
    aspectRatio: "9:16",
    duration: 9.0,
    previewUrl: "https://images.unsplash.com/photo-1483032469466-b937c425697b?q=80&w=600&auto=format&fit=crop",
    description: "Trending velocity style edit for cars, sports, and fashion.",
    badge: "Velocity",
    clipCount: 3,
    slots: [
      { id: 1, type: "video", duration: 3.0, transition: "glitch", effect: "bounce" },
      { id: 2, type: "video", duration: 3.0, transition: "glitch", effect: "bounce" },
      { id: 3, type: "video", duration: 3.0, effect: "bounce" }
    ],
    musicTitle: "Aggressive Trap Beat",
    defaultFilter: "dramatic",
    projectPreset: {
      activeFilter: "dramatic",
      filterIntensity: 100,
    }
  },
  {
    id: "tpl_transitions_01",
    name: "Seamless Transitions",
    category: "Transition",
    aspectRatio: "9:16",
    duration: 10.0,
    previewUrl: "https://images.unsplash.com/photo-1551001614-2ba095655097?q=80&w=600&auto=format&fit=crop",
    description: "Mind-bending seamless transitions for vlogs.",
    badge: "Pro",
    clipCount: 5,
    slots: [
      { id: 1, type: "video", duration: 2.0, transition: "zoom_in" },
      { id: 2, type: "video", duration: 2.0, transition: "slide_left" },
      { id: 3, type: "video", duration: 2.0, transition: "slide_right" },
      { id: 4, type: "video", duration: 2.0, transition: "zoom_out" },
      { id: 5, type: "video", duration: 2.0 }
    ],
    musicTitle: "Future Bass",
    defaultFilter: "vivid",
    projectPreset: {
      activeFilter: "vivid",
      filterIntensity: 75,
    }
  },
  {
    id: "tpl_cinematic_01",
    name: "Dark Moody Cinematic",
    category: "Cinematic",
    aspectRatio: "16:9",
    duration: 12.5,
    previewUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop",
    description: "A dark, moody cinematic intro with slow zooms and deep color grading.",
    badge: "Pro",
    clipCount: 4,
    slots: [
      { id: 1, type: "any", duration: 3.5, transition: "fade_black", effect: "zoom_in" },
      { id: 2, type: "any", duration: 3.0, transition: "crossfade", effect: "zoom_out" },
      { id: 3, type: "any", duration: 2.5, transition: "glitch" },
      { id: 4, type: "any", duration: 3.5, effect: "pan_right" }
    ],
    musicTitle: "Cinematic Hans Zimmer Style",
    defaultFilter: "cinematic",
    projectPreset: {
      activeFilter: "cinematic",
      filterIntensity: 85,
    }
  },
  {
    id: "tpl_beatsync_01",
    name: "Perfect Beat Sync",
    category: "Beat Sync",
    aspectRatio: "9:16",
    duration: 10.0,
    previewUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    description: "Automatically cuts your clips exactly on the beat.",
    badge: "Smart",
    clipCount: 4,
    slots: [
      { id: 1, type: "any", duration: 2.5, transition: "zoom_in" },
      { id: 2, type: "any", duration: 2.5, transition: "zoom_in" },
      { id: 3, type: "any", duration: 2.5, transition: "zoom_in" },
      { id: 4, type: "any", duration: 2.5, effect: "flash" }
    ],
    musicTitle: "Phonk Bass Boosted",
    defaultFilter: "retro",
    projectPreset: {
      activeFilter: "retro",
      filterIntensity: 40,
    }
  },
  {
    id: "tpl_travel_01",
    name: "Wanderlust Travel Vlog",
    category: "Travel",
    aspectRatio: "16:9",
    duration: 15.0,
    previewUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600&auto=format&fit=crop",
    description: "Bright and airy color grading with smooth pan transitions.",
    badge: "New",
    clipCount: 3,
    slots: [
      { id: 1, type: "video", duration: 5.0, transition: "crossfade", effect: "pan_right" },
      { id: 2, type: "video", duration: 5.0, transition: "crossfade", effect: "pan_left" },
      { id: 3, type: "video", duration: 5.0, effect: "zoom_in" }
    ],
    musicTitle: "Upbeat Indie Folk",
    defaultFilter: "warm",
    projectPreset: {
      activeFilter: "warm",
      filterIntensity: 70
    }
  },
  {
    id: "tpl_wedding_01",
    name: "Wedding Highlights",
    category: "Memories",
    aspectRatio: "16:9",
    duration: 18.0,
    previewUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    description: "Romantic and elegant template for wedding moments.",
    badge: "Love",
    clipCount: 4,
    slots: [
      { id: 1, type: "any", duration: 4.5, transition: "crossfade", effect: "zoom_in" },
      { id: 2, type: "any", duration: 4.5, transition: "crossfade", effect: "zoom_out" },
      { id: 3, type: "any", duration: 4.5, transition: "crossfade", effect: "pan_left" },
      { id: 4, type: "any", duration: 4.5, effect: "pan_right" }
    ],
    musicTitle: "Romantic Piano & Strings",
    defaultFilter: "warm",
    projectPreset: {
      activeFilter: "warm",
      filterIntensity: 50
    }
  }
];
