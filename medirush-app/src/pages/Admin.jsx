import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, DollarSign, Package, Activity } from 'lucide-react';
import { DashboardStatsCard } from '../components/DashboardStatsCard';
import { AdminOrderCard } from '../components/AdminOrderCard';
import { mockAdminOrders } from '../data/mockAdminOrders';
import { motion } from 'framer-motion';

export const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockAdminOrders);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const acceptedCount = orders.filter(o => o.status === 'Accepted').length;
  const revenue = orders.filter(o => o.status !== 'Rejected').reduce((acc, o) => acc + o.total, 0);

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
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 pt-10 pb-24 px-5 shadow-floating relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex justify-between items-center mt-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-blue-100 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full mb-4 border border-white/20 shadow-sm">
              <ShieldAlert size={14} className="mr-1.5 text-orange-400" /> Admin Access
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Pharmacy Dashboard</h1>
            <p className="text-gray-300 mt-2 text-[11px] font-bold uppercase tracking-widest drop-shadow-sm">Manage incoming orders and emergencies.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-glass">
            <Activity size={32} className="text-blue-200" />
          </motion.div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 -mt-10 relative z-20"
      >
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <motion.div variants={itemVariants}>
            <DashboardStatsCard 
              title="Pending Orders" 
              value={pendingCount} 
              icon={Package} 
              color="bg-orange-500/10 text-orange-600 border border-orange-500/20" 
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardStatsCard 
              title="Active Deliveries" 
              value={acceptedCount} 
              icon={Activity} 
              color="bg-primary/10 text-primary border border-primary/20" 
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardStatsCard 
              title="Today's Revenue" 
              value={`$${revenue.toFixed(2)}`} 
              icon={DollarSign} 
              color="bg-green-500/10 text-green-600 border border-green-500/20" 
              trend="+12% from yesterday"
            />
          </motion.div>
        </div>

        {/* Orders Queue */}
        <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <h2 className="text-xl font-extrabold text-gray-900 drop-shadow-sm ml-2">Incoming Orders</h2>
          <span className="bg-gradient-to-r from-primary to-primary-light text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl shadow-md uppercase tracking-widest">{orders.length} Total</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <motion.div variants={itemVariants} key={order.id}>
              <AdminOrderCard 
                order={order} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};
