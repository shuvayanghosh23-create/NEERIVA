import { createContext, useContext, useState, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  title: string;
  name: string;
  emailOrMobile: string;
  password: string;
  address: string;
  profilePicture: string;
  bio: string;
  isProfileSetup: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  bottleSize: '1L' | '500ml' | '250ml';
  quantity: number;
  designImage: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalPrice: number;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  reply: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  name: string;
  profilePicture: string;
}

// ── Pricing ────────────────────────────────────────────────────────────────

export const BOTTLE_PRICES: Record<Order['bottleSize'], number> = {
  '1L': 65,
  '500ml': 45,
  '250ml': 30,
};

// ── Seed Data ──────────────────────────────────────────────────────────────

const SEED_USERS: User[] = [
  {
    id: 'u1',
    title: 'Mr.',
    name: 'Ravi Kumar',
    emailOrMobile: 'ravi@example.com',
    password: 'demo123',
    address: '12 MG Road, Bangalore, Karnataka 560001',
    profilePicture: '',
    bio: 'Entrepreneur & water enthusiast.',
    isProfileSetup: true,
    createdAt: '2026-01-10T08:00:00',
  },
  {
    id: 'u2',
    title: 'Ms.',
    name: 'Priya Sharma',
    emailOrMobile: 'priya@example.com',
    password: 'demo123',
    address: '45 Anna Nagar, Chennai, Tamil Nadu 600040',
    profilePicture: '',
    bio: '',
    isProfileSetup: false,
    createdAt: '2026-02-01T10:30:00',
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: 'u1',
    userName: 'Ravi Kumar',
    bottleSize: '1L',
    quantity: 10,
    designImage: '',
    deliveryName: 'Ravi Kumar',
    deliveryPhone: '9876543210',
    deliveryAddress: '12 MG Road, Bangalore, Karnataka 560001',
    status: 'delivered',
    totalPrice: 650,
    adminNote: '',
    createdAt: '2026-01-15T09:00:00',
    updatedAt: '2026-01-20T14:00:00',
  },
  {
    id: 'ORD-002',
    userId: 'u1',
    userName: 'Ravi Kumar',
    bottleSize: '500ml',
    quantity: 20,
    designImage: '',
    deliveryName: 'Ravi Kumar',
    deliveryPhone: '9876543210',
    deliveryAddress: '12 MG Road, Bangalore, Karnataka 560001',
    status: 'shipped',
    totalPrice: 900,
    adminNote: 'Dispatched via Blue Dart. ETA 2 days.',
    createdAt: '2026-02-05T11:00:00',
    updatedAt: '2026-02-10T09:00:00',
  },
  {
    id: 'ORD-003',
    userId: 'u2',
    userName: 'Priya Sharma',
    bottleSize: '250ml',
    quantity: 50,
    designImage: '',
    deliveryName: 'Priya Sharma',
    deliveryPhone: '9123456789',
    deliveryAddress: '45 Anna Nagar, Chennai, Tamil Nadu 600040',
    status: 'pending',
    totalPrice: 1500,
    adminNote: '',
    createdAt: '2026-02-20T14:30:00',
    updatedAt: '2026-02-20T14:30:00',
  },
  {
    id: 'ORD-004',
    userId: 'u1',
    userName: 'Ravi Kumar',
    bottleSize: '1L',
    quantity: 5,
    designImage: '',
    deliveryName: 'Ravi Kumar',
    deliveryPhone: '9876543210',
    deliveryAddress: '12 MG Road, Bangalore, Karnataka 560001',
    status: 'accepted',
    totalPrice: 325,
    adminNote: 'Your design has been approved. Printing in progress.',
    createdAt: '2026-02-18T08:00:00',
    updatedAt: '2026-02-19T10:00:00',
  },
];

const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-001',
    userId: 'u1',
    userName: 'Ravi Kumar',
    subject: 'Delivery delay for ORD-002',
    message: 'My order ORD-002 was supposed to arrive yesterday but has not reached yet. Please update.',
    status: 'in-progress',
    reply: 'We apologize for the delay. Your order is on its way and will arrive within 24 hours.',
    createdAt: '2026-02-11T10:00:00',
  },
];

