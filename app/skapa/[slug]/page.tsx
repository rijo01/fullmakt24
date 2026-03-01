'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { templates, categories } from '@/data/templates'
import type { TemplateField } from '@/data/templates'

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
  const slug = params?.slug as string
  const t = templates.find(tp => tp.slug === slug)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  // Auto-save to localStorage
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

  const handleDownload = useCallback(async (withWatermark: boolean) => {
    if (!t) return
    setDownloading(true)

    try {
      // Dynamic import to avoid SSR issues
      const { downloadPdf } = await import('@/lib/pdf-generator')

      const cat = categories.find(c => c.slug === t.categorySlug)

      downloadPdf({
        templateName: t.name,
        categoryName: cat?.name || '',
        givare: {
          namn: formData.givare_namn || '',
          personnummer: formData.givare_pnr || '',
          adress: formData.givare_adress || '',
          epost: formData.givare_epost,
          telefon: formData.givare_telefon,
        },
        havare: {
          namn: formData.havare_namn || '',
          personnummer: formData.havare_pnr || '',
          relation: formData.havare_relation || '',
          adress: formData.havare_adress,
        },
        detaljer: {
          giltigFran: formData.giltig_fran,
          giltigTill: formData.giltig_till,
          syfte: formData.syfte,
          begransningar: formData.begransningar,
          barn_namn: formData.barn_namn,
          barn_pnr: formData.barn_pnr,
          vardgivare: formData.vardgivare,
          fastighet: formData.fastighet,
          forening: formData.forening,
          tjanst: formData.tjanst,
          djur_namn: formData.djur_namn,
          djur_art: formData.djur_art,
          myndighet: formData.myndighet,
        },
        watermark: withWatermark,
      }, `fullmakt-${t.slug}.pdf`)

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 4000)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Något gick fel vid PDF-generering. Försök igen.')
    } finally {
      setDownloading(false)
    }
  }, [t, formData])

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

  const stepTitles = ['Parter', 'Detaljer', 'Granska', 'Ladda ner']

  // Validation
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
            <Link href={`/mallar/${t.categorySlug}/${t.slug}`} className="text-xs text-navy-400 hover:text-navy-600">
              ← Tillbaka
            </Link>
          </div>
          <div className="flex gap-2">
            {stepTitles.map((s, i) => (
              <button
                key={s}
                onClick={() => i + 1 <= step && setStep(i + 1)}
                className="flex-1 group"
              >
                <div className={`h-1.5 rounded-full transition-colors ${i + 1 <= step ? 'bg-gold-500' : 'bg-navy-100'}`} />
                <span className={`text-[10px] mt-1 block ${i + 1 === step ? 'text-navy-600 font-semibold' : 'text-navy-300'}`}>
                  {i + 1}. {s}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="lg:grid lg:grid-cols-[1fr_340px] gap-8">
            {/* Form area */}
            <div>
              {/* Step 1: Parties */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="card p-6">
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">Fullmaktsgivare</h2>
                    <p className="text-sm text-navy-400 mb-6">Den person som ger fullmakten.</p>
                    <div className="space-y-4">
                      {givareFields.map(f => (
                        <div key={f.id}>
                          <label className="text-sm font-medium text-navy-600 mb-1.5 block">
                            {f.label} {f.required && <span className="text-red-400">*</span>}
                          </label>
                          {f.helpText && <p className="text-xs text-navy-400 mb-1">{f.helpText}</p>}
                          <FormField field={f} value={formData[f.id] || ''} onChange={v => updateField(f.id, v)} />
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
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">Fullmaktshavare</h2>
                    <p className="text-sm text-navy-400 mb-6">Den person som tar emot fullmakten.</p>
                    <div className="space-y-4">
                      {havareFields.map(f => (
                        <div key={f.id}>
                          <label className="text-sm font-medium text-navy-600 mb-1.5 block">
                            {f.label} {f.required && <span className="text-red-400">*</span>}
                          </label>
                          <FormField field={f} value={formData[f.id] || ''} onChange={v => updateField(f.id, v)} />
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
                  <button
                    onClick={() => setStep(2)}
                    disabled={!requiredGivare || !requiredHavare}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${requiredGivare && requiredHavare ? 'btn-primary' : 'bg-navy-100 text-navy-300 cursor-not-allowed'}`}
                  >
                    Nästa: Specificera uppdraget →
                  </button>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="card p-6">
                    <h2 className="font-heading font-bold text-navy-500 text-lg mb-1">Uppdragsdetaljer</h2>
                    <p className="text-sm text-navy-400 mb-6">Specificera vad fullmakten gäller.</p>
                    <div className="space-y-4">
                      {detaljFields.map(f => (
                        <div key={f.id}>
                          <label className="text-sm font-medium text-navy-600 mb-1.5 block">
                            {f.label} {f.required && <span className="text-red-400">*</span>}
                          </label>
                          <FormField field={f} value={formData[f.id] || ''} onChange={v => updateField(f.id, v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Tillbaka</button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!requiredDetaljer}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${requiredDetaljer ? 'btn-primary' : 'bg-navy-100 text-navy-300 cursor-not-allowed'}`}
                    >
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
                        <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Fullmaktsgivare</h3>
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
                        <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Fullmaktshavare</h3>
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
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Ändra</button>
                    <button onClick={() => setStep(4)} className="btn-gold flex-1">Bekräfta & Fortsätt →</button>
                  </div>
                </div>
              )}

              {/* Step 4: Download */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="card p-8 text-center">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-success">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="font-heading font-bold text-navy-500 text-2xl mb-2">Din fullmakt är klar!</h2>
                    <p className="text-navy-400 mb-8">Välj hur du vill ladda ner ditt dokument.</p>

                    <div className="space-y-3 max-w-sm mx-auto">
                      {/* Free download with watermark */}
                      <button
                        onClick={() => handleDownload(true)}
                        disabled={downloading}
                        className="btn-secondary w-full !py-4 relative"
                      >
                        {downloading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                            Genererar PDF...
                          </span>
                        ) : downloaded ? (
                          '✓ PDF nedladdad!'
                        ) : (
                          <>↓ Ladda ner PDF (gratis med vattenstämpel)</>
                        )}
                      </button>

                      {/* Paid download without watermark */}
                      <button
                        onClick={() => handleDownload(false)}
                        disabled={downloading}
                        className="btn-gold w-full !py-4"
                      >
                        ↓ Ladda ner ren PDF – 49 kr
                      </button>

                      {/* BankID */}
                      <button
                        className="btn-primary w-full !py-4 opacity-90"
                        onClick={() => alert('BankID-signering kommer snart! Registrera dig för att bli meddelad.')}
                      >
                        🔐 Signera med BankID
                        <span className="ml-2 text-[10px] bg-gold-500/30 px-2 py-0.5 rounded-full">Kommer snart</span>
                      </button>

                      {/* Print */}
                      <button className="btn-secondary w-full" onClick={() => window.print()}>
                        🖨️ Skriv ut
                      </button>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gold-800 text-sm mb-2">💡 Vad är skillnaden?</h3>
                    <div className="text-sm text-gold-700 space-y-1">
                      <p><strong>Gratis:</strong> Fullständigt dokument med vattenstämpel &quot;FÖRHANDSGRANSKNING&quot;.</p>
                      <p><strong>49 kr:</strong> Ren, professionell PDF utan vattenstämpel – klar att signera.</p>
                    </div>
                  </div>

                  {/* Create another */}
                  <div className="text-center pt-4">
                    <Link href="/mallar" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
                      ← Skapa en till fullmakt
                    </Link>
                  </div>
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
                    <div className="text-center font-bold text-xs uppercase tracking-wider mb-4">FULLMAKT</div>
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
                      <div>
                        <div className="w-20 h-4 bg-navy-100 rounded mb-1" />
                        <div className="text-[8px] text-navy-300">Underskrift</div>
                      </div>
                      <div className="text-right">
                        <div className="text-navy-400">Datum: ________</div>
                        <div className="text-navy-400">Ort: ________</div>
                      </div>
                    </div>
                    <div className="text-center pt-4 text-[8px] text-navy-300">
                      Genererad via Fullmakt24.se
                    </div>
                  </div>
                </div>

                {/* Quick download from sidebar */}
                {step >= 3 && (
                  <button
                    onClick={() => handleDownload(true)}
                    className="mt-4 btn-secondary w-full text-sm"
                  >
                    ↓ Snabbnedladdning (gratis)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
