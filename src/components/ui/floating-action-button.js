'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 md:hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
}
