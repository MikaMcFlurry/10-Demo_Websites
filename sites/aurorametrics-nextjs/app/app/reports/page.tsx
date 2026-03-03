'use client'

import { useState } from 'react'
import {
  Plus, Play, Pencil, Trash2, ChevronRight, X, FileBarChart2,
  Calendar, User, RefreshCw, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { REPORTS } from '@/data/reports'
import type { Report, ReportType } from '@/data/types'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import { formatDateTime, formatDate, timeAgo } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function reportTypeConfig(type: ReportType) {
  switch (type) {
    case 'funnel':
      return { label: 'Funnel', bgClass: 'bg-accent1/10', textClass: 'text-accent1', borderClass: 'border-accent1/20' }
    case 'cohort':
      return { label: 'Cohort', bgClass: 'bg-accent2/10', textClass: 'text-accent2', borderClass: 'border-accent2/20' }
    case 'retention':
      return { label: 'Retention', bgClass: 'bg-good/10', textClass: 'text-good', borderClass: 'border-good/20' }
    case 'revenue':
      return { label: 'Revenue', bgClass: 'bg-warn/10', textClass: 'text-warn', borderClass: 'border-warn/20' }
    case 'engagement':
      return { label: 'Engagement', bgClass: 'bg-blue-400/10', textClass: 'text-blue-400', borderClass: 'border-blue-400/20' }
    case 'custom':
    default:
      return { label: 'Custom', bgClass: 'bg-surface-2', textClass: 'text-muted', borderClass: 'border-border' }
  }
}

function scheduleLabel(schedule: Report['schedule']) {
  if (!schedule) return null
  return schedule.charAt(0).toUpperCase() + schedule.slice(1)
}

// ─── Report detail drawer ─────────────────────────────────────────────────────

interface ReportDrawerProps {
  report: Report
  onClose: () => void
}

function ReportDrawer({ report, onClose }: ReportDrawerProps) {
  const typeConf = reportTypeConfig(report.type)

  // Build DataTable columns from report.columns
  const tableColumns: Column<Record<string, string | number>>[] = report.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type,
    sortable: true,
  }))

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative bg-surface border-l border-border w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-in-right">
        {/* Drawer header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', typeConf.bgClass)}>
              <FileBarChart2 size={16} className={typeConf.textClass} />
            </div>
            <div>
              <h2 className="text-base font-bold text-am-text">{report.name}</h2>
              <p className="text-xs text-muted mt-0.5 max-w-lg leading-relaxed">{report.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-am-text transition-colors rounded ml-4 flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Meta strip */}
        <div className="px-6 py-3 border-b border-border bg-surface-2 flex flex-wrap items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className={cn('px-2 py-0.5 border rounded-md font-medium', typeConf.bgClass, typeConf.textClass, typeConf.borderClass)}>
              {typeConf.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <User size={11} />
            <span>{report.createdBy}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar size={11} />
            <span>Created {formatDate(report.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock size={11} />
            <span>Last run {timeAgo(report.lastRun)}</span>
          </div>
          {report.schedule && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <RefreshCw size={11} />
              <span className="capitalize">{report.schedule}</span>
            </div>
          )}
        </div>

        {/* Data table */}
        <div className="flex-1 overflow-auto p-6">
          <DataTable
            columns={tableColumns}
            data={report.rows as Record<string, string | number>[]}
            pageSize={20}
            searchable={true}
            exportable={true}
            exportFilename={report.name.replace(/\s+/g, '_')}
          />
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 bg-surface flex-shrink-0">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
            <Play size={13} />
            Run Now
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border text-am-text text-sm font-medium rounded-lg hover:border-accent1/50 transition-colors">
            <Pencil size={13} />
            Edit Report
          </button>
          <button onClick={onClose} className="ml-auto px-4 py-2 text-sm text-muted hover:text-am-text transition-colors">
            Close
          </button>
        </div>
      </aside>

    </div>
  )
}

// ─── New Report modal (static UI) ─────────────────────────────────────────────

function NewReportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-am-text">New Report</h2>
          <button onClick={onClose} className="text-muted hover:text-am-text transition-colors p-1 rounded">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Report name</label>
            <input type="text" placeholder="e.g. Q3 Activation Funnel" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Description</label>
            <textarea rows={2} placeholder="Optional description…" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Report type</label>
              <select className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none">
                <option>funnel</option>
                <option>cohort</option>
                <option>retention</option>
                <option>revenue</option>
                <option>engagement</option>
                <option>custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Schedule</label>
              <select className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none">
                <option>— None —</option>
                <option>daily</option>
                <option>weekly</option>
                <option>monthly</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 bg-surface-2 border border-border text-am-text text-sm font-medium rounded-lg hover:bg-surface-2/80 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
            Create report
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [reports] = useState<Report[]>(REPORTS)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [filter, setFilter] = useState<ReportType | 'all'>('all')

  const filteredReports = filter === 'all' ? reports : reports.filter((r) => r.type === filter)

  const reportTypes: Array<{ key: ReportType | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'funnel', label: 'Funnel' },
    { key: 'cohort', label: 'Cohort' },
    { key: 'retention', label: 'Retention' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'custom', label: 'Custom' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-am-text">Reports</h1>
          <p className="text-sm text-muted mt-0.5">Build, schedule, and share analytics reports</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent1/20"
        >
          <Plus size={15} />
          New Report
        </button>
      </header>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: reports.length },
          { label: 'Scheduled', value: reports.filter((r) => r.schedule).length },
          { label: 'Run Today', value: reports.filter((r) => r.lastRun.startsWith('2025-07-15')).length },
          { label: 'Contributors', value: Array.from(new Set(reports.map((r) => r.createdBy))).length },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl px-4 py-3">
            <div className="text-xs text-muted mb-1">{s.label}</div>
            <div className="text-2xl font-bold text-am-text">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {reportTypes.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
              filter === t.key
                ? 'bg-accent1 text-bg'
                : 'bg-surface border border-border text-muted hover:text-am-text hover:border-accent1/30'
            )}
          >
            {t.label}
            {t.key !== 'all' && (
              <span className="ml-1 opacity-60">{reports.filter((r) => r.type === t.key).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Reports table */}
      <section aria-label="Reports list">
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="bg-surface-2 border-b border-border px-4 py-3 grid grid-cols-12 gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
            <div className="col-span-4">Report</div>
            <div className="col-span-1 hidden sm:block">Type</div>
            <div className="col-span-2 hidden md:block">Last Run</div>
            <div className="col-span-2 hidden lg:block">Schedule</div>
            <div className="col-span-2 hidden lg:block">Created by</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border bg-surface">
            {filteredReports.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted">No reports match this filter.</div>
            ) : (
              filteredReports.map((report) => {
                const typeConf = reportTypeConfig(report.type)
                const sched = scheduleLabel(report.schedule)
                return (
                  <div
                    key={report.id}
                    className="px-4 py-3.5 grid grid-cols-12 gap-2 items-center hover:bg-surface-2/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedReport(report)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedReport(report)}
                  >
                    {/* Name + description */}
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-am-text truncate group-hover:text-accent1 transition-colors">
                          {report.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5 truncate hidden sm:block">{report.description}</p>
                    </div>

                    {/* Type badge */}
                    <div className="col-span-1 hidden sm:block">
                      <span className={cn('px-2 py-0.5 border rounded-md text-xs font-medium', typeConf.bgClass, typeConf.textClass, typeConf.borderClass)}>
                        {typeConf.label}
                      </span>
                    </div>

                    {/* Last run */}
                    <div className="col-span-2 hidden md:block">
                      <span className="text-xs text-muted" title={formatDateTime(report.lastRun)}>
                        {timeAgo(report.lastRun)}
                      </span>
                    </div>

                    {/* Schedule */}
                    <div className="col-span-2 hidden lg:block">
                      {sched ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <RefreshCw size={10} />
                          {sched}
                        </span>
                      ) : (
                        <span className="text-xs text-muted/40">—</span>
                      )}
                    </div>

                    {/* Created by */}
                    <div className="col-span-2 hidden lg:block">
                      <span className="text-xs text-muted">{report.createdBy}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        aria-label="Run report"
                        className="p-1.5 text-muted hover:text-good transition-colors rounded"
                        title="Run"
                      >
                        <Play size={13} />
                      </button>
                      <button
                        aria-label="Edit report"
                        className="p-1.5 text-muted hover:text-accent1 transition-colors rounded"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        aria-label="Delete report"
                        className="p-1.5 text-muted hover:text-bad transition-colors rounded"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronRight size={14} className="text-muted/40 ml-1" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Report detail drawer */}
      {selectedReport && (
        <ReportDrawer report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      {/* New report modal */}
      {showNewModal && <NewReportModal onClose={() => setShowNewModal(false)} />}
    </div>
  )
}
