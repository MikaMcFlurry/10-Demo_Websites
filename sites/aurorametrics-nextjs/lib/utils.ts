import { clsx, type ClassValue } from 'clsx'

// ─── className merger ──────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

// ─── Number formatting ─────────────────────────────────────────────────────────

export function formatNumber(value: number, options?: { compact?: boolean }): string {
  if (options?.compact) {
    if (Math.abs(value) >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (Math.abs(value) >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
  }
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(
  value: number,
  options?: { compact?: boolean; decimals?: number }
): string {
  const decimals = options?.decimals ?? 0
  if (options?.compact) {
    if (Math.abs(value) >= 1_000_000) {
      return '$' + (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (Math.abs(value) >= 1_000) {
      return '$' + (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + '%'
}

// ─── Date formatting ───────────────────────────────────────────────────────────

export function formatDate(dateStr: string, style: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
  }

  return new Intl.DateTimeFormat('en-US', formats[style]).format(d)
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export function timeAgo(dateStr: string): string {
  const now = new Date('2025-07-15T12:00:00Z').getTime()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 30) return formatDate(dateStr, 'medium')
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

// ─── Sparkline data ────────────────────────────────────────────────────────────

export function generateSparklineData(
  length: number,
  baseValue: number,
  variance: number
): { value: number }[] {
  let current = baseValue
  return Array.from({ length }, (_, i) => {
    const trend = (i / length) * variance * 0.3
    const noise = (Math.sin(i * 2.1) * variance * 0.5) + (Math.cos(i * 3.7) * variance * 0.2)
    current = baseValue + trend + noise
    return { value: Math.max(0, Math.round(current)) }
  })
}

// ─── CSV export ────────────────────────────────────────────────────────────────

export function exportToCSV(
  rows: Record<string, string | number>[],
  columns: { key: string; label: string }[],
  filename: string
): void {
  const header = columns.map((c) => `"${c.label}"`).join(',')
  const body = rows
    .map((row) => columns.map((c) => `"${String(row[c.key] ?? '')}"`).join(','))
    .join('\n')
  const csv = `${header}\n${body}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Misc ──────────────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
