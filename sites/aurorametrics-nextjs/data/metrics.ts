import type { MetricSeries, FeatureEvent } from './types'

// ─── Helper: generate 90 days of dates ending today ──────────────────────────

function datesFor90Days(): string[] {
  const dates: string[] = []
  const end = new Date('2025-07-15')
  for (let i = 89; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

const DATES = datesFor90Days()

// ─── Daily Active Users (trending up ~18%, peak ~12,400) ─────────────────────

function dauValue(i: number): number {
  const base = 9800
  const trend = i * 28.5
  const weekly = Math.sin((i / 7) * 2 * Math.PI) * 320
  const noise = (Math.sin(i * 1.7) * 180) + (Math.cos(i * 3.1) * 90)
  return Math.round(base + trend + weekly + noise)
}

export const DAU_SERIES: MetricSeries = {
  id: 'dau',
  name: 'Daily Active Users',
  unit: 'number',
  data: DATES.map((date, i) => ({ date, value: dauValue(i) })),
  currentValue: dauValue(89),
  previousValue: dauValue(61),
  delta: dauValue(89) - dauValue(61),
  deltaPercent: Number((((dauValue(89) - dauValue(61)) / dauValue(61)) * 100).toFixed(1)),
  trend: 'up',
}

// ─── Monthly Recurring Revenue (peak ~$284,000) ───────────────────────────────

function mrrValue(i: number): number {
  const base = 218000
  const trend = i * 730
  const noise = Math.sin(i * 2.3) * 4200 + Math.cos(i * 1.1) * 2100
  return Math.round(base + trend + noise)
}

export const MRR_SERIES: MetricSeries = {
  id: 'mrr',
  name: 'Monthly Recurring Revenue',
  unit: 'currency',
  data: DATES.map((date, i) => ({ date, value: mrrValue(i) })),
  currentValue: mrrValue(89),
  previousValue: mrrValue(61),
  delta: mrrValue(89) - mrrValue(61),
  deltaPercent: Number((((mrrValue(89) - mrrValue(61)) / mrrValue(61)) * 100).toFixed(1)),
  trend: 'up',
}

// ─── Activation Rate (peak ~67.3%) ────────────────────────────────────────────

function activationValue(i: number): number {
  const base = 54.2
  const trend = i * 0.145
  const noise = Math.sin(i * 1.9) * 2.1 + Math.cos(i * 3.7) * 1.3
  return Math.min(72, Math.round((base + trend + noise) * 10) / 10)
}

export const ACTIVATION_SERIES: MetricSeries = {
  id: 'activation',
  name: 'Activation Rate',
  unit: 'percent',
  data: DATES.map((date, i) => ({ date, value: activationValue(i) })),
  currentValue: activationValue(89),
  previousValue: activationValue(61),
  delta: Number((activationValue(89) - activationValue(61)).toFixed(1)),
  deltaPercent: Number((((activationValue(89) - activationValue(61)) / activationValue(61)) * 100).toFixed(1)),
  trend: 'up',
}

// ─── Churn Rate (low ~2.1%) ───────────────────────────────────────────────────

function churnValue(i: number): number {
  const base = 2.8
  const trend = -i * 0.008
  const noise = Math.sin(i * 2.5) * 0.25 + Math.cos(i * 1.4) * 0.15
  return Math.max(1.4, Math.round((base + trend + noise) * 100) / 100)
}

export const CHURN_SERIES: MetricSeries = {
  id: 'churn',
  name: 'Churn Rate',
  unit: 'percent',
  data: DATES.map((date, i) => ({ date, value: churnValue(i) })),
  currentValue: churnValue(89),
  previousValue: churnValue(61),
  delta: Number((churnValue(89) - churnValue(61)).toFixed(2)),
  deltaPercent: Number((((churnValue(89) - churnValue(61)) / churnValue(61)) * 100).toFixed(1)),
  trend: 'down',
}

// ─── All Metric Series ────────────────────────────────────────────────────────

export const ALL_METRIC_SERIES: MetricSeries[] = [
  DAU_SERIES,
  MRR_SERIES,
  ACTIVATION_SERIES,
  CHURN_SERIES,
]

// ─── Feature Events ───────────────────────────────────────────────────────────

export const FEATURE_EVENTS: FeatureEvent[] = [
  {
    id: 'fe1',
    name: 'Dashboard Viewed',
    description: 'User opened the main analytics dashboard',
    count: 84320,
    uniqueUsers: 11240,
    timestamp: '2025-07-15T11:45:00Z',
    category: 'engagement',
  },
  {
    id: 'fe2',
    name: 'Report Created',
    description: 'User created a new custom report',
    count: 3841,
    uniqueUsers: 2190,
    timestamp: '2025-07-15T11:30:00Z',
    category: 'engagement',
  },
  {
    id: 'fe3',
    name: 'Alert Rule Configured',
    description: 'User set up a new alert rule with threshold',
    count: 1204,
    uniqueUsers: 890,
    timestamp: '2025-07-15T11:15:00Z',
    category: 'activation',
  },
  {
    id: 'fe4',
    name: 'CSV Export',
    description: 'User exported data to CSV file',
    count: 6723,
    uniqueUsers: 3410,
    timestamp: '2025-07-15T11:00:00Z',
    category: 'engagement',
  },
  {
    id: 'fe5',
    name: 'Team Member Invited',
    description: 'Admin invited a new team member',
    count: 412,
    uniqueUsers: 187,
    timestamp: '2025-07-15T10:45:00Z',
    category: 'activation',
  },
  {
    id: 'fe6',
    name: 'Cohort Analysis Opened',
    description: 'User navigated to cohort analysis view',
    count: 9821,
    uniqueUsers: 4502,
    timestamp: '2025-07-15T10:30:00Z',
    category: 'retention',
  },
  {
    id: 'fe7',
    name: 'Integration Connected',
    description: 'Workspace connected an external integration',
    count: 231,
    uniqueUsers: 145,
    timestamp: '2025-07-15T10:15:00Z',
    category: 'activation',
  },
  {
    id: 'fe8',
    name: 'Revenue Chart Toggled',
    description: 'User switched chart between MRR and DAU',
    count: 14530,
    uniqueUsers: 6210,
    timestamp: '2025-07-15T10:00:00Z',
    category: 'engagement',
  },
  {
    id: 'fe9',
    name: 'Upgrade Plan Clicked',
    description: 'User clicked upgrade plan button',
    count: 318,
    uniqueUsers: 289,
    timestamp: '2025-07-15T09:45:00Z',
    category: 'revenue',
  },
  {
    id: 'fe10',
    name: 'Audit Log Accessed',
    description: 'Admin accessed the audit log page',
    count: 892,
    uniqueUsers: 143,
    timestamp: '2025-07-15T09:30:00Z',
    category: 'engagement',
  },
]

// ─── Quick Stats ──────────────────────────────────────────────────────────────

export const QUICK_STATS = {
  totalUsers: 48720,
  paidAccounts: 1284,
  avgSessionTime: '7m 43s',
  npsScore: 62,
}
