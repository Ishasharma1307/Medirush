import React from 'react';
import { Clock, Calendar, CheckCircle2, Play, Pause, Trash2, Edit3, Pill } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const ReminderCard = ({ reminder, onMarkTaken, onDelete, onTogglePause }) => {
  const isCompleted = reminder.status === 'Completed';
  const isTaken = reminder.taken_today;

  // Calculate remaining days if end date exists
  let remainingDaysStr = 'Ongoing';
  if (reminder.end_date) {
    const today = new Date();
    const end = new Date(reminder.end_date);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    remainingDaysStr = diffDays > 0 ? `${diffDays} days left` : 'Ends today';
    if (diffDays < 0) remainingDaysStr = 'Finished';
  }

  const displayTime = reminder.time;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "glass-card p-5 transition-all duration-300 relative overflow-hidden",
        isTaken ? "bg-green-50/50 border-green-200/60" : "bg-white/60 border-white/60",
        isCompleted ? "opacity-70 grayscale-[0.2]" : ""
      )}
    >
      {/* Decorative gradient for taken state */}
      {isTaken && (
        <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border",
            isTaken 
              ? "bg-green-500/10 text-green-600 border-green-500/20" 
              : "bg-primary/10 text-primary border-primary/20"
          )}>
            <Pill size={24} />
          </div>
          <div>
            <h3 className={cn("font-extrabold text-lg drop-shadow-sm", isTaken ? "text-green-900" : "text-gray-900")}>
              {reminder.medicine_name} {reminder.dosage && <span className="text-sm text-gray-500 font-medium">({reminder.dosage})</span>}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn(
                "flex items-center text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm",
                isTaken ? "bg-green-100/50 text-green-700 border-green-200/50" : "bg-white/80 text-gray-600 border-white"
              )}>
                <Clock size={12} className="mr-1.5" /> {displayTime}
              </span>
              <span className={cn(
                "text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm",
                isTaken ? "bg-green-100/50 text-green-700 border-green-200/50" : "bg-primary/10 text-primary border-primary/20"
              )}>
                {reminder.frequency}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200/50 relative z-10">
        <div className="flex items-center gap-2 bg-white/40 px-2.5 py-1.5 rounded-lg border border-white/50">
           <Calendar size={14} className="text-gray-500" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{remainingDaysStr}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <>
              {isTaken ? (
                 <motion.span 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="text-[11px] font-bold uppercase tracking-widest text-green-700 flex items-center bg-green-500/20 px-3 py-1.5 rounded-xl border border-green-500/30 shadow-sm"
                 >
                   <CheckCircle2 size={14} className="mr-1.5" /> Taken Today
                 </motion.span>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkTaken(reminder.id)}
                  className="text-xs font-bold text-white bg-gradient-to-r from-green-500 to-secondary px-4 py-2 rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg transition-all flex items-center border border-green-400"
                >
                  <CheckCircle2 size={16} className="mr-1.5" /> Mark Taken
                </motion.button>
              )}
            </>
          )}

          <div className="flex items-center gap-1 ml-3 bg-white/40 backdrop-blur-sm rounded-xl p-1 border border-white/50 shadow-sm">
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
              <Edit3 size={14} />
            </button>
            <button onClick={() => onTogglePause(reminder.id)} className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors" title={reminder.status === 'Paused' ? 'Resume' : 'Pause'}>
              {reminder.status === 'Paused' ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button onClick={() => onDelete(reminder.id)} className="p-1.5 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
