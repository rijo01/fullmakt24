'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { templates, categories, fieldLabelsEn } from '@/data/templates'
import { trackEvent } from '@/components/GoogleAnalytics'
import { getPackage, getCredits, grantPackageCredits, getLastPackageSession } from '@/lib/packages'

import { Suspense } from 'react'

function BetaldContent() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  const sessionId = searchParams.get('session_id')
  const packageParam = searchParams.get('package')
  const usedCredit = searchParams.get('credit') === 'used'
  // Ingen PDF och inga krediter förrän betalningen är kontrollerad mot Stripe.
  const [verify, setVerify] = useState<'pending' | 'ok' | 'fail'>('pending')
  // Pakettypen som faktiskt betalades (single, bilingual, family, estate).
  const [paidType, setPaidType] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [credits, setCreditsState] = useState(0)
  // Obligatoriska uppgifter som saknas – då skapas ingen PDF alls.
  const [missingFields, setMissingFields] = useState<string[]>([])

  const isPackagePurchase = !!packageParam
  const t = templates.find(tp => tp.slug === slug)
  const cat = t ? categories.find(c => c.slug === t.categorySlug) : null
  // Tvåspråkig PDF bara om det tvåspråkiga paketet betalades, oavsett URL:en.
  const isBilingualDownload = !!(paidType === 'bilingual' && t?.bilingual && t?.en)
  const isFramtidsfullmakt = t?.documentKind === 'framtidsfullmakt'

  // Kontrollera betalningen mot Stripe. Samma giltiga session_id godtas vid
  // varje omladdning, så att en kund som tappat nedladdningen inte låses ute.
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      // Kreditinlösen: webbläsaren måste ha en betald paketsession.
      const id = usedCredit ? getLastPackageSession() : sessionId
      let query: string | null = null
      if (id && isPackagePurchase) query = `package=${encodeURIComponent(packageParam || '')}`
      else if (id && usedCredit && slug) query = 'credit=1'
      else if (id && slug) query = `slug=${encodeURIComponent(slug)}`
      if (!id || !query) {
        setVerify('fail')
        return
      }
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(id)}&${query}`, { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (!res.ok || !data.ok) {
          setVerify('fail')
          return
        }
        setPaidType(data.packageType)
        if (isPackagePurchase) {
          // Paketköp: dela ut krediter exakt en gång per Stripe-session.
          const pkg = getPackage(data.packageType)
          grantPackageCredits(sessionId, pkg.credits)
          trackEvent('purchase', {
            transaction_id: sessionId || `pkg_${pkg.type}`,
            currency: 'SEK',
            value: pkg.price,
            items: [{ item_id: `package_${pkg.type}`, item_name: pkg.name, item_category: 'Paket', price: pkg.price, quantity: 1 }],
          })
        }
        setCreditsState(getCredits())
        setVerify('ok')
      } catch {
        if (!cancelled) setVerify('fail')
      }
    }
    setCreditsState(getCredits())
    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Retrieve saved form data from localStorage
  const getFormData = () => {
    if (typeof window === 'undefined' || !slug) return {}
    try {
      const saved = localStorage.getItem(`draft_${slug}`)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  // Mallarna använder olika fält-id:n för samma roll. Ta första ifyllda värdet.
  const pick = (formData: Record<string, string>, ...ids: string[]) =>
    ids.map(id => formData[id]).find(v => v?.trim()) || ''

  const handleDownload = async () => {
    if (!t || verify !== 'ok') return
    setDownloading(true)

    try {
      const { downloadPdf, PdfValidationError } = await import('@/lib/pdf-generator')
      const formData = getFormData()

      // Framtidsfullmakt (lag 2017:310) har en egen layout. Ömsesidig mall för
      // makar/sambor ger två separata dokument – ett per fullmaktsgivare.
      if (t.documentKind === 'framtidsfullmakt') {
        const { buildFramtidsfullmaktData } = await import('@/lib/framtidsfullmakt-data')
        try {
          downloadPdf({
            templateName: t.name,
            categoryName: cat?.name || '',
            givare: { namn: '', personnummer: '', adress: '' },
            havare: { namn: '', personnummer: '', relation: '' },
            detaljer: {},
            framtidsfullmakt: buildFramtidsfullmaktData(t, formData),
            watermark: false,
          }, `framtidsfullmakt-${t.slug}.pdf`)
          setMissingFields([])
          setDownloaded(true)
        } catch (err) {
          if (err instanceof PdfValidationError) {
            setMissingFields(err.missing)
            return
          }
          throw err
        }
        return
      }

      // Fält som redan skrivs ut på egen plats i PDF:en ska inte upprepas.
      const rendered = new Set([
        'givare_namn', 'givare_pnr', 'givare_adress', 'givare_epost', 'givare_telefon',
        'fullmaktsgivare_namn', 'fullmaktsgivare_pnr', 'fullmaktsgivare_adress',
        'utstallare_namn', 'utstallare_pnr', 'vardnadshavare1_namn', 'vardnadshavare1_pnr',
        'havare_namn', 'havare_pnr', 'havare_relation', 'havare_adress',
        'ombud_namn', 'ombud_pnr', 'ombud_relation', 'motande_vuxen',
        'giltig_fran', 'giltig_till', 'syfte', 'uppdrag', 'befogenheter', 'begransningar',
      ])

      // Övriga ifyllda uppgifter (barnets namn, flygbolag, djurets art …) med
      // mallens egna etiketter – och engelska etiketter för den engelska sidan.
      const extraDetails = t.fields
        .filter(f => !rendered.has(f.id) && formData[f.id]?.trim())
        .map(f => ({
          label: f.label,
          labelEn: fieldLabelsEn[f.id],
          value: formData[f.id],
        }))

      downloadPdf({
        templateName: t.name,
        documentTitle: t.documentTitle,
        categoryName: cat?.name || '',
        givare: {
          namn: pick(formData, 'givare_namn', 'fullmaktsgivare_namn', 'utstallare_namn', 'vardnadshavare1_namn'),
          personnummer: pick(formData, 'givare_pnr', 'fullmaktsgivare_pnr', 'utstallare_pnr', 'vardnadshavare1_pnr'),
          adress: pick(formData, 'givare_adress', 'fullmaktsgivare_adress'),
          epost: formData.givare_epost,
          telefon: formData.givare_telefon,
        },
        havare: {
          namn: pick(formData, 'havare_namn', 'ombud_namn', 'motande_vuxen'),
          personnummer: pick(formData, 'havare_pnr', 'ombud_pnr'),
          relation: pick(formData, 'havare_relation', 'ombud_relation'),
          adress: formData.havare_adress,
        },
        detaljer: {
          giltigFran: formData.giltig_fran,
          giltigTill: formData.giltig_till,
          syfte: pick(formData, 'syfte', 'uppdrag', 'befogenheter'),
          begransningar: formData.begransningar,
        },
        extraDetails,
        standardText: t.standardText,
        // Mallens juridiska notis skrivs ut för de tvåspråkiga mallarna, där
        // den har en engelsk motsvarighet på översättningssidan.
        legalInfo: t.bilingual ? t.legalInfo : undefined,
        bilingual: isBilingualDownload,
        en: t.en
          ? {
              templateName: t.en.name,
              documentTitle: t.en.documentTitle,
              categoryName: t.en.category,
              standardText: t.en.standardText,
              legalInfo: t.en.legalInfo,
            }
          : undefined,
        watermark: false, // NO watermark - paid version!
      }, `fullmakt-${t.slug}${isBilingualDownload ? '-sv-en' : ''}.pdf`)

      setDownloaded(true)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Något gick fel. Kontakta support@fullmakt24.se med ditt betalnings-ID.')
    } finally {
      setDownloading(false)
    }
  }

  // Auto-download efter godkänd kontroll (endast mallnedladdningar)
  useEffect(() => {
    if (verify === 'ok' && !isPackagePurchase && t && (sessionId || usedCredit)) {
      // Köpet via Stripe ska räknas som purchase. Kreditnedladdning räknades
      // redan vid paketköpet, så då skickas inget nytt purchase-event.
      if (sessionId && !usedCredit) {
        const value = isBilingualDownload ? 149 : 99
        trackEvent('purchase', {
          transaction_id: sessionId,
          currency: 'SEK',
          value,
          items: [{ item_id: t.slug, item_name: t.name, item_category: t.category, price: value, quantity: 1 }],
        })
      }
      const timer = setTimeout(() => handleDownload(), 1500)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, sessionId, verify])

  /* ── Betalningskontroll ───────────────────────────────────────────────── */
  if (verify === 'pending') {
    return (
      <div className="section-padding py-20 text-center">
        <p className="text-navy-400" role="status">Kontrollerar betalningen…</p>
      </div>
    )
  }

  if (verify === 'fail') {
    const backHref = t ? `/skapa/${t.slug}` : isPackagePurchase ? '/priser' : '/mallar'
    const backLabel = t ? `← Tillbaka till ${t.name}` : isPackagePurchase ? '← Tillbaka till priser' : '← Tillbaka till mallar'
    return (
      <div className="section-padding py-16 lg:py-24">
        <div className="max-w-lg mx-auto text-center" role="alert">
          <h1 className="text-2xl font-heading font-bold text-navy-500 mb-3">Vi kunde inte bekräfta betalningen</h1>
          <p className="text-navy-400 mb-2">
            {usedCredit
              ? 'Vi hittade inget betalt paket i den här webbläsaren. Paketkrediter kan bara användas i den webbläsare där paketet köptes.'
              : 'Länken gäller inte ett genomfört köp av det här dokumentet, så ingen PDF har skapats.'}
          </p>
          <p className="text-navy-400 mb-8">
            Har du betalat? Kontakta{' '}
            <a href="mailto:support@fullmakt24.se" className="text-gold-600 font-semibold underline">support@fullmakt24.se</a>
            {sessionId ? ' och skicka med länken till den här sidan' : ''}, så hjälper vi dig.
          </p>
          <Link href={backHref} className="btn-primary">{backLabel}</Link>
        </div>
      </div>
    )
  }

  /* ── Paketköp-bekräftelse ─────────────────────────────────────────────── */
  if (isPackagePurchase) {
    const pkg = getPackage(paidType)
    return (
      <div className="section-padding py-16 lg:py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-success">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-3xl font-heading font-bold text-navy-500 mb-3">Tack för ditt köp!</h1>
          <p className="text-navy-400 text-lg mb-2">Du har köpt <strong className="text-navy-600">{pkg.name}</strong>.</p>

          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6 my-8">
            <div className="text-4xl font-heading font-bold text-navy-600 mb-1">{credits}</div>
            <div className="text-sm text-gold-700">nedladdningar kvar i ditt paket</div>
          </div>

          <p className="text-sm text-navy-400 mb-8">
            Välj vilka fullmakter du vill skapa. En nedladdning dras av varje gång du
            laddar ner en färdig PDF – utan ny betalning.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/mallar" className="btn-gold">Välj din första fullmakt →</Link>
            <Link href="/" className="btn-secondary">Tillbaka till startsidan</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Template-nedladdning (single eller kreditköp) ────────────────────── */
  if (!t) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-navy-500 mb-4">Något gick fel</h1>
        <p className="text-navy-400 mb-6">Vi kunde inte hitta din fullmakt. Kontakta oss om problemet kvarstår.</p>
        <Link href="/mallar" className="btn-primary">← Tillbaka till mallar</Link>
      </div>
    )
  }

  return (
    <div className="section-padding py-16 lg:py-24">
      <div className="max-w-lg mx-auto text-center">
        {/* Success animation */}
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-success">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/>
            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-3xl font-heading font-bold text-navy-500 mb-3">
          {usedCredit ? 'Din fullmakt är klar!' : 'Tack för ditt köp!'}
        </h1>
        <p className="text-navy-400 text-lg mb-2">
          Din fullmakt laddas ner automatiskt.
        </p>
        {isBilingualDownload && (
          <p className="text-sm text-navy-500 mb-2">
            🌍 PDF:en innehåller den svenska originalversionen följd av den engelska
            översättningen – klar att visa upp utomlands.
          </p>
        )}
        {sessionId && !usedCredit && (
          <p className="text-sm text-navy-300 mb-2">
            Betalnings-ID: {sessionId?.slice(0, 20)}...
          </p>
        )}
        {usedCredit && (
          <p className="text-sm text-gold-700 mb-2">
            En paketkredit användes. Du har <strong>{credits}</strong> nedladdningar kvar.
          </p>
        )}
        <div className="mb-8" />

        {missingFields.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-left mb-8" role="alert">
            <h3 className="font-semibold text-red-800 text-sm mb-2">Dokumentet kunde inte skapas</h3>
            <p className="text-sm text-red-700 mb-2">
              En framtidsfullmakt måste innehålla följande uppgifter, som saknas i formuläret:
            </p>
            <ul className="text-sm text-red-700 list-disc list-inside mb-3">
              {missingFields.map(m => <li key={m}>{m}</li>)}
            </ul>
            <Link href={`/skapa/${t.slug}`} className="text-sm font-semibold text-red-800 underline">
              Fyll i uppgifterna och ladda ner igen →
            </Link>
            <p className="text-xs text-red-600 mt-2">Ditt köp finns kvar – du behöver inte betala igen på den här enheten.</p>
          </div>
        )}

        {/* Download button */}
        <div className="space-y-3 max-w-sm mx-auto mb-10">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-gold w-full !py-4 text-lg"
          >
            {downloading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Genererar PDF...
              </span>
            ) : downloaded ? (
              '✓ Nedladdad! Klicka för att ladda ner igen'
            ) : (
              '↓ Ladda ner din fullmakt (PDF)'
            )}
          </button>

          <button onClick={() => window.print()} className="btn-secondary w-full">
            🖨️ Skriv ut direkt
          </button>
        </div>

        {/* Info */}
        <div className="card p-6 text-left mb-8">
          <h3 className="font-heading font-bold text-navy-500 mb-3">Ditt dokument</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy-400">Mall:</span>
              <span className="text-navy-600 font-medium">{t.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Kategori:</span>
              <span className="text-navy-600">{cat?.icon} {cat?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Format:</span>
              <span className="text-navy-600">PDF utan vattenstämpel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">{usedCredit ? 'Betalsätt:' : 'Pris:'}</span>
              <span className="text-navy-600 font-medium">{usedCredit ? 'Paketkredit' : `${getPackage(paidType).price} kr`}</span>
            </div>
          </div>
        </div>

        {/* Krediter kvar */}
        {credits > 0 && (
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 text-left mb-8">
            <p className="text-sm text-gold-800">
              💳 Du har <strong>{credits}</strong> nedladdningar kvar i ditt paket.{' '}
              <Link href="/mallar" className="font-semibold underline">Skapa nästa fullmakt →</Link>
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 text-left mb-8">
          <h3 className="font-semibold text-gold-800 text-sm mb-2">💡 Nästa steg</h3>
          {isFramtidsfullmakt ? (
            <ol className="text-sm text-gold-700 space-y-1.5 list-decimal list-inside">
              <li>Skriv ut dokumentet{t.mutual ? 'en – ett per person' : ''}</li>
              <li>Skriv under i två vittnens samtidiga närvaro – det är ett lagkrav</li>
              <li>Vittnena får inte vara fullmaktshavaren eller nära släkt med fullmaktsgivaren (se dokumentet)</li>
              <li>Förvara originalet säkert – banken vill se det i original</li>
            </ol>
          ) : (
            <ol className="text-sm text-gold-700 space-y-1.5 list-decimal list-inside">
              <li>Skriv ut dokumentet eller spara PDF:en</li>
              <li>Fullmaktsgivaren skriver under</li>
              <li>Låt gärna två vittnen också skriva under</li>
              <li>Ge en kopia till fullmaktshavaren</li>
            </ol>
          )}
        </div>

        {/* Create another */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/mallar" className="btn-primary">
            Skapa en till fullmakt →
          </Link>
          <Link href="/" className="btn-secondary">
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  )
}


export default function BetaldPage() {
  return (
    <Suspense fallback={<div className="section-padding py-20 text-center"><p className="text-navy-400">Laddar...</p></div>}>
      <BetaldContent />
    </Suspense>
  )
}
