import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Pill, ShieldCheck, AlertTriangle, ArrowRight, ShoppingCart, Loader2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

export const RecentMedicines = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentMedicines();
  }, [user]);

  const fetchRecentMedicines = async () => {
    try {
      setLoading(true);
      
      // If demo user, use mock data
      if (user && user.id === 'demo-123') {
        await new Promise(resolve => setTimeout(resolve, 800)); // simulate network
        setMedicines([
          { id: 1, name: 'Paracetamol 500mg', price: 5.99, is_available: true, requires_prescription: false, images: ['https://images.unsplash.com/photo-1584308666744-24d5e478ac6c?auto=format&fit=crop&q=80&w=300&h=300'] },
          { id: 2, name: 'Amoxicillin 250mg', price: 12.50, is_available: true, requires_prescription: true, images: ['https://images.unsplash.com/photo-1626716493137-b67fe9501e76?auto=format&fit=crop&q=80&w=300&h=300'] },
          { id: 3, name: 'Cetirizine 10mg', price: 8.00, is_available: false, requires_prescription: false, images: ['https://images.unsplash.com/photo-1550572017-edb3df417409?auto=format&fit=crop&q=80&w=300&h=300'] },
          { id: 4, name: 'Ibuprofen 400mg', price: 6.50, is_available: true, requires_prescription: false, images: ['https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=300&h=300'] },
          { id: 5, name: 'Cough Syrup', price: 9.99, is_available: true, requires_prescription: false, images: [] },
        ]);
        setLoading(false);
        return;
      }

      // Real fetch from Supabase
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMedicines(data);
    } catch (error) {
      console.error('Error fetching recent medicines:', error);
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

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-indigo-800 px-5 pt-10 pb-20 shadow-floating rounded-b-[2.5rem]">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/home')} 
          className="absolute top-5 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 p-2.5 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} className="text-white" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md mx-auto mt-4"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 p-3.5 rounded-2xl shadow-glass">
              <Pill size={32} className="text-white drop-shadow-sm" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">Recent Medicines</h1>
          <p className="text-blue-100 mt-2 text-[11px] font-bold uppercase tracking-widest drop-shadow-sm">Recently added medicines near you.</p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-72 border-white/60 animate-pulseSoft"></div>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center flex flex-col items-center justify-center border-white/60"
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-full mb-6 border border-white/50 shadow-inner">
              <Pill size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">No recent medicines found</h2>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Pharmacies haven't added any medicines yet.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {medicines.map((med) => (
              <motion.div 
                variants={itemVariants}
                key={med.id} 
                className="glass-card border-white/60 overflow-hidden hover:shadow-floating transition-all duration-300 flex flex-col h-full group"
              >
                {/* Image Section */}
                <div className="h-48 bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden relative group border-b border-white/50">
                  {med.images && med.images.length > 0 ? (
                    <img 
                      src={med.images[0]} 
                      alt={med.name} 
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-gray-400/50 flex flex-col items-center">
                       <Pill size={48} className="mb-2" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={cn(
                      "inline-flex items-center text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-md border",
                      med.is_available ? "bg-white/90 text-secondary border-white" : "bg-danger/90 text-white border-danger"
                    )}>
                      {med.is_available ? <><ShieldCheck size={12} className="mr-1.5"/> In Stock</> : <><AlertTriangle size={12} className="mr-1.5"/> Out of Stock</>}
                    </span>
                    {med.requires_prescription && (
                      <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-md bg-primary/90 border border-primary/20 text-white">
                        <FileText size={12} className="mr-1.5"/> Rx Required
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-5 flex flex-col flex-grow bg-white/40">
                  <span className="text-[9px] font-extrabold text-primary mb-1.5 uppercase tracking-widest bg-primary/10 border border-primary/20 w-fit px-2 py-0.5 rounded shadow-sm">{med.category || 'Medicine'}</span>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-2 line-clamp-1 drop-shadow-sm">{med.name}</h3>
                  <div className="flex items-baseline text-primary mb-4 bg-primary/5 border border-primary/10 w-fit px-3 py-1.5 rounded-xl shadow-inner">
                    <span className="text-sm font-bold mr-0.5">$</span>
                    <span className="text-2xl font-extrabold tracking-tight drop-shadow-sm">{med.price}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/50">
                    <Link 
                      to={`/medicines/${med.id}`}
                      className="flex items-center justify-center py-2.5 rounded-xl text-primary font-bold bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors text-[11px] uppercase tracking-widest shadow-sm"
                    >
                      Details
                    </Link>
                    <Button 
                      disabled={!med.is_available}
                      variant={med.is_available ? "primary" : "outline"}
                      className={cn(
                        "flex items-center justify-center gap-1.5 py-2.5 text-[11px] uppercase tracking-widest",
                        med.is_available ? "shadow-lg shadow-primary/30" : "opacity-50 cursor-not-allowed bg-transparent text-gray-500 border-gray-300"
                      )}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
