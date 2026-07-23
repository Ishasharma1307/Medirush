import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Camera, Edit2, Check, X, ShieldCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const Profile = () => {
  // 1. Get logged-in user from AuthContext
  const { user } = useAuth();
  
  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Editable form state
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  // Fetch profile when component mounts
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // 2. Fetch user profile from public.users table
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || ''
      });
    } catch (err) {
      setError('Could not load profile data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Update name and phone
  const handleUpdate = async () => {
    try {
      setError(null);
      setSuccessMsg('');
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state so UI reflects changes instantly
      setProfile({ ...profile, name: formData.name, phone: formData.phone });
      setIsEditing(false);
      
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    }
  };

  // 4. Avatar Upload Logic
  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      setError(null);
      setSuccessMsg('');
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Generate a unique filename using user ID and random number
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 4a. Upload to Supabase Storage Bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4b. Get the Public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // 4c. Update users table with the new avatar_url
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccessMsg('Avatar updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      setError('Error uploading avatar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center shadow-floating animate-pulseSoft">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 shadow-inner"></div>
          <p className="text-primary font-bold tracking-widest text-xs uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card bg-danger/10 text-danger border-danger/20 p-8 rounded-3xl max-w-md text-center shadow-floating">
          <div className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <X size={32} className="text-danger" />
          </div>
          <p className="font-bold mb-6">{error}</p>
          <Button variant="primary" className="w-full shadow-lg shadow-danger/20 bg-danger hover:bg-danger/90" onClick={fetchProfile}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-3xl text-center shadow-floating max-w-md w-full border-white/60">
          <p className="text-gray-500 font-bold uppercase tracking-widest">No profile data found.</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gray-50 pointer-events-none -z-10"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 mb-8 drop-shadow-sm">My Profile</motion.h1>
        
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="mb-6 p-4 bg-secondary/10 border-l-4 border-secondary text-secondary font-bold rounded-r-xl transition-all shadow-sm flex items-center"
            >
              <div className="bg-white/80 p-1 rounded-full mr-3 shadow-inner">
                 <Check size={16} />
              </div>
              {successMsg}
            </motion.div>
          )}
          
          {error && profile && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="mb-6 p-4 bg-danger/10 border-l-4 border-danger text-danger font-bold rounded-r-xl transition-all shadow-sm flex items-center"
            >
               <div className="bg-white/80 p-1 rounded-full mr-3 shadow-inner">
                 <X size={16} />
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="glass-card shadow-floating border-white/60 overflow-hidden rounded-[2.5rem]">
          {/* Profile Header & Avatar */}
          <div className="bg-gradient-to-r from-primary to-blue-700 px-8 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPHBhdGggZD0iTTAgMjBMMjAgMEMxMCAwIDAgMTAgMCAyMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] bg-repeat"></div>
            
            <div className="relative inline-block z-10">
              {profile.avatar_url ? (
                <div className="relative p-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                  />
                </div>
              ) : (
                <div className="relative p-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-primary text-4xl font-extrabold uppercase shadow-inner">
                    {profile.name?.charAt(0)}
                  </div>
                </div>
              )}
              
              <label 
                htmlFor="avatar-upload" 
                className={cn(
                  "absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100",
                  uploading ? "opacity-50 cursor-wait" : "hover:scale-110 active:scale-95"
                )}
                title="Upload new avatar"
              >
                <Camera size={18} className="text-primary" />
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={uploadAvatar} 
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mt-5 drop-shadow-md relative z-10">{profile.name}</h2>
            <p className="text-blue-100 uppercase tracking-widest font-bold text-[11px] mt-2 relative z-10 bg-white/20 px-3 py-1 rounded-full inline-block backdrop-blur-sm border border-white/30">{profile.role}</p>
            
            {profile.verified && (
              <div className="flex items-center justify-center mt-4 text-green-400 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mx-auto inline-flex border border-white/20 shadow-sm relative z-10">
                <ShieldCheck size={16} className="mr-2" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Verified Account</span>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-8 md:p-10 bg-white/40 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200/50 pb-5 gap-4">
              <h3 className="text-2xl font-extrabold text-gray-900 drop-shadow-sm">Personal Information</h3>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="glass"
                  className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 rounded-xl"
                >
                  <Edit2 size={16} className="mr-2" /> Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-3 w-full sm:w-auto">
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="ghost"
                    className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-600 rounded-xl"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdate}
                    variant="primary"
                    className="flex-1 sm:flex-none bg-secondary hover:bg-green-700 rounded-xl shadow-lg shadow-secondary/30"
                  >
                    <Check size={16} className="mr-1" /> Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-white/60 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none transition-all font-bold text-gray-900"
                  />
                ) : (
                  <div className="bg-white/60 backdrop-blur-sm border border-white/50 px-4 py-3.5 rounded-xl shadow-sm">
                    <p className="text-lg text-gray-900 font-extrabold">{profile.name}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-1">Email Address</label>
                <div className="bg-gray-100/50 backdrop-blur-sm border border-gray-200/50 px-4 py-3.5 rounded-xl shadow-inner">
                  <p className="text-lg text-gray-500 font-bold">{profile.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-white/60 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none transition-all font-bold text-gray-900"
                  />
                ) : (
                  <div className="bg-white/60 backdrop-blur-sm border border-white/50 px-4 py-3.5 rounded-xl shadow-sm">
                    <p className={cn("text-lg font-extrabold", profile.phone ? "text-gray-900" : "text-gray-400 italic")}>
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-1">Member Since</label>
                <div className="bg-white/60 backdrop-blur-sm border border-white/50 px-4 py-3.5 rounded-xl shadow-sm">
                   <p className="text-lg text-gray-900 font-extrabold">{joinDate}</p>
                </div>
              </div>
              
              {/* Read-Only Rating Section */}
              <div className="md:col-span-2 mt-2 p-6 bg-yellow-500/10 backdrop-blur-md rounded-2xl border border-yellow-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-yellow-800 mb-1.5 uppercase tracking-widest flex items-center">
                    <Star size={14} className="mr-1" /> User Rating
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className="text-yellow-500 fill-current mr-1 drop-shadow-sm" />
                    ))}
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white/60 shadow-inner">
                  <span className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">5.0</span>
                </div>
              </div>

              {/* Quick Actions Links */}
              <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 flex gap-4 flex-wrap">
                 <Button 
                    onClick={() => window.location.href = '/orders'}
                    variant="primary" 
                    className="flex-1 py-4 flex items-center justify-center gap-2 font-bold shadow-md hover:-translate-y-1 transition-all"
                  >
                    View My Orders
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 py-4 flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-all"
                  >
                    Account Settings
                  </Button>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
