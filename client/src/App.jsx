import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import AnalysisResult from './pages/AnalysisResult';
import ScanHistory from './pages/ScanHistory';
import ScanDetails from './pages/ScanDetails';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-white font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/analysis-result" element={<AnalysisResult />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/scan/:id" element={<ScanDetails />} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} TrustLens AI. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
