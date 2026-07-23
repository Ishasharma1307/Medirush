import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { mockMedicines } from '../mockData/mockMedicines';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Pill, ArrowRight 
} from 'lucide-react';
import { Input } from '../components/forms/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

const USE_MOCK_DATA = true;

export const Medicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setMedicines(mockMedicines);
      } else {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="min-h-screen bg-background pb-20 font-sans overflow-x-hidden"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary via-primary-dark to-blue-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 shadow-floating relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute top-[10%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl mix-blend-overlay animate-pulseSoft"></div>
        <div className="absolute bottom-[-20%] left-[5%] w-64 h-64 rounded-full bg-primary-light/20 blur-2xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">Pharmacy Store</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
            Order authentic medicines delivered to your door in minutes.
          </p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Back and Search */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button 
            onClick={() => navigate('/home')} 
            className="inline-flex items-center text-gray-700 hover:text-primary font-bold transition-colors group self-start md:self-auto bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-sm border border-white/40"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </button>
          
          <div className="relative w-full md:w-96 shadow-glass rounded-xl bg-white/70 backdrop-blur-md border border-white/50 group">
            <input 
              type="text" 
              placeholder="Search medicines or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 bg-transparent border-none rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" size={22} />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-[340px] p-4 flex flex-col gap-4">
                <Skeleton className="w-full h-40 rounded-2xl" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-12 mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          /* Grid */
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMedicines.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="col-span-full glass-card p-12 text-center flex flex-col items-center"
                >
                  <div className="bg-white/50 backdrop-blur-md p-6 rounded-full mb-4 shadow-inner border border-white/60">
                    <Pill className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-800 text-xl">No medicines found</p>
                  <p className="text-gray-500 mt-2 font-medium">Try adjusting your search query.</p>
                </motion.div>
              ) : (
                filteredMedicines.map((med) => (
                  <motion.div variants={itemVariants} key={med.id}>
                    <Link to={`/medicines/${med.id}`} className="glass-card-hover overflow-hidden flex flex-col h-[340px] group border-white/60 relative">
                      {/* Image container */}
                      <div className="h-40 bg-white/40 backdrop-blur-sm flex items-center justify-center overflow-hidden relative shadow-inner">
                        {med.images && med.images.length > 0 ? (
                          <img 
                            src={med.images[0]} 
                            alt={med.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image';
                            }}
                          />
                        ) : (
                          <Pill size={48} className="text-gray-300" />
                        )}
                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={cn(
                            "inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border",
                            med.is_available ? "bg-white/90 text-secondary border-white" : "bg-danger/10 backdrop-blur-md text-danger border-danger/20"
                          )}>
                            {med.is_available ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="p-5 flex flex-col flex-grow bg-white/20 backdrop-blur-sm">
                        <span className="text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">{med.category || 'Medicine'}</span>
                        <h3 className="font-extrabold text-gray-900 text-lg mb-1 line-clamp-1">{med.name}</h3>
                        <p className="text-gray-600 text-sm font-medium line-clamp-2 mb-4 flex-grow opacity-90">
                          {med.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/30">
                          <div className="flex items-baseline text-primary drop-shadow-sm">
                            <span className="text-sm font-bold mr-0.5">$</span>
                            <span className="text-2xl font-extrabold tracking-tight">{med.price}</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-md text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shadow-sm border border-white/50">
                            <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
