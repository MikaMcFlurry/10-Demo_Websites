'use client'

import { useState } from 'react'
import { X, AlertTriangle, Info, Zap, CheckCheck } from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import type { AlertNotification, AlertSeverity } from '@/data/types'

interface NotificationCenterProps {
  notifications: AlertNotification[]
  onClose?: () => void
  inline?: boolean
}

const severityConfig: Record<AlertSeverity, { icon: typeof Info; color: string; bg: string; label: string }> = {
  info: { icon: Info, color: 'text-accent1', bg: 'bg-accent1/10', label: 'Info' },
  warning: { icon: AlertTriangle, color: 'text-warn', bg: 'bg-warn/10', label: 'Warning' },
  critical: { icon: Zap, color: 'text-bad', bg: 'bg-bad/10', label: 'Critical' },
}

type FilterTab = 'all' | 'unread' | 'critical' | 'warning' | 'info'

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'critical', label: 'Critical' },
  { key: 'warning', label: 'Warning' },
  { key: 'info', label: 'Info' },
]

export default function NotificationCenter({
  notifications: initialNotifications,
  onClose,
  inline = false,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.read
    return n.severity === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-am-text">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-bad text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent1 transition-colors"
              aria-label="Mark all as read"
            >
              <CheckCheck size={12} />
              Mark all read
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1 text-muted hover:text-am-text transition-colors rounded"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto scrollbar-thin">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.key === 'unread'
              ? unreadCount
              : tab.key === 'all'
              ? notifications.length
              : notifications.filter((n) => n.severity === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-shrink-0 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-accent1/10 text-accent1'
                  : 'text-muted hover:text-am-text'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1 text-muted">({count})</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      <div className={cn('overflow-y-auto scrollbar-thin', inline ? 'max-h-[500px]' : 'flex-1')}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <CheckCheck size={32} className="mb-3 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((notif) => {
              const config = severityConfig[notif.severity]
              const Icon = config.icon
              return (
                <li
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    'flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-surface-2',
                    !notif.read && 'bg-accent1/[0.03]'
                  )}
                >
                  {/* Severity icon */}
                  <div className={cn('mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center', config.bg)}>
                    <Icon size={13} className={config.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-xs font-semibold leading-tight', notif.read ? 'text-muted' : 'text-am-text')}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent1 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{notif.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn('text-xs font-medium', config.color)}>
                        {config.label}
                      </span>
                      <span className="text-muted text-xs">·</span>
                      <span className="text-xs text-muted">{timeAgo(notif.timestamp)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )

  if (inline) {
    return (
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {content}
      </div>
    )
  }

  // Slide-in panel
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm backdrop-animate"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className="relative w-80 bg-surface border-l border-border flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label="Notification center"
        aria-modal="true"
      >
        {content}
      </aside>
    </div>
  )
}
