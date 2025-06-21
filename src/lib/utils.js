import { clsx } from 'clsx';
import { DateTime } from 'luxon';

export function cn(...inputs) {
  return clsx(inputs);
}

export const TIMEZONE = 'Asia/Kolkata'; // Indian timezone

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = DateTime.fromISO(date).setZone(TIMEZONE);
  const today = DateTime.now().setZone(TIMEZONE).startOf('day');
  const tomorrow = today.plus({ days: 1 });
  
  if (d.hasSame(today, 'day')) {
    return 'Today';
  } else if (d.hasSame(tomorrow, 'day')) {
    return 'Tomorrow';
  } else {
    return d.toLocaleString(DateTime.DATE_MED); // Formats like "Apr 20, 2025"
  }
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = DateTime.fromISO(date).setZone(TIMEZONE);
  return d.toLocaleString(DateTime.TIME_SIMPLE); // 12-hour format like "2:30 PM"
};

export const isOverdue = (date) => {
  if (!date) return false;
  const now = DateTime.now().setZone(TIMEZONE);
  const dueDate = DateTime.fromISO(date).setZone(TIMEZONE);
  return dueDate < now;
};

export const isDueToday = (date) => {
  if (!date) return false;
  const now = DateTime.now().setZone(TIMEZONE);
  const dueDate = DateTime.fromISO(date).setZone(TIMEZONE);
  return dueDate.hasSame(now, 'day');
};

// Helper function to convert local time to UTC ISO string
export const toUTCString = (date, time) => {
  if (!date || !time) return '';
  const localDateTime = DateTime.fromFormat(
    `${date} ${time}`, 
    'yyyy-MM-dd HH:mm', 
    { zone: TIMEZONE }
  );
  return localDateTime.toUTC().toISO();
};
