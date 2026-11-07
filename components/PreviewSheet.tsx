'use client'

import { useEffect, useRef } from 'react'
import type { Template } from '@/data/templates'
import DocumentPreview from '@/components/DocumentPreview'

interface Props {
  open: boolean
  onClose: () => void
  template: Template
  formData: Record<string, string>
  bilingual: boolean
}

/** Förhandsvisningen i helskärm, för skärmar där sidopanelen inte får plats. */
export default function PreviewSheet({ open, onClose, template, formData, bilingual }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      prevFocus?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-navy-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-sheet-title"
    >
      <div className="flex items-center justify-between gap-3 bg-navy-500 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 id="preview-sheet-title" className="text-sm font-semibold text-white">Förhandsvisning</h2>
        <button
          ref={closeRef}
          onClick={onClose}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          Stäng
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain p-4">
        <DocumentPreview template={template} formData={formData} bilingual={bilingual} />
      </div>
      <p className="border-t border-navy-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs text-navy-400">
        Så här blir dokumentet. Texten FÖRHANDSVISNING finns inte i PDF:en du laddar ner efter betalning.
      </p>
    </div>
  )
}
