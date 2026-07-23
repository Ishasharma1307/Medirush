import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind, Heart, Bandage, Thermometer, Pill, HelpCircle,
  Phone, Navigation, Share2, AlertTriangle, MapPin,
  Clock, Loader2, Hospital, Stethoscope,
  Ambulance, ShoppingBag, ArrowLeft, Zap, Shield, LocateFixed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// ─── Fix Leaflet default icons ──────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ─── Custom map marker icons ────────────────────────────────────────────────
const makeIcon = (color, emoji) => L.divIcon({
  className: '',
  html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 8px 16px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;backdrop-filter:blur(4px);">${emoji}</div>`,
  iconSize: [36, 36], iconAnchor: [18, 18],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:#E53935;opacity:0.3;animation:mr-ping 1.5s cubic-bezier(0,0,.2,1) infinite;"></div>
    <div style="width:18px;height:18px;background:#E53935;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(229,57,53,0.5);"></div>
  </div>`,
  iconSize: [40, 40], iconAnchor: [20, 20],
});

// ─── Map fly-to helper ──────────────────────────────────────────────────────
const MapFly = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

// ─── Haversine distance (km) ────────────────────────────────────────────────
const calcDist = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

// ─── Emergency type definitions ─────────────────────────────────────────────
const EMERGENCY_TYPES = [
  { id: 'breathing', label: 'Breathing Issue',  icon: Wind,        color: 'from-sky-400 to-blue-500',      bg: 'bg-sky-500/10',    border: 'border-sky-500/20',    text: 'text-sky-600'    },
  { id: 'chest',     label: 'Chest Pain',          icon: Heart,       color: 'from-red-400 to-danger',       bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-600'    },
  { id: 'injury',    label: 'Accident/Injury',   icon: Bandage,     color: 'from-orange-400 to-amber-500',  bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-600' },
  { id: 'fever',     label: 'Severe Fever',        icon: Thermometer, color: 'from-yellow-400 to-orange-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-600' },
  { id: 'medicine',  label: 'Urgent Medicine',  icon: Pill,        color: 'from-violet-400 to-purple-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-600' },
  { id: 'other',     label: 'Other',     icon: HelpCircle,  color: 'from-gray-400 to-slate-500',    bg: 'bg-gray-500/10',   border: 'border-gray-500/20',   text: 'text-gray-600'   },
];

// ─── Mock nearby places builder ─────────────────────────────────────────────
const buildNearbyPlaces = (lat, lng) => [
  { id: 'h1', category: 'Hospital',      name: 'General City Hospital',   lat: lat + 0.003, lng: lng + 0.002, phone: '+91-112',      isOpen: true,  is24x7: true,  icon: '🏥', iconColor: '#E53935' },
  { id: 'a1', category: 'Ambulance',     name: 'MediRush Ambulance',      lat: lat - 0.002, lng: lng + 0.004, phone: '+91-102',      isOpen: true,  is24x7: true,  icon: '🚑', iconColor: '#1565C0' },
  { id: 'p1', category: '24/7 Pharmacy', name: 'City Central Pharmacy',  lat: lat - 0.003, lng: lng - 0.002, phone: '+91-555-0101', isOpen: true,  is24x7: true,  icon: '💊', iconColor: '#7B1FA2' },
];

const CATEGORY_META = {
  Hospital:       { Icon: Hospital,     accent: 'text-red-500',    ring: 'ring-red-500/20',    bg: 'bg-red-500/10'     },
  Ambulance:      { Icon: Ambulance,    accent: 'text-blue-500',   ring: 'ring-blue-500/20',   bg: 'bg-blue-500/10'    },
  Doctor:         { Icon: Stethoscope,  accent: 'text-green-500',  ring: 'ring-green-500/20',  bg: 'bg-green-500/10'   },
  '24/7 Pharmacy':{ Icon: ShoppingBag,  accent: 'text-violet-500', ring: 'ring-violet-500/20', bg: 'bg-violet-500/10'  },
};

// ═══════════════════════════════════════════════════════════════════════════════
export const EmergencyRequest = () => {
  const navigate = useNavigate();
  const [selected,     setSelected]     = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locLoading,   setLocLoading]   = useState(false);
  const [places,       setPlaces]       = useState([]);
  const [shared,       setShared]       = useState(false);
  const [toast,        setToast]        = useState('');
  const resultsRef = useRef(null);

  // ── Geolocation ──────────────────────────────────────────────────────────
  const getLocation = (onSuccess) => {
    setLocLoading(true);
    const ok = (pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserLocation(loc);
      setLocLoading(false);
      onSuccess?.(loc);
    };
    const err = () => {
      const loc = { lat: 28.6139, lng: 77.2090 }; // Delhi fallback
      setUserLocation(loc);
      setLocLoading(false);
      onSuccess?.(loc);
    };
    navigator.geolocation?.getCurrentPosition(ok, err, { timeout: 7000 });
    if (!navigator.geolocation) err();
  };

  // ── Show toast ────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  // ── Select emergency type ─────────────────────────────────────────────────
  const handleSelect = (type) => {
    setSelected(type);
    if (!userLocation) getLocation();
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  };

  // ── Build places whenever location updates ────────────────────────────────
  useEffect(() => {
    if (userLocation) {
      setPlaces(
        buildNearbyPlaces(userLocation.lat, userLocation.lng).map(p => ({
          ...p,
          distance: calcDist(userLocation.lat, userLocation.lng, p.lat, p.lng),
        }))
      );
    }
  }, [userLocation]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCall      = (phone) => window.open(`tel:${phone}`);
  const handleDirections = (lat, lng) =>
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);

  const handleGetDirections = () => {
    if (!userLocation) {
      showToast('📍 Detecting your location…');
      getLocation((loc) => handleDirections(loc.lat + 0.003, loc.lng + 0.002));
    } else {
      handleDirections(userLocation.lat + 0.003, userLocation.lng + 0.002);
    }
  };

  const handleShareLocation = () => {
    const share = (loc) => {
      const url = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
      if (navigator.share) {
        navigator.share({ title: 'My Emergency Location', url });
      } else {
        navigator.clipboard?.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
        showToast('📋 Location link copied!');
      }
    };
    if (!userLocation) {
      showToast('📍 Detecting your location…');
      getLocation(share);
    } else {
      share(userLocation);
    }
  };

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.2090];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-16 relative overflow-x-hidden">

      <style>{`
        @keyframes mr-ping  { 75%,100%{transform:scale(2.5);opacity:0} }
      `}</style>

      {/* ── TOAST ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[9999]"
          >
            <div className="bg-gray-900/90 backdrop-blur-md text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-glass whitespace-nowrap border border-white/10">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-danger to-red-800 px-5 pt-10 pb-20 shadow-floating rounded-b-[2.5rem]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        <button
          onClick={() => navigate('/home')}
          className="absolute top-5 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-2xl transition-all shadow-sm border border-white/20"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md mx-auto mt-4"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 p-4 rounded-full shadow-glass">
                <Zap size={32} className="text-white" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 text-red-50 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider shadow-sm">
            <Shield size={12} /> Emergency Mode Active
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Need urgent help?
          </h1>
          <p className="text-red-100 mt-2 text-base font-medium max-w-xs mx-auto leading-relaxed drop-shadow-sm">
            Find nearby emergency medical support instantly.
          </p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 -mt-10 space-y-6 relative z-10"
      >

        {/* ── ONE-TAP ACTIONS ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
            One-tap actions
          </p>
          <div className="grid grid-cols-3 gap-3">

            {/* Call 112 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('tel:112')}
              className="flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-red-500 to-danger text-white font-bold py-5 rounded-2xl shadow-lg shadow-danger/30 transition-all"
            >
              <Phone size={26} strokeWidth={2.5} />
              <span className="text-sm">Call 112</span>
            </motion.button>

            {/* Get Directions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetDirections}
              className="flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-blue-500 to-primary text-white font-bold py-5 rounded-2xl shadow-lg shadow-primary/30 transition-all"
            >
              <Navigation size={26} strokeWidth={2.5} />
              <span className="text-sm">Directions</span>
            </motion.button>

            {/* Share Location */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareLocation}
              className={`flex flex-col items-center justify-center gap-2 font-bold py-5 rounded-2xl shadow-lg transition-all ${
                shared
                  ? 'bg-gradient-to-b from-green-500 to-secondary text-white shadow-secondary/30'
                  : 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 shadow-soft'
              }`}
            >
              <Share2 size={26} strokeWidth={2.5} className={shared ? "text-white" : "text-gray-600"} />
              <span className="text-sm">{shared ? 'Copied!' : 'Share Loc'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── EMERGENCY TYPE SELECTION ─────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 px-1 tracking-tight">
            What's the emergency?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {EMERGENCY_TYPES.map(({ id, label, icon: Icon, color, bg, border, text }) => {
              const isActive = selected?.id === id;
              return (
                <motion.button
                  key={id}
                  whileHover={{ scale: isActive ? 1.02 : 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect({ id, label })}
                  className={`
                    relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left
                    font-bold transition-all duration-300
                    ${isActive
                      ? `bg-gradient-to-br ${color} text-white border-transparent shadow-lg shadow-danger/20`
                      : `bg-white/70 backdrop-blur-sm ${border} ${text} hover:shadow-soft`
                    }
                  `}
                >
                  <div className={`${isActive ? 'bg-white/20' : bg} p-2.5 rounded-xl flex-shrink-0 shadow-sm backdrop-blur-sm`}>
                    <Icon size={22} className={isActive ? 'text-white' : ''} strokeWidth={2} />
                  </div>
                  <span className="text-sm leading-tight">{label}</span>
                  {isActive && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── NEAREST SUPPORT ──────────────────────────────────────────── */}
        <AnimatePresence>
          {selected && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              ref={resultsRef} 
              className="space-y-4 pt-4"
            >

              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Nearest Support
                </h2>
                <span className="text-xs font-bold bg-danger/10 text-danger px-3 py-1 rounded-full border border-danger/20">
                  {selected.label}
                </span>
              </div>

              {locLoading ? (
                <div className="glass-card flex flex-col items-center justify-center py-14">
                  <Loader2 size={36} className="text-danger animate-spin mb-3" />
                  <p className="text-gray-500 font-semibold text-sm">Locating nearest help…</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {places.map((place, i) => {
                    const meta = CATEGORY_META[place.category] ?? CATEGORY_META['Hospital'];
                    return (
                      <motion.div
                        key={place.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card-hover p-4"
                      >
                        <div className="flex items-center gap-4">

                          <div className={`${meta.bg} ring-1 ${meta.ring} p-3.5 rounded-2xl flex-shrink-0`}>
                            <meta.Icon size={22} className={meta.accent} strokeWidth={2} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {place.category}
                              </span>
                              {place.is24x7 && (
                                <span className="font-extrabold bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide text-[9px] border border-green-500/20">
                                  24/7
                                </span>
                              )}
                            </div>
                            <h3 className="font-extrabold text-gray-900 leading-tight truncate text-[15px]">
                              {place.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                                <MapPin size={12} className="text-danger" />
                                {place.distance} km
                              </span>
                              <span className={`flex items-center gap-1 text-xs font-bold ${place.isOpen ? 'text-green-600' : 'text-gray-400'}`}>
                                <Clock size={12} />
                                {place.isOpen ? 'Open Now' : 'Closed'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button size="sm" variant="danger" className="py-1.5 px-3 text-xs shadow-danger/20" onClick={() => handleCall(place.phone)}>
                              <Phone size={13} strokeWidth={2.5} className="mr-1.5" /> Call
                            </Button>
                            <Button size="sm" variant="primary" className="py-1.5 px-3 text-xs shadow-primary/20" onClick={() => handleDirections(place.lat, place.lng)}>
                              <Navigation size={13} strokeWidth={2.5} className="mr-1.5" /> Go
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* ── LIVE MAP PREVIEW ─────────────────────────────────────── */}
              {!locLoading && userLocation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/30 bg-white/40">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-danger" />
                      <span className="font-bold text-gray-800 text-sm">Live Map</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulseSoft shadow-sm shadow-green-500" />
                      {places.length} nearby
                    </div>
                  </div>

                  <div style={{ height: 240 }} className="z-0">
                    <MapContainer
                      center={mapCenter}
                      zoom={14}
                      style={{ height: '100%', width: '100%', zIndex: 0 }}
                      zoomControl={false}
                      scrollWheelZoom={false}
                      dragging={true}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution="&copy; OpenStreetMap"
                      />
                      <MapFly center={mapCenter} />
                      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup className="custom-popup"><strong>📍 You are here</strong></Popup>
                      </Marker>
                      {places.map(p => (
                        <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon(p.iconColor, p.icon)}>
                          <Popup>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#555' }}>{p.category} · {p.distance} km</div>
                            <Button size="sm" variant="danger" className="mt-2 w-full" onClick={() => handleCall(p.phone)}>
                              📞 Call
                            </Button>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>

                  <button
                    onClick={() => { setLocLoading(true); getLocation(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-white/30 bg-white/40 backdrop-blur-sm"
                  >
                    <LocateFixed size={15} /> Re-detect my location
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SAFETY WARNING ───────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="flex items-start gap-4 bg-orange-50/80 backdrop-blur-md border border-orange-200/60 rounded-3xl p-5 shadow-sm"
        >
          <div className="bg-white/80 p-2.5 rounded-2xl shadow-sm border border-orange-100 flex-shrink-0">
            <AlertTriangle size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="font-extrabold text-orange-900 text-sm mb-1">Safety Warning</p>
            <p className="text-orange-800 text-xs leading-relaxed font-medium">
              For serious emergencies, contact official emergency services immediately.{' '}
              <button
                onClick={() => window.open('tel:112')}
                className="underline font-extrabold text-danger hover:text-red-800 transition-colors"
              >
                Call 112 now →
              </button>
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};
