import React from 'react';
import PropTypes from 'prop-types';

const variantClasses = {
  primary: 'bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
  secondary: 'bg-gradient-to-r from-secondary to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50',
  danger: 'bg-gradient-to-r from-danger to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
  outline: 'bg-white text-primary border-2 border-primary/20 hover:border-primary/50 hover:bg-blue-50 shadow-sm',
  ghost: 'bg-transparent text-gray-600 hover:text-primary hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm font-semibold',
  md: 'px-6 py-2.5 text-base font-bold',
  lg: 'px-8 py-3.5 text-lg font-extrabold',
};

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed active:scale-100' : 'hover:-translate-y-0.5';

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};
