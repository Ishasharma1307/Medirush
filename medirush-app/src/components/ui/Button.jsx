import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary: 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-light',
  secondary: 'bg-secondary text-white shadow-lg shadow-secondary/30 hover:bg-secondary-light',
  danger: 'bg-danger text-white shadow-lg shadow-danger/30 hover:bg-danger-light',
  outline: 'bg-white text-primary border-2 border-primary/20 hover:border-primary/50 hover:bg-blue-50 shadow-sm',
  ghost: 'bg-transparent text-gray-600 hover:text-primary hover:bg-gray-100',
  glass: 'bg-white/30 backdrop-blur-md border border-white/40 text-gray-800 hover:bg-white/50 shadow-glass',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm font-semibold',
  md: 'px-6 py-2.5 text-base font-bold',
  lg: 'px-8 py-3.5 text-lg font-extrabold',
  icon: 'p-3',
};

export const Button = React.forwardRef(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  className,
  disabled = false,
  isLoading = false,
  type = 'button',
  fullWidth = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2';
  
  const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, widthClass, className)}
      whileHover={!(disabled || isLoading) ? { y: -2, scale: 1.02 } : {}}
      whileTap={!(disabled || isLoading) ? { scale: 0.95 } : {}}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost', 'glass']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
};
