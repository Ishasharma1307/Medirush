import React from 'react';
import { Check, Circle } from 'lucide-react';

export const OrderTimeline = ({ timeline }) => {
  return (
    <div className="flex flex-col space-y-4 relative">
      {/* Connecting Line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-100 z-0"></div>
      
      {timeline.map((step, idx) => (
        <div key={idx} className="flex items-start gap-4 relative z-10">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
            step.completed 
              ? 'bg-green-500 text-white' 
              : 'bg-white border-2 border-gray-200 text-gray-300'
          }`}>
            {step.completed ? <Check size={14} strokeWidth={3} /> : <Circle size={10} className="fill-current" />}
          </div>
          <div className="flex-grow">
            <p className={`text-sm font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
              {step.status}
            </p>
            {step.time && (
              <p className="text-xs text-gray-500 font-medium">{step.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
