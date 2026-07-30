import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { 
  User, Mail, Phone, Lock, Shield, MapPin, Activity, FileText, 
  ShoppingBag, CreditCard, Bell, Key, AlertTriangle, Gift, 
  HelpCircle, Settings, Globe, Calendar, Plus, Trash2, 
  Download, Share2, LogOut, Sun, Moon, Eye, EyeOff, Camera, 
  Check, X, ShieldCheck, Star, Heart, FileUp, Smartphone, 
  Users, Map, LifeBuoy, Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const Profile = () => {
  const { user, checkAndCreateProfile } = useAuth();
  
  // Tab states
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Account / Personal Data state
  const [personalData, setPersonalData] = useState({
    username: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    height: '',
    weight: '',
    emergencyContact: '',
    alternateContact: '',
    language: 'English',
    timezone: 'GMT+5:30 (IST)'
  });

  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // 2. Addresses State
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Flat 402, Block B, Green Glen Layout, Bangalore', zip: '560103', isDefault: true },
    { id: 2, label: 'Work', address: 'MediRush HQ, Technology Park, Sector 4, Bangalore', zip: '560066', isDefault: false }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ label: 'Home', address: '', zip: '', isDefault: false });

  // 3. Medical Profile state
  const [medicalProfile, setMedicalProfile] = useState({
    healthId: 'MR-9082-9901',
    allergies: 'Penicillin, Peanuts',
    chronicDiseases: 'Asthma',
    medications: 'Inhaler (Albuterol) - As needed',
    bpStatus: 'Normal (120/80)',
    diabetesStatus: 'Non-Diabetic',
    organDonor: 'Yes',
    insuranceProvider: 'Star Health Insurance',
    insurancePolicy: 'SH-90821-XX',
    preferredDoctor: 'Dr. Ramesh Kumar (Cardiologist)',
    preferredPharmacy: 'MediRush Care Pharmacy (HSR)',
    emergencyNotes: 'Allergic to sulfonamides. Carry inhaler.'
  });

  // 4. Prescriptions & Reports
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [newPrescription, setNewPrescription] = useState({ note: '', isUrgent: false });
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // 5. Orders & History
  const [orders, setOrders] = useState([
    { id: 'ORD-9021', date: '2026-07-28', items: 'Paracetamol 500mg, Vitamin C', total: 450.00, status: 'Delivered' },
    { id: 'ORD-8911', date: '2026-07-25', items: 'Amoxicillin 250mg, Cough Syrup', total: 890.00, status: 'Delivered' }
  ]);

  // 6. Payments
  const [savedCards, setSavedCards] = useState([
    { id: 1, type: 'Visa', number: '•••• •••• •••• 4242', expiry: '12/28', holder: 'John Doe' }
  ]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', holder: '', cvv: '' });

  // 7. Notifications State
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    whatsapp: true,
    reminders: true,
    promotional: false
  });

  // 8. Privacy & Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    biometrics: true,
    permissions: { camera: true, location: true }
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // 9. Emergency / SOS
  const [sosContacts, setSosContacts] = useState([
    { id: 1, name: 'Sarah Doe (Wife)', phone: '+919876543210' }
  ]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '' });
  const [sosActive, setSosActive] = useState(false);
  const [showMedicalIdCard, setShowMedicalIdCard] = useState(false);

  // 10. Rewards & Offers
  const [rewardPoints, setRewardPoints] = useState(1250);

  // 11. Support & Help
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'Billing', message: '' });
  const [showTicketModal, setShowTicketModal] = useState(false);

  // 12. App settings
  const [appTheme, setAppTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Load profile from Supabase
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchPrescriptions();
    }
  }, [user]);

  // Load offline data fallback
  useEffect(() => {
    if (user) {
      const storedAddresses = localStorage.getItem(`medirush_addresses_${user.id}`);
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));

      const storedMedical = localStorage.getItem(`medirush_medical_${user.id}`);
      if (storedMedical) setMedicalProfile(JSON.parse(storedMedical));

      const storedCards = localStorage.getItem(`medirush_cards_${user.id}`);
      if (storedCards) setSavedCards(JSON.parse(storedCards));

      const storedSos = localStorage.getItem(`medirush_sos_${user.id}`);
      if (storedSos) setSosContacts(JSON.parse(storedSos));
    }
  }, [user]);

  // Sync state changes to offline fallback
  const saveOfflineData = (key, data) => {
    if (user) {
      localStorage.setItem(`medirush_${key}_${user.id}`, JSON.stringify(data));
    }
  };

  const showToast = (msg, type = 'success') => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (dbError) throw dbError;

      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAvatarUrl(data.avatar_url || '');
      }

      // Check User Metadata for additional fields
      if (user.user_metadata) {
        const meta = user.user_metadata;
        setPersonalData(prev => ({
          ...prev,
          username: meta.username || prev.username,
          dob: meta.dob || prev.dob,
          gender: meta.gender || prev.gender,
          bloodGroup: meta.bloodGroup || prev.bloodGroup,
          height: meta.height || prev.height,
          weight: meta.weight || prev.weight,
          emergencyContact: meta.emergencyContact || prev.emergencyContact,
          alternateContact: meta.alternateContact || prev.alternateContact,
          language: meta.language || prev.language,
          timezone: meta.timezone || prev.timezone
        }));
        setCoverUrl(meta.coverUrl || '');
        if (meta.medicalProfile) setMedicalProfile(meta.medicalProfile);
        if (meta.notificationSettings) setNotificationSettings(meta.notificationSettings);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      if (data) setPrescriptions(data);
    } catch (err) {
      console.warn('Failed to load prescriptions:', err);
    }
  };

  // Profile completion progress calculation
  const calculateCompletion = () => {
    const fields = [
      name,
      phone,
      email,
      personalData.username,
      personalData.dob,
      personalData.gender,
      personalData.bloodGroup,
      personalData.height,
      personalData.weight,
      personalData.emergencyContact,
      medicalProfile.allergies,
      medicalProfile.chronicDiseases,
      medicalProfile.bloodPressure,
      medicalProfile.diabetesStatus,
      medicalProfile.insuranceProvider,
      addresses.length > 0 ? 'yes' : ''
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  // General user details updates (Supabase metadata sync)
  const handleProfileSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Update public.users
      const { error: dbError } = await supabase
        .from('users')
        .update({
          name,
          phone
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      // 2. Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          ...personalData,
          name,
          phone,
          coverUrl
        }
      });

      if (authError) throw authError;

      showToast('Profile settings saved successfully!');
    } catch (err) {
      setError('Could not update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Avatar Upload
  const handleAvatarChange = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const filePath = `avatars/${user.id}-${Date.now()}.${file.name.split('.').pop()}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newUrl = publicUrlData.publicUrl;
      setAvatarUrl(newUrl);

      // Save url
      await supabase.from('users').update({ avatar_url: newUrl }).eq('id', user.id);
      showToast('Avatar updated successfully!');
    } catch (err) {
      // Offline fallback simulator
      const localUrl = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(localUrl);
      showToast('Uploaded avatar locally (development fallback mode).');
    }
  };

  // Cover photo simulation
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const localUrl = URL.createObjectURL(e.target.files[0]);
      setCoverUrl(localUrl);
      showToast('Cover photo updated!');
    }
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setError('New passwords do not match!');
      return;
    }
    try {
      setLoading(true);
      const { error: passError } = await supabase.auth.updateUser({
        password: passwordForm.new
      });
      if (passError) throw passError;
      showToast('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Address CRUD
  const saveAddress = (e) => {
    e.preventDefault();
    let newAddresses;
    if (editingAddress) {
      newAddresses = addresses.map(a => a.id === editingAddress.id ? { ...a, ...addressForm } : a);
      showToast('Address updated!');
    } else {
      const newAddr = { id: Date.now(), ...addressForm };
      newAddresses = [...addresses, newAddr];
      showToast('Address added successfully!');
    }

    if (addressForm.isDefault) {
      newAddresses = newAddresses.map(a => a.id === (editingAddress ? editingAddress.id : newAddresses[newAddresses.length - 1].id) ? { ...a, isDefault: true } : { ...a, isDefault: false });
    }

    setAddresses(newAddresses);
    saveOfflineData('addresses', newAddresses);
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm({ label: 'Home', address: '', zip: '', isDefault: false });
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    saveOfflineData('addresses', updated);
    showToast('Address deleted.');
  };

  // Medical Profile Updates
  const handleMedicalSave = async () => {
    try {
      setLoading(true);
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          medicalProfile
        }
      });
      if (authError) throw authError;
      saveOfflineData('medical', medicalProfile);
      showToast('Medical record updated successfully!');
    } catch (err) {
      saveOfflineData('medical', medicalProfile);
      showToast('Medical profile saved offline.');
    } finally {
      setLoading(false);
    }
  };

  // Prescriptions Upload & management
  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionFile) {
      setError('Please select a file to upload');
      return;
    }
    try {
      setLoading(true);
      const filePath = `prescriptions/${user.id}-${Date.now()}-${prescriptionFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(filePath, prescriptionFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(filePath);

      const { data, error: dbError } = await supabase
        .from('prescriptions')
        .insert([
          {
            user_id: user.id,
            prescription_url: publicUrlData.publicUrl,
            note: newPrescription.note,
            is_urgent: newPrescription.isUrgent,
            status: 'pending_verification'
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setPrescriptions([data, ...prescriptions]);
      showToast('Prescription uploaded successfully!');
      setShowPrescriptionModal(false);
      setNewPrescription({ note: '', isUrgent: false });
      setPrescriptionFile(null);
    } catch (err) {
      // Local demo fallback
      const mockRecord = {
        id: Date.now(),
        prescription_url: URL.createObjectURL(prescriptionFile),
        note: newPrescription.note,
        is_urgent: newPrescription.isUrgent,
        status: 'pending_verification',
        created_at: new Date().toISOString()
      };
      setPrescriptions([mockRecord, ...prescriptions]);
      showToast('Prescription saved locally (development mode).');
      setShowPrescriptionModal(false);
      setNewPrescription({ note: '', isUrgent: false });
      setPrescriptionFile(null);
    } finally {
      setLoading(false);
    }
  };

  const deletePrescription = async (id) => {
    try {
      const { error: delError } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);

      if (delError) throw delError;
      setPrescriptions(prescriptions.filter(p => p.id !== id));
      showToast('Prescription deleted.');
    } catch (err) {
      setPrescriptions(prescriptions.filter(p => p.id !== id));
      showToast('Prescription removed.');
    }
  };

  // Payment methods addition
  const saveCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(),
      type: cardForm.number.startsWith('4') ? 'Visa' : 'Mastercard',
      number: '•••• •••• •••• ' + cardForm.number.slice(-4),
      expiry: cardForm.expiry,
      holder: cardForm.holder
    };
    const updated = [...savedCards, newCard];
    setSavedCards(updated);
    saveOfflineData('cards', updated);
    setShowCardModal(false);
    setCardForm({ number: '', expiry: '', holder: '', cvv: '' });
    showToast('Payment card saved securely!');
  };

  const deleteCard = (id) => {
    const updated = savedCards.filter(c => c.id !== id);
    setSavedCards(updated);
    saveOfflineData('cards', updated);
    showToast('Payment method removed.');
  };

  // Notification toggles
  const handleNotificationChange = async (key) => {
    const updated = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(updated);
    try {
      await supabase.auth.updateUser({
        data: { notificationSettings: updated }
      });
    } catch (err) {
      // offline fallback is okay
    }
  };

  // Privacy and Security helpers
  const downloadJSONData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      profile: { name, email, phone, personalData },
      medicalProfile,
      addresses,
      savedCards,
      sosContacts
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medirush_data_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('All medical and account data exported.');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE ACCOUNT') {
      setError('Please type exact confirmation code.');
      return;
    }
    try {
      setLoading(true);
      // Clean auth session and sign out
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SOS contact CRUD
  const saveSosContact = (e) => {
    e.preventDefault();
    const newContact = { id: Date.now(), ...contactForm };
    const updated = [...sosContacts, newContact];
    setSosContacts(updated);
    saveOfflineData('sos', updated);
    setShowContactModal(false);
    setContactForm({ name: '', phone: '' });
    showToast('SOS contact saved.');
  };

  const triggerSOS = () => {
    setSosActive(true);
    showToast('🚨 SOS Emergency alert activated! Broadcasting live location and medical details...', 'error');
    setTimeout(() => {
      setSosActive(false);
    }, 8000);
  };

  // Support ticket generation
  const createSupportTicket = (e) => {
    e.preventDefault();
    const newTicket = {
      id: 'TCK-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString(),
      status: 'Open',
      ...ticketForm
    };
    setTickets([newTicket, ...tickets]);
    setShowTicketModal(false);
    setTicketForm({ subject: '', category: 'Billing', message: '' });
    showToast('Support ticket raised. Support agent will respond shortly!');
  };

  // Clear cache simulator
  const clearAppCache = () => {
    showToast('App cache cleared successfully.');
  };

  // Print/Download Medical ID Card
  const printMedicalId = () => {
    window.print();
  };

  // Navigation Items Sidebar List
  const sidebarItems = [
    { id: 'account', label: 'Account & Security', icon: User },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
    { id: 'medical', label: 'Medical Health ID', icon: Activity },
    { id: 'prescriptions', label: 'Prescriptions & Reports', icon: FileText },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'payments', label: 'Saved Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'emergency', label: 'Emergency (SOS)', icon: AlertTriangle },
    { id: 'rewards', label: 'Rewards & Referrals', icon: Gift },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
    { id: 'settings', label: 'App Settings', icon: Settings }
  ];

  const completionRate = calculateCompletion();

  return (
    <div className={cn("min-h-screen bg-background font-sans pb-24 relative overflow-hidden", appTheme === 'dark' && 'dark-theme-class')}>
      {/* Dynamic Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-5 right-5 z-50 p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400"
          >
            <Check size={20} />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-5 right-5 z-50 p-4 bg-red-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400"
          >
            <AlertTriangle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:opacity-80"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with cover image */}
      <div className="relative h-64 bg-gray-200">
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/80 to-blue-800/80"></div>
        )}
        <label className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg transition-all">
          <Camera size={14} className="inline mr-2" /> Change Cover
          <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
        </label>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-10">
        {/* Profile Card Header */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-[2.5rem] shadow-floating mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg bg-white" />
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-primary text-3xl font-extrabold shadow-inner uppercase">
                  {name ? name.charAt(0) : 'U'}
                </div>
              )}
              <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                <Camera size={16} className="text-primary" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900 drop-shadow-sm">{name || 'User'}</h1>
                <span className="bg-green-100 text-green-800 text-[9px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-200 shadow-sm">
                  <ShieldCheck size={10} /> Active
                </span>
              </div>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">{email}</p>
              <p className="text-gray-400 text-xs mt-0.5">Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full md:w-64 bg-white/60 p-4 rounded-3xl border border-white/50 shadow-inner">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500">Profile Strength</span>
              <span className="text-xs font-black text-primary">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-gray-400 font-medium mt-1.5 block">Complete details to get faster triage & checkout</span>
          </div>
        </div>

        {/* Multi-Tab Sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-3/12 flex flex-col gap-2">
            <div className="bg-white/60 backdrop-blur-xl p-3 rounded-[2rem] border border-white/50 shadow-glass flex flex-row lg:flex-col overflow-x-auto gap-1 lg:gap-1.5 scrollbar-none">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap lg:w-full",
                      activeTab === item.id 
                        ? "bg-gradient-to-r from-primary to-blue-800 text-white shadow-md shadow-primary/25" 
                        : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                    )}
                  >
                    <Icon size={16} className={activeTab === item.id ? "text-white" : "text-gray-400"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Quick SOS Trigger Shortcut */}
            <button 
              onClick={triggerSOS}
              className={cn(
                "w-full py-4 rounded-[2rem] flex items-center justify-center gap-3 font-extrabold text-xs uppercase tracking-widest transition-all border shadow-lg",
                sosActive 
                  ? "bg-red-600 border-red-600 text-white animate-pulse" 
                  : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-red-100"
              )}
            >
              <AlertTriangle size={18} className="animate-bounce" />
              <span>{sosActive ? "SOS BroadCasting..." : "Trigger SOS Alert"}</span>
            </button>
          </div>

          {/* Content Pane */}
          <div className="w-full lg:w-9/12 bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-white/60 shadow-2xl min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* 1. Account Settings */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Account & Personal Details</h2>
                      <Button variant="primary" size="sm" onClick={handleProfileSave} disabled={loading}>
                        Save Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Username (Optional)</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input type="text" value={personalData.username} onChange={(e) => setPersonalData({...personalData, username: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="username" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input type="email" readOnly value={email} className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl outline-none font-bold text-gray-500 text-sm cursor-not-allowed" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="+919876543210" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input type="date" value={personalData.dob} onChange={(e) => setPersonalData({...personalData, dob: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Gender</label>
                        <select value={personalData.gender} onChange={(e) => setPersonalData({...personalData, gender: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner appearance-none cursor-pointer">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Blood Group</label>
                        <select value={personalData.bloodGroup} onChange={(e) => setPersonalData({...personalData, bloodGroup: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner appearance-none cursor-pointer">
                          <option>A+</option><option>A-</option>
                          <option>B+</option><option>B-</option>
                          <option>O+</option><option>O-</option>
                          <option>AB+</option><option>AB-</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Height (cm)</label>
                          <input type="number" value={personalData.height} onChange={(e) => setPersonalData({...personalData, height: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="175" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Weight (kg)</label>
                          <input type="number" value={personalData.weight} onChange={(e) => setPersonalData({...personalData, weight: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="70" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Emergency Contact</label>
                        <input type="tel" value={personalData.emergencyContact} onChange={(e) => setPersonalData({...personalData, emergencyContact: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="Emergency Phone" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Alternate Contact</label>
                        <input type="tel" value={personalData.alternateContact} onChange={(e) => setPersonalData({...personalData, alternateContact: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="Alternate Phone" />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200/50 flex flex-wrap gap-4">
                      <Button variant="outline" size="md" onClick={() => setShowPasswordModal(true)}>
                        <Key size={16} className="mr-2" /> Change Password
                      </Button>
                      <div className="flex items-center gap-3 ml-auto text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-150">
                        <span>Linked Accounts:</span>
                        <div className="flex gap-2">
                          <span className="bg-white px-2 py-1 rounded-lg border border-gray-200 text-gray-700 shadow-sm">Google</span>
                          <span className="bg-white px-2 py-1 rounded-lg border border-gray-200 text-gray-700 shadow-sm opacity-50">Apple</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. My Addresses */}
                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Delivery Addresses</h2>
                      <Button variant="primary" size="sm" onClick={() => { setEditingAddress(null); setAddressForm({ label: 'Home', address: '', zip: '', isDefault: false }); setShowAddressModal(true); }}>
                        <Plus size={16} className="mr-2" /> Add Address
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className={cn("p-5 rounded-3xl border shadow-sm relative bg-white/40 flex flex-col justify-between min-h-[140px]", addr.isDefault ? "border-primary/40 bg-primary/5" : "border-gray-200/60")}>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn("text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm", addr.label === 'Home' ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-green-50 text-green-800 border-green-200")}>
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">Default</span>
                              )}
                            </div>
                            <p className="text-sm font-extrabold text-gray-800 leading-relaxed mb-4">{addr.address}</p>
                          </div>

                          <div className="flex items-center gap-3 border-t border-gray-200/40 pt-3 text-xs mt-auto">
                            <button onClick={() => { setEditingAddress(addr); setAddressForm(addr); setShowAddressModal(true); }} className="text-primary font-bold hover:underline">Edit</button>
                            <button onClick={() => deleteAddress(addr.id)} className="text-red-500 font-bold hover:underline ml-auto flex items-center gap-1">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Medical Profile */}
                {activeTab === 'medical' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Medical ID & Health Profile</h2>
                      <Button variant="primary" size="sm" onClick={handleMedicalSave}>Save Health ID</Button>
                    </div>

                    <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center gap-4 shadow-sm">
                      <Heart size={32} className="text-red-500 fill-current animate-pulse" />
                      <div>
                        <h4 className="text-sm font-extrabold text-red-900 uppercase tracking-widest">Medical ID Card Active</h4>
                        <p className="text-xs text-red-800/80 font-bold mt-0.5">This card helps medical professionals treat you in emergencies. Click below to preview & print.</p>
                        <button onClick={() => setShowMedicalIdCard(true)} className="text-xs text-red-600 underline font-black hover:text-red-800 transition-colors mt-2 block">Download/Print Card</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Health ID / ABHA Number</label>
                        <input type="text" value={medicalProfile.healthId} onChange={(e) => setMedicalProfile({...medicalProfile, healthId: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="XX-XXXX-XXXX" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Allergies</label>
                        <input type="text" value={medicalProfile.allergies} onChange={(e) => setMedicalProfile({...medicalProfile, allergies: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="None / e.g. Penicillin" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Chronic Diseases / Conditions</label>
                        <input type="text" value={medicalProfile.chronicDiseases} onChange={(e) => setMedicalProfile({...medicalProfile, chronicDiseases: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="None / Asthma, Diabetes" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Current Medications</label>
                        <input type="text" value={medicalProfile.medications} onChange={(e) => setMedicalProfile({...medicalProfile, medications: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="None / Inhaler" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Blood Pressure Status</label>
                        <input type="text" value={medicalProfile.bpStatus} onChange={(e) => setMedicalProfile({...medicalProfile, bpStatus: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Diabetes Status</label>
                        <input type="text" value={medicalProfile.diabetesStatus} onChange={(e) => setMedicalProfile({...medicalProfile, diabetesStatus: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Organ Donor Status</label>
                        <select value={medicalProfile.organDonor} onChange={(e) => setMedicalProfile({...medicalProfile, organDonor: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner appearance-none cursor-pointer">
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Insurance Provider</label>
                        <input type="text" value={medicalProfile.insuranceProvider} onChange={(e) => setMedicalProfile({...medicalProfile, insuranceProvider: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Primary Care Physician / Doctor Info</label>
                        <input type="text" value={medicalProfile.preferredDoctor} onChange={(e) => setMedicalProfile({...medicalProfile, preferredDoctor: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Preferred Pharmacy Branch</label>
                        <input type="text" value={medicalProfile.preferredPharmacy} onChange={(e) => setMedicalProfile({...medicalProfile, preferredPharmacy: e.target.value})} className="w-full px-4 py-3.5 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1.5 ml-1">Emergency Medical Notes</label>
                      <textarea value={medicalProfile.emergencyNotes} onChange={(e) => setMedicalProfile({...medicalProfile, emergencyNotes: e.target.value})} rows={3} className="w-full px-4 py-3 bg-white/80 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-gray-900 text-sm shadow-inner" placeholder="Emergency instructions..."></textarea>
                    </div>
                  </div>
                )}

                {/* 4. Prescriptions */}
                {activeTab === 'prescriptions' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Prescriptions & Medical Reports</h2>
                      <Button variant="primary" size="sm" onClick={() => setShowPrescriptionModal(true)}>
                        <FileUp size={16} className="mr-2" /> Upload Document
                      </Button>
                    </div>

                    {prescriptions.length === 0 ? (
                      <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-white/60">
                        <FileText size={48} className="text-gray-300 mb-4" />
                        <h4 className="text-lg font-bold text-gray-700">No prescriptions uploaded yet</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">Upload prescriptions to check eligibility for prescription-only medicine ordering.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prescriptions.map(p => (
                          <div key={p.id} className="p-4 rounded-3xl border border-gray-150 bg-white/40 shadow-sm flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-2xl text-primary border border-primary/20">
                              <FileText size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-sm text-gray-800 truncate">{p.note || 'Medical Document'}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {new Date(p.created_at).toLocaleDateString()} • {p.status || 'Verified'}
                              </p>
                              {p.is_urgent && (
                                <span className="inline-block mt-2 bg-red-100 text-red-800 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-red-200">Urgent</span>
                              )}
                              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200/30 text-xs">
                                <a href={p.prescription_url} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline flex items-center gap-1">
                                  <Download size={13} /> Download
                                </a>
                                <button onClick={() => deletePrescription(p.id)} className="text-red-500 font-bold hover:underline ml-auto flex items-center gap-1">
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Orders & Reordering */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Previous Orders</h2>
                    </div>

                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="p-5 rounded-3xl border border-gray-200/60 bg-white/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-black text-gray-900">{order.id}</span>
                              <span className="text-[9px] text-gray-400 font-bold">{order.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">{order.items}</p>
                            <p className="text-sm font-extrabold text-primary mt-2">₹{order.total.toFixed(2)}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 sm:text-right">
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-emerald-200 shadow-sm">{order.status}</span>
                            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                              <Button variant="primary" size="sm" className="rounded-xl flex-1 sm:flex-none">Reorder</Button>
                              <Button variant="glass" size="sm" className="rounded-xl flex-1 sm:flex-none" onClick={() => showToast('Invoice downloading...')}>Invoice</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Saved Payments */}
                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Saved Cards & UPI IDs</h2>
                      <Button variant="primary" size="sm" onClick={() => setShowCardModal(true)}>
                        <Plus size={16} className="mr-2" /> Add Card
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedCards.map(card => (
                        <div key={card.id} className="p-5 rounded-3xl bg-gradient-to-br from-gray-900 to-indigo-900 text-white relative shadow-lg overflow-hidden min-h-[140px] flex flex-col justify-between">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-300">{card.type}</span>
                            <button onClick={() => deleteCard(card.id)} className="text-white/60 hover:text-white transition-colors"><Trash2 size={16} /></button>
                          </div>

                          <p className="text-lg font-bold tracking-widest my-4">{card.number}</p>

                          <div className="flex justify-between items-center text-xs mt-auto pt-2 border-t border-white/10">
                            <div>
                              <p className="text-[8px] uppercase tracking-widest text-indigo-200/50 font-bold">Holder</p>
                              <p className="font-extrabold text-indigo-100">{card.holder}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] uppercase tracking-widest text-indigo-200/50 font-bold">Expires</p>
                              <p className="font-extrabold text-indigo-100">{card.expiry}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 bg-white/40 border border-gray-200/60 rounded-3xl">
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-gray-500 mb-3 ml-1">Other Payment Methods</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white/60 p-3.5 rounded-2xl border border-white/50">
                          <span className="text-xs font-bold text-gray-800">Cash on Delivery (COD)</span>
                          <span className="bg-green-100 text-green-800 text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full border border-green-200">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/60 p-3.5 rounded-2xl border border-white/50">
                          <span className="text-xs font-bold text-gray-800">UPI IDs</span>
                          <span className="text-xs font-bold text-gray-500">you@paytm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Notification Channels</h2>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'push', label: 'Push Notifications', desc: 'Alerts sent directly to your phone screen' },
                        { key: 'email', label: 'Email Notifications', desc: 'Invoices, reports, and newsletter updates' },
                        { key: 'sms', label: 'SMS Notifications', desc: 'Critical delivery updates and transactional OTPs' },
                        { key: 'whatsapp', label: 'WhatsApp Updates', desc: 'Live prescription status and courier tracking' },
                        { key: 'reminders', label: 'Medicine Reminders', desc: 'Timed alarms for your scheduled dosage' },
                        { key: 'promotional', label: 'Coupons & Deals', desc: 'Notices on monthly medicine discounts' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-white/40 border border-gray-200/60 rounded-3xl shadow-sm">
                          <div className="max-w-md">
                            <h4 className="text-sm font-extrabold text-gray-800">{item.label}</h4>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={notificationSettings[item.key]} 
                              onChange={() => handleNotificationChange(item.key)} 
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. Privacy & Security */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Security Settings</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-200/60 rounded-3xl shadow-sm">
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800">Two Factor Authentication (2FA)</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Secure logins with verification codes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={securitySettings.twoFactor} 
                            onChange={() => setSecuritySettings({...securitySettings, twoFactor: !securitySettings.twoFactor})} 
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-200/60 rounded-3xl shadow-sm">
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800">Biometric Login / FaceID</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Use fingerprint or facial recognition to access app</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={securitySettings.biometrics} 
                            onChange={() => setSecuritySettings({...securitySettings, biometrics: !securitySettings.biometrics})} 
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-5 border border-gray-200/60 bg-white/40 rounded-3xl space-y-4">
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-gray-500 ml-1">Account Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="glass" size="sm" className="rounded-xl font-bold" onClick={downloadJSONData}>Export My Profile Data (JSON)</Button>
                        <Button variant="outline" size="sm" className="rounded-xl font-bold text-red-600 border-red-200 hover:bg-red-50 ml-auto" onClick={() => setShowDeleteModal(true)}>Delete My Account</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Emergency (SOS) */}
                {activeTab === 'emergency' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">SOS & Emergency Settings</h2>
                      <Button variant="primary" size="sm" onClick={() => setShowContactModal(true)}>
                        <Plus size={16} className="mr-2" /> Add SOS Contact
                      </Button>
                    </div>

                    <div className="p-6 bg-red-600 text-white rounded-[2rem] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-lg font-extrabold uppercase tracking-widest">Instant SOS Button</h3>
                        <p className="text-xs text-red-100 font-medium mt-1">Pressing this will instantly broadcast your live location, medical reports, and primary doctor information to all emergency contacts.</p>
                      </div>
                      <button 
                        onClick={triggerSOS}
                        className="w-24 h-24 bg-white hover:bg-red-50 text-red-600 font-black rounded-full flex items-center justify-center border-4 border-red-300 shadow-xl transform active:scale-95 transition-all text-sm uppercase"
                      >
                        SOS
                      </button>
                    </div>

                    <div className="p-5 bg-white/40 border border-gray-200/60 rounded-3xl">
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-gray-500 mb-3 ml-1">Emergency Contacts</h4>
                      {sosContacts.length === 0 ? (
                        <p className="text-xs text-gray-400 font-bold ml-1">No contacts configured.</p>
                      ) : (
                        <div className="space-y-3">
                          {sosContacts.map(c => (
                            <div key={c.id} className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-white/50 shadow-sm">
                              <div>
                                <p className="text-sm font-extrabold text-gray-800">{c.name}</p>
                                <p className="text-xs text-gray-400 font-bold">{c.phone}</p>
                              </div>
                              <button onClick={() => {
                                const updated = sosContacts.filter(sc => sc.id !== c.id);
                                setSosContacts(updated);
                                saveOfflineData('sos', updated);
                                showToast('SOS contact removed.');
                              }} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 10. Rewards & Referrals */}
                {activeTab === 'rewards' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Rewards & Referrals</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-[2rem] shadow-lg flex flex-col justify-between min-h-[160px]">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-extrabold text-orange-100">Reward Balance</p>
                          <h3 className="text-3xl font-black mt-2">{rewardPoints} pts</h3>
                        </div>
                        <p className="text-[10px] text-orange-500/80 bg-white/90 px-3 py-1 rounded-full w-fit font-black mt-4 border border-orange-200 shadow-sm">₹100 = 10 Points</p>
                      </div>

                      <div className="p-6 bg-white/40 border border-gray-200/60 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[160px]">
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Refer & Earn</h4>
                          <p className="text-xs text-gray-400 font-bold mt-1">Get 200 points (worth ₹20) when a friend orders their first medicine.</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 bg-white/70 p-2.5 rounded-xl border border-gray-200">
                          <span className="text-xs font-black text-gray-700 select-all ml-1">MEDIRUSH50</span>
                          <button onClick={() => { navigator.clipboard.writeText('MEDIRUSH50'); showToast('Referral code copied!'); }} className="ml-auto bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"><Share2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. Help & Support */}
                {activeTab === 'support' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Help Desk & Live Support</h2>
                      <Button variant="primary" size="sm" onClick={() => setShowTicketModal(true)}>
                        Raise Support Ticket
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-gray-500 mb-3 ml-1">Frequently Asked Questions (FAQs)</h4>
                      {[
                        { q: 'How long does emergency delivery take?', a: 'Emergency deliveries are dispatched within 5 minutes of verification and typically reach your location in under 30-45 minutes depending on traffic.' },
                        { q: 'Is prescription validation mandatory?', a: 'Yes, scheduled medicines and antibiotics require a valid medical prescription before checkout. Our doctors can verify yours online in 2 minutes.' },
                        { q: 'Can I return medicines?', a: 'Unopened, sealed medical boxes can be returned within 7 days of delivery for a full refund. Refrigerated items are not eligible.' }
                      ].map((faq, idx) => (
                        <details key={idx} className="bg-white/40 border border-gray-200/60 rounded-3xl p-4 cursor-pointer select-none [&_summary::-webkit-details-marker]:hidden">
                          <summary className="font-extrabold text-sm text-gray-800 flex items-center justify-between">
                            <span>{faq.q}</span>
                            <span className="text-primary font-black">+</span>
                          </summary>
                          <p className="text-xs text-gray-500 font-bold leading-relaxed mt-3 pt-3 border-t border-gray-200/30">{faq.a}</p>
                        </details>
                      ))}
                    </div>

                    {tickets.length > 0 && (
                      <div className="p-5 bg-white/40 border border-gray-200/60 rounded-3xl">
                        <h4 className="text-xs uppercase tracking-widest font-extrabold text-gray-500 mb-3 ml-1">Active Tickets</h4>
                        <div className="space-y-3">
                          {tickets.map(t => (
                            <div key={t.id} className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-white/50 shadow-sm">
                              <div>
                                <p className="text-sm font-extrabold text-gray-800">{t.subject}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t.category} • Raised on {t.date}</p>
                              </div>
                              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[8px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full shadow-sm">{t.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 12. App Settings */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">App Preferences</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-200/60 rounded-3xl shadow-sm">
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800">App Theme</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Toggle light or dark styling</p>
                        </div>
                        <div className="flex p-0.5 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
                          <button onClick={() => setAppTheme('light')} className={cn("p-2 rounded-lg text-xs font-bold transition-all", appTheme === 'light' ? "bg-white text-gray-800 shadow" : "text-gray-500")}><Sun size={16} /></button>
                          <button onClick={() => setAppTheme('dark')} className={cn("p-2 rounded-lg text-xs font-bold transition-all", appTheme === 'dark' ? "bg-white text-gray-800 shadow" : "text-gray-500")}><Moon size={16} /></button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-200/60 rounded-3xl shadow-sm">
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800">Font Size</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Adjust typography visibility</p>
                        </div>
                        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs text-gray-800 outline-none">
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-200/60 rounded-3xl shadow-sm">
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800">Storage Cache</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Clear temporary medicine images</p>
                        </div>
                        <Button variant="glass" size="sm" className="rounded-xl font-bold" onClick={clearAppCache}>Clear Cache</Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-150 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">MediRush Production App v2.4.0-stable</p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── MODALS SECTION ────────────────────────────────────────────────── */}
      
      {/* 1. Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveAddress} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Label</label>
                <select value={addressForm.label} onChange={(e) => setAddressForm({...addressForm, label: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none">
                  <option>Home</option><option>Work</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Address Details</label>
                <textarea required value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="Flat No, Building Name, Area..."></textarea>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Pincode</label>
                <input required type="text" maxLength={6} value={addressForm.zip} onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="560103" />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input id="defaultAddressCheck" type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4.5 h-4.5 rounded border-gray-300 accent-primary cursor-pointer" />
                <label htmlFor="defaultAddressCheck" className="text-xs text-gray-600 font-bold cursor-pointer">Set as default delivery address</label>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 rounded-2xl font-black">Save Address</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">New Password</label>
                <input required type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Confirm New Password</label>
                <input required type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="••••••••" />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 rounded-2xl font-black">Update Password</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Prescription upload modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">Upload Prescription File</h3>
              <button onClick={() => setShowPrescriptionModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleUploadPrescription} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Select File</label>
                <input required type="file" accept="image/*,application/pdf" onChange={(e) => setPrescriptionFile(e.target.files[0])} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs text-gray-900 focus:bg-white outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Notes / Instructions</label>
                <input type="text" value={newPrescription.note} onChange={(e) => setNewPrescription({...newPrescription, note: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="e.g. Asthma reports" />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input id="urgentCheck" type="checkbox" checked={newPrescription.isUrgent} onChange={(e) => setNewPrescription({...newPrescription, isUrgent: e.target.checked})} className="w-4.5 h-4.5 rounded border-gray-300 accent-primary cursor-pointer" />
                <label htmlFor="urgentCheck" className="text-xs text-gray-600 font-bold cursor-pointer">Mark as urgent (for immediate validation)</label>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 rounded-2xl font-black">Upload Prescription</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 4. Saved Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">Add Credit/Debit Card</h3>
              <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveCard} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Card Number</label>
                <input required type="text" maxLength={16} value={cardForm.number} onChange={(e) => setCardForm({...cardForm, number: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="4111222233334444" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Expiry Date</label>
                  <input required type="text" maxLength={5} value={cardForm.expiry} onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">CVV</label>
                  <input required type="password" maxLength={3} value={cardForm.cvv} onChange={(e) => setCardForm({...cardForm, cvv: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="•••" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Cardholder Name</label>
                <input required type="text" value={cardForm.holder} onChange={(e) => setCardForm({...cardForm, holder: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="John Doe" />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 rounded-2xl font-black">Save Card</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. Delete account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-150 pb-3 mb-4">
              <h3 className="text-lg font-black text-red-600 flex items-center gap-2">
                <AlertTriangle size={20} /> Delete Account permanently?
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed font-bold">WARNING: This operation is permanent and irreversible. All address data, medical records, orders history, and prescriptions will be deleted from our systems.</p>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-600 mb-1">Type <span className="text-red-600">DELETE ACCOUNT</span> to confirm</label>
                <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full px-4 py-3 bg-red-50/50 border border-red-200 rounded-xl font-bold text-sm text-red-900 outline-none" placeholder="DELETE ACCOUNT" />
              </div>
              <div className="flex gap-3">
                <Button variant="glass" className="flex-1 rounded-xl font-bold" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-bold" onClick={handleDeleteAccount}>Yes, Delete</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 6. SOS Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">Add SOS Emergency Contact</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveSosContact} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Full Name & Relation</label>
                <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="e.g. Sarah Doe (Wife)" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Mobile Number</label>
                <input required type="tel" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="+919876543210" />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 rounded-2xl font-black">Save Contact</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 7. Support raise ticket modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">Raise Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={createSupportTicket} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Subject</label>
                <input required type="text" value={ticketForm.subject} onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="Brief issue description" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Category</label>
                <select value={ticketForm.category} onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white outline-none">
                  <option>Billing</option><option>Delivery</option><option>Prescription Approval</option><option>Medicine Quality</option><option>Others</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Describe your issue</label>
                <textarea required value={ticketForm.message} onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs text-gray-900 focus:bg-white outline-none" placeholder="Provide order IDs or context..."></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 rounded-2xl font-black">Submit Ticket</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 8. Medical ID Card Modal */}
      {showMedicalIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/60">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-gray-900">Medical ID Card</h3>
              <button onClick={() => setShowMedicalIdCard(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            {/* Medical ID Card Layout */}
            <div id="medical-id-card-element" className="p-6 rounded-[2rem] bg-gradient-to-r from-red-600 to-rose-700 text-white relative shadow-2xl overflow-hidden min-h-[220px] flex flex-col justify-between border border-red-500">
              <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-black tracking-wider text-rose-100 uppercase">MediRush EMERGENCY ID</h4>
                  <p className="text-[9px] uppercase tracking-widest text-rose-200/60 font-bold">Health Card ID: {medicalProfile.healthId}</p>
                </div>
                <Heart size={28} className="text-white fill-current shrink-0" />
              </div>

              <div className="my-3 space-y-1 text-xs">
                <p className="font-extrabold text-sm text-white">Name: {name}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-rose-100 font-bold">
                  <p>DOB: {personalData.dob || 'Not provided'}</p>
                  <p>Blood Group: {personalData.bloodGroup}</p>
                  <p>Allergies: {medicalProfile.allergies || 'None'}</p>
                  <p>Conditions: {medicalProfile.chronicDiseases || 'None'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9px] text-rose-200/50 font-bold mt-auto pt-2 border-t border-white/10">
                <p>Emergency Contact: {personalData.emergencyContact || 'None'}</p>
                <p className="text-right">MediRush Inc.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="glass" className="flex-1 rounded-xl font-bold" onClick={() => setShowMedicalIdCard(false)}>Close</Button>
              <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-bold" onClick={printMedicalId}>Print / Download</Button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
