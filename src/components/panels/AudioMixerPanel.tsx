import React from "react";
import { AudioMixerSettings, AudioTrackItem, VideoProject } from "../../types";
import { DEFAULT_AUDIO_MIXER, getDuckingMultiplierAtTime } from "../../utils/audioDucking";
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Mic, 
  Zap, 
  Sliders, 
  RotateCcw, 
  X, 
  Check, 
  Sparkles, 
  Waves,
  ShieldAlert
} from "lucide-react";

interface AudioMixerPanelProps {
  project: VideoProject;
  currentTime: number;
  isPlaying: boolean;
  onUpdateMixer: (mixer: AudioMixerSettings) => void;
  onClose?: () => void;
  onOpenAddAudioModal?: () => void;
}

export const AudioMixerPanel: React.FC<AudioMixerPanelProps> = ({
  project,
  currentTime,
  isPlaying,
  onUpdateMixer,
  onClose,
  onOpenAddAudioModal,
}) => {
  const mixer = project.audioMixer || DEFAULT_AUDIO_MIXER;

  // Real-time ducking state
  const duckingState = getDuckingMultiplierAtTime(currentTime, project);

  const updateChannel = (
    channel: "music" | "voiceover" | "sfx",
    updates: Partial<AudioMixerSettings["music"]>
  ) => {
    onUpdateMixer({
      ...mixer,
      [channel]: {
        ...mixer[channel],
        ...updates,
      },
    });
  };

  const updateDucking = (updates: Partial<AudioMixerSettings["ducking"]>) => {
    onUpdateMixer({
      ...mixer,
      ducking: {
        ...mixer.ducking,
        ...updates,
      },
    });
  };

  const resetToDefaults = () => {
    onUpdateMixer(DEFAULT_AUDIO_MIXER);
  };

  const musicClips = project.audioTracks.filter((t) => t.type === "music" || t.type === "extracted");
  const voiceClips = project.audioTracks.filter((t) => t.type === "voiceover");
  const sfxClips = project.audioTracks.filter((t) => t.type === "sfx");

  const convertVolToDb = (vol: number) => {
    if (vol <= 0) return "-∞ dB";
    const ratio = vol / 100;
    const db = 20 * Math.log10(ratio);
    return `${db >= 0 ? "+" : ""}${db.toFixed(1)} dB`;
  };

  return (
    <div className="flex flex-col h-full bg-[#0D0D12] text-white select-none overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#A855F7]/20 border border-white/10 flex items-center justify-center text-[#00E5FF]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Multi-Track Audio Mixer & Ducking</h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                PRO STUDIO
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Independent track faders, solo/mute channels & smart speech ducking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-reset-mixer-defaults"
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
            title="Reset mixer faders and ducking to default levels"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {onClose && (
            <button
              id="btn-close-mixer-panel"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* DUCKING CONTROL CARD FOR MAIN MUSIC TRACK */}
      <div className="p-4 rounded-2xl bg-[#12121A] border border-white/10 shadow-lg space-y-3 relative overflow-hidden">
        {/* Ambient subtle glow when ducking is active */}
        {duckingState.isDucked && (
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12 animate-pulse" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border transition-all ${
              mixer.ducking.enabled 
                ? "bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF]" 
                : "bg-white/5 border-white/10 text-white/40"
            }`}>
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Main Music Auto-Ducking</span>
                {mixer.ducking.enabled ? (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                    ENABLED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/40 border border-white/10">
                    OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50">
                Automatically lowers background music volume so narration and dialogue stand out clearly
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              id="switch-ducking-enable"
              type="checkbox"
              checked={mixer.ducking.enabled}
              onChange={(e) => updateDucking({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E5FF]" />
          </label>
        </div>

        {/* Real-time live ducking status banner */}
        {mixer.ducking.enabled && (
          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            duckingState.isDucked
              ? "bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]"
              : "bg-white/5 border-white/5 text-white/60"
          }`}>
            <div className="flex items-center gap-2 truncate">
              <span className={`w-2 h-2 rounded-full ${
                duckingState.isDucked ? "bg-[#00E5FF] animate-ping" : "bg-white/30"
              }`} />
              <span className="font-semibold truncate">
                {duckingState.isDucked
                  ? `Ducking Active: Music reduced to ${Math.round(duckingState.multiplier * 100)}% (Triggered by ${duckingState.activeTriggers.join(", ") || "Voiceover"})`
                  : "Ducking Idle: Waiting for voiceover cue on timeline"}
              </span>
            </div>

            <span className="font-mono text-[11px] font-bold shrink-0 ml-2">
              {duckingState.isDucked ? `-${Math.round((1 - duckingState.multiplier) * 100)}% DIP` : "FULL 100%"}
            </span>
          </div>
        )}

        {/* Ducking Parameters Slider & Options */}
        {mixer.ducking.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            {/* Duck Amount Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80 font-medium">Music Duck Level (Attenuate to):</span>
                <span className="font-mono font-bold text-[#00E5FF]">
                  {mixer.ducking.duckAmount}% ({convertVolToDb(mixer.ducking.duckAmount)})
                </span>
              </div>
              <input
                id="range-ducking-amount"
                type="range"
                min="0"
                max="60"
                step="5"
                value={mixer.ducking.duckAmount}
                onChange={(e) => updateDucking({ duckAmount: Number(e.target.value) })}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>Total Mute (0%)</span>
                <span>Balanced (25%)</span>
                <span>Subtle (50%)</span>
              </div>
            </div>

            {/* Attack & Release Transition Speed */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80 font-medium">Fade Transition (Attack/Release):</span>
                <span className="font-mono font-bold text-[#00E5FF]">
                  {mixer.ducking.fadeTime.toFixed(2)}s
                </span>
              </div>
              <input
                id="range-ducking-fadetime"
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={mixer.ducking.fadeTime}
                onChange={(e) => updateDucking({ fadeTime: Number(e.target.value) })}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>Fast (0.15s)</span>
                <span>Natural (0.35s)</span>
                <span>Smooth (0.8s)</span>
              </div>
            </div>

            {/* Trigger Target Track Selection */}
            <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs text-white/60">Duck Music When Playing:</span>
              <label className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={mixer.ducking.targetTypes.includes("voiceover")}
                  onChange={(e) => {
                    const current = new Set(mixer.ducking.targetTypes);
                    if (e.target.checked) current.add("voiceover");
                    else current.delete("voiceover");
                    updateDucking({ targetTypes: Array.from(current) as any });
                  }}
                  className="rounded border-white/20 text-[#00E5FF] focus:ring-0"
                />
                <Mic className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Voiceover Tracks</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={mixer.ducking.targetTypes.includes("sfx")}
                  onChange={(e) => {
                    const current = new Set(mixer.ducking.targetTypes);
                    if (e.target.checked) current.add("sfx");
                    else current.delete("sfx");
                    updateDucking({ targetTypes: Array.from(current) as any });
                  }}
                  className="rounded border-white/20 text-[#00E5FF] focus:ring-0"
                />
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Sound Effects (SFX)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* TRACK CHANNELS CONSOLE (INDIVIDUAL VOLUME FADERS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Audio Channel Strips & Volume Faders
          </h3>
          <span className="text-[11px] text-white/40">Range: 0% to 200% (+6dB boost)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. BACKGROUND MUSIC CHANNEL */}
          <div className="p-3.5 rounded-2xl bg-[#12121A] border border-[#00E5FF]/20 flex flex-col justify-between space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Music (BGM)</span>
                    {mixer.ducking.enabled && (
                      <span className="text-[8px] bg-[#00E5FF]/20 text-[#00E5FF] px-1 py-0.2 rounded font-mono">
                        DUCKED
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-white/50">{musicClips.length} clips</div>
                </div>
              </div>

              {/* Mute and Solo Buttons */}
              <div className="flex items-center gap-1">
                <button
                  id="btn-solo-music"
                  onClick={() => updateChannel("music", { isSolo: !mixer.music.isSolo })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    mixer.music.isSolo
                      ? "bg-[#F59E0B] text-black border-[#F59E0B]"
                      : "bg-white/5 text-white/50 hover:text-white border-white/10"
                  }`}
                  title="Solo music track"
                >
                  S
                </button>
                <button
                  id="btn-mute-music"
                  onClick={() => updateChannel("music", { isMuted: !mixer.music.isMuted })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    mixer.music.isMuted
                      ? "bg-[#EF4444] text-white border-[#EF4444]"
                      : "bg-white/5 text-white/50 hover:text-white border-white/10"
                  }`}
                  title="Mute music track"
                >
                  M
                </button>
              </div>
            </div>

            {/* Volume Fader Slider & Readout */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Fader Level</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50 text-[11px]">{convertVolToDb(mixer.music.volume)}</span>
                  <span className="font-mono font-bold text-[#00E5FF]">{mixer.music.volume}%</span>
                </div>
              </div>
              <input
                id="fader-music-volume"
                type="range"
                min="0"
                max="200"
                value={mixer.music.volume}
                onChange={(e) => updateChannel("music", { volume: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono">
                <span>0%</span>
                <span>100% (0dB)</span>
                <span>200% (+6dB)</span>
              </div>
            </div>

            {/* Peak Meter Bars */}
            <div className="h-3 bg-black/40 rounded-lg p-0.5 border border-white/5 flex items-center gap-0.5 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => {
                const effectivePercent = mixer.music.isMuted ? 0 : (mixer.music.volume / 200) * 100;
                const active = isPlaying && (i / 16) * 100 < effectivePercent;
                const isDuckDip = duckingState.isDucked && i > 4;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                      active && !isDuckDip
                        ? i > 12
                          ? "bg-[#EF4444]"
                          : i > 9
                          ? "bg-[#F59E0B]"
                          : "bg-[#00E5FF]"
                        : "bg-white/5"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 2. VOICEOVER CHANNEL */}
          <div className="p-3.5 rounded-2xl bg-[#12121A] border border-[#A855F7]/20 flex flex-col justify-between space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Voiceover (VO)</span>
                    <span className="text-[8px] bg-[#A855F7]/20 text-[#A855F7] px-1 py-0.2 rounded font-mono">
                      SPEECH
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50">{voiceClips.length} recordings</div>
                </div>
              </div>

              {/* Mute and Solo Buttons */}
              <div className="flex items-center gap-1">
                <button
                  id="btn-solo-voiceover"
                  onClick={() => updateChannel("voiceover", { isSolo: !mixer.voiceover.isSolo })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    mixer.voiceover.isSolo
                      ? "bg-[#F59E0B] text-black border-[#F59E0B]"
                      : "bg-white/5 text-white/50 hover:text-white border-white/10"
                  }`}
                  title="Solo voiceover track"
                >
                  S
                </button>
                <button
                  id="btn-mute-voiceover"
                  onClick={() => updateChannel("voiceover", { isMuted: !mixer.voiceover.isMuted })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    mixer.voiceover.isMuted
                      ? "bg-[#EF4444] text-white border-[#EF4444]"
                      : "bg-white/5 text-white/50 hover:text-white border-white/10"
                  }`}
                  title="Mute voiceover track"
                >
                  M
                </button>
              </div>
            </div>

            {/* Volume Fader Slider & Readout */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Fader Level</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50 text-[11px]">{convertVolToDb(mixer.voiceover.volume)}</span>
                  <span className="font-mono font-bold text-[#A855F7]">{mixer.voiceover.volume}%</span>
                </div>
              </div>
              <input
                id="fader-voiceover-volume"
                type="range"
                min="0"
                max="200"
                value={mixer.voiceover.volume}
                onChange={(e) => updateChannel("voiceover", { volume: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A855F7]"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono">
                <span>0%</span>
                <span>100% (0dB)</span>
                <span>200% (+6dB)</span>
              </div>
            </div>

            {/* Peak Meter Bars */}
            <div className="h-3 bg-black/40 rounded-lg p-0.5 border border-white/5 flex items-center gap-0.5 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => {
                const effectivePercent = mixer.voiceover.isMuted ? 0 : (mixer.voiceover.volume / 200) * 100;
                const active = isPlaying && (i / 16) * 100 < effectivePercent;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                      active
                        ? i > 12
                          ? "bg-[#EF4444]"
                          : i > 9
                          ? "bg-[#F59E0B]"
                          : "bg-[#A855F7]"
                        : "bg-white/5"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 3. SOUND EFFECTS CHANNEL */}
          <div className="p-3.5 rounded-2xl bg-[#12121A] border border-[#F59E0B]/20 flex flex-col justify-between space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Sound FX (SFX)</span>
                    <span className="text-[8px] bg-[#F59E0B]/20 text-[#F59E0B] px-1 py-0.2 rounded font-mono">
                      FOLEY
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50">{sfxClips.length} sound cues</div>
                </div>
              </div>

              {/* Mute and Solo Buttons */}
              <div className="flex items-center gap-1">
                <button
                  id="btn-solo-sfx"
                  onClick={() => updateChannel("sfx", { isSolo: !mixer.sfx.isSolo })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    mixer.sfx.isSolo
                      ? "bg-[#F59E0B] text-black border-[#F59E0B]"
                      : "bg-white/5 text-white/50 hover:text-white border-white/10"
                  }`}
                  title="Solo SFX track"
                >
                  S
                </button>
                <button
                  id="btn-mute-sfx"
                  onClick={() => updateChannel("sfx", { isMuted: !mixer.sfx.isMuted })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    mixer.sfx.isMuted
                      ? "bg-[#EF4444] text-white border-[#EF4444]"
                      : "bg-white/5 text-white/50 hover:text-white border-white/10"
                  }`}
                  title="Mute SFX track"
                >
                  M
                </button>
              </div>
            </div>

            {/* Volume Fader Slider & Readout */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Fader Level</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50 text-[11px]">{convertVolToDb(mixer.sfx.volume)}</span>
                  <span className="font-mono font-bold text-[#F59E0B]">{mixer.sfx.volume}%</span>
                </div>
              </div>
              <input
                id="fader-sfx-volume"
                type="range"
                min="0"
                max="200"
                value={mixer.sfx.volume}
                onChange={(e) => updateChannel("sfx", { volume: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono">
                <span>0%</span>
                <span>100% (0dB)</span>
                <span>200% (+6dB)</span>
              </div>
            </div>

            {/* Peak Meter Bars */}
            <div className="h-3 bg-black/40 rounded-lg p-0.5 border border-white/5 flex items-center gap-0.5 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => {
                const effectivePercent = mixer.sfx.isMuted ? 0 : (mixer.sfx.volume / 200) * 100;
                const active = isPlaying && (i / 16) * 100 < effectivePercent;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                      active
                        ? i > 12
                          ? "bg-[#EF4444]"
                          : i > 9
                          ? "bg-[#F59E0B]"
                          : "bg-[#F59E0B]"
                        : "bg-white/5"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 4. MASTER OUTPUT CHANNEL */}
          <div className="p-3.5 rounded-2xl bg-[#151520] border border-white/15 flex flex-col justify-between space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/20">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Master Output</div>
                  <div className="text-[10px] text-white/50">Overall Studio Mix</div>
                </div>
              </div>

              <button
                id="btn-reset-master-vol"
                onClick={() => onUpdateMixer({ ...mixer, masterVolume: 100 })}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all"
                title="Reset master volume to 100%"
              >
                100%
              </button>
            </div>

            {/* Volume Fader Slider & Readout */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Master Level</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50 text-[11px]">{convertVolToDb(mixer.masterVolume)}</span>
                  <span className="font-mono font-bold text-white">{mixer.masterVolume}%</span>
                </div>
              </div>
              <input
                id="fader-master-volume"
                type="range"
                min="0"
                max="200"
                value={mixer.masterVolume}
                onChange={(e) => onUpdateMixer({ ...mixer, masterVolume: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>

            {/* Master Stereo Peak Meter */}
            <div className="space-y-1">
              <div className="h-1.5 bg-black/40 rounded-full p-0.5 border border-white/5 flex items-center gap-0.5 overflow-hidden">
                {Array.from({ length: 16 }).map((_, i) => {
                  const active = isPlaying && (i / 16) * 100 < (mixer.masterVolume / 200) * 100;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                        active
                          ? i > 13
                            ? "bg-[#EF4444]"
                            : i > 10
                            ? "bg-[#F59E0B]"
                            : "bg-[#10B981]"
                          : "bg-white/5"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="h-1.5 bg-black/40 rounded-full p-0.5 border border-white/5 flex items-center gap-0.5 overflow-hidden">
                {Array.from({ length: 16 }).map((_, i) => {
                  const active = isPlaying && (i / 16) * 100 < (mixer.masterVolume / 200) * 95;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                        active
                          ? i > 13
                            ? "bg-[#EF4444]"
                            : i > 10
                            ? "bg-[#F59E0B]"
                            : "bg-[#10B981]"
                          : "bg-white/5"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK AUDIO ACTION BUTTONS */}
      {onOpenAddAudioModal && (
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <span className="text-xs text-white/50">Need more tracks or sound assets?</span>
          <button
            onClick={onOpenAddAudioModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Open Audio Library & Recording</span>
          </button>
        </div>
      )}
    </div>
  );
};
