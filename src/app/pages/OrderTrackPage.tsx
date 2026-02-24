import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Package, ChevronDown, ChevronUp, Pencil, X, Check, Clock, Truck, Box, AlertCircle, XCircle } from 'lucide-react';
import { useApp, Order, OrderStatus, BOTTLE_PRICES } from '../store';
import { toast } from 'sonner';

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; step: number }> = {
  pending:    { label: 'Pending',    color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', step: 0 },
  accepted:   { label: 'Accepted',  color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200',   step: 1 },
  processing: { label: 'Processing',color: 'text-indigo-600',bg: 'bg-indigo-50 border-indigo-200',step: 2 },
  shipped:    { label: 'Shipped',   color: 'text-cyan-600',  bg: 'bg-cyan-50 border-cyan-200',    step: 3 },
  delivered:  { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50 border-green-200',  step: 4 },
  cancelled:  { label: 'Cancelled', color: 'text-gray-500',  bg: 'bg-gray-50 border-gray-200',    step: -1 },
  rejected:   { label: 'Rejected',  color: 'text-red-600',   bg: 'bg-red-50 border-red-200',      step: -1 },
};

const TIMELINE = [
  { label: 'Order Placed', icon: Package, description: 'Your order has been received.' },
  { label: 'Accepted',     icon: Check,   description: 'Admin reviewed and accepted your order.' },
  { label: 'Processing',   icon: Box,     description: 'Your bottles are being printed and packed.' },
  { label: 'Shipped',      icon: Truck,   description: 'Your order is on the way!' },
  { label: 'Delivered',    icon: Check,   description: 'Order delivered successfully.' },
];

export function OrderTrackPage() {
  const { currentUser, orders, cancelOrder, modifyOrder } = useApp();
  const navigate = useNavigate();

  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const [expandedId, setExpandedId] = useState<string | null>(myOrders[0]?.id || null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [editAddr, setEditAddr] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditQty(order.quantity);
    setEditAddr(order.deliveryAddress);
    setEditPhone(order.deliveryPhone);
  };

  const saveEdit = (order: Order) => {
    if (editQty < 1) { toast.error('Quantity must be at least 1.'); return; }
    if (!editAddr.trim()) { toast.error('Enter delivery address.'); return; }
    modifyOrder(order.id, {
      quantity: editQty,
      totalPrice: BOTTLE_PRICES[order.bottleSize] * editQty,
      deliveryAddress: editAddr,
      deliveryPhone: editPhone,
    });
    toast.success('Order updated!');
    setEditingId(null);
  };

  const handleCancel = (orderId: string) => {
    cancelOrder(orderId);
    toast.success('Order cancelled.');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/app/orders/place')}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow"
        >
          + New Order
        </motion.button>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet.</p>
          <button onClick={() => navigate('/app/orders/place')} className="mt-4 text-cyan-600 text-sm font-medium hover:underline">Place your first order</button>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => {
            const meta = STATUS_META[order.status];
            const isExpanded = expandedId === order.id;
            const isEditing = editingId === order.id;
            const canModify = order.status === 'pending';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.bottleSize} × {order.quantity} · {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${meta.bg} ${meta.color}`}>{meta.label}</span>
                    <span className="font-bold text-gray-700 text-sm">₹{order.totalPrice.toLocaleString()}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-50 space-y-5">
                        {/* Status Timeline */}
                        {!['cancelled', 'rejected'].includes(order.status) && (
                          <div className="pt-4">
                            <p className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wide">Order Progress</p>
                            <div className="relative">
                              {TIMELINE.map((step, idx) => {
                                const stepDone = meta.step >= idx;
                                const isCurrent = meta.step === idx;
                                return (
                                  <div key={step.label} className="flex gap-4 mb-4 last:mb-0">
                                    <div className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                        stepDone ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-transparent' : 'bg-white border-gray-200'
                                      }`}>
                                        <step.icon className={`w-4 h-4 ${stepDone ? 'text-white' : 'text-gray-300'}`} />
                                      </div>
                                      {idx < TIMELINE.length - 1 && (
                                        <div className={`w-0.5 h-6 my-0.5 ${stepDone ? 'bg-gradient-to-b from-cyan-400 to-blue-400' : 'bg-gray-100'}`} />
                                      )}
                                    </div>
                                    <div className="pt-1">
                                      <p className={`text-sm font-medium ${stepDone ? 'text-gray-800' : 'text-gray-300'}`}>{step.label}</p>
                                      {isCurrent && <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {order.status === 'cancelled' && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                            <XCircle className="w-4 h-4 text-red-400" /> Order was cancelled.
                          </div>
                        )}
                        {order.status === 'rejected' && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                            <AlertCircle className="w-4 h-4" /> Order was rejected. {order.adminNote && `Note: ${order.adminNote}`}
                          </div>
                        )}

                        {/* Admin Note */}
                        {order.adminNote && !['cancelled','rejected'].includes(order.status) && (
                          <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                            <p className="text-xs font-medium text-blue-600 mb-1">📝 Note from NEERIVA</p>
                            <p className="text-sm text-blue-700">{order.adminNote}</p>
                          </div>
                        )}

                        {/* Delivery Info / Edit Form */}
                        {isEditing ? (
                          <div className="space-y-3 bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                            <p className="text-xs font-medium text-cyan-700">Edit Order</p>
                            <div>
                              <label className="text-xs text-gray-500">Quantity</label>
                              <input type="number" min={1} value={editQty} onChange={e => setEditQty(parseInt(e.target.value) || 1)}
                                className="w-full mt-1 px-3 h-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Phone</label>
                              <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                                className="w-full mt-1 px-3 h-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Delivery Address</label>
                              <textarea rows={2} value={editAddr} onChange={e => setEditAddr(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(order)} className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-lg shadow">
                                <Check className="w-3 h-3" /> Save
                              </button>
                              <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-200 text-gray-500 text-xs rounded-lg">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm space-y-1 text-gray-500">
                            <p>📦 <span className="font-medium text-gray-700">{order.bottleSize}</span> × {order.quantity} bottles</p>
                            <p>📍 {order.deliveryAddress}</p>
                            <p>📞 {order.deliveryPhone}</p>
                          </div>
                        )}

                        {/* Actions */}
                        {canModify && !isEditing && (
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => startEdit(order)}
                              className="flex items-center gap-1.5 px-4 py-2 border border-cyan-200 text-cyan-600 text-xs font-medium rounded-xl hover:bg-cyan-50 transition">
                              <Pencil className="w-3.5 h-3.5" /> Modify Order
                            </button>
                            <button onClick={() => handleCancel(order.id)}
                              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-xs font-medium rounded-xl hover:bg-red-50 transition">
                              <X className="w-3.5 h-3.5" /> Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
