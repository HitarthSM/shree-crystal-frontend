import { FileText, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  icon?: 'inbox' | 'file'
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, icon = 'inbox', action, className }: EmptyStateProps) {
  const IconComponent = icon === 'file' ? FileText : Inbox

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        'border border-dashed border-ledger-rule rounded-[6px] bg-white/40',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-saffron/10 mb-4">
        <IconComponent className="h-6 w-6 text-deep-saffron" aria-hidden="true" />
      </div>
      <h3 className="text-display-sm font-display text-dark-mahogany mb-1">
        {title}
      </h3>
      <p className="text-body text-mahogany-muted max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
