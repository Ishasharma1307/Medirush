import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Map, Store, Navigation, PhoneCall, CheckCircle2, Clock, X, Info, MapPin } from 'lucide-react';
import { PharmacyCard } from '../components/PharmacyCard';
import { PharmacyFilters } from '../components/PharmacyFilters';
import { mockPharmacies } from '../data/mockPharmacies';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

export const PharmacyDirectory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  useEffect(() => {
    // Simulate fetch
    setLoading(true);
    setTimeout(() => {
      setPharmacies(mockPharmacies);
      setLoading(false);
    }, 800);
  }, []);

  let filtered = pharmacies.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase()));
  
  if (activeFilter === 'Open Now') filtered = filtered.filter(p => p.is_open);
  if (activeFilter === '24/7') filtered = filtered.filter(p => p.is_24x7);
  if (activeFilter === 'Delivery Available') filtered = filtered.filter(p => p.delivery_available);
  if (activeFilter === 'Verified') filtered = filtered.filter(p => p.verified);
  if (activeFilter === 'Nearest First') filtered.sort((a, b) => a.distance - b.distance);

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
      <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-primary pt-10 pb-24 px-5 relative overflow-hidden rounded-b-[3rem] shadow-floating">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => navigate('/home')} className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 p-2.5 rounded-xl transition-all mb-5 inline-flex shadow-sm">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">Nearby Pharmacies</h1>
            <p className="text-blue-100 mt-2 text-[11px] uppercase tracking-widest font-bold drop-shadow-sm">Trusted pharmacies near your location.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary/60" />
            </div>
            <input
              type="text"
              placeholder="Search pharmacy name or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white shadow-glass placeholder:text-gray-400 placeholder:font-medium transition-all"
            />
          </motion.div>
        </div>
      </div>

      {/* ── MAP PLACEHOLDER ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="glass-card p-2 shadow-floating border-white/60 mb-8 h-48 overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-primary/5 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPHBhdGggZD0iTTAgNDBMMDAgMEMyMCAwIDAgMjAgMCA0MHoiIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')]"></div>
          <div className="absolute inset-0 flex items-center justify-center flex-col bg-white/20 backdrop-blur-[2px]">
            <div className="bg-primary/20 border border-primary/30 text-primary p-4 rounded-2xl shadow-inner mb-3 group-hover:scale-110 transition-transform duration-300">
              <Map size={28} />
            </div>
            <p className="font-extrabold text-primary text-sm tracking-widest uppercase drop-shadow-sm">Interactive Map Area</p>
            <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mt-1 bg-white/60 px-2 py-0.5 rounded shadow-sm">(Maps API Integration required)</p>
          </div>
        </div>
      </div>

      {/* ── FILTERS & GRID ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-8">
          <PharmacyFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-72 border-white/60 animate-pulseSoft"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-12 text-center flex flex-col items-center justify-center border-white/60">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-full mb-6 border border-white/50 shadow-inner">
              <Store size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">No pharmacies found</h2>
            <p className="text-gray-500 font-bold text-[11px] uppercase tracking-widest">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((pharmacy) => (
              <motion.div variants={itemVariants} key={pharmacy.id}>
                <PharmacyCard pharmacy={pharmacy} onViewDetails={setSelectedPharmacy} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── DETAILS MODAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPharmacy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
              onClick={() => setSelectedPharmacy(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] w-full max-w-lg shadow-glass border border-white/60 overflow-hidden relative z-10"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-8 relative border-b border-white/50">
                <button onClick={() => setSelectedPharmacy(null)} className="absolute top-6 right-6 p-2 bg-white/60 hover:bg-white backdrop-blur-md rounded-xl text-gray-500 border border-white/50 shadow-sm transition-all hover:scale-105">
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-white/80 backdrop-blur-sm border border-white text-primary rounded-2xl shadow-inner flex items-center justify-center mb-5">
                  <Store size={28} />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">{selectedPharmacy.name}</h2>
                {selectedPharmacy.is_open ? (
                  <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-widest text-green-700 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg shadow-sm">
                    <CheckCircle2 size={12} className="mr-1.5" /> Available Now
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-widest text-danger bg-danger/10 border border-danger/20 px-3 py-1.5 rounded-lg shadow-sm">
                    <Clock size={12} className="mr-1.5" /> Currently Closed
                  </span>
                )}
              </div>
              
              <div className="p-8 space-y-5 bg-white/40">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-inner border border-gray-100 flex-shrink-0 mt-0.5">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <p className="text-sm text-gray-700 font-bold leading-relaxed">{selectedPharmacy.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-inner border border-gray-100 flex-shrink-0">
                    <PhoneCall size={20} className="text-primary" />
                  </div>
                  <p className="text-sm text-gray-700 font-extrabold">{selectedPharmacy.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-white p-2 rounded-xl shadow-inner border border-gray-100 flex-shrink-0">
                     <Info size={20} className="text-primary" />
                  </div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-600 font-bold">Over {selectedPharmacy.medicines_available}+ medicines available</p>
                </div>
                
                <div className="pt-5 border-t border-gray-200/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Available Services</p>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedPharmacy.services.map((s, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-gray-700 bg-white/80 border border-white shadow-sm px-3 py-1.5 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-5">
                  <Button variant="glass" className="py-4 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10">
                    <Navigation size={16} /> Get Directions
                  </Button>
                  <a href={`tel:${selectedPharmacy.phone}`} className="py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-blue-700 flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-primary/30 active:scale-95 transition-all text-[11px] uppercase tracking-widest">
                    <PhoneCall size={16} /> Call Pharmacy
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
