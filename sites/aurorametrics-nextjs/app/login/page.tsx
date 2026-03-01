'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { login, getUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to overview
  useEffect(() => {
    const user = getUser()
    if (user) router.replace('/app/overview')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    // Small artificial delay for perceived security
    await new Promise((r) => setTimeout(r, 500))

    const success = login(email.trim(), password)
    setLoading(false)

    if (success) {
      router.push('/app/overview')
    } else {
      setError('Invalid email or password. Try admin@aurorametrics.demo / demo')
    }
  }

  return (
    <div className="relative min-h-screen bg-bg flex items-center justify-center overflow-hidden px-4">
      {/* Animated gradient background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(33,212,253,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(183,33,255,0.07) 0%, transparent 60%)
          `,
        }}
      />

      {/* Subtle animated orbs */}
      <div
        className="pointer-events-none absolute z-0"
        aria-hidden="true"
        style={{
          top: '10%',
          left: '5%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33,212,253,0.05) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute z-0"
        aria-hidden="true"
        style={{
          bottom: '5%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(183,33,255,0.05) 0%, transparent 70%)',
          animation: 'pulse 10s ease-in-out infinite reverse',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center mb-4 shadow-lg shadow-accent1/20">
            <Zap size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-am-text tracking-tight">AuroraMetrics</span>
          <span className="text-xs text-muted mt-1">Analytics Platform</span>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-lg font-bold text-am-text mb-1 text-center">Sign in to AuroraMetrics</h1>
          <p className="text-sm text-muted text-center mb-6">Enter your credentials to access your dashboard</p>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 bg-bad/10 border border-bad/30 rounded-lg px-4 py-3 mb-5 text-sm text-bad"
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={cn(
                  'w-full bg-surface-2 border rounded-lg px-4 py-2.5 text-sm text-am-text placeholder:text-muted/60',
                  'focus:outline-none focus:ring-1 transition-colors',
                  error
                    ? 'border-bad/50 focus:border-bad focus:ring-bad/20'
                    : 'border-border focus:border-accent1 focus:ring-accent1/20'
                )}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full bg-surface-2 border rounded-lg px-4 py-2.5 pr-11 text-sm text-am-text placeholder:text-muted/60',
                    'focus:outline-none focus:ring-1 transition-colors',
                    error
                      ? 'border-bad/50 focus:border-bad focus:ring-bad/20'
                      : 'border-border focus:border-accent1 focus:ring-accent1/20'
                  )}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-am-text transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                'bg-accent1 text-bg hover:brightness-110 active:scale-[0.98]',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'shadow-lg shadow-accent1/20 mt-2'
              )}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 px-4 py-3 bg-accent1/5 border border-accent1/20 rounded-lg">
            <p className="text-xs text-muted text-center leading-relaxed">
              <span className="font-semibold text-accent1">Demo credentials:</span>{' '}
              <span className="font-mono text-am-text">admin@aurorametrics.demo</span>
              {' / '}
              <span className="font-mono text-am-text">demo</span>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted">
          <Link
            href="/pricing"
            className="hover:text-am-text transition-colors hover:underline"
          >
            View pricing
          </Link>
          <span className="text-border">·</span>
          <span>© 2025 AuroraMetrics</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
