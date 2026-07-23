import React from 'react';
import { X, MapPin, Phone, Star, Navigation, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

export const HealthcarePlaceCard = ({ place, onClose, userLocation }) => {
  if (!place) return null;

  const handleDirections = () => {
    if (!userLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute bottom-6 left-6 right-6 md:left-24 md:bottom-10 md:right-auto md:w-[400px] z-[1000] pointer-events-auto"
      >
        <div className="glass-card shadow-floating border-white/60 overflow-hidden flex flex-col">
          
          {/* Header Image & Close */}
          <div className="relative h-40 bg-gray-200">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-black/60 transition-colors border border-white/20 shadow-sm"
            >
              <X size={16} />
            </button>
            
            <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
              <div>
                <span className="bg-white/20 backdrop-blur-md border border-white/30 shadow-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest mb-1.5 inline-block">
                  {place.type}
                </span>
                <h3 className="text-white font-extrabold text-xl leading-tight line-clamp-1 drop-shadow-md">{place.name}</h3>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div className="p-6 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm",
                  place.isOpen ? "bg-green-500/10 text-green-700 border-green-500/20" : "bg-danger/10 text-danger border-danger/20"
                )}>
                  {place.isOpen ? 'Open Now' : 'Closed'}
                </span>
                {place.is24x7 && (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-sm">
                    24/7
                  </span>
                )}
              </div>
              <div className="flex items-center text-yellow-500 text-sm font-extrabold bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20 shadow-sm">
                <Star size={14} className="fill-current mr-1" /> {place.rating}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start text-sm text-gray-700 font-medium">
                <div className="bg-white shadow-sm border border-gray-100 p-1.5 rounded-lg mr-3 flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-primary" />
                </div>
                <p className="line-clamp-2 leading-relaxed">{place.address}</p>
              </div>
              <div className="flex items-center text-sm text-gray-700 font-medium">
                <div className="bg-white shadow-sm border border-gray-100 p-1.5 rounded-lg mr-3 flex-shrink-0">
                   <Phone size={16} className="text-primary" />
                </div>
                <p>{place.phone}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 font-medium bg-primary/5 p-3 rounded-xl border border-primary/10 shadow-inner">
                <div className="flex items-center">
                  <Navigation size={16} className="mr-2 text-primary" />
                  <span className="font-bold text-primary">{place.distance ? `${place.distance.toFixed(1)} km away` : 'Calculating...'}</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary/70">~{place.distance ? Math.round(place.distance * 3) : '--'} min drive</span>
              </div>
            </div>

            {place.emergencySupport && (
              <div className="bg-danger/10 text-danger text-[11px] font-bold p-3 rounded-xl mb-6 flex items-center border border-danger/20 shadow-sm uppercase tracking-wider">
                <AlertTriangle size={16} className="mr-2 flex-shrink-0 animate-pulseSoft" />
                Emergency Support Available
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleDirections}
                disabled={!userLocation}
                variant="primary"
                className="flex-1 py-3 shadow-lg shadow-primary/30"
              >
                <Navigation size={18} className="mr-2" /> Directions
              </Button>
              <Button 
                variant="glass"
                className="px-5 border-gray-200 text-gray-700 hover:bg-white hover:text-primary"
              >
                <Phone size={18} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
