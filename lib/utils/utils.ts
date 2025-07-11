import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, isToday, isTomorrow, isYesterday, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date

  switch (true) {
    case isToday(parsedDate):
      return `Today, ${format(parsedDate, 'h:mm a')}`;
    case isYesterday(parsedDate):
      return `Yesterday, ${format(parsedDate, 'h:mm a')}`;
    case isTomorrow(parsedDate):
      return `Tomorrow, ${format(parsedDate, 'h:mm a')}`;
    default:
      return format(parsedDate, 'MMM d, yyyy h:mm a');
  }
}

export function formatShortDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
 return formatDistance(parsedDate, new Date(), { addSuffix: true })
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