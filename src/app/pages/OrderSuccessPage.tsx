import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { CheckCircle, Truck, LayoutDashboard, Package } from 'lucide-react';
import { useApp } from '../store';

export function OrderSuccessPage() {
  const { orders } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = (location.state as { orderId?: string })?.orderId;
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (!orderId) navigate('/app/dashboard', { replace: true });
  }, [orderId, navigate]);

  if (!order) return null;

  const formatDate = (d: string) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className="w-full max-w-md"
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl"
              />
              <CheckCircle className="w-24 h-24 text-green-500 relative" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Order Placed! 🎉</h1>
            <p className="text-gray-500 mt-2">Your custom water bottle order has been received.</p>
          </motion.div>
        </div>

        {/* Order Details */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-mono font-bold text-cyan-700">{order.id}</span>
          </div>

          <div className="space-y-3">
            {[
              ['Bottle Size', order.bottleSize],
              ['Quantity', `${order.quantity} bottles`],
              ['Delivery To', order.deliveryName],
              ['Address', order.deliveryAddress],
              ['Status', 'Pending Review'],
              ['Placed On', formatDate(order.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start gap-4">
                <span className="text-xs text-gray-400">{k}</span>
                <span className={`text-xs font-medium text-right ${k === 'Status' ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full' : 'text-gray-700'}`}>{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-gray-800">₹{order.totalPrice.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-cyan-50 rounded-xl p-4 flex items-start gap-3 mb-6 border border-cyan-100"
        >
          <Truck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
          <p className="text-xs text-cyan-700">
            Our team will review your order shortly. You'll be notified once it's accepted and processing begins.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3"
        >
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app/orders/track')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow"
          >
            <Package className="w-4 h-4" /> Track Order
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
