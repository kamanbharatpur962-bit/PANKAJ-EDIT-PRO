export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5" | "21:9";

export type KeyframeEasing = 
  | "linear" 
  | "ease-in" 
  | "ease-out" 
  | "ease-in-out" 
  | "bounce" 
  | "elastic";

export interface Keyframe {
  id?: string;
  time: number; // in seconds relative to clip or text start
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  easing?: KeyframeEasing;
}

export interface SmartCutSegment {
  id: string;
  clipId: string;
  clipName: string;
  startTime: number; // in seconds on timeline
  endTime: number; // in seconds on timeline
  clipRelStart: number; // relative to clip start
  clipRelEnd: number; // relative to clip end
  duration: number; // length of redundant portion to cut
  reason: "silence" | "dead_air" | "low_motion" | "repetitive_action" | "stutter" | "uninteresting";
  reasonLabel: string;
  confidence: number; // 0 to 1
  selected: boolean; // whether to remove this segment (true = cut, false = keep)
  thumbnail?: string;
  volumeLevel?: number;
  motionScore?: number;
}

export interface SmartCutAnalysis {
  totalOriginalDuration: number;
  totalCutsDuration: number;
  projectedDuration: number;
  reductionPercent: number;
  segments: SmartCutSegment[];
}

export interface SpeedRampPoint {
  timePct: number; // 0 to 1
  speed: number;   // 0.2x to 4x
}

export type MaskShape = "none" | "linear" | "radial" | "rectangle" | "heart" | "star";

export interface Clip {
  id: string;
  name: string;
  type: "video" | "photo";
  url: string;
  thumbnail?: string;
  duration: number; // total media duration
  startTime: number; // position on timeline
  trimStart: number; // cut start
  trimEnd: number;   // cut end (trimmed duration = trimEnd - trimStart)
  speed: number;     // 1.0 = normal
  speedRampPreset?: "none" | "hero" | "bullet_time" | "flash" | "montage";
  reversed: boolean;
  isFrozen?: boolean;
  volume: number;    // 0 to 200
  muted: boolean;
  fadeIn: number;    // seconds
  fadeOut: number;   // seconds
  
  // Transform & Geometry
  x: number;         // offset px
  y: number;
  scale: number;     // 1.0 = normal
  rotation: number;  // degrees
  cropRatio?: AspectRatio | "free";
  opacity: number;   // 0 to 1
  blendMode: "normal" | "screen" | "multiply" | "overlay" | "lighten";
  
  // Advanced features
  keyframes: Keyframe[];
  animationId?: string;
  animationType?: "in" | "out" | "combo" | "loop";
  animationDuration?: number; // duration in seconds (e.g. 0.5s to 3s)
  chromaKeyEnabled: boolean;
  chromaColor: string; // e.g. "#00ff00"
  chromaTolerance: number; // 0 to 100
  chromaSoftness: number;
  maskShape: MaskShape;
  maskInvert: boolean;
  blurAmount: number; // 0 to 50px
  blurType: "gaussian" | "motion" | "radial";
  motionBlur?: boolean | number; // Subtle cinematic blur effect during motion playback, or intensity (0 to 1)
  motionBlurIntensity?: number; // Motion blur intensity from 0 to 1
  stabilized: boolean;
  motionTracking: boolean;
  trackingTarget?: { x: number; y: number; width: number; height: number };
}

export interface AudioTrackItem {
  id: string;
  name: string;
  type: "music" | "voiceover" | "sfx" | "extracted";
  url: string;
  startTime: number;
  trimStart: number;
  trimEnd: number;
  duration: number;
  volume: number; // 0 to 200%
  fadeIn: number;
  fadeOut: number;
  waveform?: number[];
  isMuted?: boolean;
  isSolo?: boolean;
}

export interface AudioDuckingConfig {
  enabled: boolean;
  duckAmount: number; // percentage volume to duck down to, e.g. 20 (reduces to 20%)
  fadeTime: number; // attack / release transition duration in seconds, e.g. 0.3s
  targetTypes: ("voiceover" | "sfx")[]; // triggers ducking when active
  threshold?: number;
}

export type AudioLaneType = "music" | "voiceover" | "sfx";

export interface AudioTrackSettings {
  volume: number; // 0 to 200%
  isMuted: boolean;
  isSolo: boolean;
}

export interface AudioMixerSettings {
  music: AudioTrackSettings;
  voiceover: AudioTrackSettings;
  sfx: AudioTrackSettings;
  masterVolume: number; // 0 to 200%
  ducking: AudioDuckingConfig;
}

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words?: WordTiming[];
  style?: string;
}

export type TextAnimationType = 
  | "none" 
  | "typewriter" 
  | "pop_up" 
  | "slide" 
  | "word_by_word" 
  | "karaoke" 
  | "glow_pulse" 
  | "fade";

export interface TextItem {
  id: string;
  text: string;
  startTime: number;
  duration: number;
  x: number; // percentage of canvas (0 to 100)
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  outlineColor?: string;
  outlineWidth: number;
  shadowColor?: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  animation: TextAnimationType;
  karaokeColor?: string;
  presetStyle?: "cinematic_title" | "3d_gold" | "lower_third" | "neon_glow" | "minimal_subtitle" | "glitch_header" | "custom";
  keyframes?: Keyframe[];
}

