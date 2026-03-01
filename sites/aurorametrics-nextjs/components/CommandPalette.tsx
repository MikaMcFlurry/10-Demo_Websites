'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, LayoutDashboard, FileBarChart2, Bell, Users, Shield,
  Settings, FilePlus, Download, UserPlus, X, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  group: 'Navigation' | 'Actions'
  action: () => void
  keywords?: string[]
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const navigate = useCallback(
    (path: string) => {
      router.push(path)
      onClose()
    },
    [router, onClose]
  )

  const items: CommandItem[] = [
    {
      id: 'nav-overview',
      label: 'Overview',
      description: 'Go to analytics dashboard',
      icon: <LayoutDashboard size={15} />,
      group: 'Navigation',
      action: () => navigate('/app/overview'),
      keywords: ['dashboard', 'home', 'metrics', 'kpi'],
    },
    {
      id: 'nav-reports',
      label: 'Reports',
      description: 'Browse saved reports',
      icon: <FileBarChart2 size={15} />,
      group: 'Navigation',
      action: () => navigate('/app/reports'),
      keywords: ['report', 'funnel', 'cohort', 'retention'],
    },
    {
      id: 'nav-alerts',
      label: 'Alerts',
      description: 'View alert rules and notifications',
      icon: <Bell size={15} />,
      group: 'Navigation',
      action: () => navigate('/app/alerts'),
      keywords: ['alert', 'notification', 'warning', 'rule'],
    },
    {
      id: 'nav-team',
      label: 'Team',
      description: 'Manage team members and roles',
      icon: <Users size={15} />,
      group: 'Navigation',
      action: () => navigate('/app/team'),
      keywords: ['team', 'members', 'invite', 'roles', 'users'],
    },
    {
      id: 'nav-audit',
      label: 'Audit Log',
      description: 'View activity and compliance log',
      icon: <Shield size={15} />,
      group: 'Navigation',
      action: () => navigate('/app/audit'),
      keywords: ['audit', 'log', 'compliance', 'activity', 'history'],
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      description: 'Workspace and profile settings',
      icon: <Settings size={15} />,
      group: 'Navigation',
      action: () => navigate('/app/settings'),
      keywords: ['settings', 'profile', 'billing', 'workspace', 'integrations'],
    },
    {
      id: 'action-new-report',
      label: 'Create Report',
      description: 'Start a new analytics report',
      icon: <FilePlus size={15} />,
      group: 'Actions',
      action: () => navigate('/app/reports'),
      keywords: ['create', 'new', 'report', 'build'],
    },
    {
      id: 'action-export',
      label: 'Export CSV',
      description: 'Export current view to CSV',
      icon: <Download size={15} />,
      group: 'Actions',
      action: () => { onClose() },
      keywords: ['export', 'csv', 'download', 'data'],
    },
    {
      id: 'action-invite',
      label: 'Invite Team Member',
      description: 'Send an invitation to a teammate',
      icon: <UserPlus size={15} />,
      group: 'Actions',
      action: () => navigate('/app/team'),
      keywords: ['invite', 'add', 'team', 'member', 'user'],
    },
  ]

  const filtered = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.includes(q))
        )
      })
    : items

  // Group items
  const groups = ['Navigation', 'Actions'] as const
  const grouped = groups
    .map((g) => ({ group: g, items: filtered.filter((i) => i.group === g) }))
    .filter((g) => g.items.length > 0)

  const flatFiltered = grouped.flatMap((g) => g.items)

  const runActive = useCallback(() => {
    if (flatFiltered[activeIndex]) {
      flatFiltered[activeIndex].action()
    }
  }, [flatFiltered, activeIndex])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        runActive()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, flatFiltered.length, runActive])

  if (!open) return null

  let flatIdx = 0

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm backdrop-animate"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl mx-4 bg-surface border border-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-am-text text-sm placeholder:text-muted focus:outline-none"
            aria-label="Command palette search"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-muted hover:text-am-text transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-muted border border-border rounded bg-surface-2">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <ul ref={listRef} className="py-2 max-h-80 overflow-y-auto scrollbar-thin" role="listbox">
          {grouped.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted">
              No results for &ldquo;{query}&rdquo;
            </li>
          ) : (
            grouped.map(({ group, items: groupItems }) => (
              <li key={group}>
                <div className="px-4 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider">
                  {group}
                </div>
                <ul>
                  {groupItems.map((item) => {
                    const idx = flatIdx++
                    const isActive = activeIndex === idx
                    return (
                      <li
                        key={item.id}
                        role="option"
                        aria-selected={isActive}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
                          isActive ? 'bg-accent1/10' : 'hover:bg-surface-2'
                        )}
                      >
                        <span className={cn('flex-shrink-0', isActive ? 'text-accent1' : 'text-muted')}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={cn('text-sm font-medium', isActive ? 'text-am-text' : 'text-am-text')}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted truncate">{item.description}</div>
                          )}
                        </div>
                        {isActive && <ArrowRight size={13} className="text-accent1 flex-shrink-0" />}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-xs text-muted bg-surface-2">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 border border-border rounded bg-surface">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 border border-border rounded bg-surface">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 border border-border rounded bg-surface">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}
