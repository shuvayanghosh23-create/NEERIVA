import { motion } from 'motion/react';
import { Droplets } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Info', to: '/info' },
  { label: 'Contact Support', to: '/contact-support' },
];

export function Header() {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-full">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                NEERIVA
              </h1>
              <p className="text-xs text-gray-600">The Pure Water</p>
            </div>
          </motion.button>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-full font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:text-cyan-600 hover:bg-cyan-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}

            {/* Login button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `ml-2 px-5 py-2 rounded-full font-semibold text-sm border-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-md'
                      : 'border-cyan-400 text-cyan-600 hover:bg-cyan-50'
                  }`
                }
              >
                Login
              </NavLink>
            </motion.div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
