'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

const FAB: React.FC<FABProps> = ({
  onClick,
  icon = <Plus className="h-5 w-5" />,
  label = 'Add',
  className = ''
}) => {
  return (
    <motion.button
      className={`fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-purple-pink shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 flex items-center justify-center text-white transition-all duration-300 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {icon}
    </motion.button>
  );
};

export default FAB;