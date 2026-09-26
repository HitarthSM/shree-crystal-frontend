import { Shield, Lock, Eye, FileText, Phone, Mail, Building } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useLanguageStore } from '@/store/language.store'

export function PrivacyPage() {
  const { language } = useLanguageStore()
  const isGujarati = language === 'gu'

  return (
    <div className="bg-ivory min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-deep-saffron relative overflow-hidden py-16">
        <div className="max-w-content mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-gold/20 text-warm-gold text-xs font-medium mb-4 border border-warm-gold/30">
            <Shield className="h-3.5 w-3.5" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>
          <h1 className="text-display-lg font-display text-ivory leading-tight mb-4">
            {isGujarati ? 'ગોપનીયતા નીતિ' : 'Privacy Policy'}
          </h1>
          <p className="text-body-lg text-ivory/80 max-w-2xl mx-auto">
            {isGujarati
              ? 'શ્રી ક્રિસ્ટલ કો-ઓપરેટિવ સોસાયટી તમારા અંગત અને નાણાકીય ડેટાની સુરક્ષા માટે કટિબદ્ધ છે.'
              : 'Shree Crystal Co-operative Credit Society is dedicated to safeguarding your personal and financial data with utmost integrity.'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
      </section>

      {/* Policy Content */}
      <section className="max-w-content mx-auto px-6 lg:px-8 mt-12 space-y-10">
        <div className="text-sm font-body text-mahogany-muted">
          <span>Effective Date: 1st April 2024</span> &bull; <span>Last Updated: 15th January 2025</span>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2">
            1. Introduction & Scope
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            This Privacy Policy outlines how Shree Crystal Co-operative Credit Society Ltd. ("Society", "we", "our", or "us") collects, uses, processes, stores, and protects personal data belonging to our registered members and website visitors in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Gujarat Co-operative Societies Act, 1961</strong>.
          </p>
        </div>

        {/* Data Collection */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2">
            2. Personal Information We Collect
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            To provide legitimate co-operative financial services, we collect and process only the necessary information required by statutory regulations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Card padding="md" className="border-ledger-rule bg-white">
              <div className="flex items-center gap-2 text-dark-mahogany font-semibold mb-2">
                <Lock className="h-4 w-4 text-warm-gold" />
                <span>Identity & KYC Records</span>
              </div>
              <p className="text-sm font-body text-mahogany-muted leading-relaxed">
                Full legal name, Date of Birth, Gender, Father’s/Spouse’s Name, Masked Aadhaar number (last 4 digits stored, SHA-256 cryptographic hash for deduplication), and PAN.
              </p>
            </Card>

            <Card padding="md" className="border-ledger-rule bg-white">
              <div className="flex items-center gap-2 text-dark-mahogany font-semibold mb-2">
                <Phone className="h-4 w-4 text-warm-gold" />
                <span>Contact & Residential Details</span>
              </div>
              <p className="text-sm font-body text-mahogany-muted leading-relaxed">
                Primary mobile number (used for secure OTP authentication), secondary phone, verified email address, residential address, district, state, and pincode.
              </p>
            </Card>

            <Card padding="md" className="border-ledger-rule bg-white">
              <div className="flex items-center gap-2 text-dark-mahogany font-semibold mb-2">
                <FileText className="h-4 w-4 text-warm-gold" />
                <span>Financial & Transaction History</span>
              </div>
              <p className="text-sm font-body text-mahogany-muted leading-relaxed">
                Share capital, savings deposit balances, loan accounts, EMI repayment records, interest schedules, and member account statements.
              </p>
            </Card>

            <Card padding="md" className="border-ledger-rule bg-white">
              <div className="flex items-center gap-2 text-dark-mahogany font-semibold mb-2">
                <Eye className="h-4 w-4 text-warm-gold" />
                <span>Security & Audit Trails</span>
              </div>
              <p className="text-sm font-body text-mahogany-muted leading-relaxed">
                Login timestamps, IP addresses, browser user-agent tokens, and administrative maker-checker action audit records to prevent unauthorized access.
              </p>
            </Card>
          </div>
        </div>

        {/* Data Protection Measures */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2">
            3. Data Security & Storage Architecture
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            All electronic member records are safeguarded by bank-grade security protocols:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm font-body text-dark-mahogany pl-2">
            <li><strong>AES-256-GCM Encryption:</strong> Sensitive member identifiers and personal records are encrypted at rest with hardware security module standards.</li>
            <li><strong>TLS 1.3 in Transit:</strong> All data transmissions between your browser and our servers are encrypted with modern cipher suites.</li>
            <li><strong>Maker-Checker Governance:</strong> Critical account alterations require dual-admin authorization to prevent unilateral modifications.</li>
            <li><strong>Zero Third-Party Commercial Sharing:</strong> We never sell, lease, or monetize member personal data with marketing brokers or private third parties.</li>
          </ul>
        </div>

        {/* Member Rights */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2">
            4. Your Rights Under the DPDP Act
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            As a registered member and data principal, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm font-body text-dark-mahogany pl-2">
            <li><strong>Access:</strong> Request a full copy of your registered profile and financial statements at any time through the Member Portal.</li>
            <li><strong>Correction & Rectification:</strong> Submit a KYC Update request through the portal with supporting documentary proof to update outdated details.</li>
            <li><strong>Grievance Redressal:</strong> File an inquiry or grievance with our designated data protection team.</li>
          </ul>
        </div>

        {/* Grievance Officer */}
        <Card padding="lg" className="border-warm-gold/40 bg-warm-gold/5 mt-8">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg text-dark-mahogany flex items-center gap-2">
              <Building className="h-5 w-5 text-warm-gold" />
              Designated Grievance & Compliance Officer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2 text-sm font-body text-dark-mahogany">
            <p><strong>Name:</strong> Secretary / Compliance Head, Shree Crystal Co-op Credit Society Ltd.</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-warm-gold" /> grievance@shreecrystal.coop</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-warm-gold" /> +91 261 2450000</p>
            <p><strong>Address:</strong> Shree Crystal Bhavan, Ring Road, Surat, Gujarat 395002, India.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
