import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/Button'
import { LoanCalculator } from '@/components/ui/LoanCalculator'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { useLanguageStore } from '@/store/language.store'
import { format } from 'date-fns'
import { HeroSection } from '../components/HeroSection'
import { TrustStats } from '../components/TrustStats'
import { ServicesGrid } from '../components/ServicesGrid'
import type { Notice } from '@/types/notice'

export function LandingPage() {
  const { t, language } = useLanguageStore()

  const { data: aboutData } = useQuery<{ text?: string }>({
    queryKey: ['public.content.about_us'],
    queryFn: () => apiClient.get('/public/content/public.content.about_us').then((res) => res.data),
  })

  const { data: noticesData } = useQuery<{ data?: Notice[]; items?: Notice[] } | Notice[]>({
    queryKey: ['publicNotices'],
    queryFn: () => apiClient.get('/notices').then((res) => res.data),
  })
  
  const notices: Notice[] = Array.isArray(noticesData)
    ? noticesData
    : noticesData?.data || noticesData?.items || []
  const recentNotices = notices.slice(0, 3)

  const aboutText =
    language === 'gu'
      ? t.about.defaultText
      : aboutData?.text || t.about.defaultText

  return (
    <div className="bg-ivory pb-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Key Trust Statistics Band */}
      <TrustStats />

      {/* 3. Main Body Sections */}
      <div className="max-w-content mx-auto px-6 lg:px-8 mt-20 space-y-24">
        {/* Core Services Grid */}
        <ServicesGrid />

        {/* Loan Calculator Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-display-md font-display text-dark-mahogany">
              Plan Your Loans Transparently
            </h2>
            <p className="text-body text-mahogany-muted max-w-xl mx-auto">
              Calculate exact monthly installments, interest breakdowns, and tenure options without hidden charges.
            </p>
          </div>
          <LoanCalculator className="bg-white shadow-paper-lg" />
        </section>

        {/* About & Notices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* About Shree Crystal */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-display-md font-display text-dark-mahogany">
              {t.about.heading}
            </h2>
            <p className="text-body-lg text-dark-mahogany/80 leading-relaxed whitespace-pre-line">
              {aboutText}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
              >
                {t.about.readFullStory} &rarr;
              </Link>
            </div>
          </div>

          {/* Recent Public Notices */}
          <div className="lg:col-span-6">
            <Card padding="none" className="bg-white shadow-paper">
              <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {t.notices.publicAnnouncements}
                </CardTitle>
                <Link
                  to="/notices"
                  className="text-xs font-semibold text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
                >
                  {t.notices.viewAll}
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {recentNotices.length > 0 ? (
                  <div className="divide-y divide-ledger-rule">
                    {recentNotices.map((n) => (
                      <LedgerRow
                        key={n.id}
                        title={n.title}
                        subtitle={n.body}
                        date={n.publishedAt || n.createdAt ? format(new Date(n.publishedAt || n.createdAt), 'dd MMM yyyy') : ''}
                        className="px-6 py-4"
                        badge={<Badge variant={n.category}>{n.category}</Badge>}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-mahogany-muted">
                    {t.notices.noNotices}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <section className="bg-dark-mahogany text-ivory rounded-xl p-8 md:p-12 relative overflow-hidden shadow-paper-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-display-md font-display text-ivory">
              Ready to manage your passbook online?
            </h3>
            <p className="text-body text-ivory/80">
              Access statements, verify balances, and stay up to date with society circulars anytime.
            </p>
          </div>
          <div className="shrink-0">
            <LinkButton
              to="/login"
              variant="gold"
              className="h-12 px-6 text-base"
            >
              Sign In to Your Passbook
            </LinkButton>
          </div>
        </section>
      </div>
    </div>
  )
}
