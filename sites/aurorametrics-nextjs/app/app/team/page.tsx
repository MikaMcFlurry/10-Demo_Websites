'use client'

import { useState } from 'react'
import { UserPlus, Pencil, UserX, Mail, Shield, Eye, BarChart2, Check, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TEAM_MEMBERS } from '@/data/users'
import type { User, Role } from '@/data/types'
import { timeAgo, formatDate } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roleConfig(role: Role) {
  switch (role) {
    case 'admin':
      return { label: 'Admin', textClass: 'text-accent1', bgClass: 'bg-accent1/10', borderClass: 'border-accent1/20', icon: Shield }
    case 'analyst':
      return { label: 'Analyst', textClass: 'text-accent2', bgClass: 'bg-accent2/10', borderClass: 'border-accent2/20', icon: BarChart2 }
    case 'viewer':
    default:
      return { label: 'Viewer', textClass: 'text-muted', bgClass: 'bg-surface-2', borderClass: 'border-border', icon: Eye }
  }
}

function statusConfig(status: User['status']) {
  if (status === 'active') {
    return { label: 'Active', textClass: 'text-good', dotClass: 'bg-good' }
  }
  return { label: 'Inactive', textClass: 'text-muted', dotClass: 'bg-muted/50' }
}

// ─── Role permission table ─────────────────────────────────────────────────────

const PERMISSIONS = [
  { name: 'View dashboards', admin: true, analyst: true, viewer: true },
  { name: 'Create / edit reports', admin: true, analyst: true, viewer: false },
  { name: 'Delete reports', admin: true, analyst: false, viewer: false },
  { name: 'Export data (CSV)', admin: true, analyst: true, viewer: false },
  { name: 'Manage alert rules', admin: true, analyst: true, viewer: false },
  { name: 'Invite team members', admin: true, analyst: false, viewer: false },
  { name: 'Change user roles', admin: true, analyst: false, viewer: false },
  { name: 'Access audit log', admin: true, analyst: false, viewer: false },
  { name: 'Manage integrations', admin: true, analyst: false, viewer: false },
  { name: 'Workspace settings', admin: true, analyst: false, viewer: false },
]

