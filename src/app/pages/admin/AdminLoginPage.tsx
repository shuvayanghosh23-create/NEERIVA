import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff, Shield, Droplets } from 'lucide-react';
import { useApp } from '../../store';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const { currentAdmin, adminLogin } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (currentAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { toast.error('Enter credentials.'); return; }
    const ok = adminLogin(username, password);
    if (ok) {
      toast.success('Admin login successful.');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
          >
            <Droplets className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-500 mt-1">NEERIVA — The Pure Water</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Administrator Access</p>
              <p className="text-xs text-gray-400">Restricted to authorised personnel only.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Admin username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 h-12 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 h-12 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
            >
              Login as Admin
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Demo credentials: <span className="font-mono text-indigo-500">admin / admin123</span>
          </p>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 transition">
            ← Back to main site
          </button>
        </div>
      </motion.div>
    </div>
  );
}
