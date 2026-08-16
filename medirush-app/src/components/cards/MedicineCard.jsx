import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Pill, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export const MedicineCard = ({ medicine, onClick, className }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "glass-card-hover p-5 flex items-center group cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="w-24 h-24 bg-white/50 rounded-2xl mr-5 flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-inner">
        {medicine.images && medicine.images.length > 0 ? (
          <img 
            src={medicine.images[0]} 
            alt={medicine.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <Pill size={32} className="text-gray-300" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg truncate pr-2">{medicine.name}</h3>
        <p className="text-primary font-extrabold mt-1 text-xl">₹{medicine.price}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className={cn(
            "inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg",
            medicine.is_available ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
          )}>
            {medicine.is_available ? (
              <><ShieldCheck size={14} className="mr-1" /> In Stock</>
            ) : (
              <><AlertTriangle size={14} className="mr-1" /> Out of Stock</>
            )}
          </span>
          <Button size="sm" variant={medicine.is_available ? 'primary' : 'outline'} disabled={!medicine.is_available} onClick={(e) => {
            e.stopPropagation();
            if(medicine.is_available) {
              // Add to cart logic would go here
            }
          }}>
            {medicine.is_available ? 'Add' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

MedicineCard.propTypes = {
  medicine: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
