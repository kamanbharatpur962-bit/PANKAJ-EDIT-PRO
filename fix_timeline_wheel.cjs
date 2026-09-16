const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

const targetStr = `  useEffect(() => {
    if (!scrollContainerRef.current || isScrubbing || draggingClipId) return;`;

const newCode = `  // Native wheel listener for smooth pinch-to-zoom and trackpad pan
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent browser whole-page zoom
        setZoomLevel((prevZoom) => {
          // Calculate time under cursor before zoom
          const rect = container.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const timeUnderCursor = (container.scrollLeft + mouseX) / prevZoom;
          
          // Apply zoom delta
          const zoomFactor = -e.deltaY * 0.25; 
          const newZoom = Math.max(8, Math.min(250, prevZoom + zoomFactor));
          
          // Adjust scroll position instantly to lock time under cursor
          if (newZoom !== prevZoom) {
            requestAnimationFrame(() => {
              const newScrollLeft = timeUnderCursor * newZoom - mouseX;
              container.scrollLeft = Math.max(0, newScrollLeft);
            });
          }
          
          return newZoom;
        });
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || isScrubbing || draggingClipId) return;`;

content = content.replace(targetStr, newCode);
fs.writeFileSync('src/components/Timeline.tsx', content);
console.log("Success Fix Wheel");
