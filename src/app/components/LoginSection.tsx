import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Lock, LogIn, UserPlus, Eye, EyeOff, MapPin, User,
  ChevronDown, ArrowLeft, KeyRound, CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useApp } from '../store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Mode = 'login' | 'signup' | 'forgot';
const TITLE_OPTIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Eng.', 'Other'];

export function LoginSection() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');

  // Login state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Signup state
  const [signup, setSignup] = useState({ title: '', name: '', emailOrMobile: '', password: '', confirmPassword: '', address: '' });
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [titleOpen, setTitleOpen] = useState(false);

  // Forgot state
  const [forgotId, setForgotId] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const inputCls = 'pl-12 h-12 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPass.trim()) { toast.error('Please fill in all fields.'); return; }
    const result = login(loginId, loginPass);
    if (result.success && result.user) {
      toast.success(`Welcome back, ${result.user.name}! 🌊`);
      if (!result.user.isProfileSetup) {
        navigate('/app/profile/setup');
      } else {
        navigate('/app/dashboard');
      }
    } else {
      toast.error(result.error || 'Login failed.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signup.title) { toast.error('Please select your title.'); return; }
    if (!signup.name.trim()) { toast.error('Please enter your full name.'); return; }
    if (!signup.emailOrMobile.trim()) { toast.error('Please enter your Mobile No or Email ID.'); return; }
    if (signup.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (signup.password !== signup.confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (!signup.address.trim()) { toast.error('Please enter your address.'); return; }

    const result = register(signup);
    if (result.success && result.user) {
      toast.success(`Welcome to NEERIVA, ${signup.title} ${signup.name}! 🎉`);
      navigate('/app/profile/setup');
    } else {
      toast.error(result.error || 'Registration failed.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotId.trim()) { toast.error('Please enter your registered Mobile No or Email ID.'); return; }
    setForgotSent(true);
    toast.success('Password reset link sent! Check your email/SMS.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 -z-10" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-72 h-72 bg-cyan-300 rounded-full blur-3xl -z-10" />
      <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl -z-10" />

      <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-cyan-100"
            >
              <div className="text-center mb-8">
                <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-block p-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mb-4"
                >
                  <LogIn className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Login to access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="login-id" className="text-gray-700 mb-2 block">Mobile No / Email ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="login-id" type="text" placeholder="Enter mobile number or email" value={loginId} onChange={e => setLoginId(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="login-pass" className="text-gray-700 mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="login-pass" type={showLoginPass ? 'text' : 'password'} placeholder="Enter your password" value={loginPass} onChange={e => setLoginPass(e.target.value)} className={inputCls + ' pr-12'} />
                    <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-600">
                      {showLoginPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 text-cyan-600 rounded cursor-pointer" />
                    Remember me
                  </label>
                  <button type="button" onClick={() => { setMode('forgot'); setForgotSent(false); setForgotId(''); }} className="text-cyan-600 hover:text-cyan-700 font-medium">
                    Forgot Password?
                  </button>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all">
                    Login
                  </Button>
                </motion.div>
                <p className="text-center text-sm text-gray-500">Demo: <span className="font-mono text-cyan-600">ravi@example.com / demo123</span></p>
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setMode('signup')} className="text-cyan-600 hover:text-cyan-700 font-semibold underline underline-offset-2">Sign up</button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── SIGN UP ── */}
          {mode === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-cyan-100"
            >
              <div className="text-center mb-6">
                <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-block p-4 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full mb-4"
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Create Account</h2>
                <p className="text-gray-600 mt-1">Join NEERIVA — it's free!</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Title */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Title</Label>
                  <div className="relative">
                    <button type="button" onClick={() => setTitleOpen(!titleOpen)}
                      className="w-full h-12 pl-4 pr-10 text-left border border-cyan-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                    >
                      {signup.title || <span className="text-gray-400">Select title</span>}
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </button>
                    <AnimatePresence>
                      {titleOpen && (
                        <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          className="absolute z-20 w-full mt-1 bg-white border border-cyan-100 rounded-xl shadow-lg overflow-hidden"
                        >
                          {TITLE_OPTIONS.map(t => (
                            <li key={t}>
                              <button type="button" onClick={() => { setSignup({ ...signup, title: t }); setTitleOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-cyan-50 text-gray-700 text-sm ${signup.title === t ? 'bg-cyan-50 text-cyan-700 font-medium' : ''}`}
                              >{t}</button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="signup-name" className="text-gray-700 mb-2 block">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="signup-name" type="text" placeholder="Enter your full name" value={signup.name} onChange={e => setSignup({ ...signup, name: e.target.value })} className={inputCls} />
                  </div>
                </div>

                {/* Mobile / Email */}
                <div>
                  <Label htmlFor="signup-id" className="text-gray-700 mb-2 block">Mobile No / Email ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="signup-id" type="text" placeholder="Mobile number or email" value={signup.emailOrMobile} onChange={e => setSignup({ ...signup, emailOrMobile: e.target.value })} className={inputCls} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="signup-pass" className="text-gray-700 mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="signup-pass" type={showSignupPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={signup.password} onChange={e => setSignup({ ...signup, password: e.target.value })} className={inputCls + ' pr-12'} />
                    <button type="button" onClick={() => setShowSignupPass(!showSignupPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showSignupPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="signup-confirm" className="text-gray-700 mb-2 block">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="signup-confirm" type={showConfirmPass ? 'text' : 'password'} placeholder="Re-enter password" value={signup.confirmPassword} onChange={e => setSignup({ ...signup, confirmPassword: e.target.value })} className={inputCls + ' pr-12'} />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="signup-address" className="text-gray-700 mb-2 block">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <textarea id="signup-address" placeholder="Enter your full address" value={signup.address} onChange={e => setSignup({ ...signup, address: e.target.value })} rows={3}
                      className="w-full pl-12 pr-4 py-3 border border-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none text-sm text-gray-700 placeholder-gray-400 bg-white transition"
                    />
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all">
                    <UserPlus className="w-5 h-5 mr-2" /> Create Account
                  </Button>
                </motion.div>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setMode('login')} className="text-cyan-600 font-semibold underline underline-offset-2">Login</button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-cyan-100"
            >
              <button type="button" onClick={() => setMode('login')} className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 font-medium mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mb-4">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Forgot Password?</h2>
                <p className="text-gray-600 mt-2 text-sm">Enter your registered Mobile No or Email ID.</p>
              </div>
              {!forgotSent ? (
                <form onSubmit={handleForgot} className="space-y-5">
                  <div>
                    <Label htmlFor="forgot-id" className="text-gray-700 mb-2 block">Mobile No / Email ID</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input id="forgot-id" type="text" placeholder="Registered mobile or email" value={forgotId} onChange={e => setForgotId(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg transition-all">
                      Send Reset Link
                    </Button>
                  </motion.div>
                </form>
              ) : (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium text-lg">Reset link sent!</p>
                  <p className="text-gray-500 mt-1 text-sm">Check your email or SMS for instructions.</p>
                  <button type="button" onClick={() => { setMode('login'); setForgotSent(false); setForgotId(''); }}
                    className="mt-6 text-cyan-600 hover:text-cyan-700 font-semibold underline underline-offset-2 text-sm"
                  >Return to Login</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <button type="button" onClick={() => toast.info('Terms of Service — coming soon!')} className="underline hover:text-cyan-600">Terms of Service</button>{' '}
          and{' '}
          <button type="button" onClick={() => toast.info('Privacy Policy — coming soon!')} className="underline hover:text-cyan-600">Privacy Policy</button>
        </p>
      </motion.div>
    </div>
  );
}
