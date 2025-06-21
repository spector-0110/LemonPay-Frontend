'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Edit3, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';
import { formatDate, formatTime, isOverdue, isDueToday, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobile, useMobileAnimation } from '@/hooks/useMobile';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const taskId = task.id || task._id; // Handle both id and _id formats
  const { isMobile, isTablet } = useMobile();
  const { getVariants, getHoverProps } = useMobileAnimation();
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(taskId);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleStatusToggle = (e) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange?.(taskId, { status: newStatus });
  };

  const isTaskOverdue = isOverdue(task.dueDate);
  const isTaskDueToday = isDueToday(task.dueDate);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-50',
          label: 'Completed'
        };
      case 'in-progress':
        return {
          icon: PlayCircle,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          label: 'In Progress'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          label: 'Pending'
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      {...getVariants('default')}
      {...getHoverProps(!isMobile)}
      transition={{ duration: isMobile ? 0.15 : 0.2 }}
      className={cn(
        `group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-gray-300 overflow-hidden`,
        task.status === 'completed' && 'opacity-75',
        isMobile ? 'p-4' : 'p-6'
      )}
      onClick={handleEdit}
    >
      {/* Gradient overlay based on priority/status */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
        isTaskOverdue 
          ? 'from-red-500 to-red-600' 
          : isTaskDueToday 
            ? 'from-yellow-500 to-orange-500' 
            : task.status === 'completed'
              ? 'from-green-500 to-green-600'
              : 'from-blue-500 to-purple-600'
      )} />

      {/* Header */}
      <div className={`flex items-start justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-gray-900 line-clamp-2 leading-tight",
            task.status === 'completed' && 'line-through text-gray-500',
            isMobile ? 'text-base' : 'text-lg'
          )}>
            {task.name || task.taskName}
          </h3>
          
          {/* Status badge */}
          <div 
            className={cn(
              "inline-flex items-center space-x-1 px-2 py-1 rounded-full font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md",
              statusConfig.bg,
              statusConfig.color,
              isMobile ? 'text-xs mt-2' : 'text-xs mt-2'
            )}
            onClick={handleStatusToggle}
            title="Click to toggle status"
          >
            <StatusIcon className={isMobile ? 'w-3 h-3' : 'w-3 h-3'} />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className={`flex items-center transition-opacity duration-200 ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className={`
              text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200 bg-white shadow-sm 
              hover:bg-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md
              ${isMobile ? 'p-2' : 'p-2'}
            `}
            title="Edit task"
          >
            <Edit3 className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className={`
              text-gray-600 hover:text-red-600 rounded-lg transition-all duration-200 bg-white shadow-sm 
              hover:bg-red-50 border border-gray-200 hover:border-red-300 hover:shadow-md
              ${isMobile ? 'p-2' : 'p-2'}
            `}
            title="Delete task"
          >
            <Trash2 className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </Button>
        </div>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className={`
          text-gray-600 line-clamp-3 leading-relaxed
          ${isMobile ? 'text-sm mb-3' : 'text-sm mb-4'}
        `}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className={`
        flex items-center justify-between border-t border-gray-200
        ${isMobile ? 'pt-3' : 'pt-4'}
      `}>
        {task.dueDate && (
          <div className={cn(
            'flex items-center space-x-2 px-3 py-1 rounded-lg font-medium',
            isTaskOverdue 
              ? 'text-red-700 bg-red-50' 
              : isTaskDueToday 
                ? 'text-yellow-700 bg-yellow-50' 
                : 'text-gray-600 bg-gray-50',
            isMobile ? 'text-xs' : 'text-sm'
          )}>
            <div className="flex items-center space-x-2">
              <Calendar className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>{formatDate(task.dueDate)}</span>
              <span>•</span>
              <Clock className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>{formatTime(task.dueDate)}</span>
            </div>
          </div>
        )}
        
        <div className={`
          flex items-center space-x-1 text-gray-500
          ${isMobile ? 'text-xs' : 'text-xs'}
        `}>
          <Clock className={isMobile ? 'w-3 h-3' : 'w-3 h-3'} />
          <span>
            {isMobile 
              ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : `Created ${new Date(task.createdAt).toLocaleDateString()}`
            }
          </span>
        </div>
      </div>

      {/* Priority indicator for overdue/due today */}
      {(isTaskOverdue || isTaskDueToday) && (
        <div className={cn(
          'absolute rounded-full animate-pulse',
          isTaskOverdue ? 'bg-red-500' : 'bg-yellow-500',
          isMobile ? 'top-3 right-3 w-2 h-2' : 'top-4 right-4 w-3 h-3'
        )} />
      )}
    </motion.div>
  );
}
