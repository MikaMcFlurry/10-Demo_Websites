'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string
  delta: number
  deltaLabel?: string
  trend: 'good' | 'bad' | 'neutral'
  data: { value: number }[]
  loading?: boolean
  className?: string
}

const trendConfig = {
  good: {
    color: '#2DFFB3',
    icon: TrendingUp,
    bgClass: 'bg-good/10',
    textClass: 'text-good',
  },
  bad: {
    color: '#FF3D6E',
    icon: TrendingDown,
    bgClass: 'bg-bad/10',
    textClass: 'text-bad',
  },
  neutral: {
    color: '#A9B3D6',
    icon: Minus,
    bgClass: 'bg-muted/10',
    textClass: 'text-muted',
  },
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded px-2 py-1 text-xs text-am-text shadow-lg">
      {payload[0].value.toLocaleString()}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-8 w-24" />
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-12 w-full" />
    </div>
  )
}

export default function KpiCard({
  title,
  value,
  delta,
  deltaLabel = 'vs prev period',
  trend,
  data,
  loading = false,
  className,
}: KpiCardProps) {
  if (loading) return <SkeletonCard />

  const config = trendConfig[trend]
  const Icon = config.icon
  const isPositive = delta > 0
  const deltaPrefix = isPositive ? '+' : ''

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 card-hover',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">{title}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
            config.bgClass,
            config.textClass
          )}
        >
          <Icon size={10} />
          {deltaPrefix}{delta}%
        </span>
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-am-text tracking-tight">{value}</div>

      {/* Delta label */}
      <div className="text-xs text-muted">{deltaLabel}</div>

      {/* Sparkline */}
      <div className="h-12 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: config.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
