'use client'

import { useState } from 'react'
import { Check, X, Database, BarChart3, UserPlus, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const DATA_SOURCES = ['Segment', 'Mixpanel', 'Amplitude', 'Custom API']
const KPI_OPTIONS = [
  { id: 'dau', label: 'Daily Active Users', description: 'Track daily engagement' },
  { id: 'mrr', label: 'Monthly Recurring Revenue', description: 'Revenue over time' },
  { id: 'activation', label: 'Activation Rate', description: 'New user activation funnel' },
  { id: 'churn', label: 'Churn Rate', description: 'Monthly customer churn' },
  { id: 'adoption', label: 'Feature Adoption', description: 'Feature usage tracking' },
]

const ROLES = ['Admin', 'Analyst', 'Viewer']

const STEPS = [
  { id: 1, label: 'Data Source', icon: Database },
  { id: 2, label: 'Choose KPIs', icon: BarChart3 },
  { id: 3, label: 'Invite Teammate', icon: UserPlus },
]

interface OnboardingWizardProps {
  onComplete: () => void
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedKpis, setSelectedKpis] = useState<Set<string>>(new Set(['dau', 'mrr']))
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Analyst')
  const [inviteSent, setInviteSent] = useState(false)

  const toggleKpi = (id: string) => {
    setSelectedKpis((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const canNext = () => {
    if (step === 1) return selectedSource !== ''
    if (step === 2) return selectedKpis.size > 0
    return true
  }

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1)
    else {
      localStorage.setItem('aurora_onboarding_done', 'true')
      onComplete()
    }
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    setInviteSent(true)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm backdrop-animate" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-label="Onboarding wizard"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-am-text">Welcome to AuroraMetrics</h2>
            <p className="text-xs text-muted mt-0.5">Let&apos;s get you set up in 3 steps</p>
          </div>
          <button
            onClick={onComplete}
            aria-label="Skip onboarding"
            className="text-muted hover:text-am-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress stepper */}
        <div className="flex items-center px-6 pb-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                      done ? 'bg-good border-good' : active ? 'bg-accent1/10 border-accent1' : 'bg-surface-2 border-border'
                    )}
                  >
                    {done ? (
                      <Check size={14} className="text-bg" />
                    ) : (
                      <Icon size={14} className={active ? 'text-accent1' : 'text-muted'} />
                    )}
                  </div>
                  <span className={cn('text-[10px] mt-1 font-medium', active ? 'text-accent1' : done ? 'text-good' : 'text-muted')}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-0.5 mx-2 mb-4 rounded', done ? 'bg-good' : 'bg-border')} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div className="px-6 pb-4 min-h-[200px]">
          {/* Step 1: Connect Data Source */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-semibold text-am-text mb-1">Connect a Data Source</h3>
              <p className="text-xs text-muted mb-4">
                Choose your primary event tracking provider. You can add more sources later.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DATA_SOURCES.map((src) => (
                  <button
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      selectedSource === src
                        ? 'border-accent1 bg-accent1/10 text-accent1'
                        : 'border-border bg-surface-2 text-muted hover:border-border hover:text-am-text'
                    )}
                  >
                    {selectedSource === src && <Check size={12} className="text-accent1" />}
                    {src}
                  </button>
                ))}
              </div>
              {selectedSource && (
                <div className="mt-3 p-3 bg-good/5 border border-good/20 rounded-lg text-xs text-good">
                  {selectedSource} selected. Click Next to configure your KPIs.
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose KPIs */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-semibold text-am-text mb-1">Choose KPIs to Track</h3>
              <p className="text-xs text-muted mb-4">
                Select the metrics that matter most to your team. You can customize these later.
              </p>
              <div className="space-y-2">
                {KPI_OPTIONS.map((kpi) => {
                  const checked = selectedKpis.has(kpi.id)
                  return (
                    <label
                      key={kpi.id}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all',
                        checked ? 'border-accent1 bg-accent1/5' : 'border-border bg-surface-2 hover:border-border/80'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                          checked ? 'bg-accent1 border-accent1' : 'border-border'
                        )}
                        onClick={() => toggleKpi(kpi.id)}
                      >
                        {checked && <Check size={10} className="text-bg" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleKpi(kpi.id)}
                      />
                      <div>
                        <div className="text-sm font-medium text-am-text">{kpi.label}</div>
                        <div className="text-xs text-muted">{kpi.description}</div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Invite Teammate */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-semibold text-am-text mb-1">Invite a Teammate</h3>
              <p className="text-xs text-muted mb-4">
                Analytics is better together. Invite a colleague to your workspace.
              </p>
              {inviteSent ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-good/10 flex items-center justify-center">
                    <Check size={24} className="text-good" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-am-text">Invitation sent!</p>
                    <p className="text-xs text-muted mt-1">
                      {inviteEmail} will receive an invite email shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1 block">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-am-text placeholder:text-muted focus:outline-none focus:border-accent1 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted mb-1 block">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-am-text focus:outline-none focus:border-accent1 transition-colors appearance-none"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className="w-full py-2 text-sm font-semibold rounded-lg bg-accent1/10 border border-accent1/40 text-accent1 hover:bg-accent1/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Invitation
                  </button>
                </div>
              )}
              <p className="text-xs text-muted mt-3 text-center">
                Or skip this step and invite team members later from Settings.
              </p>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted hover:text-am-text disabled:opacity-0 transition-colors"
          >
            <ChevronLeft size={14} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canNext() && step < 3}
            className={cn(
              'inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg transition-all',
              step === 3
                ? 'bg-good/10 border border-good/40 text-good hover:bg-good/20'
                : 'bg-accent1 text-bg hover:bg-accent1/90',
              !canNext() && 'opacity-50 cursor-not-allowed'
            )}
          >
            {step === 3 ? 'Get Started' : 'Next'}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