export type FilterType = 
  | "none"
  | "Cinematic Gold"
  | "Cinematic Blue"
  | "Cinematic Teal"
  | "Hollywood"
  | "Blockbuster"
  | "Movie Night"
  | "Film Grain"
  | "Vintage Film"
  | "Retro Film"
  | "Classic Film"
  | "Kodak Style"
  | "Fuji Style"
  | "Polaroid"
  | "Cyberpunk"
  | "Neon Glow"
  | "Black & White"
  | "Classic B&W"
  | "High Contrast B&W"
  | "Soft B&W"
  | "Noir"
  | "Dark Noir"
  | "HDR Pro"
  | "Portrait Pro"
  | "Golden Hour"
  | "Warm Sunset"
  | "Sunset Orange"
  | "Deep Blue"
  | "Teal Orange"
  | "Emerald Green"
  | "Rose Pink"
  | "Purple Dream"
  | "Dreamy"
  | "Urban"
  | "Street"
  | "Travel Film"
  | "Wedding Warm"
  | "Food Fresh"
  | "Sepia"
  | "Winter Blue"
  | "Luxury Gold"
  | "Ultimate Cinema"
  | (string & {});

export interface ColorWheelValue {
  hue: number;        // 0 to 360
  saturation: number; // 0 to 1
  luminance: number;  // -1 to 1
}

export interface ColorGrading {
  exposure: number;     // -1.0 to 1.0 (default 0)
  brightness: number;   // -1.0 to 1.0 (default 0)
  contrast: number;     // 0.5 to 2.0 (default 1.0)
  highlights: number;   // -1.0 to 1.0 (default 0)
  shadows: number;      // -1.0 to 1.0 (default 0)
  saturation: number;   // 0.0 to 2.0 (default 1.0)
  temperature: number;  // -50 to 50 (default 0)
  tint: number;         // -50 to 50 (default 0)
  vibrance: number;     // 0.5 to 2.0 (default 1.0)
  sharpen: number;      // 0.0 to 1.0 (default 0)
  fade: number;         // 0.0 to 1.0 (default 0)
  vignette: number;     // 0.0 to 1.0 (default 0)
  
  // Wheels
  lift: ColorWheelValue;  // Shadows
  gamma: ColorWheelValue; // Midtones
  gain: ColorWheelValue;  // Highlights
  
  // LUT
  lutName: string;
  lutIntensity: number; // 0 to 100
  
  // Curve points
  masterCurve: { x: number; y: number }[];
  redCurve: { x: number; y: number }[];
  greenCurve: { x: number; y: number }[];
  blueCurve: { x: number; y: number }[];
  
  // HSL
  hsl: {
    red: { h: number; s: number; l: number };
    yellow: { h: number; s: number; l: number };
    green: { h: number; s: number; l: number };
    cyan: { h: number; s: number; l: number };
    blue: { h: number; s: number; l: number };
    magenta: { h: number; s: number; l: number };
  };
}

export type EffectType = 
  | "none"
  | "glitch"
  | "flash"
  | "light_leak"
  | "film_grain"
  | "vhs"
  | "blur"
  | "glow"
  | "shake"
  | "motion_blur"
  | "rgb_split"
  | "lens_flare"
  | "particles";

export interface EffectItem {
  id: string;
  type: EffectType;
  name: string;
  startTime: number;
  duration: number;
  intensity: number; // 0 to 100
}

export type TransitionType = 
  | "none"
  | "zoom"
  | "swipe"
  | "blur"
  | "flash"
  | "spin"
  | "glitch"
  | "film"
  | "camera_movement";

export interface TransitionItem {
  id: string;
  clipIndex: number; // between clip[index] and clip[index + 1]
  type: TransitionType;
  duration: number; // 0.2 to 2.0s
}

export interface FilterTrackItem {
  id: string;
  filter: FilterType;
  name: string;
  startTime: number;
  duration: number;
  intensity: number; // 0 to 100
}

export interface AnimationTrackItem {
  id: string;
  clipId?: string; // linked clip id (if bound to a clip)
  animationId: string;
  name: string;
  type: "in" | "out" | "combo" | "loop";
  startTime: number;
  duration: number; // in seconds
}

export interface VideoProject {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  duration: number; // calculated total duration
  createdAt: number;
  updatedAt: number;
  thumbnail: string;
  clips: Clip[];
  audioTracks: AudioTrackItem[];
  textTracks: TextItem[];
  lyrics: LyricLine[];
  effects: EffectItem[];
  transitions: TransitionItem[];
  activeFilter: FilterType;
  filterIntensity: number; // 0 to 100
  filterTracks?: FilterTrackItem[];
  animationTracks?: AnimationTrackItem[];
  colorGrading: ColorGrading;
  beatMarkers: number[]; // beat timestamps in seconds
  audioMixer?: AudioMixerSettings;
}

export interface VideoTemplate {
  id: string;
  name: string;
  category: 
    | "Instagram Reels"
    | "YouTube Shorts"
    | "Travel videos"
    | "Wedding videos"
    | "Birthday videos"
    | "Cinematic videos"
    | "Motivational videos"
    | "Status videos"
    | "Beat-sync edits"
    | "Slow-motion edits"
    | "Photo montage"
    | "Festival videos";
  aspectRatio: AspectRatio;
  duration: number;
  previewUrl: string;
  description: string;
  badge: string;
  clipCount: number;
  musicTitle: string;
  defaultFilter: FilterType;
  projectPreset: Partial<VideoProject>;
}

export interface ExportSettings {
  resolution: "720p" | "1080p" | "2K" | "4K" | "custom";
  customWidth?: number;
  customHeight?: number;
  fps: 24 | 30 | 60;
  aspectRatio: AspectRatio;
  quality: "standard" | "high" | "pro_lossless";
  format: "mp4" | "webm";
}

export interface ExportedVideo {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  resolution: string;
  fps: number;
  duration: number;
  sizeBytes: number;
  thumbnail: string;
  videoBlobUrl?: string;
  createdAt: number;
}

export type AudioTrack = AudioTrackItem;
export type LyricAnimation = string;
export type TemplateItem = VideoTemplate;
export type TemplateCategory = string;
export type TextAnimation = TextAnimationType;

