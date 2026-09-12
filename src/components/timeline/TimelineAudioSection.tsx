import React, { useState, useMemo } from "react";
import { VideoProject, AudioTrackItem, AudioMixerSettings, AudioLaneType } from "../../types";
import { DEFAULT_AUDIO_MIXER, computeDuckingSpans } from "../../utils/audioDucking";
import { 
  Music, 
  Mic, 
  Zap, 
  Plus, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sliders, 
  SlidersHorizontal,
  Trash2, 
  Copy, 
  Split, 
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface TimelineAudioSectionProps {
  project: VideoProject;
  currentTime: number;
  zoomLevel: number;
  effectiveHeight: number;
  activeSelectedAudioId: string | null;
  onSelectAudioTrack: (id: string | null) => void;
  onUpdateAudioTrack?: (trackId: string, updates: Partial<AudioTrackItem>) => void;
  onDeleteAudioTrack?: (trackId: string) => void;
  onDuplicateAudioTrack?: (trackId: string) => void;
  onAddAudioTrack?: (track: AudioTrackItem) => void;
  onUpdateMixer?: (mixer: AudioMixerSettings) => void;
  onOpenMixerModal?: () => void;
  onOpenAddAudioModal: () => void;
}

export const TimelineAudioSection: React.FC<TimelineAudioSectionProps> = ({
  project,
  currentTime,
  zoomLevel,
  effectiveHeight,
  activeSelectedAudioId,
  onSelectAudioTrack,
  onUpdateAudioTrack,
  onDeleteAudioTrack,
  onDuplicateAudioTrack,
  onAddAudioTrack,
  onUpdateMixer,
  onOpenMixerModal,
  onOpenAddAudioModal,
}) => {
  const mixer: AudioMixerSettings = project.audioMixer || DEFAULT_AUDIO_MIXER;
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeFaderPopover, setActiveFaderPopover] = useState<AudioLaneType | null>(null);

  // Categorize tracks into 3 dedicated lanes
  const bgmTracks = useMemo(() => {
    return project.audioTracks.filter(
      (t) => t.type === "music" || t.type === "extracted" || (!t.type && !t.id.includes("voice") && !t.id.includes("sfx"))
    );
  }, [project.audioTracks]);

  const voiceTracks = useMemo(() => {
    return project.audioTracks.filter(
      (t) => t.type === "voiceover" || t.id.includes("voice")
    );
  }, [project.audioTracks]);

  const sfxTracks = useMemo(() => {
    return project.audioTracks.filter(
      (t) => t.type === "sfx" || t.id.includes("sfx")
    );
  }, [project.audioTracks]);

  // Compute ducking spans for visual dips on music lane
  const duckingSpans = useMemo(() => {
    if (!mixer.ducking.enabled) return [];
    return computeDuckingSpans(project);
  }, [project.audioTracks, mixer.ducking]);

  // Currently selected audio item
  const selectedAudioItem = useMemo(() => {
    if (!activeSelectedAudioId) return null;
    return project.audioTracks.find((a) => a.id === activeSelectedAudioId) || null;
  }, [activeSelectedAudioId, project.audioTracks]);

  // Mixer Lane Volume Handlers
  const handleUpdateLaneVolume = (lane: AudioLaneType, normalizedRatio: number) => {
    if (!onUpdateMixer) return;
    const currentLaneVol = mixer[lane]?.volume ?? 100;
    // If stored as 0-200, save as 0-200. If stored as 0-2, save as 0-2.
    const newVol = currentLaneVol > 2 ? Math.round(normalizedRatio * 100) : parseFloat(normalizedRatio.toFixed(2));
    onUpdateMixer({
      ...mixer,
      [lane]: {
        ...mixer[lane],
        volume: newVol,
      },
    });
  };

  const handleToggleLaneMute = (lane: AudioLaneType) => {
    if (!onUpdateMixer) return;
    const isMuted = mixer[lane]?.isMuted ?? (mixer[lane] as any)?.muted ?? false;
    onUpdateMixer({
      ...mixer,
      [lane]: {
        ...mixer[lane],
        isMuted: !isMuted,
      },
    });
  };

  const handleToggleLaneSolo = (lane: AudioLaneType) => {
    if (!onUpdateMixer) return;
    const isSolo = mixer[lane]?.isSolo ?? (mixer[lane] as any)?.solo ?? false;
    onUpdateMixer({
      ...mixer,
      [lane]: {
        ...mixer[lane],
        isSolo: !isSolo,
      },
    });
  };

  const handleToggleDucking = () => {
    if (!onUpdateMixer) return;
    onUpdateMixer({
      ...mixer,
      ducking: {
        ...mixer.ducking,
        enabled: !mixer.ducking.enabled,
      },
    });
  };

  // Trimming Audio Item
  const handleAudioTrimDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    audioItem: AudioTrackItem,
    handle: "start" | "end"
  ) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const initialStart = audioItem.startTime;
    const initialTrimStart = audioItem.trimStart;
    const initialTrimEnd = audioItem.trimEnd;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaSec = (curX - clientX) / zoomLevel;

      if (handle === "start") {
        const newStart = Math.max(0, initialStart + deltaSec);
        const newTrimStart = Math.max(0, Math.min(initialTrimEnd - 0.2, initialTrimStart + deltaSec));
        onUpdateAudioTrack?.(audioItem.id, {
          startTime: parseFloat(newStart.toFixed(2)),
          trimStart: parseFloat(newTrimStart.toFixed(2)),
        });
      } else {
        const newTrimEnd = Math.max(initialTrimStart + 0.2, initialTrimEnd + deltaSec);
        onUpdateAudioTrack?.(audioItem.id, {
          trimEnd: parseFloat(newTrimEnd.toFixed(2)),
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

  // Moving Audio Item along timeline
  const handleAudioMoveDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    audioItem: AudioTrackItem
  ) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const initialStart = audioItem.startTime;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaSec = (curX - clientX) / zoomLevel;
      const newStart = Math.max(0, initialStart + deltaSec);
      onUpdateAudioTrack?.(audioItem.id, {
        startTime: parseFloat(newStart.toFixed(2)),
      });
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

  // Split audio track at playhead
  const handleSplitSelectedAudio = () => {
    if (!selectedAudioItem) return;
    const item = selectedAudioItem;
    const itemDuration = item.trimEnd - item.trimStart;
    const relTime = currentTime - item.startTime;

    if (relTime <= 0.1 || relTime >= itemDuration - 0.1) {
      return; // Cannot split outside or right at boundaries
    }

    const splitMediaPoint = item.trimStart + relTime;

    const trackA: AudioTrackItem = {
      ...item,
      id: `${item.id}-a-${Date.now()}`,
      trimEnd: parseFloat(splitMediaPoint.toFixed(2)),
    };

    const trackB: AudioTrackItem = {
      ...item,
      id: `${item.id}-b-${Date.now()}`,
      startTime: parseFloat((item.startTime + relTime).toFixed(2)),
      trimStart: parseFloat(splitMediaPoint.toFixed(2)),
    };

    // Update tracks in project
    onDeleteAudioTrack?.(item.id);
    onAddAudioTrack?.(trackA);
    onAddAudioTrack?.(trackB);
    onSelectAudioTrack(trackB.id);
  };

  // Duplicate selected audio track
  const handleDuplicateSelectedAudio = () => {
    if (!selectedAudioItem) return;
    const item = selectedAudioItem;
    const itemDuration = item.trimEnd - item.trimStart;
    const duplicated: AudioTrackItem = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      name: `${item.name} (Copy)`,
      startTime: parseFloat((item.startTime + itemDuration + 0.5).toFixed(2)),
    };
    onAddAudioTrack?.(duplicated);
    onSelectAudioTrack(duplicated.id);
  };

  return (
    <div className="flex flex-col my-1 bg-[#09090D] rounded-xl border border-white/10 overflow-hidden shadow-md">
      {/* 1. AUDIO SUITE HEADER BAR */}
      <div className="h-8 bg-[#0F0F16] border-b border-white/10 px-3 flex items-center justify-between z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors"
          >
            <Music className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Audio Tracks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/70 font-mono font-medium">
              {project.audioTracks.length}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-white/40" />
            ) : (
              <ChevronDown className="w-3 h-3 text-white/40" />
            )}
          </button>

          {/* Ducking Quick Toggle */}
          <button
            onClick={handleToggleDucking}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
              mixer.ducking.enabled
                ? "bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/40 shadow-xs"
                : "bg-white/5 text-white/40 border-white/10 hover:text-white/70"
            }`}
            title="Auto-duck background music during voiceover"
          >
            <span>🦆</span>
            <span>Ducking: {mixer.ducking.enabled ? `-${mixer.ducking.duckAmount}%` : "OFF"}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Master Volume Indicator */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/60 font-mono">
            <Volume2 className="w-3 h-3 text-white/50" />
            <span>Master: {Math.round(mixer.masterVolume * 100)}%</span>
          </div>

          {/* Open Mixer Console Button */}
          {onOpenMixerModal && (
            <button
              onClick={onOpenMixerModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] font-bold active:scale-95 transition-all shadow-xs"
              title="Open full Audio Mixer & Ducking panel"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Mixer Console</span>
            </button>
          )}

          {/* Add Audio Shortcut */}
          <button
            onClick={onOpenAddAudioModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium active:scale-95 transition-all"
            title="Add Music, SFX or Voiceover"
          >
            <Plus className="w-3 h-3 text-[#00E5FF]" />
            <span className="hidden sm:inline">Add Track</span>
          </button>
        </div>
      </div>

      {/* 2. AUDIO LANES (COLLAPSIBLE) */}
      {isExpanded && (
        <div className="flex flex-col divide-y divide-white/5 bg-[#0A0A0E]">
          {/* LANE 1: BACKGROUND MUSIC (BGM) */}
          <AudioTrackLane
            lane="music"
            title="Background Music"
            icon={<Music className="w-3 h-3 text-[#00E5FF]" />}
            colorClass="border-[#00E5FF]"
            badgeColor="bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30"
            laneSettings={mixer.music}
            tracks={bgmTracks}
            zoomLevel={zoomLevel}
            effectiveHeight={effectiveHeight}
            activeSelectedAudioId={activeSelectedAudioId}
            onSelectAudioTrack={onSelectAudioTrack}
            onAudioTrimDragStart={handleAudioTrimDragStart}
            onAudioMoveDragStart={handleAudioMoveDragStart}
            onUpdateLaneVolume={(vol) => handleUpdateLaneVolume("music", vol)}
            onToggleLaneMute={() => handleToggleLaneMute("music")}
            onToggleLaneSolo={() => handleToggleLaneSolo("music")}
            onOpenAddAudioModal={onOpenAddAudioModal}
            duckingSpans={duckingSpans}
            isDucked={duckingSpans.length > 0}
            duckAmount={mixer.ducking.duckAmount}
          />

          {/* LANE 2: VOICEOVER (VO) */}
          <AudioTrackLane
            lane="voiceover"
            title="Voiceover"
            icon={<Mic className="w-3 h-3 text-[#A855F7]" />}
            colorClass="border-[#A855F7]"
            badgeColor="bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30"
            laneSettings={mixer.voiceover}
            tracks={voiceTracks}
            zoomLevel={zoomLevel}
            effectiveHeight={effectiveHeight}
            activeSelectedAudioId={activeSelectedAudioId}
            onSelectAudioTrack={onSelectAudioTrack}
            onAudioTrimDragStart={handleAudioTrimDragStart}
            onAudioMoveDragStart={handleAudioMoveDragStart}
            onUpdateLaneVolume={(vol) => handleUpdateLaneVolume("voiceover", vol)}
            onToggleLaneMute={() => handleToggleLaneMute("voiceover")}
            onToggleLaneSolo={() => handleToggleLaneSolo("voiceover")}
            onOpenAddAudioModal={onOpenAddAudioModal}
            isTrigger={mixer.ducking.enabled}
          />

          {/* LANE 3: SOUND EFFECTS (SFX) */}
          <AudioTrackLane
            lane="sfx"
            title="Sound Effects"
            icon={<Zap className="w-3 h-3 text-[#F59E0B]" />}
            colorClass="border-[#F59E0B]"
            badgeColor="bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
            laneSettings={mixer.sfx}
            tracks={sfxTracks}
            zoomLevel={zoomLevel}
            effectiveHeight={effectiveHeight}
            activeSelectedAudioId={activeSelectedAudioId}
            onSelectAudioTrack={onSelectAudioTrack}
            onAudioTrimDragStart={handleAudioTrimDragStart}
            onAudioMoveDragStart={handleAudioMoveDragStart}
            onUpdateLaneVolume={(vol) => handleUpdateLaneVolume("sfx", vol)}
            onToggleLaneMute={() => handleToggleLaneMute("sfx")}
            onToggleLaneSolo={() => handleToggleLaneSolo("sfx")}
            onOpenAddAudioModal={onOpenAddAudioModal}
          />
        </div>
      )}

      {/* 3. SELECTED AUDIO CLIP FLOATING CONTROLS BAR */}
      {selectedAudioItem && (
        <div className="h-10 bg-[#161622] border-t border-[#00E5FF]/30 px-3 flex items-center justify-between gap-3 text-xs z-30">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {selectedAudioItem.name}
            </span>
            <span className="text-[10px] font-mono text-white/50">
              ({(selectedAudioItem.trimEnd - selectedAudioItem.trimStart).toFixed(1)}s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Clip Volume Slider */}
            {(() => {
              const rawVol = selectedAudioItem.volume ?? 100;
              const clipVolNorm = rawVol > 2 ? rawVol / 100 : rawVol;
              const clipVolDisplay = Math.round(clipVolNorm * 100);
              return (
                <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                  <Volume2 className="w-3 h-3 text-white/50" />
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={clipVolNorm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const newVol = rawVol > 2 ? Math.round(val * 100) : val;
                      onUpdateAudioTrack?.(selectedAudioItem.id, {
                        volume: newVol,
                      });
                    }}
                    className="w-16 sm:w-24 accent-[#00E5FF] h-1 bg-white/20 rounded cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-[#00E5FF] w-8 text-right">
                    {clipVolDisplay}%
                  </span>
                </div>
              );
            })()}

            {/* Split Button */}
            <button
              onClick={handleSplitSelectedAudio}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
              title="Split audio clip at current playhead"
            >
              <Split className="w-3 h-3" />
              <span className="hidden sm:inline">Split</span>
            </button>

            {/* Duplicate Button */}
            <button
              onClick={handleDuplicateSelectedAudio}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
              title="Duplicate audio clip"
            >
              <Copy className="w-3 h-3" />
              <span className="hidden sm:inline">Duplicate</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                onDeleteAudioTrack?.(selectedAudioItem.id);
                onSelectAudioTrack(null);
              }}
              className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors"
              title="Delete audio clip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Deselect Button */}
            <button
              onClick={() => onSelectAudioTrack(null)}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title="Deselect clip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface AudioTrackLaneProps {
  lane: AudioLaneType;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  badgeColor: string;
  laneSettings: { volume: number; isMuted?: boolean; isSolo?: boolean; muted?: boolean; solo?: boolean };
  tracks: AudioTrackItem[];
  zoomLevel: number;
  effectiveHeight: number;
  activeSelectedAudioId: string | null;
  onSelectAudioTrack: (id: string | null) => void;
  onAudioTrimDragStart: (
    e: React.MouseEvent | React.TouchEvent,
    audioItem: AudioTrackItem,
    handle: "start" | "end"
  ) => void;
  onAudioMoveDragStart: (
    e: React.MouseEvent | React.TouchEvent,
    audioItem: AudioTrackItem
  ) => void;
  onUpdateLaneVolume: (volume: number) => void;
  onToggleLaneMute: () => void;
  onToggleLaneSolo: () => void;
  onOpenAddAudioModal: () => void;
  duckingSpans?: Array<{ rampInStart: number; rampOutEnd: number }>;
  isDucked?: boolean;
  duckAmount?: number;
  isTrigger?: boolean;
}

const AudioTrackLane: React.FC<AudioTrackLaneProps> = ({
  lane,
  title,
  icon,
  colorClass,
  badgeColor,
  laneSettings,
  tracks,
  zoomLevel,
  effectiveHeight,
  activeSelectedAudioId,
  onSelectAudioTrack,
  onAudioTrimDragStart,
  onAudioMoveDragStart,
  onUpdateLaneVolume,
  onToggleLaneMute,
  onToggleLaneSolo,
  onOpenAddAudioModal,
  duckingSpans = [],
  isDucked = false,
  duckAmount = 25,
  isTrigger = false,
}) => {
  const [showFader, setShowFader] = useState(false);

  const isMuted = (laneSettings as any).isMuted ?? (laneSettings as any).muted ?? false;
  const isSolo = (laneSettings as any).isSolo ?? (laneSettings as any).solo ?? false;
  const rawVol = laneSettings.volume ?? 100;
  const volumeNormalized = rawVol > 2 ? rawVol / 100 : rawVol;
  const volumeDisplay = Math.round(volumeNormalized * 100);

  // Styling maps based on track type
  const themeStyles = {
    music: {
      clipBg: "bg-[#07242B]/90 hover:bg-[#0A2F38]",
      border: "border-[#00E5FF]/40",
      accentBorder: "border-t-2 border-t-[#00E5FF]",
      text: "text-[#00E5FF]",
      waveform: "bg-[#00E5FF]",
      accentHandle: "bg-[#00E5FF]",
    },
    voiceover: {
      clipBg: "bg-[#1E0E30]/90 hover:bg-[#281340]",
      border: "border-[#A855F7]/40",
      accentBorder: "border-t-2 border-t-[#A855F7]",
      text: "text-[#D8B4FE]",
      waveform: "bg-[#A855F7]",
      accentHandle: "bg-[#A855F7]",
    },
    sfx: {
      clipBg: "bg-[#2A1605]/90 hover:bg-[#381E08]",
      border: "border-[#F59E0B]/40",
      accentBorder: "border-t-2 border-t-[#F59E0B]",
      text: "text-[#FCD34D]",
      waveform: "bg-[#F59E0B]",
      accentHandle: "bg-[#F59E0B]",
    },
  }[lane];

  const laneHeight = effectiveHeight > 360 ? 44 : 36;

  return (
    <div 
      className="relative flex items-center border-b border-white/5 last:border-b-0 hover:bg-white/[0.01] transition-colors"
      style={{ height: `${laneHeight}px` }}
    >
      {/* LEFT LANE CONTROLS BADGE (PINNED / FLOATING LEFT IDENTIFIER) */}
      <div className="sticky left-0 z-20 flex items-center gap-1.5 px-2 py-0.5 bg-[#101016]/95 backdrop-blur-md rounded-r-lg border-y border-r border-white/10 shadow-lg shrink-0">
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-[10px] font-bold text-white/90 whitespace-nowrap">
            {lane === "music" ? "BGM" : lane === "voiceover" ? "VO" : "SFX"}
          </span>
        </div>

        {/* Volume Fader Button & Value */}
        <div className="relative">
          <button
            type="button"
            data-no-scrub="true"
            onClick={(e) => {
              e.stopPropagation();
              setShowFader(!showFader);
            }}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[9px] font-mono text-white/80 transition-colors"
            title="Click to adjust track volume"
          >
            {isMuted ? (
              <VolumeX className="w-2.5 h-2.5 text-red-400" />
            ) : (
              <Volume1 className="w-2.5 h-2.5 text-white/60" />
            )}
            <span>{volumeDisplay}%</span>
          </button>

          {/* Inline Floating Fader Slider */}
          {showFader && (
            <div 
              data-no-scrub="true"
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-1.5 p-2 bg-[#1A1A24] border border-white/20 rounded-xl shadow-2xl z-50 flex items-center gap-2 min-w-[140px]"
            >
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={volumeNormalized}
                onChange={(e) => onUpdateLaneVolume(parseFloat(e.target.value))}
                className="w-20 accent-[#00E5FF] h-1.5 bg-white/20 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono font-bold text-white w-8 text-right">
                {volumeDisplay}%
              </span>
              <button
                onClick={() => setShowFader(false)}
                className="text-white/40 hover:text-white text-[10px] p-0.5"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Mute (M) Toggle */}
        <button
          type="button"
          data-no-scrub="true"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLaneMute();
          }}
          className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center transition-colors ${
            isMuted
              ? "bg-red-500 text-white shadow-xs"
              : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
          }`}
          title={isMuted ? "Unmute track" : "Mute track"}
        >
          M
        </button>

        {/* Solo (S) Toggle */}
        <button
          type="button"
          data-no-scrub="true"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLaneSolo();
          }}
          className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center transition-colors ${
            isSolo
              ? "bg-amber-500 text-black font-extrabold shadow-xs"
              : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
          }`}
          title={isSolo ? "Disable solo" : "Solo this track"}
        >
          S
        </button>

        {/* Ducking Indicator */}
        {isDucked && (
          <span 
            className="hidden sm:flex items-center gap-0.5 px-1 rounded bg-[#00E5FF]/20 text-[#00E5FF] text-[8px] font-bold animate-pulse"
            title={`Music ducked by ${duckAmount}% when voice speaks`}
          >
            🦆 Ducked
          </span>
        )}
        {isTrigger && (
          <span 
            className="hidden sm:flex items-center gap-0.5 px-1 rounded bg-[#A855F7]/20 text-[#D8B4FE] text-[8px] font-bold"
            title="Ducking trigger track"
          >
            ⚡ Trigger
          </span>
        )}
      </div>

      {/* CLIPS ON THE LANE TIMELINE */}
      <div className="absolute inset-0 pl-32 sm:pl-36">
        {tracks.length === 0 ? (
          <button
            type="button"
            data-no-scrub="true"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAddAudioModal();
            }}
            className="h-full flex items-center gap-1.5 text-[11px] font-semibold text-white/30 hover:text-white/80 px-3 rounded hover:bg-white/5 transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>+ Add {title}</span>
          </button>
        ) : (
          <>
            {/* Visual Ducking Mask Regions (Rendered over Music Lane) */}
            {lane === "music" && duckingSpans.map((span, idx) => {
              const spanLeft = span.rampInStart * zoomLevel;
              const spanWidth = Math.max(16, (span.rampOutEnd - span.rampInStart) * zoomLevel);
              return (
                <div
                  key={`ducking-overlay-${idx}`}
                  className="absolute top-1 bottom-1 rounded pointer-events-none z-15 border border-[#00E5FF]/40 bg-gradient-to-r from-[#00E5FF]/10 via-[#00E5FF]/20 to-[#00E5FF]/10 backdrop-blur-xs flex items-center justify-center px-1 overflow-hidden"
                  style={{
                    left: `${spanLeft}px`,
                    width: `${spanWidth}px`,
                  }}
                >
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/70 rounded text-[8px] font-bold text-[#00E5FF] whitespace-nowrap shadow-xs">
                    <span>🦆</span>
                    <span>Ducked -{duckAmount}%</span>
                  </div>
                </div>
              );
            })}

            {/* Individual Audio Track Clips */}
            {tracks.map((audio) => {
              const audioWidth = Math.max(28, (audio.trimEnd - audio.trimStart) * zoomLevel);
              const audioLeft = audio.startTime * zoomLevel;
              const isSelected = activeSelectedAudioId === audio.id;

              return (
                <div
                  key={audio.id}
                  data-no-scrub="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAudioTrack(audio.id);
                  }}
                  onMouseDown={(e) => onAudioMoveDragStart(e, audio)}
                  onTouchStart={(e) => onAudioMoveDragStart(e, audio)}
                  className={`absolute top-1 bottom-1 rounded-lg overflow-hidden border flex items-center px-2 z-10 cursor-grab active:cursor-grabbing transition-all select-none shadow-sm ${
                    themeStyles.clipBg
                  } ${themeStyles.border} ${themeStyles.accentBorder} ${
                    isSelected ? "ring-2 ring-white shadow-xl scale-[1.01]" : ""
                  }`}
                  style={{
                    left: `${audioLeft}px`,
                    width: `${audioWidth}px`,
                  }}
                >
                  <div className="flex items-center gap-1 min-w-0 mr-1.5 shrink-0">
                    <span className={themeStyles.text}>{icon}</span>
                    <span className={`text-[10px] font-bold truncate max-w-[90px] sm:max-w-[130px] ${themeStyles.text}`}>
                      {audio.name}
                    </span>
                  </div>

                  {/* Waveform Visualization Bars */}
                  <div className="ml-auto flex items-center gap-0.5 opacity-80 shrink-0">
                    {[8, 14, 6, 18, 10, 16, 8, 12, 20, 10].map((h, i) => (
                      <div
                        key={i}
                        className={`w-[2px] rounded-full ${themeStyles.waveform}`}
                        style={{ height: `${Math.max(4, Math.round(h * (laneHeight / 44)))}px` }}
                      />
                    ))}
                  </div>

                  {/* Trim Handles for Start and End */}
                  {isSelected && (
                    <>
                      <div
                        data-no-scrub="true"
                        onMouseDown={(e) => onAudioTrimDragStart(e, audio, "start")}
                        onTouchStart={(e) => onAudioTrimDragStart(e, audio, "start")}
                        className={`absolute -left-1 top-0 bottom-0 w-3 rounded-l cursor-ew-resize flex items-center justify-center z-30 shadow-md ${themeStyles.accentHandle}`}
                        title="Drag to trim start"
                      >
                        <div className="w-0.5 h-3 bg-black/80 rounded-full" />
                      </div>

                      <div
                        data-no-scrub="true"
                        onMouseDown={(e) => onAudioTrimDragStart(e, audio, "end")}
                        onTouchStart={(e) => onAudioTrimDragStart(e, audio, "end")}
                        className={`absolute -right-1 top-0 bottom-0 w-3 rounded-r cursor-ew-resize flex items-center justify-center z-30 shadow-md ${themeStyles.accentHandle}`}
                        title="Drag to trim end"
                      >
                        <div className="w-0.5 h-3 bg-black/80 rounded-full" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
