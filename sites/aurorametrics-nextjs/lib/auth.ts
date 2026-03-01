'use client'

import type { User } from '@/data/types'
import { DEMO_USERS } from '@/data/users'

const STORAGE_KEY = 'aurora_user'

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function login(email: string, password: string): boolean {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!user) return false

  const safeUser: User = { ...user, password: '' }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
  return true
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === 'admin'
}

export function requireAuth(): User | null {
  if (typeof window === 'undefined') return null
  const user = getUser()
  if (!user) {
    window.location.href = '/login'
    return null
  }
  return user
}
