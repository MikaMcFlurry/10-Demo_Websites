'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileBarChart2, Bell, Users, Shield, Settings,
  LogOut, Menu, X, Command, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUser, logout } from '@/lib/auth'
import type { User } from '@/data/types'
import { ALERT_NOTIFICATIONS } from '@/data/alerts'
import CommandPalette from './CommandPalette'
import NotificationCenter from './NotificationCenter'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/app/overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
  { href: '/app/reports', label: 'Reports', icon: <FileBarChart2 size={17} /> },
  { href: '/app/alerts', label: 'Alerts', icon: <Bell size={17} /> },
  { href: '/app/team', label: 'Team', icon: <Users size={17} />, adminOnly: true },
  { href: '/app/audit', label: 'Audit Log', icon: <Shield size={17} />, adminOnly: true },
  { href: '/app/settings', label: 'Settings', icon: <Settings size={17} />, adminOnly: true },
]

interface AppShellProps {
  children: React.ReactNode
  pageTitle?: string
}

export default function AppShell({ children, pageTitle }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = ALERT_NOTIFICATIONS.filter((n) => !n.read).length

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/login')
      return
    }
    setUser(u)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Global ⌘K listener
  const openCommand = useCallback(() => setCommandOpen(true), [])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openCommand()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openCommand])

  const isAdmin = user?.role === 'admin'

  const visibleNav = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  const currentTitle = pageTitle || NAV_ITEMS.find((n) => pathname === n.href)?.label || 'Dashboard'

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        'flex flex-col bg-surface border-r border-border',
        mobile ? 'fixed inset-y-0 left-0 z-50 w-60 animate-fade-in' : 'hidden lg:flex w-60 fixed inset-y-0 left-0 z-30'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-am-text">AuroraMetrics</div>
          <div className="text-[10px] text-muted leading-none">Analytics Platform</div>
        </div>
        {mobile && (
          <button
            className="ml-auto text-muted hover:text-am-text"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-thin" aria-label="Sidebar navigation">
        {visibleNav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-accent1/10 text-accent1'
                  : 'text-muted hover:text-am-text hover:bg-surface-2'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span className={active ? 'text-accent1' : 'text-muted'}>{item.icon}</span>
              {item.label}
              {item.href === '/app/alerts' && unreadCount > 0 && (
                <span className="ml-auto bg-bad text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border px-3 py-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent1/30 to-accent2/30 border border-border flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-am-text">{user.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-am-text truncate">{user.name}</div>
              <div className="text-[10px] text-muted capitalize truncate">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="text-muted hover:text-bad transition-colors p-1 rounded"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-3 w-20 mb-1" />
              <div className="skeleton h-2 w-12" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar mobile />
        </>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0">
        {/* Top bar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-surface z-20">
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted hover:text-am-text transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-am-text">{currentTitle}</h1>
          </div>

          {/* Right: command palette + notifications */}
          <div className="flex items-center gap-2">
            {/* Command palette button */}
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette (Ctrl+K)"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border rounded-lg text-xs text-muted hover:border-accent1/50 hover:text-am-text transition-colors"
            >
              <Command size={12} />
              <span>Command</span>
              <kbd className="ml-1 text-[10px] px-1 py-0.5 bg-surface border border-border rounded">⌘K</kbd>
            </button>

            {/* Mobile command button */}
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
              className="sm:hidden p-2 text-muted hover:text-am-text transition-colors"
            >
              <Command size={18} />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              className="relative p-2 text-muted hover:text-am-text transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-bad text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main id="main-content" className="flex-1 overflow-y-auto scrollbar-thin" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Notification Center slide-in */}
      {notifOpen && (
        <NotificationCenter
          notifications={ALERT_NOTIFICATIONS}
          onClose={() => setNotifOpen(false)}
        />
      )}
    </div>
  )
}
