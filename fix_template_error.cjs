const fs = require('fs');
let content = fs.readFileSync('src/components/TemplatesScreen.tsx', 'utf8');

const oldProcess = `  const processTemplate = async (files: FileList) => {
    if (!selectedTemplate || files.length === 0) return;`;

const newProcess = `  const [errorMsg, setErrorMsg] = useState("");

  const processTemplate = async (files: FileList) => {
    if (!selectedTemplate || files.length === 0) return;
    
    if (files.length < selectedTemplate.clipCount) {
       setErrorMsg(\`Please select at least \${selectedTemplate.clipCount} videos/photos for this template.\`);
       setTimeout(() => setErrorMsg(""), 3000);
       return;
    }
    setErrorMsg("");`;

content = content.replace(oldProcess, newProcess);

const oldOverlay = `{/* Processing Overlay */}`;
const newOverlay = `{errorMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#FF453A] text-white px-4 py-2 rounded-lg text-sm z-[200] shadow-xl animate-in slide-in-from-top-4">
           {errorMsg}
        </div>
      )}
      
      {/* Processing Overlay */}`;

content = content.replace(oldOverlay, newOverlay);

fs.writeFileSync('src/components/TemplatesScreen.tsx', content);
console.log("Fixed template error handling");
