// ─── User & Auth Types ───────────────────────────────────────────────────────

export type Role = 'admin' | 'analyst' | 'viewer'

export interface Permission {
  id: string
  name: string
  description: string
  category: 'data' | 'admin' | 'reports' | 'alerts'
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  avatar: string
  title: string
  status?: 'active' | 'inactive'
  lastActive?: string
  createdAt?: string
}

// ─── Workspace ───────────────────────────────────────────────────────────────

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: 'starter' | 'growth' | 'enterprise'
  timezone: string
  dataRetentionDays: number
  createdAt: string
  memberCount: number
}

// ─── Metrics & Time Series ───────────────────────────────────────────────────

export interface MetricPoint {
  date: string
  value: number
}

export interface MetricSeries {
  id: string
  name: string
  unit: 'number' | 'currency' | 'percent'
  data: MetricPoint[]
  currentValue: number
  previousValue: number
  delta: number
  deltaPercent: number
  trend: 'up' | 'down' | 'neutral'
}

// ─── Feature Events ───────────────────────────────────────────────────────────

export interface FeatureEvent {
  id: string
  name: string
  description: string
  count: number
  uniqueUsers: number
  timestamp: string
  category: 'engagement' | 'activation' | 'retention' | 'revenue'
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export type ReportType = 'funnel' | 'cohort' | 'retention' | 'revenue' | 'engagement' | 'custom'

export interface ReportColumn {
  key: string
  label: string
  type: 'string' | 'number' | 'currency' | 'percent' | 'date'
}

export interface ReportRow {
  [key: string]: string | number
}

export interface Report {
  id: string
  name: string
  description: string
  type: ReportType
  createdBy: string
  createdAt: string
  lastRun: string
  schedule?: 'daily' | 'weekly' | 'monthly' | null
  columns: ReportColumn[]
  rows: ReportRow[]
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertChannel = 'email' | 'slack' | 'webhook'
export type AlertCondition = 'above' | 'below' | 'equals' | 'change_percent'

export interface AlertRule {
  id: string
  name: string
  metric: string
  condition: AlertCondition
  threshold: number
  thresholdUnit: 'number' | 'currency' | 'percent'
  channel: AlertChannel
  severity: AlertSeverity
  enabled: boolean
  createdAt: string
  lastTriggered?: string
}

export interface AlertNotification {
  id: string
  ruleId: string
  ruleName: string
  severity: AlertSeverity
  title: string
  description: string
  timestamp: string
  read: boolean
  value?: number
  threshold?: number
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.invite'
  | 'user.role_change'
  | 'user.deactivate'
  | 'report.create'
  | 'report.edit'
  | 'report.delete'
  | 'report.export'
  | 'alert.create'
  | 'alert.edit'
  | 'alert.delete'
  | 'alert.toggle'
  | 'settings.update'
  | 'integration.connect'
  | 'integration.disconnect'
  | 'data.export'
  | 'workspace.update'

export interface AuditEntry {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: AuditAction
  resource: string
  resourceId?: string
  details: string
  ipAddress: string
  userAgent?: string
  timestamp: string
}
