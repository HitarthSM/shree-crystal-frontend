import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/FormControls'
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
    mutationFn: (d: any) => apiClient.patch('/settings/society', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['societyDetails'] })
  })

  const [name, setName] = useState('')
  const [registrationNo, setRegistrationNo] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.name || '')
      setRegistrationNo(data.registrationNo || '')
      setAddress(data.address || '')
      setPhone(data.phone || '')
      setEmail(data.email || '')
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ name, registrationNo, address, phone, email })
      toast.success('Society details updated successfully')
    } catch (err) {
      toast.error('Failed to update society details')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted">Loading...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Society Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input label="Society Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Registration Number" value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
  const { data, isLoading } = useQuery({ queryKey: ['notifGateway'], queryFn: () => apiClient.get('/settings/notifications').then(r => r.data) })
  const updateMutation = useMutation({
    mutationFn: (d: any) => apiClient.patch('/settings/notifications', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifGateway'] })
  })

  const [smsProvider, setSmsProvider] = useState('TWILIO')
  const [smsApiKey, setSmsApiKey] = useState('')
  const [emailProvider, setEmailProvider] = useState('SENDGRID')
  const [emailApiKey, setEmailApiKey] = useState('')

  useEffect(() => {
    if (data) {
      setSmsProvider(data.smsProvider || 'TWILIO')
      setEmailProvider(data.emailProvider || 'SENDGRID')
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        smsProvider,
        smsApiKey: smsApiKey || undefined,
        emailProvider,
        emailApiKey: emailApiKey || undefined,
      })
      toast.success('Notification gateway updated successfully')
      setSmsApiKey('') // Clear sensitive inputs after save
      setEmailApiKey('')
    } catch (err) {
      toast.error('Failed to update gateway configurations')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted">Loading...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Notification Gateway Config</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-data font-semibold text-dark-mahogany">SMS Gateway</h3>
          <Select 
            label="Provider" 
            value={smsProvider} 
            onChange={(e) => setSmsProvider(e.target.value)}
            options={[{ value: 'TWILIO', label: 'Twilio' }, { value: 'MOCK', label: 'Mock (Console Logging)' }]}
          />
          <Input 
            label="API Key / Secret" 
            type="password" 
            placeholder={data?.smsConfigured ? '••••••••••••••••' : 'Enter new API Key'}
            value={smsApiKey}
            onChange={(e) => setSmsApiKey(e.target.value)}
            hint={data?.smsConfigured ? "An API key is already configured. Entering a new one will override it." : ""}
          />
        </div>

        <div className="space-y-4 pt-6 border-t border-ledger-rule">
          <h3 className="text-sm font-data font-semibold text-dark-mahogany">Email Gateway</h3>
          <Select 
            label="Provider" 
            value={emailProvider} 
            onChange={(e) => setEmailProvider(e.target.value)}
            options={[{ value: 'SENDGRID', label: 'SendGrid' }, { value: 'SMTP', label: 'Custom SMTP' }, { value: 'MOCK', label: 'Mock (Console Logging)' }]}
          />
          <Input 
            label="API Key / Secret" 
            type="password" 
            placeholder={data?.emailConfigured ? '••••••••••••••••' : 'Enter new API Key'}
            value={emailApiKey}
            onChange={(e) => setEmailApiKey(e.target.value)}
            hint={data?.emailConfigured ? "An API key is already configured. Entering a new one will override it." : ""}
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
    mutationFn: (d: any) => apiClient.patch('/settings/security', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['securityPolicy'] })
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeoutMinutes: 30,
    maxFailedLogins: 5,
    requireComplexPasswords: true
  })

  useEffect(() => {
    if (data) {
      setSecuritySettings({
        sessionTimeoutMinutes: data.sessionTimeoutMinutes || 30,
        maxFailedLogins: data.maxLoginAttempts || 5,
        requireComplexPasswords: data.requireComplexPasswords ?? true
      })
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        sessionTimeoutMinutes: Number(securitySettings.sessionTimeoutMinutes),
        maxLoginAttempts: Number(securitySettings.maxFailedLogins),
        requireComplexPasswords: securitySettings.requireComplexPasswords,
      })
      toast.success('Security policies updated')
    } catch (err) {
      toast.error('Failed to update security policies')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted">Loading...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Security Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Session Timeout (Minutes)" 
            type="number" 
            value={securitySettings.sessionTimeoutMinutes.toString()}
            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeoutMinutes: parseInt(e.target.value) || 0 })}
            hint="Idle time before automatic logout"
          />
          <Input 
            label="Max Login Attempts" 
            type="number" 
            value={securitySettings.maxFailedLogins.toString()}
            onChange={(e) => setSecuritySettings({ ...securitySettings, maxFailedLogins: parseInt(e.target.value) || 0 })}
            hint="Lock account after these many failed attempts"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="complex-pass"
            checked={securitySettings.requireComplexPasswords}
            onChange={(e) => setSecuritySettings({ ...securitySettings, requireComplexPasswords: e.target.checked })}
            className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
          />
          <label htmlFor="complex-pass" className="text-sm text-dark-mahogany font-body cursor-pointer">
            Require Complex Passwords (uppercase, numbers, symbols)
          </label>
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
  const { data, isLoading } = useQuery({ queryKey: ['backupStatus'], queryFn: () => apiClient.get('/settings/backup/status').then(r => r.data) })
  const runMutation = useMutation({
    mutationFn: () => apiClient.post('/settings/backup/run').then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['backupStatus'] })
  })

  const handleRunBackup = async () => {
    try {
      await runMutation.mutateAsync()
      toast.success('Manual backup successfully triggered')
    } catch (err) {
      toast.error('Backup failed to run')
    }
  }

  if (isLoading) return <div className="text-mahogany-muted">Loading...</div>

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Database Backups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-ledger-paper p-4 border border-ledger-rule rounded-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-data font-bold text-dark-mahogany">Last Backup Date</p>
            <p className="text-sm font-body text-mahogany-muted">
              {data?.lastBackupDate ? formatDistanceToNow(new Date(data.lastBackupDate), { addSuffix: true }) : 'Never'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-data font-bold text-dark-mahogany">Status</p>
            <p className={`text-sm font-body font-semibold ${data?.lastBackupStatus === 'SUCCESS' ? 'text-verdant-green' : data?.lastBackupStatus === 'FAILED' ? 'text-deep-crimson' : 'text-mahogany-muted'}`}>
              {data?.lastBackupStatus || 'UNKNOWN'}
            </p>
          </div>
        </div>
        
        {data?.lastBackupError && (
          <div className="p-4 bg-deep-crimson/10 border-l-4 border-deep-crimson text-sm text-deep-crimson font-body">
            <strong>Last Error: </strong> {data.lastBackupError}
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t border-ledger-rule">
          <Button variant="primary" leftIcon={<RefreshCw className={`h-4 w-4 ${runMutation.isPending ? 'animate-spin' : ''}`} />} onClick={handleRunBackup} disabled={runMutation.isPending}>
            Run Manual Backup Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
