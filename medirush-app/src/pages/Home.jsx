import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Pill, Leaf, MapPin, Stethoscope, FileText, Bell, Activity, 
  Store, ArrowRight, AlertTriangle, ShieldCheck, Zap
} from 'lucide-react';

import { ActionCard } from '../components/cards/ActionCard';
import { MedicineCard } from '../components/cards/MedicineCard';
import { PharmacyCard } from '../components/cards/PharmacyCard';
import { Button } from '../components/ui/Button';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('patient');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      if (user.id === 'demo-123') {
        setProfile(user.user_metadata || { name: 'Demo User', role: 'patient' });
        setMode(user.user_metadata?.role === 'pharmacy' ? 'pharmacy' : 'patient');
        setMedicines([
          { id: 1, name: 'Paracetamol 500mg', price: 5.99, is_available: true, images: ['https://images.unsplash.com/photo-1584308666744-24d5e478ac6c?auto=format&fit=crop&q=80&w=150&h=150'] },
          { id: 2, name: 'Amoxicillin 250mg', price: 12.50, is_available: true, images: ['https://images.unsplash.com/photo-1626716493137-b67fe9501e76?auto=format&fit=crop&q=80&w=150&h=150'] },
          { id: 3, name: 'Cetirizine 10mg', price: 8.00, is_available: false, images: ['https://images.unsplash.com/photo-1550572017-edb3df417409?auto=format&fit=crop&q=80&w=150&h=150'] },
          { id: 4, name: 'Ibuprofen 400mg', price: 6.50, is_available: true, images: ['https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=150&h=150'] }
        ]);
        setPharmacies([
          { id: 1, pharmacy_name: 'City Care Pharmacy', is_open: true },
          { id: 2, pharmacy_name: 'HealthPlus 24/7', is_open: true },
          { id: 3, pharmacy_name: 'MediLife Store', is_open: true }
        ]);
        setLoading(false);
        return;
      }
      
      const [userRes, medRes, pharmRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('medicines').select().limit(4).order('created_at', { ascending: false }),
        supabase.from('pharmacies').select('*').eq('is_open', true).limit(3)
      ]);
      
      if (userRes.data) {
        setProfile(userRes.data);
        setMode(userRes.data.role === 'pharmacy' ? 'pharmacy' : 'patient');
      }

      if (medRes.data) setMedicines(medRes.data);
      if (pharmRes.data) setPharmacies(pharmRes.data);

    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
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
      <div className="flex min-h-[80vh] items-center justify-center bg-background">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping h-16 w-16 rounded-full bg-primary opacity-20"></div>
          <Activity className="animate-pulse text-primary h-10 w-10 relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="min-h-screen bg-background pb-20 font-sans overflow-x-hidden"
    >
      
      {/* 1. Premium Hero Dashboard */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary via-primary-dark to-blue-900 pt-8 pb-28 px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-xl relative z-0 overflow-hidden">
        {/* Clean Header Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPHBhdGggZD0iTTAgMjBMMjAgMEMxMCAwIDAgMTAgMCAyMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] bg-repeat" style={{backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-glass border border-white/30 text-blue-50 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-glass">
              <ShieldCheck size={14} className="mr-1.5" /> Your Health, Our Priority
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Hello, {profile?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-blue-100 mt-2 text-lg md:text-xl max-w-xl font-medium drop-shadow-sm">
              Get emergency medicines delivered in 10 minutes when every second matters.
            </p>
          </div>
          
          {/* User Mode Toggle */}
          <div className="mt-6 md:mt-0 p-1 bg-black/20 backdrop-blur-md rounded-2xl inline-flex relative z-10">
            <button 
              onClick={() => setMode('patient')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center ${mode === 'patient' ? 'bg-white text-primary shadow-soft transform scale-100' : 'text-blue-900 hover:bg-white/50'}`}
            >
              Patient
            </button>
            <button 
              onClick={() => setMode('pharmacy')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center ${mode === 'pharmacy' ? 'bg-white text-primary shadow-soft transform scale-100' : 'text-blue-900 hover:bg-white/50'}`}
            >
              Pharmacy
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 space-y-10">
        
        {/* 3. Emergency Help Banner */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-red-600 to-danger border border-red-500 p-6 md:p-8 shadow-md rounded-3xl text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPHBhdGggZD0iTTAgMjBMMjAgMEMxMCAwIDAgMTAgMCAyMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSIvPgoJCTxwYXRoIGQ9Ik0yMCAyMEwyMCAwaC0yMEwyMCAyMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==')] bg-repeat" style={{backgroundSize: '20px 20px'}}></div>
          
          <div className="flex items-center mb-5 md:mb-0 relative z-10">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl mr-5 shadow-glass relative border border-white/30">
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulseSoft"></div>
              <Zap size={32} className="text-white relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Need medicine urgently?</h2>
              <p className="text-red-100 mt-1 text-lg font-medium">Critical care at your doorstep.</p>
            </div>
          </div>
          <Link to="/emergency-request" className="w-full md:w-auto relative z-10">
            <Button size="lg" className="w-full md:w-auto bg-white text-danger hover:bg-gray-50 shadow-glass border-none">
              Request Emergency Help
            </Button>
          </Link>
        </motion.div>

        {/* 2. Quick Actions Grid (Premium Glass Cards) */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Explore Services</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            <ActionCard title="Order Medicine" icon={Pill} onClick={() => navigate('/medicines')} colorClass="text-primary bg-primary/10" className="col-span-1" />
            <ActionCard title="Home Remedies" icon={Leaf} onClick={() => navigate('/home-remedies')} colorClass="text-secondary bg-secondary/10" className="col-span-1" />
            <ActionCard title="Nearby Pharmacy" icon={MapPin} onClick={() => navigate('/nearby')} colorClass="text-purple-600 bg-purple-600/10" className="col-span-1" />
            <ActionCard title="Symptom Checker" icon={Stethoscope} onClick={() => navigate('/symptom-checker')} colorClass="text-teal-600 bg-teal-600/10" className="col-span-1" />
            <ActionCard title="Upload Prescription" icon={FileText} onClick={() => navigate('/prescription-upload')} colorClass="text-orange-600 bg-orange-600/10" className="col-span-1" />
            <ActionCard title="Medicine Reminder" icon={Bell} onClick={() => navigate('/medicine-reminder')} colorClass="text-yellow-600 bg-yellow-600/10" className="col-span-1" />
            <ActionCard title="Report Simplifier" icon={Activity} onClick={() => navigate('/report-simplifier')} colorClass="text-pink-600 bg-pink-600/10" className="col-span-2 md:col-span-2" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          
          {/* 4. Recent Medicines */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Medicines</h2>
              <Link to="/recent-medicines" className="text-primary font-bold hover:text-primary-dark flex items-center group transition-colors px-4 py-2 rounded-xl hover:bg-primary/5">
                View All <ArrowRight size={18} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {medicines.length > 0 ? medicines.map((med) => (
                <MedicineCard 
                  key={med.id} 
                  medicine={med} 
                  onClick={() => navigate(`/medicines/${med.id}`)} 
                />
              )) : (
                <div className="col-span-1 sm:col-span-2 glass-card p-12 text-center text-gray-500 flex flex-col items-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4 shadow-inner">
                    <Pill className="h-12 w-12 text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-800 text-xl">No medicines found</p>
                  <p className="text-gray-500 mt-2">New products will appear here.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Pharmacies & Safety */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* 5. Nearby Pharmacies Preview */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-5 relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pharmacies</h2>
              </div>
              
              <div className="space-y-3 relative z-10">
                {pharmacies.length > 0 ? pharmacies.map((pharmacy) => (
                  <PharmacyCard 
                    key={pharmacy.id} 
                    pharmacy={pharmacy} 
                    onClick={() => navigate('/pharmacies')} 
                  />
                )) : (
                  <div className="p-8 text-center bg-white/50 rounded-2xl border border-white/60 shadow-inner">
                    <Store className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <p className="font-medium text-gray-500">No open pharmacies nearby.</p>
                  </div>
                )}
                
                <Button variant="ghost" fullWidth className="mt-3 text-primary hover:bg-primary/5" onClick={() => navigate('/pharmacies')}>
                  View Directory <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </div>
            </div>

            {/* 6. Health Safety Warning Card */}
            <div className="bg-orange-50 border border-orange-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                <AlertTriangle size={120} className="text-orange-600" />
              </div>
              <div className="flex items-start relative z-10">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm mr-4 flex-shrink-0 border border-orange-100">
                  <AlertTriangle className="text-orange-500" size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-orange-900 text-lg mb-2 tracking-tight">Critical Safety Notice</h3>
                  <p className="text-sm text-orange-800 leading-relaxed font-medium opacity-90">
                    For serious symptoms, severe chest pain, or trauma, do not wait. Visit the nearest hospital immediately or call emergency services.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
