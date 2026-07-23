import React, { useState } from 'react';
import { X, Clock, Pill, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './forms/Input';
import { motion, AnimatePresence } from 'framer-motion';

export const AddReminderModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    time: '',
    period: 'Morning',
    frequency: 'Once daily',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const formatAMPM = (timeStr) => {
    let [h, m] = timeStr.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours < 10 ? '0'+hours : hours}:${m} ${ampm}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: `new-${Date.now()}`,
      ...formData,
      time: formData.time ? formatAMPM(formData.time) : formData.time,
      status: 'Active',
      taken_today: false
    });
    
    // Reset form after submit
    setFormData({
      medicine_name: '',
      dosage: '',
      time: '',
      period: 'Morning',
      frequency: 'Once daily',
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
    onClose();
  };

  // Determine period based on time input
  const handleTimeChange = (e) => {
    const timeVal = e.target.value;
    let period = 'Morning';
    if (timeVal) {
      const hour = parseInt(timeVal.split(':')[0], 10);
      if (hour >= 12 && hour < 17) period = 'Afternoon';
      else if (hour >= 17 || hour < 5) period = 'Night';
    }
    setFormData({ ...formData, time: timeVal, period });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] w-full max-w-md shadow-glass border border-white/60 overflow-hidden relative z-10"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/50 bg-white/40">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 drop-shadow-sm">
              <div className="bg-primary/10 p-2 rounded-xl shadow-inner border border-primary/20">
                <Pill className="text-primary" size={20} />
              </div>
              Add Reminder
            </h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-white hover:text-danger hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-danger/20">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Medicine Name <span className="text-danger">*</span></label>
              <input type="text" name="medicine_name" required value={formData.medicine_name} onChange={handleChange} className="w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium transition-all" placeholder="e.g. Paracetamol" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Dosage</label>
                <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} className="w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium transition-all" placeholder="e.g. 500mg" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1"><Clock size={12} className="text-primary"/> Time <span className="text-danger">*</span></label>
                <input type="time" name="time" required value={formData.time} onChange={handleTimeChange} className="w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none font-bold text-gray-900 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Frequency <span className="text-danger">*</span></label>
              <select name="frequency" required value={formData.frequency} onChange={handleChange} className="w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none font-bold text-gray-900 transition-all appearance-none cursor-pointer">
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1"><Calendar size={12} className="text-primary"/> Start Date <span className="text-danger">*</span></label>
                <input type="date" name="start_date" required value={formData.start_date} onChange={handleChange} className="w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none font-bold text-gray-900 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1"><Calendar size={12} className="text-primary"/> End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 shadow-inner rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none font-bold text-gray-900 transition-all" />
              </div>
            </div>

            <div className="pt-6 flex gap-3 border-t border-gray-200/50">
              <Button type="button" variant="glass" className="flex-1 py-3.5 rounded-xl border border-gray-300 bg-white/50 text-gray-700 hover:bg-white hover:text-gray-900" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1 py-3.5 rounded-xl shadow-lg shadow-primary/30">Save Reminder</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
