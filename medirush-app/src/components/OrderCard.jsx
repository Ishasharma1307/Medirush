import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Store, MapPin, Calendar, ChevronDown, ChevronUp, Radio, ShieldCheck, Key } from 'lucide-react';
import { OrderTimeline } from './OrderTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

export const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-orange-500/10';
      case 'Accepted': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-blue-500/10';
      case 'Packed': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 shadow-indigo-500/10';
      case 'Out for Delivery': return 'bg-purple-500/10 text-purple-600 border-purple-500/20 shadow-purple-500/10';
      case 'Delivered': return 'bg-green-500/10 text-green-700 border-green-500/20 shadow-green-500/10';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20 shadow-gray-500/10';
    }
  };

  const formattedDate = new Date(order.date || Date.now()).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const numericTotal = Number(order.total) || 0;

  return (
    <div className="glass-card border-white/60 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header Summary */}
      <div 
        className="p-5 cursor-pointer hover:bg-white/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 border border-primary/20 text-primary w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <Package size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{order.id}</p>
                {order.isSplitOrder && (
                  <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded-md">
                    ⚡ Split Order (2 Pkgs)
                  </span>
                )}
                {order.isPartialOrder && !order.isSplitOrder && (
                  <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">
                    Partial ({order.partialCount}/{order.totalPrescriptionCount} Meds)
                  </span>
                )}
                {order.otp && (
                  <span className="text-[9px] font-black text-amber-800 bg-amber-100/90 border border-amber-300 px-1.5 py-0.2 rounded-md">
                    OTP: {order.otp}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2 drop-shadow-sm">
                ₹{numericTotal.toFixed(2)}
                <span className={cn("text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm", getStatusColor(order.status))}>
                  {order.status}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-700 font-bold flex items-center justify-end gap-1.5 mb-1">
                <Store size={14} className="text-primary/70" /> {order.pharmacy_name || 'Partner Pharmacy'}
              </p>
              <p className="text-[11px] text-gray-500 font-bold flex items-center justify-end gap-1.5 uppercase tracking-widest">
                <Calendar size={12} className="text-primary/70" /> {formattedDate}
              </p>
            </div>
            
            {/* Live Track Order Button on Card */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/track-order/${order.id}`);
              }}
              variant="primary"
              size="sm"
              className="py-2 px-3 text-xs font-black shadow-md shadow-blue-500/25 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer"
            >
              <Radio size={13} className="animate-pulse text-amber-300" />
              <span>Track Live</span>
            </Button>

            <div className={cn(
              "bg-white/60 p-2.5 rounded-xl border shadow-sm transition-colors",
              expanded ? "text-primary border-primary/30 bg-primary/5" : "text-gray-500 border-white/50"
            )}>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                 <ChevronDown size={18} />
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/50 p-6 bg-white/20 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Items & Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Order Items</h4>
                    <div className="space-y-3">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
                          <div>
                            <p className="font-extrabold text-gray-900 text-sm drop-shadow-sm">{item.name}</p>
                            <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-extrabold text-primary text-sm bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Delivery Address</h4>
                    <div className="text-sm text-gray-700 font-bold flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
                      <div className="bg-white p-1.5 rounded-lg shadow-inner flex-shrink-0 border border-gray-100">
                         <MapPin size={16} className="text-primary" />
                      </div>
                      <p className="leading-relaxed mt-0.5">{order.delivery_address}</p>
                    </div>
                  </div>

                  {order.otp && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">Delivery Verification OTP</span>
                        <p className="text-xs text-amber-800 font-medium">Share only with rider upon arrival</p>
                      </div>
                      <span className="text-xl font-black text-amber-950 tracking-widest px-3 py-1 bg-white rounded-xl border border-amber-200 shadow-sm">
                        {order.otp}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Column: Tracking Timeline */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Live Tracking</h4>
                  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
                    <OrderTimeline timeline={order.timeline || []} />
                  </div>
                  
                  <Button 
                    onClick={() => navigate(`/track-order/${order.id}`)}
                    variant="primary" 
                    className="mt-4 w-full py-3.5 text-xs font-black shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white"
                  >
                    <Radio size={16} className="animate-pulse text-amber-300" />
                    <span>Open Live Delivery Radar Map</span>
                  </Button>

                  {order.status === 'Pending' && (
                    <Button 
                      variant="glass" 
                      className="mt-3 w-full py-2.5 text-[11px] uppercase tracking-widest text-danger border-danger/20 hover:bg-danger/10 hover:border-danger/30"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
