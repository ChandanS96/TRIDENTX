import { useLocation, Link, Navigate } from 'react-router-dom';
import ScoreGauge from '../components/ScoreGauge';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, HelpCircle, ArrowLeft, Circle } from 'lucide-react';

const AnalysisResult = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return <Navigate to="/analyze" />;
  }

  const { url, hostname, trustScore, riskLevel, signals, riskFactors, aiExplanation } = result;

  const getSignalIcon = (status, type) => {
    if (status === 'unavailable') return <HelpCircle className="w-5 h-5 text-gray-500" />;
    if (type === 'positive') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (type === 'negative') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getSignalBadge = (status) => {
    if (status === 'verified') return <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded">Verified</span>;
    if (status === 'detected') return <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded">Detected</span>;
    return <span className="bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded">Unavailable</span>;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      
      <div className="flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer w-fit">
        <Link to="/analyze" className="flex items-center"><ArrowLeft className="w-4 h-4 mr-1" /> New Analysis</Link>
      </div>

      {/* Header */}
      <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col md:flex-row items-center gap-8 animate-fade-in overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 pointer-events-none"></div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <p className="text-primary font-bold tracking-widest text-sm mb-2 drop-shadow-sm flex items-center justify-center md:justify-start">
            <ShieldAlert className="w-4 h-4 mr-2" /> ANALYSIS COMPLETE
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold break-all mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-md">{url}</h1>
          <p className="text-lg">
            Risk Level: <span className={`font-bold px-3 py-1 rounded-full ml-2 ${riskLevel.toLowerCase().includes('high') ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : riskLevel.toLowerCase().includes('elevated') ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{riskLevel}</span>
          </p>
        </div>
        <div className="flex-shrink-0 relative z-10 scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <ScoreGauge score={trustScore} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          {/* AI Explanation */}
          <div className="bg-surface/60 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:border-purple-500/40 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4 flex items-center text-white">
              <span className="bg-purple-500/20 p-2 rounded-lg mr-3 shadow-[0_0_10px_rgba(168,85,247,0.2)]"><ShieldAlert className="text-purple-400 w-5 h-5"/></span>
              AI Explanation
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4 text-lg">
              {aiExplanation?.summary}
            </p>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
              {aiExplanation?.riskExplanation}
            </p>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-5 rounded-xl mt-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
              <h3 className="text-xs font-bold text-blue-300 mb-2 uppercase tracking-wider flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Recommended Action</h3>
              <p className="text-blue-100 font-medium">{aiExplanation?.recommendedAction}</p>
            </div>
            
            <p className="text-xs text-gray-500 mt-6 italic">
              {aiExplanation?.limitations}
            </p>
          </div>

          {/* Risk Factors */}
          <div className="bg-surface/60 backdrop-blur-md rounded-2xl border border-red-500/20 p-6 shadow-[0_0_30px_rgba(239,68,68,0.05)] hover:border-red-500/40 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4 flex items-center border-b border-gray-800/50 pb-4 text-white">
              Risk Factors Detected
            </h2>
            {riskFactors.length > 0 ? (
              <ul className="space-y-4 mt-4">
                {riskFactors.map((factor, i) => (
                  <li key={i} className="flex items-start bg-red-500/5 p-3 rounded border border-red-500/10">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center text-green-400 mt-4 bg-green-500/5 p-4 rounded">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                No high-risk factors detected based on standard heuristics.
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Signals */}
          <div className="bg-surface/60 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 h-full shadow-[0_0_30px_rgba(59,130,246,0.05)] hover:border-blue-500/40 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-800/50 pb-4 text-white">Security Signals</h2>
            <div className="space-y-4">
              {signals.map((signal, idx) => (
                <div key={signal.id} className="flex items-start p-4 rounded-xl bg-[#050b14]/50 border border-gray-800 hover:border-gray-600 transition-colors duration-300 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  <div className="mt-1 mr-4 flex-shrink-0 bg-gray-800/50 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    {getSignalIcon(signal.status, signal.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{signal.name}</h4>
                      {getSignalBadge(signal.status)}
                    </div>
                    <p className="text-sm text-gray-400">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
      
      {/* Disclaimer */}
      <div className="text-center text-sm text-gray-600 mt-12 pb-8">
        "TrustLens provides automated security indicators and does not guarantee that a website is safe or malicious."
      </div>
    </div>
  );
};

export default AnalysisResult;
