import type { Metadata } from 'next'
import Link from 'next/link'

// Next.js sätter själv <meta name="robots" content="noindex"> på 404-svar.
// robots: null tar bort rotlayoutens "index, follow" så att bara den taggen finns.
export const metadata: Metadata = {
  title: 'Sidan hittades inte',
  robots: null,
}

export default function NotFound() {
  return (
    <div className="section-padding py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-6">Sidan hittades inte</h1>
        <p className="text-navy-400 leading-relaxed mb-8">Adressen finns inte, eller så har sidan flyttats.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/mallar" className="btn-gold">Alla mallar</Link>
          <Link href="/" className="btn-primary">Till startsidan</Link>
        </div>
      </div>
    </div>
  )
}
