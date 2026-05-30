import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pressableHover, pressableTap } from '../lib/motion';
import { cn } from '../lib/cn';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'solid';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-white text-axiom border border-axiom hover:bg-orange-50',
  secondary: 'bg-white text-black border border-gray-200/60 hover:bg-gray-50',
  solid: 'bg-axiom text-white border border-axiom hover:bg-orange-600',
};

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const classes = cn(
    'rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-200 inline-block text-center shadow-sm',
    fullWidth && 'w-full',
    variantClasses[variant],
    className,
  );

  if (href) {
    return (
      <motion.div
        whileHover={pressableHover}
        whileTap={pressableTap}
        className={fullWidth ? 'w-full' : 'inline-block'}
      >
        <Link to={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={pressableHover}
      whileTap={pressableTap}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
