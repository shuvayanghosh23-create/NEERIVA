import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, User, MapPin, FileText, Lock, LogOut, HeadphonesIcon, Eye, EyeOff, Save, ChevronRight } from 'lucide-react';
import { useApp } from '../store';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function ProfilePage() {
  const { currentUser, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [picture, setPicture] = useState(currentUser?.profilePicture || '');

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const avatarLetter = (currentUser?.name || 'U').charAt(0).toUpperCase();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPicture(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!name.trim()) { toast.error('Name cannot be empty.'); return; }
    updateProfile({ name, bio, address, profilePicture: picture });
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (oldPass !== currentUser?.password) { toast.error('Current password is incorrect.'); return; }
    if (newPass.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords do not match.'); return; }
    updateProfile({ password: newPass });
    toast.success('Password changed successfully!');
    setOldPass(''); setNewPass(''); setConfirmPass('');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-6">Personal Information</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {picture ? (
                <img src={picture} className="w-24 h-24 rounded-2xl object-cover border-4 border-cyan-100" alt="avatar" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-cyan-100">
                  {avatarLetter}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="text-xs text-cyan-600 hover:text-cyan-700">Change photo</button>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4 w-full">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <div className="h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center bg-gray-50">
                  {currentUser?.title}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mobile / Email</label>
              <div className="h-10 px-3 border border-gray-100 rounded-lg text-sm text-gray-400 flex items-center bg-gray-50">
                {currentUser?.emailOrMobile}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                <FileText className="w-3 h-3 inline mr-1" />Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                <MapPin className="w-3 h-3 inline mr-1" />Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-500" />
          Change Password
        </h2>
        <div className="space-y-3 max-w-sm">
          {[
            { label: 'Current Password', value: oldPass, setter: setOldPass },
            { label: 'New Password', value: newPass, setter: setNewPass },
            { label: 'Confirm New Password', value: confirmPass, setter: setConfirmPass },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleChangePassword}
            className="px-5 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold shadow mt-1"
          >
            Update Password
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { label: 'Contact Customer Support', icon: HeadphonesIcon, color: 'text-purple-500', action: () => navigate('/app/support') },
          { label: 'Logout', icon: LogOut, color: 'text-red-500', action: handleLogout },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex items-center justify-between w-full px-6 py-4 border-b last:border-0 border-gray-50 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </motion.div>
    </div>
  );
}
