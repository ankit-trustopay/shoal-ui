import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { easeOutExpo } from '../lib/motion';
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'article';
  once?: boolean;
}
export function FadeIn({
  children,
  delay = 0,
  y = 20,
  className = '',
  as = 'div',
  once = true
}: FadeInProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial={{
        opacity: 0,
        y
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once,
        margin: '-50px'
      }}
      transition={{
        duration: 0.6,
        ease: easeOutExpo,
        delay,
      }}
      className={className}>
      
      {children}
    </MotionTag>);

}
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};
const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOutExpo,
    },
  },
};
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}
export function Stagger({ children, className = '' }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        margin: '-50px'
      }}
      className={className}>
      
      {children}
    </motion.div>);

}
export function StaggerItem({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>);

}