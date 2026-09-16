/**
 * Pankaj Edit Pro - Professional Video Compositor & Canvas Rendering Engine
 */

import { Clip, ColorGrading, EffectItem, FilterType, Keyframe, KeyframeEasing, LyricLine, TextItem, TransitionItem, VideoProject } from "../types";
import { getPresetCSSFilter } from "../data/filters300";
import { getAnimationById, calculateAnimationTransform, AnimationTransform } from "../data/animations200";

// Cache for loaded images and video elements
const mediaElementCache = new Map<string, HTMLImageElement | HTMLVideoElement>();

export function getMediaElement(url: string, type: "video" | "photo"): HTMLImageElement | HTMLVideoElement {
  if (mediaElementCache.has(url)) {
    return mediaElementCache.get(url)!;
  }

  const isRemoteHttp = url.startsWith("http://") || url.startsWith("https://");

  if (type === "video") {
    const video = document.createElement("video");
    video.src = url;
    if (isRemoteHttp) {
      video.crossOrigin = "anonymous";
    }
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    mediaElementCache.set(url, video);
    return video;
  } else {
    const img = new Image();
    img.src = url;
    if (isRemoteHttp) {
      img.crossOrigin = "anonymous";
    }
    mediaElementCache.set(url, img);
    return img;
  }
}

// Mathematical Easing Functions for Advanced Dynamic Keyframe Animations
export function applyKeyframeEasing(t: number, easing?: KeyframeEasing): number {
  const clamped = Math.max(0, Math.min(1, t));
  switch (easing) {
    case "ease-in":
      return clamped * clamped * clamped; // Cubic ease in
    case "ease-out":
      return 1 - Math.pow(1 - clamped, 3); // Cubic ease out
    case "ease-in-out":
      return clamped < 0.5
        ? 4 * clamped * clamped * clamped
        : 1 - Math.pow(-2 * clamped + 2, 3) / 2; // Smooth cubic S-curve
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let x = clamped;
      if (x < 1 / d1) {
        return n1 * x * x;
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    }
    case "elastic": {
      const c4 = (2 * Math.PI) / 3;
      return clamped === 0
        ? 0
        : clamped === 1
        ? 1
        : Math.pow(2, -10 * clamped) * Math.sin((clamped * 10 - 0.75) * c4) + 1;
    }
    case "linear":
    default:
      return clamped;
  }
}

// Compute interpolated keyframe attributes with easing across multiple keyframes
export function interpolateItemKeyframes(
  item: {
    keyframes?: Keyframe[];
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    opacity?: number;
  },
  relTime: number
): {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
} {
  const base = {
    x: item.x || 0,
    y: item.y || 0,
    scale: item.scale ?? 1.0,
    rotation: item.rotation || 0,
    opacity: item.opacity ?? 1.0,
  };

  if (!item.keyframes || item.keyframes.length === 0) {
    return base;
  }

  const sorted = [...item.keyframes].sort((a, b) => a.time - b.time);
  if (relTime <= sorted[0].time) {
    return {
      x: sorted[0].x,
      y: sorted[0].y,
      scale: sorted[0].scale,
      rotation: sorted[0].rotation,
      opacity: sorted[0].opacity,
    };
  }
  if (relTime >= sorted[sorted.length - 1].time) {
    const last = sorted[sorted.length - 1];
    return {
      x: last.x,
      y: last.y,
      scale: last.scale,
      rotation: last.rotation,
      opacity: last.opacity,
    };
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const k1 = sorted[i];
    const k2 = sorted[i + 1];
    if (relTime >= k1.time && relTime <= k2.time) {
      const span = k2.time - k1.time;
      const rawT = span > 0 ? (relTime - k1.time) / span : 0;
      const t = applyKeyframeEasing(rawT, k1.easing || "ease-in-out");

      return {
        x: k1.x + (k2.x - k1.x) * t,
        y: k1.y + (k2.y - k1.y) * t,
        scale: k1.scale + (k2.scale - k1.scale) * t,
        rotation: k1.rotation + (k2.rotation - k1.rotation) * t,
        opacity: Math.max(0, Math.min(1, k1.opacity + (k2.opacity - k1.opacity) * t)),
      };
    }
  }

  return base;
}

export function interpolateKeyframes(clip: Clip, relTime: number) {
  return interpolateItemKeyframes(clip, relTime);
}

