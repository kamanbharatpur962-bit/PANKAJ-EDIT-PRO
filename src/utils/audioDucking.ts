import { AudioMixerSettings, AudioTrackItem, VideoProject } from "../types";

export const DEFAULT_AUDIO_MIXER: AudioMixerSettings = {
  music: {
    volume: 85,
    isMuted: false,
    isSolo: false,
  },
  voiceover: {
    volume: 110,
    isMuted: false,
    isSolo: false,
  },
  sfx: {
    volume: 90,
    isMuted: false,
    isSolo: false,
  },
  masterVolume: 100,
  ducking: {
    enabled: true,
    duckAmount: 25, // Duck music down to 25% volume during voiceover / dialogue
    fadeTime: 0.35, // 350ms smooth attack and release
    targetTypes: ["voiceover"],
    threshold: 0.1,
  },
};

export interface DuckingSpan {
  start: number;
  end: number;
  rampInStart: number;
  rampOutEnd: number;
  duckFactor: number;
  triggerNames: string[];
}

/**
 * Returns all time intervals where background music is ducked due to voiceover or sound effects
 */
export function computeDuckingSpans(project: VideoProject): DuckingSpan[] {
  const mixer = project.audioMixer || DEFAULT_AUDIO_MIXER;
  if (!mixer.ducking.enabled) return [];

  const targetTypes = mixer.ducking.targetTypes || ["voiceover"];
  const triggerTracks = project.audioTracks.filter(
    (t) => targetTypes.includes(t.type as any) && !t.isMuted
  );

  if (triggerTracks.length === 0) return [];

  const fade = mixer.ducking.fadeTime;
  const duckFactor = Math.max(0.05, Math.min(1.0, mixer.ducking.duckAmount / 100));

  // Build raw intervals
  const rawIntervals = triggerTracks.map((t) => {
    const start = t.startTime;
    const end = t.startTime + (t.trimEnd - t.trimStart);
    return {
      start,
      end,
      rampInStart: Math.max(0, start - fade),
      rampOutEnd: end + fade,
      name: t.name,
    };
  });

  // Sort intervals by start time
  rawIntervals.sort((a, b) => a.rampInStart - b.rampInStart);

  // Merge overlapping intervals
  const merged: DuckingSpan[] = [];
  for (const interval of rawIntervals) {
    if (merged.length === 0) {
      merged.push({
        start: interval.start,
        end: interval.end,
        rampInStart: interval.rampInStart,
        rampOutEnd: interval.rampOutEnd,
        duckFactor,
        triggerNames: [interval.name],
      });
    } else {
      const prev = merged[merged.length - 1];
      if (interval.rampInStart <= prev.rampOutEnd) {
        // Overlap - extend
        prev.end = Math.max(prev.end, interval.end);
        prev.rampOutEnd = Math.max(prev.rampOutEnd, interval.rampOutEnd);
        if (!prev.triggerNames.includes(interval.name)) {
          prev.triggerNames.push(interval.name);
        }
      } else {
        merged.push({
          start: interval.start,
          end: interval.end,
          rampInStart: interval.rampInStart,
          rampOutEnd: interval.rampOutEnd,
          duckFactor,
          triggerNames: [interval.name],
        });
      }
    }
  }

  return merged;
}

/**
 * Calculates current ducking multiplier (0.0 to 1.0) for background music at the given timestamp
 */
export function getDuckingMultiplierAtTime(time: number, project: VideoProject): {
  multiplier: number;
  isDucked: boolean;
  activeTriggers: string[];
} {
  const mixer = project.audioMixer || DEFAULT_AUDIO_MIXER;
  if (!mixer.ducking.enabled) {
    return { multiplier: 1.0, isDucked: false, activeTriggers: [] };
  }

  const spans = computeDuckingSpans(project);
  if (spans.length === 0) {
    return { multiplier: 1.0, isDucked: false, activeTriggers: [] };
  }

  const fade = mixer.ducking.fadeTime;
  const duckFactor = Math.max(0.05, Math.min(1.0, mixer.ducking.duckAmount / 100));

  for (const span of spans) {
    if (time >= span.rampInStart && time <= span.rampOutEnd) {
      if (time < span.start) {
        // Attack phase (ramping down)
        const progress = (time - span.rampInStart) / Math.max(0.01, span.start - span.rampInStart);
        // smooth cosine interpolation
        const smooth = 0.5 * (1 - Math.cos(Math.PI * progress));
        const multiplier = 1.0 - smooth * (1.0 - duckFactor);
        return { multiplier, isDucked: true, activeTriggers: span.triggerNames };
      } else if (time > span.end) {
        // Release phase (ramping back up)
        const progress = (time - span.end) / Math.max(0.01, span.rampOutEnd - span.end);
        const smooth = 0.5 * (1 - Math.cos(Math.PI * progress));
        const multiplier = duckFactor + smooth * (1.0 - duckFactor);
        return { multiplier, isDucked: true, activeTriggers: span.triggerNames };
      } else {
        // Fully ducked
        return { multiplier: duckFactor, isDucked: true, activeTriggers: span.triggerNames };
      }
    }
  }

  return { multiplier: 1.0, isDucked: false, activeTriggers: [] };
}

/**
 * Computes the real-time effective output volume for an audio track taking into account:
 * - Clip volume
 * - Track lane volume & Mute/Solo
 * - Master volume
 * - Fade in / fade out curve
 * - Auto-ducking (if track is music)
 */
export function getEffectiveClipVolume(
  track: AudioTrackItem,
  time: number,
  project: VideoProject
): number {
  const mixer = project.audioMixer || DEFAULT_AUDIO_MIXER;

  // Check solo state across lanes
  const anyLaneSolo = mixer.music.isSolo || mixer.voiceover.isSolo || mixer.sfx.isSolo;
  const trackLane =
    track.type === "voiceover"
      ? mixer.voiceover
      : track.type === "sfx"
      ? mixer.sfx
      : mixer.music;

  if (trackLane.isMuted || track.isMuted) return 0;
  if (anyLaneSolo && !trackLane.isSolo && !track.isSolo) return 0;

  // Base gain calculation
  let gain = (track.volume / 100) * (trackLane.volume / 100) * (mixer.masterVolume / 100);

  // Apply clip fade in / fade out
  const clipTime = time - track.startTime;
  const clipDuration = track.trimEnd - track.trimStart;

  if (clipTime < 0 || clipTime > clipDuration) {
    return 0;
  }

  if (track.fadeIn > 0 && clipTime < track.fadeIn) {
    gain *= clipTime / track.fadeIn;
  }

  if (track.fadeOut > 0 && clipTime > clipDuration - track.fadeOut) {
    gain *= Math.max(0, (clipDuration - clipTime) / track.fadeOut);
  }

  // Apply auto-ducking to music track
  if (track.type === "music") {
    const { multiplier } = getDuckingMultiplierAtTime(time, project);
    gain *= multiplier;
  }

  return Math.max(0, gain);
}
