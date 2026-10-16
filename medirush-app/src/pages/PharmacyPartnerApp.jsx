import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, ShieldCheck, Clock, AlertTriangle, 
  Package, CheckCircle2, Phone, MapPin, 
  Check, Volume2, VolumeX, Eye, 
  Send, RefreshCw, Radio, Sparkles,
  ArrowRight, Search, FileText, ChevronRight,
  ExternalLink, Bell, X, Pill, Zap
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { soundEffects } from '../utils/soundEffects';
import { 
  broadcastRealtimeEvent, 
  subscribeToRealtimeEvents, 
  getStoredOrders, 
  updateOrderStatus 
} from '../services/realtimeNetwork';

const PARTNER_STORES = [
  { id: 'pharm-apollo', name: 'Apollo Pharmacy 24/7', branch: 'Indiranagar Hub', regNo: 'DL-PH-84920', pharmacist: 'Dr. Ramesh Sharma (B.Pharm)' },
  { id: 'pharm-medplus', name: 'MedPlus Mart', branch: 'Koramangala 4th Block', regNo: 'KA-PH-61204', pharmacist: 'Dr. Neha Verma (M.Pharm)' },
  { id: 'pharm-janaushadhi', name: 'Jan Aushadhi Kendra', branch: 'Govt. Hospital Circle', regNo: 'GOI-JAK-31890', pharmacist: 'Pharmacist Suresh Patel (Govt. Reg)' }
];

