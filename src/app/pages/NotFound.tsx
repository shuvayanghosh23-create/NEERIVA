import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Droplets, Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -15, 15, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block p-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mb-8"
        >
          <Droplets className="w-16 h-16 text-white" />
        </motion.div>

        <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-2xl text-gray-700 mb-3">Page Not Found</p>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Looks like this page drifted away! Let's take you back to pure waters.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(6,182,212,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
