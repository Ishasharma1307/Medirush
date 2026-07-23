import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const PharmacyFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Open Now', '24/7', 'Delivery Available', 'Verified', 'Nearest First'];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {filters.map(filter => (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={cn(
            "flex-shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border shadow-sm",
            activeFilter === filter 
              ? "bg-gradient-to-r from-primary to-primary-light text-white border-transparent shadow-primary/30" 
              : "bg-white/80 backdrop-blur-sm text-gray-600 border-white/60 hover:bg-white hover:border-primary/30"
          )}
        >
          {filter}
        </motion.button>
      ))}
    </div>
  );
};
