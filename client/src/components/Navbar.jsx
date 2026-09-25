import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, LogOut, LayoutDashboard, History, Info } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-800 bg-surface px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-wider text-white">TRUSTLENS <span className="text-primary">AI</span></span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/analyze" className="text-gray-300 hover:text-white transition-colors">Analyze</Link>
          <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors flex items-center"><Info className="w-4 h-4 mr-1"/> How It Works</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center"><LayoutDashboard className="w-4 h-4 mr-1"/> Dashboard</Link>
              <Link to="/history" className="text-gray-300 hover:text-white transition-colors flex items-center"><History className="w-4 h-4 mr-1"/> History</Link>
              <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-red-400 transition-colors">
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
