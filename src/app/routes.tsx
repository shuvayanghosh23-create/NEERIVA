import { createBrowserRouter } from 'react-router';

// Marketing layout & pages
import { Root } from './components/Root';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { NotFound } from './pages/NotFound';

// User app layout & pages
import { UserLayout } from './components/UserLayout';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { PlaceOrderPage } from './pages/PlaceOrderPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackPage } from './pages/OrderTrackPage';
import { SupportPage } from './pages/SupportPage';

// Admin layout & pages
import { AdminLayout } from './components/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

export const router = createBrowserRouter([
  // ── Marketing site ──────────────────────────────────────────────────────
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'info', Component: InfoPage },
      { path: 'contact-support', Component: ContactPage },
      { path: 'login', Component: LoginPage },
      { path: '*', Component: NotFound },
    ],
  },

  // ── User App (profile setup has its own page, outside UserLayout guard) ─
  {
    path: '/app/profile/setup',
    Component: ProfileSetupPage,
  },

  // ── User App (protected by UserLayout) ──────────────────────────────────
  {
    path: '/app',
    Component: UserLayout,
    children: [
      { path: 'dashboard', Component: DashboardPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'orders/place', Component: PlaceOrderPage },
      { path: 'orders/success', Component: OrderSuccessPage },
      { path: 'orders/track', Component: OrderTrackPage },
      { path: 'support', Component: SupportPage },
    ],
  },

  // ── Admin (login is public) ──────────────────────────────────────────────
  {
    path: '/admin/login',
    Component: AdminLoginPage,
  },

  // ── Admin App (protected by AdminLayout) ────────────────────────────────
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { path: 'dashboard', Component: AdminDashboardPage },
      { path: 'orders', Component: AdminDashboardPage },
      { path: 'users', Component: AdminDashboardPage },
      { path: 'tickets', Component: AdminDashboardPage },
      { path: 'profile', Component: AdminProfilePage },
    ],
  },
]);
