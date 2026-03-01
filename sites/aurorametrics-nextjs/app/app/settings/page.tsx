'use client'

import { useState } from 'react'
import {
  Settings, Bell, Plug, AlertTriangle, Check, Globe, Database,
  Zap, Save, Trash2, RefreshCw, ExternalLink, ChevronDown, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUser } from '@/lib/auth'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'general' | 'notifications' | 'integrations' | 'danger'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: 'cdp' | 'analytics' | 'database' | 'warehouse'
  connected: boolean
  lastSync?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  { id: 'segment', name: 'Segment', description: 'Customer data platform – send and receive events', icon: '⬡', category: 'cdp', connected: true, lastSync: '2025-07-15T09:00:00Z' },
  { id: 'mixpanel', name: 'Mixpanel', description: 'Import Mixpanel events and user properties', icon: 'M', category: 'analytics', connected: false },
  { id: 'amplitude', name: 'Amplitude', description: 'Import Amplitude projects and events', icon: 'A', category: 'analytics', connected: true, lastSync: '2025-07-14T18:00:00Z' },
  { id: 'postgres', name: 'PostgreSQL', description: 'Connect your Postgres database as a data source', icon: '🐘', category: 'database', connected: false },
  { id: 'bigquery', name: 'BigQuery', description: 'Query your BigQuery datasets directly', icon: 'BQ', category: 'warehouse', connected: true, lastSync: '2025-07-15T06:00:00Z' },
  { id: 'snowflake', name: 'Snowflake', description: 'Connect to your Snowflake data warehouse', icon: '❄', category: 'warehouse', connected: false },
]

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

const LANGUAGES = [
  { value: 'en', label: 'English (US)' },
  { value: 'en-gb', label: 'English (UK)' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'ja', label: '日本語' },
]

const RETENTION_OPTIONS = [
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '180 days' },
  { value: 365, label: '1 year' },
]

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors flex-shrink-0',
          checked ? 'bg-accent1' : 'bg-surface-2 border border-border'
        )}
      >
        <div
          className={cn(
            'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && <span className="text-sm text-muted group-hover:text-am-text transition-colors">{label}</span>}
    </label>
  )
}

// ─── Save confirmation banner ─────────────────────────────────────────────────

function SavedBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-good/10 border border-good/30 rounded-xl shadow-xl text-sm text-good backdrop-blur-sm">
      <Check size={15} />
      <span>Changes saved successfully</span>
      <button onClick={onDismiss} className="ml-2 text-good/60 hover:text-good transition-colors">
        <X size={13} />
      </button>
    </div>
  )
}

// ─── Delete confirmation dialog ───────────────────────────────────────────────

function ConfirmDeleteDialog({ title, message, onConfirm, onClose }: { title: string; message: string; onConfirm: () => void; onClose: () => void }) {
  const [confirmText, setConfirmText] = useState('')
  const CONFIRM_WORD = 'DELETE'
  const ready = confirmText === CONFIRM_WORD

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-bad/40 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-bad/10 flex items-center justify-center">
            <AlertTriangle size={16} className="text-bad" />
          </div>
          <h2 className="text-base font-bold text-am-text">{title}</h2>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-4">{message}</p>
        <div className="bg-bad/5 border border-bad/20 rounded-lg px-4 py-3 mb-4">
          <p className="text-xs text-bad font-medium mb-2">
            Type <span className="font-mono font-bold">{CONFIRM_WORD}</span> to confirm
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_WORD}
            className="w-full bg-surface border border-bad/30 rounded-lg px-3 py-2 text-sm text-am-text placeholder:text-muted/40 focus:outline-none focus:border-bad transition-colors font-mono"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-surface-2 border border-border text-am-text text-sm font-medium rounded-lg hover:bg-surface-2/80 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            disabled={!ready}
            className="flex-1 py-2.5 bg-bad text-white text-sm font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bad/90 transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function GeneralTab({ onSave }: { onSave: () => void }) {
  const [workspaceName, setWorkspaceName] = useState('AuroraMetrics')
  const [timezone, setTimezone] = useState('America/New_York')
  const [retention, setRetention] = useState(365)
  const [language, setLanguage] = useState('en')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-am-text mb-4 pb-3 border-b border-border">Workspace</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Workspace name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 focus:ring-1 focus:ring-accent1/20 transition-colors"
            />
            <p className="text-xs text-muted mt-1.5">This name appears in your workspace URL and emails.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-am-text mb-4 pb-3 border-b border-border">Regional settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Timezone</label>
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-lg pl-8 pr-8 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-lg px-4 pr-8 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-am-text mb-4 pb-3 border-b border-border">Data retention</h3>
        <div>
          <label className="block text-xs font-medium text-muted mb-3">
            Retain event data for
            <span className="ml-1 text-accent1 font-semibold">
              {RETENTION_OPTIONS.find((r) => r.value === retention)?.label}
            </span>
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {RETENTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRetention(opt.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  retention === opt.value
                    ? 'bg-accent1/10 text-accent1 border-accent1/30'
                    : 'bg-surface-2 text-muted border-border hover:border-accent1/30 hover:text-am-text'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">Events older than this period will be automatically purged.</p>
        </div>
      </div>

      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent1/20"
      >
        <Save size={14} />
        Save changes
      </button>
    </div>
  )
}

