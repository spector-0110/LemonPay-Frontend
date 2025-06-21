'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, FileText, Flag, Clock } from 'lucide-react';
import { DateTime } from 'luxon';
import { toUTCString, TIMEZONE } from '@/lib/utils';

const taskSchema = z.object({
  taskName: z.string().min(1, 'Task name is required').max(200, 'Task name cannot exceed 200 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().min(1, 'Due time is required'),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
}).refine((data) => {
  const selectedDateTime = new Date(`${data.dueDate}T${data.dueTime}`);
  const now = new Date();
  return selectedDateTime > now;
}, {
  message: 'Due date and time must be in the future',
  path: ['dueDate'], // This will show the error on the date field
});

export default function TaskForm({ task, onSubmit, onCancel, isLoading, validationErrors = {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      taskName: task.name || task.taskName,
      description: task.description || '',
      dueDate: task.dueDate ? DateTime.fromISO(task.dueDate).setZone(TIMEZONE).toFormat('yyyy-MM-dd') : '',
      dueTime: task.dueDate ? DateTime.fromISO(task.dueDate).setZone(TIMEZONE).toFormat('HH:mm') : '',
      status: task.status || 'pending',
    } : {
      status: 'pending',
      dueTime: '12:00', // Default time to noon
    },
  });

  const watchedStatus = watch('status');

  // Set backend validation errors
  React.useEffect(() => {
    Object.keys(validationErrors).forEach(field => {
      setError(field, { 
        type: 'server', 
        message: validationErrors[field] 
      });
    });
  }, [validationErrors, setError]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      dueDate: toUTCString(data.dueDate, data.dueTime),
      // Set default status to 'pending' for new tasks if not provided
      status: data.status || 'pending',
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-orange-600 bg-orange-50' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600 bg-blue-50' },
    { value: 'completed', label: 'Completed', color: 'text-green-600 bg-green-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Task Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            <span>Task Name</span>
            <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('taskName')}
            error={errors.taskName?.message}
            placeholder="Enter a descriptive task name..."
            className="transition-all duration-200 focus:scale-[1.02] bg-white border-gray-300"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            <span>Description</span>
            <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <div className="relative">
            <textarea
              {...register('description')}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white text-gray-900 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Add more details about this task..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {watch('description')?.length || 0}/1000
            </div>
          </div>
          {errors.description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 flex items-center space-x-1"
            >
              <span>⚠️</span>
              <span>{errors.description.message}</span>
            </motion.p>
          )}
        </motion.div>

        {/* Due Date/Time and Status Row */}
        <div className="grid gap-4">
          {/* Due Date and Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>Due Date & Time</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Input
                  type="date"
                  {...register('dueDate')}
                  error={errors.dueDate?.message}
                  className="transition-all duration-200 focus:scale-[1.02] bg-white border-gray-300"
                />
              </div>
              <div className="space-y-1">
                <Input
                  type="time"
                  {...register('dueTime')}
                  error={errors.dueTime?.message}
                  className="transition-all duration-200 focus:scale-[1.02] bg-white border-gray-300"
                />
              </div>
            </div>
            {(errors.dueDate || errors.dueTime) && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 flex items-center space-x-1 mt-1"
              >
                <span>⚠️</span>
                <span>{errors.dueDate?.message || errors.dueTime?.message}</span>
              </motion.p>
            )}
          </motion.div>

          {/* Status - Only show when editing */}
          {task && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Flag className="w-4 h-4" />
                <span>Status</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('status')}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 bg-white text-gray-900 ${
                    errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Status Preview */}
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusOptions.find(opt => opt.value === watchedStatus)?.color || 'text-gray-600 bg-gray-50'
                }`}>
                  {statusOptions.find(opt => opt.value === watchedStatus)?.label}
                </div>
              </div>
              {errors.status && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.status.message}</span>
                </motion.p>
              )}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex space-x-3 pt-4"
        >
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span>{task ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : (
              <span>{task ? 'Update Task' : 'Create Task'}</span>
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Cancel
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
