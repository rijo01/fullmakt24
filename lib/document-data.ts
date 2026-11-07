// Bygger PDF-generatorns indata från mallen och det kunden fyllt i. Används av
// både förhandsvisningen (/skapa) och den betalda nedladdningen (/betald), så
// att förhandsvisningen visar exakt samma dokument som levereras – bara med
// vattenstämpel.

import { categories, fieldLabelsEn, type Template } from '@/data/templates'
import type { PdfData } from '@/lib/pdf-generator'
import { buildFramtidsfullmaktData } from '@/lib/framtidsfullmakt-data'

type FormData = Record<string, string | undefined>

function build(t: Template, formData: FormData, bilingual: boolean, watermark: boolean): PdfData {
  const cat = categories.find(c => c.slug === t.categorySlug)
  const base = {
    templateName: t.name,
    documentTitle: t.documentTitle,
    categoryName: cat?.name || '',
    watermark,
  }

  // Framtidsfullmakt (lag 2017:310) har en egen layout med lagstadgade
  // formuleringar. Ömsesidig mall för makar/sambor ger två separata dokument.
  if (t.documentKind === 'framtidsfullmakt') {
    return { ...base, fields: [], framtidsfullmakt: buildFramtidsfullmaktData(t, formData) }
  }

  return {
    ...base,
    // Varje fält följer med sin uttryckliga roll (data/field-roles.ts) och
    // mallens egen etikett. Generatorn placerar värdet enbart utifrån rollen.
    fields: t.fields.map(f => ({
      id: f.id,
      role: f.role,
      key: f.key,
      person: f.person,
      type: f.type,
      label: f.label,
      labelEn: fieldLabelsEn[f.id],
      value: formData[f.id]?.trim() || '',
    })),
    uppdragText: t.uppdragText,
    standardText: t.standardText,
    // Mallens juridiska notis skrivs ut för de tvåspråkiga mallarna, där
    // den har en engelsk motsvarighet på översättningssidan.
    legalInfo: t.bilingual ? t.legalInfo : undefined,
    bilingual,
    en: t.en
      ? {
          templateName: t.en.name,
          documentTitle: t.en.documentTitle,
          categoryName: t.en.category,
          standardText: t.en.standardText,
          legalInfo: t.en.legalInfo,
        }
      : undefined,
  }
}

/** Tvåspråkig PDF bara om mallen har en engelsk version. */
const canBeBilingual = (t: Template, bilingual: boolean) => !!(bilingual && t.bilingual && t.en)

/** Den betalda PDF:en. Har aldrig vattenstämpel. */
export function buildPaidDocument(t: Template, formData: FormData, bilingual: boolean): PdfData {
  return build(t, formData, canBeBilingual(t, bilingual), false)
}

/** Förhandsvisningen: samma dokument som den betalda PDF:en, med vattenstämpel. */
export function buildPreviewDocument(t: Template, formData: FormData, bilingual: boolean): PdfData {
  return build(t, formData, canBeBilingual(t, bilingual), true)
}

export function paidFilename(t: Template, bilingual: boolean): string {
  if (t.documentKind === 'framtidsfullmakt') return `framtidsfullmakt-${t.slug}.pdf`
  return `fullmakt-${t.slug}${canBeBilingual(t, bilingual) ? '-sv-en' : ''}.pdf`
}