// ─── Invite modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<Role>('analyst')
  const [roleOpen, setRoleOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-am-text">Invite Team Member</h2>
          <button onClick={onClose} className="text-muted hover:text-am-text transition-colors p-1 rounded">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="colleague@company.com"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
            <div className="relative">
              <button
                onClick={() => setRoleOpen((v) => !v)}
                className="w-full flex items-center justify-between bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text hover:border-accent1/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className={cn('px-2 py-0.5 border rounded text-xs font-medium', roleConfig(role).bgClass, roleConfig(role).textClass, roleConfig(role).borderClass)}>
                    {roleConfig(role).label}
                  </span>
                </span>
                <ChevronDown size={14} className="text-muted" />
              </button>
              {roleOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                  {(['admin', 'analyst', 'viewer'] as Role[]).map((r) => {
                    const rc = roleConfig(r)
                    return (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setRoleOpen(false) }}
                        className={cn('w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-surface-2 transition-colors', role === r && 'bg-surface-2')}
                      >
                        <rc.icon size={14} className={rc.textClass} />
                        <span className="font-medium text-am-text">{rc.label}</span>
                        {role === r && <Check size={13} className="ml-auto text-accent1" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Personal message <span className="text-muted/50">(optional)</span></label>
            <textarea
              rows={2}
              placeholder="Hey! I'm inviting you to our AuroraMetrics workspace…"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-am-text placeholder:text-muted/60 focus:outline-none focus:border-accent1 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-surface-2 border border-border text-am-text text-sm font-medium rounded-lg hover:bg-surface-2/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            <Mail size={13} />
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Role Modal ──────────────────────────────────────────────────────────

function EditRoleModal({ member, onClose, onSave }: { member: User; onClose: () => void; onSave: (id: string, role: Role) => void }) {
  const [role, setRole] = useState<Role>(member.role)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-am-text">Edit Role</h2>
          <button onClick={onClose} className="text-muted hover:text-am-text transition-colors p-1 rounded">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent1/30 to-accent2/30 border border-border flex items-center justify-center font-bold text-am-text text-sm">
            {member.avatar}
          </div>
          <div>
            <div className="text-sm font-semibold text-am-text">{member.name}</div>
            <div className="text-xs text-muted">{member.email}</div>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {(['admin', 'analyst', 'viewer'] as Role[]).map((r) => {
            const rc = roleConfig(r)
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-sm transition-all',
                  role === r
                    ? cn(rc.bgClass, rc.borderClass)
                    : 'border-border hover:bg-surface-2'
                )}
              >
                <rc.icon size={15} className={role === r ? rc.textClass : 'text-muted'} />
                <span className={cn('font-medium', role === r ? rc.textClass : 'text-am-text')}>{rc.label}</span>
                {role === r && <Check size={14} className={cn('ml-auto', rc.textClass)} />}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-surface-2 border border-border text-am-text text-sm font-medium rounded-lg hover:bg-surface-2/80 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(member.id, role); onClose() }}
            className="flex-1 py-2.5 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [members, setMembers] = useState<User[]>(TEAM_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [editingMember, setEditingMember] = useState<User | null>(null)

  const handleRoleChange = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
  }

  const handleDeactivate = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m))
    )
  }

  const activeCount = members.filter((m) => m.status === 'active').length
  const adminCount = members.filter((m) => m.role === 'admin').length
  const analystCount = members.filter((m) => m.role === 'analyst').length
  const viewerCount = members.filter((m) => m.role === 'viewer').length

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-am-text">Team</h1>
          <p className="text-sm text-muted mt-0.5">Manage team members, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent1 text-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent1/20"
        >
          <UserPlus size={15} />
          Invite Member
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: members.length, color: 'text-am-text' },
          { label: 'Active', value: activeCount, color: 'text-good' },
          { label: 'Admins', value: adminCount, color: 'text-accent1' },
          { label: 'Analysts', value: analystCount, color: 'text-accent2' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl px-4 py-3">
            <div className="text-xs text-muted mb-1">{s.label}</div>
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Members grid */}
      <section aria-label="Team members">
        <h2 className="text-sm font-semibold text-am-text mb-3">
          Members <span className="text-muted font-normal ml-1">({members.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((member) => {
            const rc = roleConfig(member.role)
            const sc = statusConfig(member.status)
            const RoleIcon = rc.icon

            return (
              <div
                key={member.id}
                className={cn(
                  'bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-border/80',
                  member.status === 'inactive' && 'opacity-60'
                )}
              >
                {/* Top row: avatar + name + status */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent1/20 to-accent2/20 border border-border flex items-center justify-center font-bold text-am-text text-sm flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-am-text truncate">{member.name}</span>
                      <span className={cn('inline-flex items-center gap-1 text-xs font-medium', sc.textClass)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sc.dotClass)} />
                        {sc.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted truncate">{member.email}</div>
                    <div className="text-xs text-muted/70 mt-0.5">{member.title}</div>
                  </div>
                </div>

                {/* Role + last active */}
                <div className="flex items-center justify-between">
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-xs font-semibold', rc.bgClass, rc.textClass, rc.borderClass)}>
                    <RoleIcon size={11} />
                    {rc.label}
                  </span>
                  <span className="text-xs text-muted">
                    {member.lastActive ? `Active ${timeAgo(member.lastActive)}` : 'Never active'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-muted hover:text-accent1 hover:bg-accent1/5 border border-border rounded-lg transition-colors"
                  >
                    <Pencil size={11} />
                    Edit Role
                  </button>
                  <button
                    onClick={() => handleDeactivate(member.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border rounded-lg transition-colors',
                      member.status === 'active'
                        ? 'text-muted hover:text-bad hover:bg-bad/5 border-border'
                        : 'text-good hover:bg-good/5 border-good/30'
                    )}
                  >
                    <UserX size={11} />
                    {member.status === 'active' ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Role permissions table */}
      <section aria-label="Role permissions" className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold text-am-text">Role Permissions</h2>
          <p className="text-xs text-muted mt-0.5">What each role can do in AuroraMetrics</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-1/2">Permission</th>
                {(['admin', 'analyst', 'viewer'] as Role[]).map((r) => {
                  const rc = roleConfig(r)
                  return (
                    <th key={r} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      <span className={cn('inline-flex items-center gap-1.5', rc.textClass)}>
                        <rc.icon size={11} />
                        {rc.label}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PERMISSIONS.map((perm, i) => (
                <tr key={perm.name} className={cn('transition-colors hover:bg-surface-2/50', i % 2 === 0 ? '' : 'bg-surface/50')}>
                  <td className="px-5 py-3 text-sm text-muted">{perm.name}</td>
                  {(['admin', 'analyst', 'viewer'] as const).map((role) => (
                    <td key={role} className="px-4 py-3 text-center">
                      {perm[role] ? (
                        <Check size={14} className="text-good mx-auto" />
                      ) : (
                        <X size={13} className="text-muted/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {editingMember && (
        <EditRoleModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleRoleChange}
        />
      )}
    </div>
  )
}