// Master Canvas Compositor
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  project: VideoProject,
  currentTime: number,
  options: {
    showBeforeAfter?: boolean;
    beforeAfterSplit?: number; // 0 to 1
    showSafeZones?: boolean;
    motionTrackingTarget?: boolean;
    isPlaying?: boolean;
  } = {}
) {
  // Clear canvas
  ctx.save();
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Find active clips at currentTime
  const activeClips: { clip: Clip; index: number; relTime: number }[] = [];
  project.clips.forEach((clip, index) => {
    const clipTrimmedDuration = (clip.trimEnd - clip.trimStart) / clip.speed;
    const clipStart = clip.startTime;
    const clipEnd = clipStart + clipTrimmedDuration;

    if (currentTime >= clipStart && currentTime <= clipEnd) {
      const timeInClip = (currentTime - clipStart) * clip.speed + clip.trimStart;
      activeClips.push({ clip, index, relTime: timeInClip });
    }
  });

  // Check for transition with previous clip
  const currentTransition = project.transitions.find((t) => {
    const c1 = project.clips[t.clipIndex];
    if (!c1) return false;
    const c1End = c1.startTime + (c1.trimEnd - c1.trimStart) / c1.speed;
    return Math.abs(currentTime - c1End) < t.duration / 2;
  });

  // Draw background / clips
  if (activeClips.length === 0) {
    // Blank studio canvas
    drawCinematicPlaceholder(ctx, width, height, currentTime, "Pankaj Edit Studio");
  } else {
    for (const { clip, relTime } of activeClips) {
      drawClipOnCanvas(ctx, width, height, clip, relTime, currentTime, project, options);
    }
  }

  // If transition is active, apply transition visual overlay
  if (currentTransition && currentTransition.type !== "none") {
    drawTransition(ctx, width, height, currentTransition, currentTime);
  }

  // Draw Global Effects Layer (Film Grain, Glitch, Light Leak, VHS, etc.)
  for (const fx of project.effects) {
    if (currentTime >= fx.startTime && currentTime <= fx.startTime + fx.duration) {
      drawEffectOverlay(ctx, width, height, fx, currentTime);
    }
  }

  // Draw Lyrics / Song-to-Text with active word-by-word karaoke highlight
  drawLyrics(ctx, width, height, project.lyrics, currentTime);

  // Draw Animated Titles & Text Layers
  drawTextTracks(ctx, width, height, project.textTracks, currentTime);

  // Safe zones overlay
  if (options.showSafeZones) {
    drawSafeZones(ctx, width, height, project.aspectRatio);
  }

  ctx.restore();
}

function drawClipOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  clip: Clip,
  relTime: number,
  masterTime: number,
  project: VideoProject,
  options: { showBeforeAfter?: boolean; beforeAfterSplit?: number; isPlaying?: boolean }
) {
  ctx.save();

  // Apply Keyframes (Transform)
  const transform = interpolateKeyframes(clip, relTime - clip.trimStart);

  // Apply 200+ Clip Animations (In, Out, Combo, Loop, Beat & Flash, 3D Warp, Camera)
  let animTransform: AnimationTransform = { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, filter: "" };
  
  // Find linked or active animation from timeline animation tracks or clip
  const trackAnim = project.animationTracks?.find(
    (a) => a.clipId === clip.id || (!a.clipId && masterTime >= a.startTime && masterTime <= a.startTime + a.duration)
  );
  const activeAnimId = trackAnim?.animationId || clip.animationId;
  const activeAnimDuration = trackAnim?.duration ?? clip.animationDuration;

  if (activeAnimId) {
    const animPreset = getAnimationById(activeAnimId);
    if (animPreset) {
      const timeInTrimmedClip = masterTime - clip.startTime;
      const clipDuration = (clip.trimEnd - clip.trimStart) / (clip.speed || 1.0);
      animTransform = calculateAnimationTransform(
        animPreset,
        timeInTrimmedClip,
        clipDuration,
        width,
        height,
        activeAnimDuration
      );
    }
  }

  // Motion Blur effect calculation for subtle blur during motion playback
  let motionBlurAmount = 0;
  const mbIntensity = typeof clip.motionBlurIntensity === "number"
    ? clip.motionBlurIntensity
    : typeof clip.motionBlur === "number"
      ? clip.motionBlur
      : clip.motionBlur ? 0.5 : 0;

  if (mbIntensity > 0 || clip.motionBlur) {
    // 1. Calculate keyframe velocity over a 1-frame time delta (~33ms)
    const dt = 0.033;
    const t0 = Math.max(0, relTime - clip.trimStart);
    const tPrev = Math.max(0, t0 - dt);
    const kfCurr = interpolateKeyframes(clip, t0);
    const kfPrev = interpolateKeyframes(clip, tPrev);
    const dx = kfCurr.x - kfPrev.x;
    const dy = kfCurr.y - kfPrev.y;
    const dRot = kfCurr.rotation - kfPrev.rotation;
    const dScale = kfCurr.scale - kfPrev.scale;
    const kfVelocity = Math.hypot(dx, dy) * 0.15 + Math.abs(dRot) * 0.4 + Math.abs(dScale) * 20;

    // 2. Calculate animation velocity if preset is actively running
    let animVelocity = 0;
    if (clip.animationId) {
      const timeInTrimmedClip = masterTime - clip.startTime;
      const animDur = clip.animationDuration || 0.6;
      if (timeInTrimmedClip >= 0 && timeInTrimmedClip <= animDur) {
        animVelocity = 2.0;
      }
    }

    const intensityMultiplier = mbIntensity > 0 ? mbIntensity : 0.5;

    // 3. Apply subtle blur during playback or when transform is actively moving
    if (options.isPlaying) {
      // Natural 180° cinematic shutter blur scaled with playback speed & motion
      const baseShutter = Math.min(2.5, 1.2 * (clip.speed || 1.0));
      motionBlurAmount = Math.min(6.0, (baseShutter + kfVelocity + animVelocity) * (intensityMultiplier * 1.5));
    } else if (kfVelocity > 0.3 || animVelocity > 0) {
      // Live scrubbing across keyframe animations or active clip animation
      motionBlurAmount = Math.min(5.0, (kfVelocity + animVelocity) * (intensityMultiplier * 1.5));
    }
  }

  ctx.translate(width / 2 + transform.x + animTransform.x, height / 2 + transform.y + animTransform.y);
  ctx.rotate(((transform.rotation + animTransform.rotation) * Math.PI) / 180);
  ctx.scale(transform.scale * animTransform.scale, transform.scale * animTransform.scale);
  ctx.globalAlpha = Math.max(0, Math.min(1, transform.opacity * animTransform.opacity));

  // Apply Blend mode
  if (clip.blendMode && clip.blendMode !== "normal") {
    ctx.globalCompositeOperation = clip.blendMode;
  }

  // Masking
  if (clip.maskShape && clip.maskShape !== "none") {
    applyMaskShape(ctx, width, height, clip.maskShape, clip.maskInvert);
  }

  // Determine active filter at masterTime (timeline filter track takes priority)
  let activeFilterAtTime = project.activeFilter;
  let activeFilterIntensityAtTime = project.filterIntensity;
  if (project.filterTracks && project.filterTracks.length > 0) {
    const activeTrackFilter = project.filterTracks.find(
      (f) => masterTime >= f.startTime && masterTime <= f.startTime + f.duration
    );
    if (activeTrackFilter) {
      activeFilterAtTime = activeTrackFilter.filter;
      activeFilterIntensityAtTime = activeTrackFilter.intensity;
    } else {
      activeFilterAtTime = "none";
      activeFilterIntensityAtTime = 0;
    }
  }

  // Build CSS filter string for cinematic grading & filters
  let filterString = options.showBeforeAfter
    ? "none"
    : buildCSSFilterString(activeFilterAtTime, activeFilterIntensityAtTime, project.colorGrading, clip);

  if (animTransform.filter) {
    filterString = filterString === "none" ? animTransform.filter : `${filterString} ${animTransform.filter}`;
  }

  // Inject subtle motion blur filter when motion blur is enabled and active
  if (motionBlurAmount > 0.3 && !options.showBeforeAfter) {
    const mbStr = `blur(${motionBlurAmount.toFixed(1)}px)`;
    filterString = filterString === "none" ? mbStr : `${filterString} ${mbStr}`;
  }

  ctx.filter = filterString;

  // Render media or animated cinematic procedural footage
  const media = getMediaElement(clip.url, clip.type);
  let renderedNative = false;

  if (media instanceof HTMLVideoElement) {
    if (media.readyState >= 2) {
      // Sync video currentTime with relTime
      if (Math.abs(media.currentTime - relTime) > 0.3) {
        media.currentTime = relTime;
      }
      drawImageCover(ctx, media, -width / 2, -height / 2, width, height);
      renderedNative = true;
    }
  } else if (media instanceof HTMLImageElement && media.complete && media.naturalWidth > 0) {
    drawImageCover(ctx, media, -width / 2, -height / 2, width, height);
    renderedNative = true;
  }

  if (!renderedNative) {
    // Procedural high-fidelity scene tailored to clip name and time
    drawProceduralCinematicClip(ctx, width, height, clip, relTime, masterTime);
  }

  // Reset filter
  ctx.filter = "none";

  // Vignette overlay if configured
  if (project.colorGrading.vignette > 0 && !options.showBeforeAfter) {
    drawVignette(ctx, -width / 2, -height / 2, width, height, project.colorGrading.vignette);
  }

  // Chroma key simulation if enabled
  if (clip.chromaKeyEnabled) {
    drawChromaKeyBadge(ctx, width, height, clip.chromaColor);
  }

  // Motion tracking pin
  if (clip.motionTracking) {
    drawMotionTrackingPin(ctx, width, height, masterTime);
  }

  ctx.restore();
}

