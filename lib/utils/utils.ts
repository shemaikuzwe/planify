import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, isToday, isTomorrow, isYesterday, parseISO, subDays } from "date-fns"

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

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function formatShortDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(subDays(parsedDate, 5), new Date(), { addSuffix: true })
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

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}