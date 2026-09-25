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
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-surface rounded-2xl border border-gray-800 p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Analyze Website</h2>
        
        <form onSubmit={handleAnalyze} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="https://example.com"
              className="flex-grow bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-primary text-white"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
              required
            />
            <button
              type="submit"
              disabled={isAnalyzing || !url}
              className="bg-primary hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
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
          <div className="bg-[#0a0f1c] rounded-xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-4 text-gray-300">Analysis Progress</h3>
            <div className="space-y-4">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center">
                  {stage.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />}
                  {stage.status === 'loading' && <Loader2 className="w-5 h-5 text-primary animate-spin mr-3" />}
                  {stage.status === 'pending' && <Circle className="w-5 h-5 text-gray-600 mr-3" />}
                  <span className={`text-sm ${stage.status === 'done' ? 'text-gray-300' : stage.status === 'loading' ? 'text-white font-medium' : 'text-gray-600'}`}>
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
