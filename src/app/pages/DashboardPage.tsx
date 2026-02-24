import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ShoppingCart, Truck, UserCircle, HeadphonesIcon, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp, OrderStatus } from '../store';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-amber-100 text-amber-700',
  accepted:   'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped:    'bg-cyan-100 text-cyan-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-gray-100 text-gray-500',
  rejected:   'bg-red-100 text-red-600',
};

export function DashboardPage() {
  const { currentUser, orders } = useApp();
  const navigate = useNavigate();

  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const totalOrders = myOrders.length;
  const activeOrders = myOrders.filter(o => !['delivered','cancelled','rejected'].includes(o.status)).length;
  const deliveredOrders = myOrders.filter(o => o.status === 'delivered').length;
  const pendingOrders = myOrders.filter(o => o.status === 'pending').length;

  const recentOrders = myOrders.slice(0, 4);

  const quickActions = [
    { label: 'Place New Order', icon: ShoppingCart, color: 'from-cyan-500 to-blue-600', to: '/app/orders/place' },
    { label: 'Track Orders', icon: Truck, color: 'from-teal-500 to-cyan-600', to: '/app/orders/track' },
    { label: 'Edit Profile', icon: UserCircle, color: 'from-blue-500 to-indigo-600', to: '/app/profile' },
    { label: 'Get Support', icon: HeadphonesIcon, color: 'from-purple-500 to-pink-600', to: '/app/support' },
  ];

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Active Orders', value: activeOrders, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Delivered', value: deliveredOrders, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Pending', value: pendingOrders, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
  ];

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="relative z-10">
          <p className="text-cyan-100 text-sm mb-1">Good to see you,</p>
          <h1 className="text-2xl font-bold">{currentUser?.title} {currentUser?.name} 👋</h1>
          <p className="text-cyan-100 mt-1 text-sm">Manage your custom water bottle orders all in one place.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app/orders/place')}
            className="mt-4 px-5 py-2 bg-white text-cyan-600 font-semibold rounded-full text-sm shadow hover:shadow-md transition"
          >
            + Place New Order
          </motion.button>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-4 -bottom-12 w-56 h-56 bg-white/5 rounded-full" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.to)}
              className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-5 text-left shadow-md hover:shadow-lg transition-all`}
            >
              <action.icon className="w-6 h-6 mb-3 opacity-90" />
              <p className="text-sm font-semibold leading-tight">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button onClick={() => navigate('/app/orders/track')} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
            View all →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <button
              onClick={() => navigate('/app/orders/place')}
              className="mt-4 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-medium shadow"
            >
              Place your first order
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Order ID</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Bottle</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Qty</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate('/app/orders/track')}
                    >
                      <td className="px-5 py-3 font-mono text-cyan-700 font-semibold">{order.id}</td>
                      <td className="px-5 py-3 text-gray-700">{order.bottleSize}</td>
                      <td className="px-5 py-3 text-gray-700">{order.quantity}</td>
                      <td className="px-5 py-3 font-semibold text-gray-800">₹{order.totalPrice.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
