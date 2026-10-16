import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Navigation, Phone, CheckCircle2, 
  MapPin, ShieldCheck, Clock, AlertCircle, 
  Volume2, VolumeX, Store, ArrowRight, 
  ExternalLink, BatteryCharging, Zap, DollarSign,
  Package, Check, Radio, Play, ChevronRight, X
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { soundEffects } from '../utils/soundEffects';
import { 
  subscribeToRealtimeEvents, 
  broadcastRealtimeEvent, 
  getStoredOrders, 
  updateOrderStatus 
} from '../services/realtimeNetwork';

export const DeliveryPartnerApp = () => {
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [todayEarnings, setTodayEarnings] = useState(485);
  const [completedTrips, setCompletedTrips] = useState(6);
  const [activeTask, setActiveTask] = useState(null);
  const [incomingGig, setIncomingGig] = useState(null);
  const [deliveryStep, setDeliveryStep] = useState(1); // 1: going to store, 2: picking up, 3: en route to customer, 4: verifying otp
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [completedSuccess, setCompletedSuccess] = useState(false);

  // Sync active orders that need delivery
  const loadAvailableGigs = useCallback(() => {
    const orders = getStoredOrders();
    // Look for orders that are ready for pickup or out for delivery
    const readyOrder = orders.find(o => 
      o.status === 'Ready for Pickup' || 
      o.status === 'Packing' ||
      (o.status === 'Out for Delivery' && !activeTask)
    );

    if (readyOrder && !activeTask && !incomingGig) {
      setIncomingGig(readyOrder);
      if (soundEnabled) soundEffects.playRiderAlert();
    }
  }, [activeTask, incomingGig, soundEnabled]);

  useEffect(() => {
    loadAvailableGigs();

    // Listen to real-time events across portals
    const unsubscribe = subscribeToRealtimeEvents((event) => {
      if (event.type === 'PHARMACY_PACKED' || event.type === 'NEW_ORDER') {
        const order = event.payload?.order || event.payload;
        if (!activeTask) {
          setIncomingGig(order);
          if (soundEnabled) soundEffects.playRiderAlert();
        }
      } else if (event.type === 'ORDER_STATUS_CHANGED') {
        loadAvailableGigs();
      }
    });

    return unsubscribe;
  }, [loadAvailableGigs, activeTask, soundEnabled]);

  // Accept Gig
  const handleAcceptGig = () => {
    if (!incomingGig) return;
    setActiveTask(incomingGig);
    setIncomingGig(null);
    setDeliveryStep(1);
    soundEffects.playSuccessFanfare();

    updateOrderStatus(incomingGig.id, 'Out for Delivery', {
      rider: {
        name: 'Vikram Rathore',
        vehicle: 'Ather 450X EV • DL-08-EV-4912',
        phone: '+91 98450 19283',
        rating: '4.9 ★'
      }
    });
  };

  // Step advancement
  const handleNextStep = () => {
    if (deliveryStep === 1) {
      // Reached Store 1
      setDeliveryStep(2);
      soundEffects.playOrderChime();
    } else if (deliveryStep === 2) {
      // Picked Up Packages
      setDeliveryStep(3);
      soundEffects.playOrderChime();
    } else if (deliveryStep === 3) {
      // Reached Customer Doorstep
      setDeliveryStep(4);
      soundEffects.playOrderChime();
    }
  };

  // Verify Customer OTP and Complete Task
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!activeTask) return;

    // Check OTP match or master test 1234
    const validOtp = activeTask.otp?.replace(/\D/g, '') || '5821';
    const entered = otpInput.trim();

    if (entered === validOtp || entered === '1234' || validOtp.includes(entered)) {
      setOtpError('');
      setCompletedSuccess(true);
      soundEffects.playSuccessFanfare();

      const tripPayout = Number(activeTask.isSplitOrder ? 85 : 65);
      setTodayEarnings(prev => prev + tripPayout);
      setCompletedTrips(prev => prev + 1);

      updateOrderStatus(activeTask.id, 'Delivered', {
        delivered_at: new Date().toISOString()
      });

      broadcastRealtimeEvent('ORDER_DELIVERED', {
        orderId: activeTask.id
      });

      setTimeout(() => {
        setActiveTask(null);
        setCompletedSuccess(false);
        setOtpInput('');
        setDeliveryStep(1);
      }, 3500);
    } else {
      setOtpError(`Incorrect OTP. Please ask customer for correct 4-digit code (Hint: ${validOtp})`);
    }
  };

  // Simulate new gig alert
  const handleSimulateGig = () => {
    const mockOrder = {
      id: `ORD-SPLIT-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: 'Ananya Deshpande',
      customer_phone: '+91 98450 33419',
      delivery_address: 'Flat 402, Green Glen Layout, Bellandur (1.8 km)',
      isSplitOrder: true,
      singleRiderMultiStop: true,
      total: 310.00,
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      packages: [
        { pharmacy_name: 'Apollo Pharmacy', items: [{ name: 'Augmentin 625', price: 175 }] },
        { pharmacy_name: 'MedPlus Mart', items: [{ name: 'Dolo 650 Strip', price: 65 }] }
      ]
    };
    setIncomingGig(mockOrder);
    if (soundEnabled) soundEffects.playRiderAlert();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-blue-500 selection:text-white">

      {/* ── TOP APP BAR (STANDALONE DELIVERY PARTNER APP) ─────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25">
              <Bike size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white">Vikram Rathore</h1>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">
                  4.9 ★
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <span>Ather 450X EV</span>
                <span>•</span>
                <BatteryCharging size={11} className="text-emerald-400" />
                <span className="text-emerald-400">84% Battery</span>
              </p>
            </div>
          </div>

          {/* Right: Duty toggle & sound */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                soundEffects.setMuted(!next);
                if (next) soundEffects.playRiderAlert();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              title="Toggle Alert Sounds"
            >
              {soundEnabled ? <Volume2 size={15} className="text-blue-400" /> : <VolumeX size={15} />}
            </button>

            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border cursor-pointer",
                isOnDuty 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/40"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", isOnDuty ? "bg-emerald-400 animate-ping" : "bg-rose-500")} />
              <span>{isOnDuty ? "ON DUTY" : "OFF DUTY"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── EARNINGS DASHBOARD CARD ───────────────────────────────────────── */}
      <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto px-4 pt-4">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-5 border border-indigo-800/50 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1">
              <Zap size={12} className="text-amber-400" /> Today's Shift Performance
            </span>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Active Shift
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-white">₹{todayEarnings}</span>
              <p className="text-[11px] text-indigo-200 mt-0.5">Total Earnings (Incl. ₹90 Surge)</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">{completedTrips}</span>
              <p className="text-[11px] text-slate-400">Trips Done</p>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={handleSimulateGig}
              className="w-full py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-extrabold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Radio size={13} className="text-cyan-400 animate-pulse" />
              <span>Simulate Real-Time Delivery Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN TASK / INCOMING GIG AREA ─────────────────────────────────── */}
      <main className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto px-4 pt-4 space-y-4">

        {/* 1. INCOMING GIG ALERT MODAL / CARD */}
        <AnimatePresence>
          {incomingGig && !activeTask && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 border-2 border-cyan-400 text-white rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                  ⚡ New Delivery Task Available!
                </span>
                <span className="text-xs font-mono text-cyan-200">{incomingGig.id}</span>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-black text-white">
                    Payout: ₹{incomingGig.isSplitOrder ? '85.00' : '65.00'}
                  </h3>
                  <span className="text-xs font-bold text-emerald-300">~12 mins trip</span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">
                  {incomingGig.singleRiderMultiStop 
                    ? "⚡ Multi-Stop Route: Collect from 2 partner pharmacies & deliver together" 
                    : "Express sub-10 minute prescription delivery"}
                </p>
              </div>

              {/* Sourcing stops visual */}
              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Store size={15} className="text-cyan-400 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Stop 1:</strong> {incomingGig.packages?.[0]?.pharmacy_name || 'Apollo Pharmacy 24/7'}
                  </span>
                </div>
                {incomingGig.packages?.[1] && (
                  <div className="flex items-center gap-2">
                    <Store size={15} className="text-indigo-400 flex-shrink-0" />
                    <span className="truncate">
                      <strong>Stop 2:</strong> {incomingGig.packages[1].pharmacy_name || 'MedPlus Mart'}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                  <MapPin size={15} className="text-rose-400 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Drop:</strong> {incomingGig.delivery_address || 'Customer Residence'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIncomingGig(null)}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptGig}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Check size={18} strokeWidth={3} />
                  <span>ACCEPT GIG TASK</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. ACTIVE DELIVERY TASK EXECUTION FLOW */}
        {activeTask ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
            
            {/* Header: Order ID & Progress */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                  Active Task in Progress
                </span>
                <h4 className="font-black text-sm text-white">{activeTask.id}</h4>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                Step {deliveryStep} of 4
              </span>
            </div>

            {/* Step 1: Head to Store */}
            {deliveryStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-blue-300 block">
                    📍 Step 1: Head to Store
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {activeTask.packages?.[0]?.pharmacy_name || 'Apollo Pharmacy 24/7'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Main Road / Metro Pillar, Indiranagar • Pharmacist packing order
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation size={15} /> Open Navigation
                  </a>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    <span>Reached Store</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Pick Up Packages */}
            {deliveryStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-300 block">
                    📦 Step 2: Collect & Verify Packages
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {activeTask.singleRiderMultiStop ? "Multi-Stop Pickup Ready" : "Collect Medicine Bag"}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Verify pharmacy tamper-seal barcode before placing inside EV thermal box.
                  </p>
                </div>

                <Button
                  onClick={handleNextStep}
                  variant="primary"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  <Check size={16} className="mr-1.5" />
                  <span>Packages Collected • Start Trip to Customer</span>
                </Button>
              </div>
            )}

            {/* Step 3: En route to Customer */}
            {deliveryStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-300 block">
                    🏍️ Step 3: En Route to Customer
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {activeTask.customer_name || 'Customer Residence'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {activeTask.delivery_address || 'Indiranagar 12th Main, 4th Cross'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeTask.customer_phone || '+919845012345'}`}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700"
                    title="Call Customer"
                  >
                    <Phone size={17} />
                  </a>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    <MapPin size={16} className="mr-1.5" />
                    <span>Reached Customer Doorstep</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: OTP Verification & Completion */}
            {deliveryStep === 4 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 space-y-2 text-center">
                  <ShieldCheck size={32} className="text-amber-400 mx-auto" />
                  <h4 className="text-base font-extrabold text-white">
                    Enter Customer 4-Digit Delivery OTP
                  </h4>
                  <p className="text-xs text-amber-200">
                    Ask customer for the code shown on their tracking screen to verify handover.
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="w-full text-center tracking-[0.3em] font-mono font-black text-2xl py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  {otpError && (
                    <p className="text-xs text-rose-400 font-bold text-center">{otpError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={otpInput.length < 4}
                  variant="primary"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm shadow-xl cursor-pointer"
                >
                  <CheckCircle2 size={18} className="mr-1.5" />
                  <span>Verify OTP & Complete Delivery</span>
                </Button>
              </form>
            )}

            {/* Completion Fanfare Banner */}
            {completedSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-emerald-500 text-slate-950 text-center font-black space-y-1 shadow-2xl"
              >
                <CheckCircle2 size={36} className="mx-auto text-slate-950" />
                <h4 className="text-lg">Delivery Completed!</h4>
                <p className="text-xs text-emerald-950">
                  +₹{activeTask.isSplitOrder ? '85' : '65'} credited to your daily wallet.
                </p>
              </motion.div>
            )}

          </div>
        ) : (
          !incomingGig && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-800 text-blue-400 mx-auto flex items-center justify-center">
                <Bike size={24} className="animate-bounce" />
              </div>
              <h4 className="text-base font-extrabold text-white">Waiting for next gig in your zone...</h4>
              <p className="text-xs text-slate-400">
                You are in Indiranagar hot-zone. When a pharmacy packs an order, it will ping your phone immediately.
              </p>
            </div>
          )
        )}

      </main>

    </div>
  );
};
