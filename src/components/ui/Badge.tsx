import { cn } from '@/lib/utils'

type BadgeVariant = 'active' | 'published' | 'resolved' | 'pending' | 'urgent' | 'suspended' | 'general' | 'agm' | 'circular'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  active:    'badge badge--active',
  published: 'badge badge--published',
  resolved:  'badge badge--resolved',
  pending:   'badge badge--pending',
  urgent:    'badge badge--urgent',
  suspended: 'badge badge--suspended',
  general:   'badge badge--general',
  agm:       'badge badge--agm',
  circular:  'badge badge--general',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn(variantMap[variant], className)}>
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
