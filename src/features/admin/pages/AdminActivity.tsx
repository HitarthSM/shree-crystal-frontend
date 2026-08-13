import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Input, Select } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { Filter, Download } from 'lucide-react'

// Mock Data
const logs = [
  { id: 1, action: 'Bulk Statement Upload', admin: 'Super Admin', ip: '192.168.1.1', date: '10 mins ago', time: '13:45:22' },
  { id: 2, action: 'Notice Published (AGM)', admin: 'Operator (Kiran)', ip: '192.168.1.5', date: '2 hours ago', time: '11:30:00' },
  { id: 3, action: 'Daily Backup Completed', admin: 'System', ip: 'localhost', date: '6 hours ago', time: '08:00:00' },
  { id: 4, action: 'Member Details Updated (SC-00847)', admin: 'Operator (Kiran)', ip: '192.168.1.5', date: '1 day ago', time: '14:20:11' },
  { id: 5, action: 'Login Failed (Invalid OTP)', admin: 'System (User: 9876543210)', ip: '117.20.45.12', date: '1 day ago', time: '10:15:00' },
  { id: 6, action: 'System Settings Updated', admin: 'Super Admin', ip: '192.168.1.1', date: '2 days ago', time: '16:45:00' },
]

export function AdminActivity() {
  const [filterRole, setFilterRole] = useState('all')

  const filteredLogs = logs.filter(
    (l) => filterRole === 'all' || l.admin.toLowerCase().includes(filterRole)
  )

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            System Activity Log
          </h1>
          <p className="text-body text-mahogany-muted">
            Immutable audit trail of all administrative actions.
          </p>
        </div>
        
        <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
          Export Audit Trail
        </Button>
      </header>

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Activity Records</CardTitle>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select
                label=""
                aria-label="Filter by actor"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                options={[
                  { value: 'all', label: 'All Actors' },
                  { value: 'admin', label: 'Admins' },
                  { value: 'operator', label: 'Operators' },
                  { value: 'system', label: 'System' },
                ]}
              />
            </div>
            <div className="flex-1 md:w-64">
              <Input
                label=""
                aria-label="Search logs"
                placeholder="Search action or ID..."
                type="text"
              />
            </div>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {filteredLogs.map((log) => (
              <LedgerRow
                key={log.id}
                title={log.action}
                subtitle={`Actor: ${log.admin} • IP: ${log.ip}`}
                date={log.date}
                className="px-6 py-3 hover:bg-transparent cursor-default"
                mono={<span className="text-xs text-mahogany-muted/70">{log.time}</span>}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
