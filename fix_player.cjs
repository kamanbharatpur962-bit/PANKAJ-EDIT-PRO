const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewPlayer.tsx', 'utf8');

const target1 = `  const getAspectRatioClasses = () => {
    switch (project.aspectRatio) {
      case "9:16":
        return "aspect-[9/16] h-[48vh] sm:h-[55vh] max-h-[650px]";
      case "16:9":
        return "aspect-[16/9] w-full max-w-[700px] h-auto max-h-[48vh]";
      case "1:1":
        return "aspect-square h-[45vh] sm:h-[52vh] max-h-[600px]";
      case "4:5":
        return "aspect-[4/5] h-[48vh] sm:h-[55vh] max-h-[650px]";
      case "21:9":
        return "aspect-[21/9] w-full max-w-[750px] h-auto max-h-[45vh]";
      default:
        return "aspect-[9/16] h-[48vh] max-h-[650px]";
    }
  };`;

const replace1 = `  const getAspectRatioClasses = () => {
    switch (project.aspectRatio) {
      case "9:16": return "aspect-[9/16]";
      case "16:9": return "aspect-[16/9]";
      case "1:1": return "aspect-square";
      case "4:5": return "aspect-[4/5]";
      case "21:9": return "aspect-[21/9]";
      default: return "aspect-[9/16]";
    }
  };`;

content = content.replace(target1, replace1);

const target2 = `    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center bg-[#09090C] pt-2 pb-1.5 px-3 select-none w-full shrink-0"
    >
      {/* Canvas Viewport Frame */}
      <div className="relative flex items-center justify-center w-full max-w-full overflow-hidden">
        <div
          className={\`relative rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center transition-all \${
            selectedClipId ? "ring-1 ring-[#00E5FF]/40" : "border border-[#1A1A22]"
          } \${getAspectRatioClasses()}\`}
          onClick={onTogglePlay}
        >`;

const replace2 = `    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center bg-[#09090C] pt-2 pb-1.5 px-3 select-none w-full h-full flex-1 min-h-0"
    >
      {/* Canvas Viewport Frame */}
      <div className="relative flex items-center justify-center w-full h-full max-h-full overflow-hidden min-h-0">
        <div
          className={\`relative h-full max-w-full rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center transition-all \${
            selectedClipId ? "ring-1 ring-[#00E5FF]/40" : "border border-[#1A1A22]"
          } \${getAspectRatioClasses()}\`}
          onClick={onTogglePlay}
        >`;

content = content.replace(target2, replace2);
fs.writeFileSync('src/components/PreviewPlayer.tsx', content);
console.log('done');
