import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Clip, VideoProject, FilterTrackItem, AnimationTrackItem, AudioMixerSettings, AudioTrackItem } from "../types";
import { DEFAULT_AUDIO_MIXER, computeDuckingSpans } from "../utils/audioDucking";
import { 
  VolumeX,
  Volume2,
  Volume1,
  Image as ImageIcon,
  Plus, 
  Music, 
  Mic,
  Zap,
  Waves,
  Type, 
  Sparkles, 
  Film,
  Diamond,
  Edit2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Clock,
  ChevronUp,
  ChevronDown,
  GripHorizontal,
  Minus,
  Check,
  Sliders,
  SlidersHorizontal,
  Trash2,
  X,
  PlaySquare,
  ArrowLeftRight,
  Sparkle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Split,
  Copy
} from "lucide-react";
import { ReorderClipsModal } from "./modals/ReorderClipsModal";
import { TimelineAudioSection } from "./timeline/TimelineAudioSection";

interface TimelineProps {
  project: VideoProject;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onSplitClip: () => void;
  onDuplicateClip: () => void;
  onDeleteClip: () => void;
  onOpenAddMediaModal: () => void;
  onOpenAddAudioModal: () => void;
  onOpenAddTextModal: () => void;
  onOpenFilterDrawer?: () => void;
  onOpenAnimationDrawer?: () => void;
  onUpdateClipTrim: (clipId: string, trimStart: number, trimEnd: number) => void;
  onToggleKeyframeAtPlayhead?: () => void;
  onOpenKeyframeEditor?: () => void;
  onOpenSmartCut?: () => void;
  onUpdateDuration?: (newDuration: number) => void;
  // Move / Reorder clips (आगे-पीछे करना)
  onMoveClip?: (clipId: string, direction: "left" | "right") => void;
  onReorderClips?: (reorderedClips: Clip[]) => void;
  // Filter & Animation Timeline props
  selectedFilterId?: string | null;
  onSelectFilter?: (filterId: string | null) => void;
  selectedAnimationId?: string | null;
  onSelectAnimation?: (animationId: string | null) => void;
  onUpdateFilterItem?: (filterId: string, updates: Partial<FilterTrackItem>) => void;
  onAddFilterItem?: () => void;
  onDeleteFilterItem?: (filterId: string) => void;
  onUpdateAnimationItem?: (animationId: string, updates: Partial<AnimationTrackItem>) => void;
  onAddAnimationItem?: () => void;
  onDeleteAnimationItem?: (animationId: string) => void;
  // Multi-Track Audio Timeline & Ducking props
  onUpdateMixer?: (mixer: AudioMixerSettings) => void;
  onOpenMixerModal?: () => void;
  onUpdateAudioTrack?: (trackId: string, updates: Partial<AudioTrackItem>) => void;
  onDeleteAudioTrack?: (trackId: string) => void;
  onDuplicateAudioTrack?: (trackId: string) => void;
  onAddAudioTrack?: (track: AudioTrackItem) => void;
  selectedAudioTrackId?: string | null;
  onSelectAudioTrack?: (trackId: string | null) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentTime,
  onTimeUpdate,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onDuplicateClip,
  onDeleteClip,
  onOpenAddMediaModal,
  onOpenAddAudioModal,
  onOpenAddTextModal,
  onOpenFilterDrawer,
  onOpenAnimationDrawer,
  onUpdateClipTrim,
  onToggleKeyframeAtPlayhead,
  onOpenKeyframeEditor,
  onOpenSmartCut,
  onUpdateDuration,
  onMoveClip,
  onReorderClips,
  selectedFilterId,
  onSelectFilter,
  selectedAnimationId,
  onSelectAnimation,
  onUpdateFilterItem,
  onAddFilterItem,
  onDeleteFilterItem,
  onUpdateAnimationItem,
  onAddAnimationItem,
  onDeleteAnimationItem,
  onUpdateMixer,
  onOpenMixerModal,
  onUpdateAudioTrack,
  onDeleteAudioTrack,
  onDuplicateAudioTrack,
  onAddAudioTrack,
  selectedAudioTrackId,
  onSelectAudioTrack,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 1. HORIZONTAL ZOOM (चोड़ा करना)
  const [zoomLevel, setZoomLevel] = useState<number>(40); // 12 to 180 px/s

  // 2. VERTICAL HEIGHT (बड़ा करना)
  const [timelineHeight, setTimelineHeight] = useState<number>(240); // 160 to 650 px
  const [isResizingHeight, setIsResizingHeight] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // 3. DURATION EDIT MODAL (टाइमलाइन के टाइम को खुद ही बढ़ाना या घटाना)
  const [showDurationModal, setShowDurationModal] = useState<boolean>(false);
  const [customDurationInput, setCustomDurationInput] = useState<number>(project.duration || 15);

  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [coverThumbnail, setCoverThumbnail] = useState<string | null>(null);
  const [showCoverModal, setShowCoverModal] = useState<boolean>(false);

  // 4. CLIP DRAG & REORDER STATE (फोटो / वीडियो को आसानी से आगे-पीछे करना)
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const [clipDragDeltaX, setClipDragDeltaX] = useState<number>(0);
  const [hoverSwapTargetId, setHoverSwapTargetId] = useState<string | null>(null);
  const [showReorderModal, setShowReorderModal] = useState<boolean>(false);

  const totalDuration = Math.max(project.duration || 10, 10);
  const timelineWidth = Math.max(totalDuration * zoomLevel + 240, 700);

  // Format seconds to mm:ss or mm:ss.s
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Keep input synchronized when project duration changes
  useEffect(() => {
    setCustomDurationInput(project.duration || 15);
  }, [project.duration]);

