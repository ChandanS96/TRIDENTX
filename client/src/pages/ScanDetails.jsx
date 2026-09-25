import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AnalysisResult from './AnalysisResult';

const ScanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await api.get(`/scans/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          
          // Reconstruct the result format expected by AnalysisResult
          const result = {
            url: data.url,
            hostname: data.hostname,
            trustScore: data.trust_score,
            riskLevel: data.risk_level,
            signals: data.signals || [],
            riskFactors: data.reasons || [],
            aiExplanation: {
              summary: data.ai_summary,
              riskExplanation: data.ai_explanation,
              recommendedAction: data.recommendation,
              limitations: "TrustLens provides automated security indicators and does not guarantee that a website is safe or malicious."
            }
          };
          
          // We can use the AnalysisResult component directly by passing state, 
          // but to avoid URL changes, we'll just navigate to it with the state
          navigate('/analysis-result', { state: { result }, replace: true });
        }
      } catch (err) {
        setError('Failed to load scan details');
        setLoading(false);
      }
    };
    fetchScan();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-20">Loading scan details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return null; // Will navigate away
};

export default ScanDetails;
