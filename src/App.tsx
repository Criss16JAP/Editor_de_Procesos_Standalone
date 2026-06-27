import { MainToolbar } from './components/MainToolbar';
import { MetadataForm } from './components/MetadataForm';
import { ActivityManager } from './components/ActivityManager';
import { ValidationPane } from './components/ValidationPane';

function App() {
  return (
    <div className="app-container">
      <MainToolbar />
      <main className="workspace-layout">
        <div className="editor-column">
          <MetadataForm />
          <ActivityManager />
        </div>
        <div className="preview-column">
          <ValidationPane />
        </div>
      </main>
    </div>
  );
}

export default App;
