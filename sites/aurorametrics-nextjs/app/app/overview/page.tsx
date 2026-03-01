'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Calendar, Users, CreditCard, Clock, Star, Activity } from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import OnboardingWizard from '@/components/OnboardingWizard'
import { DAU_SERIES, MRR_SERIES, ACTIVATION_SERIES, CHURN_SERIES, FEATURE_EVENTS, QUICK_STATS } from '@/data/metrics'
import { formatNumber, formatCurrency, formatPercent, formatDate, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

type DateRange = '7d' | '30d' | '90d'

const DATE_RANGES: { key: DateRange; label: string; days: number }[] = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '90d', label: 'Last 90 days', days: 90 },
]

type ChartMetric = 'mrr' | 'dau'

const CATEGORY_COLORS: Record<string, string> = {
  engagement: '#21D4FD',
  activation: '#2DFFB3',
  retention: '#B721FF',
  revenue: '#FFB020',
}

function CustomAreaTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-muted mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-am-text font-medium">
            {p.name === 'mrr' ? formatCurrency(p.value) : formatNumber(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function OverviewPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [chartMetric, setChartMetric] = useState<ChartMetric>('mrr')
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem('aurora_onboarding_done')
    if (!done) setShowOnboarding(true)
  }, [])

  const range = DATE_RANGES.find((r) => r.key === dateRange)!

  // Slice data to selected range
  const dauData = DAU_SERIES.data.slice(-range.days)
  const mrrData = MRR_SERIES.data.slice(-range.days)

  // Build sparkline arrays (last 20 points)
  const dauSparkline = DAU_SERIES.data.slice(-20).map((d) => ({ value: d.value }))
  const mrrSparkline = MRR_SERIES.data.slice(-20).map((d) => ({ value: d.value }))
  const activationSparkline = ACTIVATION_SERIES.data.slice(-20).map((d) => ({ value: d.value }))
  const churnSparkline = CHURN_SERIES.data.slice(-20).map((d) => ({ value: d.value }))

  // Chart data: merge DAU and MRR
  const chartData = chartMetric === 'mrr'
    ? mrrData.map((pt) => ({ date: formatDate(pt.date, 'short'), mrr: pt.value }))
    : dauData.map((pt) => ({ date: formatDate(pt.date, 'short'), dau: pt.value }))

  return (
    <>
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Page header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-am-text">Overview</h1>
            <p className="text-sm text-muted mt-0.5">Your key metrics at a glance</p>
          </div>
          {/* Date range selector */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            <Calendar size={13} className="text-muted ml-2" />
            {DATE_RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setDateRange(r.key)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-all',
                  dateRange === r.key ? 'bg-accent1 text-bg' : 'text-muted hover:text-am-text'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </header>

        {/* KPI Cards */}
        <section aria-label="Key performance indicators">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Daily Active Users"
              value={formatNumber(DAU_SERIES.currentValue)}
              delta={DAU_SERIES.deltaPercent}
              deltaLabel="vs previous 30d"
              trend="good"
              data={dauSparkline}
            />
            <KpiCard
              title="Monthly Recurring Revenue"
              value={formatCurrency(MRR_SERIES.currentValue, { compact: true })}
              delta={MRR_SERIES.deltaPercent}
              deltaLabel="vs previous 30d"
              trend="good"
              data={mrrSparkline}
            />
            <KpiCard
              title="Activation Rate"
              value={formatPercent(ACTIVATION_SERIES.currentValue)}
              delta={ACTIVATION_SERIES.deltaPercent}
              deltaLabel="vs previous 30d"
              trend="good"
              data={activationSparkline}
            />
            <KpiCard
              title="Churn Rate"
              value={formatPercent(CHURN_SERIES.currentValue)}
              delta={Math.abs(CHURN_SERIES.deltaPercent)}
              deltaLabel="improvement vs prev 30d"
              trend="good"
              data={churnSparkline}
            />
          </div>
        </section>

        {/* Main chart */}
        <section aria-label="Revenue and engagement chart" className="bg-surface border border-border rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-sm font-semibold text-am-text">
              {chartMetric === 'mrr' ? 'Monthly Recurring Revenue' : 'Daily Active Users'} — {range.label}
            </h2>
            <div className="flex items-center gap-1 bg-surface-2 border border-border rounded-lg p-1">
              <button
                onClick={() => setChartMetric('mrr')}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-all',
                  chartMetric === 'mrr' ? 'bg-accent1 text-bg' : 'text-muted hover:text-am-text'
                )}
              >
                MRR
              </button>
              <button
                onClick={() => setChartMetric('dau')}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-all',
                  chartMetric === 'dau' ? 'bg-accent1 text-bg' : 'text-muted hover:text-am-text'
                )}
              >
                DAU
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="gradMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21D4FD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#21D4FD" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DFFB3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2DFFB3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#223058" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#A9B3D6' }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(chartData.length / 5)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#A9B3D6' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    chartMetric === 'mrr' ? formatCurrency(v, { compact: true }) : formatNumber(v, { compact: true })
                  }
                  width={60}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                {chartMetric === 'mrr' ? (
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="#21D4FD"
                    strokeWidth={2}
                    fill="url(#gradMrr)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#21D4FD' }}
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="dau"
                    stroke="#2DFFB3"
                    strokeWidth={2}
                    fill="url(#gradDau)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#2DFFB3' }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Bottom grid: Quick Stats + Events */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Quick stats */}
          <section aria-label="Quick statistics" className="xl:col-span-2 bg-surface border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-am-text mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-2 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-accent1" />
                  <span className="text-xs text-muted">Total Users</span>
                </div>
                <div className="text-xl font-bold text-am-text">{formatNumber(QUICK_STATS.totalUsers, { compact: true })}</div>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={14} className="text-good" />
                  <span className="text-xs text-muted">Paid Accounts</span>
                </div>
                <div className="text-xl font-bold text-am-text">{formatNumber(QUICK_STATS.paidAccounts, { compact: true })}</div>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-warn" />
                  <span className="text-xs text-muted">Avg Session</span>
                </div>
                <div className="text-xl font-bold text-am-text">{QUICK_STATS.avgSessionTime}</div>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-accent2" />
                  <span className="text-xs text-muted">NPS Score</span>
                </div>
                <div className="text-xl font-bold text-am-text">{QUICK_STATS.npsScore}</div>
              </div>
            </div>
          </section>

          {/* Recent events */}
          <section aria-label="Recent feature events" className="xl:col-span-3 bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-am-text">Recent Feature Events</h2>
              <Activity size={14} className="text-muted" />
            </div>
            <ul className="space-y-2">
              {FEATURE_EVENTS.map((event) => (
                <li key={event.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CATEGORY_COLORS[event.category] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-am-text truncate">{event.name}</span>
                      <span className="text-xs text-muted flex-shrink-0">{timeAgo(event.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted">{formatNumber(event.count)} events</span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted">{formatNumber(event.uniqueUsers)} users</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
