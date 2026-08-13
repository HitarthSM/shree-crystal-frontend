import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge, StatusDot } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/utils'
import { 
  Users, 
  FileText, 
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'

// Mock Data
const stats = [
  { label: 'Total Active Members', value: '1,847', trend: '+12 this month' },
  { label: 'Pending Approvals', value: '8', trend: 'Needs action' },
  { label: 'Total Loan Disbursed', value: formatINR(42500000), trend: 'FY 24-25' },
  { label: 'Active Deposits', value: formatINR(85000000), trend: 'FY 24-25' },
]

const pendingApprovals = [
  { id: 'SC-00851', name: 'Kiran Desai', type: 'New Membership', date: '2 hours ago' },
  { id: 'L-25-012', name: 'Ramesh Patel', type: 'Loan Disbursement', date: '5 hours ago' },
  { id: 'SC-00420', name: 'Sita Shah', type: 'KYC Update', date: '1 day ago' },
]

const recentActivity = [
  { id: 1, action: 'Bulk Statement Upload', admin: 'Super Admin', date: '10 mins ago' },
  { id: 2, action: 'Notice Published (AGM)', admin: 'Operator', date: '2 hours ago' },
  { id: 3, action: 'Daily Backup Completed', admin: 'System', date: '6 hours ago' },
  { id: 4, action: 'Member Details Updated', admin: 'Operator', date: '1 day ago' },
]

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Admin Dashboard
          </h1>
          <p className="text-body text-mahogany-muted">
            Overview of society operations and pending actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusDot status="ok" label="Systems Operational" />
        </div>
      </header>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" leftIcon={<Users className="h-4 w-4" />}>
          Add Member
        </Button>
        <Button variant="secondary" leftIcon={<FileText className="h-4 w-4" />}>
          Upload Statements
        </Button>
        <Button variant="secondary" leftIcon={<AlertCircle className="h-4 w-4" />}>
          Post Notice
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} padding="md" className="border-mahogany-muted/20">
            <p className="text-sm font-body text-mahogany-muted mb-2">{stat.label}</p>
            <p className="font-data text-2xl text-warm-gold font-medium mb-1">{stat.value}</p>
            <p className="text-xs font-body text-dark-mahogany/60">{stat.trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Approvals */}
        <Card padding="none" className="border-deep-crimson/20 shadow-paper-md">
          <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center bg-deep-crimson/5 rounded-t-[6px]">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-deep-crimson" />
              Pending Approvals
            </CardTitle>
            <Badge variant="urgent">{pendingApprovals.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-ledger-rule">
              {pendingApprovals.map((item) => (
                <LedgerRow
                  key={item.id}
                  title={item.name}
                  subtitle={item.type}
                  date={item.date}
                  className="px-6 py-4"
                  mono={
                    <div className="flex gap-2 mt-1">
                      <button className="p-1 text-verdant-green hover:bg-verdant-green/10 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verdant-green">
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-deep-crimson hover:bg-deep-crimson/10 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-crimson">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
            {pendingApprovals.length === 0 && (
              <div className="p-6 text-center text-mahogany-muted text-sm font-body">
                All caught up. No pending approvals.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Log */}
        <Card padding="none">
          <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center">
            <CardTitle className="text-lg">System Activity Log</CardTitle>
            <button className="text-sm font-body text-warm-gold hover:text-warm-gold-hover">
              View Full Log
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-ledger-rule">
              {recentActivity.map((log) => (
                <LedgerRow
                  key={log.id}
                  stamped
                  title={log.action}
                  subtitle={`By: ${log.admin}`}
                  date={log.date}
                  className="px-6 py-3"
                />
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
