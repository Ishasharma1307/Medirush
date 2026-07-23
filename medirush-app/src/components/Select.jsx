import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export const Select = ({ label, options = [], error, value, onChange, name, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl appearance-none outline-none transition-all font-medium text-gray-900 cursor-pointer
            ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary'}`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          {error ? <AlertCircle className="h-5 w-5 text-danger mr-2" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm font-bold text-danger animate-fade-in">{error}</p>}
    </div>
  );
};
