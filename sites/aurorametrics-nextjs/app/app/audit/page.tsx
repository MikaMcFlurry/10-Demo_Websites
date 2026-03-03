'use client'

import { useState, useMemo } from 'react'
import {
  Shield, Download, Search, LogIn, LogOut, FileText, Bell,
  Settings, Users, Database, Globe, ChevronLeft, ChevronRight, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AUDIT_LOG } from '@/data/audit'
import type { AuditEntry, AuditAction } from '@/data/types'
import { formatDateTime, timeAgo, exportToCSV } from '@/lib/utils'

// ─── Action categorisation ────────────────────────────────────────────────────

type ActionCategory = 'user' | 'report' | 'alert' | 'settings' | 'integration' | 'data' | 'workspace'

function getActionCategory(action: AuditAction): ActionCategory {
  if (action.startsWith('user.')) return 'user'
  if (action.startsWith('report.')) return 'report'
  if (action.startsWith('alert.')) return 'alert'
  if (action.startsWith('settings.')) return 'settings'
  if (action.startsWith('integration.')) return 'integration'
  if (action.startsWith('data.')) return 'data'
  if (action.startsWith('workspace.')) return 'workspace'
  return 'settings'
}

function actionCategoryConfig(cat: ActionCategory) {
  switch (cat) {
    case 'user':
      return { label: 'User', icon: Users, textClass: 'text-accent1', bgClass: 'bg-accent1/10', borderClass: 'border-accent1/20' }
    case 'report':
      return { label: 'Report', icon: FileText, textClass: 'text-accent2', bgClass: 'bg-accent2/10', borderClass: 'border-accent2/20' }
    case 'alert':
      return { label: 'Alert', icon: Bell, textClass: 'text-warn', bgClass: 'bg-warn/10', borderClass: 'border-warn/20' }
    case 'settings':
      return { label: 'Settings', icon: Settings, textClass: 'text-muted', bgClass: 'bg-surface-2', borderClass: 'border-border' }
    case 'integration':
      return { label: 'Integration', icon: Globe, textClass: 'text-good', bgClass: 'bg-good/10', borderClass: 'border-good/20' }
    case 'data':
      return { label: 'Data', icon: Database, textClass: 'text-bad', bgClass: 'bg-bad/10', borderClass: 'border-bad/20' }
    case 'workspace':
      return { label: 'Workspace', icon: Shield, textClass: 'text-warn', bgClass: 'bg-warn/10', borderClass: 'border-warn/20' }
  }
}

function formatAction(action: AuditAction): string {
  const map: Record<AuditAction, string> = {
    'user.login': 'User logged in',
    'user.logout': 'User logged out',
    'user.invite': 'User invited',
    'user.role_change': 'Role changed',
    'user.deactivate': 'User deactivated',
    'report.create': 'Report created',
    'report.edit': 'Report edited',
    'report.delete': 'Report deleted',
    'report.export': 'Report exported',
    'alert.create': 'Alert rule created',
    'alert.edit': 'Alert rule edited',
    'alert.delete': 'Alert rule deleted',
    'alert.toggle': 'Alert rule toggled',
    'settings.update': 'Settings updated',
    'integration.connect': 'Integration connected',
    'integration.disconnect': 'Integration disconnected',
    'data.export': 'Data exported',
    'workspace.update': 'Workspace updated',
  }
  return map[action] ?? action
}

const ACTION_ICON_MAP: Record<string, React.ElementType> = {
  'user.login': LogIn,
  'user.logout': LogOut,
  'user.invite': Users,
  'user.role_change': Shield,
  'user.deactivate': Users,
  'report.create': FileText,
  'report.edit': FileText,
  'report.delete': FileText,
  'report.export': Download,
  'alert.create': Bell,
  'alert.edit': Bell,
  'alert.delete': Bell,
  'alert.toggle': Bell,
  'settings.update': Settings,
  'integration.connect': Globe,
  'integration.disconnect': Globe,
  'data.export': Database,
  'workspace.update': Shield,
}

