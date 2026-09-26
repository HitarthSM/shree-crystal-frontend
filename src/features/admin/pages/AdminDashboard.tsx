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
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { toast } from '@/components/ui/Toast'
import { formatDistanceToNow } from 'date-fns'

export function AdminDashboard() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => apiClient.get('/dashboard/admin').then(res => res.data)
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/pending-actions/${id}/approve`),
    onSuccess: () => {
      toast.success('Action approved successfully')
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to approve action')
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      apiClient.post(`/pending-actions/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success('Action rejected')
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reject action')
    }
  })

  const handleApprove = (id: string, actionType: string) => {
    const formatted = actionType ? actionType.replace(/_/g, ' ') : 'request'
    if (window.confirm(`Are you sure you want to approve this ${formatted}?`)) {
      approveMutation.mutate(id)
    }
  }

  const handleReject = (id: string, actionType: string) => {
    const formatted = actionType ? actionType.replace(/_/g, ' ') : 'request'
    const reason = window.prompt(`Please enter the reason for rejecting this ${formatted}:`)
    if (reason === null) return
    if (!reason.trim()) {
      toast.error('A rejection reason is required.')
      return
    }
    rejectMutation.mutate({ id, reason: reason.trim() })
  }

  const stats = [
    { label: 'Registered Members', value: data?.stats.totalActiveMembers || 0, trend: 'Current Total' },
    { label: 'Requests to Approve', value: data?.stats.pendingApprovalsCount || 0, trend: 'Action needed' },
    { label: 'Total Loans Given', value: formatINR(data?.stats.totalLoanDisbursed || 0), trend: 'FY 24-25' },
    { label: 'Member Deposits', value: formatINR(data?.stats.activeDeposits || 0), trend: 'FY 24-25' },
  ]

  const pendingApprovals = data?.pendingApprovals || []
  const recentActivity = data?.recentActivity || []

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Admin Dashboard
          </h1>
          <p className="text-body text-mahogany-muted">
            Society overview and day-to-day administrative tasks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusDot status="ok" label="All Systems Working" />
        </div>
      </header>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-4">
        <Link to="/admin/members/add">
          <Button variant="primary" leftIcon={<Users className="h-4 w-4" />}>
            Add Member
          </Button>
        </Link>
        <Link to="/admin/statements">
          <Button variant="secondary" leftIcon={<FileText className="h-4 w-4" />}>
            Upload Statements
          </Button>
        </Link>
        <Link to="/admin/notices">
          <Button variant="secondary" leftIcon={<AlertCircle className="h-4 w-4" />}>
            Post Notice
          </Button>
        </Link>
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
              Requests Waiting for Approval
            </CardTitle>
            <Badge variant="urgent">{pendingApprovals.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-ledger-rule">
              {isLoading ? (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">Loading...</div>
              ) : pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">
                  All caught up! There are no pending requests right now.
                </div>
              ) : (
                pendingApprovals.map((item: any) => (
                  <LedgerRow
                    key={item.id}
                    title={item.actionType ? item.actionType.replace(/_/g, ' ') : 'Pending Request'}
                    subtitle={`Status: ${item.status}`}
                    date={formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    className="px-6 py-4"
                    mono={
                      <div className="flex items-center gap-1 mt-1">
                        <button 
                          onClick={() => handleApprove(item.id, item.actionType)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          title="Approve Action"
                          aria-label="Approve Action"
                          className="min-h-[44px] min-w-[44px] p-2 text-verdant-green hover:bg-verdant-green/10 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verdant-green disabled:opacity-50 flex items-center justify-center"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleReject(item.id, item.actionType)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          title="Reject Action"
                          aria-label="Reject Action"
                          className="min-h-[44px] min-w-[44px] p-2 text-deep-crimson hover:bg-deep-crimson/10 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-crimson disabled:opacity-50 flex items-center justify-center"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    }
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Log */}
        <Card padding="none">
          <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center">
            <CardTitle className="text-lg">Recent Society Activity</CardTitle>
            <Link to="/admin/activity" className="text-sm font-medium text-warm-gold hover:text-warm-gold-hover">
              View Full History
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-ledger-rule">
              {isLoading ? (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">Loading...</div>
              ) : recentActivity.length === 0 ? (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">
                  No recent activity recorded yet.
                </div>
              ) : (
                recentActivity.map((log: any) => (
                  <LedgerRow
                    key={log.id}
                    stamped
                    title={log.action}
                    subtitle={`By: ${log.actorType}`}
                    date={formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    className="px-6 py-3"
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
