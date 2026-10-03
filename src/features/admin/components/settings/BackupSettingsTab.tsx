import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { RefreshCw } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { formatDistanceToNow } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface BackupStatusData {
  lastBackupTimestamp?: string
  status?: string
}

export function BackupSettingsTab() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery<BackupStatusData>({
    queryKey: ['backupStatus'],
    queryFn: () => apiClient.get('/settings/backup').then((r) => r.data),
  })

  const runMutation = useMutation({
    mutationFn: () => apiClient.post('/settings/backup/run-now').then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['backupStatus'] }),
  })

  const handleRunBackup = async () => {
    try {
      await runMutation.mutateAsync()
      toast.success('Manual backup executed successfully')
    } catch {
      toast.error('Backup failed to run')
    }
  }

  if (isLoading) {
    return <SkeletonCard />
  }

  const backupTime = data?.lastBackupTimestamp ? new Date(data.lastBackupTimestamp) : null
  const isValidTime = backupTime && !isNaN(backupTime.getTime())

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Database Backups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-ledger-paper p-4 border border-ledger-rule rounded-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-data font-bold text-dark-mahogany">Last Backup Timestamp</p>
            <p className="text-sm font-body text-mahogany-muted">
              {isValidTime ? formatDistanceToNow(backupTime, { addSuffix: true }) : 'Never'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-data font-bold text-dark-mahogany">Status</p>
            <p
              className={`text-sm font-body font-semibold ${
                data?.status === 'SUCCESS'
                  ? 'text-verdant-green'
                  : data?.status === 'FAILED'
                  ? 'text-deep-crimson'
                  : 'text-mahogany-muted'
              }`}
            >
              {data?.status || 'PENDING'}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-ledger-rule">
          <Button
            variant="primary"
            leftIcon={<RefreshCw className={`h-4 w-4 ${runMutation.isPending ? 'animate-spin' : ''}`} />}
            onClick={handleRunBackup}
            disabled={runMutation.isPending}
          >
            {runMutation.isPending ? 'Running Backup...' : 'Run Manual Backup Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
