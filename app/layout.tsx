import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@next/third-parties/google'
import { templates } from '@/data/templates'

export const metadata: Metadata = {
  title: {
    default: 'Fullmakt24.se – Din fullmakt klar på 3 minuter',
    template: '%s | Fullmakt24.se',
  },
  description: `${templates.length} mallar för fullmakter och medgivanden, utformade enligt svensk avtalsrätt. Anpassade för svenska förhållanden. Klara att skriva ut och skriva under.`,
  keywords: ['fullmakt', 'medgivande', 'fullmakt mall', 'fullmakt gratis', 'fullmakt barn', 'fullmakt bank', 'juridiskt dokument', 'Sverige'],
  authors: [{ name: 'Fullmakt24.se' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://fullmakt24.se',
    siteName: 'Fullmakt24.se',
    title: 'Fullmakt24.se – Din fullmakt klar på 3 minuter',
    description: 'Över 200 mallar för fullmakter och medgivanden, utformade enligt svensk avtalsrätt.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fullmakt24.se – Din fullmakt klar på 3 minuter',
    description: 'Över 200 mallar för fullmakter och medgivanden, utformade enligt svensk avtalsrätt.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://fullmakt24.se' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-surface text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-K5Y04XM2VE" />
      </body>
    </html>
  )
}