export const PharmacyPartnerApp = () => {
  const [activeStore, setActiveStore] = useState(PARTNER_STORES[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'packing' | 'ready' | 'completed'
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewPrescriptionUrl, setPreviewPrescriptionUrl] = useState(null);
  const [urgentAlert, setUrgentAlert] = useState(null);

  // Sync orders from storage & realtime events
  const loadOrders = useCallback(() => {
    const all = getStoredOrders();
    setOrders(all);
  }, []);

  useEffect(() => {
    loadOrders();

    // Listen to real-time events across portals
    const unsubscribe = subscribeToRealtimeEvents((event) => {
      if (event.type === 'NEW_ORDER' || event.type === 'PRESCRIPTION_BROADCAST') {
        loadOrders();
        setUrgentAlert(event.payload?.order || event.payload);
        if (soundEnabled) {
          soundEffects.playOrderChime();
        }
      } else if (event.type === 'ORDER_STATUS_CHANGED') {
        loadOrders();
      }
    });

    return unsubscribe;
  }, [loadOrders, soundEnabled]);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setMuted(!next);
    if (next) soundEffects.playOrderChime();
  };

  // Filter orders by status
  const incomingOrders = orders.filter(o => 
    !o.status || o.status === 'Pending' || o.status === 'Order Placed' || o.status === 'Broadcasting'
  );
  const packingOrders = orders.filter(o => 
    o.status === 'Accepted' || o.status === 'Packing' || o.status === 'In Preparation'
  );
  const readyOrders = orders.filter(o => 
    o.status === 'Packed' || o.status === 'Ready for Pickup' || o.status === 'Out for Delivery'
  );
  const completedOrders = orders.filter(o => o.status === 'Delivered');

  // Actions
  const handleAcceptOrder = (order) => {
    updateOrderStatus(order.id, 'Packing', {
      accepted_by_store: activeStore.name,
      accepted_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setUrgentAlert(null);
    soundEffects.playSuccessFanfare();
    loadOrders();
    setActiveTab('packing');

    // Notify Rider Fleet that order is being packed
    broadcastRealtimeEvent('PHARMACY_ACCEPTED', {
      orderId: order.id,
      store: activeStore,
      order
    });
  };

  const handleMarkPacked = (order) => {
    updateOrderStatus(order.id, 'Ready for Pickup', {
      packed_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    soundEffects.playOrderChime();
    loadOrders();
    setActiveTab('ready');

    // Alert Delivery Partner
    broadcastRealtimeEvent('PHARMACY_PACKED', {
      orderId: order.id,
      store: activeStore,
      order
    });
  };

  // Simulate an incoming test order in 1 click
  const handleSimulateIncomingOrder = () => {
    const sampleId = `ORD-RX-${Math.floor(10000 + Math.random() * 90000)}`;
    const mockOrder = {
      id: sampleId,
      customer_name: 'Rahul Deshmukh',
      customer_phone: '+91 98451 22891',
      delivery_address: '12th Main, 4th Cross, Indiranagar (450m away)',
      date: new Date().toISOString(),
      isUrgent: true,
      total: 340.00,
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      medicines: [
        { name: 'Augmentin 625 Duo Tablet', quantity: 1, price: 175.00, dosage: '1 tab Twice daily' },
        { name: 'Dolo 650mg Paracetamol', quantity: 2, price: 32.50, dosage: '1 tab SOS Fever' },
        { name: 'Pan-D Capsule', quantity: 1, price: 100.00, dosage: '1 cap OD before breakfast' }
      ],
      items: [
        { name: 'Augmentin 625 Duo Tablet', quantity: 1, price: 175.00 },
        { name: 'Dolo 650mg Paracetamol', quantity: 2, price: 65.00 },
        { name: 'Pan-D Capsule', quantity: 1, price: 100.00 }
      ],
      doctorName: 'Dr. Ramesh Sharma, MD',
      clinicHospital: 'City Care Clinic',
      prescription_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'
    };

    const existing = getStoredOrders();
    existing.unshift(mockOrder);
    localStorage.setItem('medirush_orders', JSON.stringify(existing));

    broadcastRealtimeEvent('NEW_ORDER', { order: mockOrder });
    setUrgentAlert(mockOrder);
    if (soundEnabled) soundEffects.playOrderChime();
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">

      {/* ── TOP NAV BAR (STANDALONE PHARMACY PARTNER APP) ────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand & Store Selector */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                  MediRush Pharmacy Merchant Portal
                </h1>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Live Terminal
                </span>
              </div>

              {/* Store Switcher Dropdown */}
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={activeStore.id}
                  onChange={(e) => setActiveStore(PARTNER_STORES.find(s => s.id === e.target.value) || PARTNER_STORES[0])}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {PARTNER_STORES.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.branch})</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  Reg: {activeStore.regNo}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Online Status, Sound Chime, Simulate Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap pt-1 md:pt-0">
            
            {/* Audio chime toggle */}
            <button
              onClick={handleToggleSound}
              className={cn(
                "p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer",
                soundEnabled 
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              )}
              title={soundEnabled ? "Order Ring Sound ON" : "Order Ring Sound Muted"}
            >
              {soundEnabled ? <Volume2 size={16} className="text-emerald-400 animate-pulse" /> : <VolumeX size={16} />}
              <span className="hidden sm:inline">{soundEnabled ? "Audio Alert ON" : "Muted"}</span>
            </button>

            {/* Test Simulation Button */}
            <button
              onClick={handleSimulateIncomingOrder}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
              title="Simulate incoming real-time customer prescription order"
            >
              <Zap size={14} className="text-amber-300" />
              <span>Simulate Real-time Order</span>
            </button>

            {/* Duty Toggle (Online / Busy) */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className={cn("w-2.5 h-2.5 rounded-full transition-all", isOnline ? "bg-emerald-400 animate-ping" : "bg-rose-500")} />
              <button
                onClick={() => setIsOnline(!isOnline)}
                className="text-xs font-black cursor-pointer text-white hover:text-emerald-300"
              >
                {isOnline ? "STORE ONLINE" : "STORE BUSY"}
              </button>
            </div>

            <a
              href="/home"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Open Customer App in new tab"
            >
              <span>Customer App</span>
              <ExternalLink size={13} />
            </a>
          </div>

        </div>
      </header>

      {/* ── REALTIME INCOMING ORDER POPUP ALERT ────────────────────────────── */}
      <AnimatePresence>
        {urgentAlert && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-18 left-4 right-4 z-50 max-w-2xl mx-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black shadow-md flex-shrink-0 animate-bounce">
                <Bell size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase bg-black/30 px-2 py-0.5 rounded-md text-amber-300">
                    ⚡ New Prescription Order Ringing!
                  </span>
                  <span className="text-xs font-mono font-bold text-white/90">ID: {urgentAlert.id}</span>
                </div>
                <h4 className="text-base font-black mt-0.5">
                  {urgentAlert.customer_name || 'Customer Prescription'} · ₹{Number(urgentAlert.total || 180).toFixed(2)}
                </h4>
                <p className="text-xs text-emerald-100 font-medium">
                  📍 {urgentAlert.delivery_address || 'Express Doorstep Delivery Slot'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setUrgentAlert(null)}
                className="px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleAcceptOrder(urgentAlert)}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={16} strokeWidth={3} /> Accept & Pack
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── METRICS DASHBOARD STRIP ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Incoming Unverified</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400">{incomingOrders.length}</span>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Action Req.</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Currently Packing</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-400">{packingOrders.length}</span>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">In Prep</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Ready for Rider</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-400">{readyOrders.length}</span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">Dispatched</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Today's Revenue</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400">₹{orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0).toFixed(0)}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Gross</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── WORKFLOW TABS ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 overflow-x-auto no-scrollbar gap-1">
          <button
            onClick={() => setActiveTab('incoming')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === 'incoming' 
                ? "bg-amber-500 text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <Radio size={14} className={incomingOrders.length ? "animate-pulse" : ""} />
            <span>Incoming Requests ({incomingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === 'packing' 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <Package size={14} />
            <span>Prescription Packing ({packingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === 'ready' 
                ? "bg-purple-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <Send size={14} />
            <span>Rider Handover ({readyOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === 'completed' 
                ? "bg-emerald-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <CheckCircle2 size={14} />
            <span>Delivered History ({completedOrders.length})</span>
          </button>
        </div>
      </div>

      {/* ── ORDER STREAM CARDS ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Tab 1: Incoming Orders */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {incomingOrders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                  <Radio size={28} className="animate-pulse" />
                </div>
                <h4 className="text-base font-extrabold text-white">Listening for live incoming prescription requests...</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When customers in your radius upload prescriptions or place orders, they will appear here instantly with audio alert.
                </p>
                <Button
                  onClick={handleSimulateIncomingOrder}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-slate-700 text-emerald-400 hover:bg-slate-800 cursor-pointer text-xs"
                >
                  <Zap size={14} className="mr-1" /> Click to Test Incoming Ring
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                          {order.isUrgent ? "🚨 EXPRESS 10-MIN EMERGENCY ORDER" : "Standard Prescription Order"}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">ID: {order.id}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white">
                        {order.customer_name || 'Verified Patient Order'}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-rose-400 flex-shrink-0" />
                        <span className="truncate">{order.delivery_address || 'Customer Neighborhood'}</span>
                      </p>
                    </div>

                    {/* Prescribed Items list */}
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        Prescription Medicines to Dispense ({order.items?.length || 0}):
                      </span>
                      {(order.items || order.medicines || []).map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between font-medium">
                          <span className="text-slate-200">• {it.name} <strong className="text-slate-400">x{it.quantity || 1}</strong></span>
                          <span className="text-emerald-400 font-bold">₹{it.price}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Bill Total:</span>
                        <span className="text-lg font-black text-white">₹{Number(order.total || 250).toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          <Eye size={14} className="mr-1" /> View Slip
                        </Button>
                        <Button
                          onClick={() => handleAcceptOrder(order)}
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 cursor-pointer"
                        >
                          <Check size={14} className="mr-1" /> Accept & Pack
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Currently Packing */}
        {activeTab === 'packing' && (
          <div className="space-y-4">
            {packingOrders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-xs">
                No orders currently in packing stage. Accept an incoming order to begin packing.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packingOrders.map(order => (
                  <div key={order.id} className="bg-slate-900 border border-blue-500/30 rounded-3xl p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-400 flex items-center gap-1.5">
                        <Package size={14} /> Packing in Progress
                      </span>
                      <span className="text-xs font-mono text-slate-400">{order.id}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white">{order.customer_name || 'Patient Order'}</h4>
                      <p className="text-xs text-slate-400">Doctor: {order.doctorName || 'Registered Physician'}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Medicines being packed:</span>
                      {(order.items || []).map((m, i) => (
                        <p key={i} className="text-xs text-slate-300 flex justify-between">
                          <span>✔ {m.name}</span>
                          <span className="text-slate-400">x{m.quantity || 1}</span>
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-400">Cold Chain Thermal Pack Ready</span>
                      <Button
                        onClick={() => handleMarkPacked(order)}
                        variant="primary"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 cursor-pointer"
                      >
                        <CheckCircle2 size={14} className="mr-1" /> Mark Packed & Call Rider
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Ready for Rider */}
        {activeTab === 'ready' && (
          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-xs">
                No orders waiting for pickup right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyOrders.map(order => (
                  <div key={order.id} className="bg-slate-900 border border-purple-500/30 rounded-3xl p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1.5">
                        <Send size={14} /> Assigned to Rider
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">OTP: {order.otp || '5821'}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40">
                      <div>
                        <span className="text-[10px] text-purple-300 uppercase font-black">Dedicated Delivery Partner:</span>
                        <h5 className="font-extrabold text-sm text-white">{order.rider?.name || 'Vikram Rathore'}</h5>
                        <p className="text-[11px] text-purple-200">{order.rider?.vehicle || 'Ather 450X EV'}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        Arriving in 2m
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Bag sealed with tamper-evident security barcode. Handover to {order.rider?.name || 'Vikram'} when he reaches pharmacy counter.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Completed History */}
        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedOrders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-xs">
                No completed orders yet today.
              </div>
            ) : (
              completedOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{order.id} • {order.customer_name || 'Customer'}</span>
                    <span className="text-slate-400">{order.items?.length || 1} items delivered safely</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-400 block">₹{Number(order.total || 0).toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Delivered</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>

      {/* ── PRESCRIPTION PREVIEW MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-slate-100 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-emerald-400" />
                  <h4 className="font-black text-sm">Prescription Verification Inspection</h4>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Doctor:</strong> {selectedOrder.doctorName || 'Dr. Rajesh Sharma, MD'}</p>
                <p><strong>Clinic:</strong> {selectedOrder.clinicHospital || 'City Healthcare Center'}</p>
                <p><strong>Customer:</strong> {selectedOrder.customer_name || 'Verified Patient'}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Identified Prescription Medicines:</span>
                {(selectedOrder.items || []).map((it, idx) => (
                  <p key={idx} className="flex justify-between text-slate-200">
                    <span>{it.name}</span>
                    <span className="font-bold">x{it.quantity || 1}</span>
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button onClick={() => setSelectedOrder(null)} variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleAcceptOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black"
                >
                  Confirm & Start Packing
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
