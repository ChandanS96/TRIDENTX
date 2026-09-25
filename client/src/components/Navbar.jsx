import { Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, History, Info } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800/50 bg-surface/70 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/20">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <ShieldCheck className="h-8 w-8 text-primary group-hover:text-secondary transition-colors duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-xl font-bold tracking-wider text-white">TRUSTLENS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span></span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Home</Link>
          <Link to="/analyze" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Analyze</Link>
          <Link to="/how-it-works" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all flex items-center"><Info className="w-4 h-4 mr-1"/> How It Works</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all flex items-center"><LayoutDashboard className="w-4 h-4 mr-1"/> Dashboard</Link>
          <Link to="/history" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all flex items-center"><History className="w-4 h-4 mr-1"/> History</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
