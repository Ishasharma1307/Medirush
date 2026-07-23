import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({ label, placeholder, error, type = 'text', value, onChange, name, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all font-medium text-gray-900 
            ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary'}`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-danger" />
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm font-bold text-danger animate-fade-in">{error}</p>}
    </div>
  );
};
