import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, onChange, placeholder = 'Search...', ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center', className)}>
        <Search
          className="absolute left-3 h-4 w-4 text-mahogany-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full h-10 pl-9 pr-8 rounded-[4px] border border-ledger-rule bg-white text-sm font-body text-dark-mahogany',
            'placeholder:text-mahogany-muted/60 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold',
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2 p-1 text-mahogany-muted hover:text-dark-mahogany rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'
