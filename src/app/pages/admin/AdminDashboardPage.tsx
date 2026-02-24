import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart2, Users, Package, Clock, CheckCircle, XCircle, ChevronDown, MessageSquare, TrendingUp } from 'lucide-react';
import { useApp, Order, OrderStatus } from '../../store';
import { toast } from 'sonner';
import { useLocation } from 'react-router';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-amber-100 text-amber-700 border-amber-200',
  accepted:   'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  shipped:    'bg-cyan-100 text-cyan-700 border-cyan-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-gray-100 text-gray-500 border-gray-200',
  rejected:   'bg-red-100 text-red-600 border-red-200',
};

const STATUS_FLOW: OrderStatus[] = ['accepted', 'processing', 'shipped', 'delivered'];

export function AdminDashboardPage() {
  const { users, orders, tickets, updateOrderStatus, replyToTicket, resolveTicket } = useApp();
  const location = useLocation();

  // Derive active tab from URL path
  const pathTab = location.pathname.split('/').pop();
  const defaultTab = pathTab === 'orders' ? 'orders' : pathTab === 'users' ? 'users' : pathTab === 'tickets' ? 'tickets' : 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'tickets'>(defaultTab as any);

  useEffect(() => {
    const p = location.pathname.split('/').pop();
    if (p === 'orders') setActiveTab('orders');
    else if (p === 'users') setActiveTab('users');
    else if (p === 'tickets') setActiveTab('tickets');
    else setActiveTab('overview');
  }, [location.pathname]);

  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const TABS = [
    { key: 'overview', label: 'Overview', icon: BarChart2 },
    { key: 'orders',   label: 'Orders',   icon: Package, badge: pendingOrders.length },
    { key: 'users',    label: 'Users',    icon: Users },
    { key: 'tickets',  label: 'Tickets',  icon: MessageSquare, badge: tickets.filter(t => t.status === 'open').length },
  ] as const;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">Manage orders, users, and support tickets.</p>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {'badge' in tab && tab.badge > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: users.length, icon: Users, color: 'text-cyan-600 bg-cyan-50' },
                { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600 bg-blue-50' },
                { label: 'Pending Orders', value: pendingOrders.length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                { label: 'Revenue (Delivered)', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Pending Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">⏳ Pending Orders</h3>
              {pendingOrders.length === 0 ? (
                <p className="text-sm text-gray-400">No pending orders.</p>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{order.id} — {order.userName}</p>
                        <p className="text-xs text-gray-500">{order.bottleSize} × {order.quantity} · ₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { updateOrderStatus(order.id, 'accepted'); toast.success(`Order ${order.id} accepted.`); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition">
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button onClick={() => { updateOrderStatus(order.id, 'rejected'); toast.success(`Order ${order.id} rejected.`); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Orders ── */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    filterStatus === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Order ID', 'Customer', 'Bottle', 'Qty', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-mono text-indigo-600 font-semibold text-xs">{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800 font-medium">{order.userName}</p>
                          <p className="text-xs text-gray-400">{order.deliveryPhone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{order.bottleSize}</td>
                        <td className="px-4 py-3 text-gray-600">{order.quantity}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">₹{order.totalPrice.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3">
                          <AdminOrderActions order={order} noteMap={noteMap} setNoteMap={setNoteMap} updateOrderStatus={updateOrderStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">No orders found.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Users ── */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['User', 'Contact', 'Address', 'Orders', 'Joined'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const userOrders = orders.filter(o => o.userId === user.id);
                      const avatarLetter = user.name.charAt(0).toUpperCase();
                      return (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {user.profilePicture ? (
                                <img src={user.profilePicture} className="w-9 h-9 rounded-full object-cover" alt="" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                  {avatarLetter}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{user.title} {user.name}</p>
                                <p className="text-xs text-gray-400">{user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{user.emailOrMobile}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] truncate">{user.address || '—'}</td>
                          <td className="px-4 py-3">
                            <span className="text-indigo-600 font-semibold">{userOrders.length}</span>
                            <span className="text-gray-400 text-xs"> orders</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">No users registered.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Tickets ── */}
        {activeTab === 'tickets' && (
          <motion.div key="tickets" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {tickets.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No support tickets.</p>
              </div>
            )}
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{ticket.subject}</p>
                    <p className="text-xs text-gray-400">{ticket.id} · {ticket.userName} · {formatDate(ticket.createdAt)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${
                    ticket.status === 'open' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    ticket.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    'bg-green-50 text-green-600 border-green-200'
                  }`}>
                    {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 mb-3">{ticket.message}</p>
                {ticket.reply && (
                  <p className="text-sm text-indigo-700 bg-indigo-50 rounded-xl px-4 py-3 mb-3 border border-indigo-100">
                    <span className="font-medium">Your reply:</span> {ticket.reply}
                  </p>
                )}
                {ticket.status !== 'resolved' && (
                  <div className="flex gap-2 items-start">
                    <input
                      placeholder="Write a reply..."
                      value={replyMap[ticket.id] || ''}
                      onChange={e => setReplyMap(p => ({ ...p, [ticket.id]: e.target.value }))}
                      className="flex-1 h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={() => {
                        if (!replyMap[ticket.id]?.trim()) { toast.error('Enter a reply.'); return; }
                        replyToTicket(ticket.id, replyMap[ticket.id]);
                        setReplyMap(p => ({ ...p, [ticket.id]: '' }));
                        toast.success('Reply sent.');
                      }}
                      className="px-3 h-9 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition"
                    >Send</button>
                    <button
                      onClick={() => { resolveTicket(ticket.id); toast.success('Ticket resolved.'); }}
                      className="px-3 h-9 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition"
                    >Resolve</button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Inline sub-component for order actions ─────────────────────────────────
function AdminOrderActions({
  order, noteMap, setNoteMap, updateOrderStatus,
}: {
  order: Order;
  noteMap: Record<string, string>;
  setNoteMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const canProgress = ['accepted', 'processing', 'shipped'].includes(order.status);

  if (['delivered', 'cancelled', 'rejected'].includes(order.status)) {
    return <span className="text-xs text-gray-300">Finalised</span>;
  }

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      {order.status === 'pending' && (
        <div className="flex gap-1">
          <button onClick={() => { updateOrderStatus(order.id, 'accepted', noteMap[order.id]); toast.success(`${order.id} accepted.`); }}
            className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
            <CheckCircle className="w-3 h-3" /> Accept
          </button>
          <button onClick={() => { updateOrderStatus(order.id, 'rejected', noteMap[order.id]); toast.success(`${order.id} rejected.`); }}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600">
            <XCircle className="w-3 h-3" /> Reject
          </button>
        </div>
      )}
      {canProgress && (
        <div className="relative">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-1 px-2 py-1 border border-indigo-200 text-indigo-600 text-xs rounded-lg hover:bg-indigo-50 w-full">
            Update Status <ChevronDown className="w-3 h-3" />
          </button>
          {open && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 w-36 overflow-hidden">
              {(['accepted', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map(s => (
                <button key={s} onClick={() => {
                  updateOrderStatus(order.id, s, noteMap[order.id]);
                  toast.success(`Status → ${s}`);
                  setOpen(false);
                }}
                  className="block w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-indigo-50 capitalize">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <input
        placeholder="Add note…"
        value={noteMap[order.id] || ''}
        onChange={e => setNoteMap(p => ({ ...p, [order.id]: e.target.value }))}
        className="w-full h-7 px-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 mt-1"
        onKeyDown={e => {
          if (e.key === 'Enter' && noteMap[order.id]) {
            updateOrderStatus(order.id, order.status, noteMap[order.id]);
            toast.success('Note saved.');
          }
        }}
      />
    </div>
  );
}