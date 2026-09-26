import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { calculateEMI, formatINR } from '@/lib/utils'
import { useLanguageStore } from '@/store/language.store'
import {
  Calculator,
  ShieldCheck,
  Users,
  Landmark,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react'
import { format } from 'date-fns'

export function LandingPage() {
  const { t, language } = useLanguageStore()

  const [principal, setPrincipal] = useState('500000')
  const [months, setMonths] = useState('60')
  const [rate, setRate] = useState('9.5')

  const { data: aboutData } = useQuery({
    queryKey: ['public.content.about_us'],
    queryFn: () => apiClient.get('/public/content/public.content.about_us').then((res) => res.data),
  })

  const { data: noticesData, isLoading: isLoadingNotices } = useQuery({
    queryKey: ['publicNotices'],
    queryFn: () => apiClient.get('/notices').then((res) => res.data),
  })
  const notices = noticesData?.data || noticesData || []
  const recentNotices = notices.slice(0, 3)

  const aboutText =
    language === 'gu'
      ? t.about.defaultText
      : aboutData?.text || t.about.defaultText

  // EMI Calculations
  const pNum = Number(principal) || 0
  const rNum = Number(rate) || 0
  const mNum = Number(months) || 1

  const emi = useMemo(() => calculateEMI(pNum, rNum, mNum), [pNum, rNum, mNum])
  const totalAmount = useMemo(() => emi * mNum, [emi, mNum])
  const totalInterest = useMemo(() => Math.max(0, totalAmount - pNum), [totalAmount, pNum])

  const principalPercent = useMemo(() => {
    if (totalAmount <= 0) return 100
    return Math.min(100, Math.max(0, Math.round((pNum / totalAmount) * 100)))
  }, [pNum, totalAmount])

  const interestPercent = 100 - principalPercent

  const presets = [
    { label: t.calculator.presetEmergency, p: '50000', m: '12', r: '9.5' },
    { label: t.calculator.presetPersonal, p: '200000', m: '36', r: '9.5' },
    { label: t.calculator.presetBusiness, p: '1000000', m: '60', r: '9.5' },
  ]

  return (
    <div className="bg-ivory pb-24">
      {/* ─── Hero Section with Atmospheric Radial Lighting ─── */}
      <section className="bg-deep-saffron relative overflow-hidden bg-[radial-gradient(ellipse_75%_65%_at_80%_-10%,rgba(200,134,44,0.25),rgba(107,45,0,0))]">
        <div className="max-w-content mx-auto px-6 lg:px-8 pt-16 pb-24 lg:pt-20 lg:pb-28 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory/10 border border-ivory/20 text-ivory text-xs font-body font-medium backdrop-blur-sm shadow-sm">
              <ShieldCheck className="h-4 w-4 text-warm-gold" />
              <span>{t.hero.trustBadge}</span>
            </div>

            <h1 className="text-display-lg font-display text-ivory animate-hero leading-tight">
              {t.hero.titlePart1}
              <br />
              {t.hero.titlePart2}
            </h1>

            <p className="text-body-lg text-ivory/85 max-w-lg animate-hero-delayed">
              {t.hero.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 animate-hero-btn">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 font-body font-semibold rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 bg-warm-gold text-dark-mahogany hover:bg-warm-gold-hover h-12 px-6 text-base shadow-sm active:scale-[0.98]"
              >
                {t.hero.memberLogin}
                <ArrowRight className="h-4 w-4 text-dark-mahogany/80" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] border border-ivory/30 text-ivory hover:bg-ivory/10 transition-colors h-12 px-5 text-base"
              >
                {t.hero.learnMore}
              </Link>
            </div>
          </div>

          {/* Floating Animated Passbook / Ledger Graphic */}
          <div className="flex-1 animate-hero-delayed hidden md:block animate-float">
            <div className="relative">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto drop-shadow-2xl rounded-xl border border-warm-gold/20"
                aria-hidden="true"
              >
                <rect x="0" y="0" width="400" height="300" fill="#FAF5E8" rx="8" />
                {/* Ledger Header Band */}
                <rect x="0" y="0" width="400" height="24" fill="#E6DBCA" />
                <circle cx="16" cy="12" r="4" fill="#C8862C" />
                <circle cx="30" cy="12" r="4" fill="#C8862C" opacity="0.6" />
                {/* Ledger Rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <g key={i} transform={`translate(0, ${i * 45 + 16})`}>
                    <line
                      x1="20"
                      y1="0"
                      x2="380"
                      y2="0"
                      stroke="rgba(44,26,14,0.12)"
                      strokeWidth="1"
                    />
                    {i % 2 !== 0 && (
                      <>
                        <circle
                          cx="45"
                          cy="-20"
                          r="9"
                          stroke="#C8862C"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle cx="45" cy="-20" r="6" fill="#C8862C" />
                      </>
                    )}
                    <rect
                      x="75"
                      y="-26"
                      width={120 + ((i * 15) % 50)}
                      height="12"
                      fill="rgba(44,26,14,0.65)"
                      rx="2"
                    />
                    <rect
                      x="75"
                      y="-8"
                      width={80 + ((i * 20) % 40)}
                      height="7"
                      fill="rgba(44,26,14,0.3)"
                      rx="2"
                    />
                    <rect x="300" y="-24" width="60" height="12" fill="#C8862C" rx="2" />
                  </g>
                ))}
              </svg>

              {/* Floating Verified Stamp Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-warm-gold/40 rounded-lg px-4 py-2.5 shadow-lg flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-verdant-green/15 flex items-center justify-center text-verdant-green">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-mahogany font-data">{t.hero.auditVerified}</p>
                  <p className="text-[10px] text-mahogany-muted">{t.hero.classARating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gold rule at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
      </section>

      {/* ─── Community Trust & Stats Ribbon ─── */}
      <section className="relative z-20 -mt-8 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-warm-gold/25 rounded-xl shadow-paper-md p-4 sm:p-6 lg:p-7 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-warm-gold/15 flex items-center justify-center text-warm-gold shrink-0">
              <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-data font-bold text-dark-mahogany">
                {t.stats.yearsVal}
              </p>
              <p className="text-[11px] sm:text-xs text-mahogany-muted font-body">{t.stats.yearsLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-verdant-green/15 flex items-center justify-center text-verdant-green shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-data font-bold text-dark-mahogany">
                {t.stats.membersVal}
              </p>
              <p className="text-[11px] sm:text-xs text-mahogany-muted font-body">{t.stats.membersLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-warm-gold/15 flex items-center justify-center text-warm-gold shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-data font-bold text-dark-mahogany">
                {t.stats.disbursedVal}
              </p>
              <p className="text-[11px] sm:text-xs text-mahogany-muted font-body">{t.stats.disbursedLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-verdant-green/15 flex items-center justify-center text-verdant-green shrink-0">
              <Award className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1">
                <p className="text-xl sm:text-2xl lg:text-3xl font-data font-bold text-dark-mahogany">
                  {t.stats.auditVal}
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-verdant-green text-white">
                  {t.stats.auditBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-mahogany-muted font-body">{t.stats.auditLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Grid ─── */}
      <section className="max-w-content mx-auto px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: About & Notices (7 Cols) */}
        <div className="lg:col-span-7 space-y-16">
          {/* About Section */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-warm-gold">
                {t.about.tagline}
              </span>
              <h2 className="text-display-md font-display text-dark-mahogany mt-1">
                {t.about.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/70 border border-ledger-rule rounded-lg p-6 shadow-sm">
              <div className="space-y-2.5 font-data text-sm text-mahogany-muted border-b sm:border-b-0 sm:border-r border-ledger-rule pb-4 sm:pb-0 sm:pr-4">
                <p>
                  <span className="text-dark-mahogany font-medium">{t.about.regNo}</span> B/26456/1985
                </p>
                <p>
                  <span className="text-dark-mahogany font-medium">{t.about.founded}</span> 15 March 1985
                </p>
                <p>
                  <span className="text-dark-mahogany font-medium">{t.about.members}</span> 1,847
                </p>
                <p>
                  <span className="text-dark-mahogany font-medium">{t.about.auditor}</span> V.K. Shah & Co.
                </p>
              </div>
              <div className="text-body font-body text-dark-mahogany whitespace-pre-wrap leading-relaxed text-sm">
                {aboutText}
              </div>
            </div>
          </div>

          {/* Notices Section */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-warm-gold">
                  {t.notices.tagline}
                </span>
                <h2 className="text-display-md font-display text-dark-mahogany mt-1">
                  {t.notices.title}
                </h2>
              </div>
              <Link
                to="/notices"
                className="text-warm-gold hover:text-warm-gold-hover font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm mb-1 inline-flex items-center gap-1"
              >
                {t.notices.viewAll} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="border border-ledger-rule rounded-xl bg-white overflow-hidden shadow-paper">
              {isLoadingNotices ? (
                <div className="p-8 text-center text-mahogany-muted font-body animate-pulse">
                  {t.notices.loading}
                </div>
              ) : recentNotices.length === 0 ? (
                <div className="p-8 text-center text-mahogany-muted font-body">
                  {t.notices.empty}
                </div>
              ) : (
                recentNotices.map((notice: any, index: number) => (
                  <LedgerRow
                    key={notice.id}
                    stamped={index % 2 === 0}
                    title={notice.title}
                    badge={
                      notice.category?.toLowerCase() === 'agm' ? (
                        <Badge variant="agm">AGM</Badge>
                      ) : notice.priority === 'HIGH' ? (
                        <Badge variant="urgent">Important</Badge>
                      ) : notice.category ? (
                        <Badge variant="general">{notice.category}</Badge>
                      ) : undefined
                    }
                    date={
                      notice.createdAt ? format(new Date(notice.createdAt), 'dd MMM yyyy') : ''
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upgraded Interactive EMI Calculator (5 Cols) */}
        <div className="lg:col-span-5">
          <Card padding="lg" className="sticky top-28 border-warm-gold/25 shadow-paper-md rounded-xl">
            <CardHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-md bg-warm-gold/15 flex items-center justify-center text-warm-gold">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{t.calculator.title}</CardTitle>
                </div>
                <span className="text-[11px] font-data bg-ivory text-mahogany-muted px-2 py-0.5 rounded border border-warm-gold/20">
                  {t.calculator.badge}
                </span>
              </div>
              <p className="text-body-sm text-mahogany-muted mt-1.5">
                {t.calculator.subtitle}
              </p>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-ledger-rule">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPrincipal(preset.p)
                      setMonths(preset.m)
                      setRate(preset.r)
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-ivory hover:bg-warm-gold/20 text-dark-mahogany font-medium border border-warm-gold/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm-gold"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 1. Loan Amount Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="range-loan-amount" className="text-sm font-semibold text-dark-mahogany">
                    {t.calculator.loanAmount}
                  </label>
                  <span className="font-data font-bold text-base text-dark-mahogany">
                    {formatINR(pNum)}
                  </span>
                </div>
                <input
                  id="range-loan-amount"
                  aria-label={t.calculator.loanAmount}
                  type="range"
                  min="25000"
                  max="2500000"
                  step="25000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full accent-warm-gold h-2 bg-ivory-dark rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-mahogany-muted font-data">
                  <span>₹25K</span>
                  <span>₹25 Lakh</span>
                </div>
              </div>

              {/* 2. Tenure & Interest Rate Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Tenure */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="range-tenure" className="text-sm font-semibold text-dark-mahogany">
                      {t.calculator.tenure}
                    </label>
                    <span className="font-data font-bold text-sm text-dark-mahogany">
                      {months}m
                    </span>
                  </div>
                  <input
                    id="range-tenure"
                    aria-label={t.calculator.tenure}
                    type="range"
                    min="6"
                    max="84"
                    step="6"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="w-full accent-warm-gold h-2 bg-ivory-dark rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-mahogany-muted font-data">
                    <span>6m</span>
                    <span>84m</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="range-interest-rate" className="text-sm font-semibold text-dark-mahogany">
                      {t.calculator.interestRate}
                    </label>
                    <span className="font-data font-bold text-sm text-dark-mahogany">
                      {rate}%
                    </span>
                  </div>
                  <input
                    id="range-interest-rate"
                    aria-label={t.calculator.interestRate}
                    type="range"
                    min="6"
                    max="15"
                    step="0.25"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full accent-warm-gold h-2 bg-ivory-dark rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-mahogany-muted font-data">
                    <span>6%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {/* 3. Monthly EMI Result Box */}
              <div className="p-5 bg-deep-saffron rounded-xl text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="h-16 w-16 text-warm-gold" />
                </div>
                <p className="text-ivory/85 text-xs font-semibold uppercase tracking-wider mb-1">
                  {t.calculator.estimatedMonthly}
                </p>
                <p className="text-3xl font-data font-bold text-warm-gold tracking-tight">
                  {formatINR(emi)}
                  <span className="text-sm text-ivory/70 font-normal">{t.calculator.perMonth}</span>
                </p>
              </div>

              {/* 4. Visual Ratio Breakdown Bar (Principal vs Interest) */}
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between text-xs font-body font-medium text-dark-mahogany">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-warm-gold inline-block" />
                    {t.calculator.principal}: {principalPercent}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-dark-mahogany inline-block" />
                    {t.calculator.interest}: {interestPercent}%
                  </span>
                </div>

                {/* The Two-Tone Bar */}
                <div className="h-3 w-full bg-ivory-dark rounded-full overflow-hidden flex border border-ledger-rule">
                  <div
                    style={{ width: `${principalPercent}%` }}
                    className="bg-warm-gold transition-all duration-300 ease-out"
                    title={`${t.calculator.principal}: ${formatINR(pNum)}`}
                  />
                  <div
                    style={{ width: `${interestPercent}%` }}
                    className="bg-dark-mahogany transition-all duration-300 ease-out"
                    title={`${t.calculator.interest}: ${formatINR(totalInterest)}`}
                  />
                </div>

                {/* Repayment Summary */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ledger-rule text-xs font-data">
                  <div className="p-2.5 rounded bg-ivory/60 border border-ledger-rule">
                    <p className="text-mahogany-muted">{t.calculator.totalInterest}</p>
                    <p className="font-bold text-dark-mahogany text-sm mt-0.5">{formatINR(totalInterest)}</p>
                  </div>
                  <div className="p-2.5 rounded bg-ivory/60 border border-ledger-rule">
                    <p className="text-mahogany-muted">{t.calculator.totalPayable}</p>
                    <p className="font-bold text-dark-mahogany text-sm mt-0.5">{formatINR(totalAmount)}</p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-center text-mahogany-muted flex items-center justify-center gap-1">
                <Info className="h-3 w-3 shrink-0" />
                <span>{t.calculator.disclaimer}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
