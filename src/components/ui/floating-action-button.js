'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';

export default function FloatingActionButton({ onClick, icon: Icon = Plus, label = "Add", className = "" }) {
  const { isMobile } = useMobile();

  if (!isMobile) return null; // Only show on mobile

  return (
    <motion.button
      data-fab
      onClick={onClick}
      className={`
        bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
        text-white rounded-full shadow-xl hover:shadow-2xl transition-all z-50 group
        ${isMobile ? 'p-4' : 'p-3'}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      aria-label={label}
    >
      <Icon className={`transition-transform ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} />
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-10"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.button>
  );
}
