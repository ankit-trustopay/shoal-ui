import React from 'react';
import { motion } from 'framer-motion';
import { pageEnter, pageStagger, pageItem } from '../../lib/motion';

interface PageMotionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

/** Route-level enter animation (mount, not scroll) */
export function PageMotion({
  children,
  className = '',
  stagger = true,
}: PageMotionProps) {
  if (!stagger) {
    return (
      <motion.div
        initial={pageEnter.hidden}
        animate={pageEnter.show}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageStagger}
      initial="hidden"
      animate="show"
      className={className}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <motion.div variants={pageItem} className="min-w-0">
            {child}
          </motion.div>
        ) : null,
      )}
    </motion.div>
  );
}

/** Single block inside a page — use when page already has PageMotion */
export function MotionBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
