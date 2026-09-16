const fs = require('fs');
let content = fs.readFileSync('src/components/panels/MaskPanel.tsx', 'utf8');

content = content.replace(
    'import { \n  Ban, \n  Minus, \n  Split, \n  Circle, \n  Square, \n  Heart, \n  Star,\n  FlipVertical\n} from "lucide-react";',
    'import { \n  Ban, \n  Minus, \n  Split, \n  Circle, \n  Square, \n  Heart, \n  Star,\n  FlipVertical,\n  SquareSplitHorizontal\n} from "lucide-react";'
);

content = content.replace(
    '{ id: "linear", label: "Linear", icon: <Minus className="w-5 h-5" /> },',
    '{ id: "linear", label: "Linear", icon: <Minus className="w-5 h-5" /> },\n    { id: "horizontal", label: "Horizontal", icon: <SquareSplitHorizontal className="w-5 h-5" /> },'
);

fs.writeFileSync('src/components/panels/MaskPanel.tsx', content);
console.log("Success MaskPanel Horizontal");