// Procedural video scene generator for smooth visual feedback
function drawProceduralCinematicClip(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  clip: Clip,
  relTime: number,
  masterTime: number
) {
  const x0 = -width / 2;
  const y0 = -height / 2;

  const grad = ctx.createLinearGradient(x0, y0, x0 + width, y0 + height);
  const hueShift = (masterTime * 20) % 360;

  if (clip.name.includes("Cyberpunk") || clip.name.includes("Night")) {
    grad.addColorStop(0, `hsl(${260 + (hueShift % 40)}, 85%, 15%)`);
    grad.addColorStop(0.5, `hsl(${320 + (hueShift % 30)}, 90%, 25%)`);
    grad.addColorStop(1, `hsl(${190 + (hueShift % 50)}, 95%, 18%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x0, y0, width, height);

    // Neon grid lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1.5;
    const gridOffset = (masterTime * 40) % 40;
    for (let y = y0; y < y0 + height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(x0, y + gridOffset);
      ctx.lineTo(x0 + width, y + gridOffset);
      ctx.stroke();
    }

    // Glowing cityscape orbs
    const pulse = Math.sin(masterTime * 4) * 0.2 + 0.8;
    ctx.fillStyle = "rgba(244, 63, 94, 0.45)";
    ctx.beginPath();
    ctx.arc(x0 + width * 0.3, y0 + height * 0.4, 70 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.arc(x0 + width * 0.7, y0 + height * 0.6, 90 * pulse, 0, Math.PI * 2);
    ctx.fill();
  } else if (clip.name.includes("Coast") || clip.name.includes("Travel") || clip.name.includes("Golden")) {
    // Golden hour warm waves
    grad.addColorStop(0, "#b45309");
    grad.addColorStop(0.4, "#f59e0b");
    grad.addColorStop(0.7, "#0284c7");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(x0, y0, width, height);

    // Golden sun disc
    const sunY = y0 + height * 0.35 + Math.sin(masterTime) * 10;
    const sunGrad = ctx.createRadialGradient(x0 + width / 2, sunY, 10, x0 + width / 2, sunY, 120);
    sunGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    sunGrad.addColorStop(0.3, "rgba(254, 240, 138, 0.8)");
    sunGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(x0 + width / 2, sunY, 120, 0, Math.PI * 2);
    ctx.fill();

    // Ocean ripple lines
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 5; i++) {
      const waveY = y0 + height * 0.65 + i * 25;
      ctx.fillRect(x0, waveY + Math.sin(masterTime * 2 + i) * 6, width, 2);
    }
  } else {
    // Cinematic alpine / ambient
    grad.addColorStop(0, "#090d16");
    grad.addColorStop(0.5, "#1e293b");
    grad.addColorStop(1, "#047857");
    ctx.fillStyle = grad;
    ctx.fillRect(x0, y0, width, height);

    // Mountain silhouettes
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.beginPath();
    ctx.moveTo(x0, y0 + height);
    ctx.lineTo(x0 + width * 0.2, y0 + height * 0.45);
    ctx.lineTo(x0 + width * 0.5, y0 + height * 0.7);
    ctx.lineTo(x0 + width * 0.8, y0 + height * 0.4);
    ctx.lineTo(x0 + width, y0 + height);
    ctx.closePath();
    ctx.fill();
  }

  // Clip Title Badge in preview
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(x0 + 16, y0 + height - 52, 220, 36);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x0 + 16, y0 + height - 52, 220, 36);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 13px 'Montserrat', sans-serif";
  ctx.fillText(`🎬 ${clip.name}`, x0 + 26, y0 + height - 30);
}

function drawCinematicPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  text: string
) {
  const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.6);
  grad.addColorStop(0, "#1e293b");
  grad.addColorStop(1, "#07090e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
  ctx.font = "700 20px 'Cinzel', serif";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);

  ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  ctx.font = "500 12px 'Montserrat', sans-serif";
  ctx.fillText("Timeline ready. Tap Play or import clips.", width / 2, height / 2 + 28);
}

// Build CSS filter string combining Filter presets and Color Grading sliders
export function buildCSSFilterString(
  activeFilter: FilterType,
  filterIntensity: number,
  grading: ColorGrading,
  clip: Clip
): string {
  const filters: string[] = [];

  // Clip specific blur
  if (clip.blurAmount > 0) {
    filters.push(`blur(${clip.blurAmount}px)`);
  }

  // Primary Grading & Numeric Adjustments
  let effectiveBrightness = 100 + grading.brightness * 60;
  if (grading.exposure) effectiveBrightness += grading.exposure * 40;
  if (grading.shadows) effectiveBrightness += grading.shadows * 15;
  if (grading.fade) effectiveBrightness += grading.fade * 10;

  // Compute curve effect if masterCurve has customized points
  if (grading.masterCurve && grading.masterCurve.length > 2) {
    const midPoint = grading.masterCurve[Math.floor(grading.masterCurve.length / 2)];
    if (midPoint) {
      // Deviation from diagonal (y - x) modifies brightness/contrast
      const curveDelta = (midPoint.y - midPoint.x) * 50;
      effectiveBrightness += curveDelta;
    }
  }

  if (Math.round(effectiveBrightness) !== 100) {
    filters.push(`brightness(${Math.max(10, Math.round(effectiveBrightness))}%)`);
  }

  let effectiveContrast = grading.contrast * 100;
  if (grading.highlights) effectiveContrast += grading.highlights * 20;
  if (grading.fade) effectiveContrast -= grading.fade * 15;
  if (Math.round(effectiveContrast) !== 100) {
    filters.push(`contrast(${Math.max(10, Math.round(effectiveContrast))}%)`);
  }

  const saturation = grading.saturation * 100;
  if (saturation !== 100) filters.push(`saturate(${saturation}%)`);

  // Temperature / Tint mapping via hue-rotate & sepia
  if (grading.temperature !== 0) {
    const sepiaAmt = Math.max(0, grading.temperature * 0.8);
    if (sepiaAmt > 0) filters.push(`sepia(${sepiaAmt}%)`);
    filters.push(`hue-rotate(${grading.temperature * 0.4}deg)`);
  }

  if (grading.tint !== 0) {
    filters.push(`hue-rotate(${grading.tint * 0.5}deg)`);
  }

  // Preset 300 filter mapping & legacy cinematic profiles
  const fPct = filterIntensity / 100;
  if (activeFilter && activeFilter !== "none" && fPct > 0) {
    const presetCSS = getPresetCSSFilter(activeFilter, filterIntensity);
    if (presetCSS) {
      filters.push(presetCSS);
    } else {
      switch (activeFilter) {
        case "Hollywood":
          filters.push(`contrast(${100 + 25 * fPct}%)`);
          filters.push(`saturate(${100 + 15 * fPct}%)`);
          filters.push(`sepia(${12 * fPct}%)`);
          break;
        case "Film":
          filters.push(`contrast(${100 + 10 * fPct}%)`);
          filters.push(`sepia(${18 * fPct}%)`);
          filters.push(`brightness(${100 - 4 * fPct}%)`);
          break;
        case "Vintage":
          filters.push(`sepia(${38 * fPct}%)`);
          filters.push(`contrast(${100 - 8 * fPct}%)`);
          filters.push(`brightness(${100 + 6 * fPct}%)`);
          break;
        case "Moody":
          filters.push(`contrast(${100 + 32 * fPct}%)`);
          filters.push(`saturate(${100 - 25 * fPct}%)`);
          filters.push(`brightness(${100 - 12 * fPct}%)`);
          break;
        case "Warm":
          filters.push(`sepia(${28 * fPct}%)`);
          filters.push(`saturate(${100 + 20 * fPct}%)`);
          break;
        case "Cool":
          filters.push(`hue-rotate(${185 * fPct * 0.2}deg)`);
          filters.push(`saturate(${100 + 10 * fPct}%)`);
          break;
        case "Teal & Orange":
          filters.push(`contrast(${100 + 28 * fPct}%)`);
          filters.push(`saturate(${100 + 30 * fPct}%)`);
          filters.push(`sepia(${10 * fPct}%)`);
          break;
        case "Black & White":
          filters.push(`grayscale(${100 * fPct}%)`);
          filters.push(`contrast(${100 + 30 * fPct}%)`);
          break;
        case "Wedding":
          filters.push(`brightness(${100 + 10 * fPct}%)`);
          filters.push(`contrast(${100 - 6 * fPct}%)`);
          filters.push(`saturate(${100 - 8 * fPct}%)`);
          break;
        case "Travel":
          filters.push(`saturate(${100 + 35 * fPct}%)`);
          filters.push(`contrast(${100 + 16 * fPct}%)`);
          break;
        case "Nature":
          filters.push(`saturate(${100 + 22 * fPct}%)`);
          filters.push(`hue-rotate(${-10 * fPct}deg)`);
          break;
        case "Night":
          filters.push(`contrast(${100 + 35 * fPct}%)`);
          filters.push(`brightness(${100 - 14 * fPct}%)`);
          filters.push(`saturate(${100 + 25 * fPct}%)`);
          break;
        case "Portrait":
          filters.push(`brightness(${100 + 5 * fPct}%)`);
          filters.push(`contrast(${100 + 4 * fPct}%)`);
          filters.push(`saturate(${100 + 8 * fPct}%)`);
          break;
        case "Urban":
          filters.push(`contrast(${100 + 24 * fPct}%)`);
          filters.push(`saturate(${100 - 18 * fPct}%)`);
          break;
        case "Luxury":
          filters.push(`sepia(${20 * fPct}%)`);
          filters.push(`contrast(${100 + 15 * fPct}%)`);
          filters.push(`saturate(${100 + 10 * fPct}%)`);
          break;
      }
    }
  }

  return filters.length > 0 ? filters.join(" ") : "none";
}

function drawVignette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  intensity: number
) {
  ctx.save();
  const radius = Math.max(w, h) * 0.75;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.35, cx, cy, radius);
  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.95, intensity * 0.95)})`);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function applyMaskShape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shape: string,
  invert: boolean
) {
  const hw = width / 2;
  const hh = height / 2;

  ctx.beginPath();
  
  if (invert) {
      // Create a large outer rectangle to invert the clipping area
      ctx.rect(-width * 2, -height * 2, width * 4, height * 4);
  }
  
  switch (shape) {
    case "circle":
      ctx.arc(0, 0, Math.min(hw, hh) * 0.8, 0, Math.PI * 2, invert);
      break;
    case "radial": // Using radial as Mirror/Split
      ctx.rect(-hw, -hh * 0.25, width, height * 0.5);
      break;
    case "linear": // Split/Linear half
      ctx.rect(-hw, 0, width, hh);
      break;
    case "horizontal":
      ctx.rect(-hw, -hh * 0.3, width, height * 0.6);
      break;
    case "rectangle":
      ctx.rect(-hw * 0.8, -hh * 0.8, width * 1.6, height * 1.6);
      break;
    case "heart": {
      const s = Math.min(width, height) * 0.003;
      if (invert) ctx.moveTo(0, -50 * s); // dummy move to start
      ctx.moveTo(0, -50 * s);
      ctx.bezierCurveTo(-50 * s, -120 * s, -150 * s, -70 * s, -150 * s, 20 * s);
      ctx.bezierCurveTo(-150 * s, 100 * s, -40 * s, 160 * s, 0, 200 * s);
      ctx.bezierCurveTo(40 * s, 160 * s, 150 * s, 100 * s, 150 * s, 20 * s);
      ctx.bezierCurveTo(150 * s, -70 * s, 50 * s, -120 * s, 0, -50 * s);
      break;
    }
    case "star": {
      const spikes = 5;
      const outerRadius = Math.min(hw, hh) * 0.8;
      const innerRadius = outerRadius * 0.45;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        let sx = Math.cos(rot) * outerRadius;
        let sy = Math.sin(rot) * outerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
        sx = Math.cos(rot) * innerRadius;
        sy = Math.sin(rot) * innerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
      }
      ctx.closePath();
      break;
    }
    default:
      ctx.rect(-hw, -hh, width, height);
  }
  
  // Actually apply clipping (using non-zero winding rule which works with the invert trick for basic shapes)
  ctx.clip("evenodd");
}

function drawTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  trans: TransitionItem,
  currentTime: number
) {
  ctx.save();
  switch (trans.type) {
    case "flash":
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fillRect(0, 0, width, height);
      break;
    case "glitch": {
      const sliceH = height / 8;
      for (let i = 0; i < 8; i++) {
        if (Math.random() > 0.4) {
          ctx.fillStyle = i % 2 === 0 ? "rgba(56, 189, 248, 0.35)" : "rgba(244, 63, 94, 0.35)";
          ctx.fillRect(Math.random() * 40 - 20, i * sliceH, width, sliceH);
        }
      }
      break;
    }
    case "blur":
      ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
      ctx.fillRect(0, 0, width, height);
      break;
    default:
      break;
  }
  ctx.restore();
}

function drawEffectOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fx: EffectItem,
  time: number
) {
  ctx.save();
  const intensity = (fx.intensity || 50) / 100;

  switch (fx.type) {
    case "film_grain": {
      // Procedural grain dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      const dotCount = Math.floor(width * 0.15 * intensity);
      for (let i = 0; i < dotCount; i++) {
        const gx = Math.random() * width;
        const gy = Math.random() * height;
        const s = Math.random() * 2 + 0.5;
        ctx.fillRect(gx, gy, s, s);
      }
      break;
    }
    case "vhs": {
      // Scanlines & RGB split line
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }
      const scanBarY = (time * 120) % height;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.3 * intensity})`;
      ctx.fillRect(0, scanBarY, width, 6);
      break;
    }
    case "light_leak": {
      const grad = ctx.createRadialGradient(width, 0, 10, width, 0, width * 0.7);
      grad.addColorStop(0, `rgba(251, 146, 60, ${0.5 * intensity})`);
      grad.addColorStop(0.5, `rgba(244, 63, 94, ${0.25 * intensity})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case "glitch": {
      if (Math.sin(time * 12) > 0.4) {
        ctx.fillStyle = `rgba(56, 189, 248, ${0.4 * intensity})`;
        ctx.fillRect(0, Math.random() * height, width, 12);
        ctx.fillStyle = `rgba(244, 63, 94, ${0.4 * intensity})`;
        ctx.fillRect(Math.random() * 20 - 10, Math.random() * height, width, 8);
      }
      break;
    }
    case "flash": {
      const pulse = Math.sin(time * 8);
      if (pulse > 0.7) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(pulse - 0.7) * 2 * intensity})`;
        ctx.fillRect(0, 0, width, height);
      }
      break;
    }
    case "particles": {
      ctx.fillStyle = "rgba(254, 240, 138, 0.4)";
      for (let i = 0; i < 24; i++) {
        const px = (Math.sin(time * 0.5 + i * 1.5) * 0.5 + 0.5) * width;
        const py = ((time * 30 + i * 40) % height);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function drawLyrics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lyrics: LyricLine[],
  currentTime: number
) {
  if (!lyrics || lyrics.length === 0) return;

  // Find active lyric line
  const activeLine = lyrics.find((l) => currentTime >= l.startTime && currentTime <= l.endTime);
  if (!activeLine) return;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const y = height * 0.78;
  const fontSize = Math.max(16, Math.floor(width * 0.052));

  // If words array exists, perform word-by-word karaoke highlight
  if (activeLine.words && activeLine.words.length > 0) {
    ctx.font = `700 ${fontSize}px 'Montserrat', sans-serif`;

    // Measure total width to center words
    const spaceWidth = ctx.measureText(" ").width;
    const wordMeasures = activeLine.words.map((w) => ({
      ...w,
      width: ctx.measureText(w.word).width,
    }));
    const totalW = wordMeasures.reduce((acc, curr) => acc + curr.width, 0) + (activeLine.words.length - 1) * spaceWidth;
    let startX = (width - totalW) / 2;

    // Background pill for readability
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.beginPath();
    ctx.roundRect(startX - 16, y - fontSize * 0.9, totalW + 32, fontSize * 1.8, 12);
    ctx.fill();

    for (const w of wordMeasures) {
      const isWordActive = currentTime >= w.start && currentTime <= w.end;
      const isPastWord = currentTime > w.end;

      if (isWordActive) {
        // Glowing electric blue / gold karaoke highlight
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "rgba(56, 189, 248, 0.9)";
        ctx.shadowBlur = 16;
        ctx.font = `800 ${fontSize * 1.08}px 'Montserrat', sans-serif`;
      } else if (isPastWord) {
        ctx.fillStyle = "#f8fafc";
        ctx.shadowBlur = 0;
        ctx.font = `700 ${fontSize}px 'Montserrat', sans-serif`;
      } else {
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.shadowBlur = 0;
        ctx.font = `700 ${fontSize}px 'Montserrat', sans-serif`;
      }

      ctx.fillText(w.word, startX + w.width / 2, y);
      startX += w.width + spaceWidth;
    }
  } else {
    // Simple line caption
    ctx.font = `700 ${fontSize}px 'Montserrat', sans-serif`;
    const textW = ctx.measureText(activeLine.text).width;

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.beginPath();
    ctx.roundRect(width / 2 - textW / 2 - 16, y - fontSize * 0.9, textW + 32, fontSize * 1.8, 10);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fillText(activeLine.text, width / 2, y);
  }

  ctx.restore();
}

function drawTextTracks(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tracks: TextItem[],
  currentTime: number
) {
  for (const item of tracks) {
    if (currentTime >= item.startTime && currentTime <= item.startTime + item.duration) {
      ctx.save();
      const progress = (currentTime - item.startTime) / item.duration;

      // Position (x, y in percentage)
      const posX = (item.x / 100) * width;
      let posY = (item.y / 100) * height;

      // Apply Text Animation
      let animScale = 1.0;
      let animAlpha = 1.0;
      let displayText = item.text;

      switch (item.animation) {
        case "pop_up": {
          const entry = Math.min(1, (currentTime - item.startTime) / 0.35);
          animScale = Math.sin((entry * Math.PI) / 2) * 1.05;
          break;
        }
        case "slide": {
          const entry = Math.min(1, (currentTime - item.startTime) / 0.4);
          posY += (1 - entry) * 40;
          animAlpha = entry;
          break;
        }
        case "typewriter": {
          const charsCount = Math.floor(item.text.length * Math.min(1, (currentTime - item.startTime) / 1.5));
          displayText = item.text.substring(0, charsCount);
          break;
        }
        case "glow_pulse": {
          const pulse = Math.sin(currentTime * 6) * 0.5 + 0.5;
          item.shadowBlur = 10 + pulse * 18;
          break;
        }
        case "fade": {
          const entry = Math.min(1, (currentTime - item.startTime) / 0.4);
          const exit = Math.min(1, (item.startTime + item.duration - currentTime) / 0.4);
          animAlpha = Math.min(entry, exit);
          break;
        }
        default:
          break;
      }

      let finalX = posX;
      let finalY = posY;
      let finalScale = animScale;
      let finalRotation = 0;
      let finalAlpha = animAlpha;

      if (item.keyframes && item.keyframes.length > 0) {
        const kf = interpolateItemKeyframes(
          {
            keyframes: item.keyframes,
            x: posX,
            y: posY,
            scale: animScale,
            rotation: 0,
            opacity: animAlpha,
          },
          currentTime - item.startTime
        );
        finalX = kf.x;
        finalY = kf.y;
        finalScale = kf.scale;
        finalRotation = kf.rotation;
        finalAlpha = kf.opacity;
      }

      ctx.translate(finalX, finalY);
      if (finalRotation !== 0) {
        ctx.rotate((finalRotation * Math.PI) / 180);
      }
      ctx.scale(finalScale, finalScale);
      ctx.globalAlpha = Math.max(0, Math.min(1, finalAlpha));

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${item.fontSize}px ${item.fontFamily || "sans-serif"}`;

      // Text Shadow
      if (item.shadowColor && item.shadowBlur > 0) {
        ctx.shadowColor = item.shadowColor;
        ctx.shadowBlur = item.shadowBlur;
        ctx.shadowOffsetX = item.shadowOffsetX || 0;
        ctx.shadowOffsetY = item.shadowOffsetY || 0;
      }

      // Outline / Stroke
      if (item.outlineColor && item.outlineWidth > 0) {
        ctx.strokeStyle = item.outlineColor;
        ctx.lineWidth = item.outlineWidth * 2;
        ctx.strokeText(displayText, 0, 0);
      }

      // Fill text
      ctx.fillStyle = item.color || "#ffffff";
      ctx.fillText(displayText, 0, 0);

      ctx.restore();
    }
  }
}

