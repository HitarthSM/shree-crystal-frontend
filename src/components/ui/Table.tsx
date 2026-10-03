import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Table = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn('w-full text-left border-collapse min-w-[700px]', className)}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

export const TableHead = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-ivory border-b border-ledger-rule', className)}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('divide-y divide-ledger-rule', className)}
      {...props}
    />
  ),
)
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('hover:bg-warm-gold/5 transition-colors group', className)}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

export const TableHeaderCell = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'font-data text-xs font-semibold text-mahogany-muted uppercase tracking-wider p-4',
        className,
      )}
      {...props}
    />
  ),
)
TableHeaderCell.displayName = 'TableHeaderCell'

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 font-body text-sm text-dark-mahogany align-middle', className)}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'
