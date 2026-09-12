import React, { useState } from "react";
import { ExportSettings, VideoProject } from "../../types";
import { exportVideo } from "../../utils/videoRenderer";
import { 
  X, 
  Download, 
  Check, 
  Sparkles, 
  Film, 
  Share2, 
  Loader2,
  HardDrive,
  Youtube,
  Instagram
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  onSaveExportedVideo: (videoItem: {
    id: string;
    title: string;
    url: string;
    date: string;
    resolution: string;
    duration: number;
    size: string;
  }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveExportedVideo,
}) => {
  const [settings, setSettings] = useState<ExportSettings>({
    resolution: "1080p",
    fps: 30,
    bitrate: "high",
    format: "mp4",
    watermark: false,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [exportedResult, setExportedResult] = useState<{
    url: string;
    sizeBytes: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setExportedResult(null);

    try {
      const result = await exportVideo(
        project,
        {
          resolution: settings.resolution,
          fps: settings.fps,
          aspectRatio: project.aspectRatio,
          format: settings.format,
        },
        (pct, frame, total) => {
          setProgress(pct);
          setCurrentFrame(frame);
          setTotalFrames(total);
        }
      );

      setExportedResult({ url: result.url, sizeBytes: result.sizeBytes });
      setIsExporting(false);

      // Save to exported videos history
      const sizeMB = (result.sizeBytes / (1024 * 1024)).toFixed(1) + " MB";
      onSaveExportedVideo({
        id: `export-${Date.now()}`,
        title: project.title,
        url: result.url,
        date: new Date().toLocaleDateString(),
        resolution: settings.resolution,
        duration: project.duration,
        size: sizeMB,
      });
    } catch (err) {
      console.error("Export error:", err);
      setIsExporting(false);
    }
  };

  const handleDownloadFile = () => {
    if (!exportedResult) return;
    const a = document.createElement("a");
    a.href = exportedResult.url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, "_")}_${settings.resolution}.mp4`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/30 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E0E0E0]">Cinematic Video Export</h3>
              <p className="text-[10px] text-[#888]">
                Ultra HD mastering with high bitrates & crisp color space
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 rounded-lg text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618] transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!isExporting && !exportedResult ? (
            <>
              {/* Resolution Selector (720p, 1080p, 2K, 4K) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E0E0E0] flex items-center justify-between">
                  <span>Output Resolution</span>
                  <span className="text-[10px] text-[#FFB347] font-mono">
                    {settings.resolution === "4K"
                      ? "3840 × 2160 (Cinema 4K)"
                      : settings.resolution === "2K"
                      ? "2560 × 1440 (2K QHD)"
                      : settings.resolution === "1080p"
                      ? "1920 × 1080 (FHD)"
                      : "1280 × 720 (HD)"}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["720p", "1080p", "2K", "4K"] as const).map((res) => (
                    <button
                      key={res}
                      id={`btn-export-res-${res}`}
                      onClick={() => setSettings({ ...settings, resolution: res })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        settings.resolution === res
                          ? "bg-[#FFB347] text-[#0A0A0A] border-[#FFB347] shadow-sm"
                          : "bg-[#161618] border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024]"
                      }`}
                    >
                      {res}
                      {res === "4K" && (
                        <span className="block text-[8px] uppercase tracking-wider font-extrabold opacity-80">
                          Ultra HD
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Rate (24, 30, 60 FPS) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E0E0E0] flex items-center justify-between">
                  <span>Frame Rate (FPS)</span>
                  <span className="text-[10px] text-[#888]">
                    {settings.fps === 24
                      ? "24 FPS - Hollywood Cinematic Motion"
                      : settings.fps === 60
                      ? "60 FPS - High Speed Ultra Smooth"
                      : "30 FPS - Standard Web Video"}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([24, 30, 60] as const).map((fpsVal) => (
                    <button
                      key={fpsVal}
                      id={`btn-export-fps-${fpsVal}`}
                      onClick={() => setSettings({ ...settings, fps: fpsVal })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        settings.fps === fpsVal
                          ? "bg-[#FFB347]/15 border-[#FFB347] text-[#FFB347]"
                          : "bg-[#161618] border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024]"
                      }`}
                    >
                      {fpsVal} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* Bitrate & Encoding */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#888]">Bitrate</label>
                  <select
                    value={settings.bitrate}
                    onChange={(e) => setSettings({ ...settings, bitrate: e.target.value as any })}
                    className="w-full bg-[#161618] text-xs text-[#E0E0E0] px-3 py-2 rounded-xl border border-[#222] focus:outline-none focus:border-[#FFB347]"
                  >
                    <option value="standard">Standard (Web)</option>
                    <option value="high">High (YouTube 4K)</option>
                    <option value="master">Cinema Master (Pro)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#888]">Format</label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings({ ...settings, format: e.target.value as any })}
                    className="w-full bg-[#161618] text-xs text-[#E0E0E0] px-3 py-2 rounded-xl border border-[#222] focus:outline-none focus:border-[#FFB347]"
                  >
                    <option value="mp4">MP4 (H.264 Universal)</option>
                    <option value="webm">WebM (VP9 High Efficiency)</option>
                  </select>
                </div>
              </div>

              {/* Watermark toggle */}
              <div className="bg-[#161618] rounded-xl p-3 border border-[#222] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#E0E0E0]">Remove Watermark</div>
                  <div className="text-[10px] text-[#888]">Pankaj Edit Pro clean cinema export</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, watermark: !settings.watermark })}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#47BD47]/15 text-[#47BD47] border border-[#47BD47]/30"
                >
                  CLEAN (NO WATERMARK)
                </button>
              </div>
            </>
          ) : isExporting ? (
            /* Exporting Progress Screen */
            <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#1A1A1A"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#FFB347"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progress) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute font-mono text-xl font-bold text-[#FFB347]">
                  {progress}%
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#E0E0E0]">
                  Rendering {settings.resolution} Video...
                </h4>
                <p className="text-xs text-[#888] font-mono mt-1">
                  Frame {currentFrame} of {totalFrames} • Compositing filters, grading & audio
                </p>
              </div>
            </div>
          ) : (
            /* Export Completed Screen */
            <div className="py-6 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[#47BD47]/15 text-[#47BD47] border border-[#47BD47]/30 flex items-center justify-center shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-[#E0E0E0]">Export Ready!</h4>
                <p className="text-xs text-[#888] mt-0.5">
                  Resolution: {settings.resolution} • {settings.fps} FPS • Duration: {project.duration}s
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 w-full">
                <button
                  id="btn-download-exported-video"
                  onClick={handleDownloadFile}
                  className="flex-1 py-2.5 rounded-xl bg-[#FFB347] text-[#0A0A0A] font-semibold text-xs hover:bg-[#FFA327] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#161618] border border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#202024] text-xs font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isExporting && !exportedResult && (
          <div className="px-5 py-3.5 border-t border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#888] hover:text-[#E0E0E0]"
            >
              Cancel
            </button>
            <button
              id="btn-start-export-render"
              onClick={handleStartExport}
              className="px-5 py-2 rounded-xl bg-[#FFB347] text-[#0A0A0A] font-semibold text-xs hover:bg-[#FFA327] active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {settings.resolution}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
