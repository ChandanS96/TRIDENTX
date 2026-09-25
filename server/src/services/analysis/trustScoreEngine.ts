import { SecuritySignal } from './urlAnalyzer';

export const calculateTrustScore = (signals: SecuritySignal[]) => {
  let score = 100;
  const reasons: string[] = [];

  signals.forEach(signal => {
    score += signal.weight;
    if (signal.type === 'negative') {
      reasons.push(signal.description);
    }
  });

  // Clamp score
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let riskLevel = 'Unknown';
  if (score >= 80) riskLevel = 'Higher trust signals';
  else if (score >= 60) riskLevel = 'Moderate';
  else if (score >= 40) riskLevel = 'Elevated risk';
  else riskLevel = 'High risk indicators';

  return { score, riskLevel, reasons };
};
