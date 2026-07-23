import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Plus, Activity, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReminderCard } from '../components/ReminderCard';
import { AddReminderModal } from '../components/AddReminderModal';
import { mockMedicineReminders } from '../data/mockMedicineReminders';
import { motion, AnimatePresence } from 'framer-motion';

export const MedicineReminder = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState(mockMedicineReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Fake frontend notification logic
  useEffect(() => {
    // Check every minute if a reminder time matches current time
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeStr = `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes} ${ampm}`;

      const dueReminder = reminders.find(r => r.time === timeStr && r.status === 'Active' && !r.taken_today);
      if (dueReminder) {
        showToast(`Time to take your medicine: ${dueReminder.medicine_name}`);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders]);

  const showToast = (msg) => {
    setToastMsg(msg);
    // Play soft alert sound
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play blocked by browser'));
    } catch(e) {}
    
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handleAddReminder = (newReminder) => {
    setReminders([newReminder, ...reminders]);
    showToast('Reminder added successfully!');
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleTogglePause = (id) => {
    setReminders(reminders.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'Paused' ? 'Active' : 'Paused' };
      }
      return r;
    }));
  };

  const handleMarkTaken = (id) => {
    setReminders(reminders.map(r => {
      if (r.id === id) {
        return { ...r, taken_today: true };
      }
      return r;
    }));
    showToast('Medicine marked as taken. Great job!');
  };

  const morningReminders = reminders.filter(r => r.period === 'Morning');
  const afternoonReminders = reminders.filter(r => r.period === 'Afternoon');
  const nightReminders = reminders.filter(r => r.period === 'Night');

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
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[9999]"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-full shadow-glass border border-white/50 px-6 py-3 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                <Volume2 size={16} className="text-primary animate-pulseSoft" />
              </div>
              <p className="font-bold text-gray-800 text-sm">{toastMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-indigo-800 px-4 pt-10 pb-20 shadow-floating relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />
        
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-xl transition-all shadow-sm border border-white/20">
          <ArrowLeft size={20} className="text-white" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md mx-auto mt-4"
        >
          <div className="inline-flex items-center justify-center mb-4">
             <div className="relative">
               <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
               <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 p-4 rounded-full shadow-glass">
                 <Bell size={32} className="text-white" />
               </div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">Medicine Reminder</h1>
          <p className="text-blue-100 mt-2 text-sm font-medium drop-shadow-sm">Never miss your medicines again.</p>
        </motion.div>
      </div>

      {/* BODY */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 -mt-10 relative z-10 space-y-6"
      >
        
        {reminders.length === 0 ? (
          <motion.div variants={itemVariants} className="glass-card p-12 text-center flex flex-col items-center justify-center border-white/60">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-full mb-6 border border-white/60 shadow-inner">
               <Activity size={40} className="text-primary/50" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">No reminders added yet.</h2>
            <p className="text-gray-600 font-medium text-sm mb-8 max-w-xs mx-auto leading-relaxed">Add your daily medicines and we'll remind you when it's time to take them.</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2">
              <Plus size={20} /> Add First Reminder
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            
            {/* Morning Section */}
            {morningReminders.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50"></div>
                  <h2 className="text-lg font-extrabold text-gray-900 drop-shadow-sm">Morning</h2>
                </div>
                <div className="space-y-4">
                  {morningReminders.map(r => <ReminderCard key={r.id} reminder={r} onDelete={handleDelete} onTogglePause={handleTogglePause} onMarkTaken={handleMarkTaken} />)}
                </div>
              </motion.section>
            )}

            {/* Afternoon Section */}
            {afternoonReminders.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50"></div>
                  <h2 className="text-lg font-extrabold text-gray-900 drop-shadow-sm">Afternoon</h2>
                </div>
                <div className="space-y-4">
                  {afternoonReminders.map(r => <ReminderCard key={r.id} reminder={r} onDelete={handleDelete} onTogglePause={handleTogglePause} onMarkTaken={handleMarkTaken} />)}
                </div>
              </motion.section>
            )}

            {/* Night Section */}
            {nightReminders.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
                  <h2 className="text-lg font-extrabold text-gray-900 drop-shadow-sm">Night</h2>
                </div>
                <div className="space-y-4">
                  {nightReminders.map(r => <ReminderCard key={r.id} reminder={r} onDelete={handleDelete} onTogglePause={handleTogglePause} onMarkTaken={handleMarkTaken} />)}
                </div>
              </motion.section>
            )}

          </div>
        )}

      </motion.div>

      {/* Floating Action Button */}
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-6 md:bottom-10 md:right-10 bg-primary hover:bg-primary-dark text-white p-4 rounded-2xl shadow-floating hover:shadow-lg transition-all z-40 group border border-white/20"
        aria-label="Add Reminder"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* Add Reminder Modal */}
      <AddReminderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddReminder} 
      />

    </div>
  );
};
