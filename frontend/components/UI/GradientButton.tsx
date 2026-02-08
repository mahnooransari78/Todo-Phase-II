'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: 'purple-pink' | 'indigo-purple';
  [key: string]: any; // Allow all props including HTML attributes and motion props
}

const GradientButton: React.FC<GradientButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  icon,
  gradient = 'purple-pink',
  disabled,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `text-white bg-gradient-${gradient} border-0`,
    secondary: 'text-gray-800 dark:text-white bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark',
    ghost: 'text-gray-800 dark:text-white bg-transparent border-0',
    outline: 'text-gray-800 dark:text-white border border-current bg-transparent',
  };

  const baseClasses = `
    rounded-lg font-medium transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    ${sizeClasses[size]} ${variantClasses[variant]}
    ${className}
  `.trim();

  const MotionButton = motion.button;

  return (
    <MotionButton
      className={baseClasses}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </MotionButton>
  );
};

export default GradientButton;