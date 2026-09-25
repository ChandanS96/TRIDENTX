import { Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, History, Info } from 'lucide-react';

const Navbar = () => {
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
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center"><LayoutDashboard className="w-4 h-4 mr-1"/> Dashboard</Link>
          <Link to="/history" className="text-gray-300 hover:text-white transition-colors flex items-center"><History className="w-4 h-4 mr-1"/> History</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
