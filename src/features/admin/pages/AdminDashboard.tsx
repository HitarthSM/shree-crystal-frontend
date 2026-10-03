import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge, StatusDot } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ConfirmModal, PromptModal } from '@/components/ui/Modal'
import { SkeletonRow } from '@/components/ui/Skeleton'
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
import type { AdminDashboardData, PendingApproval } from '@/types/dashboard'

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function AdminDashboard() {
  const queryClient = useQueryClient()
  
  // Modal state for Approval and Rejection
  const [approveItem, setApproveItem] = useState<{ id: string; actionType: string } | null>(null)
  const [rejectItem, setRejectItem] = useState<{ id: string; actionType: string } | null>(null)

  const { data, isLoading } = useQuery<AdminDashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: () => apiClient.get('/dashboard/admin').then(res => res.data)
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/pending-actions/${id}/approve`),
    onSuccess: () => {
      toast.success('Action approved successfully')
      setApproveItem(null)
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
    },
    onError: (err: AxiosErrorResponse) => {
      toast.error(err.response?.data?.message || 'Failed to approve action')
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      apiClient.post(`/pending-actions/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success('Action rejected')
      setRejectItem(null)
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
    },
    onError: (err: AxiosErrorResponse) => {
      toast.error(err.response?.data?.message || 'Failed to reject action')
    }
  })

  const handleConfirmApprove = () => {
    if (approveItem) {
      approveMutation.mutate(approveItem.id)
    }
  }

  const handleConfirmReject = (reason: string) => {
    if (rejectItem) {
      rejectMutation.mutate({ id: rejectItem.id, reason })
    }
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
      <PageHeader
        title="Admin Dashboard"
        description="Society overview and day-to-day administrative tasks."
        actions={<StatusDot status="ok" label="All Systems Working" />}
      />

      {/* Quick Actions Row using semantic LinkButton */}
      <div className="flex flex-wrap gap-4">
        <LinkButton
          to="/admin/members/add"
          variant="primary"
          leftIcon={<Users className="h-4 w-4" />}
        >
          Add Member
        </LinkButton>
        <LinkButton
          to="/admin/statements"
          variant="secondary"
          leftIcon={<FileText className="h-4 w-4" />}
        >
          Upload Statements
        </LinkButton>
        <LinkButton
          to="/admin/notices"
          variant="secondary"
          leftIcon={<AlertCircle className="h-4 w-4" />}
        >
          Post Notice
        </LinkButton>
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
                <div className="p-4 space-y-2">
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
              ) : pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">
                  All caught up! There are no pending requests right now.
                </div>
              ) : (
                pendingApprovals.map((item: PendingApproval) => (
                  <LedgerRow
                    key={item.id}
                    title={item.actionType ? item.actionType.replace(/_/g, ' ') : 'Pending Request'}
                    subtitle={item.requestedBy?.fullName ? `By: ${item.requestedBy.fullName}` : `ID: ${item.id.slice(0, 8)}`}
                    date={formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    className="px-6 py-4"
                    mono={
                      <div className="flex items-center gap-1 mt-1">
                        <button 
                          onClick={() => setApproveItem({ id: item.id, actionType: item.actionType })}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          title="Approve Action"
                          aria-label="Approve Action"
                          className="min-h-[44px] min-w-[44px] p-2 text-verdant-green hover:bg-verdant-green/10 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verdant-green disabled:opacity-50 flex items-center justify-center cursor-pointer"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setRejectItem({ id: item.id, actionType: item.actionType })}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          title="Reject Action"
                          aria-label="Reject Action"
                          className="min-h-[44px] min-w-[44px] p-2 text-deep-crimson hover:bg-deep-crimson/10 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-crimson disabled:opacity-50 flex items-center justify-center cursor-pointer"
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
                <div className="p-4 space-y-2">
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">
                  No recent activity recorded yet.
                </div>
              ) : (
                recentActivity.map((log) => (
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

      {/* Accessible Approval Confirmation Modal */}
      <ConfirmModal
        isOpen={!!approveItem}
        onClose={() => setApproveItem(null)}
        onConfirm={handleConfirmApprove}
        title="Approve Request"
        message={`Are you sure you want to approve this ${approveItem?.actionType?.replace(/_/g, ' ') || 'action'}?`}
        confirmText="Approve"
        isLoading={approveMutation.isPending}
      />

      {/* Accessible Rejection Reason Prompt Modal */}
      <PromptModal
        isOpen={!!rejectItem}
        onClose={() => setRejectItem(null)}
        onSubmit={handleConfirmReject}
        title="Reject Request"
        message={`Please provide a reason for rejecting this ${rejectItem?.actionType?.replace(/_/g, ' ') || 'action'}:`}
        placeholder="Enter rejection reason here..."
        submitText="Reject Request"
        isLoading={rejectMutation.isPending}
      />
    </div>
  )
}
