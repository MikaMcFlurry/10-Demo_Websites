'use client'

import { useState } from 'react'
import {
  Bell, Plus, AlertTriangle, AlertCircle, Info, Mail, MessageSquare, Globe,
  ToggleLeft, ToggleRight, CheckCircle, Clock, ChevronRight, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ALERT_RULES, ALERT_NOTIFICATIONS } from '@/data/alerts'
import type { AlertRule, AlertNotification, AlertSeverity, AlertChannel } from '@/data/types'
import { timeAgo, formatDateTime } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function severityConfig(s: AlertSeverity) {
  switch (s) {
    case 'critical':
      return {
        icon: AlertCircle,
        textClass: 'text-bad',
        bgClass: 'bg-bad/10',
        borderClass: 'border-bad/30',
        dotClass: 'bg-bad',
        label: 'Critical',
      }
    case 'warning':
      return {
        icon: AlertTriangle,
        textClass: 'text-warn',
        bgClass: 'bg-warn/10',
        borderClass: 'border-warn/30',
        dotClass: 'bg-warn',
        label: 'Warning',
      }
    case 'info':
    default:
      return {
        icon: Info,
        textClass: 'text-accent1',
        bgClass: 'bg-accent1/10',
        borderClass: 'border-accent1/30',
        dotClass: 'bg-accent1',
        label: 'Info',
      }
  }
}

function channelConfig(c: AlertChannel) {
  switch (c) {
    case 'slack':
      return { label: 'Slack', icon: MessageSquare, textClass: 'text-accent2', bgClass: 'bg-accent2/10', borderClass: 'border-accent2/20' }
    case 'email':
      return { label: 'Email', icon: Mail, textClass: 'text-accent1', bgClass: 'bg-accent1/10', borderClass: 'border-accent1/20' }
    case 'webhook':
    default:
      return { label: 'Webhook', icon: Globe, textClass: 'text-muted', bgClass: 'bg-surface-2', borderClass: 'border-border' }
  }
}

function formatCondition(rule: AlertRule): string {
  const condLabel = rule.condition === 'above' ? 'above' : rule.condition === 'below' ? 'below' : rule.condition === 'change_percent' ? 'changes by' : 'equals'
  const unit = rule.thresholdUnit === 'currency' ? `$${rule.threshold.toLocaleString()}` : rule.thresholdUnit === 'percent' ? `${rule.threshold}%` : rule.threshold.toLocaleString()
  return `${rule.metric} ${condLabel} ${unit}`
}

// ─── New Rule Modal (static UI) ───────────────────────────────────────────────

function NewRuleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-am-text">Create Alert Rule</h2>
          <button onClick={onClose} className="text-muted hover:text-am-text transition-colors p-1 rounded">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Rule name</label>
            <input type="text" placeholder="e.g. DAU Drop Alert" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Metric</label>
            <select className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none">
              <option>Daily Active Users</option>
              <option>Monthly Recurring Revenue</option>
              <option>Churn Rate</option>
              <option>Activation Rate</option>
              <option>API Error Rate</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Condition</label>
              <select className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none">
                <option>above</option>
                <option>below</option>
                <option>equals</option>
                <option>changes by %</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Threshold</label>
              <input type="number" placeholder="9000" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Channel</label>
              <select className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none">
                <option>slack</option>
                <option>email</option>
                <option>webhook</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Severity</label>
              <select className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none">
                <option>critical</option>
                <option>warning</option>
                <option>info</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 bg-surface-2 border border-border text-am-text text-sm font-medium rounded-lg hover:bg-surface-2/80 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
            Create rule
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>(ALERT_RULES)
  const [notifications] = useState<AlertNotification[]>(ALERT_NOTIFICATIONS)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'rules' | 'notifications'>('rules')

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-am-text">Alerts</h1>
          <p className="text-sm text-muted mt-0.5">Manage alert rules and review notifications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent1/20"
        >
          <Plus size={15} />
          New Rule
        </button>
      </header>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Rules', value: rules.length, icon: Bell, color: 'text-accent1' },
          { label: 'Active Rules', value: rules.filter((r) => r.enabled).length, icon: CheckCircle, color: 'text-good' },
          { label: 'Unread Alerts', value: unreadCount, icon: AlertCircle, color: 'text-bad' },
          { label: 'Total Notifications', value: notifications.length, icon: Clock, color: 'text-muted' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className={s.color} />
              <span className="text-xs text-muted">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-am-text">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
            activeTab === 'rules' ? 'bg-accent1 text-bg' : 'text-muted hover:text-am-text'
          )}
        >
          Alert Rules
          <span className="ml-2 text-xs opacity-70">{rules.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5',
            activeTab === 'notifications' ? 'bg-accent1 text-bg' : 'text-muted hover:text-am-text'
          )}
        >
          Notifications
          {unreadCount > 0 && (
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none', activeTab === 'notifications' ? 'bg-bg/30 text-bg' : 'bg-bad text-white')}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Alert Rules ── */}
      {activeTab === 'rules' && (
        <section aria-label="Alert rules">
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="bg-surface-2 border-b border-border px-4 py-3 grid grid-cols-12 gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
              <div className="col-span-3">Rule / Metric</div>
              <div className="col-span-3 hidden md:block">Condition</div>
              <div className="col-span-2 hidden lg:block">Channel</div>
              <div className="col-span-2">Severity</div>
              <div className="col-span-1 hidden xl:block">Last Triggered</div>
              <div className="col-span-1 text-right">Enabled</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border bg-surface">
              {rules.map((rule) => {
                const sev = severityConfig(rule.severity)
                const ch = channelConfig(rule.channel)
                const SevIcon = sev.icon
                const ChIcon = ch.icon
                return (
                  <div
                    key={rule.id}
                    className={cn(
                      'px-4 py-3.5 grid grid-cols-12 gap-2 items-center hover:bg-surface-2/50 transition-colors',
                      !rule.enabled && 'opacity-50'
                    )}
                  >
                    {/* Name */}
                    <div className="col-span-3 min-w-0">
                      <div className="text-sm font-medium text-am-text truncate">{rule.name}</div>
                      <div className="text-xs text-muted mt-0.5 truncate">{rule.metric}</div>
                    </div>

                    {/* Condition */}
                    <div className="col-span-3 hidden md:block">
                      <span className="text-xs text-muted">{formatCondition(rule)}</span>
                    </div>

                    {/* Channel */}
                    <div className="col-span-2 hidden lg:block">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-md text-xs font-medium', ch.bgClass, ch.textClass, ch.borderClass)}>
                        <ChIcon size={10} />
                        {ch.label}
                      </span>
                    </div>

                    {/* Severity */}
                    <div className="col-span-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-md text-xs font-medium', sev.bgClass, sev.textClass, sev.borderClass)}>
                        <SevIcon size={10} />
                        {sev.label}
                      </span>
                    </div>

                    {/* Last triggered */}
                    <div className="col-span-1 hidden xl:block">
                      <span className="text-xs text-muted">
                        {rule.lastTriggered ? timeAgo(rule.lastTriggered) : '—'}
                      </span>
                    </div>

                    {/* Toggle */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
                        aria-pressed={rule.enabled}
                        className="text-muted hover:text-am-text transition-colors"
                      >
                        {rule.enabled ? (
                          <ToggleRight size={22} className="text-accent1" />
                        ) : (
                          <ToggleLeft size={22} className="text-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Recent Notifications ── */}
      {activeTab === 'notifications' && (
        <section aria-label="Recent notifications">
          <div className="space-y-2">
            {notifications.map((notif) => {
              const sev = severityConfig(notif.severity)
              const SevIcon = sev.icon
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'flex items-start gap-4 p-4 border rounded-xl transition-colors',
                    notif.read
                      ? 'bg-surface border-border'
                      : cn('border', sev.borderClass, 'bg-surface')
                  )}
                >
                  {/* Severity icon */}
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', sev.bgClass)}>
                    <SevIcon size={15} className={sev.textClass} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-am-text">{notif.title}</span>
                          {!notif.read && (
                            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', sev.dotClass)} />
                          )}
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{notif.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-muted whitespace-nowrap">{timeAgo(notif.timestamp)}</div>
                        <div className={cn('text-[10px] font-medium mt-0.5', sev.textClass)}>{sev.label}</div>
                      </div>
                    </div>

                    {/* Value vs threshold */}
                    {notif.value !== undefined && notif.threshold !== undefined && (
                      <div className="flex items-center gap-4 mt-2.5 pt-2.5 border-t border-border/50">
                        <div className="text-xs">
                          <span className="text-muted">Triggered value: </span>
                          <span className={cn('font-semibold', sev.textClass)}>{notif.value.toLocaleString()}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted">Threshold: </span>
                          <span className="text-am-text font-medium">{notif.threshold.toLocaleString()}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted">Rule: </span>
                          <span className="text-am-text">{notif.ruleName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <ChevronRight size={14} className="text-muted flex-shrink-0 mt-1" />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* New Rule Modal */}
      {showModal && <NewRuleModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
