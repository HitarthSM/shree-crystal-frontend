import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

/* ─── StampMark ─────────────────────────────────────────────────
   The brass circular confirmation mark.
   ONLY used for confirmed/published/resolved entries.
   Never decoratively.
───────────────────────────────────────────────────────────────── */
interface StampMarkProps {
  /** Triggers the drop-and-settle animation */
  animate?: boolean
  /** Filled variant: gold disc vs gold ring */
  filled?: boolean
  className?: string
  'aria-label'?: string
}

export function StampMark({ animate = false, filled = false, className, ...props }: StampMarkProps) {
  return (
    <span
      className={cn(
        'stamp-mark flex-shrink-0',
        filled && 'stamp-mark--filled',
        animate && '[animation:stampDrop_150ms_ease-out_forwards]',
        className,
      )}
      role="img"
      aria-label={props['aria-label'] ?? 'Confirmed'}
    >
      {filled && <CheckCircle2 className="h-3 w-3 text-white" aria-hidden="true" />}
    </span>
  )
}

/** Empty placeholder — preserves column alignment where there's no stamp */
export function StampPlaceholder() {
  return <span className="stamp-mark--empty flex-shrink-0" aria-hidden="true" />
}


/* ─── LedgerRow ─────────────────────────────────────────────────
   The signature component. Every statement, notice, activity log
   entry renders as this — not a generic card.
───────────────────────────────────────────────────────────────── */
interface LedgerRowProps {
  /** Whether this row has a confirmed stamp */
  stamped?: boolean
  /** Animate the stamp on mount */
  stampAnimate?: boolean
  /** Left: row title */
  title: React.ReactNode
  /** Optional: subtitle / description */
  subtitle?: React.ReactNode
  /** Right: date in Plex Mono */
  date?: string
  /** Right: amount or ID in Plex Mono */
  mono?: React.ReactNode
  /** Optional badge */
  badge?: React.ReactNode
  /** Click handler */
  onClick?: () => void
  className?: string
}

export function LedgerRow({
  stamped = false,
  stampAnimate = false,
  title,
  subtitle,
  date,
  mono,
  badge,
  onClick,
  className,
}: LedgerRowProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={cn(
        'ledger-row w-full text-left',
        onClick && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-1 rounded-sm',
        className,
      )}
      onClick={onClick}
      {...(onClick ? { type: 'button' as const } : {})}
    >
      {/* Stamp column */}
      <div className="flex-shrink-0 w-5">
        {stamped
          ? <StampMark animate={stampAnimate} aria-label="Confirmed entry" />
          : <StampPlaceholder />}
      </div>

      {/* Main content */}
      <div className="ledger-row__main">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body text-base text-dark-mahogany font-medium leading-snug">
            {title}
          </span>
          {badge}
        </div>
        {subtitle && (
          <span className="block text-sm text-mahogany-muted font-body mt-0.5">{subtitle}</span>
        )}
      </div>

      {/* Right mono column */}
      <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
        {mono && <span className="ledger-row__mono">{mono}</span>}
        {date && (
          <span className="font-data text-sm text-mahogany-muted whitespace-nowrap">
            {date}
          </span>
        )}
      </div>
    </Tag>
  )
}


/* ─── Skeleton ───────────────────────────────────────────────────
   Ledger-row shaped loading placeholder.
   NOT a generic spinner — keeps the ledger metaphor intact.
───────────────────────────────────────────────────────────────── */
interface SkeletonProps {
  rows?: number
  className?: string
}

export function LedgerSkeleton({ rows = 3, className }: SkeletonProps) {
  return (
    <div className={cn('', className)} aria-busy="true" aria-label="Loading...">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          {/* Stamp placeholder */}
          <div className="skeleton-block w-5 h-5 rounded-full flex-shrink-0" />
          {/* Title */}
          <div className="flex-1 space-y-2">
            <div className="skeleton-block h-4 rounded w-3/4" />
            <div className="skeleton-block h-3 rounded w-1/2" />
          </div>
          {/* Mono column */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="skeleton-block h-4 rounded w-20" />
            <div className="skeleton-block h-3 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Generic skeleton block */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton-block rounded', className)} />
}
