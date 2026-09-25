import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await api.get('/scans');
        if (res.data.success) {
          const data = res.data.data;
          setScans(data.slice(0, 5)); // Last 5 scans
          
          if (data.length > 0) {
            const highRiskCount = data.filter(s => s.trust_score < 40).length;
            const avg = Math.round(data.reduce((acc, curr) => acc + curr.trust_score, 0) / data.length);
            setStats({ total: data.length, highRisk: highRiskCount, avgScore: avg });
          }
        }
      } catch (error) {
        console.error('Failed to fetch scans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <Link to="/analyze" className="bg-primary hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors">
          New Analysis
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface border border-gray-800 p-6 rounded-xl flex items-center">
          <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
            <Activity className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Scans</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-surface border border-gray-800 p-6 rounded-xl flex items-center">
          <div className="bg-red-500/10 p-3 rounded-lg mr-4">
            <ShieldAlert className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">High Risk Found</p>
            <p className="text-2xl font-bold">{stats.highRisk}</p>
          </div>
        </div>
        <div className="bg-surface border border-gray-800 p-6 rounded-xl flex items-center">
          <div className="bg-green-500/10 p-3 rounded-lg mr-4">
            <CheckCircle2 className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Avg Trust Score</p>
            <p className="text-2xl font-bold">{stats.avgScore}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Scans</h2>
      <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : scans.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No scans yet. Start by analyzing a website.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#0a0f1c] text-gray-400 text-sm border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Website</th>
                <th className="px-6 py-4 font-medium">Trust Score</th>
                <th className="px-6 py-4 font-medium">Risk Level</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 truncate max-w-xs text-white">{scan.hostname}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${scan.trust_score >= 80 ? 'text-green-500' : scan.trust_score >= 60 ? 'text-yellow-500' : scan.trust_score >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                      {scan.trust_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{scan.risk_level}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(scan.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {scans.length > 0 && (
        <div className="mt-4 text-right">
          <Link to="/history" className="text-primary hover:underline text-sm font-medium">View all history →</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
