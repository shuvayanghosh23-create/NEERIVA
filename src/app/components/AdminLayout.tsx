import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, ClipboardList, Users, MessageSquare,
  UserCircle, LogOut, Droplets, Menu, X, Shield,
} from 'lucide-react';
import { useApp } from '../store';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Support Tickets', to: '/admin/tickets', icon: MessageSquare },
  { label: 'My Profile', to: '/admin/profile', icon: UserCircle },
];

export function AdminLayout() {
  const { currentAdmin, adminLogout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentAdmin) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    adminLogout();
    toast.success('Admin logged out.');
    navigate('/admin/login');
  };

  const avatarLetter = currentAdmin.name.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-indigo-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-full shrink-0">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-indigo-700 leading-tight">NEERIVA</p>
          <p className="text-xs text-purple-400">Admin Panel</p>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-5 py-4 border-b border-indigo-50">
        <div className="flex items-center gap-3">
          {currentAdmin.profilePicture ? (
            <img src={currentAdmin.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {avatarLetter}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-800 text-sm truncate">{currentAdmin.name}</p>
              <Shield className="w-3 h-3 text-indigo-500 shrink-0" />
            </div>
            <p className="text-xs text-gray-400">Administrator</p>
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
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-indigo-50">
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
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-bold text-indigo-700">NEERIVA Admin</span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {avatarLetter}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
