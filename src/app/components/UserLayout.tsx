import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, ShoppingCart, Truck, UserCircle, HeadphonesIcon,
  LogOut, Droplets, Menu, X,
} from 'lucide-react';
import { useApp } from '../store';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Place Order', to: '/app/orders/place', icon: ShoppingCart },
  { label: 'Track Orders', to: '/app/orders/track', icon: Truck },
  { label: 'Profile', to: '/app/profile', icon: UserCircle },
  { label: 'Support', to: '/app/support', icon: HeadphonesIcon },
];

export function UserLayout() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.isProfileSetup && window.location.pathname !== '/app/profile/setup') {
    return <Navigate to="/app/profile/setup" replace />;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  const avatarLetter = currentUser.name.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-cyan-100">
        <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-full shrink-0">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-cyan-700 leading-tight">NEERIVA</p>
          <p className="text-xs text-gray-400">My Account</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-cyan-50">
        <div className="flex items-center gap-3">
          {currentUser.profilePicture ? (
            <img src={currentUser.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
              {avatarLetter}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.emailOrMobile}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-cyan-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toaster richColors position="top-right" />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shrink-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-1.5 rounded-full">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-cyan-700">NEERIVA</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {avatarLetter}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}