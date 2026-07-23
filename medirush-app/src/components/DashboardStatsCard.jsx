import React from 'react';
import { cn } from '../utils/cn';

export const DashboardStatsCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="glass-card p-6 border-white/60 flex items-center justify-between transition-all duration-300 hover:shadow-floating group">
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">{value}</h3>
        {trend && (
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-green-600 mt-2 flex items-center bg-green-500/10 border border-green-500/20 w-fit px-2 py-0.5 rounded shadow-sm">
            {trend}
          </p>
        )}
      </div>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300", color)}>
        <Icon size={28} />
      </div>
    </div>
  );
};
