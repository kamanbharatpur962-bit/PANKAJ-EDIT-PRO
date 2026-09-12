import React, { useRef, useState } from "react";
import { AudioTrack, VideoProject, AudioMixerSettings } from "../../types";
import { AUDIO_SFX_PRESETS, SAMPLE_MUSIC } from "../../data/sampleMedia";
import { playSoundEffect, VoiceoverRecorder } from "../../utils/audioEngine";
import { AudioMixerPanel } from "./AudioMixerPanel";
import { 
  Music, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Upload, 
  Play, 
  Square, 
  Radio,
  Sliders,
  Check,
  Waves
} from "lucide-react";

interface AudioPanelProps {
  project: VideoProject;
  onAddAudioTrack: (track: AudioTrack) => void;
  onAutoBeatSync: () => void;
  onDetectBeats: () => void;
  onUpdateAudioTrack: (trackId: string, updates: Partial<AudioTrack>) => void;
  onUpdateMixer?: (mixer: AudioMixerSettings) => void;
  currentTime?: number;
  isPlaying?: boolean;
}

export const AudioPanel: React.FC<AudioPanelProps> = ({
  project,
  onAddAudioTrack,
  onAutoBeatSync,
  onDetectBeats,
  onUpdateAudioTrack,
  onUpdateMixer,
  currentTime = 0,
  isPlaying = false,
}) => {
  const [activeTab, setActiveTab] = useState<"library" | "sfx" | "voiceover" | "beats" | "mixer">("library");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recorderRef = useRef<VoiceoverRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active selected audio track
  const activeTrack = project.audioTracks[0];

  // Sound effect audition
  const handlePlaySFX = (type: any) => {
    playSoundEffect(type);
  };

  const handleAddSFX = (sfx: (typeof AUDIO_SFX_PRESETS)[0]) => {
    playSoundEffect(sfx.name);
    onAddAudioTrack({
      id: `sfx-${Date.now()}`,
      name: sfx.name,
      url: "",
      type: "sfx",
      duration: sfx.duration,
      startTime: 0,
      trimStart: 0,
      trimEnd: sfx.duration,
      volume: 100,
      fadeIn: 0,
      fadeOut: 0,
    });
  };

  // Voiceover record
  const handleToggleRecord = async () => {
    if (!isRecording) {
      try {
        const rec = new VoiceoverRecorder();
        await rec.start();
        recorderRef.current = rec;
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn("Could not start recording:", err);
      }
    } else {
      if (recorderRef.current) {
        const audioUrl = await recorderRef.current.stop();
        setIsRecording(false);
        clearInterval(timerRef.current);

        onAddAudioTrack({
          id: `voice-${Date.now()}`,
          name: `Voiceover (${recordingSeconds}s)`,
          url: audioUrl,
          type: "voiceover",
          duration: recordingSeconds || 3,
          startTime: 0,
          trimStart: 0,
          trimEnd: recordingSeconds || 3,
          volume: 120,
          fadeIn: 0.1,
          fadeOut: 0.2,
        });
      }
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAddAudioTrack({
        id: `custom-audio-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url,
        type: "music",
        duration: 15,
        startTime: 0,
        trimStart: 0,
        trimEnd: 15,
        volume: 90,
        fadeIn: 0.5,
        fadeOut: 0.5,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E0E0E0] select-none overflow-y-auto p-3 space-y-3">
      {/* Sub tabs */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-[#1A1A1A] overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: "library", label: "Music Tracks" },
          { id: "sfx", label: "Sound Effects (SFX)" },
          { id: "voiceover", label: "Voiceover Record" },
          { id: "beats", label: "Beat Sync AI" },
          { id: "mixer", label: "🎚️ Mixer & Ducking" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === t.id
                ? "bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm"
                : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. Music Library */}
      {activeTab === "library" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#E0E0E0]">Cinematic Soundtracks</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#161618] hover:bg-[#202024] border border-[#222] text-[#FFB347] transition-all"
            >
              <Upload className="w-3 h-3" />
              <span>Import Audio</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioFileUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            {SAMPLE_MUSIC.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#161618] border border-[#222] hover:border-[#333] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFB347]/15 border border-[#FFB347]/30 flex items-center justify-center text-[#FFB347]">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#E0E0E0]">{m.name}</div>
                    <div className="text-[10px] text-[#888]">
                      {m.genre} • {m.bpm} BPM • {m.duration}s
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-add-music-${m.id}`}
                  onClick={() =>
                    onAddAudioTrack({
                      id: `music-${Date.now()}`,
                      name: m.name,
                      url: m.url,
                      type: "music",
                      duration: m.duration,
                      startTime: 0,
                      trimStart: 0,
                      trimEnd: m.duration,
                      volume: 85,
                      fadeIn: 0.5,
                      fadeOut: 0.8,
                    })
                  }
                  className="px-3 py-1 rounded-lg bg-[#FFB347] text-[#0A0A0A] font-semibold text-xs hover:bg-[#FFA327] active:scale-95 transition-all shadow-sm"
                >
                  Use Track
                </button>
              </div>
            ))}
          </div>

          {/* Active Audio Track Adjustments */}
          {activeTrack && (
            <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-2.5 mt-3">
              <div className="flex justify-between text-xs font-medium text-[#E0E0E0]">
                <span>Active Track: {activeTrack.name}</span>
                <span className="font-mono text-[#FFB347] font-semibold">{activeTrack.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={activeTrack.volume}
                onChange={(e) =>
                  onUpdateAudioTrack(activeTrack.id, { volume: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-[#1A1A1A] rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* 2. SFX Library */}
      {activeTab === "sfx" && (
        <div className="space-y-3">
          <div className="text-xs font-medium text-[#E0E0E0]">
            Synthesized Real-Time Cinematic Foley & SFX
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AUDIO_SFX_PRESETS.map((sfx) => (
              <div
                key={sfx.id}
                className="p-2.5 rounded-xl bg-[#161618] border border-[#222] flex flex-col justify-between space-y-2 hover:border-[#333] transition-all"
              >
                <div>
                  <div className="text-xs font-semibold text-[#E0E0E0]">{sfx.name}</div>
                  <div className="text-[10px] text-[#888]">{sfx.category}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlaySFX(sfx.name)}
                    className="flex-1 py-1 rounded-lg bg-[#222] hover:bg-[#2c2c30] text-[#E0E0E0] text-xs font-medium flex items-center justify-center gap-1 transition-all"
                  >
                    <Play className="w-3 h-3 text-[#FFB347] fill-current" />
                    <span>Audition</span>
                  </button>
                  <button
                    onClick={() => handleAddSFX(sfx)}
                    className="px-2 py-1 rounded-lg bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 text-xs font-medium hover:bg-[#FFB347]/25 transition-all"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Voiceover Recorder */}
      {activeTab === "voiceover" && (
        <div className="bg-[#161618] rounded-xl p-6 border border-[#222] flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <div className="text-xs font-semibold text-[#E0E0E0]">Studio Voiceover Recording</div>
            <div className="text-[10px] text-[#888] mt-0.5">
              Record crystal-clear narration directly into your project timeline
            </div>
          </div>

          <div className="font-mono text-3xl font-bold text-[#FFB347]">
            00:{recordingSeconds.toString().padStart(2, "0")}
          </div>

          <button
            id="btn-voiceover-record"
            onClick={handleToggleRecord}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${
              isRecording
                ? "bg-[#FF4444] text-white animate-pulse shadow-[#FF4444]/40 ring-4 ring-[#FF4444]/30"
                : "bg-[#FFB347] text-[#0A0A0A] shadow-[#FFB347]/30 hover:bg-[#FFA327]"
            }`}
          >
            {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
          </button>

          <span className="text-[11px] text-[#888] font-medium">
            {isRecording ? "Recording in progress... Tap to finish" : "Tap to start voice recording"}
          </span>
        </div>
      )}

      {/* 4. Beat Detection & Auto Beat Sync */}
      {activeTab === "beats" && (
        <div className="space-y-3">
          <div className="bg-[#161618] rounded-xl p-3 border border-[#222] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFB347]" />
              <div>
                <div className="text-xs font-semibold text-[#E0E0E0]">AI Beat Detection & Rhythm Sync</div>
                <div className="text-[10px] text-[#888]">
                  Analyze transient energy peaks and mark rhythmic cut points on the timeline
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                id="btn-detect-beats"
                onClick={onDetectBeats}
                className="flex-1 py-2 rounded-xl bg-[#222] hover:bg-[#2c2c30] text-[#FFB347] font-medium text-xs border border-[#FFB347]/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Detect Audio Beats</span>
              </button>

              <button
                id="btn-auto-beat-sync"
                onClick={onAutoBeatSync}
                className="flex-1 py-2 rounded-xl bg-[#FFB347] text-[#0A0A0A] font-semibold text-xs hover:bg-[#FFA327] flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Cut to Beats</span>
              </button>
            </div>

            {project.beatMarkers && project.beatMarkers.length > 0 && (
              <div className="text-[11px] text-[#888] bg-[#0A0A0A] border border-[#222] p-2 rounded-lg flex items-center justify-between">
                <span>{project.beatMarkers.length} rhythmic beat drops synchronized</span>
                <span className="text-[#FFB347] font-mono font-semibold">128 BPM</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Audio Mixer & Ducking Controls */}
      {activeTab === "mixer" && (
        <div className="flex-1 -m-3">
          <AudioMixerPanel
            project={project}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onUpdateMixer={(m) => onUpdateMixer?.(m)}
          />
        </div>
      )}
    </div>
  );
};
