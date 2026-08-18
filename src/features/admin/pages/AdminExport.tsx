import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/FormControls'
import { Download, FileText, Users, Database } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

export function AdminExport() {
  const [exportType, setExportType] = useState('members')
  const [format, setFormat] = useState('csv')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    // Mock download delay
    await new Promise(r => setTimeout(r, 1500))
    setIsExporting(false)
    toast.success(`${exportType.charAt(0).toUpperCase() + exportType.slice(1)} data exported successfully as ${format.toUpperCase()}`)
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Export Data
          </h1>
          <p className="text-body text-mahogany-muted">
            Generate and download reports for members, statements, and system audits.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" className="md:col-span-2">
          <CardHeader className="mb-6">
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Data Type"
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                options={[
                  { value: 'members', label: 'Members Directory' },
                  { value: 'statements', label: 'Financial Statements' },
                  { value: 'audit', label: 'System Audit Logs' },
                ]}
              />
              <Select
                label="Export Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={[
                  { value: 'csv', label: 'CSV (Spreadsheet)' },
                  { value: 'pdf', label: 'PDF Document' },
                  { value: 'json', label: 'JSON (Raw Data)' },
                ]}
              />
            </div>
            
            <div className="bg-verdant-green/5 p-4 rounded-[4px] border border-verdant-green/20 flex gap-4 items-start">
              <div className="p-2 bg-verdant-green/10 rounded-full text-verdant-green shrink-0">
                {exportType === 'members' ? <Users className="h-5 w-5" /> : exportType === 'statements' ? <FileText className="h-5 w-5" /> : <Database className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-dark-mahogany font-data">
                  {exportType === 'members' ? 'Members Directory Export' : exportType === 'statements' ? 'Financial Statements Export' : 'System Audit Logs Export'}
                </h4>
                <p className="text-sm text-mahogany-muted mt-1">
                  {exportType === 'members' 
                    ? 'Includes all member personal details, KYC status, and contact information. Excludes passwords.' 
                    : exportType === 'statements' 
                    ? 'Includes all financial statements, ledger entries, and transaction history across all active members.' 
                    : 'Includes all system activities, admin logins, and settings changes for compliance audits.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-ledger-rule">
              <Button 
                variant="primary" 
                leftIcon={<Download className="h-4 w-4" />} 
                onClick={handleExport}
                isLoading={isExporting}
              >
                Generate & Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card padding="lg" className="bg-ledger-paper/50">
          <CardHeader className="mb-4 border-b border-ledger-rule pb-4">
            <CardTitle className="text-base">Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-dark-mahogany">Members Directory.csv</p>
                  <p className="text-mahogany-muted text-xs">Today, 10:45 AM by Admin</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-warm-gold hover:bg-warm-gold/10 hover:text-warm-gold-hover">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-dark-mahogany">Audit Logs Q1.pdf</p>
                  <p className="text-mahogany-muted text-xs">Yesterday, 4:20 PM by System</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-warm-gold hover:bg-warm-gold/10 hover:text-warm-gold-hover">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
