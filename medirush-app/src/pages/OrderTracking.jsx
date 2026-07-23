import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const STAGES = [
  { id: 1, label: 'Order Placed', desc: 'We have received your order', icon: Package },
  { id: 2, label: 'Pharmacy Accepted', desc: 'Preparing your medicines', icon: ShieldCheck },
  { id: 3, label: 'Out for Delivery', desc: 'Partner is on the way', icon: MapPin },
  { id: 4, label: 'Delivered', desc: 'Order delivered successfully', icon: CheckCircle2 }
];

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);

  // Simulate order progression
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(2), 3000);
    const timer2 = setTimeout(() => setCurrentStage(3), 8000);
    const timer3 = setTimeout(() => setCurrentStage(4), 15000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary to-blue-800 pt-10 pb-32 px-5 relative overflow-hidden rounded-b-[2.5rem] shadow-floating">
        <div className="max-w-3xl mx-auto relative z-10 flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-xl transition-all shadow-sm border border-white/20">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Track Order</h1>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">#{id}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-glass border border-white/30 text-white font-extrabold">
            12:45 PM
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-20 space-y-6">
        
        {/* Map Placeholder */}
        <div className="glass-card h-48 border-white/60 relative overflow-hidden flex items-center justify-center bg-gray-100">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
          {currentStage < 4 ? (
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 mb-2">
                <Package size={24} className="text-white" />
              </div>
              <div className="w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
              <p className="text-sm font-extrabold text-gray-700 mt-2">Live Tracking Active</p>
            </motion.div>
          ) : (
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 mb-2 text-white">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm font-extrabold text-green-700 mt-2">Delivered</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="glass-card p-6 border-white/60">
          <h3 className="font-extrabold text-gray-900 mb-6">Order Status</h3>
          <div className="space-y-6">
            {STAGES.map((stage, idx) => {
              const isCompleted = currentStage >= stage.id;
              const isCurrent = currentStage === stage.id;
              
              return (
                <div key={stage.id} className="flex relative">
                  {/* Line */}
                  {idx < STAGES.length - 1 && (
                    <div className={cn(
                      "absolute top-8 left-5 w-0.5 h-full -ml-[1px] -z-10 transition-colors duration-500",
                      currentStage > stage.id ? "bg-primary" : "bg-gray-200"
                    )}></div>
                  )}
                  
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 shadow-sm z-10",
                    isCompleted ? "bg-primary text-white border-2 border-primary" : "bg-white text-gray-400 border-2 border-gray-200",
                    isCurrent && "ring-4 ring-primary/20"
                  )}>
                    <stage.icon size={18} />
                  </div>
                  
                  <div className="ml-4 pb-2">
                    <h4 className={cn(
                      "font-extrabold text-sm transition-colors",
                      isCompleted ? "text-gray-900" : "text-gray-400"
                    )}>{stage.label}</h4>
                    <p className={cn(
                      "text-xs font-medium mt-1 transition-colors",
                      isCompleted ? "text-gray-600" : "text-gray-400"
                    )}>{stage.desc}</p>
                    
                    {isCurrent && stage.id === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center"
                      >
                        <div className="w-10 h-10 bg-blue-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                           <span className="font-bold text-blue-800">DP</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900">Raju Delivery</p>
                          <p className="text-xs text-gray-500 font-medium">MH 01 AB 1234</p>
                        </div>
                        <button onClick={() => window.open('tel:1234567890')} className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <Phone size={18} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
