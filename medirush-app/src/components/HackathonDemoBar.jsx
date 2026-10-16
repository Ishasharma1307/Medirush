import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Building2, Bike, User, MapPin, 
  PhoneCall, FileText, ChevronUp, ChevronDown, 
  X, Check, RotateCcw, Volume2, Sparkles 
} from 'lucide-react';
import { broadcastRealtimeEvent, getStoredOrders } from '../services/realtimeNetwork';
import { soundEffects } from '../utils/soundEffects';

export const HackathonDemoBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const orders = getStoredOrders();
        setPendingOrdersCount(orders.filter(o => o.status !== 'Delivered').length);
      } catch (e) {}
    };
    updateCount();
    const interval = setInterval(updateCount, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerLiveDemoBroadcast = () => {
    const orderId = `ORD-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDemoOrder = {
      id: orderId,
      isSplitOrder: true,
      singleRiderMultiStop: true,
      status: 'Ready for Pickup',
      date: new Date().toISOString(),
      total: 312.00,
      pharmacy_name: 'Apollo Pharmacy 24/7 + MedPlus Mart',
      pharmacy_address: 'Indiranagar Hub, Bengaluru',
      pharmacist_name: 'Dr. Ramesh Sharma (Reg. #84920)',
      delivery_address: 'Flat 402, 100ft Road, Indiranagar',
      deliveryEta: '10 mins',
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      items: [
        { name: 'Augmentin 625 Duo', quantity: 1, price: 182.00 },
        { name: 'Dolo 650mg Paracetamol', quantity: 2, price: 65.00 },
        { name: 'Pantocid 40mg', quantity: 1, price: 65.00 }
      ],
      packages: [
        {
          packageNumber: 1,
          pharmacy_name: 'Apollo Pharmacy 24/7',
          items: [{ name: 'Augmentin 625 Duo', price: 182.00 }],
          deliveryEta: 'Stop 1'
        },
        {
          packageNumber: 2,
          pharmacy_name: 'MedPlus Mart',
          items: [{ name: 'Dolo 650mg', price: 65.00 }, { name: 'Pantocid 40mg', price: 65.00 }],
          deliveryEta: 'Stop 2'
        }
      ]
    };

    try {
      const existing = getStoredOrders();
      existing.unshift(newDemoOrder);
      localStorage.setItem('medirush_orders', JSON.stringify(existing));
      broadcastRealtimeEvent('NEW_ORDER', { order: newDemoOrder });
      soundEffects.playSuccessFanfare();
      setToast('⚡ Broadcast Sent! Open Pharmacy Terminal or Rider Fleet to view live.');
      setTimeout(() => setToast(''), 4500);
    } catch (e) {
      console.error(e);
    }
  };

  const resetAllDemoData = () => {
    localStorage.removeItem('medirush_orders');
    localStorage.removeItem('medirush_local_prescriptions');
    localStorage.removeItem('medirush_cart');
    setToast('🔄 Demo data reset to initial clean state.');
    setTimeout(() => setToast(''), 3000);
  };

  const navItems = [
    { label: 'Patient App', path: '/home', icon: User, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { label: 'Upload Rx', path: '/prescription-upload', icon: FileText, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
    { label: 'Pharmacy Terminal', path: '/pharmacy-partner', icon: Building2, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'Rider Fleet', path: '/delivery-partner', icon: Bike, color: 'text-amber-800 bg-amber-50 hover:bg-amber-100' },
    { label: 'Live Order Track', path: '/track-order', icon: MapPin, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { label: 'Emergency SOS', path: '/emergency-request', icon: PhoneCall, color: 'text-red-600 bg-red-50 hover:bg-red-100' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 max-w-sm bg-gray-900 text-white text-xs font-bold p-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2"
          >
            <Sparkles size={16} className="text-yellow-400 flex-shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Navigator Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-gray-200/90 mb-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-xs">
                  <Zap size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Hackathon Demo Switcher</h4>
                  <p className="text-[10px] text-gray-500 font-medium">1-Click role navigation for judges</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Switch Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer border ${item.color} ${isActive ? 'ring-2 ring-primary border-primary font-black shadow-xs' : 'border-transparent font-bold text-xs'}`}
                  >
                    <item.icon size={16} className="flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Actions for Judges */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <button
                onClick={triggerLiveDemoBroadcast}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Zap size={14} className="text-amber-300" />
                <span>Simulate Live Prescription Broadcast</span>
              </button>

              <button
                onClick={resetAllDemoData}
                className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset Demo Orders to Clean State</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-black shadow-2xl border border-gray-700/80 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <Zap size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
        <span>Judges Demo Switcher</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

    </div>
  );
};
