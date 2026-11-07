// Hjälpfunktioner för PDF-testet: testdata per fält och textutdrag ur PDF:en.

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import type { Template, TemplateField } from '../../data/templates'

/**
 * Fyller alla fält med testdata. Textvärden är unika koder (T<n>Z) som inte kan
 * förekomma i mallens fasta text, så att varje värde kan räknas exakt. Datum är
 * unika dagar 2031–2032, val tar ett av mallens alternativ och kryssrutor kryssas.
 */
export function fillTemplate(t: Template): Record<string, string> {
  const values: Record<string, string> = {}
  t.fields.forEach((f, i) => {
    values[f.id] = testValue(f, i)
  })
  return values
}

function testValue(f: TemplateField, i: number): string {
  switch (f.type) {
    case 'date': {
      const d = new Date(Date.UTC(2031, 0, 1 + i * 17))
      return d.toISOString().slice(0, 10)
    }
    case 'select':
      return f.options?.[i % f.options.length] || `T${i}Z`
    case 'checkbox':
      return 'true'
    default:
      return `T${i}Z`
  }
}

/** Texten i PDF:en som en lista av textobjekt per sida, i den ordning de ritats. */
export async function pdfTextItems(bytes: ArrayBuffer): Promise<string[][]> {
  const pdf = await getDocument({ data: new Uint8Array(bytes), verbosity: 0 }).promise
  const pages: string[][] = []
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent()
    pages.push(
      content.items
        .map(item => ('str' in item ? item.str : ''))
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean),
    )
  }
  await pdf.destroy()
  return pages
}

/** Delar upp textobjekten i avsnitt. Ett objekt som exakt är en rubrik startar ett nytt avsnitt. */
export function splitSections(items: string[], headings: Set<string>): { heading: string; text: string }[] {
  const sections: { heading: string; items: string[] }[] = [{ heading: '(sidhuvud)', items: [] }]
  for (const item of items) {
    if (headings.has(item)) sections.push({ heading: item, items: [] })
    else sections[sections.length - 1].items.push(item)
  }
  // Samma rubrik kan fortsätta på nästa sida – slå ihop i ordning.
  return sections.map(s => ({ heading: s.heading, text: ` ${s.items.join(' ')} ` }))
}

/** Antal förekomster av ett värde i en text, där värdet står som eget ord. */
export function countOccurrences(text: string, value: string): number {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')
  const re = new RegExp(`(^|[\\s(:,])${escaped}(?=$|[\\s),.:])`, 'g')
  return (text.match(re) || []).length
}

/** Platshållare inom hakparentes, t.ex. "[Fullmaktshavarens namn]". */
export function findBracketPlaceholders(text: string): string[] {
  return text.match(/\[[^\]]{1,80}\]/g) || []
}
