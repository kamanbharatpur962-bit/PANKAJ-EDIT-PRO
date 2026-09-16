const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetStr = `    {
      id: "replace",`;

const replaceStr = `    {
      id: "mask",
      label: "Mask",
      icon: <ScanFace className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "mask" ? null : "mask")
    },
    {
      id: "replace",`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    
    // Make sure ScanFace is imported
    if (!content.includes('ScanFace')) {
        content = content.replace('SquareDashed,', 'SquareDashed,\\n  ScanFace,');
    }
    
    fs.writeFileSync('src/components/Toolbar.tsx', content);
    console.log("Success Toolbar");
} else {
    console.log("Target not found!");
}
