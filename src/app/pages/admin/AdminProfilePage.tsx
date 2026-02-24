import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Lock, Eye, EyeOff, Save, Shield } from 'lucide-react';
import { useApp } from '../../store';
import { toast } from 'sonner';

export function AdminProfilePage() {
  const { currentAdmin, admin, updateAdminProfile } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(currentAdmin?.name || '');
  const [picture, setPicture] = useState(currentAdmin?.profilePicture || '');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const avatarLetter = (currentAdmin?.name || 'A').charAt(0).toUpperCase();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPicture(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Name cannot be empty.'); return; }
    updateAdminProfile({ name, profilePicture: picture });
    toast.success('Profile updated!');
  };

  const handleChangePassword = () => {
    if (oldPass !== admin.password) { toast.error('Current password is incorrect.'); return; }
    if (newPass.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords do not match.'); return; }
    updateAdminProfile({ password: newPass });
    toast.success('Password changed!');
    setOldPass(''); setNewPass(''); setConfirmPass('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-gray-700">Profile Information</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {picture ? (
                <img src={picture} className="w-24 h-24 rounded-2xl object-cover border-4 border-indigo-100" alt="avatar" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {avatarLetter}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:text-indigo-700">Change photo</button>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
              <div className="h-10 px-3 border border-gray-100 rounded-xl text-sm text-gray-400 flex items-center bg-gray-50">
                {currentAdmin?.username}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow"
            >
              <Save className="w-4 h-4" /> Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-indigo-500" /> Change Password
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
                <input type={showPass ? 'text' : 'password'} value={f.value} onChange={e => f.setter(e.target.value)}
                  className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleChangePassword} className="px-5 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold shadow">
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
