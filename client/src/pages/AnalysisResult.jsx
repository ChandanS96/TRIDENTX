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
      <div className="bg-surface rounded-2xl border border-gray-800 p-8 shadow-lg flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-2">Analyzed URL</p>
          <h1 className="text-2xl md:text-3xl font-bold break-all mb-4 text-white">{url}</h1>
          <p className="text-lg">
            Risk Level: <span className="font-semibold text-gray-200">{riskLevel}</span>
          </p>
        </div>
        <div className="flex-shrink-0">
          <ScoreGauge score={trustScore} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* AI Explanation */}
          <div className="bg-surface rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-purple-500/20 p-1.5 rounded mr-3"><ShieldAlert className="text-purple-400 w-5 h-5"/></span>
              AI Explanation
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {aiExplanation?.summary}
            </p>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              {aiExplanation?.riskExplanation}
            </p>
            <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Recommended Action</h3>
              <p className="text-blue-200 font-medium">{aiExplanation?.recommendedAction}</p>
            </div>
            
            <p className="text-xs text-gray-500 mt-6 italic">
              {aiExplanation?.limitations}
            </p>
          </div>

          {/* Risk Factors */}
          <div className="bg-surface rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center border-b border-gray-800 pb-4">
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
        <div className="space-y-8">
          
          {/* Signals */}
          <div className="bg-surface rounded-xl border border-gray-800 p-6 h-full">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Security Signals</h2>
            <div className="space-y-4">
              {signals.map(signal => (
                <div key={signal.id} className="flex items-start p-4 rounded-lg bg-[#0a0f1c] border border-gray-800">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    {getSignalIcon(signal.status, signal.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{signal.name}</h4>
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
