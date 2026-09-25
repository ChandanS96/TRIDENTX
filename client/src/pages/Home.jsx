import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Globe, Cpu, ArrowRight } from 'lucide-react';

const Home = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (url) {
      navigate(`/analyze?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Know Before You <span className="text-primary">Trust.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Analyze any website URL for suspicious patterns, security signals, and potential phishing risks — with an easy-to-understand Trust Score.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-surface p-6 md:p-8 rounded-2xl border border-gray-800 shadow-2xl mb-12">
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-grow bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-4 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all group"
          >
            Analyze Website
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          No browsing required. TrustLens analyzes the URL and available security signals before explaining the result.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full mt-8">
        <div className="bg-surface p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Globe className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3">URL Intelligence</h3>
          <p className="text-gray-400">Detect suspicious URL structures, lookalike domains, and phishing patterns instantly.</p>
        </div>
        
        <div className="bg-surface p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-3">Security Signals</h3>
          <p className="text-gray-400">Examine HTTPS, connection security, and available domain-level threat intelligence.</p>
        </div>
        
        <div className="bg-surface p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <Cpu className="w-7 h-7 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold mb-3">AI Explanation</h3>
          <p className="text-gray-400">Understand the reasons behind the Trust Score in simple language using Gemini AI.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