function NotificationsTab({ onSave }: { onSave: () => void }) {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(true)
  const [newUser, setNewUser] = useState(false)
  const [reportReady, setReportReady] = useState(true)
  const [alertTriggered, setAlertTriggered] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00000/B00000/XXXX')

  const eventTypes = [
    { label: 'New user signup', email: newUser, slack: newUser, setEmail: setNewUser, setSlack: setNewUser },
    { label: 'Scheduled report ready', email: reportReady, slack: reportReady, setEmail: setReportReady, setSlack: setReportReady },
    { label: 'Alert triggered', email: alertTriggered, slack: alertTriggered, setEmail: setAlertTriggered, setSlack: setAlertTriggered },
    { label: 'Weekly digest', email: weeklyDigest, slack: weeklyDigest, setEmail: setWeeklyDigest, setSlack: setWeeklyDigest },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-am-text mb-4 pb-3 border-b border-border">Channels</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-am-text">Email notifications</div>
              <div className="text-xs text-muted mt-0.5">Send alerts and reports to user email addresses</div>
            </div>
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-am-text">Slack notifications</div>
              <div className="text-xs text-muted mt-0.5">Post alerts to your Slack workspace channels</div>
            </div>
            <Toggle checked={slackAlerts} onChange={setSlackAlerts} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-am-text mb-4 pb-3 border-b border-border">Slack webhook URL</h3>
        <input
          type="url"
          value={slackWebhook}
          onChange={(e) => setSlackWebhook(e.target.value)}
          disabled={!slackAlerts}
          placeholder="https://hooks.slack.com/services/…"
          className={cn(
            'w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent1 transition-colors font-mono',
            slackAlerts ? 'text-am-text' : 'text-muted/50 cursor-not-allowed opacity-50'
          )}
        />
        <p className="text-xs text-muted mt-1.5">
          <a href="#" className="text-accent1 hover:underline inline-flex items-center gap-1">
            How to set up a Slack webhook <ExternalLink size={10} />
          </a>
        </p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-am-text mb-4 pb-3 border-b border-border">Notification events</h3>
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 bg-surface-2 border-b border-border px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">
            <div className="col-span-1">Event</div>
            <div className="text-center">Email</div>
            <div className="text-center">Slack</div>
          </div>
          {eventTypes.map((evt) => (
            <div key={evt.label} className="grid grid-cols-3 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-surface-2/40 transition-colors">
              <div className="col-span-1">
                <span className="text-sm text-am-text">{evt.label}</span>
              </div>
              <div className="flex justify-center">
                <Toggle checked={evt.email && emailAlerts} onChange={(v) => evt.setEmail(v)} />
              </div>
              <div className="flex justify-center">
                <Toggle checked={evt.slack && slackAlerts} onChange={(v) => evt.setSlack(v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent1/20"
      >
        <Save size={14} />
        Save preferences
      </button>
    </div>
  )
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)

  const toggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, connected: !i.connected, lastSync: !i.connected ? new Date().toISOString() : undefined }
          : i
      )
    )
  }

  const categoryLabels: Record<Integration['category'], string> = {
    cdp: 'Customer Data Platform',
    analytics: 'Analytics',
    database: 'Database',
    warehouse: 'Data Warehouse',
  }

  const grouped = integrations.reduce<Record<string, Integration[]>>((acc, integration) => {
    const cat = categoryLabels[integration.category]
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(integration)
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-3xl">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((integration) => (
              <div
                key={integration.id}
                className={cn(
                  'bg-surface border rounded-xl p-4 flex items-center gap-4 transition-all',
                  integration.connected ? 'border-good/30' : 'border-border'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold border flex-shrink-0',
                  integration.connected ? 'bg-good/10 border-good/20 text-good' : 'bg-surface-2 border-border text-muted'
                )}>
                  {integration.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-am-text">{integration.name}</span>
                    {integration.connected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-good">
                        <span className="w-1.5 h-1.5 bg-good rounded-full animate-pulse" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 leading-snug line-clamp-1">{integration.description}</p>
                  {integration.connected && integration.lastSync && (
                    <p className="text-[10px] text-muted/60 mt-0.5">
                      Synced {new Date(integration.lastSync).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() => toggle(integration.id)}
                  className={cn(
                    'flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                    integration.connected
                      ? 'bg-surface-2 text-muted border-border hover:border-bad/40 hover:text-bad'
                      : 'bg-accent1/10 text-accent1 border-accent1/30 hover:bg-accent1/20'
                  )}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-muted">
        Need a custom integration?{' '}
        <a href="#" className="text-accent1 hover:underline inline-flex items-center gap-1">
          Contact support <ExternalLink size={10} />
        </a>
      </p>
    </div>
  )
}

function DangerZoneTab() {
  const [deleteDataDialog, setDeleteDataDialog] = useState(false)
  const [deleteWorkspaceDialog, setDeleteWorkspaceDialog] = useState(false)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-start gap-3 px-4 py-3 bg-bad/5 border border-bad/20 rounded-lg">
        <AlertTriangle size={15} className="text-bad flex-shrink-0 mt-0.5" />
        <p className="text-xs text-bad leading-relaxed">
          Actions in this section are <strong>irreversible</strong>. Please proceed with caution. All destructive operations are logged in the audit trail.
        </p>
      </div>

      {/* Delete all data */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-am-text">Delete all data</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed max-w-sm">
              Permanently delete all events, reports, and analytics data. Your workspace and team will remain active. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setDeleteDataDialog(true)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-bad/10 text-bad border border-bad/30 text-xs font-semibold rounded-lg hover:bg-bad/20 transition-colors"
          >
            <Database size={12} />
            Delete all data
          </button>
        </div>
      </div>

      {/* Delete workspace */}
      <div className="bg-surface border border-bad/30 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-bad">Delete workspace</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed max-w-sm">
              Permanently delete your entire workspace, including all users, data, reports, and integrations. This action is immediate and cannot be reversed.
            </p>
          </div>
          <button
            onClick={() => setDeleteWorkspaceDialog(true)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-bad text-white text-xs font-semibold rounded-lg hover:bg-bad/90 transition-colors shadow-sm shadow-bad/20"
          >
            <Trash2 size={12} />
            Delete workspace
          </button>
        </div>
      </div>

      {/* Dialogs */}
      {deleteDataDialog && (
        <ConfirmDeleteDialog
          title="Delete all data"
          message="This will permanently delete all events, metrics, and report data from your workspace. Your account and team members will remain. This action cannot be undone."
          onConfirm={() => {}}
          onClose={() => setDeleteDataDialog(false)}
        />
      )}
      {deleteWorkspaceDialog && (
        <ConfirmDeleteDialog
          title="Delete workspace"
          message="This will permanently delete your entire AuroraMetrics workspace, including all users, data, and settings. There is no way to recover this data."
          onConfirm={() => {}}
          onClose={() => setDeleteWorkspaceDialog(false)}
        />
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS: Array<{ key: Tab; label: string; icon: React.ElementType }> = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const [showSaved, setShowSaved] = useState(false)

  const handleSave = () => {
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-xl font-bold text-am-text">Settings</h1>
        <p className="text-sm text-muted mt-0.5">Configure your workspace, notifications, and integrations</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <nav
          className="lg:w-48 flex-shrink-0 flex flex-row lg:flex-col gap-1 bg-surface border border-border rounded-xl p-2 h-fit"
          aria-label="Settings navigation"
        >
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full',
                tab === key
                  ? key === 'danger'
                    ? 'bg-bad/10 text-bad'
                    : 'bg-accent1/10 text-accent1'
                  : key === 'danger'
                  ? 'text-muted hover:text-bad hover:bg-bad/5'
                  : 'text-muted hover:text-am-text hover:bg-surface-2'
              )}
              aria-current={tab === key ? 'page' : undefined}
            >
              <Icon size={15} />
              <span className="hidden sm:inline lg:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="flex-1 min-w-0 bg-surface border border-border rounded-xl p-6">
          {tab === 'general' && <GeneralTab onSave={handleSave} />}
          {tab === 'notifications' && <NotificationsTab onSave={handleSave} />}
          {tab === 'integrations' && <IntegrationsTab />}
          {tab === 'danger' && <DangerZoneTab />}
        </div>
      </div>

      {/* Save banner */}
      {showSaved && <SavedBanner onDismiss={() => setShowSaved(false)} />}
    </div>
  )
}
