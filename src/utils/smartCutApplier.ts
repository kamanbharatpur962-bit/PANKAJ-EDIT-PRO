import { Clip, SmartCutSegment, VideoProject } from "../types";

/**
 * Applies smart cuts by removing specified segments and shifting remaining media forward.
 */
export function applySmartCutsToProject(
  project: VideoProject,
  cutsToApply: SmartCutSegment[]
): VideoProject {
  if (!cutsToApply || cutsToApply.length === 0) return project;

  // Filter only selected cuts and sort chronologically
  const activeCuts = [...cutsToApply]
    .filter((c) => c.selected)
    .sort((a, b) => a.startTime - b.startTime);

  if (activeCuts.length === 0) return project;

  // Merge overlapping or adjacent cuts
  const mergedCuts: { startTime: number; endTime: number }[] = [];
  for (const cut of activeCuts) {
    if (mergedCuts.length === 0) {
      mergedCuts.push({ startTime: cut.startTime, endTime: cut.endTime });
    } else {
      const prev = mergedCuts[mergedCuts.length - 1];
      if (cut.startTime <= prev.endTime + 0.05) {
        prev.endTime = Math.max(prev.endTime, cut.endTime);
      } else {
        mergedCuts.push({ startTime: cut.startTime, endTime: cut.endTime });
      }
    }
  }

  // Calculate new clips
  let currentClips = [...project.clips];
  const newClips: Clip[] = [];

  for (const clip of currentClips) {
    const clipStart = clip.startTime;
    const clipTrimmedDur = (clip.trimEnd - clip.trimStart) / clip.speed;
    const clipEnd = clipStart + clipTrimmedDur;

    // Check overlap with each merged cut
    let segments: { start: number; end: number }[] = [{ start: clipStart, end: clipEnd }];

    for (const cut of mergedCuts) {
      const nextSegments: { start: number; end: number }[] = [];
      for (const seg of segments) {
        // No overlap
        if (cut.endTime <= seg.start || cut.startTime >= seg.end) {
          nextSegments.push(seg);
        } else {
          // Overlap: keep part before cut if > 0.2s
          if (cut.startTime > seg.start + 0.15) {
            nextSegments.push({ start: seg.start, end: cut.startTime });
          }
          // keep part after cut if > 0.2s
          if (cut.endTime < seg.end - 0.15) {
            nextSegments.push({ start: cut.endTime, end: seg.end });
          }
        }
      }
      segments = nextSegments;
    }

    // Convert retained segments into new clips
    segments.forEach((seg, idx) => {
      const segDur = seg.end - seg.start;
      if (segDur < 0.2) return;

      const offsetFromOriginalStart = (seg.start - clipStart) * clip.speed;
      const newTrimStart = clip.trimStart + offsetFromOriginalStart;
      const newTrimEnd = newTrimStart + segDur * clip.speed;

      newClips.push({
        ...clip,
        id: idx === 0 ? clip.id : `${clip.id}-cut-${idx}-${Date.now()}`,
        startTime: seg.start,
        trimStart: Math.max(0, parseFloat(newTrimStart.toFixed(2))),
        trimEnd: Math.min(clip.duration, parseFloat(newTrimEnd.toFixed(2))),
        keyframes: (clip.keyframes || [])
          .filter((kf) => {
            const kfTimeInClip = kf.time / clip.speed;
            const kfGlobalTime = clipStart + kfTimeInClip;
            return kfGlobalTime >= seg.start && kfGlobalTime <= seg.end;
          })
          .map((kf) => ({
            ...kf,
            time: Math.max(0, parseFloat((kf.time - offsetFromOriginalStart).toFixed(2))),
          })),
      });
    });
  }

  // Re-align clips end-to-end to eliminate gaps created by removed cuts
  newClips.sort((a, b) => a.startTime - b.startTime);
  let accumulatedTime = 0;
  const packedClips = newClips.map((clip) => {
    const dur = (clip.trimEnd - clip.trimStart) / clip.speed;
    const packedClip = {
      ...clip,
      startTime: parseFloat(accumulatedTime.toFixed(2)),
    };
    accumulatedTime += dur;
    return packedClip;
  });

  const totalDuration = Math.max(1, parseFloat(accumulatedTime.toFixed(2)));

  // Adjust audio tracks that extend beyond new duration
  const adjustedAudio = project.audioTracks.map((a) => ({
    ...a,
    trimEnd: Math.min(a.trimEnd, totalDuration),
  }));

  // Adjust text tracks to fit within new duration
  const adjustedText = project.textTracks.map((t) => ({
    ...t,
    startTime: Math.min(t.startTime, Math.max(0, totalDuration - 1)),
  }));

  return {
    ...project,
    clips: packedClips,
    audioTracks: adjustedAudio,
    textTracks: adjustedText,
    duration: totalDuration,
    updatedAt: Date.now(),
  };
}
