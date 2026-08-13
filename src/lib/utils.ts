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
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60_000)
  const hrs = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(d)
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
