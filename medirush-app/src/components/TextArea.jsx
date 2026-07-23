import React from 'react';
import { AlertCircle } from 'lucide-react';

export const TextArea = ({ label, placeholder, error, value, onChange, name, maxLength, rows = 4, className = '', ...props }) => {
  const currentLength = value ? value.length : 0;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-2">
        {label && <label className="block text-sm font-bold text-gray-700">{label}</label>}
        {maxLength && (
          <span className={`text-xs font-medium ${currentLength >= maxLength ? 'text-danger' : 'text-gray-400'}`}>
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all font-medium text-gray-900 resize-y
            ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary'}`}
          {...props}
        />
        {error && (
          <div className="absolute top-3 right-4 pointer-events-none">
            <AlertCircle className="h-5 w-5 text-danger" />
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm font-bold text-danger animate-fade-in">{error}</p>}
    </div>
  );
};
