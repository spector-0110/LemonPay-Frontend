'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus } from 'lucide-react';
import TaskCard from './task-card';
import { useMobile, useMobileAnimation } from '@/hooks/useMobile';

export default function TaskList({ tasks, loading, onEditTask, onDeleteTask, onStatusChange }) {
  const { isMobile, isTablet, screenSize } = useMobile();
  const { getVariants, getHoverProps } = useMobileAnimation();

  if (loading) {
    return (
      <div className={`
        grid gap-4 
        ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1' : 'grid-cols-1'}
      `}>
        {[...Array(isMobile ? 3 : 6)].map((_, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="animate-pulse"
          >
            <div className={`
              bg-white rounded-xl shadow-sm border border-gray-200 
              ${isMobile ? 'p-4 h-32' : 'p-6 h-48'}
            `}>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                {!isMobile && (
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        {...getVariants('scale')}
        className={`text-center ${isMobile ? 'py-12' : 'py-16'}`}
      >
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className={`
              inline-flex items-center justify-center rounded-full mb-6 bg-gradient-to-r from-blue-500 to-purple-600
              ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}
            `}
          >
            <CheckSquare className={`text-white ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`
              font-semibold text-gray-900 mb-2
              ${isMobile ? 'text-xl' : 'text-2xl'}
            `}
          >
            No tasks found
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`
              text-gray-600 mb-6
              ${isMobile ? 'text-sm px-4' : 'text-base'}
            `}
          >
            {isMobile 
              ? 'Start by creating your first task' 
              : 'Start organizing your work by creating your first task'
            }
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => document.querySelector('[data-fab]')?.click()}
              className={`
                inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium 
                transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl
                ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'}
              `}
            >
              <Plus className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              <span>{isMobile ? 'Add Task' : 'Create Your First Task'}</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }  return (
    <motion.div
      {...getVariants('default')}
      className={`
        grid gap-4
        ${isMobile ? 'grid-cols-1' : 'grid-cols-1'}
      `}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => {
          const taskId = task.id || task._id; // Handle both id and _id
          return (
            <motion.div
              key={taskId}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ 
                delay: index * (isMobile ? 0.03 : 0.05), 
                duration: isMobile ? 0.2 : 0.3 
              }}
              layout
            >
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
