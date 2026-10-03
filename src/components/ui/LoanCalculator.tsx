import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import { calculateEMI, formatINR } from '@/lib/utils'
import { Calculator, Info } from 'lucide-react'

export interface LoanCalculatorProps {
  className?: string
  initialPrincipal?: number
  initialMonths?: number
  initialRate?: number
}

export function LoanCalculator({
  className,
  initialPrincipal = 500000,
  initialMonths = 60,
  initialRate = 9.5,
}: LoanCalculatorProps) {
  const [principal, setPrincipal] = useState(String(initialPrincipal))
  const [months, setMonths] = useState(String(initialMonths))
  const [rate, setRate] = useState(String(initialRate))

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
    { label: 'Emergency Loan (₹50k)', p: '50000', m: '12', r: '9.5' },
    { label: 'Personal Loan (₹2 Lakh)', p: '200000', m: '36', r: '9.5' },
    { label: 'Business Expansion (₹10 Lakh)', p: '1000000', m: '60', r: '9.5' },
  ]

  return (
    <Card padding="none" className={className}>
      <CardHeader className="p-6 md:p-8 pb-4 border-b border-ledger-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5 text-deep-saffron" />
            Loan EMI Calculator
          </CardTitle>
          <p className="text-sm font-body text-mahogany-muted mt-1">
            Calculate your estimated monthly installment with transparent society interest rates.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setPrincipal(preset.p)
                setMonths(preset.m)
                setRate(preset.r)
              }}
              className="px-2.5 py-1 text-xs font-body font-medium rounded border border-ledger-rule bg-white hover:bg-warm-gold/10 hover:border-warm-gold text-dark-mahogany transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Principal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="loan-amount-slider" className="text-sm font-body font-medium text-dark-mahogany">
                  Loan Amount
                </label>
                <span className="font-mono text-base font-semibold text-dark-mahogany">
                  {formatINR(pNum)}
                </span>
              </div>
              <input
                id="loan-amount-slider"
                type="range"
                min="10000"
                max="2500000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full accent-deep-saffron cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-mahogany-muted mt-1">
                <span>₹10,000</span>
                <span>₹25,00,000</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="loan-tenure-slider" className="text-sm font-body font-medium text-dark-mahogany">
                  Tenure (Months)
                </label>
                <span className="font-mono text-base font-semibold text-dark-mahogany">
                  {months} Months ({Math.round((mNum / 12) * 10) / 10} Yrs)
                </span>
              </div>
              <input
                id="loan-tenure-slider"
                type="range"
                min="6"
                max="84"
                step="6"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full accent-deep-saffron cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-mahogany-muted mt-1">
                <span>6 Months</span>
                <span>84 Months (7 Yrs)</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="loan-rate-slider" className="text-sm font-body font-medium text-dark-mahogany">
                  Annual Interest Rate (% p.a.)
                </label>
                <span className="font-mono text-base font-semibold text-dark-mahogany">
                  {rate}%
                </span>
              </div>
              <input
                id="loan-rate-slider"
                type="range"
                min="7.0"
                max="18.0"
                step="0.25"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full accent-deep-saffron cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-mahogany-muted mt-1">
                <span>7.0%</span>
                <span>18.0%</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-ivory rounded-[6px] border border-ledger-rule p-6 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-xs font-body uppercase tracking-wider text-mahogany-muted mb-1">
                Monthly EMI Payable
              </p>
              <p className="font-mono text-3xl md:text-4xl font-bold text-deep-saffron">
                {formatINR(emi)}
              </p>
            </div>

            {/* Visual ratio bar */}
            <div>
              <div className="flex justify-between text-xs font-body text-mahogany-muted mb-1.5">
                <span>Principal ({principalPercent}%)</span>
                <span>Interest ({interestPercent}%)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-warm-gold/20 overflow-hidden flex">
                <div
                  className="bg-deep-saffron transition-all duration-300"
                  style={{ width: `${principalPercent}%` }}
                />
                <div
                  className="bg-warm-gold transition-all duration-300"
                  style={{ width: `${interestPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-ledger-rule text-sm">
              <div className="flex justify-between">
                <span className="text-mahogany-muted font-body">Principal Loan:</span>
                <span className="font-mono text-dark-mahogany">{formatINR(pNum)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mahogany-muted font-body">Total Interest:</span>
                <span className="font-mono text-dark-mahogany">{formatINR(totalInterest)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-dark-mahogany font-body">Total Payable:</span>
                <span className="font-mono text-dark-mahogany">{formatINR(totalAmount)}</span>
              </div>
            </div>

            <p className="text-[11px] text-mahogany-muted font-body flex items-center gap-1">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Estimates are illustrative. Society terms and sanction rules apply.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
