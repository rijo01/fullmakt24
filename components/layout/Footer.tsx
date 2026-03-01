import Link from 'next/link'

const footerSections = [
  {
    title: 'Fullmakter',
    links: [
      { label: 'Alla mallar', href: '/mallar' },
      { label: 'Föräldrar & Barn', href: '/mallar?category=foraldrar-barn' },
      { label: 'Ekonomi & Bank', href: '/mallar?category=ekonomi-myndigheter' },
      { label: 'Vård & Omsorg', href: '/mallar?category=vard-omsorg' },
      { label: 'Boende', href: '/mallar?category=boende-vardag' },
      { label: 'Resa & Transport', href: '/mallar?category=resa-transport' },
    ],
  },
  {
    title: 'Tjänster',
    links: [
      { label: 'Priser', href: '/priser' },
      { label: 'BankID-signering', href: '/priser' },
      { label: 'API för företag', href: '/api-docs' },
      { label: 'Blogg', href: '/blogg' },
    ],
  },
  {
    title: 'Om oss',
    links: [
      { label: 'Om Fullmakt24', href: '/om' },
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'Integritetspolicy', href: '/integritet' },
      { label: 'Villkor', href: '/villkor' },
      { label: 'Cookiepolicy', href: '/cookies' },
    ],
  },
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
              Juridiskt granskad
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              GDPR-säker
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              50 000+ användare
            </span>
            <span className="flex items-center gap-2">
              🇸🇪 Svensk lag
            </span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gold-400">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3c-1.2 0-2.4.6-3 1.5A3.5 3.5 0 004 8v9a4 4 0 004 4h8a4 4 0 004-4V8a3.5 3.5 0 00-5-3.5A3.5 3.5 0 0012 3z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <span className="font-heading font-bold text-white">Fullmakt</span>
                <span className="font-heading font-bold text-gold-400">24</span>
              </div>
            </div>
            <p className="text-sm text-navy-200 leading-relaxed mb-6">
              Sveriges smartaste plattform för fullmakter och medgivanden. Skapa juridiskt korrekta dokument på minuter.
            </p>
          </div>

          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-navy-200 hover:text-gold-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-navy-300">
            © {new Date().getFullYear()} Fullmakt24.se. Alla rättigheter förbehållna.
          </p>
          <p className="text-xs text-navy-300">
            Fullmakt24.se tillhandahåller mallar och verktyg. Vi ersätter inte juridisk rådgivning.
          </p>
        </div>
      </div>
    </footer>
  )
}
