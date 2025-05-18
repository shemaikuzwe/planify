import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date

  if (isToday(parsedDate)) {
    return format(parsedDate, 'h:mm a')
  } else if (isYesterday(parsedDate)) {
    return 'Yesterday'
  } else {
    return format(parsedDate, 'MMM d, yyyy')
  }
}

