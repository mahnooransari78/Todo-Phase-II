'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  hoverEffect?: boolean;
  animate?: boolean;
  initial?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
  onClick?: () => void;
  tabIndex?: number; // Added to support the specific use case
  [key: string]: any; // Allow additional props to be passed through
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  as: Component = 'div',
  hoverEffect = true,
  animate = false,
  initial = { opacity: 0, y: 20 },
  whileHover = { y: -5 },
  whileTap = { scale: 0.98 },
  transition = { duration: 0.3 },
  onClick,
  ...props
}) => {
  const baseClasses = 'glass-card rounded-xl border border-glass dark:border-glass-dark bg-glass dark:bg-glass-dark backdrop-blur-md p-6 shadow-glass dark:shadow-glass-dark transition-glass';
  const hoverClasses = hoverEffect ? 'hover-glass cursor-pointer' : '';
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`.trim();

  // Separate props that are meant for motion.div vs regular DOM elements
  const { tabIndex, ...restProps } = props;

  if (animate) {
    return (
      <motion.div
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        whileHover={hoverEffect ? whileHover : undefined}
        whileTap={whileTap}
        className={combinedClasses}
        onClick={onClick}
        tabIndex={tabIndex}
        {...restProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={combinedClasses} onClick={onClick} tabIndex={tabIndex} {...restProps}>
      {children}
    </Component>
  );
};

export default GlassCard;