import { VideoProject, AudioTrackItem } from "../types";
import { getEffectiveClipVolume } from "./audioDucking";

/**
 * Pankaj Edit Pro - Professional Web Audio Engine
 * Handles audio playback, synthesized SFX, microphone voiceover, beat detection, and audio extraction
 */

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Synthesize professional sound effects with Web Audio so they work instantly offline
export function playSynthesizedSFX(type: string, volume: number = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case "Cinematic Whoosh":
      case "sfx-1": {
        // Noise buffer swept through bandpass filter
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.4);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.8);
        filter.Q.setValueAtTime(3, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start(now);
        noise.stop(now + 0.8);
        break;
      }

      case "Sub Heavy Boom":
      case "Bass Drop 808":
      case "sfx-2":
      case "sfx-7": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.7);

        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.6);
        break;
      }

      case "Camera Shutter Click":
      case "sfx-3": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case "Glitch Data Static":
      case "sfx-4": {
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() > 0.85 ? 1 : -1) * (Math.random() * 0.5);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        noise.connect(gain);
        gain.connect(masterGain);
        noise.start(now);
        break;
      }

      case "Crisp Pop":
      case "sfx-8": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      default: {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    }
  } catch (err) {
    console.warn("Audio SFX playback error:", err);
  }
}

// Voice-over recorder using browser MediaRecorder API
export class VoiceoverRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  public isRecording = false;

  async start(): Promise<void> {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  stop(): Promise<{ blob: Blob; url: string; duration: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"));
        return;
      }

      const startTime = Date.now();

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = Math.max(0.5, (Date.now() - startTime) / 1000);

        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }
        this.isRecording = false;
        resolve({ blob, url, duration });
      };

      this.mediaRecorder.stop();
    });
  }
}

// Automated beat detection analyzing audio transients
export async function detectAudioBeats(audioUrlOrBlob: string | Blob, targetBpm: number = 120): Promise<number[]> {
  try {
    const ctx = getAudioContext();
    let arrayBuffer: ArrayBuffer;

    if (typeof audioUrlOrBlob === "string") {
      const response = await fetch(audioUrlOrBlob);
      arrayBuffer = await response.arrayBuffer();
    } else {
      arrayBuffer = await audioUrlOrBlob.arrayBuffer();
    }

    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Peak detection with rhythmic window
    const beatInterval = 60 / targetBpm;
    const beats: number[] = [];

    // Analyze RMS energy in chunks of 50ms
    const chunkSize = Math.floor(sampleRate * 0.05);
    const energyChunks: number[] = [];

    for (let i = 0; i < channelData.length; i += chunkSize) {
      let sum = 0;
      const end = Math.min(i + chunkSize, channelData.length);
      for (let j = i; j < end; j++) {
        sum += channelData[j] * channelData[j];
      }
      energyChunks.push(Math.sqrt(sum / (end - i)));
    }

    // Identify local peaks that correspond with rhythm
    const stepSeconds = 0.05;
    const minTimeBetweenBeats = beatInterval * 0.75;
    let lastBeatTime = -minTimeBetweenBeats;

    for (let i = 1; i < energyChunks.length - 1; i++) {
      const time = i * stepSeconds;
      if (time > duration) break;

      const current = energyChunks[i];
      const prev = energyChunks[i - 1];
      const next = energyChunks[i + 1];

      // Threshold peak
      if (current > 0.08 && current > prev && current > next) {
        if (time - lastBeatTime >= minTimeBetweenBeats) {
          beats.push(parseFloat(time.toFixed(2)));
          lastBeatTime = time;
        }
      }
    }

    // If audio is quiet, synthesize regular BPM beat markers
    if (beats.length < 4) {
      const fallbackBeats: number[] = [];
      for (let t = beatInterval; t < duration; t += beatInterval) {
        fallbackBeats.push(parseFloat(t.toFixed(2)));
      }
      return fallbackBeats;
    }

    return beats;
  } catch (err) {
    console.warn("Beat detection fallback to uniform BPM grid:", err);
    const beatInterval = 60 / targetBpm;
    const fallbackBeats: number[] = [];
    for (let t = beatInterval; t <= 15; t += beatInterval) {
      fallbackBeats.push(parseFloat(t.toFixed(2)));
    }
    return fallbackBeats;
  }
}

export const playSoundEffect = playSynthesizedSFX;
export const VoiceRecorder = VoiceoverRecorder;

/**
 * MultiTrackPlaybackEngine manages synchronized multi-track playback
 * (BGM, Voiceover, SFX) with dynamic volume faders and auto-ducking.
 */
class MultiTrackPlaybackEngine {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private lastTriggeredSfx: Set<string> = new Set();

  public sync(project: VideoProject, currentTime: number, isPlaying: boolean) {
    if (typeof window === "undefined") return;

    // Retain only audio elements for existing tracks
    const existingIds = new Set(project.audioTracks.map((t) => t.id));
    for (const [id, el] of this.audioElements.entries()) {
      if (!existingIds.has(id)) {
        el.pause();
        el.src = "";
        this.audioElements.delete(id);
      }
    }

    if (!isPlaying) {
      // Pause all audio elements
      for (const el of this.audioElements.values()) {
        if (!el.paused) {
          el.pause();
        }
      }
      return;
    }

    // Process each track in the multi-track timeline
    for (const track of project.audioTracks) {
      const clipDuration = track.trimEnd - track.trimStart;
      const isWithinTime =
        currentTime >= track.startTime && currentTime <= track.startTime + clipDuration;

      // Handle synthetic SFX tracks if no direct audio url
      if (track.type === "sfx" && (!track.url || track.url.length === 0)) {
        const threshold = 0.08;
        if (Math.abs(currentTime - track.startTime) < threshold && !this.lastTriggeredSfx.has(track.id)) {
          const effectiveVol = getEffectiveClipVolume(track, currentTime, project);
          if (effectiveVol > 0.01) {
            playSynthesizedSFX(track.name, effectiveVol);
          }
          this.lastTriggeredSfx.add(track.id);
        } else if (Math.abs(currentTime - track.startTime) > 0.5) {
          this.lastTriggeredSfx.delete(track.id);
        }
        continue;
      }

      if (!track.url) continue;

      let el = this.audioElements.get(track.id);
      if (!el) {
        el = new Audio();
        el.preload = "auto";
        el.crossOrigin = "anonymous";
        el.src = track.url;
        this.audioElements.set(track.id, el);
      } else if (el.src !== track.url) {
        el.src = track.url;
      }

      if (isWithinTime) {
        const targetAudioTime = track.trimStart + (currentTime - track.startTime);
        // Resync if time drifted more than 0.25 seconds
        if (Math.abs(el.currentTime - targetAudioTime) > 0.25) {
          try {
            el.currentTime = Math.max(0, targetAudioTime);
          } catch (_) {}
        }

        // Calculate real-time ducked volume
        const effectiveGain = getEffectiveClipVolume(track, currentTime, project);
        el.volume = Math.max(0, Math.min(1.0, effectiveGain));

        if (el.paused) {
          el.play().catch(() => {
            // Ignore autoplay policy rejections during scrubbing
          });
        }
      } else {
        if (!el.paused) {
          el.pause();
        }
      }
    }
  }

  public stopAll() {
    for (const el of this.audioElements.values()) {
      el.pause();
    }
  }
}

export const multiTrackAudioEngine = new MultiTrackPlaybackEngine();