const SEED_ADMIN: Admin = {
  id: 'admin1',
  username: 'admin',
  password: 'admin123',
  name: 'NEERIVA Admin',
  profilePicture: '',
};

// ── Context ────────────────────────────────────────────────────────────────

interface AppContextType {
  currentUser: User | null;
  currentAdmin: Admin | null;
  users: User[];
  orders: Order[];
  tickets: SupportTicket[];
  admin: Admin;

  register: (data: { title: string; name: string; emailOrMobile: string; password: string; address: string }) => { success: boolean; error?: string; user?: User };
  login: (emailOrMobile: string, password: string) => { success: boolean; error?: string; user?: User };
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;
  adminLogout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateAdminProfile: (data: Partial<Admin>) => void;
  placeOrder: (data: { bottleSize: Order['bottleSize']; quantity: number; designImage: string; deliveryName: string; deliveryPhone: string; deliveryAddress: string }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNote?: string) => void;
  cancelOrder: (orderId: string) => void;
  modifyOrder: (orderId: string, data: Partial<Order>) => void;
  raiseTicket: (data: { subject: string; message: string }) => void;
  replyToTicket: (ticketId: string, reply: string) => void;
  resolveTicket: (ticketId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

let orderCounter = 5;
let ticketCounter = 2;

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [tickets, setTickets] = useState<SupportTicket[]>(SEED_TICKETS);
  const [admin, setAdmin] = useState<Admin>(SEED_ADMIN);

  const register = (data: { title: string; name: string; emailOrMobile: string; password: string; address: string }) => {
    const exists = users.find(u => u.emailOrMobile === data.emailOrMobile);
    if (exists) return { success: false, error: 'This Mobile No / Email ID is already registered.' };

    const newUser: User = {
      id: `u${Date.now()}`,
      ...data,
      profilePicture: '',
      bio: '',
      isProfileSetup: false,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const login = (emailOrMobile: string, password: string) => {
    const user = users.find(u => u.emailOrMobile === emailOrMobile && u.password === password);
    if (!user) return { success: false, error: 'Invalid credentials. Please check your details.' };
    setCurrentUser(user);
    return { success: true, user };
  };

  const adminLogin = (username: string, password: string) => {
    if (username === admin.username && password === admin.password) {
      setCurrentAdmin(admin);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);
  const adminLogout = () => setCurrentAdmin(null);

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u));
    setCurrentUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const updateAdminProfile = (data: Partial<Admin>) => {
    setAdmin(prev => ({ ...prev, ...data }));
    setCurrentAdmin(prev => prev ? { ...prev, ...data } : prev);
  };

  const placeOrder = (data: { bottleSize: Order['bottleSize']; quantity: number; designImage: string; deliveryName: string; deliveryPhone: string; deliveryAddress: string }) => {
    if (!currentUser) throw new Error('Not logged in');
    const newOrder: Order = {
      id: `ORD-${String(orderCounter++).padStart(3, '0')}`,
      userId: currentUser.id,
      userName: currentUser.name,
      ...data,
      status: 'pending',
      totalPrice: BOTTLE_PRICES[data.bottleSize] * data.quantity,
      adminNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNote?: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status, adminNote: adminNote ?? o.adminNote, updatedAt: new Date().toISOString() } : o
    ));
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o
    ));
  };

  const modifyOrder = (orderId: string, data: Partial<Order>) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, ...data, updatedAt: new Date().toISOString() } : o
    ));
  };

  const raiseTicket = (data: { subject: string; message: string }) => {
    if (!currentUser) return;
    const ticket: SupportTicket = {
      id: `TKT-${String(ticketCounter++).padStart(3, '0')}`,
      userId: currentUser.id,
      userName: currentUser.name,
      ...data,
      status: 'open',
      reply: '',
      createdAt: new Date().toISOString(),
    };
    setTickets(prev => [ticket, ...prev]);
  };

  const replyToTicket = (ticketId: string, reply: string) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, reply, status: 'in-progress' as const } : t
    ));
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, status: 'resolved' as const } : t
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentAdmin, users, orders, tickets, admin,
      register, login, adminLogin, logout, adminLogout,
      updateProfile, updateAdminProfile,
      placeOrder, updateOrderStatus, cancelOrder, modifyOrder,
      raiseTicket, replyToTicket, resolveTicket,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
