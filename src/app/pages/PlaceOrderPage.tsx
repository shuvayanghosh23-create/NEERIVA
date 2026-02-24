import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Upload, Minus, Plus, ChevronRight, ChevronLeft, CheckCircle, ImageIcon, MapPin, Phone, User } from 'lucide-react';
import { useApp, BOTTLE_PRICES, Order } from '../store';
import { toast } from 'sonner';

const BOTTLE_SIZES: { size: Order['bottleSize']; label: string; ml: string; desc: string }[] = [
  { size: '1L', label: '1 Liter', ml: '1000 ml', desc: 'Perfect for events & offices' },
  { size: '500ml', label: '500 ml', ml: '500 ml', desc: 'Ideal for gyms & travel' },
  { size: '250ml', label: '250 ml', ml: '250 ml', desc: 'Great for meetings & gifts' },
];

const STEPS = ['Design & Bottle', 'Delivery Details', 'Review & Confirm'];

export function PlaceOrderPage() {
  const { currentUser, placeOrder } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [bottleSize, setBottleSize] = useState<Order['bottleSize']>('500ml');
  const [quantity, setQuantity] = useState(10);
  const [designImage, setDesignImage] = useState('');

  const [deliveryName, setDeliveryName] = useState(currentUser?.name || '');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');

  const unitPrice = BOTTLE_PRICES[bottleSize];
  const totalPrice = unitPrice * quantity;

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setDesignImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validateStep = () => {
    if (step === 0) {
      if (quantity < 1) { toast.error('Quantity must be at least 1.'); return false; }
      return true;
    }
    if (step === 1) {
      if (!deliveryName.trim()) { toast.error('Enter delivery name.'); return false; }
      if (!deliveryPhone.trim() || deliveryPhone.length < 10) { toast.error('Enter a valid phone number.'); return false; }
      if (!deliveryAddress.trim()) { toast.error('Enter delivery address.'); return false; }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 2));
  };

  const handleConfirm = () => {
    const order = placeOrder({ bottleSize, quantity, designImage, deliveryName, deliveryPhone, deliveryAddress });
    navigate('/app/orders/success', { state: { orderId: order.id } });
  };

  const BottleIcon = ({ size }: { size: Order['bottleSize'] }) => {
    const heights: Record<Order['bottleSize'], string> = { '1L': 'h-16', '500ml': 'h-12', '250ml': 'h-8' };
    return (
      <div className="flex items-end justify-center h-16">
        <div className={`w-8 ${heights[size]} bg-gradient-to-b from-cyan-300 to-blue-400 rounded-t-lg rounded-b-md relative`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-4 h-2 bg-gray-300 rounded-t" />
          <div className="absolute inset-2 bg-white/30 rounded" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Place New Order</h1>
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-1 rounded transition-all ${i < step ? 'bg-green-400' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-xs ${i === step ? 'text-cyan-600 font-medium' : 'text-gray-400'}`}>{s}</span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Design & Bottle */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Choose Bottle Size</h2>
              <div className="grid grid-cols-3 gap-3">
                {BOTTLE_SIZES.map(b => (
                  <button
                    key={b.size}
                    onClick={() => setBottleSize(b.size)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      bottleSize === b.size ? 'border-cyan-400 bg-cyan-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <BottleIcon size={b.size} />
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${bottleSize === b.size ? 'text-cyan-700' : 'text-gray-700'}`}>{b.label}</p>
                      <p className="text-xs text-gray-400">{b.desc}</p>
                      <p className={`text-sm font-bold mt-1 ${bottleSize === b.size ? 'text-cyan-600' : 'text-gray-600'}`}>
                        ₹{BOTTLE_PRICES[b.size]}/bottle
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Quantity</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-2xl font-bold text-gray-800 border-b-2 border-cyan-400 focus:outline-none bg-transparent"
                />
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center hover:bg-cyan-200 transition"
                >
                  <Plus className="w-4 h-4 text-cyan-600" />
                </button>
                <span className="text-sm text-gray-500">bottles</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">Total: <span className="font-bold text-gray-800">₹{totalPrice.toLocaleString()}</span></p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Upload Your Design <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleDesignUpload} className="hidden" />
              {designImage ? (
                <div className="flex items-center gap-4">
                  <img src={designImage} className="w-20 h-20 rounded-xl object-cover border border-cyan-200" alt="Design" />
                  <div>
                    <p className="text-sm font-medium text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Design uploaded</p>
                    <button onClick={() => fileRef.current?.click()} className="text-xs text-cyan-600 mt-1 hover:underline">Change design</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-cyan-300 hover:bg-cyan-50 transition"
                >
                  <Upload className="w-6 h-6 text-gray-300" />
                  <p className="text-sm text-gray-400">Click to upload your bottle design</p>
                  <p className="text-xs text-gray-300">PNG, JPG up to 10MB</p>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 1: Delivery Details */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <h2 className="font-semibold text-gray-700">Delivery Information</h2>
              {[
                { label: 'Recipient Name', icon: User, value: deliveryName, setter: setDeliveryName, placeholder: 'Full name', type: 'text' },
                { label: 'Phone Number', icon: Phone, value: deliveryPhone, setter: setDeliveryPhone, placeholder: '10-digit mobile number', type: 'tel' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={f.type}
                      value={f.value}
                      onChange={e => f.setter(e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full pl-10 pr-4 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3}
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="Full delivery address"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-5">Order Summary</h2>
              <div className="space-y-3">
                {[
                  ['Bottle Size', BOTTLE_SIZES.find(b => b.size === bottleSize)?.label || bottleSize],
                  ['Quantity', `${quantity} bottles`],
                  ['Unit Price', `₹${unitPrice}`],
                  ['Custom Design', designImage ? '✅ Design uploaded' : 'No design (plain)'],
                  ['Delivery To', deliveryName],
                  ['Phone', deliveryPhone],
                  ['Address', deliveryAddress],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start gap-4 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500 shrink-0">{k}</span>
                    <span className="text-sm text-gray-800 font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold text-gray-800">₹{totalPrice.toLocaleString()}</p>
              </div>
              {designImage && <img src={designImage} className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-200" alt="design preview" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={step < 2 ? handleNext : handleConfirm}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
        >
          {step < 2 ? (
            <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
          ) : (
            <><CheckCircle className="w-5 h-5" /><span>Confirm Order</span></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
