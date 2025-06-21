'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TaskFilters from '@/components/tasks/task-filters';
import TaskList from '@/components/tasks/task-list';
import TaskForm from '@/components/tasks/task-form';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { Modal } from '@/components/ui/modal';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { isOverdue, isDueToday } from '@/lib/utils';
import { toast } from 'sonner';
import Navbar from '@/components/layout/navbar';
import { useMobile, useMobileAnimation } from '@/hooks/useMobile';
export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentFilter, setCurrentFilter] = useState({ filter: 'all', search: '' });
  const [user, setUser] = useState(null);
  
  // Mobile hooks
  const { isMobile, isTablet, screenSize } = useMobile();
  const { getVariants, getHoverProps } = useMobileAnimation();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTasks();
      const user = response.success ? response.data.user : null;
      const tasksData = response.success ? response.data.tasks : [];
      
      // Ensure each task has a consistent ID format
      const normalizedTasks = tasksData.map(task => ({
        ...task,
        id: task.id || task._id // Normalize ID field
      }));
            
      setTasks(normalizedTasks);
      setUser(user);
      setFilteredTasks(normalizedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
  setIsSubmitting(true);
  setValidationErrors({});

  try {
    const response = await apiService.createTask(taskData);
    const createdTask = response.success ? response.data.task : response;

    // Normalize the created task's ID
    const normalizedTask = {
      ...createdTask,
      id: createdTask.id || createdTask._id,
    };

    // Add the new task to the list
    const updatedTasks = [...tasks, normalizedTask];
    setTasks(updatedTasks);
    applyFilter(updatedTasks, currentFilter);
    setIsTaskModalOpen(false);
    toast.success('Task created successfully');
  } catch (error) {
    // Keep original task list on error
    applyFilter(tasks, currentFilter);

    if (error.isValidationError) {
      const fieldErrors = {};
      error.validationErrors.forEach((err) => {
        fieldErrors[err.field] = err.message;
      });
      setValidationErrors(fieldErrors);
      toast.error('Please fix the validation errors');
    } else {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    }
  } finally {
    setIsSubmitting(false);
  }
};