  // Height Resizing via top drag handle
  const handleHeightResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizingHeight(true);
    const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const startHeight = timelineHeight;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientY = "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      // Dragging upward increases timeline height
      const deltaY = startY - clientY;
      const newHeight = Math.max(160, Math.min(650, startHeight + deltaY));
      setTimelineHeight(newHeight);
    };

    const onUp = () => {
      setIsResizingHeight(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // Quick duration delta adjust (+5s, -5s)
  const handleDurationDelta = (deltaSeconds: number) => {
    if (!onUpdateDuration) return;
    const currentDur = project.duration || 15;
    const newDur = Math.max(2, Math.round(currentDur + deltaSeconds));
    onUpdateDuration(newDur);
  };

  // Apply custom typed duration
  const handleApplyCustomDuration = () => {
    if (!onUpdateDuration) return;
    const clamped = Math.max(2, Math.min(3600, customDurationInput));
    onUpdateDuration(clamped);
    setShowDurationModal(false);
  };

  // Auto-fit zoom to window width
  const handleFitZoom = () => {
    if (!scrollContainerRef.current) return;
    const availableWidth = scrollContainerRef.current.clientWidth - 100;
    const fittedZoom = Math.max(12, Math.min(180, Math.floor(availableWidth / totalDuration)));
    setZoomLevel(fittedZoom);
  };

  // Auto-scroll timeline to keep playhead in view when playing (never when scrubbing or dragging)
  useEffect(() => {
    if (!scrollContainerRef.current || isScrubbing || draggingClipId) return;
    const playheadPx = currentTime * zoomLevel;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;

    if (playheadPx > scrollLeft + clientWidth - 70 || playheadPx < scrollLeft + 30) {
      container.scrollLeft = Math.max(0, playheadPx - clientWidth / 2);
    }
  }, [currentTime, zoomLevel, isScrubbing, draggingClipId]);

  // Scrub animation frame ref for 60fps non-blocking timeline scrub
  const scrubRafRef = useRef<number | null>(null);

  // Handle timeline scrub by clicking/dragging ruler
  const handleTimelineScrub = useCallback((clientX: number) => {
    if (!scrollContainerRef.current) return;
    if (scrubRafRef.current) cancelAnimationFrame(scrubRafRef.current);

    scrubRafRef.current = requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const clickX = clientX - rect.left + scrollLeft;
      const newTime = Math.max(0, Math.min(totalDuration, clickX / zoomLevel));
      onTimeUpdate(parseFloat(newTime.toFixed(3)));
    });
  }, [totalDuration, zoomLevel, onTimeUpdate]);

  const handleMouseDownScrub = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") || 
      target.closest("input") || 
      target.closest(".cursor-ew-resize") || 
      target.closest("[data-no-scrub]")
    ) {
      return;
    }
    setIsScrubbing(true);
    handleTimelineScrub(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleTimelineScrub(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsScrubbing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleTouchStartScrub = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") || 
      target.closest("input") || 
      target.closest(".cursor-ew-resize") || 
      target.closest("[data-no-scrub]")
    ) {
      return;
    }
    setIsScrubbing(true);
    handleTimelineScrub(e.touches[0].clientX);

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault();
      handleTimelineScrub(moveEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      setIsScrubbing(false);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  };

  // Handle trimming drag for selected clip
  const handleTrimDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    clip: Clip,
    handle: "start" | "end"
  ) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const startTrim = handle === "start" ? clip.trimStart : clip.trimEnd;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaSec = (curX - clientX) / zoomLevel;

      if (handle === "start") {
        const newStart = Math.max(0, Math.min(clip.trimEnd - 0.5, startTrim + deltaSec));
        onUpdateClipTrim(clip.id, parseFloat(newStart.toFixed(2)), clip.trimEnd);
      } else {
        const newEnd = Math.max(clip.trimStart + 0.5, Math.min(clip.duration, startTrim + deltaSec));
        onUpdateClipTrim(clip.id, clip.trimStart, parseFloat(newEnd.toFixed(2)));
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // Handle smooth horizontal drag & reorder for photo / video clips (आसानी से आगे-पीछे करना)
  const handleClipBodyDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    clip: Clip
  ) => {
    // Prevent starting reorder if clicking trim handles or buttons
    const target = e.target as HTMLElement;
    if (target.closest(".cursor-ew-resize") || target.closest("button") || target.closest("input")) {
      return;
    }

    onSelectClip(clip.id);
    const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clipOriginalLeft = clip.startTime * zoomLevel;
    const clipTrimmedDuration = (clip.trimEnd - clip.trimStart) / (clip.speed || 1);
    const clipWidth = Math.max(36, clipTrimmedDuration * zoomLevel);
    let hasMoved = false;
    let rafId: number | null = null;
    let latestCurX = startX;

    const processDragFrame = () => {
      const deltaX = latestCurX - startX;

      if (!hasMoved && Math.abs(deltaX) > 4) {
        hasMoved = true;
        setDraggingClipId(clip.id);
      }

      if (hasMoved) {
        setClipDragDeltaX(deltaX);

        // Find which clip slot we are hovering over based on center of dragged clip
        const draggedCenter = clipOriginalLeft + deltaX + clipWidth / 2;
        const candidate = project.clips.find((c) => {
          if (c.id === clip.id) return false;
          const cLeft = c.startTime * zoomLevel;
          const cDur = ((c.trimEnd - c.trimStart) / (c.speed || 1)) * zoomLevel;
          return draggedCenter >= cLeft && draggedCenter <= cLeft + cDur;
        });

        setHoverSwapTargetId(candidate ? candidate.id : null);
      }
      rafId = null;
    };

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if ("cancelable" in moveEvent && moveEvent.cancelable) {
        moveEvent.preventDefault();
      }
      latestCurX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      if (!rafId) {
        rafId = requestAnimationFrame(processDragFrame);
      }
    };

    const onUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);

      if (hasMoved) {
        setHoverSwapTargetId((currentSwapTarget) => {
          if (currentSwapTarget && currentSwapTarget !== clip.id) {
            const clips = [...project.clips];
            const fromIdx = clips.findIndex((c) => c.id === clip.id);
            const toIdx = clips.findIndex((c) => c.id === currentSwapTarget);

            if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
              const [movedItem] = clips.splice(fromIdx, 1);
              clips.splice(toIdx, 0, movedItem);
              onReorderClips?.(clips);
            }
          }
          return null;
        });
        setDraggingClipId(null);
        setClipDragDeltaX(0);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  // Internal selection fallback for filter & animation if not controlled from outside
  const [internalSelectedFilterId, setInternalSelectedFilterId] = useState<string | null>(null);
  const [internalSelectedAnimationId, setInternalSelectedAnimationId] = useState<string | null>(null);

  const activeSelectedFilterId = selectedFilterId !== undefined ? selectedFilterId : internalSelectedFilterId;
  const activeSelectedAnimationId = selectedAnimationId !== undefined ? selectedAnimationId : internalSelectedAnimationId;

  const handleSelectFilterItem = (filterId: string | null) => {
    onSelectClip(null);
    if (onSelectAnimation) onSelectAnimation(null);
    setInternalSelectedAnimationId(null);
    if (onSelectFilter) {
      onSelectFilter(filterId);
    } else {
      setInternalSelectedFilterId(filterId);
    }
  };

  const handleSelectAnimationItem = (animId: string | null) => {
    onSelectClip(null);
    if (onSelectFilter) onSelectFilter(null);
    setInternalSelectedFilterId(null);
    if (onSelectAnimation) {
      onSelectAnimation(animId);
    } else {
      setInternalSelectedAnimationId(animId);
    }
  };

  // Keyboard shortcut: Delete / Backspace key to delete selected filter or animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (activeSelectedFilterId) {
          e.preventDefault();
          onDeleteFilterItem?.(activeSelectedFilterId);
          handleSelectFilterItem(null);
        } else if (activeSelectedAnimationId) {
          e.preventDefault();
          onDeleteAnimationItem?.(activeSelectedAnimationId);
          handleSelectAnimationItem(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSelectedFilterId, activeSelectedAnimationId, onDeleteFilterItem, onDeleteAnimationItem]);

  // Trimming / Stretching handle for selected filter block (बड़ा या घटाएं)
  const handleFilterTrimDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    filterItem: FilterTrackItem,
    handle: "start" | "end"
  ) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const initialStart = filterItem.startTime;
    const initialDur = filterItem.duration;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaSec = (curX - clientX) / zoomLevel;

      if (handle === "start") {
        const newStart = Math.max(0, initialStart + deltaSec);
        const newDur = Math.max(0.3, initialDur - (newStart - initialStart));
        onUpdateFilterItem?.(filterItem.id, {
          startTime: parseFloat(newStart.toFixed(2)),
          duration: parseFloat(newDur.toFixed(2)),
        });
      } else {
        const newDur = Math.max(0.3, initialDur + deltaSec);
        onUpdateFilterItem?.(filterItem.id, {
          duration: parseFloat(newDur.toFixed(2)),
        });
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // Trimming / Stretching handle for selected animation block (बड़ा या घटाएं)
  const handleAnimationTrimDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    animItem: AnimationTrackItem,
    handle: "start" | "end"
  ) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const initialStart = animItem.startTime;
    const initialDur = animItem.duration;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaSec = (curX - clientX) / zoomLevel;

      if (handle === "start") {
        const newStart = Math.max(0, initialStart + deltaSec);
        const newDur = Math.max(0.2, initialDur - (newStart - initialStart));
        onUpdateAnimationItem?.(animItem.id, {
          startTime: parseFloat(newStart.toFixed(2)),
          duration: parseFloat(newDur.toFixed(2)),
        });
      } else {
        const newDur = Math.max(0.2, initialDur + deltaSec);
        onUpdateAnimationItem?.(animItem.id, {
          duration: parseFloat(newDur.toFixed(2)),
        });
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // Harmonized animation items: from project.animationTracks plus clip-bound animations
  const effectiveAnimationTracks: AnimationTrackItem[] = useMemo(() => {
    const list: AnimationTrackItem[] = [...(project.animationTracks || [])];
    // Add any clip animations not yet represented
    project.clips.forEach((c) => {
      if (c.animationId && !list.some((a) => a.clipId === c.id)) {
        list.push({
          id: `anim-clip-${c.id}`,
          clipId: c.id,
          animationId: c.animationId,
          name: c.animationId.replace(/_/g, " ").toUpperCase(),
          type: c.animationType || "in",
          startTime: c.startTime,
          duration: c.animationDuration || 1.2,
        });
      }
    });
    return list;
  }, [project.animationTracks, project.clips]);

  // Harmonized filter items: from project.filterTracks plus project.activeFilter fallback
  const effectiveFilterTracks: FilterTrackItem[] = useMemo(() => {
    if (project.filterTracks && project.filterTracks.length > 0) {
      return project.filterTracks;
    }
    if (project.activeFilter && project.activeFilter !== "none") {
      return [
        {
          id: "flt-default-global",
          filter: project.activeFilter,
          name: project.activeFilter,
          startTime: 0,
          duration: totalDuration,
          intensity: project.filterIntensity || 80,
        },
      ];
    }
    return [];
  }, [project.filterTracks, project.activeFilter, project.filterIntensity, totalDuration]);

  const currentSelectedFilter = effectiveFilterTracks.find((f) => f.id === activeSelectedFilterId);
  const currentSelectedAnim = effectiveAnimationTracks.find((a) => a.id === activeSelectedAnimationId);
  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;
  const selectedClipIndex = project.clips.findIndex((c) => c.id === selectedClipId);

  // Audio track selection
  const [internalSelectedAudioId, setInternalSelectedAudioId] = useState<string | null>(null);
  const activeSelectedAudioId = selectedAudioTrackId !== undefined ? selectedAudioTrackId : internalSelectedAudioId;

  const handleSelectAudioTrack = (id: string | null) => {
    setInternalSelectedAudioId(id);
    onSelectAudioTrack?.(id);
    if (id) {
      onSelectClip(null);
      handleSelectFilterItem(null);
      handleSelectAnimationItem(null);
    }
  };

  const rulerTicks = useMemo(() => {
    const count = Math.ceil(totalDuration / 2) + 4;
    return Array.from({ length: count }, (_, i) => i * 2);
  }, [totalDuration]);

  const currentCover = coverThumbnail || project.clips[0]?.url || project.thumbnail;
  const effectiveHeight = isMaximized ? 540 : timelineHeight;

  return (
    <div 
      className="flex flex-col bg-[#0E0E12] border-t border-[#1E1E26] select-none shrink-0 overflow-hidden relative transition-[height] duration-75"
      style={{ height: `${effectiveHeight}px` }}
    >
      {/* 1. TOP RESIZER BAR (टाइमलाइन को बड़ा या छोटा करने के लिए ड्रैग करें) */}
      <div 
        onMouseDown={handleHeightResizeStart}
        onTouchStart={handleHeightResizeStart}
        className={`h-2.5 w-full bg-[#121218] hover:bg-[#FFB347]/30 border-b border-[#1E1E28] cursor-row-resize flex items-center justify-center group transition-colors select-none ${
          isResizingHeight ? "bg-[#FFB347]/50" : ""
        }`}
        title="Drag up or down to resize timeline height"
      >
        <div className="w-16 h-1 rounded-full bg-white/20 group-hover:bg-[#FFB347] transition-colors" />
      </div>

      {/* 2. TIMELINE CONTROL BAR: Timecode, Duration Scaling (+/- 5s), Height & Zoom Presets */}
      <div className="h-9 px-3 bg-[#0E0E12] border-b border-[#1A1A24] flex items-center justify-between z-20 shrink-0 gap-2">
        {/* Left: Timecode + Duration Adjuster ("टाइमलाइन के टाइम को खुद ही बड़ा या घटा सके") */}
        <div className="flex items-center gap-2">
          {/* Current playhead timecode */}
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-white">
            <span className="text-[#00E5FF] font-bold">{formatTime(currentTime)}</span>
            <span className="text-white/40">/</span>
          </div>

          {/* Interactive Project Duration Pill with +/- 5s Quick Buttons */}
          <div className="flex items-center bg-[#181822] rounded-lg border border-[#282838] p-0.5 shadow-sm">
            {/* Decrease Duration by 5s */}
            <button
              onClick={() => handleDurationDelta(-5)}
              className="w-5 h-5 rounded hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors active:scale-90"
              title="Decrease timeline duration by 5s"
            >
              <Minus className="w-3 h-3" />
            </button>

            {/* Clickable Duration Display that opens the Exact Duration Editor */}
            <button
              id="btn-timeline-duration-modal"
              onClick={() => setShowDurationModal(true)}
              className="px-2 py-0.5 text-xs font-mono font-bold text-[#FFB347] hover:text-white flex items-center gap-1 hover:underline transition-all"
              title="Click to manually edit project duration"
            >
              <Clock className="w-3 h-3 text-[#FFB347]" />
              <span>{formatTime(totalDuration)} ({totalDuration.toFixed(1)}s)</span>
            </button>

            {/* Increase Duration by 5s */}
            <button
              onClick={() => handleDurationDelta(5)}
              className="w-5 h-5 rounded hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors active:scale-90"
              title="Increase timeline duration by 5s"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Reorder Button (फोटो/वीडियो आगे पीछे करें) */}
          <button
            type="button"
            data-no-scrub="true"
            onClick={() => setShowReorderModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 text-[11px] font-bold transition-all active:scale-95 shadow-sm"
            title="Reorder photo & video clips (फोटो या वीडियो क्लिप्स आगे-पीछे करें)"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden md:inline">Reorder Clips</span>
            <span className="text-[9px] px-1 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-mono">आगे-पीछे</span>
          </button>
        </div>

        {/* Center/Right: Height presets & Zoom Controls ("जितना चोड़ा या बड़ा कर सके") */}
        <div className="flex items-center gap-2">
          {/* Height Quick Presets */}
          <div className="hidden sm:flex items-center bg-[#14141C] p-0.5 rounded-lg border border-[#222230] text-[10px] text-white/60">
            {[
              { label: "Compact", h: 180 },
              { label: "Normal", h: 250 },
              { label: "Large", h: 360 },
              { label: "Studio", h: 500 },
            ].map((p) => (
              <button
                key={p.h}
                onClick={() => {
                  setTimelineHeight(p.h);
                  setIsMaximized(false);
                }}
                className={`px-2 py-0.5 rounded transition-all ${
                  !isMaximized && timelineHeight === p.h
                    ? "bg-[#FFB347] text-black font-bold"
                    : "hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Maximize / Minimize Timeline Toggle */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded-lg bg-[#181822] hover:bg-[#222230] text-white/70 hover:text-white transition-colors border border-[#282838]"
            title={isMaximized ? "Restore timeline height" : "Maximize timeline height"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* Horizontal Zoom Controls ("जितना चोड़ा कर सके") */}
          <div className="flex items-center gap-1 bg-[#14141C] p-0.5 rounded-lg border border-[#222230]">
            <button 
              onClick={() => setZoomLevel(Math.max(12, zoomLevel - 8))}
              className="p-1 text-white/60 hover:text-white rounded"
              title="Zoom out (condense width)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Quick Fit Zoom */}
            <button
              onClick={handleFitZoom}
              className="px-1.5 py-0.5 text-[10px] font-mono text-white/70 hover:text-white hover:bg-white/10 rounded"
              title="Fit entire project to screen"
            >
              Fit
            </button>

            {/* Quick 2x Zoom */}
            <button
              onClick={() => setZoomLevel(70)}
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                zoomLevel === 70 ? "bg-[#00E5FF] text-black font-bold" : "text-white/70 hover:text-white"
              }`}
            >
              2x
            </button>

            {/* Quick 4x Zoom (Super Wide) */}
            <button
              onClick={() => setZoomLevel(140)}
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                zoomLevel === 140 ? "bg-[#00E5FF] text-black font-bold" : "text-white/70 hover:text-white"
              }`}
              title="Super wide multi-frame zoom"
            >
              Max
            </button>

            <button 
              onClick={() => setZoomLevel(Math.min(180, zoomLevel + 8))}
              className="p-1 text-white/60 hover:text-white rounded"
              title="Zoom in (expand width)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING QUICK ADJUSTER DOCK: Appears whenever Filter or Animation is selected (बड़ा या घटाएं) */}
      {currentSelectedFilter && (
        <div className="h-10 px-3 bg-[#1F170B] border-b border-[#F59E0B]/40 flex items-center justify-between text-xs z-30 shrink-0 gap-2 overflow-x-auto no-scrollbar animate-in fade-in duration-150">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1 rounded bg-[#F59E0B]/20 text-[#F59E0B]">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white truncate max-w-[130px]">
              {currentSelectedFilter.name}
            </span>
            <span className="text-[10px] font-mono text-[#FDE68A] font-bold px-1.5 py-0.5 bg-[#F59E0B]/20 rounded border border-[#F59E0B]/30">
              {currentSelectedFilter.duration.toFixed(1)}s
            </span>
          </div>

          {/* Stepper Buttons for Bada / Ghata (बड़ा या घटाएं) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-white/50 hidden sm:inline">Timeline Duration:</span>
            
            <button
              onClick={() => {
                const newDur = Math.max(0.5, parseFloat((currentSelectedFilter.duration - 0.5).toFixed(1)));
                onUpdateFilterItem?.(currentSelectedFilter.id, { duration: newDur });
              }}
              className="px-2 py-0.5 rounded-lg bg-black/50 hover:bg-[#F59E0B]/20 text-white font-mono font-bold flex items-center gap-1 border border-white/10 active:scale-95 text-[11px]"
              title="Filter time ghataye (-0.5s)"
            >
              <Minus className="w-3 h-3 text-[#F59E0B]" /> 0.5s
            </button>

            <button
              onClick={() => {
                const newDur = parseFloat((currentSelectedFilter.duration + 0.5).toFixed(1));
                onUpdateFilterItem?.(currentSelectedFilter.id, { duration: newDur });
              }}
              className="px-2 py-0.5 rounded-lg bg-black/50 hover:bg-[#F59E0B]/20 text-white font-mono font-bold flex items-center gap-1 border border-white/10 active:scale-95 text-[11px]"
              title="Filter time badhaye (+0.5s)"
            >
              <Plus className="w-3 h-3 text-[#F59E0B]" /> 0.5s
            </button>

            {/* Stretch across full video */}
            <button
              onClick={() => {
                onUpdateFilterItem?.(currentSelectedFilter.id, { startTime: 0, duration: totalDuration });
              }}
              className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#FDE68A] font-semibold text-[10px] border border-[#F59E0B]/30"
              title="Stretch filter across entire video"
            >
              <ArrowLeftRight className="w-3 h-3" /> Full Video
            </button>

            {/* Slider for smooth dragging */}
            <div className="hidden lg:flex items-center gap-1 ml-1">
              <span className="text-[9px] text-white/50">Length:</span>
              <input
                type="range"
                min="0.5"
                max={Math.max(10, totalDuration)}
                step="0.1"
                value={currentSelectedFilter.duration}
                onChange={(e) => {
                  onUpdateFilterItem?.(currentSelectedFilter.id, { duration: parseFloat(e.target.value) });
                }}
                className="w-20 accent-[#F59E0B] cursor-pointer h-1.5 bg-black/50 rounded-lg"
              />
            </div>

            {/* Intensity slider */}
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <span className="text-[9px] text-white/50">Intensity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={currentSelectedFilter.intensity}
                onChange={(e) => {
                  onUpdateFilterItem?.(currentSelectedFilter.id, { intensity: parseInt(e.target.value) });
                }}
                className="w-16 accent-[#F59E0B] cursor-pointer h-1.5 bg-black/50 rounded-lg"
              />
              <span className="text-[10px] font-mono text-[#FDE68A]">{currentSelectedFilter.intensity}%</span>
            </div>

            {onOpenFilterDrawer && (
              <button
                onClick={onOpenFilterDrawer}
                className="px-2 py-0.5 rounded-lg bg-[#F59E0B] text-black font-bold text-[10px] hover:bg-[#F59E0B]/90 shadow-sm"
              >
                Change
              </button>
            )}

            <button
              onClick={() => {
                onDeleteFilterItem?.(currentSelectedFilter.id);
                handleSelectFilterItem(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-white font-bold bg-[#FF5252]/80 hover:bg-[#FF5252] rounded-lg shadow-sm text-[11px] active:scale-95 transition-all"
              title="Delete filter (फ़िल्टर हटाएं)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => handleSelectFilterItem(null)}
              className="p-1 text-white/60 hover:text-white rounded hover:bg-white/10"
              title="Close filter editor"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING QUICK ADJUSTER DOCK: Appears whenever Animation is selected (बड़ा या घटाएं) */}
      {currentSelectedAnim && (
        <div className="h-10 px-3 bg-[#1A102A] border-b border-[#A855F7]/40 flex items-center justify-between text-xs z-30 shrink-0 gap-2 overflow-x-auto no-scrollbar animate-in fade-in duration-150">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1 rounded bg-[#A855F7]/20 text-[#A855F7]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white truncate max-w-[130px]">
              {currentSelectedAnim.name}
            </span>
            <span className="text-[10px] font-mono text-[#E9D5FF] font-bold px-1.5 py-0.5 bg-[#A855F7]/20 rounded border border-[#A855F7]/30">
              {currentSelectedAnim.duration.toFixed(1)}s
            </span>
          </div>

          {/* Stepper Buttons for Bada / Ghata (बड़ा या घटाएं) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-white/50 hidden sm:inline">Anim Duration:</span>

            <button
              onClick={() => {
                const newDur = Math.max(0.2, parseFloat((currentSelectedAnim.duration - 0.2).toFixed(1)));
                onUpdateAnimationItem?.(currentSelectedAnim.id, { duration: newDur });
              }}
              className="px-2 py-0.5 rounded-lg bg-black/50 hover:bg-[#A855F7]/20 text-white font-mono font-bold flex items-center gap-1 border border-white/10 active:scale-95 text-[11px]"
              title="Animation time ghataye (-0.2s)"
            >
              <Minus className="w-3 h-3 text-[#A855F7]" /> 0.2s
            </button>

            <button
              onClick={() => {
                const newDur = parseFloat((currentSelectedAnim.duration + 0.2).toFixed(1));
                onUpdateAnimationItem?.(currentSelectedAnim.id, { duration: newDur });
              }}
              className="px-2 py-0.5 rounded-lg bg-black/50 hover:bg-[#A855F7]/20 text-white font-mono font-bold flex items-center gap-1 border border-white/10 active:scale-95 text-[11px]"
              title="Animation time badhaye (+0.2s)"
            >
              <Plus className="w-3 h-3 text-[#A855F7]" /> 0.2s
            </button>

            {/* Fit duration to matching clip */}
            <button
              onClick={() => {
                const linkedClip = project.clips.find((c) => c.id === currentSelectedAnim.clipId);
                if (linkedClip) {
                  const clipDur = (linkedClip.trimEnd - linkedClip.trimStart) / (linkedClip.speed || 1);
                  onUpdateAnimationItem?.(currentSelectedAnim.id, { duration: parseFloat(clipDur.toFixed(1)) });
                } else {
                  onUpdateAnimationItem?.(currentSelectedAnim.id, { duration: 3.0 });
                }
              }}
              className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#A855F7]/20 hover:bg-[#A855F7]/30 text-[#E9D5FF] font-semibold text-[10px] border border-[#A855F7]/30"
              title="Fit duration to matching clip length"
            >
              <ArrowLeftRight className="w-3 h-3" /> Fit to Clip
            </button>

            {/* Slider for smooth speed/duration adjustment */}
            <div className="hidden lg:flex items-center gap-1 ml-1">
              <span className="text-[9px] text-white/50">Length:</span>
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.1"
                value={currentSelectedAnim.duration}
                onChange={(e) => {
                  onUpdateAnimationItem?.(currentSelectedAnim.id, { duration: parseFloat(e.target.value) });
                }}
                className="w-20 accent-[#A855F7] cursor-pointer h-1.5 bg-black/50 rounded-lg"
              />
            </div>

            {onOpenAnimationDrawer && (
              <button
                onClick={onOpenAnimationDrawer}
                className="px-2 py-0.5 rounded-lg bg-[#A855F7] text-white font-bold text-[10px] hover:bg-[#A855F7]/90 shadow-sm"
              >
                200+ Presets
              </button>
            )}

            <button
              onClick={() => {
                onDeleteAnimationItem?.(currentSelectedAnim.id);
                handleSelectAnimationItem(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-white font-bold bg-[#FF5252]/80 hover:bg-[#FF5252] rounded-lg shadow-sm text-[11px] active:scale-95 transition-all"
              title="Delete animation (एनिमेशन हटाएं)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => handleSelectAnimationItem(null)}
              className="p-1 text-white/60 hover:text-white rounded hover:bg-white/10"
              title="Close animation editor"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING CLIP QUICK ACTION DOCK: Appears when a photo/video clip is selected (आसानी से आगे-पीछे करना) */}
      {selectedClip && !currentSelectedFilter && !currentSelectedAnim && (
        <div className="h-10 px-3 bg-[#0C121D] border-b border-[#00E5FF]/30 flex items-center justify-between text-xs z-30 shrink-0 gap-2 overflow-x-auto no-scrollbar animate-in fade-in duration-150">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1 rounded bg-[#00E5FF]/20 text-[#00E5FF]">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white truncate max-w-[130px]">
              {selectedClip.name}
            </span>
            <span className="text-[10px] font-mono text-[#00E5FF] font-bold px-1.5 py-0.5 bg-[#00E5FF]/15 rounded border border-[#00E5FF]/30">
              #{selectedClipIndex + 1}/{project.clips.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Move Left Button (पीछे करें) */}
            <button
              type="button"
              data-no-scrub="true"
              onClick={() => onMoveClip?.(selectedClip.id, "left")}
              disabled={selectedClipIndex <= 0}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                selectedClipIndex > 0
                  ? "bg-[#1E293B] hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 cursor-pointer"
                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
              }`}
              title="Move clip left (पीछे करें)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Move Left (पीछे)</span>
            </button>

            {/* Move Right Button (आगे करें) */}
            <button
              type="button"
              data-no-scrub="true"
              onClick={() => onMoveClip?.(selectedClip.id, "right")}
              disabled={selectedClipIndex >= project.clips.length - 1}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                selectedClipIndex < project.clips.length - 1
                  ? "bg-[#1E293B] hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 cursor-pointer"
                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
              }`}
              title="Move clip right (आगे करें)"
            >
              <span>Move Right (आगे)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Reorder Modal button */}
            <button
              type="button"
              data-no-scrub="true"
              onClick={() => setShowReorderModal(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B]/30 text-[11px] font-bold transition-all active:scale-95"
              title="Open full clip organizer modal"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Clips</span>
            </button>

            {/* Dedicated Keyframe Editor button */}
            {onOpenKeyframeEditor && (
              <button
                type="button"
                data-no-scrub="true"
                onClick={onOpenKeyframeEditor}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFB347]/15 hover:bg-[#FFB347]/25 text-[#FFB347] border border-[#FFB347]/30 text-[11px] font-bold transition-all active:scale-95"
                title="Open Timeline Keyframe Editor & Movement Graph"
              >
                <Diamond className="w-3.5 h-3.5 fill-[#FFB347]" />
                <span>Keyframes</span>
              </button>
            )}

            <div className="w-[1px] h-4 bg-white/10" />

            <button
              type="button"
              data-no-scrub="true"
              onClick={onSplitClip}
              className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-[11px] font-semibold active:scale-95 transition-all"
              title="Split clip at playhead"
            >
              Split
            </button>

            <button
              type="button"
              data-no-scrub="true"
              onClick={onDuplicateClip}
              className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-[11px] font-semibold active:scale-95 transition-all"
              title="Duplicate clip"
            >
              Duplicate
            </button>

            <button
              type="button"
              data-no-scrub="true"
              onClick={onDeleteClip}
              disabled={project.clips.length <= 1}
              className="p-1 text-[#FF5252] hover:bg-[#FF5252]/20 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              title="Delete clip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              data-no-scrub="true"
              onClick={() => onSelectClip(null)}
              className="p-1 text-white/60 hover:text-white rounded hover:bg-white/10"
              title="Deselect clip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN TIMELINE WORKSPACE: Left Sidebar + Multi-Track Editor */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Fixed Sidebar (Mute Clip, Cover & Quick Track Tools) */}
        <div className="w-16 sm:w-20 bg-[#0E0E12] border-r border-[#1E1E26] flex flex-col items-center py-2 px-1 z-20 shrink-0 space-y-2 overflow-y-auto no-scrollbar">
          {/* Mute Clip Button */}
          <button
            id="btn-timeline-mute-clip"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              isMuted 
                ? "bg-[#FF5252]/15 text-[#FF5252] border border-[#FF5252]/40" 
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
            title="Mute original clip audio"
          >
            <div className="p-1 rounded-lg">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </div>
            <span className="text-[9px] font-medium leading-tight text-center mt-0.5">
              {isMuted ? "Unmute" : "Mute clip"}
            </span>
          </button>

          {/* Cover Button */}
          <button
            id="btn-timeline-cover"
            onClick={() => setShowCoverModal(true)}
            className="w-full flex flex-col items-center justify-center py-1 px-1 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all active:scale-95"
            title="Set Video Cover Thumbnail"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-black flex items-center justify-center">
              {currentCover ? (
                <img src={currentCover} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-4 h-4 text-white/40" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Edit2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-[9px] font-medium leading-tight text-center mt-0.5">
              Cover
            </span>
          </button>

          {/* Add Audio shortcut */}
          <button
            onClick={onOpenAddAudioModal}
            className="w-full flex flex-col items-center justify-center py-1 px-1 rounded-xl hover:bg-white/5 text-white/60 hover:text-[#00E5FF] transition-all"
            title="Add Music Track"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="text-[8px] mt-0.5">Audio</span>
          </button>

          {/* Audio Mixer shortcut */}
          <button
            onClick={onOpenMixerModal || onOpenAddAudioModal}
            className="w-full flex flex-col items-center justify-center py-1 px-1 rounded-xl hover:bg-[#00E5FF]/10 text-white/60 hover:text-[#00E5FF] transition-all"
            title="Audio Mixer & Ducking Controls"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[8px] mt-0.5 text-[#00E5FF]">Mixer</span>
          </button>

          {/* Add Text shortcut */}
          <button
            onClick={onOpenAddTextModal}
            className="w-full flex flex-col items-center justify-center py-1 px-1 rounded-xl hover:bg-white/5 text-white/60 hover:text-[#FFB347] transition-all"
            title="Add Text Layer"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="text-[8px] mt-0.5">Text</span>
          </button>

          {/* Filter shortcut */}
          <button
            onClick={() => {
              if (onOpenFilterDrawer) onOpenFilterDrawer();
              else if (onAddFilterItem) onAddFilterItem();
            }}
            className="w-full flex flex-col items-center justify-center py-1 px-1 rounded-xl hover:bg-[#F59E0B]/10 text-white/60 hover:text-[#F59E0B] transition-all"
            title="Filter Timeline Track"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="text-[8px] mt-0.5 text-[#F59E0B]">Filter</span>
          </button>

          {/* Animation shortcut */}
          <button
            onClick={() => {
              if (onOpenAnimationDrawer) onOpenAnimationDrawer();
              else if (onAddAnimationItem) onAddAnimationItem();
            }}
            className="w-full flex flex-col items-center justify-center py-1 px-1 rounded-xl hover:bg-[#A855F7]/10 text-white/60 hover:text-[#A855F7] transition-all"
            title="Animation Timeline Track"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[8px] mt-0.5 text-[#A855F7]">Anim</span>
          </button>
        </div>

        {/* Scrollable Tracks Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#09090C] no-scrollbar cursor-pointer"
          onMouseDown={handleMouseDownScrub}
          onTouchStart={handleTouchStartScrub}
          onClick={() => {
            if (selectedClipId) onSelectClip(null);
          }}
        >
          <div
            className="relative min-h-full pb-4"
            style={{ width: `${timelineWidth}px` }}
          >
            {/* Timeline Ruler Marks */}
            <div className="h-6 border-b border-[#1A1A24] bg-[#0C0C10] flex items-center relative text-[9px] font-mono text-white/50 select-none pointer-events-none sticky top-0 z-30">
              {rulerTicks.map((sec) => (
                <div
                  key={sec}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${sec * zoomLevel}px` }}
                >
                  <div className="w-[1px] h-2 bg-white/20" />
                  <span className="text-[8px] -translate-x-1/2 text-white/50 mt-0.5">
                    {formatTime(sec)}
                  </span>
                </div>
              ))}

              {/* Beat Markers */}
              {project.beatMarkers?.map((beatTime, idx) => (
                <div
                  key={idx}
                  className="absolute top-1 w-2 h-2 -translate-x-1/2 rotate-45 bg-[#00E5FF] shadow-[0_0_6px_#00E5FF] z-10"
                  style={{ left: `${beatTime * zoomLevel}px` }}
                  title={`Beat ${idx + 1}`}
                />
              ))}
            </div>

            {/* Tracks Stack */}
            <div className="flex flex-col gap-2.5 p-2 pt-2.5">
              {/* TRACK 1: Video / Photo Main Track */}
              <div 
                className="relative bg-[#121218] rounded-xl border border-white/5 flex items-center transition-all"
                style={{ height: effectiveHeight > 300 ? "80px" : "60px" }}
              >
                {project.clips.map((clip, index) => {
                  const clipTrimmedDuration = (clip.trimEnd - clip.trimStart) / (clip.speed || 1);
                  const clipWidth = Math.max(40, clipTrimmedDuration * zoomLevel);
                  const clipLeft = clip.startTime * zoomLevel;
                  const isSelected = clip.id === selectedClipId;
                  const isDragging = clip.id === draggingClipId;
                  const isSwapTarget = clip.id === hoverSwapTargetId;

                  return (
                    <div
                      key={clip.id}
                      data-no-scrub="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClip(clip.id);
                      }}
                      onMouseDown={(e) => handleClipBodyDragStart(e, clip)}
                      onTouchStart={(e) => handleClipBodyDragStart(e, clip)}
                      className={`absolute top-1 rounded-xl overflow-visible cursor-grab active:cursor-grabbing select-none transition-shadow ${
                        effectiveHeight > 300 ? "h-[72px]" : "h-14"
                      } ${
                        isDragging
                          ? "z-50 ring-4 ring-[#00E5FF] shadow-[0_12px_28px_rgba(0,229,255,0.45)] opacity-95"
                          : isSwapTarget
                          ? "z-40 ring-4 ring-dashed ring-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)] bg-[#00E5FF]/20 scale-[1.02]"
                          : isSelected
                          ? "z-30 ring-[3px] ring-white shadow-2xl bg-[#1E1E28]"
                          : "z-10 hover:ring-1 hover:ring-white/40 bg-[#161620]"
                      }`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                        transform: isDragging ? `translate3d(${clipDragDeltaX}px, 0, 0)` : undefined,
                        touchAction: "none",
                      }}
                    >
                      {/* Filmstrip thumbnails container */}
                      <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-between px-2 bg-[#1A1A24]">
                        {clip.url && (
                          <img
                            src={clip.url}
                            alt={clip.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none select-none"
                          />
                        )}

                        {/* Top Header inside clip: Badge & Quick Move Arrows */}
                        <div className="absolute top-1 left-1 right-1 flex items-center justify-between z-10 pointer-events-none">
                          <div className="bg-black/80 backdrop-blur-sm px-1.5 py-0.2 rounded text-[9px] font-mono font-bold text-white flex items-center gap-1">
                            <span>#{index + 1}</span>
                            <span>•</span>
                            <span>{clipTrimmedDuration.toFixed(1)}s</span>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-0.5 pointer-events-auto">
                              {index > 0 && (
                                <button
                                  type="button"
                                  data-no-scrub="true"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveClip?.(clip.id, "left");
                                  }}
                                  className="w-4 h-4 bg-black/80 hover:bg-[#00E5FF] hover:text-black rounded text-white flex items-center justify-center transition-colors shadow"
                                  title="Move clip left (पीछे करें)"
                                >
                                  <ArrowLeft className="w-2.5 h-2.5" />
                                </button>
                              )}
                              {index < project.clips.length - 1 && (
                                <button
                                  type="button"
                                  data-no-scrub="true"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveClip?.(clip.id, "right");
                                  }}
                                  className="w-4 h-4 bg-black/80 hover:bg-[#00E5FF] hover:text-black rounded text-white flex items-center justify-center transition-colors shadow"
                                  title="Move clip right (आगे करें)"
                                >
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Swap indicator tooltip when dragging over */}
                        {isSwapTarget && (
                          <div className="absolute inset-0 bg-[#00E5FF]/30 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none animate-pulse">
                            <span className="text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded-full border border-[#00E5FF]">
                              ⇄ Swap Here (यहाँ बदलें)
                            </span>
                          </div>
                        )}

                        {/* Drag grip hint icon */}
                        <div className="absolute left-1/2 bottom-1 -translate-x-1/2 flex items-center gap-0.5 opacity-60 text-white pointer-events-none">
                          <GripHorizontal className="w-3.5 h-3.5" />
                        </div>

                        {/* Clip Name */}
                        <span className="text-[10px] font-semibold text-white truncate max-w-[120px] drop-shadow-md z-10 mt-3">
                          {clip.name}
                        </span>

                        {/* Speed badge */}
                        {clip.speed !== 1.0 && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#00E5FF] text-black font-extrabold z-10">
                            {clip.speed}x
                          </span>
                        )}

                        {/* Animation badge */}
                        {clip.animationId && (
                          <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-[#A855F7] text-white flex items-center gap-0.5 z-10 shadow-sm" title={`Animation: ${clip.animationId}`}>
                            ✦ Anim
                          </span>
                        )}
                      </div>

                      {/* Trimming Handles */}
                      {isSelected && !isDragging && (
                        <>
                          <div
                            data-no-scrub="true"
                            onMouseDown={(e) => handleTrimDragStart(e, clip, "start")}
                            onTouchStart={(e) => handleTrimDragStart(e, clip, "start")}
                            className="absolute -left-2 top-0 bottom-0 w-4 bg-white rounded-l-md cursor-ew-resize flex items-center justify-center z-40 shadow-lg"
                            title="Drag to trim start"
                          >
                            <div className="w-1 h-4 bg-black/60 rounded-full" />
                          </div>

                          <div
                            data-no-scrub="true"
                            onMouseDown={(e) => handleTrimDragStart(e, clip, "end")}
                            onTouchStart={(e) => handleTrimDragStart(e, clip, "end")}
                            className="absolute -right-2 top-0 bottom-0 w-4 bg-white rounded-r-md cursor-ew-resize flex items-center justify-center z-40 shadow-lg"
                            title="Drag to trim end"
                          >
                            <div className="w-1 h-4 bg-black/60 rounded-full" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Plus Button to add media */}
                <button
                  id="btn-timeline-add-clip-square"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddMediaModal();
                  }}
                  style={{ left: `${Math.max(50, project.duration * zoomLevel + 16)}px` }}
                  className="absolute top-2 w-11 h-11 rounded-xl bg-white hover:bg-neutral-200 text-black flex items-center justify-center shadow-lg active:scale-95 transition-all z-20"
                  title="Add photos or videos"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>

              {/* TRACK 2: Filter Track (फ़िल्टर ट्रैक - टाइमलाइन पर फ़िल्टर को देखना और बड़ा या घटाना) */}
              <div 
                className="relative bg-[#120F0A] rounded-xl border border-[#F59E0B]/20 flex items-center px-1 group transition-all"
                style={{ height: effectiveHeight > 360 ? "46px" : "36px" }}
              >
                {/* Track Label Badge */}
                <div className="absolute left-1.5 z-20 flex items-center gap-1 text-[9px] font-bold text-[#F59E0B] uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded pointer-events-none border border-[#F59E0B]/20">
                  <Sliders className="w-2.5 h-2.5" />
                  <span>Filter</span>
                </div>

                {effectiveFilterTracks.length === 0 ? (
                  <button
                    id="btn-timeline-add-filter-empty"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddFilterItem ? onAddFilterItem() : onOpenFilterDrawer?.();
                    }}
                    className="ml-16 flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 active:scale-95 transition-all z-10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add filter track</span>
                  </button>
                ) : (
                  effectiveFilterTracks.map((flt) => {
                    const fltWidth = Math.max(40, flt.duration * zoomLevel);
                    const fltLeft = flt.startTime * zoomLevel;
                    const isSelected = flt.id === activeSelectedFilterId;

                    return (
                      <div
                        key={flt.id}
                        data-no-scrub="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFilterItem(flt.id);
                        }}
                        className={`absolute top-1 bottom-1 rounded-lg overflow-visible cursor-pointer transition-all ${
                          isSelected
                            ? "z-30 ring-[2.5px] ring-[#F59E0B] shadow-xl shadow-[#F59E0B]/30 bg-gradient-to-r from-[#D97706] to-[#F59E0B]"
                            : "z-10 bg-gradient-to-r from-[#78350F]/90 to-[#B45309]/90 border border-[#F59E0B]/40 hover:border-[#F59E0B]"
                        }`}
                        style={{
                          left: `${fltLeft}px`,
                          width: `${fltWidth}px`,
                        }}
                        title={`Filter: ${flt.name} (${flt.duration.toFixed(1)}s) • Click to stretch or shrink`}
                      >
                        <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-between px-2 text-white">
                          <div className="flex items-center gap-1.5 truncate">
                            <Sliders className="w-3 h-3 text-[#FDE68A] shrink-0" />
                            <span className="text-[10px] font-bold truncate">
                              {flt.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <span className="text-[9px] font-mono bg-black/50 px-1 rounded text-[#FDE68A] font-semibold">
                              {flt.duration.toFixed(1)}s
                            </span>
                            {/* Direct Delete Filter button right on timeline block */}
                            <button
                              type="button"
                              data-no-scrub="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteFilterItem?.(flt.id);
                                if (activeSelectedFilterId === flt.id) {
                                  handleSelectFilterItem(null);
                                }
                              }}
                              className="p-1 rounded bg-black/60 hover:bg-[#FF5252] text-white/80 hover:text-white transition-colors ml-0.5 active:scale-90"
                              title="Delete filter (फ़िल्टर हटाएं)"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>

                        {/* Trim Handles for Bada / Ghata on timeline */}
                        {isSelected && (
                          <>
                            <div
                              data-no-scrub="true"
                              onMouseDown={(e) => handleFilterTrimDragStart(e, flt, "start")}
                              onTouchStart={(e) => handleFilterTrimDragStart(e, flt, "start")}
                              className="absolute -left-1.5 top-0 bottom-0 w-3.5 bg-[#F59E0B] rounded-l-md cursor-ew-resize flex items-center justify-center z-40 shadow-md"
                              title="Drag to adjust filter start"
                            >
                              <div className="w-0.5 h-3 bg-black/70 rounded-full" />
                            </div>

                            <div
                              data-no-scrub="true"
                              onMouseDown={(e) => handleFilterTrimDragStart(e, flt, "end")}
                              onTouchStart={(e) => handleFilterTrimDragStart(e, flt, "end")}
                              className="absolute -right-1.5 top-0 bottom-0 w-3.5 bg-[#F59E0B] rounded-r-md cursor-ew-resize flex items-center justify-center z-40 shadow-md"
                              title="Drag to stretch/shrink filter duration (बड़ा या घटाएं)"
                            >
                              <div className="w-0.5 h-3 bg-black/70 rounded-full" />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Plus button on Filter Track */}
                {effectiveFilterTracks.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddFilterItem ? onAddFilterItem() : onOpenFilterDrawer?.();
                    }}
                    style={{
                      left: `${Math.max(
                        60,
                        (effectiveFilterTracks[effectiveFilterTracks.length - 1].startTime +
                          effectiveFilterTracks[effectiveFilterTracks.length - 1].duration) *
                          zoomLevel +
                          12
                      )}px`,
                    }}
                    className="absolute top-1.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] text-[10px] font-bold border border-[#F59E0B]/40 active:scale-95 transition-all z-20"
                    title="Add another filter block"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Filter</span>
                  </button>
                )}
              </div>

              {/* TRACK 3: Animation Track (एनिमेशन ट्रैक - टाइमलाइन पर एनिमेशन को देखना और बड़ा या घटाना) */}
              <div 
                className="relative bg-[#100C16] rounded-xl border border-[#A855F7]/20 flex items-center px-1 group transition-all"
                style={{ height: effectiveHeight > 360 ? "46px" : "36px" }}
              >
                {/* Track Label Badge */}
                <div className="absolute left-1.5 z-20 flex items-center gap-1 text-[9px] font-bold text-[#A855F7] uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded pointer-events-none border border-[#A855F7]/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Anim</span>
                </div>

                {effectiveAnimationTracks.length === 0 ? (
                  <button
                    id="btn-timeline-add-anim-empty"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddAnimationItem ? onAddAnimationItem() : onOpenAnimationDrawer?.();
                    }}
                    className="ml-16 flex items-center gap-1.5 text-xs font-semibold text-[#A855F7] hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 active:scale-95 transition-all z-10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add animation track</span>
                  </button>
                ) : (
                  effectiveAnimationTracks.map((anim) => {
                    const animWidth = Math.max(36, anim.duration * zoomLevel);
                    const animLeft = anim.startTime * zoomLevel;
                    const isSelected = anim.id === activeSelectedAnimationId;

                    return (
                      <div
                        key={anim.id}
                        data-no-scrub="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAnimationItem(anim.id);
                        }}
                        className={`absolute top-1 bottom-1 rounded-lg overflow-visible cursor-pointer transition-all ${
                          isSelected
                            ? "z-30 ring-[2.5px] ring-[#A855F7] shadow-xl shadow-[#A855F7]/30 bg-gradient-to-r from-[#7C3AED] to-[#A855F7]"
                            : "z-10 bg-gradient-to-r from-[#4C1D95]/90 to-[#6D28D9]/90 border border-[#A855F7]/40 hover:border-[#A855F7]"
                        }`}
                        style={{
                          left: `${animLeft}px`,
                          width: `${animWidth}px`,
                        }}
                        title={`Animation: ${anim.name} (${anim.duration.toFixed(1)}s) • Click to stretch or shrink`}
                      >
                        <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-between px-2 text-white">
                          <div className="flex items-center gap-1.5 truncate">
                            <Sparkles className="w-3 h-3 text-[#E9D5FF] shrink-0" />
                            <span className="text-[10px] font-bold truncate">
                              {anim.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <span className="text-[8px] uppercase font-extrabold px-1 rounded bg-black/40 text-[#E9D5FF]">
                              {anim.type}
                            </span>
                            <span className="text-[9px] font-mono bg-black/50 px-1 rounded text-[#E9D5FF] font-semibold">
                              {anim.duration.toFixed(1)}s
                            </span>
                            {/* Direct Delete Animation button right on timeline block */}
                            <button
                              type="button"
                              data-no-scrub="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAnimationItem?.(anim.id);
                                if (activeSelectedAnimationId === anim.id) {
                                  handleSelectAnimationItem(null);
                                }
                              }}
                              className="p-1 rounded bg-black/60 hover:bg-[#FF5252] text-white/80 hover:text-white transition-colors ml-0.5 active:scale-90"
                              title="Delete animation (एनिमेशन हटाएं)"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>

                        {/* Trim Handles for Bada / Ghata on timeline */}
                        {isSelected && (
                          <>
                            <div
                              data-no-scrub="true"
                              onMouseDown={(e) => handleAnimationTrimDragStart(e, anim, "start")}
                              onTouchStart={(e) => handleAnimationTrimDragStart(e, anim, "start")}
                              className="absolute -left-1.5 top-0 bottom-0 w-3.5 bg-[#A855F7] rounded-l-md cursor-ew-resize flex items-center justify-center z-40 shadow-md"
                              title="Drag to adjust animation start"
                            >
                              <div className="w-0.5 h-3 bg-black/70 rounded-full" />
                            </div>

                            <div
                              data-no-scrub="true"
                              onMouseDown={(e) => handleAnimationTrimDragStart(e, anim, "end")}
                              onTouchStart={(e) => handleAnimationTrimDragStart(e, anim, "end")}
                              className="absolute -right-1.5 top-0 bottom-0 w-3.5 bg-[#A855F7] rounded-r-md cursor-ew-resize flex items-center justify-center z-40 shadow-md"
                              title="Drag to stretch/shrink animation duration (बड़ा या घटाएं)"
                            >
                              <div className="w-0.5 h-3 bg-black/70 rounded-full" />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Plus button on Animation Track */}
                {effectiveAnimationTracks.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddAnimationItem ? onAddAnimationItem() : onOpenAnimationDrawer?.();
                    }}
                    style={{
                      left: `${Math.max(
                        60,
                        (effectiveAnimationTracks[effectiveAnimationTracks.length - 1].startTime +
                          effectiveAnimationTracks[effectiveAnimationTracks.length - 1].duration) *
                          zoomLevel +
                          12
                      )}px`,
                    }}
                    className="absolute top-1.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#A855F7]/20 hover:bg-[#A855F7]/30 text-[#A855F7] text-[10px] font-bold border border-[#A855F7]/40 active:scale-95 transition-all z-20"
                    title="Add another animation block"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Anim</span>
                  </button>
                )}
              </div>

              {/* TRACK 4: Multi-Track Audio Suite (Background Music, Voiceover, SFX with Ducking & Faders) */}
              <TimelineAudioSection
                project={project}
                currentTime={currentTime}
                zoomLevel={zoomLevel}
                effectiveHeight={effectiveHeight}
                activeSelectedAudioId={activeSelectedAudioId}
                onSelectAudioTrack={handleSelectAudioTrack}
                onUpdateAudioTrack={onUpdateAudioTrack}
                onDeleteAudioTrack={onDeleteAudioTrack}
                onDuplicateAudioTrack={onDuplicateAudioTrack}
                onAddAudioTrack={onAddAudioTrack}
                onUpdateMixer={onUpdateMixer}
                onOpenMixerModal={onOpenMixerModal}
                onOpenAddAudioModal={onOpenAddAudioModal}
              />

              {/* TRACK 3: Text & Lyrics Captions Track */}
              {(project.textTracks.length > 0 || project.lyrics.length > 0) && (
                <div 
                  className="relative bg-[#101016] rounded-lg border border-white/5 flex items-center px-2"
                  style={{ height: effectiveHeight > 360 ? "40px" : "32px" }}
                >
                  {project.textTracks.map((txt) => {
                    const txtW = Math.max(24, txt.duration * zoomLevel);
                    const txtL = txt.startTime * zoomLevel;
                    return (
                      <div
                        key={txt.id}
                        className="absolute top-1 bottom-1 rounded bg-[#1C1C28] border-t-2 border-t-[#9D68FF] border border-white/10 flex items-center px-2 z-10"
                        style={{ left: `${txtL}px`, width: `${txtW}px` }}
                      >
                        <span className="text-[9px] font-medium text-white truncate">
                          {txt.text}
                        </span>
                      </div>
                    );
                  })}

                  {project.lyrics.map((lyr) => {
                    const lyrW = Math.max(20, (lyr.endTime - lyr.startTime) * zoomLevel);
                    const lyrL = lyr.startTime * zoomLevel;
                    return (
                      <div
                        key={lyr.id}
                        className="absolute top-1 bottom-1 rounded bg-[#2A2016] border-t-2 border-t-[#FFB347] border border-[#FFB347]/30 flex items-center px-1.5 z-10"
                        style={{ left: `${lyrL}px`, width: `${lyrW}px` }}
                      >
                        <span className="text-[9px] font-medium text-[#FFB347] truncate">
                          🎤 {lyr.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Playhead Needle (Spans entire height, GPU-accelerated translate3d) */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white z-40 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)] will-change-transform"
              style={{ 
                left: 0,
                transform: `translate3d(${currentTime * zoomLevel}px, 0, 0)`,
              }}
            >
              <div className="w-3.5 h-3.5 -translate-x-[6px] -translate-y-1 rounded-full bg-white border-2 border-black shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MANUAL DURATION MODAL ("टाइमलाइन के टाइम को खुद ही बड़ा या घटा सके") */}
      {showDurationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181824] border border-[#2E2E40] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FFB347]/15 text-[#FFB347]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Timeline Duration</h3>
                  <p className="text-[10px] text-[#8E8E9F]">टाइमलाइन की कुल लंबाई बढ़ाएं या घटाएं</p>
                </div>
              </div>
              <button
                onClick={() => setShowDurationModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Direct Number Input Field with Steppers */}
            <div className="bg-[#101016] p-4 rounded-xl border border-[#242432] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E8E9F] font-medium">Duration (Seconds)</span>
                <span className="text-xs font-mono text-[#00E5FF] font-bold">
                  {formatTime(customDurationInput)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomDurationInput(Math.max(2, customDurationInput - 5))}
                  className="px-3 py-2 bg-[#1C1C28] hover:bg-[#28283A] text-white rounded-xl font-mono text-xs font-bold active:scale-95 transition-all"
                >
                  -5s
                </button>
                <button
                  type="button"
                  onClick={() => setCustomDurationInput(Math.max(2, customDurationInput - 1))}
                  className="px-2.5 py-2 bg-[#1C1C28] hover:bg-[#28283A] text-white rounded-xl font-mono text-xs font-bold active:scale-95 transition-all"
                >
                  -1s
                </button>

                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="3600"
                    step="1"
                    value={customDurationInput}
                    onChange={(e) => setCustomDurationInput(parseFloat(e.target.value) || 0)}
                    className="w-20 h-10 bg-[#08080C] text-center font-mono text-base font-bold text-[#FFB347] border border-[#3E3E52] rounded-xl focus:outline-none focus:border-[#FFB347]"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/40 font-mono">
                    s
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setCustomDurationInput(customDurationInput + 1)}
                  className="px-2.5 py-2 bg-[#1C1C28] hover:bg-[#28283A] text-white rounded-xl font-mono text-xs font-bold active:scale-95 transition-all"
                >
                  +1s
                </button>
                <button
                  type="button"
                  onClick={() => setCustomDurationInput(customDurationInput + 5)}
                  className="px-3 py-2 bg-[#1C1C28] hover:bg-[#28283A] text-white rounded-xl font-mono text-xs font-bold active:scale-95 transition-all"
                >
                  +5s
                </button>
              </div>
            </div>

            {/* Quick Preset Duration Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#7A7A8E] font-medium">Quick Presets:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[5, 10, 15, 30, 60, 90, 120, 180].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setCustomDurationInput(dur)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      customDurationInput === dur
                        ? "bg-[#FFB347] text-black font-bold border-[#FFB347]"
                        : "bg-[#14141C] text-white/70 hover:text-white border-[#242432]"
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDurationModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustomDuration}
                className="flex-1 py-2.5 rounded-xl bg-[#FFB347] hover:bg-[#FFB347]/90 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Apply Duration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Cover Frame Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181822] border border-[#2E2E3E] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                Select Video Cover
              </span>
              <button
                onClick={() => setShowCoverModal(false)}
                className="text-white/60 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#888898]">
              Choose a frame from your video or select a clip to be the project thumbnail:
            </div>

            <div className="grid grid-cols-3 gap-2">
              {project.clips.map((clip, idx) => (
                <button
                  key={clip.id}
                  onClick={() => {
                    setCoverThumbnail(clip.url);
                    setShowCoverModal(false);
                  }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-white/20 hover:border-[#00E5FF] transition-all relative group"
                >
                  <img src={clip.url} alt={clip.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-[8px] bg-black/70 px-1 rounded text-white">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCoverModal(false)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 6. REORDER CLIPS MODAL (फोटो / वीडियो क्लिप्स आगे-पीछे करने का तेज़ और आसान तरीका) */}
      <ReorderClipsModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        clips={project.clips}
        onReorderClips={(reordered) => onReorderClips?.(reordered)}
        onMoveClip={(clipId, dir) => onMoveClip?.(clipId, dir)}
      />
    </div>
  );
};
