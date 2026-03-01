import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AuroraMetrics — Real-time product & revenue analytics',
    template: '%s | AuroraMetrics',
  },
  description:
    'AuroraMetrics gives growth teams real-time product analytics, revenue attribution, and behavioral cohorts in a single dark-mode command center.',
  keywords: ['product analytics', 'revenue analytics', 'DAU', 'MRR', 'churn', 'cohort analysis'],
  authors: [{ name: 'AuroraMetrics' }],
  openGraph: {
    title: 'AuroraMetrics — Real-time product & revenue analytics',
    description:
      'Turn every click into clarity. Real-time product analytics, revenue attribution, and behavioral cohorts for modern teams.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuroraMetrics',
    description: 'Real-time product & revenue analytics for modern teams.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
