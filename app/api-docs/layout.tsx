import type { Metadata } from 'next'

// Sidan ska inte indexeras och har ingen canonical.
export const metadata: Metadata = {
  title: 'API-dokumentation',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
