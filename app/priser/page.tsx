'use client'

import Link from 'next/link'

export default function PriserPage() {
  const plans = [
    {
      name: 'Gratis',
      price: '0',
      unit: 'kr',
      description: 'Testa och förhandsgranska',
      badge: null,
      features: [
        'Fyll i och förhandsgranska',
        'Alla 124 mallar tillgängliga',
        'PDF med vattenstämpel',
      ],
      limitations: ['Vattenstämpel på dokumentet'],
      cta: 'Kom igång gratis',
      ctaStyle: 'btn-secondary',
      href: '/mallar',
    },
    {
      name: 'Enskilt dokument',
      price: '49',
      unit: 'kr',
      description: 'Perfekt när du behöver en fullmakt',
      badge: 'Mest populär',
      features: [
        '1 professionell PDF',
        'Ingen vattenstämpel',
        'Ren och klar att skriva ut',
        'Ladda ner obegränsat antal gånger',
        'Redigera i 7 dagar',
      ],
      limitations: [],
      cta: 'Skapa dokument – 49 kr',
      ctaStyle: 'btn-gold',
      href: '/mallar',
    },
    {
      name: 'Paket – 5 dokument',
      price: '149',
      unit: 'kr',
      description: 'Spara 30% – perfekt för familjen',
      badge: 'Bäst värde',
      features: [
        '5 professionella PDF:er',
        'Ingen vattenstämpel',
        'Blanda valfria mallar',
        'Gäller i 12 månader',
        'Redigera i 30 dagar',
        '29,80 kr per dokument',
      ],
      limitations: [],
      cta: 'Köp 5-pack – 149 kr',
      ctaStyle: 'btn-primary',
      href: '/mallar',
    },
    {
      name: 'Obegränsat 30 dagar',
      price: '199',
      unit: 'kr / 30 dagar',
      description: 'Dödsbo, flytt eller andra storprojekt',
      badge: null,
      features: [
        'Obegränsade dokument i 30 dagar',
        'Alla 124 mallar',
        'Ingen vattenstämpel',
        'Redigera fritt under perioden',
        'Perfekt vid dödsbo eller flytt',
      ],
      limitations: [],
      cta: 'Starta 30 dagar – 199 kr',
      ctaStyle: 'btn-primary',
      href: '/mallar',
    },
  ]

  const addons = [
    {
      name: 'BankID-signering',
      price: '+29 kr',
      desc: 'Digital signering med BankID för extra juridisk tyngd.',
      icon: '🔐',
    },
    {
      name: 'Tvåspråkig version (SV + EN)',
      price: '+19 kr',
      desc: 'Få dokumentet på både svenska och engelska – perfekt vid utlandsresor.',
      icon: '🌍',
    },
    {
      name: 'Juridisk snabbgranskning',
      price: '+149 kr',
      desc: 'En jurist granskar ditt dokument inom 24 timmar.',
      icon: '⚖️',
    },
  ]

  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Priser</span>
      </nav>

      <div className="text-center mb-14">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold text-navy-500 mb-4">
          Betala per dokument – inga abonnemang
        </h1>
        <p className="text-lg text-navy-400 max-w-2xl mx-auto">
          Skapa din fullmakt och betala bara när du behöver. Ingen bindningstid, inga dolda avgifter.
        </p>
      </div>

      {/* Pricing grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-20">
        {plans.map(plan => (
          <div key={plan.name} className={`card p-6 flex flex-col ${plan.badge ? 'border-gold-400 border-2 relative' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                {plan.badge}
              </div>
            )}
            <div className="mb-5">
              <h3 className="font-heading font-bold text-navy-500 text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-navy-400">{plan.description}</p>
            </div>
            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-heading font-bold text-navy-500">{plan.price}</span>
                <span className="text-navy-400 text-sm mb-1">{plan.unit}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
              {plan.limitations.map(l => (
                <li key={l} className="flex items-start gap-2 text-sm text-navy-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0"><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" className="text-navy-200"/></svg>
                  {l}
                </li>
              ))}
            </ul>
            <Link href={plan.href} className={`${plan.ctaStyle} w-full text-center text-sm`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Addons */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-gold-50 text-gold-600 text-sm font-semibold rounded-full mb-4">Tillval</span>
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-navy-500">Lägg till extra funktioner</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {addons.map(addon => (
            <div key={addon.name} className="card p-6">
              <div className="text-3xl mb-3">{addon.icon}</div>
              <h3 className="font-heading font-bold text-navy-500 mb-1">{addon.name}</h3>
              <p className="text-sm text-navy-400 mb-3">{addon.desc}</p>
              <div className="text-lg font-heading font-bold text-gold-600">{addon.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="text-2xl font-heading font-bold text-navy-500 text-center mb-8">Vanliga frågor om priser</h2>
        <div className="card p-6 space-y-0 divide-y divide-navy-50">
          {[
            { q: 'Behöver jag skapa ett konto?', a: 'Nej, du kan betala och ladda ner direkt utan konto. Vill du spara dokumentet för framtida redigering kan du skapa ett gratis konto.' },
            { q: 'Vilka betalmetoder accepteras?', a: 'Vi accepterar Swish, kort (Visa/Mastercard) och faktura via Klarna.' },
            { q: 'Kan jag redigera dokumentet efteråt?', a: 'Ja! Enskilda dokument kan redigeras i 7 dagar, paket i 30 dagar och obegränsat under hela 30-dagarsperioden.' },
            { q: 'Vad är skillnaden mot gratisversionen?', a: 'Gratisversionen låter dig fylla i och förhandsgranska dokumentet, men PDF:en har en vattenstämpel. Betalversionen ger en ren, professionell PDF.' },
            { q: 'Erbjuder ni företagspriser?', a: 'Ja! Kontakta oss på enterprise@fullmakt24.se för volympriser och API-åtkomst.' },
          ].map(f => (
            <details key={f.q} className="group">
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                <span className="font-medium text-navy-600 pr-4 group-hover:text-gold-600 transition-colors text-sm">{f.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-300 shrink-0 group-open:rotate-180 transition-transform"><path d="M6 9l6 6 6-6"/></svg>
              </summary>
              <div className="pb-4 text-sm text-navy-400 leading-relaxed -mt-1">{f.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-navy-500 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Företag eller organisation?</h2>
            <p className="text-navy-200 mb-6">API-åtkomst, volympriser, white-label och teamkonton. Kontakta oss för en anpassad lösning.</p>
            <a href="mailto:enterprise@fullmakt24.se" className="btn-gold">Kontakta oss →</a>
          </div>
        </div>
      </div>
    </div>
  )
}
