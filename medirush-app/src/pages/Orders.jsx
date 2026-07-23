import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle2 } from 'lucide-react';
import { OrderCard } from '../components/OrderCard';
import { mockOrders } from '../data/mockOrders';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const Orders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const activeOrders = mockOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = mockOrders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-primary pt-10 pb-20 px-5 shadow-floating relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate(-1)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-xl transition-all mb-4 border border-white/20 shadow-sm">
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-glass border border-white/30">
              <Package size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Your Orders</h1>
              <p className="text-blue-100 mt-1 text-sm font-bold uppercase tracking-widest drop-shadow-sm">Track and manage your deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 -mt-8 relative z-20"
      >
        
        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex p-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow-glass border border-white/50 mb-6 w-full sm:w-fit">
          <button 
            onClick={() => setActiveTab('active')}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              activeTab === 'active' 
                ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/30" 
                : "text-gray-600 hover:bg-white/50"
            )}
          >
            <Clock size={14} className={activeTab === 'active' ? "text-white" : "text-primary/70"} /> Active Orders
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              activeTab === 'past' 
                ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/30" 
                : "text-gray-600 hover:bg-white/50"
            )}
          >
            <CheckCircle2 size={14} className={activeTab === 'past' ? "text-white" : "text-primary/70"} /> Past Orders
          </button>
        </motion.div>

        {/* List */}
        <AnimatePresence mode="wait">
          {displayOrders.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-12 text-center flex flex-col items-center justify-center border-white/60"
            >
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-full mb-6 border border-white/50 shadow-inner">
                <Package size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">No {activeTab} orders</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-8">You don't have any {activeTab} orders at the moment.</p>
              <button 
                onClick={() => navigate('/medicines')}
                className="px-8 py-3.5 bg-primary/10 text-primary border border-primary/20 font-bold rounded-xl hover:bg-primary/20 transition-colors shadow-sm"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={containerVariants}
              className="space-y-4"
            >
              {displayOrders.map(order => (
                <motion.div variants={itemVariants} key={order.id}>
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};
