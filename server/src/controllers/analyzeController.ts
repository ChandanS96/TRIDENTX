import { Request, Response } from 'express';
import { z } from 'zod';
import { analyzeUrlSignals } from '../services/analysis/urlAnalyzer';
import { calculateTrustScore } from '../services/analysis/trustScoreEngine';
import { generateExplanation } from '../services/ai/geminiService';
import { query } from '../db';

const analyzeSchema = z.object({
  url: z.string().min(1, 'URL is required')
});

export const analyzeWebsite = async (req: Request, res: Response) => {
  try {
    const { url } = analyzeSchema.parse(req.body);

    // 1. Analyze URL structure
    let analysisResult;
    try {
      analysisResult = analyzeUrlSignals(url);
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message || 'Invalid URL' });
    }

    const { url: parsedUrl, normalized, signals } = analysisResult;

    // 2. Trust Score
    const { score, riskLevel, reasons } = calculateTrustScore(signals);

    // 3. AI Explanation
    const analysisData = {
      url: normalized,
      hostname: parsedUrl.hostname,
      trustScore: score,
      riskLevel,
      signals,
      reasons,
    };
    
    const aiExplanation = await generateExplanation(analysisData);

    const result = {
      url: normalized,
      hostname: parsedUrl.hostname,
      trustScore: score,
      riskLevel,
      signals,
      riskFactors: reasons,
      aiExplanation,
      analyzedAt: new Date().toISOString()
    };

    // 4. Save scan to history
    await query(
      `INSERT INTO scans (url, normalized_url, hostname, trust_score, risk_level, signals, reasons, ai_summary, ai_explanation, recommendation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        url,
        normalized,
        parsedUrl.hostname,
        score,
        riskLevel,
        JSON.stringify(signals),
        JSON.stringify(reasons),
        aiExplanation.summary,
        aiExplanation.riskExplanation,
        aiExplanation.recommendedAction
      ]
    );

    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: (error as any).errors[0].message });
    }
    console.error('Analyze error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
