import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, ShieldCheck, Clock, AlertTriangle, 
  Package, CheckCircle2, Phone, MapPin, 
  Check, Volume2, VolumeX, Eye, 
  Send, RefreshCw, Radio, Sparkles,
  ArrowRight, Search, FileText, ChevronRight,
  ExternalLink, Bell, X, Pill, Zap, LogOut,
  UserCheck, ShieldAlert
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { soundEffects } from '../utils/soundEffects';
import { useAuth } from '../context/AuthContext';
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
  const { user, loginAsDemoPharmacy, logout } = useAuth();
  const navigate = useNavigate();

  const [activeStore, setActiveStore] = useState(PARTNER_STORES[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'packing' | 'ready' | 'completed'
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [urgentAlert, setUrgentAlert] = useState(null);

  const isPharmacyRole = user?.user_metadata?.role === 'pharmacy';

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

  // Actions & Inventory Manipulation
  const handleToggleItemAvailability = (orderId, itemIdx) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const currentItems = (ord.items || ord.medicines || []).map((it, i) => {
        if (i !== itemIdx) return it;
        return { ...it, available: it.available === false ? true : false };
      });

      const newTotal = currentItems.reduce((acc, it) => {
        if (it.available !== false) return acc + (Number(it.price || 0) * (Number(it.quantity) || 1));
        if (it.substitute && it.substitutePrice) return acc + (Number(it.substitutePrice) * (Number(it.quantity) || 1));
        return acc;
      }, 0);

      const updated = { ...ord, items: currentItems, total: newTotal };
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      return updated;
    }));
  };

  const handleUpdateItemPrice = (orderId, itemIdx, newPrice) => {
    const p = parseFloat(newPrice) || 0;
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const currentItems = (ord.items || ord.medicines || []).map((it, i) => {
        if (i !== itemIdx) return it;
        return { ...it, price: p };
      });

      const newTotal = currentItems.reduce((acc, it) => {
        if (it.available !== false) return acc + (Number(it.price || 0) * (Number(it.quantity) || 1));
        if (it.substitute && it.substitutePrice) return acc + (Number(it.substitutePrice) * (Number(it.quantity) || 1));
        return acc;
      }, 0);

      const updated = { ...ord, items: currentItems, total: newTotal };
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      return updated;
    }));
  };

  const handleAddSubstitute = (orderId, itemIdx, subName, subPrice) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const currentItems = (ord.items || ord.medicines || []).map((it, i) => {
        if (i !== itemIdx) return it;
        return { 
          ...it, 
          available: false, 
          substitute: subName, 
          substitutePrice: parseFloat(subPrice) || 0 
        };
      });

      const newTotal = currentItems.reduce((acc, it) => {
        if (it.available !== false) return acc + (Number(it.price || 0) * (Number(it.quantity) || 1));
        if (it.substitute && it.substitutePrice) return acc + (Number(it.substitutePrice) * (Number(it.quantity) || 1));
        return acc;
      }, 0);

      const updated = { ...ord, items: currentItems, total: newTotal };
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      return updated;
    }));
  };

  const handleAcceptOrder = (order) => {
    const finalItems = order.items || order.medicines || [];
    const finalTotal = order.total !== undefined ? order.total : finalItems.reduce((acc, it) => acc + (it.price * (it.quantity || 1)), 0);

    updateOrderStatus(order.id, 'Packing', {
      accepted_by_store: activeStore.name,
      accepted_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: finalItems,
      total: finalTotal,
      verified_pharmacist: activeStore.pharmacist
    });
    setUrgentAlert(null);
    soundEffects.playSuccessFanfare();
    loadOrders();
    setActiveTab('packing');

    // Notify Rider Fleet and Customer that order is verified & packing
    broadcastRealtimeEvent('PHARMACY_ACCEPTED', {
      orderId: order.id,
      store: activeStore,
      order: {
        ...order,
        items: finalItems,
        total: finalTotal
      }
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">

      {/* ── ROLE ISOLATION ACCESS GATE BANNER ────────────────────────────── */}
      {user && !isPharmacyRole && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 border-b border-amber-600/30 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-slate-950 flex-shrink-0 animate-bounce" />
            <span>
              <strong>Customer Profile Active ({user.email || 'Patient'})</strong>: Customer and Pharmacy portals are segregated.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loginAsDemoPharmacy()}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-[11px] font-black transition-colors cursor-pointer"
            >
              ⚡ Switch to Pharmacy Session
            </button>
            <Link
              to="/home"
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-extrabold transition-colors"
            >
              Return to Patient App
            </Link>
          </div>
        </div>
      )}

      {/* ── TOP NAV BAR (LIGHT THEME TERMINAL) ────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand & Store Selector */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 flex-shrink-0">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900">
                  MediRush Pharmacy Merchant Portal
                </h1>
                <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Live Terminal
                </span>
              </div>

              {/* Store Switcher Dropdown */}
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={activeStore.id}
                  onChange={(e) => setActiveStore(PARTNER_STORES.find(s => s.id === e.target.value) || PARTNER_STORES[0])}
                  className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors"
                >
                  {PARTNER_STORES.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.branch})</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
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
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900"
              )}
              title={soundEnabled ? "Order Ring Sound ON" : "Order Ring Sound Muted"}
            >
              {soundEnabled ? <Volume2 size={16} className="text-emerald-600 animate-pulse" /> : <VolumeX size={16} />}
              <span className="hidden sm:inline">{soundEnabled ? "Audio Alert ON" : "Muted"}</span>
            </button>

            {/* Test Simulation Button */}
            <button
              onClick={handleSimulateIncomingOrder}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Simulate incoming real-time customer prescription order"
            >
              <Zap size={14} className="text-amber-300" />
              <span>Simulate Real-time Order</span>
            </button>

            {/* Duty Toggle (Online / Busy) */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className={cn("w-2.5 h-2.5 rounded-full transition-all", isOnline ? "bg-emerald-500 animate-ping" : "bg-rose-500")} />
              <button
                onClick={() => setIsOnline(!isOnline)}
                className="text-xs font-black cursor-pointer text-slate-800 hover:text-emerald-700"
              >
                {isOnline ? "STORE ONLINE" : "STORE BUSY"}
              </button>
            </div>

            {/* Logout / Switch Role */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-xs text-slate-600 hover:text-rose-600 p-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Log out from Pharmacy Terminal"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Exit</span>
            </button>

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
            className="fixed top-18 left-4 right-4 z-50 max-w-2xl mx-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Incoming Requests</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{incomingOrders.length}</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">Action Req.</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Currently Packing</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-600">{packingOrders.length}</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">In Prep</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Ready for Rider</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-600">{readyOrders.length}</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">Handover</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Today's Revenue</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">₹{orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0).toFixed(0)}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">Live Gross</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── WORKFLOW TABS ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-sm overflow-x-auto no-scrollbar gap-1.5">
          <button
            onClick={() => setActiveTab('incoming')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === 'incoming' 
                ? "bg-amber-500 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                ? "bg-purple-600 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Radio size={28} className="animate-pulse" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Listening for live incoming prescription requests...</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  When customers in your radius upload prescriptions or place emergency medicine orders, they will appear here instantly with audio alert.
                </p>
                <Button
                  onClick={handleSimulateIncomingOrder}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 cursor-pointer text-xs"
                >
                  <Zap size={14} className="mr-1" /> Click to Test Incoming Ring
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border-2 border-amber-300 rounded-3xl p-5 shadow-md hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                          {order.isUrgent ? "🚨 EXPRESS 10-MIN EMERGENCY ORDER" : "Standard Prescription Order"}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">ID: {order.id}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {order.customer_name || 'Verified Patient Order'}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-rose-500 flex-shrink-0" />
                        <span className="truncate">{order.delivery_address || 'Customer Neighborhood'}</span>
                      </p>
                    </div>

                    {/* Interactive Prescribed Items Checklist & Price Editing */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <span className="text-[10px] font-black uppercase text-slate-500">
                          Pharmacy Inventory Checklist ({order.items?.length || order.medicines?.length || 0} items)
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {(order.items || order.medicines || []).filter(i => i.available !== false).length} Available
                        </span>
                      </div>

                      {(order.items || order.medicines || []).map((it, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={it.available !== false}
                                onChange={() => handleToggleItemAvailability(order.id, idx)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                              />
                              <span className={cn(
                                "font-extrabold text-xs transition-colors",
                                it.available !== false ? "text-slate-900" : "text-rose-600 line-through"
                              )}>
                                {it.name}
                              </span>
                            </label>

                            <span className={cn(
                              "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                              it.available !== false 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            )}>
                              {it.available !== false ? "✓ In Stock" : "✗ Out of Stock"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pl-6 text-[11px] text-slate-500">
                            <div className="flex items-center gap-2">
                              <span>Qty: <strong>x{it.quantity || 1}</strong></span>
                              <span className="text-slate-300">|</span>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-700">Price: ₹</span>
                                <input
                                  type="number"
                                  value={it.price}
                                  onChange={(e) => handleUpdateItemPrice(order.id, idx, e.target.value)}
                                  disabled={it.available === false}
                                  className="w-16 px-1.5 py-0.5 text-xs font-black bg-slate-50 border border-slate-300 rounded text-slate-900 text-right focus:bg-white focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                            </div>

                            <span className="font-black text-slate-900">
                              ₹{it.available !== false 
                                ? (Number(it.price || 0) * (Number(it.quantity) || 1)).toFixed(2) 
                                : (it.substitute && it.substitutePrice ? Number(it.substitutePrice).toFixed(2) : '0.00')}
                            </span>
                          </div>

                          {it.available === false && (
                            <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between pl-6 text-[10px]">
                              <span className="text-rose-600 font-bold">Unchecked (Marked Unavailable)</span>
                              {it.substitute ? (
                                <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Substitute: {it.substitute} (₹{it.substitutePrice})
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const sub = prompt("Enter substitute / generic brand name:", `${it.name.split(' ')[0]} Generic Equivalent`);
                                    if (sub) {
                                      const defaultPrice = Math.round((Number(it.price) || 100) * 0.75);
                                      const subPrice = prompt("Enter unit price (₹):", String(defaultPrice));
                                      handleAddSubstitute(order.id, idx, sub, subPrice || defaultPrice);
                                    }
                                  }}
                                  className="text-blue-600 font-black hover:underline cursor-pointer"
                                >
                                  + Suggest Generic Substitute
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Bill Total:</span>
                        <span className="text-lg font-black text-slate-900">₹{Number(order.total || 250).toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Eye size={14} className="mr-1" /> View Slip
                        </Button>
                        <Button
                          onClick={() => handleAcceptOrder(order)}
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
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
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 text-xs shadow-sm">
                No orders currently in packing stage. Accept an incoming order to begin packing.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packingOrders.map(order => (
                  <div key={order.id} className="bg-white border-2 border-blue-200 rounded-3xl p-5 space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-700 flex items-center gap-1.5">
                        <Package size={14} /> Packing in Progress
                      </span>
                      <span className="text-xs font-mono text-slate-500">{order.id}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{order.customer_name || 'Patient Order'}</h4>
                      <p className="text-xs text-slate-500">Doctor: {order.doctorName || 'Registered Physician'}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Medicines being packed:</span>
                      {(order.items || []).map((m, i) => (
                        <p key={i} className="text-xs text-slate-700 flex justify-between">
                          <span>✔ {m.name}</span>
                          <span className="text-slate-500 font-bold">x{m.quantity || 1}</span>
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Cold Chain Thermal Pack Ready</span>
                      <Button
                        onClick={() => handleMarkPacked(order)}
                        variant="primary"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
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
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 text-xs shadow-sm">
                No orders waiting for pickup right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyOrders.map(order => (
                  <div key={order.id} className="bg-white border-2 border-purple-200 rounded-3xl p-5 space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-purple-700 flex items-center gap-1.5">
                        <Send size={14} /> Assigned to Rider
                      </span>
                      <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        OTP: {order.otp || '5821'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-200">
                      <div>
                        <span className="text-[10px] text-purple-800 uppercase font-black">Dedicated Delivery Partner:</span>
                        <h5 className="font-extrabold text-sm text-purple-950">{order.rider?.name || 'Vikram Rathore'}</h5>
                        <p className="text-[11px] text-purple-700 font-medium">{order.rider?.vehicle || 'Ather 450X EV'}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                        Arriving in 2m
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
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
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 text-xs shadow-sm">
                No completed orders yet today.
              </div>
            ) : (
              completedOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{order.id} • {order.customer_name || 'Customer'}</span>
                    <span className="text-slate-500">{order.items?.length || 1} items delivered safely</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700 block">₹{Number(order.total || 0).toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Delivered</span>
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" />
                  <h4 className="font-black text-sm text-slate-900">Prescription Verification Inspection</h4>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p><strong className="text-slate-800">Order ID:</strong> {selectedOrder.id}</p>
                <p><strong className="text-slate-800">Doctor:</strong> {selectedOrder.doctorName || 'Dr. Rajesh Sharma, MD'}</p>
                <p><strong className="text-slate-800">Clinic:</strong> {selectedOrder.clinicHospital || 'City Healthcare Center'}</p>
                <p><strong className="text-slate-800">Customer:</strong> {selectedOrder.customer_name || 'Verified Patient'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase text-[10px]">Verify Stock & Dispense Price:</span>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {(selectedOrder.items || selectedOrder.medicines || []).filter(i => i.available !== false).length} / {(selectedOrder.items || selectedOrder.medicines || []).length} Available
                  </span>
                </div>

                {(selectedOrder.items || selectedOrder.medicines || []).map((it, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={it.available !== false}
                          onChange={() => handleToggleItemAvailability(selectedOrder.id, idx)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                        />
                        <span className={cn("font-bold text-xs", it.available !== false ? "text-slate-900" : "text-rose-600 line-through")}>
                          {it.name}
                        </span>
                      </label>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", it.available !== false ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                        {it.available !== false ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pl-6 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>Qty: <strong>x{it.quantity || 1}</strong></span>
                        <div className="flex items-center gap-1">
                          <span>₹</span>
                          <input
                            type="number"
                            value={it.price}
                            onChange={(e) => handleUpdateItemPrice(selectedOrder.id, idx, e.target.value)}
                            disabled={it.available === false}
                            className="w-14 px-1 py-0.5 text-xs font-black bg-slate-50 border border-slate-300 rounded text-slate-900 text-right"
                          />
                        </div>
                      </div>
                      <span className="font-black text-slate-900">
                        ₹{it.available !== false ? (Number(it.price || 0) * (Number(it.quantity) || 1)).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-black">
                  <span className="text-slate-600">Calculated Order Total:</span>
                  <span className="text-sm text-slate-900">₹{Number(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button onClick={() => setSelectedOrder(null)} variant="outline" size="sm" className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleAcceptOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20"
                >
                  Confirm & Start Packing (₹{Number(selectedOrder.total || 0).toFixed(2)})
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
