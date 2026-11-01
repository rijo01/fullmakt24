'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { templates, categories } from '@/data/templates'
import type { TemplateField } from '@/data/templates'
import { trackEvent } from '@/components/GoogleAnalytics'
import { getCredits, useCredit, PACKAGES } from '@/lib/packages'

function FormField({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const base = "input-field text-sm"
  switch (field.type) {
    case 'textarea':
      return <textarea className={`${base} min-h-[100px] resize-y`} placeholder={field.placeholder} value={value} onChange={e => onChange(e.target.value)} />
    case 'select':
      return (
        <select className={base} value={value} onChange={e => onChange(e.target.value)}>
          <option value="">Välj...</option>
          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    case 'date':
      return <input type="date" className={base} value={value} onChange={e => onChange(e.target.value)} />
    case 'checkbox':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={value === 'true'} onChange={e => onChange(e.target.checked ? 'true' : '')} className="w-5 h-5 rounded border-navy-300 text-gold-500 focus:ring-gold-400" />
          <span className="text-sm text-navy-500">{field.label}</span>
        </label>
      )
    default:
      return <input type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'} className={base} placeholder={field.placeholder} value={value} onChange={e => onChange(e.target.value)} />
  }
}

export default function SkapaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const t = templates.find(tp => tp.slug === slug)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [paying, setPaying] = useState(false)
  const [credits, setCreditsState] = useState(0)
  // Tvåspråkiga mallar kan köpas med engelsk översättning i samma PDF.
  const [packageType, setPackageType] = useState<'single' | 'bilingual'>('single')

  useEffect(() => {
    setCreditsState(getCredits())
  }, [])

  // Använd en paketkredit istället för ny betalning. Drar av en credit,
  // sparar formuläret och går vidare till nedladdningssidan.
  const handleUseCredit = useCallback(() => {
    if (!t) return
    if (typeof window !== 'undefined' && slug) {
      localStorage.setItem(`draft_${slug}`, JSON.stringify(formData))
    }
    if (useCredit()) {
      trackEvent('select_content', { content_type: 'package_credit', item_id: t.slug })
      // Paketkrediter gäller den svenska versionen; tvåspråkig PDF köps separat.
      router.push(`/betald?slug=${slug}&credit=used`)
    } else {
      setCreditsState(0)
    }
  }, [t, slug, formData, router])

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      const saved = localStorage.getItem(`draft_${slug}`)
      if (saved) {
        try { setFormData(JSON.parse(saved)) } catch { /* ignore */ }
      }
    }
  }, [slug])

  useEffect(() => {
    if (typeof window !== 'undefined' && slug && Object.keys(formData).length > 0) {
      localStorage.setItem(`draft_${slug}`, JSON.stringify(formData))
    }
  }, [formData, slug])

  const handlePayment = useCallback(async () => {
    if (!t) return
    setPaying(true)

    // Tvåspråkig PDF kan bara väljas för mallar som har en engelsk version.
    const type = t.bilingual && packageType === 'bilingual' ? 'bilingual' : 'single'
    const price = PACKAGES[type].price

    trackEvent('begin_checkout', {
      currency: 'SEK',
      value: price,
      items: [{ item_id: t.slug, item_name: t.name, item_category: t.category, price, quantity: 1 }],
    })

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug: t.slug,
          templateName: t.name,
          formData,
          packageType: type,
        }),
      })

      const data = await res.json()

      if (data.url) {
        // Save form data before redirecting
        localStorage.setItem(`draft_${slug}`, JSON.stringify(formData))
        window.location.href = data.url
      } else {
        alert('Något gick fel. Försök igen.')
      }
    } catch (err) {
      console.error('Payment error:', err)
      alert('Kunde inte starta betalningen. Försök igen.')
    } finally {
      setPaying(false)
    }
  }, [t, formData, slug, packageType])

  if (!t) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-navy-500 mb-4">Mall hittades inte</h1>
        <Link href="/mallar" className="btn-primary">← Tillbaka</Link>
      </div>
    )
  }

  const cat = categories.find(c => c.slug === t.categorySlug)
  const givareFields = t.fields.filter(f => f.group === 'givare')
  const havareFields = t.fields.filter(f => f.group === 'havare')
  const detaljFields = t.fields.filter(f => f.group === 'detaljer')

  const updateField = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const stepTitles = ['Parter', 'Detaljer', 'Granska', 'Betala & Ladda ner']

  // Tvåspråkig PDF är ett tillval; endast svenska är förvalt.
  const isBilingual = !!t.bilingual && packageType === 'bilingual'
  const price = PACKAGES[isBilingual ? 'bilingual' : 'single'].price

  const requiredGivare = givareFields.filter(f => f.required).every(f => formData[f.id]?.trim())
  const requiredHavare = havareFields.filter(f => f.required).every(f => formData[f.id]?.trim())
  const requiredDetaljer = detaljFields.filter(f => f.required).every(f => formData[f.id]?.trim())

  return (
    <div className="min-h-screen bg-surface">
      {/* Progress bar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-navy-100">
        <div className="section-padding py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{cat?.icon}</span>
              <h1 className="font-heading font-bold text-navy-500 text-sm lg:text-base truncate">{t.name}</h1>
            </div>
            <Link href={`/mallar/${t.categorySlug}/${t.slug}`} className="text-xs text-navy-400 hover:text-navy-600">← Tillbaka</Link>
          </div>
          <div className="flex gap-2">
            {stepTitles.map((s, i) => (
              <button key={s} onClick={() => i + 1 <= step && setStep(i + 1)} className="flex-1 group">
                <div className={`h-1.5 rounded-full transition-colors ${i + 1 <= step ? 'bg-gold-500' : 'bg-navy-100'}`} />
                <span className={`text-[10px] mt-1 block ${i + 1 === step ? 'text-navy-600 font-semibold' : 'text-navy-300'}`}>{i + 1}. {s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="lg:grid lg:grid-cols-[1fr_340px] gap-8">
            <div>
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="card p-6">
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">{t.groupLabels?.givare || 'Fullmaktsgivare'}</h2>
                    <p className="text-sm text-navy-400 mb-6">{t.groupLabels?.givareHelp || 'Den person som ger fullmakten.'}</p>
                    <div className="space-y-4">
                      {givareFields.map(f => (
                        <div key={f.id}>
                          <label className="text-sm font-medium text-navy-600 mb-1.5 block">
                            {f.label} {f.required && <span className="text-red-400">*</span>}
                          </label>
                          <FormField field={f} value={formData[f.id] || ''} onChange={v => updateField(f.id, v)} />
                          {f.helpText && <p className="text-xs text-navy-400 mt-1">{f.helpText}</p>}
                          {f.required && formData[f.id]?.trim() && (
                            <div className="flex items-center gap-1 mt-1">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              <span className="text-xs text-success">OK</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-6">
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">{t.groupLabels?.havare || 'Fullmaktshavare'}</h2>
                    <p className="text-sm text-navy-400 mb-6">{t.groupLabels?.havareHelp || 'Den person som tar emot fullmakten.'}</p>
                    <div className="space-y-4">
                      {havareFields.map(f => (
                        <div key={f.id}>
                          <label className="text-sm font-medium text-navy-600 mb-1.5 block">
                            {f.label} {f.required && <span className="text-red-400">*</span>}
                          </label>
                          <FormField field={f} value={formData[f.id] || ''} onChange={v => updateField(f.id, v)} />
                          {f.helpText && <p className="text-xs text-navy-400 mt-1">{f.helpText}</p>}
                          {f.required && formData[f.id]?.trim() && (
                            <div className="flex items-center gap-1 mt-1">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              <span className="text-xs text-success">OK</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} disabled={!requiredGivare || !requiredHavare}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${requiredGivare && requiredHavare ? 'btn-primary' : 'bg-navy-100 text-navy-300 cursor-not-allowed'}`}>
                    Nästa: Specificera uppdraget →
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="card p-6">
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">Uppdragsdetaljer</h2>
                    <p className="text-sm text-navy-400 mb-6">Specificera vad fullmakten gäller.</p>
                    <div className="space-y-4">
                      {detaljFields.map(f => (
                        <div key={f.id}>
                          {f.type !== 'checkbox' && (
                            <label className="text-sm font-medium text-navy-600 mb-1.5 block">
                              {f.label} {f.required && <span className="text-red-400">*</span>}
                            </label>
                          )}
                          <FormField field={f} value={formData[f.id] || ''} onChange={v => updateField(f.id, v)} />
                          {f.helpText && <p className="text-xs text-navy-400 mt-1">{f.helpText}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Tillbaka</button>
                    <button onClick={() => setStep(3)} disabled={!requiredDetaljer}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${requiredDetaljer ? 'btn-primary' : 'bg-navy-100 text-navy-300 cursor-not-allowed'}`}>
                      Nästa: Granska →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="card p-6">
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-6">Granska ditt dokument</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">{t.groupLabels?.givare || 'Fullmaktsgivare'}</h3>
                        <div className="bg-navy-50 rounded-xl p-4 space-y-1">
                          {givareFields.map(f => formData[f.id] && (
                            <div key={f.id} className="flex justify-between text-sm">
                              <span className="text-navy-400">{f.label}:</span>
                              <span className="text-navy-600 font-medium">{formData[f.id]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">{t.groupLabels?.havare || 'Fullmaktshavare'}</h3>
                        <div className="bg-navy-50 rounded-xl p-4 space-y-1">
                          {havareFields.map(f => formData[f.id] && (
                            <div key={f.id} className="flex justify-between text-sm">
                              <span className="text-navy-400">{f.label}:</span>
                              <span className="text-navy-600 font-medium">{formData[f.id]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Detaljer</h3>
                        <div className="bg-gold-50 rounded-xl p-4 space-y-2 border border-gold-200/50">
                          {detaljFields.map(f => formData[f.id] && (
                            <div key={f.id} className="text-sm">
                              <span className="text-navy-400 block text-xs mb-0.5">{f.label}:</span>
                              <span className="text-navy-600">{formData[f.id]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Språkval – endast för mallar som finns som tvåspråkig PDF */}
                  {t.bilingual && (
                    <div className="card p-6">
                      <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">Språk</h2>
                      <p className="text-sm text-navy-400 mb-5">
                        Ska du visa upp fullmakten utomlands – för gränskontroll, flygbolag,
                        sjukvård eller hotell? Välj den tvåspråkiga versionen, så följer en
                        engelsk översättning med som extra sida i samma PDF.
                      </p>
                      <div className="space-y-3">
                        {([
                          {
                            value: 'single' as const,
                            title: 'Endast svenska',
                            price: `${PACKAGES.single.price} kr`,
                            desc: 'Den svenska originalversionen som PDF.',
                          },
                          {
                            value: 'bilingual' as const,
                            title: 'Svenska + engelska',
                            price: `${PACKAGES.bilingual.price} kr`,
                            desc: 'Svensk original först, engelsk översättning som extra sida i samma PDF.',
                          },
                        ]).map(opt => (
                          <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                              packageType === opt.value
                                ? 'border-gold-400 bg-gold-50'
                                : 'border-navy-100 hover:border-navy-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="doc-language"
                              value={opt.value}
                              checked={packageType === opt.value}
                              onChange={() => setPackageType(opt.value)}
                              className="mt-1 w-4 h-4 text-gold-500 focus:ring-gold-400"
                            />
                            <span className="flex-1">
                              <span className="flex items-center justify-between gap-3">
                                <span className="font-semibold text-navy-600 text-sm">{opt.title}</span>
                                <span className="font-heading font-bold text-navy-600 text-sm">{opt.price}</span>
                              </span>
                              <span className="block text-xs text-navy-400 mt-1">{opt.desc}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-navy-400 mt-4">
                        Den svenska versionen är alltid originalet. Översättningen är till för att
                        mottagare utomlands ska kunna läsa dokumentet.
                      </p>
                    </div>
                  )}

                  {t.documentKind === 'framtidsfullmakt' && (
                    <div className="card p-6 border-2 border-gold-200">
                      <h2 className="font-heading font-bold text-navy-500 text-lg mb-2">Så blir framtidsfullmakten giltig</h2>
                      <ul className="text-sm text-navy-500 space-y-1.5 list-disc list-inside">
                        <li>{t.mutual ? 'Var och en skriver under sitt eget dokument' : 'Fullmaktsgivaren skriver under'} i två vittnens samtidiga närvaro. Det är ett lagkrav (4 § lag 2017:310).</li>
                        <li>Vittnena ska känna till att det är en framtidsfullmakt och skriva under bevittningen.</li>
                        <li>Fullmaktshavaren får inte vara vittne, och inte heller fullmaktsgivarens make, sambo, syskon eller släktingar och svågrar i rakt upp- eller nedstigande led.</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Ändra</button>
                    <button onClick={() => setStep(4)} disabled={!requiredGivare || !requiredHavare || !requiredDetaljer}
                      className={`flex-1 ${requiredGivare && requiredHavare && requiredDetaljer ? 'btn-gold' : 'py-3 rounded-xl font-semibold bg-navy-100 text-navy-300 cursor-not-allowed'}`}>
                      Bekräfta & Betala →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Pay & Download */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="card p-8 text-center">
                    <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-navy-400">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <h2 className="font-heading font-bold text-navy-500 text-2xl mb-2">Slutför ditt köp</h2>
                    <p className="text-navy-400 mb-2">Betala tryggt med kort, Apple Pay eller Klarna.</p>

                    {/* Paketkredit tillgänglig – ladda ner utan ny betalning */}
                    {credits > 0 && (
                      <div className="bg-success/10 border border-success/30 rounded-xl p-5 max-w-sm mx-auto mb-6 text-left">
                        <p className="text-sm text-navy-600 mb-3">
                          💳 Du har <strong>{credits}</strong> nedladdningar kvar i ditt paket.
                          Ladda ner den här fullmakten utan ny betalning.
                        </p>
                        <button
                          onClick={handleUseCredit}
                          className="btn-gold w-full !py-3"
                        >
                          Ladda ner med paketkredit →
                        </button>
                        <p className="text-xs text-navy-400 text-center mt-3">
                          {isBilingual
                            ? 'Paketkrediten ger den svenska versionen. Betala nedan för svensk + engelsk PDF.'
                            : 'eller betala styckpris nedan'}
                        </p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="bg-navy-50 rounded-xl p-5 max-w-sm mx-auto mb-6 text-left">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-navy-500">Fullmakt: {t.name}</span>
                        <span className="text-sm text-navy-500">{PACKAGES.single.price} kr</span>
                      </div>
                      {isBilingual && (
                        <div className="flex justify-between items-center mb-3 text-sm text-navy-500">
                          <span>Engelsk översättning i samma PDF</span>
                          <span>+{PACKAGES.bilingual.price - PACKAGES.single.price} kr</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-navy-200">
                        <span className="font-semibold text-navy-600">Totalt</span>
                        <span className="text-2xl font-heading font-bold text-navy-600">{price} kr</span>
                      </div>
                      {t.bilingual && (
                        <button
                          onClick={() => setStep(3)}
                          className="mt-3 text-xs text-gold-700 hover:text-gold-800 font-medium"
                        >
                          {isBilingual ? 'Byt till endast svenska' : 'Lägg till engelsk översättning (149 kr)'} →
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={paying}
                      className={`w-full max-w-sm mx-auto !py-4 text-lg ${credits > 0 ? 'btn-secondary' : 'btn-gold'}`}
                    >
                      {paying ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          Omdirigerar till betalning...
                        </span>
                      ) : (
                        `Betala ${price} kr →`
                      )}
                    </button>

                    {/* Payment methods */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-navy-300">
                      <span className="text-xs">Betala med:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-navy-50 px-2 py-1 rounded">💳 Kort</span>
                        <span className="text-xs font-semibold bg-navy-50 px-2 py-1 rounded"> Apple Pay</span>
                        <span className="text-xs font-semibold bg-navy-50 px-2 py-1 rounded">Klarna</span>
                      </div>
                    </div>

                    {/* Trust signals */}
                    <div className="flex items-center justify-center gap-4 mt-6 text-xs text-navy-400">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/></svg>
                        SSL-krypterad
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Säker betalning via Stripe
                      </span>
                    </div>

                    {/* 14 dagars återbetalning – synlig i kassan */}
                    <div className="mt-5 max-w-sm mx-auto bg-success/10 border border-success/30 rounded-xl px-4 py-3 flex items-start gap-2 text-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-xs text-navy-500">
                        <strong className="text-navy-600">14 dagars återbetalning.</strong> Är du inte nöjd med dokumentet får du pengarna tillbaka inom 14 dagar – mejla support@fullmakt24.se med ditt betalnings-ID.
                      </span>
                    </div>

                    {/* Disclaimer – mall, inte juridisk rådgivning */}
                    <p className="mt-4 max-w-sm mx-auto text-[11px] leading-relaxed text-navy-400 text-left">
                      Detta är en mall, inte individuell juridisk rådgivning. Mallen är utformad enligt svensk avtalsrätt för vanliga situationer. Vid komplexa eller ovanliga ärenden rekommenderar vi att du kontaktar en jurist.
                    </p>
                  </div>

                  <button onClick={() => setStep(3)} className="btn-secondary w-full">
                    ← Gå tillbaka och ändra
                  </button>
                </div>
              )}
            </div>

            {/* Live preview sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-40">
                <div className="bg-white rounded-xl border border-navy-200 shadow-lg overflow-hidden">
                  <div className="bg-navy-500 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Förhandsgranskning</span>
                    <span className="text-[10px] text-navy-200">PDF</span>
                  </div>
                  <div className="p-5 font-mono text-[10px] text-navy-500 leading-relaxed space-y-3 max-h-[500px] overflow-y-auto">
                    <div className="text-center font-bold text-xs uppercase tracking-wider mb-4">{t.documentTitle || 'FULLMAKT'}</div>
                    <div className="text-center text-navy-400 mb-4">{t.name}</div>
                    <hr className="border-navy-100" />
                    {formData.givare_namn && (
                      <div>
                        <div className="font-bold text-[9px] uppercase text-navy-400">Fullmaktsgivare</div>
                        <div>{formData.givare_namn}</div>
                        {formData.givare_pnr && <div className="text-navy-400">{formData.givare_pnr}</div>}
                        {formData.givare_adress && <div className="text-navy-400">{formData.givare_adress}</div>}
                      </div>
                    )}
                    {formData.havare_namn && (
                      <div>
                        <div className="font-bold text-[9px] uppercase text-navy-400">Fullmaktshavare</div>
                        <div>{formData.havare_namn}</div>
                        {formData.havare_pnr && <div className="text-navy-400">{formData.havare_pnr}</div>}
                      </div>
                    )}
                    {formData.syfte && (
                      <div>
                        <div className="font-bold text-[9px] uppercase text-navy-400">Uppdrag</div>
                        <div className="text-navy-500">{formData.syfte}</div>
                      </div>
                    )}
                    {(formData.giltig_fran || formData.giltig_till) && (
                      <div className="text-navy-400">
                        Giltighetstid: {formData.giltig_fran || '____'} – {formData.giltig_till || '____'}
                      </div>
                    )}
                    <hr className="border-navy-100" />
                    <div className="flex justify-between pt-2">
                      <div><div className="w-20 h-4 bg-navy-100 rounded mb-1" /><div className="text-[8px] text-navy-300">Underskrift</div></div>
                      <div className="text-right"><div className="text-navy-400">Datum: ________</div></div>
                    </div>
                    <div className="text-center pt-4 text-[8px] text-navy-300">Genererad via Fullmakt24.se</div>
                  </div>
                </div>

                {/* Price reminder */}
                <div className="mt-4 bg-gold-50 border border-gold-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-navy-600 mb-1">{price} kr</div>
                  <div className="text-xs text-gold-700">
                    {isBilingual ? 'Svenska + engelska · Engångsbetalning' : 'Engångsbetalning · Ingen prenumeration'}
                  </div>
                  {t.bilingual && !isBilingual && (
                    <div className="text-[11px] text-navy-400 mt-2">
                      Finns även som tvåspråkig PDF – {PACKAGES.bilingual.price} kr
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
