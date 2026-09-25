import { cn } from '../utils/cn';

const ScoreGauge = ({ score }) => {
  let color = 'text-green-500';
  let bgColor = 'border-green-500/20';
  
  if (score < 40) {
    color = 'text-red-500';
    bgColor = 'border-red-500/20';
  } else if (score < 60) {
    color = 'text-orange-500';
    bgColor = 'border-orange-500/20';
  } else if (score < 80) {
    color = 'text-yellow-500';
    bgColor = 'border-yellow-500/20';
  }

  const dashArray = 283;
  const dashOffset = dashArray - (dashArray * score) / 100;

  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-800 stroke-current"
          strokeWidth="8"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        ></circle>
        <circle
          className={cn("stroke-current transition-all duration-1000 ease-out", color)}
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        ></circle>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={cn("text-5xl font-bold", color)}>{score}</span>
        <span className="text-sm text-gray-400 font-medium tracking-widest mt-1">/ 100</span>
        <span className="text-xs text-gray-500 mt-2">TRUST SCORE</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
