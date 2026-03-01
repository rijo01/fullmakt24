'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PriserPage() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Gratis',
      price: 0,
      annualPrice: 0,
      description: 'Perfekt för enstaka behov',
      badge: null,
      features: [
        '3 dokument per månad',
        'Grundmallar',
        'PDF-nedladdning',
        'Vattenstämpel på dokument',
      ],
      limitations: ['Begränsat antal mallar', 'Ingen BankID-signering'],
      cta: 'Kom igång gratis',
      ctaStyle: 'btn-secondary',
      href: '/mallar',
    },
    {
      name: 'Standard',
      price: 149,
      annualPrice: 119,
      description: 'För privatpersoner och småföretag',
      badge: 'Mest populär',
      features: [
        'Obegränsade dokument',
        'Alla 100+ mallar',
        'Ingen vattenstämpel',
        'Spara dokument i kontot',
        'Tvåspråkig (SV + EN)',
        'Prioriterad support',
      ],
      limitations: [],
      cta: 'Starta Standard',
      ctaStyle: 'btn-gold',
      href: '/mallar',
    },
    {
      name: 'Premium',
      price: 299,
      annualPrice: 239,
      description: 'För företag och professionella',
      badge: null,
      features: [
        'Allt i Standard',
        'BankID-signering',
        'Juridisk granskning (1/mån)',
        'API-åtkomst',
        'White-label PDF',
        'Teamkonton (upp till 5)',
        'Dedikerad kontaktperson',
      ],
      limitations: [],
      cta: 'Starta Premium',
      ctaStyle: 'btn-primary',
      href: '/mallar',
    },
  ]

  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Priser</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold text-navy-500 mb-4">
          Enkel prissättning, inga dolda avgifter
        </h1>
        <p className="text-lg text-navy-400 max-w-2xl mx-auto mb-8">
          Börja gratis och uppgradera när du behöver mer. Avbryt när du vill.
        </p>

        {/* Annual toggle */}
        <div className="inline-flex items-center gap-3 bg-navy-50 rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${!annual ? 'bg-white text-navy-600 shadow-sm' : 'text-navy-400'}`}
          >
            Månadsvis
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${annual ? 'bg-white text-navy-600 shadow-sm' : 'text-navy-400'}`}
          >
            Årsvis <span className="text-success text-xs font-bold ml-1">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-20">
        {plans.map(plan => (
          <div key={plan.name} className={`card p-6 lg:p-8 flex flex-col ${plan.badge ? 'border-gold-400 border-2 relative' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                {plan.badge}
              </div>
            )}
            <div className="mb-6">
              <h3 className="font-heading font-bold text-navy-500 text-xl mb-1">{plan.name}</h3>
              <p className="text-sm text-navy-400">{plan.description}</p>
            </div>
            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-heading font-bold text-navy-500">
                  {annual ? plan.annualPrice : plan.price}
                </span>
                <span className="text-navy-400 text-sm mb-1">
                  {plan.price === 0 ? 'kr' : 'kr/mån'}
                </span>
              </div>
              {annual && plan.price > 0 && (
                <div className="text-xs text-success font-medium mt-1">
                  Spara {(plan.price - plan.annualPrice) * 12} kr/år
                </div>
              )}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
              {plan.limitations.map(l => (
                <li key={l} className="flex items-start gap-2 text-sm text-navy-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-navy-200"/></svg>
                  {l}
                </li>
              ))}
            </ul>
            <Link href={plan.href} className={`${plan.ctaStyle} w-full text-center`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Enterprise */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-navy-500 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Behöver du en Enterprise-lösning?</h2>
            <p className="text-navy-200 mb-6">Anpassade volymer, SLA, API-integration och dedikerad support för stora organisationer.</p>
            <a href="mailto:enterprise@fullmakt24.se" className="btn-gold">Kontakta oss →</a>
          </div>
        </div>
      </div>
    </div>
  )
}
