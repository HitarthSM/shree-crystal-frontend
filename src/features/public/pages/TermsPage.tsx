import { Scale, FileCheck2, UserCheck, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useLanguageStore } from '@/store/language.store'

export function TermsPage() {
  const { language } = useLanguageStore()
  const isGujarati = language === 'gu'

  return (
    <div className="bg-ivory min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-deep-saffron relative overflow-hidden py-16">
        <div className="max-w-content mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-gold/20 text-warm-gold text-xs font-medium mb-4 border border-warm-gold/30">
            <Scale className="h-3.5 w-3.5" />
            <span>Gujarat Co-operative Societies Act, 1961 Bylaws</span>
          </div>
          <h1 className="text-display-lg font-display text-ivory leading-tight mb-4">
            {isGujarati ? 'સેવાની શરતો' : 'Terms of Service'}
          </h1>
          <p className="text-body-lg text-ivory/80 max-w-2xl mx-auto">
            {isGujarati
              ? 'સોસાયટી સભ્યપદ, ડિજિટલ પોર્ટલ ઉપયોગ અને સહકારી નિયમો અંગેના સામાન્ય નિયમો અને શરતો.'
              : 'Governing terms and conditions for society membership, digital portal usage, and cooperative operations.'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
      </section>

      {/* Terms Content */}
      <section className="max-w-content mx-auto px-6 lg:px-8 mt-12 space-y-10">
        <div className="text-sm font-body text-mahogany-muted">
          <span>Registered Bylaws Version: 3.2</span> &bull; <span>Applicable to All Active Members</span>
        </div>

        {/* 1. Membership Eligibility */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-warm-gold" />
            1. Membership Eligibility & Rights
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            Membership in Shree Crystal Co-operative Credit Society Ltd. is governed strictly by the approved Society Bylaws and provisions of the Gujarat Co-operative Societies Act, 1961. Only individuals residing within the authorized operational jurisdiction who hold verified KYC documentation and minimum qualifying share capital are eligible for active membership.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm font-body text-dark-mahogany pl-2">
            <li>Every active member has one vote in General Body Meetings regardless of total shareholding quantity.</li>
            <li>Members must immediately notify the society of any change in residence, mobile number, or bank particulars.</li>
            <li>Membership privileges are non-transferable except through statutory nomination upon succession.</li>
          </ul>
        </div>

        {/* 2. Digital Portal & Authentication */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2 flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-warm-gold" />
            2. Member Portal & Digital Authentication
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            The Shree Crystal digital portal is an informational and statement self-service facility for verified members:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="md" className="border-ledger-rule bg-white">
              <h3 className="text-sm font-bold text-dark-mahogany mb-1">Login Credential Security</h3>
              <p className="text-xs font-body text-mahogany-muted leading-relaxed">
                Logins are authenticated with the member’s registered ID or mobile number and password. Members are strictly advised never to share their password or login credentials with any third party or society agent.
              </p>
            </Card>

            <Card padding="md" className="border-ledger-rule bg-white">
              <h3 className="text-sm font-bold text-dark-mahogany mb-1">Account Statements & Electronic Notices</h3>
              <p className="text-xs font-body text-mahogany-muted leading-relaxed">
                Digital statements and notices published on this portal constitute legally recognized communications under the Information Technology Act, 2000. Members should verify statement line items within 30 days of posting.
              </p>
            </Card>
          </div>
        </div>

        {/* 3. Deposits and Credit Facilities */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-warm-gold" />
            3. Savings, Fixed Deposits & Loans
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            All financial transactions, interest disbursements, and loan sanctions adhere to circulars issued by the Registrar of Co-operative Societies and the Board of Directors:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm font-body text-dark-mahogany pl-2">
            <li>Interest rates on thrift deposits, recurring deposits, and loans are revised periodically in accordance with Board resolutions.</li>
            <li>Loan borrowers and their guarantors are jointly and severally liable for timely repayment of EMIs and interest charges.</li>
            <li>The society maintains a first statutory charge and lien over member share capital and deposit balances against overdue liabilities.</li>
          </ul>
        </div>

        {/* 4. Limitation of Liability & Jurisdiction */}
        <div className="space-y-4">
          <h2 className="text-display-sm font-display text-dark-mahogany border-b border-ledger-rule pb-2 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-warm-gold" />
            4. Dispute Redressal & Jurisdiction
          </h2>
          <p className="text-body font-body text-dark-mahogany leading-relaxed">
            Any dispute or claim touching upon the constitution, management, or business of the society shall be adjudicated exclusively by the <strong>Board of Nominees / Co-operative Court, Surat, Gujarat</strong> in accordance with Section 96 of the Gujarat Co-operative Societies Act, 1961.
          </p>
        </div>

        <div className="p-4 bg-ledger-paper/70 rounded-[6px] border border-ledger-rule flex gap-3 items-start mt-6">
          <AlertCircle className="h-5 w-5 text-dark-mahogany shrink-0 mt-0.5" />
          <div className="text-xs font-body text-dark-mahogany leading-relaxed">
            For inquiries, loan applications, or bylaw interpretations, please visit our registered office during regular banking hours or submit an inquiry through the Support Desk.
          </div>
        </div>
      </section>
    </div>
  )
}
