const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

// Add Mic2 to lucide imports
content = content.replace('Subtitles,', 'Subtitles,\\n  Mic2,');

const textTab = `    {
      id: "text",
      label: "Text",
      icon: <Type className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "text" ? null : "text")
    },`;

const songToTextTab = `    {
      id: "song_to_text",
      label: "Song to Text",
      icon: <Mic2 className="w-[22px] h-[22px]" />,
      onClick: () => onSelectTab(activeTab === "song_to_text" ? null : "song_to_text")
    },`;

if (!content.includes('"song_to_text"')) {
    content = content.replace(textTab, textTab + "\\n" + songToTextTab);
    fs.writeFileSync('src/components/Toolbar.tsx', content);
    console.log("Success Toolbar SongToText");
} else {
    console.log("Already added");
}
