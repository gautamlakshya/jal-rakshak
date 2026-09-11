import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { PredictionEngine } from './pages/PredictionEngine';
import { ScenarioSimulator } from './pages/ScenarioSimulator';
import { AlertCenter } from './pages/AlertCenter';
import { FieldOfficer } from './pages/FieldOfficer';
import { Analytics } from './pages/Analytics';
import { SystemStatus } from './pages/SystemStatus';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-background">
        <Navbar />
        <div className="flex flex-1 mt-16 w-full">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-background/50 relative z-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prediction" element={<PredictionEngine />} />
              <Route path="/simulator" element={<ScenarioSimulator />} />
              <Route path="/alerts" element={<AlertCenter />} />
              <Route path="/field" element={<FieldOfficer />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/status" element={<SystemStatus />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
