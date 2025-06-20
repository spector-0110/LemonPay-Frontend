import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return d.toLocaleDateString();
  }
};

export const isOverdue = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export const isDueToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const dueDate = new Date(date);
  return today.toDateString() === dueDate.toDateString();
};
