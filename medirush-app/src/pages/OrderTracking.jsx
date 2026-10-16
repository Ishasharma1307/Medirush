import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Clock, MapPin, Phone, ShieldCheck, 
  CheckCircle2, Navigation, Radio, Copy, Check, MessageSquare, 
  Store, AlertTriangle, Sparkles, RefreshCw, ShoppingBag, 
  ChevronRight, Bike, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

// Zomato/Blinkit Style Order Progression Stages
const TRACKING_STAGES = [
  { id: 1, label: 'Order Placed', desc: 'Order confirmed and sent to pharmacy terminal', timeOffset: '0m' },
  { id: 2, label: 'Pharmacist Accepted', desc: 'Licensed pharmacist verified Rx & stock', timeOffset: '2m' },
  { id: 3, label: 'Packed & Sealed', desc: 'Packed in cold-chain tamper-proof medical bag', timeOffset: '5m' },
  { id: 4, label: 'Out for Delivery', desc: 'Delivery partner picked up & riding to you', timeOffset: '8m' },
  { id: 5, label: 'Arrived at Doorstep', desc: 'Partner reached. Share OTP to collect', timeOffset: '12m' }
];

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderInfo, setOrderInfo] = useState(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(4); // Default to live delivery in progress
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [copiedOtp1, setCopiedOtp1] = useState(false);
  const [copiedOtp2, setCopiedOtp2] = useState(false);
  const [riderDistance, setRiderDistance] = useState('1.1 km away');
  const [secondsRemaining, setSecondsRemaining] = useState(480); // 8 mins countdown
  const [showCallModal, setShowCallModal] = useState(false);
  const [deliveryInstruction, setDeliveryInstruction] = useState('Ring doorbell');

  // ── 1. Hydrate Order from LocalStorage or Fallback ─────────────────────────
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('medirush_orders') || '[]');
      let targetOrder = null;

      if (id) {
        targetOrder = stored.find(o => String(o.id).toLowerCase() === String(id).toLowerCase());
      }

      // If no ID or match not found, take the latest order or fallback demo order
      if (!targetOrder && stored.length > 0) {
        targetOrder = stored[0];
      }

      // If still no orders in localStorage, create and persist a rich active delivery order
      if (!targetOrder) {
        const demoOrder = {
          id: id || `ORD-IN-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'Out for Delivery',
          date: new Date().toISOString(),
          total: 285.00,
          pharmacy_name: 'Apollo Pharmacy 24/7 Express',
          pharmacy_address: '100 Ft Road, Near Metro Pillar 42, Indiranagar',
          pharmacist_name: 'Dr. Arvind Swaminathan (Reg. #49102)',
          delivery_address: 'Flat 402, Green Glen Layout, Indiranagar, Bengaluru',
          deliveryEta: '8 mins',
          otp: '5821',
          items: [
            { name: 'Dolo 650mg Paracetamol Strip', quantity: 2, price: 32.50 },
            { name: 'Azithromycin 500mg (3 Tablets)', quantity: 1, price: 110.00 },
            { name: 'Pantocid 40mg Antacid Strip', quantity: 1, price: 110.00 }
          ],
          timeline: [
            { status: 'Pending', time: '10:15 AM', completed: true },
            { status: 'Accepted', time: '10:18 AM', completed: true },
            { status: 'Packed', time: '10:22 AM', completed: true },
            { status: 'Out for Delivery', time: '10:26 AM', completed: true },
            { status: 'Delivered', time: null, completed: false }
          ]
        };

        const updated = [demoOrder, ...stored];
        localStorage.setItem('medirush_orders', JSON.stringify(updated));
        targetOrder = demoOrder;
      }

      setOrderInfo(targetOrder);

      // Hydrate saved stage from localStorage to preserve across reloads
      const savedStage = localStorage.getItem(`medirush_stage_${targetOrder.id}`);
      if (savedStage) {
        setCurrentStage(parseInt(savedStage, 10));
      } else {
        const stageNum = targetOrder.status === 'Delivered' ? 5 : (targetOrder.status === 'Packed' ? 3 : 4);
        setCurrentStage(stageNum);
        localStorage.setItem(`medirush_stage_${targetOrder.id}`, String(stageNum));
      }

      // Hydrate countdown seconds
      const savedSecs = localStorage.getItem(`medirush_secs_${targetOrder.id}`);
      if (savedSecs) {
        setSecondsRemaining(Math.max(30, parseInt(savedSecs, 10)));
      }
    } catch (e) {
      console.warn('Could not load order tracking data', e);
    }
  }, [id]);

  // ── 2. Real-time ETA Countdown & Stage Progression ────────────────────────
  useEffect(() => {
    if (currentStage >= 5) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setCurrentStage(5);
          if (orderInfo?.id) {
            localStorage.setItem(`medirush_stage_${orderInfo.id}`, '5');
          }
          return 0;
        }

        const nextSecs = prev - 1;
        if (orderInfo?.id && nextSecs % 5 === 0) {
          localStorage.setItem(`medirush_secs_${orderInfo.id}`, String(nextSecs));
        }

        // Dynamically adjust distance text
        if (nextSecs < 60) {
          setRiderDistance('Arriving at your gate (< 100m)');
        } else if (nextSecs < 180) {
          setRiderDistance('350m away • Turning into your street');
        } else if (nextSecs < 300) {
          setRiderDistance('750m away • Crossing main signal');
        } else {
          setRiderDistance('1.1 km away • Riding fast on main road');
        }

        return nextSecs;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStage, orderInfo]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleCopyOtp = () => {
    if (orderInfo?.otp) {
      navigator.clipboard.writeText(orderInfo.otp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  // Reset or simulate stage advancement
  const advanceStageSim = () => {
    const next = currentStage < 5 ? currentStage + 1 : 1;
    setCurrentStage(next);
    if (orderInfo?.id) {
      localStorage.setItem(`medirush_stage_${orderInfo.id}`, String(next));
    }
  };

  const isSplit = Boolean(orderInfo?.isSplitOrder && orderInfo?.packages?.length > 1);
  const isPartial = Boolean(orderInfo?.isPartialOrder);
  const packages = orderInfo?.packages || [];
  const activePkg = isSplit ? packages[selectedPackageIndex] || packages[0] : null;

  const deliveryOtp = orderInfo?.otp || activePkg?.otp || '5821';
  const pharmacyName = activePkg ? activePkg.pharmacy_name : (orderInfo?.pharmacy_name || 'Apollo Pharmacy 24/7 Express');
  const deliveryAddress = orderInfo?.delivery_address || 'Indiranagar, Bengaluru';
  const orderTotal = Number(orderInfo?.total || 285.00).toFixed(2);

  const riderInfo = orderInfo?.rider || activePkg?.rider || {
    name: 'Vikram Rathore',
    vehicle: 'Ather 450X EV • DL-08-EV-4912',
    rating: '★ 4.9 (1,420+)',
    phone: '+91 98450 19283',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
  };

  const itemsToDisplay = activePkg?.items || orderInfo?.items || [
    { name: 'Dolo 650mg Paracetamol Strip', quantity: 2, price: 32.50 },
    { name: 'Azithromycin 500mg Tablet', quantity: 1, price: 110.00 },
    { name: 'Pantocid 40mg Strip', quantity: 1, price: 110.00 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 relative overflow-hidden">

      {/* ── TOP APP BAR ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/orders')} 
              className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
              title="Back to Orders"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h1 className="text-sm font-black text-gray-900 tracking-tight">Live Order Tracking</h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Sub-10m Express
                </span>
              </div>
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mt-0.5">
                Order ID: {orderInfo?.id || id}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="text-xs font-bold text-gray-500 hover:text-blue-700 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-blue-200 transition-all"
          >
            Home
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">

        {/* ── MULTI-STORE SPLIT ORDER BANNER & PACKAGE SWITCHER ─────────── */}
        {isSplit && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-indigo-700/60 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-3 py-1 rounded-full shadow-sm">
                ⚡ Single Dedicated Rider • Multi-Stop Route Active
              </span>
              <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle2 size={13} /> Sourcing All Items
              </span>
            </div>

            <p className="text-xs text-indigo-100/90 font-medium leading-relaxed">
              Because medicines were split across 2 partner stores, <strong>{riderInfo.name}</strong> is collecting all packages across both pharmacies and delivering everything together to your doorstep!
            </p>

            {/* Package Selector Pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {packages.map((pkg, idx) => {
                const isSelected = selectedPackageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPackageIndex(idx)}
                    className={cn(
                      "p-3 rounded-2xl text-left transition-all border cursor-pointer relative",
                      isSelected 
                        ? "bg-white text-slate-900 border-white shadow-lg ring-2 ring-blue-500/50" 
                        : "bg-white/10 text-white border-white/15 hover:bg-white/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider",
                        isSelected ? "text-blue-700" : "text-indigo-300"
                      )}>
                        📦 Stop {idx + 1}: Package {idx + 1}
                      </span>
                      <span className={cn(
                        "text-[10px] font-black",
                        isSelected ? "text-emerald-700" : "text-emerald-300"
                      )}>
                        {pkg.deliveryEta}
                      </span>
                    </div>

                    <h5 className="text-xs font-black truncate">{pkg.pharmacy_name.split(' ')[0]} Store</h5>
                    <p className={cn("text-[10px] mt-0.5 font-medium truncate", isSelected ? "text-gray-500" : "text-gray-300")}>
                      Same Rider: <strong className={isSelected ? "text-blue-700 font-bold" : "text-cyan-300"}>{riderInfo.name.split(' ')[0]}</strong>
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── PARTIAL PRESCRIPTION FULFILLMENT BANNER (IF CUSTOMER EXCLUDED ITEMS) ── */}
        {isPartial && !isSplit && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-900 shadow-sm">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-extrabold block">Partial Prescription Order</span>
              <span>Delivering {orderInfo.partialCount} of {orderInfo.totalPrescriptionCount} prescribed medicines from {pharmacyName}. Unchecked items were excluded.</span>
            </div>
          </div>
        )}

        {/* ── ZOMATO-STYLE ETA COUNTDOWN HERO BANNER ────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl relative overflow-hidden border border-indigo-900"
        >
          {/* Subtle radar sweep circles in background */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-cyan-400/20 animate-pulse pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full border border-cyan-400/30 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Radio size={13} className="animate-pulse" />
                {currentStage === 5 ? 'Order Delivered' : 'Medicines On The Way'}
              </span>

              <span className="text-xs font-mono text-cyan-200 bg-white/10 px-2.5 py-1 rounded-xl">
                {currentStage === 5 ? '00:00' : `${formatTime(secondsRemaining)} mins`}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black tracking-tight text-white">
                  {currentStage === 5 ? 'Delivered!' : `Arriving in ${Math.max(1, Math.ceil(secondsRemaining / 60))} mins`}
                </h2>
              </div>
              <p className="text-xs text-indigo-200 font-medium mt-1">
                {currentStage === 5 
                  ? 'Your prescription package was received safely. Thank you for choosing MediRush!' 
                  : `Partner is speeding with your emergency medicine order • ${riderDistance}`}
              </p>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '20%' }}
                  animate={{ 
                    width: currentStage === 5 
                      ? '100%' 
                      : `${Math.min(95, Math.round(((480 - secondsRemaining) / 480) * 80 + 20))}%` 
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-wider pt-0.5">
                <span>{pharmacyName.split(' ')[0]} Hub</span>
                <span>{riderDistance}</span>
                <span>Your Doorstep</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ZOMATO / BLINKIT LIVE MAP SIMULATOR ─────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-200/90 shadow-md overflow-hidden relative"
        >
          {/* Map Canvas Background */}
          <div className="h-64 sm:h-72 w-full bg-[#e8ecef] relative overflow-hidden flex items-center justify-center">
            
            {/* Street Grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Main Arterial Avenues */}
              <path d="M -20 180 C 150 170, 300 210, 650 140" fill="none" stroke="#ffffff" strokeWidth="16" />
              <path d="M 120 -20 C 140 120, 200 240, 240 400" fill="none" stroke="#ffffff" strokeWidth="12" />
              <path d="M 400 -20 C 380 140, 360 260, 420 400" fill="none" stroke="#ffffff" strokeWidth="10" />
            </svg>

            {/* Simulated Live Route Polyline from Pharmacy (Left) to Customer (Right) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Base grey route */}
              <path 
                d="M 60 180 Q 200 90, 320 150 T 560 120" 
                fill="none" 
                stroke="#94a3b8" 
                strokeWidth="5" 
                strokeDasharray="6,6"
              />
              {/* Highlighted active route covered */}
              <path 
                d="M 60 180 Q 200 90, 320 150" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="6" 
                strokeLinecap="round"
              />
            </svg>

            {/* 1. Origin: Pharmacy Store Pin */}
            <div className="absolute left-6 top-36 z-20 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Store size={18} />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-indigo-900/90 text-white text-[9px] font-black whitespace-nowrap shadow-md">
                {pharmacyName.split(' ')[0]} Store
              </div>
            </div>

            {/* 2. Moving Live Rider Pin with Pulse Radar Wave */}
            <motion.div 
              animate={{ 
                x: currentStage === 5 ? [220, 220] : [-5, 8, -5],
                y: currentStage === 5 ? [0, 0] : [-3, 3, -3]
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute left-[45%] top-28 z-30 flex flex-col items-center"
            >
              {/* Pulse circle */}
              <div className="absolute inset-0 w-12 h-12 -left-1 -top-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />

              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl border-2 border-white">
                <Bike size={20} className="animate-bounce" style={{ animationDuration: '1.2s' }} />
              </div>

              <div className="mt-1 px-2 py-0.5 rounded-full bg-blue-700 text-white text-[9px] font-extrabold shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Rider (28 km/h)
              </div>
            </motion.div>

            {/* 3. Destination: Customer Home Pin */}
            <div className="absolute right-6 top-20 z-20 flex flex-col items-center">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin size={22} />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded-md bg-rose-900 text-white text-[9px] font-black whitespace-nowrap shadow-md">
                Your Delivery Location
              </div>
            </div>

            {/* Top Map Floating Badge */}
            <div className="absolute top-3 left-3 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
              <Navigation size={13} className="text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[10px] font-extrabold text-gray-800">
                Live GPS Satellite Link Active
              </span>
            </div>

            {/* Bottom Map Speed & Traffic pill */}
            <div className="absolute bottom-3 right-3 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-gray-800">
                Route Clear • {riderDistance}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── DELIVERY VERIFICATION OTP CARD (ZOMATO STYLE) ──────────────── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-dashed border-amber-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/25 flex-shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200">
                {isSplit ? "Unified Doorstep Security OTP" : "Delivery Security Code"}
              </span>
              <h3 className="text-sm font-extrabold text-gray-900 mt-1">Delivery Verification OTP</h3>
              <p className="text-xs text-gray-600 font-medium">
                {isSplit 
                  ? `Share this OTP with ${riderInfo.name} when all packages are handed over at your doorstep.`
                  : "Share this OTP with the delivery partner only when medicine bag is handed over."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="px-5 py-2.5 rounded-2xl bg-white border border-amber-300 shadow-inner text-center">
              <span className="text-2xl font-black text-amber-950 tracking-[0.25em] font-mono">
                {deliveryOtp}
              </span>
            </div>

            <button
              onClick={handleCopyOtp}
              className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer border border-amber-300 shadow-sm"
              title="Copy OTP"
            >
              {copiedOtp ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
            </button>
          </div>
        </motion.div>

        {/* ── DELIVERY PARTNER (RIDER) CARD ──────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img 
                  src={riderInfo.photo} 
                  alt="Delivery Partner"
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 border-2 border-white text-white">
                  <Check size={10} strokeWidth={3} />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-sm text-gray-900">{riderInfo.name}</h4>
                  {isSplit && (
                    <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Single Dedicated Rider
                    </span>
                  )}
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                    {riderInfo.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-bold mt-0.5">
                  {riderInfo.vehicle}
                </p>
                <p className="text-[10px] text-blue-700 font-semibold mt-0.5">
                  {isSplit ? "Collecting all partial packages & delivering together" : "Vaccinated • Thermal Cold-Chain Box Certified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCallModal(true)}
                className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Call Delivery Partner"
              >
                <Phone size={18} />
              </button>

              <button 
                onClick={() => alert(`Rider message (${riderInfo.name}): "I am carrying your medicine package and arriving in 4-6 minutes. Please keep OTP ${deliveryOtp} ready."`)}
                className="w-10 h-10 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Message Partner"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>

          {/* Delivery Note / Doorbell instructions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Delivery Preference:</span>
            <span className="font-extrabold text-gray-800 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200">
              🔔 {deliveryInstruction}
            </span>
          </div>
        </motion.div>

        {/* ── ORDER STATUS TIMELINE (5 STAGES) ───────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-black text-sm text-gray-900">Live Order Progression</h3>
            <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Stage {currentStage} of 5
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {TRACKING_STAGES.map((st, idx) => {
              const isDone = currentStage > st.id;
              const isCurrent = currentStage === st.id;
              const isFuture = currentStage < st.id;

              return (
                <div key={st.id} className="flex items-start gap-3.5 relative">
                  {/* Connecting Line */}
                  {idx < TRACKING_STAGES.length - 1 && (
                    <div className={cn(
                      "absolute top-8 left-4 w-0.5 h-10 -ml-[1px] transition-colors duration-500",
                      isDone ? "bg-emerald-500" : "bg-gray-200"
                    )} />
                  )}

                  {/* Icon Circle */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all z-10 shadow-sm",
                    isDone ? "bg-emerald-500 text-white border-2 border-emerald-500" :
                    isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-100 border-2 border-blue-600 animate-pulse" :
                    "bg-gray-100 text-gray-400 border border-gray-200"
                  )}>
                    {isDone ? <Check size={14} strokeWidth={3} /> : st.id}
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        "text-xs font-black transition-colors",
                        isCurrent ? "text-blue-700" : isDone ? "text-gray-900" : "text-gray-400"
                      )}>
                        {st.label}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-semibold">{st.timeOffset}</span>
                    </div>
                    <p className={cn(
                      "text-[11px] mt-0.5 font-medium leading-relaxed",
                      isCurrent ? "text-gray-700 font-bold" : "text-gray-500"
                    )}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Simulation Advancement Button for Testing */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Demo Controls:</span>
            <button
              onClick={advanceStageSim}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Simulate Next Stage ({currentStage < 5 ? `Stage ${currentStage + 1}` : 'Restart'})</span>
            </button>
          </div>
        </motion.div>

        {/* ── FULFILLING PHARMACY & PRESCRIPTION ITEMS CARD ──────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                <Store size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 block">
                  {isSplit ? `Fulfilling Store (Package ${selectedPackageIndex + 1} of ${packages.length})` : 'Fulfilling Store'}
                </span>
                <h4 className="font-black text-sm text-gray-900">{pharmacyName}</h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isSplit && (
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  Split Store #{selectedPackageIndex + 1}
                </span>
              )}
              {isPartial && !isSplit && (
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Partial Order
                </span>
              )}
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified Pharmacist
              </span>
            </div>
          </div>

          {/* Store Address & Details */}
          <div className="text-xs text-gray-600 space-y-1">
            <p className="flex items-start gap-1.5">
              <MapPin size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{activePkg?.pharmacy_address || orderInfo?.pharmacy_address || 'Partner Store, Main Hub'}</span>
            </p>
            <p className="text-[11px] text-gray-500 pl-4">
              👨‍⚕️ Checked by: <strong className="text-gray-800">{orderInfo?.pharmacist_name || 'Dr. Arvind Swaminathan'}</strong>
            </p>
          </div>

          {/* Medicines List */}
          <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                {isSplit 
                  ? `Medicines in Package ${selectedPackageIndex + 1} (${itemsToDisplay.length} Items)` 
                  : `Prescribed Medicines In Package (${itemsToDisplay.length} Items)`}
              </span>
              {isSplit && (
                <span className="text-[10px] font-bold text-blue-700">
                  ETA: {activePkg?.deliveryEta || '8 mins'}
                </span>
              )}
            </div>

            {itemsToDisplay.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                <div>
                  <span className="font-bold text-gray-800">{item.name}</span>
                  <span className="text-[10px] text-gray-400 font-semibold ml-2">x {item.quantity || 1}</span>
                </div>
                <span className="font-extrabold text-gray-900">₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-xs">
              <span className="font-extrabold text-gray-700">
                {isSplit ? `Package ${selectedPackageIndex + 1} Subtotal:` : 'Total Amount (Paid):'}
              </span>
              <span className="text-sm font-black text-blue-700">
                ₹{isSplit && activePkg ? Number(activePkg.total).toFixed(2) : orderTotal}
              </span>
            </div>

            {isSplit && (
              <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 font-bold border-t border-dashed border-slate-200">
                <span>Combined Split Order Total (All Packages):</span>
                <span className="font-black text-gray-900">₹{orderTotal}</span>
              </div>
            )}
          </div>

          {/* Delivery Destination */}
          <div className="pt-1 flex items-start gap-2 text-xs text-gray-600">
            <MapPin size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800">Delivering To:</span>
              <p className="text-[11px] text-gray-500 leading-snug">{deliveryAddress}</p>
            </div>
          </div>
        </motion.div>

        {/* ── EMERGENCY SUPPORT & RETURN BUTTONS ─────────────────────────── */}
        <div className="space-y-2.5 pt-2">
          <Button
            onClick={() => navigate('/orders')}
            variant="outline"
            className="w-full py-3.5 text-xs font-black shadow-sm flex items-center justify-center gap-2"
          >
            <Package size={16} />
            <span>View All My Orders</span>
          </Button>

          <button
            onClick={() => alert("MediRush Emergency Helpline: +91 1800 200 4911 (24x7 Active)")}
            className="w-full py-2.5 text-[11px] font-extrabold text-gray-500 hover:text-rose-600 transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <ShieldAlert size={14} className="text-rose-500" />
            <span>Need Help? Contact 24/7 Pharmacy Emergency Desk</span>
          </button>
        </div>

      </main>

      {/* ── CALL RIDER MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Phone size={32} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">Calling Delivery Partner</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Vikram Rathore • Ather EV</p>
                <p className="text-base font-black text-blue-700 font-mono mt-2">+91 98765 43210</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setShowCallModal(false)}
                  className="py-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-extrabold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <a
                  href="tel:+919876543210"
                  onClick={() => setShowCallModal(false)}
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} />
                  <span>Call Now</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

