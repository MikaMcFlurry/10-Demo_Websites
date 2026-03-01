'use client'

import Link from 'next/link'
import { Zap, Check, X, ChevronDown, ChevronUp, ArrowRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// ─── Plan data ────────────────────────────────────────────────────────────────

interface Plan {
  name: string
  price: string
  period: string
  description: string
  featured: boolean
  cta: string
  features: string[]
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small teams getting started with product analytics.',
    featured: false,
    cta: 'Start free trial',
    features: [
      '5 team members',
      '1M events / month',
      '90-day data retention',
      'Basic reports',
      'CSV export',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/month',
    description: 'For growing teams that need advanced analytics and automation.',
    featured: true,
    cta: 'Start free trial',
    features: [
      '25 team members',
      '10M events / month',
      '1-year data retention',
      'All reports + cohorts',
      'Funnel & retention analysis',
      'Slack alerts',
      'Priority support',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations with advanced needs.',
    featured: false,
    cta: 'Contact sales',
    features: [
      'Unlimited team members',
      'Unlimited events',
      'Custom data retention',
      'Custom integrations',
      'SSO / SAML',
      'Dedicated CSM',
      'SLA guarantee',
      'On-premise option',
    ],
  },
]

// ─── Feature comparison table ─────────────────────────────────────────────────

interface ComparisonRow {
  feature: string
  starter: boolean | string
  growth: boolean | string
  enterprise: boolean | string
}

const COMPARISON: ComparisonRow[] = [
  { feature: 'Team members', starter: '5', growth: '25', enterprise: 'Unlimited' },
  { feature: 'Events / month', starter: '1M', growth: '10M', enterprise: 'Unlimited' },
  { feature: 'Data retention', starter: '90 days', growth: '1 year', enterprise: 'Custom' },
  { feature: 'Basic reports', starter: true, growth: true, enterprise: true },
  { feature: 'Funnel analysis', starter: false, growth: true, enterprise: true },
  { feature: 'Cohort analysis', starter: false, growth: true, enterprise: true },
  { feature: 'Retention heatmap', starter: false, growth: true, enterprise: true },
  { feature: 'Revenue attribution', starter: false, growth: true, enterprise: true },
  { feature: 'Custom reports', starter: false, growth: true, enterprise: true },
  { feature: 'CSV export', starter: true, growth: true, enterprise: true },
  { feature: 'API access', starter: false, growth: true, enterprise: true },
  { feature: 'Slack alerts', starter: false, growth: true, enterprise: true },
  { feature: 'Webhook alerts', starter: false, growth: false, enterprise: true },
  { feature: 'SSO / SAML', starter: false, growth: false, enterprise: true },
  { feature: 'Custom integrations', starter: false, growth: false, enterprise: true },
  { feature: 'Dedicated CSM', starter: false, growth: false, enterprise: true },
  { feature: 'SLA guarantee', starter: false, growth: false, enterprise: true },
  { feature: 'Audit log', starter: false, growth: true, enterprise: true },
  { feature: 'Priority support', starter: false, growth: true, enterprise: true },
  { feature: 'Email support', starter: true, growth: true, enterprise: true },
]

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: 'Is there a free trial?',
    answer:
      'Yes — all plans include a 14-day free trial with no credit card required. You can explore every feature before committing.',
  },
  {
    question: 'What counts as an "event"?',
    answer:
      'An event is any tracked user action sent to AuroraMetrics — page views, button clicks, feature interactions, API calls, etc. Each distinct action counts as one event.',
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      'Yes, we offer 20% off for annual subscriptions on Starter and Growth plans. Contact sales for custom Enterprise pricing.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check size={16} className="text-good mx-auto" />
    ) : (
      <Minus size={14} className="text-muted/40 mx-auto" />
    )
  }
  return <span className="text-xs font-medium text-am-text">{value}</span>
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-am-text hover:bg-surface-2 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp size={15} className="text-muted flex-shrink-0 ml-3" />
        ) : (
          <ChevronDown size={15} className="text-muted flex-shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-border bg-surface-2">
          <p className="pt-3">{answer}</p>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-am-text">
      {/* Gradient background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 15% 10%, rgba(33,212,253,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 85% 90%, rgba(183,33,255,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center shadow-sm">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-am-text">AuroraMetrics</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted hover:text-am-text transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Get started
              <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="text-center py-20 px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent1/10 border border-accent1/20 rounded-full text-xs font-medium text-accent1 mb-6">
            <span className="w-1.5 h-1.5 bg-accent1 rounded-full animate-pulse" />
            14-day free trial on all plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-am-text tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
            No hidden fees. No surprise overages. Just powerful analytics that scales with your team.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="px-6 pb-20" aria-label="Pricing plans">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-2xl border p-7 flex flex-col gap-6 transition-all',
                  plan.featured
                    ? 'bg-surface border-accent1/50 shadow-xl shadow-accent1/10 ring-1 ring-accent1/20 relative md:-mt-4 md:pb-11'
                    : 'bg-surface border-border'
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-accent1 text-bg text-xs font-bold rounded-full shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-base font-bold text-am-text mb-1">{plan.name}</h2>
                  <p className="text-xs text-muted leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      'text-4xl font-bold tracking-tight',
                      plan.featured ? 'text-accent1' : 'text-am-text'
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={14}
                        className={cn(
                          'flex-shrink-0 mt-0.5',
                          plan.featured ? 'text-accent1' : 'text-good'
                        )}
                      />
                      <span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                    plan.featured
                      ? 'bg-accent1 text-bg hover:brightness-110 shadow-lg shadow-accent1/25'
                      : 'bg-surface-2 text-am-text border border-border hover:border-accent1/50 hover:bg-accent1/5'
                  )}
                >
                  {plan.cta}
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="px-6 pb-20" aria-label="Feature comparison">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-am-text text-center mb-3">Compare plans</h2>
            <p className="text-sm text-muted text-center mb-10">See exactly what's included at each tier.</p>

            <div className="border border-border rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 bg-surface-2 border-b border-border">
                <div className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Feature</div>
                {['Starter', 'Growth', 'Enterprise'].map((plan, i) => (
                  <div
                    key={plan}
                    className={cn(
                      'px-4 py-4 text-center text-xs font-bold uppercase tracking-wider',
                      i === 1 ? 'text-accent1' : 'text-am-text'
                    )}
                  >
                    {plan}
                    {i === 1 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-accent1/15 text-accent1 text-[9px] font-bold rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {COMPARISON.map((row, i) => (
                <div
                  key={row.feature}
                  className={cn(
                    'grid grid-cols-4 border-b border-border last:border-0',
                    i % 2 === 0 ? 'bg-surface' : 'bg-surface/50'
                  )}
                >
                  <div className="px-5 py-3.5 text-sm text-muted">{row.feature}</div>
                  <div className="px-4 py-3.5 text-center flex items-center justify-center">
                    <ComparisonCell value={row.starter} />
                  </div>
                  <div className="px-4 py-3.5 text-center flex items-center justify-center bg-accent1/3">
                    <ComparisonCell value={row.growth} />
                  </div>
                  <div className="px-4 py-3.5 text-center flex items-center justify-center">
                    <ComparisonCell value={row.enterprise} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 pb-20" aria-label="Frequently asked questions">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-am-text text-center mb-3">Frequently asked questions</h2>
            <p className="text-sm text-muted text-center mb-10">Still have questions? We&apos;re happy to help.</p>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="px-6 pb-24" aria-label="Call to action">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="rounded-2xl border border-border p-10"
              style={{
                background: 'linear-gradient(135deg, rgba(33,212,253,0.06) 0%, rgba(183,33,255,0.06) 100%)',
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent1/20">
                <Zap size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-am-text mb-3">Start your free trial today</h2>
              <p className="text-sm text-muted mb-7 leading-relaxed">
                14 days, no credit card required. Set up in minutes and start making data-driven decisions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent1 text-bg text-sm font-semibold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent1/25"
                >
                  Start free trial
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border text-am-text text-sm font-medium rounded-xl hover:border-accent1/50 hover:bg-accent1/5 transition-all"
                >
                  Sign in to existing account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center">
            <Zap size={10} className="text-white" />
          </div>
          <span className="text-sm font-bold text-am-text">AuroraMetrics</span>
        </div>
        <p className="text-xs text-muted">
          © 2025 AuroraMetrics, Inc. All rights reserved.{' '}
          <Link href="/login" className="hover:text-am-text transition-colors underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </footer>
    </div>
  )
}
