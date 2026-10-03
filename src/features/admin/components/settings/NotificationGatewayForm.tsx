import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Save } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface NotificationGatewayData {
  smsApiKeyConfigured?: boolean
  smtpUrlConfigured?: boolean
  smtpFrom?: string
}

export function NotificationGatewayForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery<NotificationGatewayData>({
    queryKey: ['notifGateway'],
    queryFn: () => apiClient.get('/settings/notification-gateway').then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: {
      smsApiKey?: string
      smtpUrl?: string
      smtpFrom?: string
    }) => apiClient.put('/settings/notification-gateway', payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifGateway'] }),
  })

  const [smsApiKey, setSmsApiKey] = useState('')
  const [smtpUrl, setSmtpUrl] = useState('')
  const [smtpFrom, setSmtpFrom] = useState('')

  useEffect(() => {
    if (data) {
      setSmtpFrom(data.smtpFrom || '')
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        smsApiKey: smsApiKey.trim() || undefined,
        smtpUrl: smtpUrl.trim() || undefined,
        smtpFrom: smtpFrom.trim() || undefined,
      })
      toast.success('Notification gateway updated successfully')
      setSmsApiKey('')
      setSmtpUrl('')
    } catch {
      toast.error('Failed to update gateway configurations')
    }
  }

  if (isLoading) {
    return <SkeletonCard />
  }

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Notification Gateway Config</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-data font-semibold text-dark-mahogany">SMS Gateway</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${
                data?.smsApiKeyConfigured
                  ? 'bg-verdant-green/10 text-verdant-green'
                  : 'bg-slate-100 text-mahogany-muted'
              }`}
            >
              {data?.smsApiKeyConfigured ? '✓ Configured' : 'Not Configured'}
            </span>
          </div>
          <Input
            label="SMS API Key / Secret"
            type="password"
            placeholder={data?.smsApiKeyConfigured ? '••••••••••••••••' : 'Enter SMS Gateway API Key'}
            value={smsApiKey}
            onChange={(e) => setSmsApiKey(e.target.value)}
            hint={
              data?.smsApiKeyConfigured
                ? 'An API key is configured. Enter a new key only to replace it.'
                : 'Key for sending SMS notifications.'
            }
          />
        </div>

        <div className="space-y-4 pt-6 border-t border-ledger-rule">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-data font-semibold text-dark-mahogany">Email (SMTP) Gateway</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${
                data?.smtpUrlConfigured
                  ? 'bg-verdant-green/10 text-verdant-green'
                  : 'bg-slate-100 text-mahogany-muted'
              }`}
            >
              {data?.smtpUrlConfigured ? '✓ Configured' : 'Not Configured'}
            </span>
          </div>
          <Input
            label="SMTP Connection URL"
            type="password"
            placeholder={
              data?.smtpUrlConfigured ? '••••••••••••••••' : 'smtp://user:pass@smtp.example.com:587'
            }
            value={smtpUrl}
            onChange={(e) => setSmtpUrl(e.target.value)}
            hint={
              data?.smtpUrlConfigured
                ? 'SMTP connection is configured. Enter a new connection string to replace.'
                : 'Format: smtp://user:password@host:port'
            }
          />
          <Input
            label="Default Sender Address (From Email)"
            type="email"
            placeholder="noreply@shree-crystal.com"
            value={smtpFrom}
            onChange={(e) => setSmtpFrom(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-ledger-rule">
          <Button
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            isLoading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
