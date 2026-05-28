import Link from 'next/link'
import { categories } from '@/data/templates'

const tjansterLinks = [
  { label: 'Alla mallar', href: '/mallar' },
  { label: 'Priser', href: '/priser' },
  { label: 'Blogg', href: '/blogg' },
]

const omOssLinks = [
  { label: 'Om Fullmakt24', href: '/om' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Villkor', href: '/villkor' },
  { label: 'Integritetspolicy', href: '/integritet' },
  { label: 'Cookiepolicy', href: '/cookies' },
]

export function Footer() {
  return (
    <footer className="bg-navy-500 text-white mt-24">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="section-padding py-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-navy-200">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              Enligt svensk lag
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              GDPR-säker
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              49 kr per mall
            </span>
            <span className="flex items-center gap-2">
              🇸🇪 Svensk lag
            </span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold-400">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3c-1.2 0-2.4.6-3 1.5A3.5 3.5 0 004 8v9a4 4 0 004 4h8a4 4 0 004-4V8a3.5 3.5 0 00-5-3.5A3.5 3.5 0 0012 3z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <span className="font-heading font-bold text-white text-lg">Fullmakt</span>
                <span className="font-heading font-bold text-gold-400 text-lg">24</span>
              </div>
            </Link>
            <p className="text-sm text-navy-200 leading-relaxed mb-4">
              Sveriges smartaste plattform för fullmakter och medgivanden. Skapa juridiskt korrekta dokument på minuter.
            </p>
            <p className="text-xs text-navy-300">
              support@fullmakt24.se
            </p>
          </div>

          {/* Kategorier (alla 9) */}
          <div className="col-span-2 md:col-span-5">
            <h3 className="text-sm font-semibold text-white mb-4">Kategorier</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {categories.map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/mallar?category=${cat.slug}`}
                    className="text-sm text-navy-200 hover:text-gold-400 transition-colors flex items-center gap-2"
                  >
                    <span aria-hidden="true">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tjänster */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Tjänster</h3>
            <ul className="space-y-2.5">
              {tjansterLinks.map(link => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-navy-200 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Om oss */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Om oss</h3>
            <ul className="space-y-2.5">
              {omOssLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-200 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-navy-300">
            © 2026 Fullmakt24.se. Alla rättigheter förbehållna.
          </p>
          <p className="text-xs text-navy-300">
            Fullmakt24.se tillhandahåller mallar och verktyg. Vi ersätter inte juridisk rådgivning.
          </p>
        </div>
      </div>
    </footer>
  )
}
