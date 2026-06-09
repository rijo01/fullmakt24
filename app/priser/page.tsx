'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PACKAGES, type PackageType } from '@/lib/packages'

interface Plan {
  type: PackageType
  name: string
  price: string
  unit: string
  description: string
  badge: string | null
  save: number
  features: string[]
  cta: string
  ctaStyle: string
  /** true = gå till /mallar och välj mall; false = köp paket direkt i Stripe */
  pickFirst: boolean
}

export default function PriserPage() {
  const [loading, setLoading] = useState<PackageType | null>(null)

  const plans: Plan[] = [
    {
      type: 'single',
      name: PACKAGES.single.name,
      price: String(PACKAGES.single.price),
      unit: 'kr / dokument',
      description: 'Betala per mall – inget abonnemang',
      badge: null,
      save: 0,
      features: [
        '1 fullmakt',
        'Professionell PDF utan vattenstämpel',
        'Klar att skriva ut och skriva under',
        'Engångsköp – ingen bindningstid',
      ],
      cta: 'Välj mall →',
      ctaStyle: 'btn-secondary',
      pickFirst: true,
    },
    {
      type: 'family',
      name: PACKAGES.family.name,
      price: String(PACKAGES.family.price),
      unit: 'kr',
      description: '3 valfria fullmakter',
      badge: 'Populärast',
      save: PACKAGES.family.save,
      features: [
        '3 valfria fullmakter',
        `Spara ${PACKAGES.family.save} kr jämfört med styckpris`,
        'Använd när du vill – krediter sparas',
        'Engångsköp – ingen prenumeration',
      ],
      cta: 'Köp familjepaket',
      ctaStyle: 'btn-gold',
      pickFirst: false,
    },
    {
      type: 'estate',
      name: PACKAGES.estate.name,
      price: String(PACKAGES.estate.price),
      unit: 'kr',
      description: '5 valfria fullmakter',
      badge: null,
      save: PACKAGES.estate.save,
      features: [
        '5 valfria fullmakter',
        `Spara ${PACKAGES.estate.save} kr jämfört med styckpris`,
        'Perfekt för dödsbo och anhörigärenden',
        'Engångsköp – ingen prenumeration',
      ],
      cta: 'Köp dödsbopaket',
      ctaStyle: 'btn-primary',
      pickFirst: false,
    },
  ]

  const buyPackage = async (type: PackageType) => {
    setLoading(type)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType: type }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Något gick fel. Försök igen.')
        setLoading(null)
      }
    } catch {
      alert('Kunde inte starta betalningen. Försök igen.')
      setLoading(null)
    }
  }

  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Priser</span>
      </nav>

      <div className="text-center mb-14">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold text-navy-500 mb-4">
          Välj det som passar dig – inga abonnemang
        </h1>
        <p className="text-lg text-navy-400 max-w-2xl mx-auto">
          Betala en gång och ladda ner färdiga PDF:er. Behöver du flera fullmakter
          sparar du på våra paket. Ingen bindningstid, inga dolda avgifter.
        </p>
        <p className="text-sm text-navy-400 mt-3">
          Du kan alltid fylla i och förhandsgranska din fullmakt gratis innan du betalar.
        </p>
      </div>

      {/* Pricing grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-20 items-stretch">
        {plans.map(plan => (
          <div key={plan.type} className={`card p-6 flex flex-col ${plan.badge ? 'border-gold-400 border-2 relative shadow-lg' : ''}`}>
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
              {plan.save > 0 && (
                <span className="inline-block mt-2 text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                  Spara {plan.save} kr
                </span>
              )}
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            {plan.pickFirst ? (
              <Link href="/mallar" className={`${plan.ctaStyle} w-full text-center text-sm`}>
                {plan.cta}
              </Link>
            ) : (
              <button
                onClick={() => buyPackage(plan.type)}
                disabled={loading !== null}
                className={`${plan.ctaStyle} w-full text-center text-sm disabled:opacity-60`}
              >
                {loading === plan.type ? 'Omdirigerar…' : plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* How packages work */}
      <div className="max-w-2xl mx-auto mb-20 card p-6 bg-navy-50/50">
        <h2 className="font-heading font-bold text-navy-500 text-lg mb-3">Så fungerar paketen</h2>
        <ol className="text-sm text-navy-500 space-y-2 list-decimal list-inside">
          <li>Köp ett paket och få 3 eller 5 nedladdningar (krediter).</li>
          <li>Välj vilka fullmakter du vill bland alla mallar – när du vill.</li>
          <li>En kredit dras av varje gång du laddar ner en färdig PDF.</li>
        </ol>
        <p className="text-xs text-navy-400 mt-3">
          Krediterna sparas i din webbläsare. Inget abonnemang – paketet är ett engångsköp.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="text-2xl font-heading font-bold text-navy-500 text-center mb-8">Vanliga frågor om priser</h2>
        <div className="card p-6 space-y-0 divide-y divide-navy-50">
          {[
            { q: 'Behöver jag skapa ett konto?', a: 'Nej, du kan betala och ladda ner direkt utan konto. Vill du spara dokumentet för framtida redigering kan du skapa ett gratis konto.' },
            { q: 'Vilka betalmetoder accepteras?', a: 'Vi accepterar kort (Visa/Mastercard) och faktura via Klarna.' },
            { q: 'Vad kostar ett enskilt dokument?', a: 'Ett enskilt dokument kostar 99 kr. Behöver du flera lönar sig Familjepaketet (3 st för 249 kr) eller Dödsbo- & anhörigpaketet (5 st för 399 kr).' },
            { q: 'Hur fungerar paketen?', a: 'När du köper ett paket får du 3 eller 5 nedladdningar. Du väljer själv vilka fullmakter du vill skapa och en nedladdning dras av per färdig PDF. Det är ett engångsköp utan abonnemang.' },
            { q: 'Vad är skillnaden mot förhandsgranskningen?', a: 'Du kan fylla i och förhandsgranska ditt dokument gratis. För att ladda ner den färdiga PDF:en betalar du 99 kr per mall, eller använder en kredit från ditt paket.' },
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
