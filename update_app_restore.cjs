const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const restoreLogic = `  const handleRestoreProjects = (restoredProjects: VideoProject[]) => {
    // Merge restored projects, avoiding duplicates by ID
    setSavedProjects((prev) => {
      const existingIds = new Set(prev.map(p => p.id));
      const newProjects = restoredProjects.filter(p => !existingIds.has(p.id));
      return [...newProjects, ...prev];
    });
  };`;

if (!content.includes('handleRestoreProjects')) {
  // Find where to insert it, maybe after handleCreateProjectWithMedia
  content = content.replace('const handleStartBlankProject = useCallback', restoreLogic + '\n\n  const handleStartBlankProject = useCallback');
}

const oldHomeScreen = `onCreateProjectWithMedia={handleCreateProjectWithMedia}
          onOpenFeature={setActiveAIFeature}`;
const newHomeScreen = `onCreateProjectWithMedia={handleCreateProjectWithMedia}
          onRestoreProjects={handleRestoreProjects}
          onOpenFeature={setActiveAIFeature}`;

if (!content.includes('onRestoreProjects={handleRestoreProjects}')) {
  content = content.replace(oldHomeScreen, newHomeScreen);
}

fs.writeFileSync('src/App.tsx', content);
