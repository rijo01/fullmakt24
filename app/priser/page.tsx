'use client'

import Link from 'next/link'

export default function PriserPage() {
  const plans = [
    {
      name: 'Förhandsgranska',
      price: '0',
      unit: 'kr',
      description: 'Fyll i och se ditt dokument',
      badge: null,
      features: [
        'Fyll i alla uppgifter',
        'Alla mallar tillgängliga',
        'Förhandsgranska innan du betalar',
      ],
      limitations: ['Nedladdning kräver köp'],
      cta: 'Kom igång gratis',
      ctaStyle: 'btn-secondary',
      href: '/mallar',
    },
    {
      name: 'Ladda ner PDF',
      price: '49',
      unit: 'kr / mall',
      description: 'Betala per mall – inget abonnemang',
      badge: 'Allt du behöver',
      features: [
        'Professionell PDF utan vattenstämpel',
        'Klar att skriva ut och skriva under',
        'Ladda ner obegränsat antal gånger',
        'Engångsköp – ingen bindningstid',
      ],
      limitations: [],
      cta: 'Skapa dokument – 49 kr',
      ctaStyle: 'btn-gold',
      href: '/mallar',
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
      <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-20">
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

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="text-2xl font-heading font-bold text-navy-500 text-center mb-8">Vanliga frågor om priser</h2>
        <div className="card p-6 space-y-0 divide-y divide-navy-50">
          {[
            { q: 'Behöver jag skapa ett konto?', a: 'Nej, du kan betala och ladda ner direkt utan konto. Vill du spara dokumentet för framtida redigering kan du skapa ett gratis konto.' },
            { q: 'Vilka betalmetoder accepteras?', a: 'Vi accepterar kort (Visa/Mastercard) och faktura via Klarna.' },
            { q: 'Kan jag redigera dokumentet efteråt?', a: 'Ja, du kan när som helst gå tillbaka och skapa en ny version av ditt dokument.' },
            { q: 'Vad är skillnaden mot förhandsgranskningen?', a: 'Du kan fylla i och förhandsgranska ditt dokument gratis. För att ladda ner den färdiga PDF:en betalar du 49 kr per mall.' },
            { q: 'Erbjuder ni företagspriser?', a: 'Priset är 49 kr per mall för alla – inga volympriser eller abonnemang. Ett API för företag är under utveckling.' },
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
            <p className="text-navy-200 mb-6">Vi utvecklar ett API för att skapa fullmakter programmatiskt. Det är inte släppt än – läs mer om vad som är på gång.</p>
            <Link href="/api-docs" className="btn-gold">Läs om vårt kommande API →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
