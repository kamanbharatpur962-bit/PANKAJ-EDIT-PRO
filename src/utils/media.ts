import { Clip } from "../types";

export const processVideoFile = (file: File): Promise<Clip> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const finishWithFallback = (dur: number) => {
      resolve({
        id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url,
        thumbnail: "",
        type: "video",
        duration: dur,
        startTime: 0,
        trimStart: 0,
        trimEnd: dur,
        speed: 1.0,
        reversed: false,
        volume: 100,
        muted: false,
        fadeIn: 0,
        fadeOut: 0,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        blendMode: "normal",
        keyframes: [],
      });
    };

    video.onloadedmetadata = () => {
      const dur = isFinite(video.duration) && video.duration > 0 ? parseFloat(video.duration.toFixed(2)) : 5;
      
      video.currentTime = Math.min(1, dur / 2);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbUrl = canvas.toDataURL("image/jpeg", 0.7);
          const dur = parseFloat(video.duration.toFixed(2));
          resolve({
            id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url,
            thumbnail: thumbUrl,
            type: "video",
            duration: dur,
            startTime: 0,
            trimStart: 0,
            trimEnd: dur,
            speed: 1.0,
            reversed: false,
            volume: 100,
            muted: false,
            fadeIn: 0,
            fadeOut: 0,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            blendMode: "normal",
            keyframes: [],
          });
        } else {
          finishWithFallback(parseFloat(video.duration.toFixed(2)));
        }
      } catch (err) {
        finishWithFallback(isFinite(video.duration) ? parseFloat(video.duration.toFixed(2)) : 5);
      }
    };

    video.onerror = () => {
      finishWithFallback(5);
    };
  });
};

export const processPhotoFile = (file: File): Promise<Clip> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const dur = 3;
    resolve({
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      url,
      thumbnail: url,
      type: "photo",
      duration: dur,
      startTime: 0,
      trimStart: 0,
      trimEnd: dur,
      speed: 1.0,
      reversed: false,
      volume: 100,
      muted: false,
      fadeIn: 0,
      fadeOut: 0,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      blendMode: "normal",
      keyframes: [],
    });
  });
};
