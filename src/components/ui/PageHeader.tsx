import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description?: string
  backLink?: {
    to: string
    label: string
  }
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  backLink,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      {backLink && (
        <Link
          to={backLink.to}
          className="inline-flex items-center gap-2 text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{backLink.label}</span>
        </Link>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-display-md font-display text-dark-mahogany mb-1 leading-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-body text-mahogany-muted">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
