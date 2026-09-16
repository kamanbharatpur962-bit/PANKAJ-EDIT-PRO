const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

content = content.replace('import React, { useState } from "react";', 'import React, { useState, useRef } from "react";');

fs.writeFileSync('src/components/HomeScreen.tsx', content);
