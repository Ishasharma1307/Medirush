import React, { useState } from 'react';
import { X, Clock, Pill, Calendar, Plus, Trash2, Sun, Moon, Sunset, Sunrise, Utensils, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

// Common medicine suggestions for quick selection
const POPULAR_MEDS = [
  'Paracetamol 500mg',
  'Dolo 650mg',
  'Pantoprazole 40mg',
  'Amoxicillin 500mg',
  'Azithromycin 500mg',
  'Cetirizine 10mg',
  'Ascoril LS Syrup',
  'Becosules Capsule',
  'Shelcal 500mg',
  'Telmisartan 40mg',
  'Metformin 500mg',
  'Combiflam Tablet'
];

const FOOD_RELATION_OPTIONS = [
  { id: 'After Food', label: 'After Food (खाने के बाद)', icon: '🍲' },
  { id: 'Before Food', label: 'Before Food (खाली पेट / खाने से पहले)', icon: '🍳' },
  { id: 'With Food', label: 'With Food (खाने के साथ)', icon: '🥛' },
  { id: 'Bedtime', label: 'At Bedtime (सोते समय)', icon: '🌙' }
];

export const AddReminderModal = ({ isOpen, onClose, onAdd }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Twice daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [durationDays, setDurationDays] = useState('');

  // Array of doses: [{ id, time: '08:00', foodRelation: 'After Food' }]
  const [doses, setDoses] = useState([
    { id: 'd1', time: '08:00', foodRelation: 'After Food' },
    { id: 'd2', time: '20:00', foodRelation: 'After Food' }
  ]);

  if (!isOpen) return null;

  // Helper to format 24h '08:00' into 12h '08:00 AM'
  const formatAMPM = (timeStr) => {
    if (!timeStr) return '';
    let [h, m] = timeStr.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours < 10 ? '0' + hours : hours}:${m} ${ampm}`;
  };

  // Detect time period from 24h string '08:00'
  const getPeriodFromTime = (timeStr) => {
    if (!timeStr) return 'Morning';
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  // Frequency preset handler
  const handleFrequencyChange = (newFreq) => {
    setFrequency(newFreq);
    if (newFreq === 'Once daily') {
      setDoses([{ id: 'd1', time: '08:00', foodRelation: 'After Food' }]);
    } else if (newFreq === 'Twice daily') {
      setDoses([
        { id: 'd1', time: '08:00', foodRelation: 'After Food' },
        { id: 'd2', time: '20:00', foodRelation: 'After Food' }
      ]);
    } else if (newFreq === 'Three times daily') {
      setDoses([
        { id: 'd1', time: '08:00', foodRelation: 'After Food' },
        { id: 'd2', time: '14:00', foodRelation: 'After Food' },
        { id: 'd3', time: '21:00', foodRelation: 'After Food' }
      ]);
    } else if (newFreq === 'Four times daily') {
      setDoses([
        { id: 'd1', time: '08:00', foodRelation: 'After Food' },
        { id: 'd2', time: '13:00', foodRelation: 'After Food' },
        { id: 'd3', time: '18:00', foodRelation: 'After Food' },
        { id: 'd4', time: '22:00', foodRelation: 'After Food' }
      ]);
    }
  };

  // Add extra dose slot
  const handleAddDoseSlot = () => {
    if (doses.length >= 6) return;
    const nextHour = (8 + doses.length * 4) % 24;
    const timeStr = `${nextHour < 10 ? '0' + nextHour : nextHour}:00`;
    setDoses([...doses, { id: `d${Date.now()}`, time: timeStr, foodRelation: 'After Food' }]);
  };

  // Remove dose slot
  const handleRemoveDoseSlot = (index) => {
    if (doses.length <= 1) return;
    setDoses(doses.filter((_, i) => i !== index));
  };

  // Update specific dose field
  const handleDoseChange = (index, field, value) => {
    const updated = [...doses];
    updated[index] = { ...updated[index], [field]: value };
    setDoses(updated);
  };

  // Duration preset calculation
  const handleDurationPreset = (days) => {
    setDurationDays(days);
    if (!days) {
      setEndDate('');
      return;
    }
    const start = new Date(startDate);
    start.setDate(start.getDate() + parseInt(days, 10));
    setEndDate(start.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    // Create individual reminder entries for each scheduled dose
    const newReminders = doses.map((doseItem, idx) => {
      const period = getPeriodFromTime(doseItem.time);
      const time12h = formatAMPM(doseItem.time);
      return {
        id: `r-${Date.now()}-${idx}`,
        medicine_name: medicineName.trim(),
        dosage: dosage.trim() || '1 Dose',
        time: time12h,
        raw_time: doseItem.time,
        period: period,
        frequency: frequency,
        food_relation: doseItem.foodRelation,
        dose_number: idx + 1,
        total_doses: doses.length,
        start_date: startDate,
        end_date: endDate || null,
        status: 'Active',
        taken_today: false
      };
    });

    onAdd(newReminders);

    // Reset Form
    setMedicineName('');
    setDosage('1 Tablet');
    setFrequency('Twice daily');
    setDoses([
      { id: 'd1', time: '08:00', foodRelation: 'After Food' },
      { id: 'd2', time: '20:00', foodRelation: 'After Food' }
    ]);
    onClose();
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
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="bg-[#1565C0] text-white p-2.5 rounded-2xl shadow-md">
                <Pill size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Add Medicine Dose Schedule</h2>
                <p className="text-xs text-gray-500 font-bold">Set timing & doses for your medication</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body - Scrollable */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 no-scrollbar">
            
            {/* 1. Medicine Name Input + Quick Suggestions */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Konsi Medicine? (Medicine Name) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required 
                value={medicineName} 
                onChange={(e) => setMedicineName(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-gray-900 placeholder:text-gray-400 text-sm transition-all" 
                placeholder="e.g. Paracetamol, Dolo, Pantoprazole..." 
              />
              
              {/* Quick Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {POPULAR_MEDS.slice(0, 6).map((med) => (
                  <button
                    key={med}
                    type="button"
                    onClick={() => setMedicineName(med)}
                    className="text-[10px] font-extrabold bg-blue-50 hover:bg-blue-100 text-[#1565C0] px-2.5 py-1 rounded-full transition-all border border-blue-100 cursor-pointer active:scale-95"
                  >
                    + {med}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dosage Quantity (e.g. 1 Tablet / 5ml) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Dose Quantity / Strength (मात्रा)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['1 Tablet', '2 Tablets', '5ml Syrup', '1 Capsule'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDosage(preset)}
                    className={`py-2 px-3 text-xs font-black rounded-xl border transition-all cursor-pointer active:scale-95 ${
                      dosage === preset 
                        ? 'bg-[#1565C0] text-white border-[#1565C0] shadow-sm' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                value={dosage} 
                onChange={(e) => setDosage(e.target.value)} 
                className="w-full mt-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-gray-900 text-xs" 
                placeholder="Or custom dosage (e.g. 500mg, 10ml)..." 
              />
            </div>

            {/* 3. Daily Frequency Selection (Din me kitni bar) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Din me kitni bar lena he? (Doses per Day)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Once daily', label: '1 Bar Daily', count: '1 Dose' },
                  { id: 'Twice daily', label: '2 Bar Daily', count: 'Morning & Night' },
                  { id: 'Three times daily', label: '3 Bar Daily', count: 'Morning/Afternoon/Night' },
                  { id: 'Four times daily', label: '4 Bar Daily', count: 'Every 4-6 Hours' }
                ].map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => handleFrequencyChange(freq.id)}
                    className={`p-3 text-left rounded-2xl border transition-all cursor-pointer active:scale-95 flex flex-col justify-between ${
                      frequency === freq.id 
                        ? 'bg-gradient-to-br from-[#1565C0] to-blue-700 text-white border-[#1565C0] shadow-md' 
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-extrabold block">{freq.label}</span>
                    <span className={`text-[10px] font-semibold mt-1 ${frequency === freq.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {freq.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Per-Dose Timing & Food Instructions */}
            <div className="space-y-3 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <Clock size={16} className="text-[#1565C0]" />
                  <span>Dose Timing & Food Schedule ({doses.length} Doses)</span>
                </h3>
                {doses.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddDoseSlot}
                    className="text-[11px] font-black text-[#1565C0] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Dose Slot
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {doses.map((doseItem, idx) => {
                  const period = getPeriodFromTime(doseItem.time);
                  return (
                    <div key={doseItem.id} className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                          {period === 'Morning' && <Sunrise size={15} className="text-amber-500" />}
                          {period === 'Afternoon' && <Sun size={15} className="text-orange-500" />}
                          {period === 'Evening' && <Sunset size={15} className="text-purple-500" />}
                          {period === 'Night' && <Moon size={15} className="text-indigo-600" />}
                          Dose #{idx + 1} ({period})
                        </span>

                        {doses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDoseSlot(idx)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded transition-all cursor-pointer"
                            title="Remove Dose"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Time Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                            Time (समय)
                          </label>
                          <input 
                            type="time" 
                            required 
                            value={doseItem.time} 
                            onChange={(e) => handleDoseChange(idx, 'time', e.target.value)} 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-gray-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#1565C0] outline-none" 
                          />
                        </div>

                        {/* Food Relation Dropdown */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                            Khane ke kab? (Food Timing)
                          </label>
                          <select
                            value={doseItem.foodRelation}
                            onChange={(e) => handleDoseChange(idx, 'foodRelation', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#1565C0] outline-none cursor-pointer"
                          >
                            {FOOD_RELATION_OPTIONS.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.icon} {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Start & End Date */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Kitne din tak lena he? (Duration)
              </label>

              {/* Quick Duration Pills */}
              <div className="flex gap-2">
                {[
                  { label: '3 Days', days: '3' },
                  { label: '5 Days', days: '5' },
                  { label: '7 Days', days: '7' },
                  { label: '14 Days', days: '14' },
                  { label: 'Ongoing', days: '' }
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleDurationPreset(item.days)}
                    className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer active:scale-95 ${
                      durationDays === item.days 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-[#1565C0]" /> Start Date
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#1565C0] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-[#1565C0]" /> End Date (Optional)
                  </label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => { setEndDate(e.target.value); setDurationDays('custom'); }} 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#1565C0] outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3 border-t border-gray-100">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#1565C0] hover:bg-blue-800 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Save All Doses ({doses.length})
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
