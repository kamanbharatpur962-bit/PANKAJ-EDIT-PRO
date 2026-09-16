const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('onCreateProjectWithMedia={handleCreateProjectWithMedia}')) {
  // Find <HomeScreen and insert it
  const oldHomeScreen = `<HomeScreen
          onNewProject={handleNewProject}`;
  const newHomeScreen = `<HomeScreen
          onNewProject={handleNewProject}
          onCreateProjectWithMedia={handleCreateProjectWithMedia}`;
  content = content.replace(oldHomeScreen, newHomeScreen);
}

fs.writeFileSync('src/App.tsx', content);
