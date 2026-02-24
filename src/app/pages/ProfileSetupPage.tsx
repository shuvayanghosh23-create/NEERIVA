import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { Camera, User, MapPin, FileText, Droplets, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../store';
import { toast } from 'sonner';

export function ProfileSetupPage() {
  const { currentUser, updateProfile } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [picture, setPicture] = useState(currentUser?.profilePicture || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.isProfileSetup) return <Navigate to="/app/dashboard" replace />;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPicture(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    updateProfile({ profilePicture: picture, bio, address, isProfileSetup: true });
    toast.success('Profile setup complete! Welcome to NEERIVA 🎉');
    navigate('/app/dashboard');
  };

  const handleSkip = () => {
    updateProfile({ isProfileSetup: true });
    toast.info('You can complete your profile anytime.');
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block p-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mb-4"
          >
            <Droplets className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser.name}! 👋</h1>
          <p className="text-gray-500 mt-2">Let's set up your profile to get started</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-cyan-100">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(step => (
              <div key={step} className={`h-1.5 flex-1 rounded-full ${step === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gray-100'}`} />
            ))}
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {picture ? (
                  <img src={picture} className="w-24 h-24 rounded-full object-cover border-4 border-cyan-200" alt="Profile" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center border-4 border-cyan-200">
                    <User className="w-10 h-10 text-cyan-400" />
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                Upload profile picture
              </button>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Bio / Description
              </label>
              <textarea
                rows={3}
                placeholder="Tell us a bit about yourself…"
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm resize-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Delivery Address
              </label>
              <textarea
                rows={2}
                placeholder="Your full delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm resize-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 transition"
              >
                Skip for now
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Setup
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
