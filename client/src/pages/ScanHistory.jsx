import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, Search, ExternalLink } from 'lucide-react';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await api.get('/scans');
      if (res.data.success) {
        setScans(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch scans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;
    try {
      const res = await api.delete(`/scans/${id}`);
      if (res.data.success) {
        setScans(scans.filter(scan => scan.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete scan', error);
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.hostname.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'All') return true;
    if (filter === 'High Risk') return scan.trust_score < 40;
    if (filter === 'Elevated Risk') return scan.trust_score >= 40 && scan.trust_score < 60;
    if (filter === 'Moderate') return scan.trust_score >= 60 && scan.trust_score < 80;
    if (filter === 'Higher Trust') return scan.trust_score >= 80;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Scan History</h1>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search domains..."
            className="w-full bg-surface border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Higher Trust', 'Moderate', 'Elevated Risk', 'High Risk'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${filter === f ? 'bg-primary border-primary text-white' : 'bg-surface border-gray-700 text-gray-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredScans.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No scans found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0a0f1c] text-gray-400 text-sm border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Website</th>
                  <th className="px-6 py-4 font-medium">Trust Score</th>
                  <th className="px-6 py-4 font-medium">Risk Level</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 truncate max-w-xs text-white">{scan.hostname}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${scan.trust_score >= 80 ? 'text-green-500' : scan.trust_score >= 60 ? 'text-yellow-500' : scan.trust_score >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                        {scan.trust_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{scan.risk_level}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(scan.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/scan/${scan.id}`} className="text-blue-400 hover:text-blue-300 transition-colors" title="View Details">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(scan.id)} className="text-red-500 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;
