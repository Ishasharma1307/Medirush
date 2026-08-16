import React from 'react';
import { Clock, Calendar, CheckCircle2, Play, Pause, Trash2, Pill, Utensils, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const ReminderCard = ({ reminder, onMarkTaken, onDelete, onTogglePause }) => {
  const isCompleted = reminder.status === 'Completed';
  const isTaken = reminder.taken_today;

  // Calculate remaining days if end date exists
  let remainingDaysStr = 'Ongoing Daily';
  if (reminder.end_date) {
    const today = new Date();
    const end = new Date(reminder.end_date);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    remainingDaysStr = diffDays > 0 ? `${diffDays} days left` : 'Ends today';
    if (diffDays < 0) remainingDaysStr = 'Finished';
  }

  const displayTime = reminder.time;
  const foodRelation = reminder.food_relation || 'After Food';
  const period = reminder.period || 'Morning';

  // Food icon map
  const getFoodIcon = (food) => {
    if (food.includes('Before')) return '🍳';
    if (food.includes('With')) return '🥛';
    if (food.includes('Bedtime')) return '🌙';
    return '🍲';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "rounded-3xl p-5 transition-all duration-300 relative overflow-hidden border shadow-sm",
        isTaken ? "bg-emerald-50/70 border-emerald-200" : "bg-white border-gray-150 hover:shadow-md",
        isCompleted ? "opacity-70 grayscale-[0.2]" : ""
      )}
    >
      {/* Background glow for taken state */}
      {isTaken && (
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border flex-shrink-0",
            isTaken 
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
              : "bg-[#1565C0]/10 text-[#1565C0] border-blue-100"
          )}>
            <Pill size={22} />
          </div>
          <div>
            <h3 className={cn("font-black text-base drop-shadow-sm flex items-center gap-2", isTaken ? "text-emerald-950 line-through" : "text-gray-900")}>
              <span>{reminder.medicine_name}</span>
              {reminder.dosage && (
                <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                  {reminder.dosage}
                </span>
              )}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {/* Time Pill */}
              <span className={cn(
                "flex items-center text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-xl border shadow-2xs",
                isTaken ? "bg-emerald-100/60 text-emerald-800 border-emerald-200" : "bg-blue-50 text-[#1565C0] border-blue-100"
              )}>
                {period === 'Morning' && <Sunrise size={12} className="mr-1 text-amber-500" />}
                {period === 'Afternoon' && <Sun size={12} className="mr-1 text-orange-500" />}
                {period === 'Evening' && <Sunset size={12} className="mr-1 text-purple-500" />}
                {period === 'Night' && <Moon size={12} className="mr-1 text-indigo-600" />}
                {displayTime}
              </span>

              {/* Dose Number & Frequency */}
              <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-xl border border-gray-200">
                {reminder.dose_number && reminder.total_doses ? `Dose ${reminder.dose_number} of ${reminder.total_doses}` : reminder.frequency}
              </span>

              {/* Food Relation Badge */}
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                <span>{getFoodIcon(foodRelation)}</span>
                <span>{foodRelation}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-150 relative z-10">
        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-extrabold">
          <Calendar size={13} className="text-[#1565C0]" />
          <span>{remainingDaysStr}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <>
              {isTaken ? (
                <motion.span 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs"
                >
                  <CheckCircle2 size={15} className="mr-1 text-emerald-600" /> Taken
                </motion.span>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkTaken(reminder.id)}
                  className="text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center border border-emerald-500 cursor-pointer"
                >
                  <CheckCircle2 size={16} className="mr-1.5" /> Mark Dose Taken
                </motion.button>
              )}
            </>
          )}

          <div className="flex items-center gap-1 ml-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
            <button 
              onClick={() => onTogglePause(reminder.id)} 
              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer" 
              title={reminder.status === 'Paused' ? 'Resume Reminder' : 'Pause Reminder'}
            >
              {reminder.status === 'Paused' ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button 
              onClick={() => onDelete(reminder.id)} 
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
              title="Delete Reminder"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
