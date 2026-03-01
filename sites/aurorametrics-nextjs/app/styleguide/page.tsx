'use client'

import Link from 'next/link'
import { Zap, AlertTriangle, Info, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import KpiCard from '@/components/KpiCard'

// ─── Color swatches ───────────────────────────────────────────────────────────

const COLORS = [
  { name: '--bg', hex: '#070A14', label: 'bg-bg', description: 'Page background' },
  { name: '--surface', hex: '#0E1530', label: 'bg-surface', description: 'Card surface' },
  { name: '--surface-2', hex: '#141F40', label: 'bg-surface-2', description: 'Nested card / input' },
  { name: '--text', hex: '#EAF0FF', label: 'text-am-text', description: 'Primary text' },
  { name: '--muted', hex: '#A9B3D6', label: 'text-muted', description: 'Secondary / placeholder' },
  { name: '--border', hex: '#223058', label: 'border-border', description: 'Borders & dividers' },
  { name: '--accent-1', hex: '#21D4FD', label: 'text-accent1', description: 'Cyan accent / primary action' },
  { name: '--accent-2', hex: '#B721FF', label: 'text-accent2', description: 'Purple accent' },
  { name: '--good', hex: '#2DFFB3', label: 'text-good', description: 'Positive / success' },
  { name: '--warn', hex: '#FFB020', label: 'text-warn', description: 'Warning / amber' },
  { name: '--bad', hex: '#FF3D6E', label: 'text-bad', description: 'Error / danger' },
]

// ─── Typography scale ─────────────────────────────────────────────────────────

const TYPOGRAPHY = [
  { tag: 'h1', label: 'Heading 1', classes: 'text-3xl font-bold text-am-text tracking-tight', sample: 'The quick brown fox' },
  { tag: 'h2', label: 'Heading 2', classes: 'text-2xl font-bold text-am-text tracking-tight', sample: 'The quick brown fox' },
  { tag: 'h3', label: 'Heading 3', classes: 'text-xl font-semibold text-am-text', sample: 'The quick brown fox' },
  { tag: 'h4', label: 'Heading 4', classes: 'text-lg font-semibold text-am-text', sample: 'The quick brown fox' },
  { tag: 'h5', label: 'Heading 5', classes: 'text-base font-semibold text-am-text', sample: 'The quick brown fox' },
  { tag: 'h6', label: 'Heading 6', classes: 'text-sm font-semibold text-am-text uppercase tracking-wider', sample: 'The quick brown fox' },
  { tag: 'p', label: 'Body (14px)', classes: 'text-sm text-am-text leading-relaxed', sample: 'The quick brown fox jumps over the lazy dog. Product analytics platform.' },
  { tag: 'p', label: 'Small (12px)', classes: 'text-xs text-muted leading-relaxed', sample: 'The quick brown fox jumps over the lazy dog. Secondary text.' },
  { tag: 'code', label: 'Code / Mono', classes: 'text-sm font-mono text-accent1 bg-surface-2 px-1.5 py-0.5 rounded', sample: 'const metrics = await fetch()' },
]

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-lg font-bold text-am-text mb-1 pb-3 border-b border-border">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StyleGuidePage() {
  // Sample KPI sparkline data
  const sparkUp = Array.from({ length: 20 }, (_, i) => ({ value: 40 + i * 3 + Math.sin(i) * 8 }))
  const sparkDown = Array.from({ length: 20 }, (_, i) => ({ value: 100 - i * 2 + Math.cos(i) * 5 }))
  const sparkNeutral = Array.from({ length: 20 }, (_, i) => ({ value: 50 + Math.sin(i * 1.5) * 10 }))

  return (
    <div className="min-h-screen bg-bg text-am-text">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app/overview"
              className="flex items-center gap-1.5 text-xs text-muted hover:text-am-text transition-colors"
            >
              <ArrowLeft size={13} />
              App
            </Link>
            <span className="text-border">/</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center">
                <Zap size={11} className="text-white" />
              </div>
              <span className="text-sm font-bold text-am-text">Style Guide</span>
            </div>
          </div>
          <span className="text-xs text-muted hidden sm:block">AuroraMetrics Design System</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Intro */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-am-text tracking-tight mb-3">AuroraMetrics Style Guide</h1>
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            The complete reference for colors, typography, components, and patterns used across the AuroraMetrics analytics dashboard.
          </p>
        </div>

        {/* ── Colors ── */}
        <Section title="Colors" id="colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {COLORS.map((c) => (
              <div key={c.name} className="bg-surface border border-border rounded-xl overflow-hidden">
                <div
                  className="h-14 w-full"
                  style={{ background: c.hex }}
                />
                <div className="p-3">
                  <div className="text-xs font-mono font-semibold text-am-text">{c.hex}</div>
                  <div className="text-[11px] font-mono text-accent1 mt-0.5">{c.name}</div>
                  <div className="text-[11px] text-muted mt-0.5">{c.label}</div>
                  <div className="text-[10px] text-muted/70 mt-1">{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography" id="typography">
          <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
            {TYPOGRAPHY.map((t, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-6">
                <div className="w-28 flex-shrink-0">
                  <span className="text-xs font-mono text-muted">{t.label}</span>
                </div>
                <div className={t.classes}>{t.sample}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons" id="buttons">
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
                  Primary
                </button>
                <button className="px-4 py-2 bg-surface-2 text-am-text text-sm font-medium rounded-lg border border-border hover:border-accent1/50 transition-all">
                  Secondary
                </button>
                <button className="px-4 py-2 bg-transparent text-muted text-sm font-medium rounded-lg hover:text-am-text hover:bg-surface-2 transition-all">
                  Ghost
                </button>
                <button className="px-4 py-2 bg-bad/10 text-bad text-sm font-medium rounded-lg border border-bad/30 hover:bg-bad/20 transition-all">
                  Danger
                </button>
                <button className="px-4 py-2 bg-accent2/10 text-accent2 text-sm font-medium rounded-lg border border-accent2/30 hover:bg-accent2/20 transition-all">
                  Purple
                </button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-2.5 py-1 bg-accent1 text-bg text-[11px] font-semibold rounded-md">
                  XSmall
                </button>
                <button className="px-3 py-1.5 bg-accent1 text-bg text-xs font-semibold rounded-md">
                  Small
                </button>
                <button className="px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg">
                  Medium
                </button>
                <button className="px-5 py-2.5 bg-accent1 text-bg text-base font-semibold rounded-xl">
                  Large
                </button>
              </div>
            </div>

            {/* States */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">States</p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg">
                  Default
                </button>
                <button className="px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg opacity-60 cursor-not-allowed" disabled>
                  Disabled
                </button>
                <button className="px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  Loading
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges &amp; Chips" id="badges">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Severity</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bad/10 text-bad border border-bad/30 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-bad rounded-full" />
                  Critical
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-warn/10 text-warn border border-warn/30 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-warn rounded-full" />
                  Warning
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent1/10 text-accent1 border border-accent1/30 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-accent1 rounded-full" />
                  Info
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-good/10 text-good border border-good/30 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-good rounded-full" />
                  Success
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Role / Type</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-accent1/10 text-accent1 border border-accent1/20 rounded-md text-xs font-medium">Admin</span>
                <span className="px-2.5 py-0.5 bg-accent2/10 text-accent2 border border-accent2/20 rounded-md text-xs font-medium">Analyst</span>
                <span className="px-2.5 py-0.5 bg-surface-2 text-muted border border-border rounded-md text-xs font-medium">Viewer</span>
                <span className="px-2.5 py-0.5 bg-good/10 text-good border border-good/20 rounded-md text-xs font-medium">Active</span>
                <span className="px-2.5 py-0.5 bg-surface-2 text-muted border border-border rounded-md text-xs font-medium">Inactive</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Report type</p>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'Funnel', cls: 'bg-accent1/10 text-accent1 border-accent1/20' },
                  { label: 'Cohort', cls: 'bg-accent2/10 text-accent2 border-accent2/20' },
                  { label: 'Retention', cls: 'bg-good/10 text-good border-good/20' },
                  { label: 'Revenue', cls: 'bg-warn/10 text-warn border-warn/20' },
                  { label: 'Engagement', cls: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
                  { label: 'Custom', cls: 'bg-surface-2 text-muted border-border' },
                ].map((b) => (
                  <span key={b.label} className={cn('px-2.5 py-0.5 border rounded-md text-xs font-medium', b.cls)}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── KPI Cards ── */}
        <Section title="KPI Cards" id="kpi-cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard title="Daily Active Users" value="11,240" delta={8.4} deltaLabel="vs previous 30d" trend="good" data={sparkUp} />
            <KpiCard title="Churn Rate" value="2.1%" delta={-0.4} deltaLabel="vs previous 30d" trend="bad" data={sparkDown} />
            <KpiCard title="NPS Score" value="62" delta={0.0} deltaLabel="stable" trend="neutral" data={sparkNeutral} />
          </div>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Inputs &amp; Form Fields" id="inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            {/* Text */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Text input</label>
              <input
                type="text"
                placeholder="Placeholder text…"
                defaultValue=""
                className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 focus:ring-1 focus:ring-accent1/20 transition-colors"
              />
            </div>

            {/* Focused state */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">With value</label>
              <input
                type="text"
                defaultValue="admin@aurorametrics.demo"
                className="w-full bg-surface-2 border border-accent1 rounded-lg px-4 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 focus:ring-1 focus:ring-accent1/20 transition-colors"
              />
            </div>

            {/* Error state */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Error state</label>
              <input
                type="text"
                defaultValue="bad-email"
                className="w-full bg-surface-2 border border-bad/60 rounded-lg px-4 py-2.5 text-sm text-am-text focus:outline-none focus:border-bad focus:ring-1 focus:ring-bad/20 transition-colors"
              />
              <p className="text-xs text-bad mt-1.5">Please enter a valid email address.</p>
            </div>

            {/* Disabled */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Disabled</label>
              <input
                type="text"
                defaultValue="Disabled input"
                disabled
                className="w-full bg-surface-2/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-muted/50 cursor-not-allowed"
              />
            </div>

            {/* Select */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Select</label>
              <select className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none cursor-pointer">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Textarea</label>
              <textarea
                placeholder="Enter description…"
                rows={3}
                className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 focus:ring-1 focus:ring-accent1/20 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Toggle */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Toggle switches</p>
            <div className="flex flex-wrap items-center gap-4">
              {[
                { label: 'Email alerts', checked: true },
                { label: 'Slack notifications', checked: false },
                { label: 'Weekly digest', checked: true },
              ].map((t) => (
                <label key={t.label} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={cn(
                      'relative w-9 h-5 rounded-full transition-colors',
                      t.checked ? 'bg-accent1' : 'bg-surface-2 border border-border'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
                        t.checked ? 'translate-x-4' : 'translate-x-0.5'
                      )}
                    />
                  </div>
                  <span className="text-sm text-muted group-hover:text-am-text transition-colors">{t.label}</span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Table example ── */}
        <Section title="Table Example" id="table">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-surface-2 border-b border-border px-4 py-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Sample Data Table</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  {['Name', 'Role', 'Status', 'Last Active'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {[
                  { name: 'Alex Rivera', role: 'admin', status: 'active', last: '2h ago' },
                  { name: 'Sam Chen', role: 'analyst', status: 'active', last: '45m ago' },
                  { name: 'Jordan Kim', role: 'viewer', status: 'inactive', last: '3d ago' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3 font-medium text-am-text">{row.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-medium border',
                        row.role === 'admin' ? 'bg-accent1/10 text-accent1 border-accent1/20' :
                        row.role === 'analyst' ? 'bg-accent2/10 text-accent2 border-accent2/20' :
                        'bg-surface-2 text-muted border-border'
                      )}>
                        {row.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium',
                        row.status === 'active' ? 'text-good' : 'text-muted'
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', row.status === 'active' ? 'bg-good' : 'bg-muted')} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{row.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Status indicators ── */}
        <Section title="Status Indicators" id="status">
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: 'Active', color: 'bg-good', text: 'text-good' },
              { label: 'Inactive', color: 'bg-muted', text: 'text-muted' },
              { label: 'Error', color: 'bg-bad', text: 'text-bad' },
              { label: 'Warning', color: 'bg-warn', text: 'text-warn' },
              { label: 'Pending', color: 'bg-accent1', text: 'text-accent1' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', s.color)} />
                <span className={cn('text-sm font-medium', s.text)}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Alert callouts */}
          <div className="mt-5 space-y-3 max-w-xl">
            <div className="flex items-start gap-3 px-4 py-3 bg-bad/10 border border-bad/30 rounded-lg text-sm text-bad">
              <XCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>Critical error — service is currently unavailable.</span>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 bg-warn/10 border border-warn/30 rounded-lg text-sm text-warn">
              <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
              <span>Warning — your data retention period is expiring soon.</span>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 bg-accent1/10 border border-accent1/30 rounded-lg text-sm text-accent1">
              <Info size={15} className="flex-shrink-0 mt-0.5" />
              <span>Info — a new version of AuroraMetrics is available.</span>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 bg-good/10 border border-good/30 rounded-lg text-sm text-good">
              <CheckCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>Success — your report has been exported successfully.</span>
            </div>
          </div>
        </Section>

        {/* ── Spacing scale ── */}
        <Section title="Spacing Scale" id="spacing">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((n) => (
              <div key={n} className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted w-10 text-right">{n * 4}px</span>
                <span className="text-xs text-muted w-8">({n})</span>
                <div
                  className="h-4 bg-accent1/60 rounded-sm"
                  style={{ width: n * 4 }}
                />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
