import { ArrowDown } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "User submits URL",
      description: "You provide a website link you want to check for potential risks.",
      color: "border-blue-500"
    },
    {
      id: 2,
      title: "Backend validates and normalizes URL",
      description: "Our engine checks the URL format, secures against internal network attacks (SSRF), and prepares it for analysis.",
      color: "border-indigo-500"
    },
    {
      id: 3,
      title: "TrustLens extracts security signals",
      description: "We analyze the connection type (HTTPS), domain structure, suspicious characters, keywords, and known indicators of compromise.",
      color: "border-purple-500"
    },
    {
      id: 4,
      title: "Risk engine calculates weighted score",
      description: "A transparent algorithm assigns points based on positive and negative security signals to calculate the final Trust Score.",
      color: "border-pink-500"
    },
    {
      id: 5,
      title: "Gemini converts technical findings",
      description: "Google's Gemini AI reads the complex security data and translates it into a simple, human-readable explanation.",
      color: "border-red-500"
    },
    {
      id: 6,
      title: "Result is stored securely",
      description: "If you are logged in, the analysis is saved to your encrypted dashboard history.",
      color: "border-orange-500"
    },
    {
      id: 7,
      title: "User receives actionable intelligence",
      description: "You get a clear Trust Score, reasons for the score, and recommended next steps to stay safe online.",
      color: "border-green-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How TrustLens Works</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Our analysis engine combines static heuristics, dynamic security signals, and generative AI to evaluate website risk.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-800 transform md:-translate-x-1/2 rounded"></div>
        
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-surface border-2 border-gray-700 rounded-full flex items-center justify-center transform md:-translate-x-1/2 z-10 shadow-lg font-bold text-xl text-gray-300">
                {step.id}
              </div>
              
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 text-left' : 'md:pl-16 md:text-right'}`}>
                <div className={`bg-surface p-6 rounded-2xl border-l-4 ${step.color} shadow-xl border-y border-r border-gray-800 md:border-l border-t border-b`}>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-20 bg-surface rounded-2xl p-8 border border-gray-800 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Architecture</h2>
        <div className="bg-[#0a0f1c] p-6 rounded-xl overflow-x-auto border border-gray-800">
          <pre className="text-blue-400 text-sm leading-relaxed text-left inline-block">
{`                 USER
                   │
                   ▼
             REACT FRONTEND
                   │
              REST API
                   │
                   ▼
          NODE + EXPRESS SERVER
                   │
        ┌──────────┼───────────┐
        ▼          ▼           ▼
   URL ENGINE   SECURITY    DATABASE
                SIGNALS
        │          │
        └────┬─────┘
             ▼
       TRUST SCORE ENGINE
             │
             ▼
         GEMINI AI
             │
             ▼
      EXPLANATION ENGINE
             │
             ▼
         USER RESULT`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
