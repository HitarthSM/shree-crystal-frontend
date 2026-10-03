import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Shield, Bell, Building2, Database } from 'lucide-react'
import { SocietyDetailsForm } from '../components/settings/SocietyDetailsForm'
import { NotificationGatewayForm } from '../components/settings/NotificationGatewayForm'
import { SecurityPolicyForm } from '../components/settings/SecurityPolicyForm'
import { BackupSettingsTab } from '../components/settings/BackupSettingsTab'

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'society' | 'notifications' | 'security' | 'backup'>('society')

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="System Settings"
        description="Configure society details, notifications, security, and backups."
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
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
          {activeTab === 'backup' && <BackupSettingsTab />}
        </div>
      </div>
    </div>
  )
}
