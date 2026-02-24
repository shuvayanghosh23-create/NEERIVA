import { motion } from 'motion/react';
import { Droplets, Sparkles, Package, ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  const navigate = useNavigate();

  const features = [
    { icon: Droplets, text: '100% Pure Water', sub: 'Certified quality' },
    { icon: Package, text: 'Custom Printed', sub: 'Your design on every bottle' },
    { icon: Sparkles, text: 'Fast Delivery', sub: 'Delivered to your door' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50"
        />
        {[...Array(12)].map((_, i) => (
          <motion.div key={i}
            initial={{ y: '100vh' }}
            animate={{ y: '-100vh' }}
            transition={{ duration: 15 + (i % 5) * 3, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{ left: `${(i / 12) * 100}%` }}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 opacity-20">
          <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
            <motion.path
              animate={{ d: [
                'M0,100L48,90C96,80,192,60,288,57C384,53,480,67,576,77C672,87,768,93,864,87C960,80,1056,60,1152,60C1248,60,1344,80,1392,90L1440,100L1440,200L0,200Z',
                'M0,120L48,113C96,107,192,93,288,97C384,100,480,120,576,120C672,120,768,100,864,97C960,93,1056,107,1152,113C1248,120,1344,120,1392,120L1440,120L1440,200L0,200Z',
              ]}}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
              fill="#06b6d4"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Custom Packaged Drinking Water Service
              </motion.div>

              <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
                className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent leading-tight"
              >
                NEERIVA
              </motion.h1>
              <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }}
                className="text-2xl text-gray-600 mb-4 font-light"
              >
                The Pure Water
              </motion.p>
              <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75, duration: 0.7 }}
                className="text-lg text-gray-500 mb-8 max-w-lg"
              >
                Order personalized water bottles with your own brand, logo, or design — printed and delivered fresh to your doorstep.
              </motion.p>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(6,182,212,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="px-7 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Get Started — It's Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/info')}
                  className="px-7 py-3 border-2 border-cyan-400 text-cyan-600 font-semibold rounded-full hover:bg-cyan-50 transition-all"
                >
                  Learn More
                </motion.button>
              </motion.div>

              {/* Admin Login Link */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                onClick={() => navigate('/admin/login')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 transition group"
              >
                <Shield className="w-4 h-4 group-hover:text-indigo-500 transition" />
                Administrator Login
              </motion.button>
            </div>

            {/* Right: Bottle image + cards */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1553531768-f617f5ba7dd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB3YXRlciUyMGJvdHRsZSUyMHBhY2thZ2luZyUyMGRlc2lnbnxlbnwxfHx8fDE3NzE5MDk2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Custom water bottles"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-2xl font-bold">Your Brand.</p>
                  <p className="text-cyan-200">On every bottle.</p>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-cyan-100"
              >
                <p className="text-2xl font-bold text-cyan-600">250ml</p>
                <p className="text-xs text-gray-400">to 1 Liter sizes</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="grid sm:grid-cols-3 gap-5 mt-14"
          >
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ scale: 1.04, y: -4 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-cyan-50 flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shrink-0">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{f.text}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => navigate('/info')}
        className="pb-8 flex justify-center cursor-pointer"
      >
        <ChevronDown className="w-7 h-7 text-cyan-400" />
      </motion.div>
    </div>
  );
}
