import React from 'react';
import { Store, Star, MapPin, Clock, CheckCircle2, PhoneCall, Navigation } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

export const PharmacyCard = ({ pharmacy, onViewDetails }) => {
  return (
    <div className="glass-card border-white/60 overflow-hidden hover:shadow-floating transition-all duration-300 flex flex-col h-full group">
      <div className="p-5 flex flex-col flex-grow bg-white/40 backdrop-blur-md">
        <div className="flex items-start justify-between mb-5">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
            <Store size={28} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg shadow-sm">
              <Star size={14} className="text-yellow-500 fill-current mr-1 drop-shadow-sm" />
              <span className="text-xs font-extrabold text-yellow-700">{pharmacy.rating}</span>
            </div>
            {pharmacy.verified && (
              <span className="flex items-center text-[9px] font-extrabold uppercase tracking-widest text-green-700 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md shadow-sm">
                <CheckCircle2 size={10} className="mr-1" /> Verified
              </span>
            )}
          </div>
        </div>

        <h3 className="font-extrabold text-gray-900 text-xl mb-1 line-clamp-1 drop-shadow-sm">{pharmacy.name}</h3>
        
        <div className="space-y-3 mt-3 flex-grow">
          <p className="text-gray-600 text-sm flex items-start font-medium leading-relaxed">
            <div className="bg-white/80 p-1 rounded-md shadow-inner mr-2 flex-shrink-0 mt-0.5 border border-gray-100"><MapPin size={14} className="text-primary" /></div>
            <span className="line-clamp-2">{pharmacy.address}</span>
          </p>
          <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-xl border border-white/50 shadow-sm w-fit">
            <p className="text-primary text-[11px] uppercase tracking-widest flex items-center font-bold">
              <Navigation size={12} className="mr-1.5" /> {pharmacy.distance} km
            </p>
            <span className="text-gray-300 font-bold">•</span>
            <p className={cn("text-[11px] uppercase tracking-widest flex items-center font-bold", pharmacy.is_open ? "text-green-600" : "text-danger")}>
              <Clock size={12} className="mr-1.5" /> {pharmacy.is_open ? 'Open' : 'Closed'}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-5 mb-5">
          {pharmacy.is_24x7 && (
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-lg shadow-sm">24/7 Open</span>
          )}
          {pharmacy.delivery_available && (
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 px-2.5 py-1 rounded-lg shadow-sm">Delivery Available</span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-5 border-t border-white/50">
          <Button 
            onClick={() => onViewDetails(pharmacy)} 
            variant="glass"
            className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 py-3 text-[11px] uppercase tracking-widest"
          >
            Details
          </Button>
          <a href={`tel:${pharmacy.phone}`} className="flex items-center justify-center py-3 rounded-xl text-white font-bold bg-gradient-to-r from-primary to-blue-700 hover:opacity-90 shadow-lg shadow-primary/30 active:scale-95 transition-all text-[11px] uppercase tracking-widest gap-2">
            <PhoneCall size={14} /> Call Now
          </a>
        </div>
      </div>
    </div>
  );
};
