import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { HealthcareMap } from '../components/HealthcareMap';
import { HealthcareFilters } from '../components/HealthcareFilters';
import { HealthcarePlaceCard } from '../components/HealthcarePlaceCard';
import { getSymptomRecommendation } from '../utils/symptomRecommendation';
import { mockHealthcarePlaces } from '../data/mockHealthcarePlaces';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const NearbyHealthcare = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [activeFilter, setActiveFilter] = useState('All');
  const [symptomSearch, setSymptomSearch] = useState('');
  const [symptomWarning, setSymptomWarning] = useState(null);

  const [loadingLoc, setLoadingLoc] = useState(true);

  const getUserLocation = () => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLoc(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // Fallback to NYC
          setLoadingLoc(false);
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
      setLoadingLoc(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Future Supabase connection point
      const placesWithDistances = mockHealthcarePlaces.map(place => ({
        ...place,
        distance: calculateDistance(userLocation.lat, userLocation.lng, place.latitude, place.longitude)
      }));
      setPlaces(placesWithDistances);
    }
  }, [userLocation]);

  const handleSymptomSearch = () => {
    const recommendation = getSymptomRecommendation(symptomSearch);
    if (recommendation) {
      setActiveFilter(recommendation.suggestedType);
      if (recommendation.requireEmergency) {
        setSymptomWarning(recommendation.warning);
      } else {
        setSymptomWarning(null);
      }
    } else {
      setActiveFilter('All');
      setSymptomWarning(null);
    }
  };

  const filteredPlaces = places.filter(place => {
    if (place.distance > selectedRadius) return false;
    if (activeFilter !== 'All' && place.type !== activeFilter) return false;
    if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 relative overflow-hidden font-sans">
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-4 z-[1000] flex gap-3 pointer-events-auto"
      >
        <button 
          onClick={() => navigate('/home')}
          className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-glass border border-white/60 text-gray-700 hover:text-primary transition-colors flex items-center hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 md:top-6 left-4 md:left-24 z-[1000] w-[calc(100%-32px)] md:w-[360px] max-w-sm pointer-events-auto"
      >
        <HealthcareFilters 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          selectedRadius={selectedRadius} setSelectedRadius={setSelectedRadius}
          activeFilter={activeFilter} setActiveFilter={setActiveFilter}
          symptomSearch={symptomSearch} setSymptomSearch={setSymptomSearch}
          handleSymptomSearch={handleSymptomSearch}
        />

        <AnimatePresence>
        {symptomWarning && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-4 bg-danger/10 backdrop-blur-md border border-danger/20 rounded-2xl p-4 shadow-glass flex items-start"
          >
            <div className="bg-white/80 p-1.5 rounded-lg shadow-inner mr-3 mt-0.5 border border-white/50">
               <AlertTriangle className="text-danger flex-shrink-0 animate-pulseSoft" size={16} />
            </div>
            <p className="text-[11px] text-danger font-bold uppercase tracking-wider leading-relaxed">{symptomWarning}</p>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      <HealthcarePlaceCard 
        place={activePlace} 
        onClose={() => setActivePlace(null)}
        userLocation={userLocation}
      />

      {/* Fullscreen Map Area */}
      <div className="absolute inset-0 z-0 pt-0">
        {!loadingLoc && (
          <HealthcareMap 
            userLocation={userLocation}
            places={filteredPlaces}
            activePlace={activePlace}
            onPlaceSelect={setActivePlace}
            onRecenter={getUserLocation}
          />
        )}
        {loadingLoc && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center shadow-floating animate-pulseSoft">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 shadow-inner"></div>
              <p className="text-primary font-bold tracking-widest text-xs uppercase">Locating you...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
