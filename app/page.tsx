'use client'

import Link from 'next/link'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { categories, getPopularTemplates, templates, searchTemplates } from '@/data/templates'
import { trackEvent } from '@/components/GoogleAnalytics'

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-navy-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-heading font-semibold text-navy-600 pr-4 group-hover:text-gold-600 transition-colors">{q}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-navy-300 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="pb-5 text-sm text-navy-400 leading-relaxed -mt-1">{a}</div>}
    </div>
  )
}

function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    return searchTemplates(query).slice(0, 5)
  }, [query])

  useEffect(() => {
    if (query.length < 2) return
    const handle = setTimeout(() => trackEvent('search', { search_term: query }), 600)
    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/mallar?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto lg:mx-0 mb-8">
      <form onSubmit={submit} className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={`Sök bland ${templates.length} mallar – t.ex. bankfullmakt, framtidsfullmakt...`}
          className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-navy-600 placeholder:text-navy-300 shadow-xl shadow-black/10 focus:outline-none focus:ring-4 focus:ring-gold-500/40"
          aria-label="Sök fullmaktsmall"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold !py-2.5 !px-5 !rounded-xl text-sm">
          Sök
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-navy-100 overflow-hidden">
          <ul className="max-h-96 overflow-y-auto">
            {results.map(t => (
              <li key={t.id}>
                <Link
                  href={`/mallar/${t.categorySlug}/${t.slug}`}
                  onClick={() => trackEvent('select_content', { content_type: 'template', item_id: t.slug, item_name: t.name, item_category: t.category })}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-navy-50 transition-colors border-b border-navy-50 last:border-0"
                >
                  <span className="text-xl shrink-0 mt-0.5">{categories.find(c => c.slug === t.categorySlug)?.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-navy-600 text-sm truncate">{t.name}</div>
                    <div className="text-xs text-navy-400 line-clamp-1">{t.description}</div>
                  </div>
                  <span className="text-xs font-semibold text-gold-600 shrink-0 mt-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/mallar?search=${encodeURIComponent(query.trim())}`}
            className="block text-center text-sm font-semibold text-gold-600 py-3 bg-navy-50 hover:bg-navy-100 transition-colors"
          >
            Visa alla resultat för &ldquo;{query}&rdquo; →
          </Link>
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-navy-100 p-5 text-center text-sm text-navy-400">
          Inga mallar matchade &ldquo;{query}&rdquo;. <Link href="/mallar" className="text-gold-600 font-semibold">Visa alla mallar →</Link>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const popular = getPopularTemplates(6)

  const faqs = [
    { q: 'Är fullmakterna juridiskt giltiga?', a: 'Ja, alla våra mallar är utformade enligt gällande svensk lagstiftning, bland annat avtalslagen (1915:218). De uppfyller formkraven för giltiga fullmakter enligt svensk lag.' },
    { q: 'Kostar det att skapa en fullmakt?', a: 'Du kan skapa upp till 3 dokument per månad helt gratis med vattenstämpel. För obegränsade dokument utan vattenstämpel finns Standard (149 kr/mån) och Premium (299 kr/mån).' },
    { q: 'Kan jag signera med BankID?', a: 'Ja, BankID-signering är tillgängligt i vårt Premium-abonnemang. Det ger dokumentet extra juridisk tyngd och gör det enklare att verifiera identiteten.' },
    { q: 'Hur lång tid tar det att skapa ett dokument?', a: 'De flesta användare skapar sitt dokument på under 3 minuter. Vår guidade ifyllning gör processen snabb och enkel.' },
    { q: 'Sparas mina personuppgifter?', a: 'Vi följer GDPR strikt. Dina uppgifter lagras krypterat och används bara för att generera ditt dokument. Du kan när som helst radera dina data.' },
    { q: 'Kan jag redigera dokumentet efter nedladdning?', a: 'Du kan ladda ner som PDF för utskrift. Om du behöver göra ändringar kan du alltid gå tillbaka och skapa en ny version via ditt konto.' },
    { q: 'Accepteras fullmakten av banker och myndigheter?', a: 'Ja, våra mallar är utformade enligt de krav som ställs av svenska banker, Skatteverket, Försäkringskassan och andra myndigheter. Vissa banker har dock egna blanketter.' },
    { q: 'Kan jag använda tjänsten som företag?', a: 'Absolut! Med vårt Premium-abonnemang får du API-åtkomst, teamkonton för upp till 5 användare och white-label PDF utan vår logotyp.' },
  ]

  const testimonials = [
    { name: 'Maria L.', role: 'Förälder, Stockholm', text: 'Behövde en resefullmakt för barnen akut. Hade dokumentet klart på under 5 minuter. Fantastisk tjänst!', rating: 5 },
    { name: 'Anders K.', role: 'Företagare, Göteborg', text: 'Använder Fullmakt24 för alla våra företagsfullmakter. Sparar timmar varje vecka jämfört med att göra dem manuellt.', rating: 5 },
    { name: 'Sofia R.', role: 'God man, Uppsala', text: 'Ovärderligt verktyg som god man. Alla mallar jag behöver finns här och de är juridiskt korrekta.', rating: 5 },
  ]

  const trustSignals = [
    { value: `${templates.length} mallar`, label: 'Enligt svensk lag', icon: '📋' },
    { value: '49 kr', label: 'per dokument', icon: '💳' },
    { value: '3 minuter', label: 'från start till PDF', icon: '⏱️' },
    { value: 'Svensk lag', label: 'korrekta lagrum', icon: '⚖️' },
  ]

  const steps = [
    { num: '01', title: 'Välj mall', desc: `Välj bland ${templates.length} mallar utformade enligt svensk lag, anpassade för ditt behov.`, iconPath: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' },
    { num: '02', title: 'Fyll i uppgifter', desc: 'Guidad ifyllning med validering. Dina uppgifter sparas automatiskt.', iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { num: '03', title: 'Ladda ner PDF', desc: 'Ladda ner direkt, signera med BankID eller skicka via e-post.', iconPath: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fullmakt24.se',
    url: 'https://fullmakt24.se',
    logo: 'https://fullmakt24.se/icon.png',
    description: 'Sveriges smartaste plattform för fullmakter och medgivanden enligt svensk lag. Skapa din PDF på 3 minuter.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@fullmakt24.se',
      contactType: 'customer support',
      availableLanguage: ['Swedish', 'English'],
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fullmakt24.se',
    url: 'https://fullmakt24.se',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://fullmakt24.se/mallar?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-500 via-navy-500 to-navy-700" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[5%] w-96 h-96 bg-navy-400/20 rounded-full blur-3xl" />

        <div className="relative section-padding pt-16 pb-28 lg:pt-24 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-gold-300 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Ny: BankID-signering tillgänglig
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-6">
                Din fullmakt –{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-gold-400">klar på 3 minuter</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-gold-500/20 rounded-sm" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-navy-200 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                {templates.length} juridiskt korrekta mallar. Anpassade för dig. Klara att skriva ut eller signera digitalt.
              </p>

              <HeroSearch />

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Link href="/mallar" className="btn-gold text-base !py-4 !px-8 !rounded-2xl">
                  Hitta din fullmakt →
                </Link>
                <Link href="/priser" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/90 font-semibold rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                  Se priser
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-sm text-navy-200">
                {['Enligt svensk lag', 'GDPR-säker', '50 000+ svenskar', 'BankID-kompatibel'].map(b => (
                  <span key={b} className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2.5"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Document mockup */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 to-navy-400/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/20 p-6 max-w-md mx-auto border border-white/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navy-100">
                  <div className="w-10 h-10 bg-navy-500 rounded-xl flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold-400"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-heading font-bold text-navy-500">FULLMAKT</div>
                    <div className="text-xs text-navy-300">Fullmakt24.se • 2026</div>
                  </div>
                  <div className="ml-auto"><span className="badge-popular text-[10px]">Signerad ✓</span></div>
                </div>
                <div className="space-y-4 font-mono text-xs text-navy-400">
                  <div>
                    <div className="text-[10px] text-navy-300 uppercase tracking-wider mb-1">Fullmaktsgivare</div>
                    <div className="bg-navy-50 rounded-lg p-3">
                      <div className="text-navy-600 font-medium">Anna Svensson</div>
                      <div>880515-XXXX</div>
                      <div>Kungsgatan 12, Stockholm</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-navy-300 uppercase tracking-wider mb-1">Fullmaktshavare</div>
                    <div className="bg-navy-50 rounded-lg p-3">
                      <div className="text-navy-600 font-medium">Erik Johansson</div>
                      <div>750923-XXXX</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-navy-300 uppercase tracking-wider mb-1">Uppdrag</div>
                    <div className="bg-gold-50 rounded-lg p-3 border border-gold-200/50">
                      <div className="text-navy-500 leading-relaxed">Härmed ger jag, Anna Svensson, fullmakt till Erik Johansson att företräda mig i bankärenden hos Handelsbanken...</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2"><div className="w-16 h-6 bg-navy-100 rounded" /><span className="text-[10px] text-navy-300">Signatur</span></div>
                    <div className="text-[10px] text-navy-300">2026-05-15</div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">PDF klar ↓</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto"><path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F8F9FB"/></svg>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section className="section-padding -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-navy-900/5 border border-navy-100/50 p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map(item => (
              <div key={item.value} className="flex items-center gap-3 lg:gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gold-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-base lg:text-lg font-heading font-bold text-navy-600 truncate">{item.value}</div>
                  <div className="text-xs lg:text-sm text-navy-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR (top 6) ═══ */}
      <section className="section-padding py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-gold-50 text-gold-600 text-sm font-semibold rounded-full mb-4">Populärast just nu</span>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500">Populäraste mallarna</h2>
          <p className="text-navy-400 mt-3">De mest använda mallarna i Sverige just nu.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {popular.map(t => {
            const cat = categories.find(c => c.slug === t.categorySlug)
            return (
              <Link
                key={t.id}
                href={`/mallar/${t.categorySlug}/${t.slug}`}
                onClick={() => trackEvent('select_content', { content_type: 'template', item_id: t.slug, item_name: t.name, item_category: t.category })}
                className="card-interactive p-6 group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{cat?.icon}</span>
                  <span className={t.badge === 'popular' ? 'badge-popular' : t.badge === 'premium' ? 'badge-premium' : 'badge-gratis'}>
                    {t.badge === 'popular' ? 'Populär' : t.badge === 'premium' ? 'Premium' : 'Gratis'}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-navy-600 text-base mb-2 group-hover:text-gold-600 transition-colors line-clamp-2 flex-1">
                  {t.name}
                </h3>
                <p className="text-sm text-navy-400 line-clamp-2 mb-4">{t.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-navy-50">
                  <span className="text-xs text-navy-300">{t.usageCount.toLocaleString('sv-SE')} skapade</span>
                  <span className="text-sm font-semibold text-gold-600 group-hover:text-gold-700">Skapa nu →</span>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link href="/mallar" className="inline-flex items-center gap-2 px-8 py-3 bg-navy-500 text-white rounded-xl hover:bg-navy-600 transition-all font-semibold">
            Se alla {templates.length} mallar →
          </Link>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section-padding py-20 lg:py-28 bg-white">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-gold-50 text-gold-600 text-sm font-semibold rounded-full mb-4">Så fungerar det</span>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500">Klart på tre enkla steg</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {steps.map(step => (
            <div key={step.num} className="text-center group">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-navy-50 rounded-2xl group-hover:bg-gold-50 transition-colors duration-300" />
                <div className="relative flex items-center justify-center h-full">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500"><path d={step.iconPath} /></svg>
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-navy-500 text-white text-xs font-bold rounded-lg flex items-center justify-center">{step.num}</div>
              </div>
              <h3 className="text-xl font-heading font-bold text-navy-500 mb-2">{step.title}</h3>
              <p className="text-navy-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section-padding py-20 lg:py-28">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-navy-50 text-navy-500 text-sm font-semibold rounded-full mb-4">Kategorier</span>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-4">Fullmakter för alla situationer</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">Oavsett om det gäller resa med barn, bankärenden eller bostadsaffärer – vi har mallen du behöver.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map(cat => (
            <Link key={cat.slug} href={`/mallar?category=${cat.slug}`} className="card-interactive p-6 group">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-navy-500 text-lg mb-1 group-hover:text-gold-600 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-navy-400 line-clamp-2 mb-3">{cat.description}</p>
                  <span className="text-xs font-semibold text-gold-600">{cat.templateCount} mallar →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section-padding py-20 lg:py-28 bg-white">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-gold-50 text-gold-600 text-sm font-semibold rounded-full mb-4">Recensioner</span>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500">Vad våra användare säger</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#E8A020"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-navy-500 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div><div className="font-semibold text-navy-600 text-sm">{t.name}</div><div className="text-xs text-navy-400">{t.role}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-padding py-20 lg:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-navy-50 text-navy-500 text-sm font-semibold rounded-full mb-4">Vanliga frågor</span>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500">Har du frågor?</h2>
          </div>
          <div className="card p-6 lg:p-8">
            {faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-padding py-20 lg:py-28">
        <div className="bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-400/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">Redo att skapa din fullmakt?</h2>
            <p className="text-navy-200 text-lg max-w-xl mx-auto mb-8">Det tar bara 3 minuter. Välj mall, fyll i uppgifter och ladda ner din PDF direkt.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/mallar" className="btn-gold text-base !py-4 !px-8 !rounded-2xl">Hitta din fullmakt →</Link>
              <Link href="/priser" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/90 font-semibold rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">Se priser</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
