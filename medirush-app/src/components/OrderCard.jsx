import React, { useState } from 'react';
import { Package, Store, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { OrderTimeline } from './OrderTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

export const OrderCard = ({ order }) => {
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

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="glass-card border-white/60 overflow-hidden transition-all duration-300">
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
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{order.id}</p>
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2 drop-shadow-sm">
                ${order.total.toFixed(2)}
                <span className={cn("text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm", getStatusColor(order.status))}>
                  {order.status}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-600 font-bold flex items-center justify-end gap-1.5 mb-1.5">
                <Store size={14} className="text-primary/70" /> {order.pharmacy_name}
              </p>
              <p className="text-[11px] text-gray-500 font-bold flex items-center justify-end gap-1.5 uppercase tracking-widest">
                <Calendar size={12} className="text-primary/70" /> {formattedDate}
              </p>
            </div>
            
            <div className={cn(
              "bg-white/60 p-2.5 rounded-xl border shadow-sm transition-colors",
              expanded ? "text-primary border-primary/30 bg-primary/5" : "text-gray-500 border-white/50"
            )}>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                 <ChevronDown size={20} />
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
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
                          <div>
                            <p className="font-extrabold text-gray-900 text-sm drop-shadow-sm">{item.name}</p>
                            <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-extrabold text-primary text-sm bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">${(item.price * item.quantity).toFixed(2)}</p>
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
                </div>

                {/* Right Column: Tracking Timeline */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Live Tracking</h4>
                  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
                    <OrderTimeline timeline={order.timeline} />
                  </div>
                  
                  {order.status === 'Pending' && (
                    <Button 
                      variant="glass" 
                      className="mt-5 w-full py-3 text-[11px] uppercase tracking-widest text-danger border-danger/20 hover:bg-danger/10 hover:border-danger/30"
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
