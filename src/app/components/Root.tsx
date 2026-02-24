import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';
import { Header } from './Header';
import { Footer } from './Footer';

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster richColors position="top-right" />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}