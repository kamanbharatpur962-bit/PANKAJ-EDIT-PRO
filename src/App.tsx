import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  AspectRatio, 
  Clip, 
  ColorGrading, 
  EffectItem, 
  FilterType, 
  FilterTrackItem,
  AnimationTrackItem,
  Keyframe, 
  LyricLine, 
  SmartCutSegment, 
  TemplateItem, 
  TextItem, 
  TransitionItem, 
  VideoProject, 
  VideoTemplate,
  AudioMixerSettings,
  AudioTrackItem
} from "./types";
import { createInitialProject, DEFAULT_COLOR_GRADING, SAMPLE_VIDEOS } from "./data/sampleMedia";
import { Navbar } from "./components/Navbar";
import { PreviewPlayer } from "./components/PreviewPlayer";
import { Timeline } from "./components/Timeline";
import { Toolbar, ActiveToolTab } from "./components/Toolbar";
import { HomeScreen } from "./components/HomeScreen";

// Tool Panels
import { EditPanel } from "./components/panels/EditPanel";
import { FilterPanel } from "./components/panels/FilterPanel";
import { ColorGradingPanel } from "./components/panels/ColorGradingPanel";
import { AdjustPanel } from "./components/panels/AdjustPanel";
import { AudioPanel } from "./components/panels/AudioPanel";
import { AudioMixerPanel } from "./components/panels/AudioMixerPanel";
import { SongToTextPanel } from "./components/panels/SongToTextPanel";
import { TextPanel } from "./components/panels/TextPanel";
import { EffectsPanel } from "./components/panels/EffectsPanel";
import { AIPanel } from "./components/panels/AIPanel";
import { TemplatesPanel } from "./components/panels/TemplatesPanel";
import { KeyframeEditorPanel } from "./components/panels/KeyframeEditorPanel";
import { MaskPanel } from "./components/panels/MaskPanel";
import { multiTrackAudioEngine } from "./utils/audioEngine";

// Bottom Tool Sheets & Header
import { 
  SpeedSheet, 
  VolumeSheet, 
  CropSheet, 
  AnimationsSheet, 
  AspectRatioSheet, 
  BackgroundSheet, 
  StickersSheet, 
  SheetHeader 
} from "./components/bottomSheets/QuickToolSheets";
import { Sliders, Palette, Music, Type, FileText, Sparkles, SlidersHorizontal } from "lucide-react";

// Modals
import { AIModal } from "./components/modals/AIModal";
import { AddMediaModal } from "./components/modals/AddMediaModal";
import { ExportModal } from "./components/modals/ExportModal";
import { SmartCutModal } from "./components/modals/SmartCutModal";
import { ReorderClipsModal } from "./components/modals/ReorderClipsModal";
import { AIFeatureModal } from "./components/modals/AIFeatureModal";
import { PWABadge } from "./components/PWABadge";

import { applySmartCutsToProject } from "./utils/smartCutApplier";

