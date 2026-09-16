const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { MaskPanel }')) {
    content = content.replace(
        'import { KeyframeEditorPanel } from "./components/panels/KeyframeEditorPanel";',
        'import { KeyframeEditorPanel } from "./components/panels/KeyframeEditorPanel";\\nimport { MaskPanel } from "./components/panels/MaskPanel";'
    );
    fs.writeFileSync('src/App.tsx', content);
    console.log("Success Import");
} else {
    console.log("Already imported");
}
