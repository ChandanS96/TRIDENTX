import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AIExplanationResult {
  summary: string;
  riskExplanation: string;
  importantSignals: string[];
  recommendedAction: string;
  limitations: string;
}

export const generateExplanation = async (analysisData: any): Promise<AIExplanationResult> => {
  if (!process.env.GEMINI_API_KEY) {
    return generateFallbackExplanation(analysisData);
  }

  try {
    const prompt = `
You are a cybersecurity explanation assistant.
Analyze the structured website-security signals provided by the TrustLens engine.
Do not invent facts.
Do not claim that a website is definitely safe or malicious unless a verified security source explicitly provides that determination.

Data:
${JSON.stringify(analysisData, null, 2)}

Explain:
1. What the signals mean
2. Why the Trust Score was produced
3. Which signals matter most
4. What the user should do next

Use simple language suitable for a non-technical user.
Return ONLY valid JSON matching this schema:
{
  "summary": "...",
  "riskExplanation": "...",
  "importantSignals": ["...", "..."],
  "recommendedAction": "...",
  "limitations": "..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');
    const parsed = JSON.parse(text) as AIExplanationResult;
    return parsed;
  } catch (error) {
    console.error('Gemini explanation error:', error);
    return generateFallbackExplanation(analysisData);
  }
};

const generateFallbackExplanation = (data: any): AIExplanationResult => {
  return {
    summary: `Analysis complete for ${data.hostname}. The Trust Score is ${data.trustScore}/100.`,
    riskExplanation: data.reasons.length > 0 
      ? `The score is lowered because of the following risk factors: ${data.reasons.join(', ')}.` 
      : `No significant risk factors were detected based on the available heuristics.`,
    importantSignals: data.signals.filter((s:any) => s.type !== 'neutral').map((s:any) => s.name),
    recommendedAction: data.trustScore >= 80 
      ? 'The website appears to have basic security controls, but remain cautious with sensitive information.'
      : 'Review the domain carefully before entering passwords, payment details, or other sensitive information.',
    limitations: 'TrustLens provides automated security indicators and does not guarantee that a website is safe or malicious. AI explanation is temporarily unavailable.'
  };
};
