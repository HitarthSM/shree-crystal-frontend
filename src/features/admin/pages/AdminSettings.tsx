import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { Save, RefreshCw, Shield, Bell, Building2, Database } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { formatDistanceToNow } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('society')

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            System Settings
          </h1>
          <p className="text-body text-mahogany-muted">
            Configure society details, notifications, security, and backups.
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <Button
            variant={activeTab === 'society' ? 'primary' : 'ghost'}
            className="w-full justify-start"
            leftIcon={<Building2 className="h-4 w-4" />}
            onClick={() => setActiveTab('society')}
          >
            Society Details
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'primary' : 'ghost'}
            className="w-full justify-start"
            leftIcon={<Bell className="h-4 w-4" />}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </Button>
          <Button
            variant={activeTab === 'security' ? 'primary' : 'ghost'}
            className="w-full justify-start"
            leftIcon={<Shield className="h-4 w-4" />}
            onClick={() => setActiveTab('security')}
          >
            Security Policy
          </Button>
          <Button
            variant={activeTab === 'backup' ? 'primary' : 'ghost'}
            className="w-full justify-start"
            leftIcon={<Database className="h-4 w-4" />}
            onClick={() => setActiveTab('backup')}
          >
            Database Backups
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'society' && <SocietyDetailsForm />}
          {activeTab === 'notifications' && <NotificationGatewayForm />}
          {activeTab === 'security' && <SecurityPolicyForm />}
          {activeTab === 'backup' && <BackupStatusForm />}
        </div>
      </div>
    </div>
  )
}

function SocietyDetailsForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['societyDetails'], queryFn: () => apiClient.get('/settings/society').then(r => r.data) })
  const updateMutation = useMutation({
    mutationFn: (d: any) => apiClient.put('/settings/society', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['societyDetails'] })
  })

  const [name, setName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [address, setAddress] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.name || '')
      setRegistrationNumber(data.registrationNumber || data.registrationNo || '')
      setAddress(data.address || '')
      setLogoUrl(data.logoUrl || '')
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ 
        name, 
        registrationNumber, 
        address,
        logoUrl: logoUrl.trim() ? logoUrl.trim() : undefined,
      })
      toast.success('Society details updated successfully')
    } catch {
      toast.error('Failed to update society details')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted p-4">Loading society details...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Society Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input label="Society Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Registration Number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
          <Input label="Logo URL (Optional)" type="url" placeholder="https://example.com/logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        </div>
        <Input label="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        
        <div className="flex justify-end pt-4 border-t border-ledger-rule">
          <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave} isLoading={updateMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationGatewayForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ 
    queryKey: ['notifGateway'], 
    queryFn: () => apiClient.get('/settings/notification-gateway').then(r => r.data) 
  })
  const updateMutation = useMutation({
    mutationFn: (d: any) => apiClient.put('/settings/notification-gateway', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifGateway'] })
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

  if (isLoading) return <div className="text-mahogany-muted p-4">Loading gateway config...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Notification Gateway Config</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-data font-semibold text-dark-mahogany">SMS Gateway</h3>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${data?.smsApiKeyConfigured ? 'bg-verdant-green/10 text-verdant-green' : 'bg-slate-100 text-mahogany-muted'}`}>
              {data?.smsApiKeyConfigured ? '✓ Configured' : 'Not Configured'}
            </span>
          </div>
          <Input 
            label="SMS API Key / Secret" 
            type="password" 
            placeholder={data?.smsApiKeyConfigured ? '••••••••••••••••' : 'Enter SMS Gateway API Key'}
            value={smsApiKey}
            onChange={(e) => setSmsApiKey(e.target.value)}
            hint={data?.smsApiKeyConfigured ? "An API key is configured. Enter a new key only to replace it." : "Key for sending SMS notifications."}
          />
        </div>

        <div className="space-y-4 pt-6 border-t border-ledger-rule">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-data font-semibold text-dark-mahogany">Email (SMTP) Gateway</h3>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${data?.smtpUrlConfigured ? 'bg-verdant-green/10 text-verdant-green' : 'bg-slate-100 text-mahogany-muted'}`}>
              {data?.smtpUrlConfigured ? '✓ Configured' : 'Not Configured'}
            </span>
          </div>
          <Input 
            label="SMTP Connection URL" 
            type="password" 
            placeholder={data?.smtpUrlConfigured ? '••••••••••••••••' : 'smtp://user:pass@smtp.example.com:587'}
            value={smtpUrl}
            onChange={(e) => setSmtpUrl(e.target.value)}
            hint={data?.smtpUrlConfigured ? "SMTP connection is configured. Enter a new connection string to replace." : "Format: smtp://user:password@host:port"}
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
          <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave} isLoading={updateMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SecurityPolicyForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['securityPolicy'], queryFn: () => apiClient.get('/settings/security').then(r => r.data) })
  const updateMutation = useMutation({
    mutationFn: (d: any) => apiClient.put('/settings/security', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['securityPolicy'] })
  })

  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30)
  const [minLength, setMinLength] = useState(8)
  const [requireUppercase, setRequireUppercase] = useState(true)
  const [requireLowercase, setRequireLowercase] = useState(true)
  const [requireNumbers, setRequireNumbers] = useState(true)
  const [requireSpecialCharacters, setRequireSpecialCharacters] = useState(true)
  const [loanApproval, setLoanApproval] = useState(true)
  const [memberApproval, setMemberApproval] = useState(true)

  useEffect(() => {
    if (data) {
      if (data.sessionTimeoutMinutes) setSessionTimeoutMinutes(data.sessionTimeoutMinutes)
      if (data.passwordPolicy) {
        setMinLength(data.passwordPolicy.minLength ?? 8)
        setRequireUppercase(data.passwordPolicy.requireUppercase ?? true)
        setRequireLowercase(data.passwordPolicy.requireLowercase ?? true)
        setRequireNumbers(data.passwordPolicy.requireNumbers ?? true)
        setRequireSpecialCharacters(data.passwordPolicy.requireSpecialCharacters ?? true)
      }
      if (data.makerCheckerEnabled) {
        setLoanApproval(data.makerCheckerEnabled.loanApproval ?? true)
        setMemberApproval(data.makerCheckerEnabled.memberApproval ?? true)
      }
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        sessionTimeoutMinutes: Math.max(1, Number(sessionTimeoutMinutes) || 30),
        passwordPolicy: {
          minLength: Math.max(6, Number(minLength) || 8),
          requireUppercase,
          requireLowercase,
          requireNumbers,
          requireSpecialCharacters,
        },
        makerCheckerEnabled: {
          loanApproval,
          memberApproval,
        },
      })
      toast.success('Security policies updated')
    } catch {
      toast.error('Failed to update security policies')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted p-4">Loading security policy...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Security & Maker-Checker Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Session Timeout (Minutes)" 
            type="number" 
            value={sessionTimeoutMinutes.toString()}
            onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 0)}
            hint="Idle time before automatic logout (Min 1)"
          />
          <Input 
            label="Password Min Length" 
            type="number" 
            value={minLength.toString()}
            onChange={(e) => setMinLength(parseInt(e.target.value) || 6)}
            hint="Minimum character count for passwords (Min 6)"
          />
        </div>
        
        <div className="space-y-3 pt-4 border-t border-ledger-rule">
          <h4 className="text-sm font-semibold text-dark-mahogany font-data">Password Complexity Rules</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input 
                type="checkbox" 
                checked={requireUppercase} 
                onChange={(e) => setRequireUppercase(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Uppercase Letters
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input 
                type="checkbox" 
                checked={requireLowercase} 
                onChange={(e) => setRequireLowercase(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Lowercase Letters
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input 
                type="checkbox" 
                checked={requireNumbers} 
                onChange={(e) => setRequireNumbers(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Numbers
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input 
                type="checkbox" 
                checked={requireSpecialCharacters} 
                onChange={(e) => setRequireSpecialCharacters(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Special Characters (!@#$)
            </label>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-ledger-rule">
          <h4 className="text-sm font-semibold text-dark-mahogany font-data">Maker-Checker Dual Approval</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input 
                type="checkbox" 
                checked={loanApproval} 
                onChange={(e) => setLoanApproval(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Two-Person Loan Approval
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input 
                type="checkbox" 
                checked={memberApproval} 
                onChange={(e) => setMemberApproval(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Two-Person Member Edit Approval
            </label>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-ledger-rule">
          <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave} isLoading={updateMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BackupStatusForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ 
    queryKey: ['backupStatus'], 
    queryFn: () => apiClient.get('/settings/backup').then(r => r.data) 
  })
  const runMutation = useMutation({
    mutationFn: () => apiClient.post('/settings/backup/run-now').then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['backupStatus'] })
  })

  const handleRunBackup = async () => {
    try {
      await runMutation.mutateAsync()
      toast.success('Manual backup executed successfully')
    } catch {
      toast.error('Backup failed to run')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted p-4">Loading backup status...</div>

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
            <p className={`text-sm font-body font-semibold ${data?.status === 'SUCCESS' ? 'text-verdant-green' : data?.status === 'FAILED' ? 'text-deep-crimson' : 'text-mahogany-muted'}`}>
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
