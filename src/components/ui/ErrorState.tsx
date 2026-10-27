import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

/** Shown when a fetch fails, so a failure never looks like an empty list. */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this. Check your connection and try again.',
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        'border border-deep-crimson/30 rounded-[6px] bg-white/40',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-crimson/10 mb-4">
        <AlertCircle className="h-6 w-6 text-deep-crimson" aria-hidden="true" />
      </div>
      <h3 className="text-display-sm font-display text-dark-mahogany mb-1">{title}</h3>
      <p className="text-body text-mahogany-muted max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} isLoading={isRetrying}>
          Retry
        </Button>
      )}
    </div>
  )
}
