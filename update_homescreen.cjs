const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Add import
if (!content.includes('import { processVideoFile, processPhotoFile }')) {
  content = content.replace('import { TemplatesScreen } from "./TemplatesScreen";', 
    'import { TemplatesScreen } from "./TemplatesScreen";\nimport { processVideoFile, processPhotoFile } from "../utils/media";\nimport { Clip } from "../types";');
}

// Add prop interface
if (!content.includes('onCreateProjectWithMedia?:')) {
  content = content.replace('onOpenNewProjectPicker?: (initialRatio?: AspectRatio) => void;', 
    'onOpenNewProjectPicker?: (initialRatio?: AspectRatio) => void;\n  onCreateProjectWithMedia?: (clips: Clip[], aspectRatio: AspectRatio) => void;');
}

// Add prop parameter
content = content.replace('onOpenNewProjectPicker,\n  onOpenFeature,', 
  'onOpenNewProjectPicker,\n  onCreateProjectWithMedia,\n  onOpenFeature,');

// Replace "New project" button logic
const oldBtn = `onClick={() => {
              if (onOpenNewProjectPicker) onOpenNewProjectPicker("9:16");
              else if (onOpenAddMediaModal) onOpenAddMediaModal();
              else onNewProject("9:16");
            }}`;

const newBtn = `onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}`;

content = content.replace(oldBtn, newBtn);

// Add fileInputRef and handleFiles logic
const oldState = `const [activeTab, setActiveTab] = useState("home");`;
const newState = `const [activeTab, setActiveTab] = useState("home");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesBatch = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const newClips: Clip[] = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (file.type.startsWith("video")) {
        const clip = await processVideoFile(file);
        newClips.push(clip);
      } else if (file.type.startsWith("image") || file.name.match(/\\.(jpg|jpeg|png|webp|gif|avif|bmp)$/i)) {
        const clip = await processPhotoFile(file);
        newClips.push(clip);
      }
    }

    setIsProcessing(false);
    if (newClips.length > 0 && onCreateProjectWithMedia) {
      onCreateProjectWithMedia(newClips, "9:16");
    }
  };`;

if (!content.includes('handleFilesBatch')) {
  content = content.replace(oldState, newState);
}

// Add the file input HTML
const oldHeader = `</header>`;
const newHeader = `</header>
      <input 
        type="file" 
        accept="video/*,image/*" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (e.target.files) handleFilesBatch(e.target.files);
          e.target.value = '';
        }} 
      />
      
      {/* Loading Overlay for file processing */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#4CE5E7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-white text-lg font-bold">Processing Media...</h2>
        </div>
      )}`;

if (!content.includes('ref={fileInputRef}')) {
  content = content.replace(oldHeader, newHeader);
}

fs.writeFileSync('src/components/HomeScreen.tsx', content);
