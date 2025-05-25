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

export function formatShortDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, 'MMM d')
}

export function capitalize(str: string) {
  return str.replaceAll("_", " ").charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string) {
  return str.split(" ").map(capitalize).join(" ")
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}