const PAGE_SIZE = 20

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ActionCategory | 'all'>('all')
  const [page, setPage] = useState(1)

  const categories: Array<{ key: ActionCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'user', label: 'User' },
    { key: 'report', label: 'Report' },
    { key: 'alert', label: 'Alert' },
    { key: 'settings', label: 'Settings' },
    { key: 'integration', label: 'Integration' },
    { key: 'data', label: 'Data' },
    { key: 'workspace', label: 'Workspace' },
  ]

  const filtered = useMemo(() => {
    let entries = [...AUDIT_LOG]
    // Sort newest first
    entries = entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (categoryFilter !== 'all') {
      entries = entries.filter((e) => getActionCategory(e.action) === categoryFilter)
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      entries = entries.filter(
        (e) =>
          e.userName.toLowerCase().includes(q) ||
          e.userEmail.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          e.resource.toLowerCase().includes(q) ||
          e.ipAddress.includes(q)
      )
    }

    return entries
  }, [query, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleExport = () => {
    const exportCols = [
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'userName', label: 'User' },
      { key: 'userEmail', label: 'Email' },
      { key: 'action', label: 'Action' },
      { key: 'resource', label: 'Resource' },
      { key: 'details', label: 'Details' },
      { key: 'ipAddress', label: 'IP Address' },
    ]
    exportToCSV(
      AUDIT_LOG as unknown as Record<string, string | number>[],
      exportCols,
      'audit_log.csv'
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-am-text">Audit Log</h1>
          <p className="text-sm text-muted mt-0.5">Complete record of all actions taken in your workspace</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border text-am-text text-sm font-medium rounded-lg hover:border-accent1/50 hover:text-accent1 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: AUDIT_LOG.length, color: 'text-am-text' },
          { label: 'Unique Users', value: Array.from(new Set(AUDIT_LOG.map((e) => e.userId))).length, color: 'text-accent1' },
          { label: 'Today', value: AUDIT_LOG.filter((e) => e.timestamp.startsWith('2025-07-15')).length, color: 'text-good' },
          { label: 'This Week', value: AUDIT_LOG.filter((e) => new Date(e.timestamp) >= new Date('2025-07-09')).length, color: 'text-muted' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl px-4 py-3">
            <div className="text-xs text-muted mb-1">{s.label}</div>
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search by user, action, details…"
            className="w-full bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <Filter size={13} className="text-muted mr-1" />
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => { setCategoryFilter(c.key); setPage(1) }}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                categoryFilter === c.key
                  ? 'bg-accent1 text-bg'
                  : 'bg-surface border border-border text-muted hover:text-am-text'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <section aria-label="Audit log entries">
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-surface-2 border-b border-border px-4 py-3 hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">User</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-1">Resource</div>
            <div className="col-span-3">Details</div>
            <div className="col-span-2">IP Address</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border bg-surface">
            {paged.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted">No audit entries match your filter.</div>
            ) : (
              paged.map((entry: AuditEntry) => {
                const cat = getActionCategory(entry.action)
                const catConf = actionCategoryConfig(cat)
                const ActionIconComp = ACTION_ICON_MAP[entry.action] ?? Shield

                return (
                  <div
                    key={entry.id}
                    className="px-4 py-3 hover:bg-surface-2/40 transition-colors"
                  >
                    {/* Mobile layout */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', catConf.bgClass)}>
                            <ActionIconComp size={11} className={catConf.textClass} />
                          </div>
                          <span className="text-sm font-medium text-am-text">{formatAction(entry.action)}</span>
                        </div>
                        <span className="text-xs text-muted flex-shrink-0">{timeAgo(entry.timestamp)}</span>
                      </div>
                      <div className="text-xs text-muted pl-8">{entry.details}</div>
                      <div className="flex items-center gap-3 pl-8 text-xs text-muted">
                        <span>{entry.userName}</span>
                        <span>·</span>
                        <span>{entry.ipAddress}</span>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-12 gap-2 items-start">
                      {/* Time */}
                      <div className="col-span-2">
                        <div className="text-xs text-am-text font-medium">{timeAgo(entry.timestamp)}</div>
                        <div className="text-[10px] text-muted mt-0.5">{formatDateTime(entry.timestamp)}</div>
                      </div>

                      {/* User */}
                      <div className="col-span-2 min-w-0">
                        <div className="text-xs font-medium text-am-text truncate">{entry.userName}</div>
                        <div className="text-[10px] text-muted truncate">{entry.userEmail}</div>
                      </div>

                      {/* Action */}
                      <div className="col-span-2">
                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-md text-xs font-medium', catConf.bgClass, catConf.textClass, catConf.borderClass)}>
                          <ActionIconComp size={10} />
                          {formatAction(entry.action)}
                        </span>
                      </div>

                      {/* Resource */}
                      <div className="col-span-1">
                        <span className="text-xs text-muted">{entry.resource}</span>
                      </div>

                      {/* Details */}
                      <div className="col-span-3">
                        <span className="text-xs text-muted leading-relaxed line-clamp-2">{entry.details}</span>
                      </div>

                      {/* IP */}
                      <div className="col-span-2">
                        <span className="text-xs font-mono text-muted">{entry.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-border bg-surface flex items-center justify-between">
            <span className="text-xs text-muted">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="p-1.5 rounded text-muted hover:text-am-text disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1
                if (totalPages > 5) {
                  if (page <= 3) p = i + 1
                  else if (page >= totalPages - 2) p = totalPages - 4 + i
                  else p = page - 2 + i
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-7 h-7 rounded text-xs font-medium transition-colors',
                      page === p ? 'bg-accent1 text-bg' : 'text-muted hover:text-am-text'
                    )}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="p-1.5 rounded text-muted hover:text-am-text disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
