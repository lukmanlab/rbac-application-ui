import dayjs from 'dayjs';

// Format a date to a custom format
export const formatDate = (date: dayjs.ConfigType, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format);
};

// Parse a date string and return a formatted date
export const parseDate = (dateString: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(dateString).format(format);
};

// Add or subtract time from the current date
export const adjustDate = (amount: number, unit: dayjs.ManipulateType, isAdd: boolean = true): string => {
  const date = dayjs();
  if (isAdd) {
    return date.add(amount, unit).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return date.subtract(amount, unit).format('YYYY-MM-DD HH:mm:ss');
  }
};

// Example of extracting specific parts of a date
export const getDatePart = (date: dayjs.ConfigType, part: 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second'): number => {
  return dayjs(date)[part]();
};