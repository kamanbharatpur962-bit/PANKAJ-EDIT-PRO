const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
    'import { KeyframeEditorPanel } from "./components/panels/KeyframeEditorPanel";\\nimport { MaskPanel } from "./components/panels/MaskPanel";',
    'import { KeyframeEditorPanel } from "./components/panels/KeyframeEditorPanel";\nimport { MaskPanel } from "./components/panels/MaskPanel";'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Success Fix App Import");