const handleUpdateTask = async (taskData) => {
  setIsSubmitting(true);
  setValidationErrors({});

  const taskId = editingTask?.id || editingTask?._id;
  const originalTasks = [...tasks]; // Make a copy for reverting in case of error

  try {
    const response = await apiService.updateTask(taskId, taskData);
    const updatedTask = response.success ? response.data.task : response;

    const normalizedTask = {
      ...updatedTask,
      id: updatedTask.id || updatedTask._id,
    };

    // Replace updated task in the list
    const updatedTasks = tasks.map((task) =>
      (task.id || task._id) === taskId ? normalizedTask : task
    );

    setTasks(updatedTasks);
    applyFilter(updatedTasks, currentFilter);
    setIsTaskModalOpen(false);
    setEditingTask(null);
    toast.success('Task updated successfully');
  } catch (error) {
    setTasks(originalTasks);
    applyFilter(originalTasks, currentFilter);

    if (error.isValidationError) {
      const fieldErrors = {};
      error.validationErrors.forEach((err) => {
        fieldErrors[err.field] = err.message;
      });
      setValidationErrors(fieldErrors);
      toast.error('Please fix the validation errors');
    } else {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDeleteTask = async () => {
    try {
      await apiService.deleteTask(taskToDelete);
      const updatedTasks = tasks.filter(task => (task.id || task._id) !== taskToDelete);
      setTasks(updatedTasks);
      // Re-apply current filter to updated tasks
      applyFilter(updatedTasks, currentFilter);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  // Helper function to apply filters
  const applyFilter = (tasksToFilter, filterObj) => {
    let filtered = tasksToFilter;

    // Apply search filter
    if (filterObj.search) {
      filtered = filtered.filter(task => {
        const taskName = task.name || task.taskName || '';
        const taskDesc = task.description || '';
        return taskName.toLowerCase().includes(filterObj.search.toLowerCase()) ||
               taskDesc.toLowerCase().includes(filterObj.search.toLowerCase());
      });
    }

    // Apply status filter
    switch (filterObj.filter) {
      case 'overdue':
        filtered = filtered.filter(task => isOverdue(task.dueDate));
        break;
      case 'today':
        filtered = filtered.filter(task => isDueToday(task.dueDate));
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      case 'pending':
        filtered = filtered.filter(task => task.status === 'pending');
        break;
      case 'in-progress':
        filtered = filtered.filter(task => task.status === 'in-progress');
        break;
      default:
        break;
    }

    setFilteredTasks(filtered);
  };

  const handleStatusChange = async (taskId, updateData) => {
    const originalTasks = [...tasks]; // Store original state for rollback
    
    // Optimistic update - update UI immediately
    const optimisticTasks = tasks.map(task => 
      (task.id || task._id) === taskId ? { ...task, ...updateData } : task
    );
    
    setTasks(optimisticTasks);
    applyFilter(optimisticTasks, currentFilter);
    
    try {
      const response = await apiService.updateTask(taskId, updateData);
      const updatedTask = response.success ? response.data : response;
      
      // Normalize ID field
      const normalizedTask = {
        ...updatedTask,
        id: updatedTask.id || updatedTask._id
      };
      
      // Update with actual server response
      const finalTasks = originalTasks.map(task => 
        (task.id || task._id) === taskId ? normalizedTask : task
      );
      
      setTasks(finalTasks);
      applyFilter(finalTasks, currentFilter);
      
      toast.success(`Task marked as ${updateData.status}`);
    } catch (error) {
      // Revert optimistic update on error
      setTasks(originalTasks);
      applyFilter(originalTasks, currentFilter);
      
      toast.error('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const handleFilter = (filterObj) => {
    setCurrentFilter(filterObj);
    applyFilter(tasks, filterObj);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setValidationErrors({});
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setValidationErrors({});
  };

  const handleTaskSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const overdueTasks = tasks.filter(task => isOverdue(task.dueDate)).length;
  const todayTasks = tasks.filter(task => isDueToday(task.dueDate)).length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${isMobile ? 'pb-20' : ''}`}>
      <Navbar user={user} />
      
      <main className={`mx-auto ${
        isMobile 
          ? 'px-3 py-4 max-w-full' 
          : isTablet 
            ? 'px-6 py-6 max-w-6xl' 
            : 'px-8 py-8 max-w-7xl'
      }`}>
        {/* Header */}
        <motion.div
          {...getVariants('default')}
          className={isMobile ? 'mb-4' : 'mb-8'}
        >
          <div className={`
            flex items-center justify-between
            ${isMobile ? 'mb-4' : 'mb-6'}
          `}>
            <div className="flex-1">
              <h1 className={`
                font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent
                ${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'}
              `}>
                Task Management
              </h1>
              <p className={`
                text-gray-600 mt-1
                ${isMobile ? 'text-sm' : 'text-base'}
              `}>
                {isMobile ? 'Manage your tasks' : 'Manage your tasks and stay organized'}
              </p>
            </div>
            
            {/* Desktop Add Button */}
            {!isMobile && (
              <Button
                onClick={openCreateModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </Button>
            )}
          </div>

          {/* Filters */}
          <TaskFilters
            onFilter={handleFilter}
            totalTasks={tasks.length}
            overdueTasks={overdueTasks}
            todayTasks={todayTasks}
            completedTasks={completedTasks}
            pendingTasks={pendingTasks}
            inProgressTasks={inProgressTasks}
          />
        </motion.div>        
        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteClick}
          onStatusChange={handleStatusChange}
        />

        {/* Mobile FAB */}
        {isMobile && (
          <FloatingActionButton
            onClick={openCreateModal}
            icon={Plus}
            label="Add Task"
            className="fixed bottom-6 right-4 z-30"
          />
        )}
      </main>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={closeTaskModal}
          isLoading={isSubmitting}
          validationErrors={validationErrors}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
