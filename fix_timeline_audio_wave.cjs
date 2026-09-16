const fs = require('fs');
let content = fs.readFileSync('src/components/timeline/TimelineAudioSection.tsx', 'utf8');

const oldWaveform = `                  {/* Waveform Visualization Bars */}
                  <div className="ml-auto flex items-center gap-0.5 opacity-80 shrink-0">
                    {[8, 14, 6, 18, 10, 16, 8, 12, 20, 10].map((h, i) => (
                      <div
                        key={i}
                        className={\`w-[2px] rounded-full \${themeStyles.waveform}\`}
                        style={{ height: \`\${Math.max(4, Math.round(h * (laneHeight / 44)))}\px\` }}
                      />
                    ))}
                  </div>`;

const newWaveform = `                  {/* Procedural Continuous Waveform */}
                  <div className="absolute inset-0 top-5 bottom-1 opacity-25 overflow-hidden pointer-events-none flex items-end">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                      <pattern id={\`wave-\${audio.id}\`} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                         <rect x="2" y="8" width="2" height="12" rx="1" fill="currentColor" />
                         <rect x="6" y="4" width="2" height="16" rx="1" fill="currentColor" />
                         <rect x="10" y="10" width="2" height="10" rx="1" fill="currentColor" />
                         <rect x="14" y="2" width="2" height="18" rx="1" fill="currentColor" />
                         <rect x="18" y="6" width="2" height="14" rx="1" fill="currentColor" />
                         <rect x="22" y="12" width="2" height="8" rx="1" fill="currentColor" />
                         <rect x="26" y="4" width="2" height="16" rx="1" fill="currentColor" />
                         <rect x="30" y="10" width="2" height="10" rx="1" fill="currentColor" />
                         <rect x="34" y="6" width="2" height="14" rx="1" fill="currentColor" />
                         <rect x="38" y="14" width="2" height="6" rx="1" fill="currentColor" />
                      </pattern>
                      <rect x="0" y="0" width="100%" height="100%" fill={\`url(#wave-\${audio.id})\`} className={themeStyles.text} />
                    </svg>
                  </div>`;

if (content.includes('Waveform Visualization Bars')) {
    content = content.replace(oldWaveform, newWaveform);
    fs.writeFileSync('src/components/timeline/TimelineAudioSection.tsx', content);
    console.log("Success Fix Waveform");
} else {
    console.log("Target not found!");
}