export default function App() {
  // Current screen mode: "home" or "editor"
  const [currentView, setCurrentView] = useState<"home" | "editor">("home");

  // Project state
  const [project, setProject] = useState<VideoProject>(() => createInitialProject());
  const [history, setHistory] = useState<VideoProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  // Active editor selection
  const [selectedClipId, setSelectedClipId] = useState<string | null>("clip-1");
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveToolTab | null>(null);
  const [isBeforeAfterActive, setIsBeforeAfterActive] = useState<boolean>(false);

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState<boolean>(false);
  const [isNewProjectMode, setIsNewProjectMode] = useState<boolean>(false);
  const [newProjectRatio, setNewProjectRatio] = useState<AspectRatio>("9:16");
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSmartCutModalOpen, setIsSmartCutModalOpen] = useState<boolean>(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState<boolean>(false);
  const [activeAIFeature, setActiveAIFeature] = useState<string | null>(null);

  // Saved collections for Home Dashboard
  const [savedProjects, setSavedProjects] = useState<VideoProject[]>([
    createInitialProject(),
    {
      ...createInitialProject(),
      id: "proj-travel-reel",
      title: "Golden Hour Coastline",
      aspectRatio: "9:16",
      activeFilter: "Moody",
      thumbnail: SAMPLE_VIDEOS[1].thumbnail,
      duration: 12.0,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
    },
    {
      ...createInitialProject(),
      id: "proj-cinema-trailer",
      title: "Cyberpunk Tokyo Drift",
      aspectRatio: "16:9",
      activeFilter: "Hollywood",
      thumbnail: SAMPLE_VIDEOS[2].thumbnail,
      duration: 18.5,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 14400000,
    },
  ]);

  const [drafts, setDrafts] = useState<VideoProject[]>([
    {
      ...createInitialProject(),
      id: "draft-auto-1",
      title: "Night City Fast Edit",
      duration: 8.4,
      updatedAt: Date.now() - 1800000,
    },
  ]);

  const [exportedVideos, setExportedVideos] = useState<
    {
      id: string;
      title: string;
      url: string;
      date: string;
      resolution: string;
      duration: number;
      size: string;
    }[]
  >([
    {
      id: "exp-1",
      title: "Cinematic Night City Promo",
      url: SAMPLE_VIDEOS[0].url,
      date: "Today, 10:45 AM",
      resolution: "1080p (60fps)",
      duration: 14.5,
      size: "24.8 MB",
    },
  ]);

  // Push state to undo/redo history
  const updateProjectWithHistory = useCallback((newProject: VideoProject) => {
    setProject(newProject);
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newProject].slice(-30);
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Direct updater without history for high-frequency scrubbing
  const updateProjectDirect = useCallback((updater: (prev: VideoProject) => VideoProject) => {
    setProject((prev) => {
      const next = updater(prev);
      return next;
    });
  }, []);

  // Initialize history with initial project
  useEffect(() => {
    if (history.length === 0) {
      setHistory([project]);
      setHistoryIndex(0);
    }
  }, []);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setProject(history[nextIdx]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setProject(history[nextIdx]);
    }
  }, [historyIndex, history]);

  // Real-time playback loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now();
      const initialCurrentTime = currentTime;

      const loop = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const nextTime = initialCurrentTime + elapsed;

        if (nextTime >= project.duration) {
          setCurrentTime(0);
          setIsPlaying(false);
        } else {
          setCurrentTime(nextTime);
          playTimerRef.current = requestAnimationFrame(loop);
        }
      };

      playTimerRef.current = requestAnimationFrame(loop);
    } else {
      if (playTimerRef.current) {
        cancelAnimationFrame(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current) {
        cancelAnimationFrame(playTimerRef.current);
      }
    };
  }, [isPlaying, project.duration]);

  // Multi-Track Audio Engine Synchronization (Music, Voiceover, SFX with Ducking & Faders)
  useEffect(() => {
    multiTrackAudioEngine.sync(project, currentTime, isPlaying);
  }, [currentTime, isPlaying, project.audioTracks, project.audioMixer]);

  // Cleanup audio playback on unmount
  useEffect(() => {
    return () => {
      multiTrackAudioEngine.stopAll();
    };
  }, []);

  // Toggle play / pause
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Keyboard shortcuts: Space for Play/Pause, Left/Right for Frame-by-frame scrubbing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into input, textarea, or contentEditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        // Step backward 1 frame (~1/30s = ~0.033s, or 0.1s with shift)
        const step = e.shiftKey ? 0.5 : 1 / 30;
        setCurrentTime((prev) => {
          const next = Math.max(0, parseFloat((prev - step).toFixed(3)));
          return next;
        });
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        // Step forward 1 frame (~1/30s = ~0.033s, or 0.1s with shift)
        const step = e.shiftKey ? 0.5 : 1 / 30;
        setCurrentTime((prev) => {
          const next = Math.min(project.duration, parseFloat((prev + step).toFixed(3)));
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project.duration]);

  // Seek time update - Ultra smooth, fast, non-blocking
  const handleTimeUpdate = useCallback((time: number) => {
    const clamped = Math.max(0, Math.min(project.duration, time));
    setCurrentTime(clamped);
  }, [project.duration]);

  // Update clip properties (scale, rotation, volume, keyframes, chroma, mask, etc.)
  const handleUpdateClip = useCallback((clipId: string, updates: Partial<Clip>) => {
    updateProjectWithHistory({
      ...project,
      clips: project.clips.map((c) => (c.id === clipId ? { ...c, ...updates } : c)),
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  // Clip Trim update
  const handleUpdateClipTrim = useCallback((clipId: string, trimStart: number, trimEnd: number) => {
    const updatedClips = project.clips.map((c) =>
      c.id === clipId ? { ...c, trimStart, trimEnd } : c
    );

    // Recalculate start times and duration
    let cur = 0;
    const packed = updatedClips.map((c) => {
      const dur = (c.trimEnd - c.trimStart) / c.speed;
      const res = { ...c, startTime: parseFloat(cur.toFixed(2)) };
      cur += dur;
      return res;
    });

    updateProjectWithHistory({
      ...project,
      clips: packed,
      duration: Math.max(1, parseFloat(cur.toFixed(2))),
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  // Split clip at playhead
  const handleSplitClip = useCallback(() => {
    const clipIndex = project.clips.findIndex((c) => c.id === selectedClipId);
    if (clipIndex === -1) return;

    const clip = project.clips[clipIndex];
    const clipDurationOnTimeline = (clip.trimEnd - clip.trimStart) / clip.speed;
    const relPlayhead = currentTime - clip.startTime;

    if (relPlayhead <= 0.2 || relPlayhead >= clipDurationOnTimeline - 0.2) {
      return; // Too close to boundaries to split
    }

    const splitMediaPoint = clip.trimStart + relPlayhead * clip.speed;

    const clipA: Clip = {
      ...clip,
      id: `${clip.id}-a-${Date.now()}`,
      trimEnd: parseFloat(splitMediaPoint.toFixed(2)),
    };

    const clipB: Clip = {
      ...clip,
      id: `${clip.id}-b-${Date.now()}`,
      startTime: parseFloat((clip.startTime + relPlayhead).toFixed(2)),
      trimStart: parseFloat(splitMediaPoint.toFixed(2)),
      keyframes: (clip.keyframes || [])
        .filter((kf) => kf.time / clip.speed > relPlayhead)
        .map((kf) => ({
          ...kf,
          time: Math.max(0, parseFloat((kf.time - relPlayhead * clip.speed).toFixed(2))),
        })),
    };

    const nextClips = [
      ...project.clips.slice(0, clipIndex),
      clipA,
      clipB,
      ...project.clips.slice(clipIndex + 1),
    ];

    updateProjectWithHistory({
      ...project,
      clips: nextClips,
      updatedAt: Date.now(),
    });
    setSelectedClipId(clipB.id);
  }, [project, selectedClipId, currentTime, updateProjectWithHistory]);

  // Duplicate clip
  const handleDuplicateClip = useCallback(() => {
    const clip = project.clips.find((c) => c.id === selectedClipId);
    if (!clip) return;

    const newClip: Clip = {
      ...clip,
      id: `clip-dup-${Date.now()}`,
      startTime: project.duration,
    };

    const nextClips = [...project.clips, newClip];
    const newDur = project.duration + (clip.trimEnd - clip.trimStart) / clip.speed;

    updateProjectWithHistory({
      ...project,
      clips: nextClips,
      duration: parseFloat(newDur.toFixed(2)),
      updatedAt: Date.now(),
    });
    setSelectedClipId(newClip.id);
  }, [project, selectedClipId, updateProjectWithHistory]);

  // Delete clip
  const handleDeleteClip = useCallback(() => {
    if (project.clips.length <= 1) return;
    const remaining = project.clips.filter((c) => c.id !== selectedClipId);

    // Re-align
    let acc = 0;
    const packed = remaining.map((c) => {
      const dur = (c.trimEnd - c.trimStart) / c.speed;
      const res = { ...c, startTime: parseFloat(acc.toFixed(2)) };
      acc += dur;
      return res;
    });

    updateProjectWithHistory({
      ...project,
      clips: packed,
      duration: Math.max(1, parseFloat(acc.toFixed(2))),
      updatedAt: Date.now(),
    });
    setSelectedClipId(packed[0]?.id || null);
    setCurrentTime(0);
  }, [project, selectedClipId, updateProjectWithHistory]);

  // Reverse selected clip
  const handleReverseClip = useCallback(() => {
    const clip = project.clips.find((c) => c.id === selectedClipId);
    if (!clip) return;
    handleUpdateClip(clip.id, { reversed: !clip.reversed });
  }, [project, selectedClipId, handleUpdateClip]);

  // Move clip left or right - Photo/Video clips ko aage-piche karna
  const handleMoveClip = useCallback((clipId: string, direction: "left" | "right") => {
    const clips = [...project.clips];
    const index = clips.findIndex((c) => c.id === clipId);
    if (index === -1) return;

    if (direction === "left" && index > 0) {
      const temp = clips[index];
      clips[index] = clips[index - 1];
      clips[index - 1] = temp;
    } else if (direction === "right" && index < clips.length - 1) {
      const temp = clips[index];
      clips[index] = clips[index + 1];
      clips[index + 1] = temp;
    } else {
      return;
    }

    let acc = 0;
    const packed = clips.map((c) => {
      const dur = (c.trimEnd - c.trimStart) / (c.speed || 1);
      const res = { ...c, startTime: parseFloat(acc.toFixed(2)) };
      acc += dur;
      return res;
    });

    updateProjectWithHistory({
      ...project,
      clips: packed,
      duration: Math.max(2, parseFloat(acc.toFixed(2))),
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  // Reorder all clips
  const handleReorderClips = useCallback((newClips: Clip[]) => {
    let acc = 0;
    const packed = newClips.map((c) => {
      const dur = (c.trimEnd - c.trimStart) / (c.speed || 1);
      const res = { ...c, startTime: parseFloat(acc.toFixed(2)) };
      acc += dur;
      return res;
    });

    updateProjectWithHistory({
      ...project,
      clips: packed,
      duration: Math.max(2, parseFloat(acc.toFixed(2))),
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  // Add emoji / sticker overlay to project
  const handleAddSticker = useCallback((emoji: string) => {
    const newSticker: TextItem = {
      id: `sticker-${Date.now()}`,
      text: emoji,
      startTime: currentTime,
      duration: 3.0,
      x: 50,
      y: 50,
      fontSize: 44,
      fontFamily: "sans-serif",
      color: "#FFFFFF",
      outlineColor: "transparent",
      outlineWidth: 0,
      shadowColor: "transparent",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      animation: "pop_up",
    };
    updateProjectWithHistory({
      ...project,
      textTracks: [...project.textTracks, newSticker],
    });
    setActiveTab(null);
  }, [currentTime, project, updateProjectWithHistory]);

  // Toggle or add Keyframe at current playhead on selected clip
  const handleToggleKeyframeAtPlayhead = useCallback(() => {
    const clip = project.clips.find((c) => c.id === selectedClipId);
    if (!clip) return;

    const relTime = Math.max(0, (currentTime - clip.startTime) * clip.speed);
    const existingIndex = (clip.keyframes || []).findIndex(
      (k) => Math.abs(k.time - relTime) < 0.15
    );

    let updatedKeyframes: Keyframe[];
    if (existingIndex >= 0) {
      // Remove keyframe
      updatedKeyframes = clip.keyframes.filter((_, i) => i !== existingIndex);
    } else {
      // Add keyframe with current clip values
      const newKf: Keyframe = {
        time: parseFloat(relTime.toFixed(2)),
        x: clip.x || 0,
        y: clip.y || 0,
        scale: clip.scale || 1.0,
        rotation: clip.rotation || 0,
        opacity: clip.opacity ?? 1.0,
        easing: "ease-in-out",
      };
      updatedKeyframes = [...(clip.keyframes || []), newKf].sort((a, b) => a.time - b.time);
    }

    handleUpdateClip(clip.id, { keyframes: updatedKeyframes });
  }, [project.clips, selectedClipId, currentTime, handleUpdateClip]);

  // Add / Remove keyframes for EditPanel
  const handleAddKeyframe = useCallback((clipId: string, kf: Keyframe) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip) return;
    const filtered = (clip.keyframes || []).filter((k) => Math.abs(k.time - kf.time) > 0.05);
    const updated = [...filtered, kf].sort((a, b) => a.time - b.time);
    handleUpdateClip(clipId, { keyframes: updated });
  }, [project.clips, handleUpdateClip]);

  const handleRemoveKeyframe = useCallback((clipId: string, time: number) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip) return;
    const filtered = (clip.keyframes || []).filter((k) => Math.abs(k.time - time) > 0.05);
    handleUpdateClip(clipId, { keyframes: filtered });
  }, [project.clips, handleUpdateClip]);

  // Smart Cut application with review
  const handleApplySmartCuts = useCallback((cutsToApply: SmartCutSegment[]) => {
    const updatedProject = applySmartCutsToProject(project, cutsToApply);
    updateProjectWithHistory(updatedProject);
    setIsSmartCutModalOpen(false);
    setCurrentTime(0);
  }, [project, updateProjectWithHistory]);

  // Color & Filter Handlers
  const handleUpdateFilter = useCallback((filter: FilterType, intensity: number) => {
    let updatedFilterTracks = project.filterTracks || [];
    if (selectedFilterId) {
      updatedFilterTracks = updatedFilterTracks.map((f) =>
        f.id === selectedFilterId ? { ...f, filter, name: filter, intensity } : f
      );
    } else if (filter !== "none") {
      if (updatedFilterTracks.length === 0) {
        updatedFilterTracks = [
          {
            id: `flt-${Date.now()}`,
            filter,
            name: filter,
            startTime: 0,
            duration: project.duration,
            intensity,
          },
        ];
      } else {
        const atPlayhead = updatedFilterTracks.find(
          (f) => currentTime >= f.startTime && currentTime <= f.startTime + f.duration
        ) || updatedFilterTracks[0];
        if (atPlayhead) {
          updatedFilterTracks = updatedFilterTracks.map((f) =>
            f.id === atPlayhead.id ? { ...f, filter, name: filter, intensity } : f
          );
        }
      }
    }

    updateProjectWithHistory({
      ...project,
      activeFilter: filter,
      filterIntensity: intensity,
      filterTracks: updatedFilterTracks,
      updatedAt: Date.now(),
    });
  }, [project, selectedFilterId, currentTime, updateProjectWithHistory]);

  // Dedicated Timeline Filter Track Handlers
  const handleUpdateFilterItem = useCallback((filterId: string, updates: Partial<FilterTrackItem>) => {
    const existing = project.filterTracks || [];
    const updated = existing.map((f) => (f.id === filterId ? { ...f, ...updates } : f));
    updateProjectWithHistory({
      ...project,
      filterTracks: updated,
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  const handleAddFilterItem = useCallback((presetFilter: FilterType = "Teal & Orange") => {
    const newFilter: FilterTrackItem = {
      id: `flt-${Date.now()}`,
      filter: presetFilter,
      name: presetFilter,
      startTime: currentTime,
      duration: Math.min(4.0, Math.max(1.0, project.duration - currentTime)),
      intensity: 85,
    };
    const existing = project.filterTracks || [];
    const updated = [...existing, newFilter];
    updateProjectWithHistory({
      ...project,
      filterTracks: updated,
      updatedAt: Date.now(),
    });
    setSelectedFilterId(newFilter.id);
  }, [currentTime, project, updateProjectWithHistory]);

  const handleDeleteFilterItem = useCallback((filterId: string) => {
    if (filterId === "flt-default-global") {
      updateProjectWithHistory({
        ...project,
        activeFilter: "none",
        filterIntensity: 100,
        updatedAt: Date.now(),
      });
      setSelectedFilterId(null);
      return;
    }

    const updated = (project.filterTracks || []).filter((f) => f.id !== filterId);
    updateProjectWithHistory({
      ...project,
      filterTracks: updated,
      updatedAt: Date.now(),
    });
    setSelectedFilterId(null);
  }, [project, updateProjectWithHistory]);

  // Dedicated Timeline Animation Track Handlers
  const handleUpdateAnimationItem = useCallback((animId: string, updates: Partial<AnimationTrackItem>) => {
    const existing = project.animationTracks || [];
    const updated = existing.map((a) => {
      if (a.id === animId) {
        const next = { ...a, ...updates };
        if (next.clipId && updates.duration !== undefined) {
          handleUpdateClip(next.clipId, { animationDuration: next.duration });
        }
        return next;
      }
      return a;
    });
    updateProjectWithHistory({
      ...project,
      animationTracks: updated,
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory, handleUpdateClip]);

  const handleAddAnimationItem = useCallback((presetAnim: string = "in_zoom_1") => {
    const activeClip = project.clips.find(
      (c) =>
        currentTime >= c.startTime &&
        currentTime <= c.startTime + (c.trimEnd - c.trimStart) / c.speed
    ) || project.clips[0];

    const newAnim: AnimationTrackItem = {
      id: `anim-${Date.now()}`,
      clipId: activeClip?.id,
      animationId: presetAnim,
      name: "Zoom 1 (Entrance)",
      type: "in",
      startTime: currentTime,
      duration: 1.2,
    };

    if (activeClip) {
      handleUpdateClip(activeClip.id, { animationId: presetAnim, animationDuration: 1.2 });
    }

    const existing = project.animationTracks || [];
    const updated = [...existing, newAnim];
    updateProjectWithHistory({
      ...project,
      animationTracks: updated,
      updatedAt: Date.now(),
    });
    setSelectedAnimationId(newAnim.id);
  }, [currentTime, project, updateProjectWithHistory, handleUpdateClip]);

  const handleDeleteAnimationItem = useCallback((animId: string) => {
    const target = (project.animationTracks || []).find((a) => a.id === animId);
    if (target?.clipId) {
      handleUpdateClip(target.clipId, { animationId: undefined });
    }
    const updated = (project.animationTracks || []).filter((a) => a.id !== animId);
    updateProjectWithHistory({
      ...project,
      animationTracks: updated,
      updatedAt: Date.now(),
    });
    setSelectedAnimationId(null);
  }, [project, updateProjectWithHistory, handleUpdateClip]);

  // Audio Mixer & Multi-Track Handlers
  const handleUpdateMixer = useCallback(
    (newMixer: AudioMixerSettings) => {
      updateProjectWithHistory({
        ...project,
        audioMixer: newMixer,
        updatedAt: Date.now(),
      });
    },
    [project, updateProjectWithHistory]
  );

  const handleUpdateAudioTrack = useCallback(
    (trackId: string, updates: Partial<AudioTrackItem>) => {
      updateProjectWithHistory({
        ...project,
        audioTracks: project.audioTracks.map((a) =>
          a.id === trackId ? { ...a, ...updates } : a
        ),
        updatedAt: Date.now(),
      });
    },
    [project, updateProjectWithHistory]
  );

  const handleDeleteAudioTrack = useCallback(
    (trackId: string) => {
      updateProjectWithHistory({
        ...project,
        audioTracks: project.audioTracks.filter((a) => a.id !== trackId),
        updatedAt: Date.now(),
      });
    },
    [project, updateProjectWithHistory]
  );

  const handleAddAudioTrack = useCallback(
    (track: AudioTrackItem) => {
      updateProjectWithHistory({
        ...project,
        audioTracks: [...project.audioTracks, track],
        updatedAt: Date.now(),
      });
    },
    [project, updateProjectWithHistory]
  );

  const handleUpdateGrading = useCallback((grading: Partial<ColorGrading>) => {
    updateProjectWithHistory({
      ...project,
      colorGrading: {
        ...project.colorGrading,
        ...grading,
      },
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  const handleResetGrading = useCallback(() => {
    updateProjectWithHistory({
      ...project,
      colorGrading: { ...DEFAULT_COLOR_GRADING },
      activeFilter: "none",
      filterIntensity: 100,
      updatedAt: Date.now(),
    });
  }, [project, updateProjectWithHistory]);

  // Add Clip from AddMediaModal
  const handleAddClip = useCallback((newClip: Clip) => {
    const updatedClips = [...project.clips, { ...newClip, startTime: project.duration }];
    const newDur = project.duration + (newClip.trimEnd - newClip.trimStart) / newClip.speed;
    updateProjectWithHistory({
      ...project,
      clips: updatedClips,
      duration: parseFloat(newDur.toFixed(2)),
      updatedAt: Date.now(),
    });
    setIsAddMediaModalOpen(false);
    setSelectedClipId(newClip.id);
    setCurrentView("editor");
  }, [project, updateProjectWithHistory]);

  // Add Multiple Clips from Gallery / Google Photos
  const handleAddClips = useCallback((newClips: Clip[], replaceExisting: boolean = false) => {
    if (newClips.length === 0) return;

    if (replaceExisting) {
      let curTime = 0;
      const formattedClips = newClips.map((c) => {
        const clipDur = (c.trimEnd - c.trimStart) / c.speed;
        const clipWithStart = { ...c, startTime: parseFloat(curTime.toFixed(2)) };
        curTime += clipDur;
        return clipWithStart;
      });

      const totalDur = parseFloat(curTime.toFixed(2));
      updateProjectWithHistory({
        ...project,
        clips: formattedClips,
        duration: Math.max(totalDur, 1),
        updatedAt: Date.now(),
      });
      setSelectedClipId(formattedClips[0].id);
      setCurrentTime(0);
    } else {
      let curTime = project.duration;
      const formattedClips = newClips.map((c) => {
        const clipDur = (c.trimEnd - c.trimStart) / c.speed;
        const clipWithStart = { ...c, startTime: parseFloat(curTime.toFixed(2)) };
        curTime += clipDur;
        return clipWithStart;
      });

      const totalDur = parseFloat(curTime.toFixed(2));
      updateProjectWithHistory({
        ...project,
        clips: [...project.clips, ...formattedClips],
        duration: Math.max(totalDur, 1),
        updatedAt: Date.now(),
      });
      setSelectedClipId(formattedClips[0].id);
    }

    setIsAddMediaModalOpen(false);
    setCurrentView("editor");
  }, [project, updateProjectWithHistory]);

  // Home Screen: Open New Project Flow with Immediate Media Picker
  const handleOpenNewProjectPicker = useCallback((initialRatio: AspectRatio = "9:16") => {
    setNewProjectRatio(initialRatio);
    setIsNewProjectMode(true);
    setIsAddMediaModalOpen(true);
  }, []);

  // Home Screen: Create Project with Staged Media Selection
  const handleCreateProjectWithMedia = useCallback(
    (clips: Clip[], aspectRatio: AspectRatio = "9:16") => {
      // Sequence the clips sequentially on timeline
      let runningTime = 0;
      const sequencedClips: Clip[] = clips.map((c) => {
        const dur = (c.trimEnd - c.trimStart) / (c.speed || 1);
        const clipWithTimelineStart: Clip = {
          ...c,
          startTime: parseFloat(runningTime.toFixed(2)),
        };
        runningTime += dur;
        return clipWithTimelineStart;
      });

      const totalDuration = Math.max(parseFloat(runningTime.toFixed(2)), 1);

      const newProj: VideoProject = {
        ...createInitialProject(),
        id: `proj-${Date.now()}`,
        title: `Project ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        aspectRatio,
        clips: sequencedClips,
        duration: totalDuration,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setSavedProjects((prev) => [newProj, ...prev]);
      setProject(newProj);
      setHistory([newProj]);
      setHistoryIndex(0);
      setCurrentTime(0);
      if (sequencedClips.length > 0) {
        setSelectedClipId(sequencedClips[0].id);
      }
      setIsAddMediaModalOpen(false);
      setIsNewProjectMode(false);
      setCurrentView("editor");
    },
    []
  );

  // Home Screen: Start Blank Timeline Project
    const handleRestoreProjects = (restoredProjects: VideoProject[]) => {
    // Merge restored projects, avoiding duplicates by ID
    setSavedProjects((prev) => {
      const existingIds = new Set(prev.map(p => p.id));
      const newProjects = restoredProjects.filter(p => !existingIds.has(p.id));
      return [...newProjects, ...prev];
    });
  };

  const handleStartBlankProject = useCallback((aspectRatio: AspectRatio = "9:16") => {
    const blankProj: VideoProject = {
      ...createInitialProject(),
      id: `proj-${Date.now()}`,
      title: "Untitled Studio Project",
      aspectRatio,
      clips: [],
      duration: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSavedProjects((prev) => [blankProj, ...prev]);
    setProject(blankProj);
    setHistory([blankProj]);
    setHistoryIndex(0);
    setCurrentTime(0);
    setSelectedClipId(null);
    setIsAddMediaModalOpen(false);
    setIsNewProjectMode(false);
    setCurrentView("editor");
  }, []);

  // Home Screen: New Project
  const handleNewProject = useCallback((aspectRatio: AspectRatio, template?: VideoTemplate) => {
    let newProj: VideoProject;
    if (template) {
      newProj = {
        ...createInitialProject(),
        id: `proj-${Date.now()}`,
        title: `${template.name} Project`,
        aspectRatio: template.aspectRatio,
        activeFilter: template.defaultFilter || "Hollywood",
        duration: template.duration,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else {
      newProj = {
        ...createInitialProject(),
        id: `proj-${Date.now()}`,
        title: "Untitled Studio Project",
        aspectRatio,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    setSavedProjects((prev) => [newProj, ...prev]);
    setProject(newProj);
    setHistory([newProj]);
    setHistoryIndex(0);
    setCurrentTime(0);
    setCurrentView("editor");
  }, []);

  // Home Screen: Quick Edit
  const handleQuickEdit = useCallback(() => {
    const quickProj: VideoProject = {
      ...createInitialProject(),
      id: `proj-quick-${Date.now()}`,
      title: "Quick Edit Story",
      aspectRatio: "9:16",
      activeFilter: "Teal & Orange",
      filterIntensity: 85,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSavedProjects((prev) => [quickProj, ...prev]);
    setProject(quickProj);
    setCurrentView("editor");
    setIsSmartCutModalOpen(true);
  }, []);

  // Home Screen: Open Existing Project
  const handleOpenProject = useCallback((selectedProj: VideoProject) => {
    setProject(selectedProj);
    setHistory([selectedProj]);
    setHistoryIndex(0);
    setCurrentTime(0);
    setCurrentView("editor");
  }, []);

  // Home Screen: Open Smart Cut Directly
  const handleOpenSmartCutDirectly = useCallback(() => {
    setCurrentView("editor");
    setIsSmartCutModalOpen(true);
  }, []);

  // Save rendered export
  const handleSaveExportedVideo = useCallback((item: {
    id: string;
    title: string;
    url: string;
    date: string;
    resolution: string;
    duration: number;
    size: string;
  }) => {
    setExportedVideos((prev) => [item, ...prev]);
    setIsExportModalOpen(false);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] text-[#E0E0E0] overflow-hidden select-none font-sans">
      {/* 1. HOME SCREEN VIEW */}
      {currentView === "home" ? (
        <HomeScreen
          onNewProject={handleNewProject}
          onOpenProject={handleOpenProject}
          onQuickEdit={handleQuickEdit}
          onOpenSmartCutDirectly={handleOpenSmartCutDirectly}
          onOpenAddMediaModal={() => {
            setIsNewProjectMode(false);
            setIsAddMediaModalOpen(true);
          }}
          onOpenNewProjectPicker={handleOpenNewProjectPicker}
          onOpenFeature={setActiveAIFeature}
          currentProject={project}
          savedProjects={savedProjects}
          drafts={drafts}
          exportedVideos={exportedVideos}
        />
      ) : (
        /* 2. PROFESSIONAL VIDEO EDITOR STUDIO VIEW */
        <div className="flex flex-col h-full w-full overflow-hidden bg-[#0A0A0A]">
          {/* Top Studio Navbar */}
          <Navbar
            title={project.title}
            onTitleChange={(newTitle) =>
              updateProjectWithHistory({ ...project, title: newTitle, updatedAt: Date.now() })
            }
            aspectRatio={project.aspectRatio}
            onAspectRatioChange={(ratio) =>
              updateProjectWithHistory({ ...project, aspectRatio: ratio, updatedAt: Date.now() })
            }
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onBackToHome={() => setCurrentView("home")}
            onOpenExport={() => setIsExportModalOpen(true)}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            onOpenAddMedia={() => {
              setIsNewProjectMode(false);
              setIsAddMediaModalOpen(true);
            }}
            isBeforeAfterActive={isBeforeAfterActive}
            onToggleBeforeAfter={() => setIsBeforeAfterActive(!isBeforeAfterActive)}
          />

          {/* Center Workstage: Clean, Responsive Canvas Video Preview Player */}
          <div className="flex-1 flex flex-col items-center justify-center p-1 sm:p-2.5 bg-[#08080C] relative overflow-hidden min-h-[220px]">
            <PreviewPlayer
              project={project}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeUpdate={handleTimeUpdate}
              onTogglePlay={handleTogglePlay}
              isBeforeAfterActive={isBeforeAfterActive}
              onToggleBeforeAfter={() => setIsBeforeAfterActive(!isBeforeAfterActive)}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onToggleKeyframe={handleToggleKeyframeAtPlayhead}
            />
          </div>

          {/* Multi-Track Timeline (Left Column: Mute & Cover, Video Track, Filter Track, Animation Track, Audio Track) */}
          <Timeline
            project={project}
            currentTime={currentTime}
            onTimeUpdate={handleTimeUpdate}
            selectedClipId={selectedClipId}
            onSelectClip={setSelectedClipId}
            onSplitClip={handleSplitClip}
            onDuplicateClip={handleDuplicateClip}
            onDeleteClip={handleDeleteClip}
            onOpenAddMediaModal={() => {
              setIsNewProjectMode(false);
              setIsAddMediaModalOpen(true);
            }}
            onOpenAddAudioModal={() => setActiveTab("audio")}
            onOpenAddTextModal={() => setActiveTab("text")}
            onOpenFilterDrawer={() => setActiveTab("filters")}
            onOpenAnimationDrawer={() => setActiveTab("animations")}
            onUpdateClipTrim={handleUpdateClipTrim}
            onToggleKeyframeAtPlayhead={handleToggleKeyframeAtPlayhead}
            onOpenSmartCut={() => setIsSmartCutModalOpen(true)}
            onUpdateDuration={(newDuration) => {
              updateProjectWithHistory({
                ...project,
                duration: Math.max(2, newDuration),
                updatedAt: Date.now(),
              });
            }}
            selectedFilterId={selectedFilterId}
            onSelectFilter={setSelectedFilterId}
            selectedAnimationId={selectedAnimationId}
            onSelectAnimation={setSelectedAnimationId}
            onUpdateFilterItem={handleUpdateFilterItem}
            onAddFilterItem={handleAddFilterItem}
            onDeleteFilterItem={handleDeleteFilterItem}
            onUpdateAnimationItem={handleUpdateAnimationItem}
            onAddAnimationItem={handleAddAnimationItem}
            onDeleteAnimationItem={handleDeleteAnimationItem}
            onMoveClip={handleMoveClip}
            onReorderClips={handleReorderClips}
            onOpenKeyframeEditor={() => setActiveTab("keyframe")}
            onOpenMixerModal={() => setActiveTab("audioMixer")}
            onUpdateMixer={handleUpdateMixer}
            onUpdateAudioTrack={handleUpdateAudioTrack}
            onDeleteAudioTrack={handleDeleteAudioTrack}
            onAddAudioTrack={handleAddAudioTrack}
          />

          {/* Bottom Active Tool Drawer: Renders above the toolbar when an editing tool is open */}
          {activeTab !== null ? (
            <div className={`border-t border-[#1E1E28] bg-[#121218] flex flex-col shrink-0 overflow-hidden shadow-2xl z-30 transition-all ${
              activeTab === "keyframe" || activeTab === "audioMixer" ? "h-84 sm:h-96 lg:h-[440px]" : "h-64 sm:h-72 lg:h-80"
            }`}>
              {activeTab === "keyframe" && (
                <KeyframeEditorPanel
                  project={project}
                  selectedClipId={selectedClipId}
                  currentTime={currentTime}
                  onSelectClip={setSelectedClipId}
                  onUpdateClip={handleUpdateClip}
                  onSeekTime={handleTimeUpdate}
                  onClose={() => setActiveTab(null)}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                />
              )}

              {activeTab === "audioMixer" && (
                <AudioMixerPanel
                  project={project}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  onUpdateMixer={handleUpdateMixer}
                  onClose={() => setActiveTab(null)}
                  onOpenAddAudioModal={() => setActiveTab("audio")}
                />
              )}

              {activeTab === "mask" && selectedClipId && (
                <div className="absolute inset-0 bg-[#181818] z-20 flex flex-col rounded-t-[24px]">
                  <MaskPanel
                    clip={project.clips.find(c => c.id === selectedClipId)!}
                    onUpdate={(updates) => handleUpdateClip(selectedClipId, updates)}
                    onClose={() => setActiveTab(null)}
                  />
                </div>
              )}

              {activeTab === "speed" && (
                <SpeedSheet
                  clip={project.clips.find((c) => c.id === selectedClipId) || project.clips[0]}
                  onUpdateClip={(updates) => {
                    const clipId = selectedClipId || project.clips[0]?.id;
                    if (clipId) handleUpdateClip(clipId, updates);
                  }}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "volume" && (
                <VolumeSheet
                  clip={project.clips.find((c) => c.id === selectedClipId) || project.clips[0]}
                  onUpdateClip={(updates) => {
                    const clipId = selectedClipId || project.clips[0]?.id;
                    if (clipId) handleUpdateClip(clipId, updates);
                  }}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "crop" && (
                <CropSheet
                  clip={project.clips.find((c) => c.id === selectedClipId) || project.clips[0]}
                  onUpdateClip={(updates) => {
                    const clipId = selectedClipId || project.clips[0]?.id;
                    if (clipId) handleUpdateClip(clipId, updates);
                  }}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "animations" && (
                <AnimationsSheet
                  clip={project.clips.find((c) => c.id === selectedClipId) || project.clips[0]}
                  onUpdateClip={(updates) => {
                    const activeClip = project.clips.find((c) => c.id === selectedClipId) || project.clips[0];
                    if (!activeClip) return;
                    handleUpdateClip(activeClip.id, updates);
                    if (updates.animationId !== undefined) {
                      const existingTracks = project.animationTracks || [];
                      let nextTracks = [...existingTracks];
                      const foundIdx = nextTracks.findIndex((a) => a.clipId === activeClip.id);
                      if (updates.animationId) {
                        const item: AnimationTrackItem = {
                          id: foundIdx >= 0 ? nextTracks[foundIdx].id : `anim-${Date.now()}`,
                          clipId: activeClip.id,
                          animationId: updates.animationId,
                          name: updates.animationId.replace(/_/g, " ").toUpperCase(),
                          type: updates.animationType || "in",
                          startTime: activeClip.startTime,
                          duration: updates.animationDuration || 1.2,
                        };
                        if (foundIdx >= 0) {
                          nextTracks[foundIdx] = item;
                        } else {
                          nextTracks.push(item);
                        }
                        setSelectedAnimationId(item.id);
                      } else if (foundIdx >= 0) {
                        nextTracks.splice(foundIdx, 1);
                      }
                      updateProjectWithHistory({
                        ...project,
                        animationTracks: nextTracks,
                      });
                    }
                  }}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "aspect" && (
                <AspectRatioSheet
                  project={project}
                  onSelectRatio={(ratio) => {
                    updateProjectWithHistory({ ...project, aspectRatio: ratio });
                  }}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "background" && (
                <BackgroundSheet
                  project={project}
                  onUpdateProject={(updates) => updateProjectWithHistory({ ...project, ...updates })}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "stickers" && (
                <StickersSheet
                  onAddSticker={handleAddSticker}
                  onClose={() => setActiveTab(null)}
                />
              )}

              {activeTab === "edit" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Clip Edit Studio"
                    icon={<Sliders className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <EditPanel
                      project={project}
                      selectedClipId={selectedClipId}
                      currentTime={currentTime}
                      onUpdateClip={handleUpdateClip}
                      onSplitClip={handleSplitClip}
                      onDuplicateClip={handleDuplicateClip}
                      onDeleteClip={handleDeleteClip}
                      onAddKeyframe={handleAddKeyframe}
                      onRemoveKeyframe={handleRemoveKeyframe}
                      onOpenKeyframeEditor={() => setActiveTab("keyframe")}
                    />
                  </div>
                </div>
              )}

              {activeTab === "filters" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="300 Photographic Filters & LUTs"
                    icon={<Sliders className="w-4 h-4 text-[#FFB347]" />}
                    onClose={() => setActiveTab(null)}
                    onReset={() => handleUpdateFilter("none", 0)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <FilterPanel
                      project={project}
                      onUpdateFilter={handleUpdateFilter}
                      onUpdateLUT={(lutName, lutIntensity) =>
                        updateProjectWithHistory({
                          ...project,
                          colorGrading: {
                            ...project.colorGrading,
                            lutName,
                            lutIntensity,
                          },
                        })
                      }
                      onUpdateGrading={handleUpdateGrading}
                      isBeforeAfterActive={isBeforeAfterActive}
                      onToggleBeforeAfter={() => setIsBeforeAfterActive(!isBeforeAfterActive)}
                    />
                  </div>
                </div>
              )}

              {/* SEPARATE PANEL 1: MANUAL ADJUSTMENTS (संख्या द्वारा सेट करें) */}
              {activeTab === "adjust" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Manual Adjustments (संख्या द्वारा सेट करें)"
                    icon={<SlidersHorizontal className="w-4 h-4 text-[#38bdf8]" />}
                    onClose={() => setActiveTab(null)}
                    onReset={handleResetGrading}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <AdjustPanel
                      project={project}
                      onUpdateGrading={handleUpdateGrading}
                      onResetGrading={handleResetGrading}
                      isBeforeAfterActive={isBeforeAfterActive}
                      onToggleBeforeAfter={() => setIsBeforeAfterActive(!isBeforeAfterActive)}
                    />
                  </div>
                </div>
              )}

              {/* SEPARATE PANEL 2: COLOR GRADING (कर्व ग्राफ व कलर व्हील्स) */}
              {activeTab === "color" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Color Grading (कर्व ग्राफ व कलर व्हील्स)"
                    icon={<Palette className="w-4 h-4 text-[#10b981]" />}
                    onClose={() => setActiveTab(null)}
                    onReset={handleResetGrading}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <ColorGradingPanel
                      project={project}
                      onUpdateGrading={handleUpdateGrading}
                      onResetGrading={handleResetGrading}
                      isBeforeAfterActive={isBeforeAfterActive}
                      onToggleBeforeAfter={() => setIsBeforeAfterActive(!isBeforeAfterActive)}
                    />
                  </div>
                </div>
              )}

              {activeTab === "audio" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Audio & Music Library"
                    icon={<Music className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <AudioPanel
                      project={project}
                      onAddAudioTrack={(track) =>
                        updateProjectWithHistory({
                          ...project,
                          audioTracks: [...project.audioTracks, track],
                        })
                      }
                      onAutoBeatSync={() => {
                        // Beat sync aligns clip cut points with project beat markers
                        if (project.beatMarkers && project.beatMarkers.length > 0) {
                          let lastStart = 0;
                          const beatClips = project.clips.map((c, i) => {
                            const targetEnd = project.beatMarkers![Math.min(i * 2 + 1, project.beatMarkers!.length - 1)] || c.duration;
                            const duration = Math.max(1.0, targetEnd - lastStart);
                            const updated = {
                              ...c,
                              startTime: lastStart,
                              trimStart: 0,
                              trimEnd: Math.min(c.duration, duration),
                            };
                            lastStart += duration;
                            return updated;
                          });
                          updateProjectWithHistory({
                            ...project,
                            clips: beatClips,
                            duration: parseFloat(lastStart.toFixed(2)),
                          });
                        }
                      }}
                      onDetectBeats={() => {
                        const markers = [1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8, 12.0, 13.2];
                        updateProjectWithHistory({
                          ...project,
                          beatMarkers: markers,
                        });
                      }}
                      onUpdateAudioTrack={(trackId, updates) =>
                        updateProjectWithHistory({
                          ...project,
                          audioTracks: project.audioTracks.map((a) =>
                            a.id === trackId ? { ...a, ...updates } : a
                          ),
                        })
                      }
                      onUpdateMixer={handleUpdateMixer}
                      currentTime={currentTime}
                      isPlaying={isPlaying}
                    />
                  </div>
                </div>
              )}

              {(activeTab === "song_to_text" || activeTab === "captions") && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="AI Song Lyrics & Captions"
                    icon={<FileText className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <SongToTextPanel
                      project={project}
                      currentTime={currentTime}
                      onUpdateLyrics={(lyrics) =>
                        updateProjectWithHistory({
                          ...project,
                          lyrics,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === "text" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Text & Typography"
                    icon={<Type className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <TextPanel
                      project={project}
                      currentTime={currentTime}
                      onAddTextItem={(item) =>
                        updateProjectWithHistory({
                          ...project,
                          textTracks: [...project.textTracks, item],
                        })
                      }
                      onUpdateTextItem={(id, updates) =>
                        updateProjectWithHistory({
                          ...project,
                          textTracks: project.textTracks.map((t) =>
                            t.id === id ? { ...t, ...updates } : t
                          ),
                        })
                      }
                      onDeleteTextItem={(id) =>
                        updateProjectWithHistory({
                          ...project,
                          textTracks: project.textTracks.filter((t) => t.id !== id),
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === "effects" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Video VFX & Transitions"
                    icon={<Sparkles className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <EffectsPanel
                      project={project}
                      currentTime={currentTime}
                      onAddEffect={(effect) =>
                        updateProjectWithHistory({
                          ...project,
                          effects: [...project.effects, effect],
                        })
                      }
                      onRemoveEffect={(effectId) =>
                        updateProjectWithHistory({
                          ...project,
                          effects: project.effects.filter((e) => e.id !== effectId),
                        })
                      }
                      onSetTransition={(transition) => {
                        const filtered = project.transitions.filter(
                          (t) => t.clipIndex !== transition.clipIndex
                        );
                        updateProjectWithHistory({
                          ...project,
                          transitions: [...filtered, transition],
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="AI Creative Studio"
                    icon={<Sparkles className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <AIPanel
                      project={project}
                      onApplyAIGrading={(grading, filter) => {
                        updateProjectWithHistory({
                          ...project,
                          colorGrading: { ...project.colorGrading, ...grading },
                          activeFilter: filter,
                        });
                      }}
                      onApplySmartCut={() => setIsSmartCutModalOpen(true)}
                      onAutoReframe={() => {
                        updateProjectWithHistory({
                          ...project,
                          aspectRatio: "9:16",
                          clips: project.clips.map((c) => ({
                            ...c,
                            scale: 1.35,
                            x: 0,
                            y: 0,
                          })),
                        });
                      }}
                      onAutoCaptions={() => {
                        const autoCaptions: TextItem[] = [
                          {
                            id: `txt-cap-1-${Date.now()}`,
                            text: "Welcome to Mobile Edit Studio",
                            startTime: 0.5,
                            duration: 3.5,
                            x: 50,
                            y: 80,
                            fontSize: 24,
                            fontFamily: "'Montserrat', sans-serif",
                            color: "#FFFFFF",
                            outlineColor: "#000000",
                            outlineWidth: 2,
                            shadowColor: "rgba(0,0,0,0.8)",
                            shadowBlur: 8,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            animation: "karaoke",
                          },
                        ];
                        updateProjectWithHistory({
                          ...project,
                          textTracks: [...project.textTracks, ...autoCaptions],
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === "templates" && (
                <div className="flex flex-col h-full bg-[#121218]">
                  <SheetHeader
                    title="Style Templates"
                    icon={<Sparkles className="w-4 h-4" />}
                    onClose={() => setActiveTab(null)}
                  />
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <TemplatesPanel
                      onApplyTemplate={(tmpl) => {
                        updateProjectWithHistory({
                          ...project,
                          title: `${tmpl.name} Edit`,
                          activeFilter: tmpl.filter,
                          filterIntensity: 85,
                          aspectRatio: tmpl.aspectRatio,
                          duration: tmpl.duration,
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Toolbar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            selectedClipId={selectedClipId}
            onDeselectClip={() => setSelectedClipId(null)}
            onSelectActiveClip={() => {
              const clipId = selectedClipId || project.clips[0]?.id || null;
              setSelectedClipId(clipId);
            }}
            onSplitClip={handleSplitClip}
            onDeleteClip={handleDeleteClip}
            onDuplicateClip={handleDuplicateClip}
            onReverseClip={handleReverseClip}
            onMoveClipLeft={() => selectedClipId && handleMoveClip(selectedClipId, "left")}
            onMoveClipRight={() => selectedClipId && handleMoveClip(selectedClipId, "right")}
            onOpenReorderModal={() => setIsReorderModalOpen(true)}
            onReplaceClip={() => {
              setIsNewProjectMode(false);
              setIsAddMediaModalOpen(true);
            }}
            onToggleKeyframe={handleToggleKeyframeAtPlayhead}
            onOpenAddMedia={() => {
              setIsNewProjectMode(false);
              setIsAddMediaModalOpen(true);
            }}
          />
          )}
        </div>
      )}

      {/* MODALS */}
      {/* 1. Reorder Clips Modal (फोटो या वीडियो क्लिप्स आगे पीछे करना) */}
      <ReorderClipsModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        clips={project.clips}
        selectedClipId={selectedClipId}
        onSelectClip={setSelectedClipId}
        onApplyReorder={handleReorderClips}
      />

      {/* 2. AI Smart Cut Review & Adjustment Modal */}
      <SmartCutModal
        isOpen={isSmartCutModalOpen}
        onClose={() => setIsSmartCutModalOpen(false)}
        project={project}
        onApplyCuts={handleApplySmartCuts}
        onSeekToTime={(time) => {
          handleTimeUpdate(time);
        }}
      />

      {/* 2. AI Intelligence Modal */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        project={project}
        onApplyDirectorAdvice={() => setActiveTab("ai")}
        onApplyAutoColor={() => {
          handleUpdateGrading({
            contrast: 1.22,
            saturation: 1.18,
            temperature: 8,
            tint: -4,
            vignette: 0.3,
          });
          handleUpdateFilter("Teal & Orange", 85);
          setIsAIModalOpen(false);
        }}
        onApplySmartCut={() => {
          setIsAIModalOpen(false);
          setIsSmartCutModalOpen(true);
        }}
        onAutoReframe={() => {
          updateProjectWithHistory({
            ...project,
            aspectRatio: "9:16",
            clips: project.clips.map((c) => ({
              ...c,
              scale: 1.35,
              x: 0,
              y: 0,
            })),
          });
          setIsAIModalOpen(false);
        }}
      />

      {/* 3. Add Video / Photo Layer Modal */}
      <AddMediaModal
        isOpen={isAddMediaModalOpen}
        onClose={() => {
          setIsAddMediaModalOpen(false);
          setIsNewProjectMode(false);
        }}
        onAddClip={handleAddClip}
        onAddClips={handleAddClips}
        isNewProjectMode={isNewProjectMode}
        initialAspectRatio={newProjectRatio}
        onCreateProjectWithMedia={handleCreateProjectWithMedia}
        onStartBlankProject={handleStartBlankProject}
      />

      {/* 4. Export Studio Render Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        onSaveExportedVideo={handleSaveExportedVideo}
      />
      {/* 5. Generic AI Feature Modal for Home Screen */}
      <AIFeatureModal
        isOpen={!!activeAIFeature}
        onClose={() => setActiveAIFeature(null)}
        featureId={activeAIFeature || ""}
      />

      <PWABadge />
    </div>
  );
}
