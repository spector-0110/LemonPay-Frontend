'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  label, 
  error, 
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(e.target.value !== '');
  };

  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          'peer w-full px-3 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setHasValue(e.target.value !== '')}
        {...props}
      />
      {label && (
        <motion.label
          className={cn(
            'absolute left-3 text-gray-500 transition-all pointer-events-none',
            (focused || hasValue || props.value) 
              ? 'top-2 text-xs' 
              : 'top-4 text-sm',
            error && 'text-red-500'
          )}
          animate={{
            y: (focused || hasValue || props.value) ? 0 : 8,
            scale: (focused || hasValue || props.value) ? 0.85 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
