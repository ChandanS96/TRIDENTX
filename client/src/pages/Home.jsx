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
    <div className="relative flex flex-col items-center max-w-5xl mx-auto py-12 px-4 md:px-0">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-primary rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob z-0"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000 z-0"></div>
      <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-4000 z-0"></div>

      <div className="text-center mb-16 relative z-10 mt-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Know Before You <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-pulse-slow drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Trust.</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Analyze any website URL for suspicious patterns, security signals, and potential phishing risks — with an easy-to-understand Trust Score.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-surface/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-gray-700/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] mb-16 hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] transition-shadow duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl pointer-events-none"></div>
        <form onSubmit={handleAnalyze} className="relative flex flex-col md:flex-row gap-4">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-grow bg-[#050b14]/80 backdrop-blur-sm border border-gray-700 rounded-lg px-5 py-4 text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder-gray-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all group shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1"
          >
            Analyze Website
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-5 text-center relative font-medium">
          No browsing required. TrustLens analyzes the URL and available security signals before explaining the result.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full mt-8 relative z-10">
        <div className="bg-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/80 flex flex-col items-center text-center hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 group">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 animate-float shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Globe className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">URL Intelligence</h3>
          <p className="text-gray-400">Detect suspicious URL structures, lookalike domains, and phishing patterns instantly.</p>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/80 flex flex-col items-center text-center hover:-translate-y-2 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-300 group">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300 animate-float shadow-[0_0_15px_rgba(34,197,94,0.2)]" style={{ animationDelay: '0.2s' }}>
            <ShieldAlert className="w-8 h-8 text-green-500 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors">Security Signals</h3>
          <p className="text-gray-400">Examine HTTPS, connection security, and available domain-level threat intelligence.</p>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/80 flex flex-col items-center text-center hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300 animate-float shadow-[0_0_15px_rgba(168,85,247,0.2)]" style={{ animationDelay: '0.4s' }}>
            <Cpu className="w-8 h-8 text-purple-500 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">AI Explanation</h3>
          <p className="text-gray-400">Understand the reasons behind the Trust Score in simple language using Gemini AI.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
