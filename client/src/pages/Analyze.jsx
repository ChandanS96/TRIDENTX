import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Analyze = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  const [stages, setStages] = useState([
    { id: 1, name: 'Validating URL', status: 'pending' },
    { id: 2, name: 'Inspecting URL structure', status: 'pending' },
    { id: 3, name: 'Checking security signals', status: 'pending' },
    { id: 4, name: 'Calculating Trust Score', status: 'pending' },
    { id: 5, name: 'Generating explanation', status: 'pending' },
    { id: 6, name: 'Saving analysis', status: 'pending' }
  ]);

  useEffect(() => {
    if (searchParams.get('url')) {
      handleAnalyze();
    }
  }, []);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError('');
    
    // Reset stages
    setStages(stages.map(s => ({ ...s, status: 'pending' })));

    try {
      // Simulate frontend progress for better UX before API call finishes
      // The API call happens simultaneously, but we fake the stages slightly for the demo
      // In a real advanced app with WebSockets, the backend would push status updates.
      // Here, we just animate them over 2-3 seconds while the API request is made.
      
      const stageTimer = (index, ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      let currentStage = 0;
      const updateStage = (index, status) => {
        setStages(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
      };

      updateStage(0, 'loading');
      
      const apiCall = api.post('/analyze', { url });
      
      // Simulate stages while waiting for API
      await stageTimer(0, 500);
      updateStage(0, 'done');
      updateStage(1, 'loading');
      
      await stageTimer(1, 600);
      updateStage(1, 'done');
      updateStage(2, 'loading');
      
      await stageTimer(2, 600);
      updateStage(2, 'done');
      updateStage(3, 'loading');

      const response = await apiCall;
      
      updateStage(3, 'done');
      updateStage(4, 'loading');
      await stageTimer(4, 400); // Gemini explanation time approx
      
      updateStage(4, 'done');
      updateStage(5, 'loading');
      await stageTimer(5, 300); // DB save
      
      updateStage(5, 'done');

      setTimeout(() => {
        navigate('/analysis-result', { state: { result: response.data.data } });
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Analysis failed. Please check the URL and try again.');
      setIsAnalyzing(false);
      setStages(stages.map(s => ({ ...s, status: 'pending' })));
    }
  };

  const setDemoUrl = (demoUrl) => {
    setUrl(demoUrl);
  };

  return (
    <div className="relative max-w-3xl mx-auto py-10 px-4 md:px-0">
      {/* Background Glows */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob z-0 pointer-events-none"></div>
      
      <div className="relative z-10 bg-surface/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Analyze Website</h2>
        
        <form onSubmit={handleAnalyze} className="mb-8 relative">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="https://example.com"
              className="flex-grow bg-[#050b14]/80 backdrop-blur-md border border-gray-700 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 text-white shadow-inner transition-all disabled:opacity-50"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
              required
            />
            <button
              type="submit"
              disabled={isAnalyzing || !url}
              className="bg-gradient-to-r from-primary to-secondary hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:shadow-none hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 disabled:transform-none"
            >
              {isAnalyzing ? (
                <span className="flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</span>
              ) : 'Analyze Website'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-500 py-1">Try Demo:</span>
            <button type="button" onClick={() => setDemoUrl('https://example.com')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded transition-colors text-xs">Safe Example</button>
            <button type="button" onClick={() => setDemoUrl('https://secure-login-example.com')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded transition-colors text-xs">Suspicious Example</button>
            <button type="button" onClick={() => setDemoUrl('http://192.168.1.10/login')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded transition-colors text-xs">IP Based Risk</button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-center mb-6">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="relative overflow-hidden bg-[#050b14]/90 backdrop-blur-xl rounded-2xl p-8 border border-primary/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] animate-fade-in mt-8">
            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-primary/40 animate-scan"></div>
            </div>
            
            <h3 className="font-bold mb-6 text-primary flex items-center text-xl">
              <ShieldAlert className="w-6 h-6 mr-3 animate-pulse" />
              Real-time Analysis Progress
            </h3>
            <div className="space-y-5 relative z-10">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center transition-all duration-500" style={{ opacity: stage.status === 'pending' ? 0.4 : 1, transform: stage.status === 'loading' ? 'scale(1.02)' : 'scale(1)' }}>
                  <div className="relative mr-4">
                    {stage.status === 'done' && <div className="absolute inset-0 bg-green-500 rounded-full blur-[8px] opacity-60"></div>}
                    {stage.status === 'loading' && <div className="absolute inset-0 bg-primary rounded-full blur-[10px] opacity-80 animate-pulse"></div>}
                    {stage.status === 'done' && <CheckCircle2 className="w-7 h-7 text-green-400 relative z-10" />}
                    {stage.status === 'loading' && <Loader2 className="w-7 h-7 text-white animate-spin relative z-10" />}
                    {stage.status === 'pending' && <Circle className="w-7 h-7 text-gray-600 relative z-10" />}
                  </div>
                  <span className={`text-lg transition-colors duration-300 ${stage.status === 'done' ? 'text-gray-300' : stage.status === 'loading' ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-gray-500'}`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