function drawSafeZones(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  aspectRatio: string
) {
  ctx.save();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  // Center crosshair
  const cx = width / 2;
  const cy = height / 2;
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy);
  ctx.lineTo(cx + 15, cy);
  ctx.moveTo(cx, cy - 15);
  ctx.lineTo(cx, cy + 15);
  ctx.stroke();

  // 90% action safe rectangle
  const padX = width * 0.05;
  const padY = height * 0.05;
  ctx.strokeRect(padX, padY, width - padX * 2, height - padY * 2);

  // Social UI safe zone indicator (for 9:16 reels/shorts)
  if (aspectRatio === "9:16") {
    ctx.fillStyle = "rgba(244, 63, 94, 0.12)";
    // Right sidebar icons zone
    ctx.fillRect(width - 60, height * 0.4, 52, height * 0.4);
    // Bottom caption zone
    ctx.fillRect(16, height - 110, width - 32, 95);
  }

  ctx.restore();
}

function drawChromaKeyBadge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(-width / 2 + 16, -height / 2 + 16, 140, 26);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-width / 2 + 30, -height / 2 + 29, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 11px sans-serif";
  ctx.fillText("Chroma Key ON", -width / 2 + 42, -height / 2 + 33);
  ctx.restore();
}

function drawMotionTrackingPin(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  masterTime: number
) {
  ctx.save();
  const px = Math.sin(masterTime * 2) * 40;
  const py = Math.cos(masterTime * 2) * 30;

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  ctx.strokeRect(px - 30, py - 30, 60, 60);

  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(px, py, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(px - 35, py - 48, 70, 16);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("TRACKING", px - 26, py - 36);
  ctx.restore();
}

// Aspect ratio cover helper
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgW = (img as HTMLVideoElement).videoWidth || (img as HTMLImageElement).naturalWidth || img.width;
  const imgH = (img as HTMLVideoElement).videoHeight || (img as HTMLImageElement).naturalHeight || img.height;
  if (!imgW || !imgH) return;

  const rImg = imgW / imgH;
  const rDst = w / h;

  let sx = 0,
    sy = 0,
    sw = imgW,
    sh = imgH;

  if (rImg > rDst) {
    sw = imgH * rDst;
    sx = (imgW - sw) / 2;
  } else {
    sh = imgW / rDst;
    sy = (imgH - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// 4K Video Exporter supporting 720p, 1080p, 2K, 4K and 24/30/60 FPS
export async function exportVideo(
  project: VideoProject,
  settings: {
    resolution: "720p" | "1080p" | "2K" | "4K" | "custom";
    customWidth?: number;
    customHeight?: number;
    fps: 24 | 30 | 60;
    aspectRatio: string;
    format: "mp4" | "webm";
  },
  onProgress: (pct: number, frame: number, totalFrames: number) => void
): Promise<{ blob: Blob; url: string; sizeBytes: number }> {
  // Compute target canvas width and height
  let targetWidth = 1920;
  let targetHeight = 1080;

  if (settings.resolution === "720p") {
    targetWidth = 1280;
    targetHeight = 720;
  } else if (settings.resolution === "1080p") {
    targetWidth = 1920;
    targetHeight = 1080;
  } else if (settings.resolution === "2K") {
    targetWidth = 2560;
    targetHeight = 1440;
  } else if (settings.resolution === "4K") {
    targetWidth = 3840;
    targetHeight = 2160;
  } else if (settings.resolution === "custom" && settings.customWidth && settings.customHeight) {
    targetWidth = settings.customWidth;
    targetHeight = settings.customHeight;
  }

  // Adjust for vertical or square aspect ratio
  if (settings.aspectRatio === "9:16") {
    const temp = targetWidth;
    targetWidth = Math.min(targetWidth, targetHeight);
    targetHeight = Math.max(temp, targetHeight);
  } else if (settings.aspectRatio === "1:1") {
    const s = Math.min(targetWidth, targetHeight);
    targetWidth = s;
    targetHeight = s;
  } else if (settings.aspectRatio === "4:5") {
    targetWidth = 1080;
    targetHeight = 1350;
  }

  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = targetWidth;
  offscreenCanvas.height = targetHeight;
  const offCtx = offscreenCanvas.getContext("2d")!;

  const totalDuration = project.duration || 10;
  const fps = settings.fps || 30;
  const totalFrames = Math.ceil(totalDuration * fps);

  // Setup MediaRecorder
  const stream = offscreenCanvas.captureStream(fps);
  const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
    ? "video/mp4;codecs=avc1"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: settings.resolution === "4K" ? 35000000 : 15000000,
  });

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<{ blob: Blob; url: string; sizeBytes: number }>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve({ blob, url, sizeBytes: blob.size });
    };
  });

  recorder.start();

  // Render each frame sequentially
  for (let f = 0; f < totalFrames; f++) {
    const time = f / fps;
    renderFrame(offCtx, targetWidth, targetHeight, project, time, { isPlaying: true });
    onProgress(Math.round((f / totalFrames) * 100), f, totalFrames);

    // Yield to browser loop to prevent freezing
    await new Promise((r) => setTimeout(r, 10));
  }

  recorder.stop();
  return await recordingPromise;
}
