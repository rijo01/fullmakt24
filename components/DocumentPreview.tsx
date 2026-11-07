'use client'

// Förhandsvisning av dokumentet. Skapar samma PDF som levereras efter betalning
// (lib/document-data.ts), men med vattenstämpeln FÖRHANDSVISNING, och ritar
// sidorna som bilder med pdf.js. Själva PDF-filen lämnas aldrig ut härifrån.

import { useEffect, useRef, useState } from 'react'
import type { Template } from '@/data/templates'

type PdfJs = typeof import('pdfjs-dist/legacy/build/pdf.mjs')
let pdfjsPromise: Promise<PdfJs> | null = null

function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs').then(pdfjs => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString()
      return pdfjs
    })
  }
  return pdfjsPromise
}

interface Props {
  template: Template
  formData: Record<string, string>
  bilingual: boolean
  /** Visa bara första sidan (kompakt kort). */
  firstPageOnly?: boolean
  className?: string
}

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; pages: string[] }
  | { kind: 'missing'; fields: string[] }
  | { kind: 'error' }

export default function DocumentPreview({ template, formData, bilingual, firstPageOnly, className }: Props) {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const run = useRef(0)

  useEffect(() => {
    const id = ++run.current
    // Vänta tills kunden slutat skriva innan dokumentet byggs om.
    const timer = setTimeout(async () => {
      try {
        const [{ generatePdf, PdfValidationError }, { buildPreviewDocument }, pdfjs] = await Promise.all([
          import('@/lib/pdf-generator'),
          import('@/lib/document-data'),
          loadPdfJs(),
        ])
        let bytes: ArrayBuffer
        try {
          bytes = generatePdf(buildPreviewDocument(template, formData, bilingual)).output('arraybuffer')
        } catch (err) {
          if (err instanceof PdfValidationError) {
            if (id === run.current) setState({ kind: 'missing', fields: err.missing })
            return
          }
          throw err
        }

        const pdf = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise
        const count = firstPageOnly ? 1 : pdf.numPages
        const pages: string[] = []
        // A4 i ungefär 1100 px bredd räcker för skarp text även på retina.
        const scale = firstPageOnly ? 1.2 : 1.9
        for (let n = 1; n <= count; n++) {
          if (id !== run.current) return
          const page = await pdf.getPage(n)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = Math.ceil(viewport.width)
          canvas.height = Math.ceil(viewport.height)
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('canvas saknas')
          await page.render({ canvasContext: ctx, viewport }).promise
          pages.push(canvas.toDataURL('image/png'))
        }
        await pdf.destroy()
        if (id === run.current) setState({ kind: 'ready', pages })
      } catch (err) {
        console.error('Förhandsvisningen kunde inte skapas:', err)
        if (id === run.current) setState({ kind: 'error' })
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [template, formData, bilingual, firstPageOnly])

  // Kompakt kort: bara en miniatyr, inga meddelanden.
  if (firstPageOnly && state.kind !== 'ready') {
    return <div className={`aspect-[210/297] w-full bg-navy-50 ${state.kind === 'loading' ? 'animate-pulse' : ''} ${className || ''}`} />
  }

  if (state.kind === 'missing') {
    return (
      <div className={`p-5 text-sm text-navy-500 ${className || ''}`}>
        <p className="font-semibold mb-2">Fyll i följande för att se dokumentet:</p>
        <ul className="list-disc list-inside text-navy-400 space-y-0.5">
          {state.fields.map(f => <li key={f}>{f}</li>)}
        </ul>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <p className={`p-5 text-sm text-navy-400 ${className || ''}`}>
        Förhandsvisningen kunde inte visas. Du kan ändå gå vidare – dokumentet skapas med uppgifterna du fyllt i.
      </p>
    )
  }

  if (state.kind === 'loading') {
    return (
      <div className={`p-5 ${className || ''}`} role="status" aria-label="Förhandsvisningen laddas">
        <div className="aspect-[210/297] w-full bg-navy-50 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {state.pages.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={`Förhandsvisning av ${template.name}, sida ${i + 1}`}
          className="w-full h-auto bg-white shadow-sm border border-navy-100 select-none"
          draggable={false}
        />
      ))}
    </div>
  )
}
