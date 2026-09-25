import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="bg-surface p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              minLength="6"
              className="w-full bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
