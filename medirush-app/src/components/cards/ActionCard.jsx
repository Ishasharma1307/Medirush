import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const ActionCard = ({ title, icon: Icon, onClick, description, colorClass = "text-primary bg-primary/10", className }) => {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "glass-card-hover cursor-pointer p-6 flex flex-col items-start gap-4",
        className
      )}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={cn("p-4 rounded-2xl", colorClass)}>
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </motion.div>
  );
};

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func,
  description: PropTypes.string,
  colorClass: PropTypes.string,
  className: PropTypes.string,
};
