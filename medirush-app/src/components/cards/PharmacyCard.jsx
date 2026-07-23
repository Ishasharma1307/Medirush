import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Store, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PharmacyCard = ({ pharmacy, onClick, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-4 bg-white/40 hover:bg-white/70 backdrop-blur-sm rounded-2xl transition-colors duration-300 flex items-center justify-between cursor-pointer group border border-white/50 shadow-sm",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Store size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 leading-tight">{pharmacy.pharmacy_name}</h4>
          <p className="text-sm text-gray-500 flex items-center mt-1 font-medium">
            <MapPin size={14} className="mr-1 text-primary/50" /> Nearby
          </p>
        </div>
      </div>
      <div className={cn(
        "w-3 h-3 rounded-full shadow-lg",
        pharmacy.is_open ? "bg-secondary shadow-secondary/50 animate-pulse" : "bg-gray-400"
      )} />
    </motion.div>
  );
};

PharmacyCard.propTypes = {
  pharmacy: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
