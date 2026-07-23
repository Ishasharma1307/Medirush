import React from 'react';
import { Search, Filter, AlertTriangle, Pill, Activity, Stethoscope, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const HealthcareFilters = ({ 
  searchQuery, setSearchQuery, 
  selectedRadius, setSelectedRadius, 
  activeFilter, setActiveFilter,
  symptomSearch, setSymptomSearch,
  handleSymptomSearch
}) => {
  
  const filters = [
    { id: 'All', label: 'All Places', icon: Filter },
    { id: 'Pharmacy', label: 'Pharmacies', icon: Pill },
    { id: 'Hospital', label: 'Hospitals', icon: Activity },
    { id: 'Clinic', label: 'Clinics', icon: Stethoscope },
    { id: 'Medical store', label: 'Stores', icon: Store },
  ];

  const commonSymptoms = ["Fever", "Headache", "Cough", "Injury", "Chest Pain"];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white/60 p-5 space-y-5">
      
      {/* Symptom Checker Section */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 bg-orange-500/10 w-20 h-20 rounded-full blur-xl"></div>
        <h3 className="text-[11px] font-bold text-orange-800 uppercase tracking-widest mb-3 flex items-center relative z-10">
          <AlertTriangle size={14} className="mr-1.5 text-orange-500" /> AI Symptom Match
        </h3>
        <div className="flex gap-2 mb-3 relative z-10">
          <input 
            type="text" 
            placeholder="Type symptom (e.g. Fever)"
            value={symptomSearch}
            onChange={(e) => setSymptomSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl text-sm font-bold outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 shadow-inner placeholder:text-gray-400 placeholder:font-medium transition-all"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSymptomSearch}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 border border-orange-400"
          >
            Find
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          {commonSymptoms.map(sym => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={sym}
              onClick={() => { 
                setSymptomSearch(sym);
              }}
              className="text-[10px] bg-white/80 backdrop-blur-sm border border-white/50 text-orange-800 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-100 hover:border-orange-200 shadow-sm transition-colors uppercase tracking-wider"
            >
              {sym}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Standard Search */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/60 shadow-inner rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 placeholder:font-medium"
        />
        <Search className="absolute left-4 top-3.5 text-primary/60" size={18} />
      </div>

      {/* Radius Dropdown */}
      <div className="flex items-center justify-between bg-white/40 p-3 rounded-xl border border-white/50 shadow-sm">
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest ml-1">Search Radius</span>
        <select 
          value={selectedRadius}
          onChange={(e) => setSelectedRadius(Number(e.target.value))}
          className="bg-white/80 border border-white/60 text-primary text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none cursor-pointer pr-8 relative"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
        >
          <option value={1}>1 km</option>
          <option value={3}>3 km</option>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={50}>50 km</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto pb-2 pt-1 gap-2.5 scrollbar-hide">
        {filters.map((f) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "flex items-center flex-shrink-0 px-4 py-2 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all border shadow-sm",
              activeFilter === f.id 
                ? "bg-gradient-to-r from-primary to-primary-light border-transparent text-white shadow-primary/30" 
                : "bg-white/80 border-white/60 text-gray-600 hover:border-primary/30 hover:bg-white"
            )}
          >
            <f.icon size={14} className="mr-1.5" /> {f.label}
          </motion.button>
        ))}
      </div>

    </div>
  );
};
