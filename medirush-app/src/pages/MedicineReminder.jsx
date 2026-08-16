import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Plus, Activity, Volume2, CheckCircle2, Calendar, Pill, Clock, Sun, Moon, Sunset, Sunrise, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReminderCard } from '../components/ReminderCard';
import { AddReminderModal } from '../components/AddReminderModal';
import { mockMedicineReminders } from '../data/mockMedicineReminders';
import { motion, AnimatePresence } from 'framer-motion';

const LOCAL_STORAGE_KEY = 'medirush_medicine_reminders';

export const MedicineReminder = () => {
  const navigate = useNavigate();

  // Load reminders from localStorage or fallback to mock data
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse reminders from localStorage', e);
      }
    }
    return mockMedicineReminders;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Save to localStorage whenever reminders state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Audio Notification Checker (checks every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeStr = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

      const dueReminder = reminders.find(r => r.time === timeStr && r.status === 'Active' && !r.taken_today);
      if (dueReminder) {
        showToast(`Time for your dose: ${dueReminder.medicine_name} (${dueReminder.dosage})`);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders]);

  const showToast = (msg) => {
    setToastMsg(msg);
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}

    setTimeout(() => setToastMsg(null), 5000);
  };

  // Add single or array of new reminders (from AddReminderModal)
  const handleAddReminder = (newItems) => {
    const itemsToAdd = Array.isArray(newItems) ? newItems : [newItems];
    const updated = [...itemsToAdd, ...reminders];
    setReminders(updated);
    showToast(`Added ${itemsToAdd.length} dose schedule${itemsToAdd.length > 1 ? 's' : ''} successfully!`);
  };

  const handleDelete = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    showToast('Reminder deleted');
  };

  const handleTogglePause = (id) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'Paused' ? 'Active' : 'Paused' };
      }
      return r;
    });
    setReminders(updated);
  };

  const handleMarkTaken = (id) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, taken_today: true };
      }
      return r;
    });
    setReminders(updated);
    showToast('Dose marked as taken! Great job 👏');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all reminders?')) {
      setReminders([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast('All reminders cleared');
    }
  };

  // Filtered List based on Active Filter
  const filteredReminders = reminders.filter(r => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Taken') return r.taken_today;
    if (activeFilter === 'Pending') return !r.taken_today && r.status === 'Active';
    return r.period === activeFilter;
  });

  const morningReminders = filteredReminders.filter(r => r.period === 'Morning');
  const afternoonReminders = filteredReminders.filter(r => r.period === 'Afternoon');
  const eveningReminders = filteredReminders.filter(r => r.period === 'Evening');
  const nightReminders = filteredReminders.filter(r => r.period === 'Night');

  // Daily Statistics
  const totalDosesToday = reminders.filter(r => r.status === 'Active').length;
  const takenDosesToday = reminders.filter(r => r.status === 'Active' && r.taken_today).length;
  const progressPercent = totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F5F9FF] font-sans pb-24 relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[9999]"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-blue-100 px-6 py-3 flex items-center gap-3">
              <div className="bg-[#1565C0]/10 p-2 rounded-full border border-blue-200">
                <Volume2 size={16} className="text-[#1565C0] animate-pulse" />
              </div>
              <p className="font-extrabold text-gray-900 text-xs sm:text-sm">{toastMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="bg-gradient-to-br from-[#1565C0] via-blue-700 to-indigo-900 text-white px-4 pt-8 pb-16 shadow-lg relative overflow-hidden rounded-b-[2.5rem]">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2.5 rounded-2xl transition-all border border-white/20 cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {reminders.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[10px] font-black uppercase tracking-wider bg-red-500/20 hover:bg-red-500/30 text-red-100 px-3 py-1.5 rounded-xl border border-red-400/30 cursor-pointer active:scale-95"
            >
              Reset All
            </button>
          )}
        </div>

        <div className="max-w-xl mx-auto text-center relative z-10 space-y-2">
          <div className="inline-flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 p-3.5 rounded-3xl shadow-inner mb-1">
            <Bell size={28} className="text-yellow-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Medicine Dose Reminder</h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium">
            Schedule exact medicine dose timings & food instructions for your family
          </p>

          {/* Daily Dose Tracker Progress Bar */}
          {totalDosesToday > 0 && (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 mt-4 max-w-sm mx-auto space-y-1.5">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-blue-100">Today's Progress</span>
                <span className="text-white">{takenDosesToday} of {totalDosesToday} Doses Taken ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 space-y-6">
        
        {/* Category Filters Bar */}
        <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar justify-center sm:justify-start">
          {[
            { id: 'All', label: 'All Doses' },
            { id: 'Pending', label: '⏳ Pending' },
            { id: 'Taken', label: '✓ Taken' },
            { id: 'Morning', label: '🌅 Morning' },
            { id: 'Afternoon', label: '☀️ Afternoon' },
            { id: 'Evening', label: '🌆 Evening' },
            { id: 'Night', label: '🌙 Night' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 ${
                activeFilter === f.id
                  ? 'bg-[#1565C0] text-white border border-[#1565C0]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reminders List */}
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center flex flex-col items-center justify-center border border-blue-50 shadow-md">
            <div className="bg-blue-50 p-5 rounded-full mb-4 border border-blue-100">
              <Pill size={36} className="text-[#1565C0]" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">No reminders found</h2>
            <p className="text-gray-500 font-medium text-xs mb-6 max-w-xs leading-relaxed">
              {activeFilter === 'All' 
                ? 'Add your daily medicine doses and times to get instant alerts on time.' 
                : `No doses categorized under "${activeFilter}".`}
            </p>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-[#1565C0] hover:bg-blue-800 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Plus size={18} /> Add First Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Morning Section */}
            {morningReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sunrise size={16} className="text-amber-500" /> Morning Doses ({morningReminders.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {morningReminders.map(r => (
                    <ReminderCard 
                      key={r.id} 
                      reminder={r} 
                      onDelete={handleDelete} 
                      onTogglePause={handleTogglePause} 
                      onMarkTaken={handleMarkTaken} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Afternoon Section */}
            {afternoonReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sun size={16} className="text-orange-500" /> Afternoon Doses ({afternoonReminders.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {afternoonReminders.map(r => (
                    <ReminderCard 
                      key={r.id} 
                      reminder={r} 
                      onDelete={handleDelete} 
                      onTogglePause={handleTogglePause} 
                      onMarkTaken={handleMarkTaken} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Evening Section */}
            {eveningReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sunset size={16} className="text-purple-500" /> Evening Doses ({eveningReminders.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {eveningReminders.map(r => (
                    <ReminderCard 
                      key={r.id} 
                      reminder={r} 
                      onDelete={handleDelete} 
                      onTogglePause={handleTogglePause} 
                      onMarkTaken={handleMarkTaken} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Night Section */}
            {nightReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Moon size={16} className="text-indigo-600" /> Night Doses ({nightReminders.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nightReminders.map(r => (
                    <ReminderCard 
                      key={r.id} 
                      reminder={r} 
                      onDelete={handleDelete} 
                      onTogglePause={handleTogglePause} 
                      onMarkTaken={handleMarkTaken} 
                    />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>

      {/* Floating Add Reminder Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-[#1565C0] hover:bg-blue-800 text-white p-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all z-40 border border-white/20 flex items-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer"
        aria-label="Add Reminder"
      >
        <Plus size={20} />
        <span>Add Reminder</span>
      </motion.button>

      {/* Add Reminder Modal Component */}
      <AddReminderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddReminder} 
      />

    </div>
  );
};
