import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'active'
  | 'published'
  | 'resolved'
  | 'pending'
  | 'urgent'
  | 'suspended'
  | 'general'
  | 'agm'
  | 'circular'
  | 'open'
  | 'closed'
  | 'inactive'
  | 'success'
  | 'failed'
  | 'withdrawn'
  | (string & {})

export interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantMap: Record<string, string> = {
  active:      'badge badge--active',
  published:   'badge badge--published',
  resolved:    'badge badge--resolved',
  pending:     'badge badge--pending',
  open:        'badge badge--pending',
  urgent:      'badge badge--urgent',
  suspended:   'badge badge--suspended',
  inactive:    'badge badge--suspended',
  general:     'badge badge--general',
  agm:         'badge badge--agm',
  circular:    'badge badge--general',
  success:     'badge badge--active',
  failed:      'badge badge--urgent',
  withdrawn:   'badge badge--suspended',
  closed:      'badge badge--resolved',
}

export function Badge({ variant, children, className }: BadgeProps) {
  const normalizedVariant = typeof variant === 'string' ? variant.toLowerCase() : 'general'
  const badgeClass = variantMap[normalizedVariant] || 'badge badge--general'

  return (
    <span className={cn(badgeClass, className)}>
      {children}
    </span>
  )
}

/** Status dot indicator (for sidebar, backup status) */
interface StatusDotProps {
  status: 'ok' | 'warning' | 'error' | 'pending'
  label?: string
}

const dotColors: Record<StatusDotProps['status'], string> = {
  ok:      'bg-verdant-green',
  warning: 'bg-warm-gold',
  error:   'bg-deep-crimson',
  pending: 'bg-mahogany-muted',
}

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={label ?? status}>
      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dotColors[status])} aria-hidden="true" />
      {label && <span className="text-sm font-body text-mahogany-muted">{label}</span>}
    </span>
  )
}
