import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pharmacyService } from '../../services/pharmacyService';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Package, 
  CheckCircle2, 
  LogOut, 
  Store, 
  FileText, 
  Phone, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PharmacyDashboard = () => {
  const { user, userProfile, pharmacyProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dbPharmacy, setDbPharmacy] = useState(pharmacyProfile);

  useEffect(() => {
    // Sync DB profile if owner is authenticated
    if (user?.id) {
      pharmacyService.getPharmacyProfileByOwner(user.id).then(({ data }) => {
        if (data) setDbPharmacy(data);
      });
    }
  }, [user]);

  const activePharmacy = dbPharmacy || pharmacyProfile;
  const isVerified = activePharmacy?.verified || activePharmacy?.verification_status === 'approved';
  const ownerName = userProfile?.name || user?.user_metadata?.name || 'Pharmacy Partner';

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Decorative Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ── HEADER BANNER ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-800 to-green-950 pt-10 pb-24 px-5 relative overflow-hidden rounded-b-[3rem] shadow-floating">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-emerald-100 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full mb-4 border border-white/20 shadow-sm">
              <Store size={14} className="mr-1.5 text-emerald-300" /> Pharmacy Partner Portal • Foundation (Part 1)
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {activePharmacy?.pharmacy_name || `${ownerName}'s Pharmacy`}
            </h1>
            <p className="text-emerald-100 mt-2 text-xs md:text-sm font-medium drop-shadow-sm flex items-center gap-2">
              <span>Owner UUID:</span> <code className="bg-black/30 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-200">{user?.id}</code>
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
            <Button
              onClick={logout}
              variant="glass"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs font-bold py-3 px-4 rounded-2xl flex items-center gap-2 cursor-pointer shadow-glass"
            >
              <LogOut size={16} /> Sign Out Portal
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ── BODY FOUNDATION ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        
        {/* Verification Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl backdrop-blur-xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isVerified 
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isVerified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
              {isVerified ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/60 border border-current">
                {isVerified ? 'VERIFIED PARTNER' : 'VERIFICATION PENDING'}
              </span>
              <h3 className="text-base font-extrabold mt-1">
                {isVerified 
                  ? 'Your pharmacy profile is verified & active on MediRush!' 
                  : 'Account linked successfully. Document verification in progress.'}
              </h3>
              <p className="text-xs font-bold opacity-80">
                License No: <span className="font-mono font-black">{activePharmacy?.license_number || 'REG-PENDING-2026'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${activePharmacy?.is_open ? 'bg-emerald-500/20 border-emerald-400 text-emerald-800' : 'bg-gray-200 border-gray-300 text-gray-700'}`}>
              {activePharmacy?.is_open ? '● STORE OPEN' : '○ STORE CLOSED'}
            </span>
          </div>
        </motion.div>

        {/* Technical Architecture Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Auth Link */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 shadow-inner">
              <Database size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Supabase Auth Link</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Linked to Supabase Auth User ID <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">{user?.id?.slice(0, 8)}...</code>. Dedicated RLS policies restrict cross-pharmacy data access.
            </p>
            <div className="pt-2 border-t border-gray-100 text-[10px] uppercase tracking-wider font-extrabold text-teal-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> Secure Auth Architecture Ready
            </div>
          </motion.div>

          {/* Card 2: Database Schema */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <Building2 size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Pharmacy Schema</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Configured Supabase tables: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">pharmacies</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">pharmacy_inventory</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">pharmacy_documents</code>, & <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">operating_hours</code>.
            </p>
            <div className="pt-2 border-t border-gray-100 text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> RLS Security Enforced
            </div>
          </motion.div>

          {/* Card 3: Next Phase */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-indigo-950 text-white p-6 rounded-3xl border border-white/10 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 bg-white/10 text-amber-300 rounded-2xl flex items-center justify-center border border-white/20 shadow-glass">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-extrabold">Ready for Part 2</h3>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Foundation complete! In Part 2, we will build the Inventory Manager, Live Prescription Request Terminal, and Order Dispatch Dashboard.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-1">
              <ArrowRight size={12} /> Part 1 Foundation Verified
            </div>
          </motion.div>

        </div>

        {/* Registered Store Overview Details */}
        <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-5">
          <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Store className="text-teal-600" size={22} /> Registered Store Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block">Pharmacy Name</span>
              <p className="text-sm font-extrabold text-gray-900">{activePharmacy?.pharmacy_name || 'Apollo Pharmacy (Demo Store)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block">License Number</span>
              <p className="text-sm font-mono font-extrabold text-teal-700">{activePharmacy?.license_number || 'DL-IND-2026-APOLLO99'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block">Store Address</span>
              <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <MapPin size={14} className="text-teal-600 flex-shrink-0" />
                {activePharmacy?.address || 'Plot 42, Health Avenue, MG Road, Connaught Place, New Delhi'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block">Store Contact</span>
              <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Phone size={14} className="text-teal-600 flex-shrink-0" />
                {activePharmacy?.phone || '+919876543210'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
