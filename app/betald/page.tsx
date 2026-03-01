'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { templates, categories } from '@/data/templates'

export default function BetaldPage() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  const sessionId = searchParams.get('session_id')
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const t = templates.find(tp => tp.slug === slug)
  const cat = t ? categories.find(c => c.slug === t.categorySlug) : null

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

  const handleDownload = async () => {
    if (!t) return
    setDownloading(true)

    try {
      const { downloadPdf } = await import('@/lib/pdf-generator')
      const formData = getFormData()

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
        watermark: false, // NO watermark - paid version!
      }, `fullmakt-${t.slug}.pdf`)

      setDownloaded(true)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Något gick fel. Kontakta support@fullmakt24.se med ditt betalnings-ID.')
    } finally {
      setDownloading(false)
    }
  }

  // Auto-download on page load
  useEffect(() => {
    if (t && sessionId) {
      const timer = setTimeout(() => handleDownload(), 1500)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, sessionId])

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
          Tack för ditt köp!
        </h1>
        <p className="text-navy-400 text-lg mb-2">
          Din fullmakt laddas ner automatiskt.
        </p>
        <p className="text-sm text-navy-300 mb-8">
          Betalnings-ID: {sessionId?.slice(0, 20)}...
        </p>

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
              <span className="text-navy-400">Pris:</span>
              <span className="text-navy-600 font-medium">49 kr</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 text-left mb-8">
          <h3 className="font-semibold text-gold-800 text-sm mb-2">💡 Nästa steg</h3>
          <ol className="text-sm text-gold-700 space-y-1.5 list-decimal list-inside">
            <li>Skriv ut dokumentet eller spara PDF:en</li>
            <li>Fullmaktsgivaren skriver under</li>
            <li>Låt gärna två vittnen också skriva under</li>
            <li>Ge en kopia till fullmaktshavaren</li>
          </ol>
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
