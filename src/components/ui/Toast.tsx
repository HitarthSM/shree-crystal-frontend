import { Toaster, toast } from 'react-hot-toast'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Custom Toast component that matches the Heritage Saffron design system.
 * Uses react-hot-toast underneath but overrides the UI.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    >
      {(t) => (
        <div
          className={cn(
            'flex items-start gap-3 w-80 p-4 rounded-[6px] shadow-paper-md border',
            'bg-ivory text-dark-mahogany font-body text-sm',
            'animate-toast-in',
            t.type === 'success' && 'border-verdant-green',
            t.type === 'error' && 'border-deep-crimson',
            t.type !== 'success' && t.type !== 'error' && 'border-warm-gold',
          )}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-verdant-green" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 text-deep-crimson" />}
            {t.type !== 'success' && t.type !== 'error' && <Info className="h-5 w-5 text-warm-gold" />}
          </div>

          {/* Message */}
          <div className="flex-1 pt-0.5">
            {typeof t.message === 'function' ? t.message(t) : t.message}
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 mt-0.5 text-mahogany-muted hover:text-dark-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </Toaster>
  )
}

// Re-export toast for imperative use
export { toast }
