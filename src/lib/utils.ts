import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format currency as Indian Rupee */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

/** Format date as DD MMM YYYY */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(typeof date === 'string' ? new Date(date) : date)
}

/** Format relative time */
export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((d.getTime() - Date.now()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) return rtf.format(Math.round(diffInSeconds), 'second');
  if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.round(diffInSeconds / 60), 'minute');
  if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
  if (Math.abs(diffInSeconds) < 604800) return rtf.format(Math.round(diffInSeconds / 86400), 'day');

  return formatDate(d);
}

/** Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1) */
export function calculateEMI(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (tenureMonths === 0 || annualRatePercent === 0) return principal / (tenureMonths || 1)
  const r = annualRatePercent / (12 * 100)
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1)
  return Math.round(emi * 100) / 100
}

/** Mask Aadhaar: XXXX XXXX 1234 */
export function maskAadhaar(aadhaar: string): string {
  return aadhaar.replace(/^(\d{8})(\d{4})$/, 'XXXX XXXX $2')
}

/** Mask PAN: ABXXX1234X */
export function maskPAN(pan: string): string {
  return pan.replace(/^(.{2})(.{3})(.{4})(.{1})$/, '$1XXX$3$4')
}
