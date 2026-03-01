'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, exportToCSV } from '@/lib/utils'

export interface Column<T> {
  key: keyof T & string
  label: string
  type?: 'string' | 'number' | 'currency' | 'percent' | 'date' | 'badge'
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends Record<string, string | number>> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
  exportFilename?: string
  selectable?: boolean
  loading?: boolean
  emptyMessage?: string
  className?: string
}

const PAGE_SIZE_DEFAULT = 10

type SortDir = 'asc' | 'desc' | null

function formatCellValue(value: string | number, type?: string): string {
  if (value === undefined || value === null) return '—'
  if (type === 'currency') return `$${Number(value).toLocaleString()}`
  if (type === 'percent') return `${value}%`
  if (type === 'number') return Number(value).toLocaleString()
  if (type === 'date') return new Date(String(value)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return String(value)
}

export default function DataTable<T extends Record<string, string | number>>({
  columns,
  data,
  pageSize = PAGE_SIZE_DEFAULT,
  searchable = true,
  exportable = true,
  exportFilename = 'export',
  selectable = false,
  loading = false,
  emptyMessage = 'No data found.',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    )
  }, [data, query])

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const aNum = Number(av)
      const bNum = Number(bv)
      const numeric = !isNaN(aNum) && !isNaN(bNum)
      const cmp = numeric ? aNum - bNum : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'))
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(paged.map((_, i) => (page - 1) * pageSize + i)))
    }
  }

  const toggleSelect = (idx: number) => {
    const next = new Set(selected)
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
    setSelected(next)
  }

  const handleExport = () => {
    const rows =
      selected.size > 0
        ? sorted.filter((_, i) => selected.has(i))
        : sorted
    exportToCSV(rows as Record<string, string | number>[], columns, `${exportFilename}.csv`)
  }

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={12} className="text-muted opacity-50" />
    if (sortDir === 'asc') return <ChevronUp size={12} className="text-accent1" />
    return <ChevronDown size={12} className="text-accent1" />
  }

  if (loading) {
    return (
      <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
        <div className="p-4 border-b border-border flex gap-3">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-8 w-24 ml-auto" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex gap-4">
              <div className="skeleton h-4 flex-1" />
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
      {/* Toolbar */}
      {(searchable || exportable) && (
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-surface">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                placeholder="Filter rows…"
                className="w-full bg-surface-2 border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-am-text placeholder:text-muted focus:outline-none focus:border-accent1 transition-colors"
              />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {selectable && selected.size > 0 && (
              <span className="text-xs text-muted">{selected.size} selected</span>
            )}
            {exportable && (
              <button
                onClick={handleExport}
                aria-label="Export to CSV"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-2 border border-border text-muted hover:text-am-text hover:border-accent1 rounded-lg transition-colors"
              >
                <Download size={12} />
                Export CSV
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && selected.size === paged.length}
                    onChange={toggleSelectAll}
                    className="accent-accent1 cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap',
                    col.sortable !== false && 'cursor-pointer hover:text-am-text select-none',
                    col.className
                  )}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => {
                const globalIdx = (page - 1) * pageSize + ri
                return (
                  <tr
                    key={ri}
                    className={cn(
                      'hoverable transition-colors',
                      selectable && selected.has(globalIdx) && 'bg-accent1/5'
                    )}
                  >
                    {selectable && (
                      <td className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(globalIdx)}
                          onChange={() => toggleSelect(globalIdx)}
                          className="accent-accent1 cursor-pointer"
                          aria-label={`Select row ${ri + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-am-text',
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : formatCellValue(row[col.key], col.type)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border bg-surface flex items-center justify-between">
          <span className="text-xs text-muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="p-1.5 rounded text-muted hover:text-am-text disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1
              if (totalPages > 5) {
                if (page <= 3) p = i + 1
                else if (page >= totalPages - 2) p = totalPages - 4 + i
                else p = page - 2 + i
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-7 h-7 rounded text-xs font-medium transition-colors',
                    page === p
                      ? 'bg-accent1 text-bg'
                      : 'text-muted hover:text-am-text'
                  )}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="p-1.5 rounded text-muted hover:text-am-text disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
