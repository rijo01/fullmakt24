// Kontrollerar den betalda PDF:en för varje mall: alla fält fylls med testdata,
// PDF:en skapas med samma kod som /betald använder, och texten läses tillbaka.
//
// För varje mall (utom framtidsfullmakt, se nedan) gäller:
//  1. Ingen platshållare inom hakparentes finns kvar, t.ex. "[Fullmaktshavarens namn]".
//  2. Varje ifyllt värde står exakt en gång, i avsnittet för fältets roll.
//     Undantag som återges i löptext, och därför står exakt en gång till där:
//     - fullmaktsgivarens och fullmaktshavarens namn: i uppdragsmeningen och under underskriften
//     - deras personnummer/organisationsnummer: i uppdragsmeningen
//     - den som skriver under för ett företag: i uppdragsmeningen och under underskriften
//  3. I fullmaktsmallar är varken fullmaktsgivarens (eller vårdnadshavarens)
//     avsnitt eller fullmaktshavarens avsnitt tomt.
//  4. Mallen anger vad uppdraget är (uppdragsfält, uppdragText eller standardText).
//  5. Tvåspråkiga mallar: samma kontroller på den engelska sidan, och varje fält
//     har en engelsk etikett.
//
// Framtidsfullmakt (lag 2017:310) har en egen layout där lagens formuleringar
// upprepar parternas namn och personnummer. Där kontrolleras 1 och att varje
// värde finns med.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { templates, fieldLabelsEn, type Template, type TemplateField } from '../../data/templates'
import { generatePdf, sectionHeading, sectionHeadings, formatDate, type PdfLang } from '../../lib/pdf-generator'
import { buildPaidDocument, buildPreviewDocument } from '../../lib/document-data'
import { fillTemplate, pdfTextItems, splitSections, countOccurrences, findBracketPlaceholders } from './harness'

type Problem = { slug: string; problem: string; field?: string; detail?: string }

const PARTY = new Set(['givare', 'vardnadshavare', 'havare'])
const isFullmakt = (t: Template) => !t.documentTitle || t.documentTitle === 'FULLMAKT'
const principalRole = (t: Template) =>
  t.fields.some(f => f.role === 'givare' && f.key === 'namn') ? 'givare' : 'vardnadshavare'

/** Hur många gånger ett värde ska stå i vart avsnitt. */
function expectedCounts(t: Template, f: TemplateField, lang: PdfLang): Map<string, number> {
  const counts = new Map<string, number>([[sectionHeading(f.role, lang), 1]])
  const party = f.role === principalRole(t) || f.role === 'havare'
  if (party && f.key) {
    const add = (h: string) => counts.set(h, (counts.get(h) || 0) + 1)
    add(sectionHeading('uppdrag', lang))
    if (f.key === 'namn' || f.key === 'undertecknare') add(sectionHeading('underskrifter', lang))
  }
  return counts
}

function checkVersion(t: Template, values: Record<string, string>, items: string[], lang: PdfLang, problems: Problem[]) {
  const where = lang === 'en' ? ' (engelska sidan)' : ''
  const all = ` ${items.join(' ')} `
  for (const p of new Set(findBracketPlaceholders(all))) problems.push({ slug: t.slug, problem: `platshållare kvar${where}`, detail: p })
  // Mallen ska ange vad uppdraget är: ett uppdragsfält, uppdragText eller standardText.
  if (/Företräda fullmaktsgivaren i de angelägenheter som anges i denna handling|Represent the principal in the matters set out in this document/.test(all.replace(/\s+/g, ' ')))
    problems.push({ slug: t.slug, problem: `uppdraget saknas – allmän reservtext används${where}` })

  const ff = t.documentKind === 'framtidsfullmakt'
  const sections = splitSections(items, new Set(sectionHeadings(lang)))
  const textOf = (h: string) => sections.filter(s => s.heading === h).map(s => s.text).join(' ')
  const headingsPresent = [...new Set(sections.map(s => s.heading))]

  for (const f of t.fields) {
    if (f.type === 'checkbox') continue
    // Framtidsfullmakt: val (arvode, makar/sambor) uttrycks med lagens formuleringar.
    if (ff && f.type === 'select') continue
    const shown = f.type === 'date' ? formatDate(values[f.id], lang) : values[f.id]
    if (ff) {
      if (countOccurrences(all, shown) === 0) problems.push({ slug: t.slug, problem: `värde saknas${where}`, field: f.id, detail: f.label })
      continue
    }
    const expected = expectedCounts(t, f, lang)
    for (const h of new Set([...headingsPresent, ...expected.keys()])) {
      const want = expected.get(h) || 0
      // Ett valt alternativ kan stå i mallens fasta text; där räknas bara det egna avsnittet.
      if (f.type === 'select' && want === 0) continue
      const got = countOccurrences(textOf(h), shown)
      if (got !== want) {
        problems.push({
          slug: t.slug,
          problem: want === 0 ? `värde i fel avsnitt${where}` : got === 0 ? `värde saknas i avsnittet${where}` : `värdet står fel antal gånger${where}`,
          field: f.id,
          detail: `${f.label} (roll ${f.role}): ${got} gånger under ${h}, ska vara ${want}`,
        })
      }
    }
  }

  if (!ff && isFullmakt(t)) {
    const hasValue = (role: string) => t.fields.some(f =>
      f.role === role && f.type !== 'checkbox' &&
      countOccurrences(textOf(sectionHeading(f.role, lang)), f.type === 'date' ? formatDate(values[f.id], lang) : values[f.id]) > 0)
    if (!hasValue(principalRole(t))) problems.push({ slug: t.slug, problem: `avsnittet ${sectionHeading(principalRole(t), lang)} är tomt${where}` })
    if (!hasValue('havare')) problems.push({ slug: t.slug, problem: `avsnittet ${sectionHeading('havare', lang)} är tomt${where}` })
    // Parterna ska vara namngivna, så att uppdragsmeningen och underskrifterna har namn.
    if (!t.fields.some(f => f.role === 'havare' && f.key === 'namn')) problems.push({ slug: t.slug, problem: 'fullmaktshavaren saknar namnfält (roll havare, key namn)' })
  }
  if (!ff && !t.fields.some(f => f.role === principalRole(t) && f.key === 'namn'))
    problems.push({ slug: t.slug, problem: 'fullmaktsgivaren saknar namnfält (roll givare eller vardnadshavare, key namn)' })
}

async function checkTemplate(t: Template): Promise<Problem[]> {
  const problems: Problem[] = []
  const values = fillTemplate(t)

  const sv = await pdfTextItems(generatePdf(buildPaidDocument(t, values, false)).output('arraybuffer'))
  checkVersion(t, values, sv.flat(), 'sv', problems)
  if (sv.flat().some(s => /FÖRHANDSVISNING|PREVIEW/.test(s))) problems.push({ slug: t.slug, problem: 'vattenstämpel i den betalda PDF:en' })

  if (t.bilingual && t.en) {
    const pages = await pdfTextItems(generatePdf(buildPaidDocument(t, values, true)).output('arraybuffer'))
    const notice = 'English translation – for use abroad. The Swedish version is the original.'
    const firstEn = pages.findIndex(p => p.includes(notice))
    if (firstEn < 0) problems.push({ slug: t.slug, problem: 'engelska sidan saknas i den tvåspråkiga PDF:en' })
    else {
      checkVersion(t, values, pages.slice(0, firstEn).flat(), 'sv', problems)
      checkVersion(t, values, pages.slice(firstEn).flat(), 'en', problems)
    }
    for (const f of t.fields) if (!fieldLabelsEn[f.id]) problems.push({ slug: t.slug, problem: 'engelsk etikett saknas', field: f.id, detail: f.label })
  }
  return problems
}

test('malldatan: 238 mallar, unika slugs, varje fält har en roll', () => {
  assert.equal(templates.length, 238)
  assert.equal(new Set(templates.map(t => t.slug)).size, templates.length)
  for (const t of templates) for (const f of t.fields) assert.ok(f.role, `${t.slug}: ${f.id} saknar roll`)
})

test('den betalda PDF:en för varje mall', async () => {
  const problems = (await Promise.all(templates.map(checkTemplate))).flat()
  if (problems.length) {
    const lines = problems.map(p => [p.slug, p.problem, p.field || '', p.detail || ''].join('\t'))
    const broken = new Set(problems.map(p => p.slug))
    assert.fail(`${broken.size} av ${templates.length} mallar bryter mot kontrollerna (${problems.length} fel):\n${lines.join('\n')}`)
  }
})

test('förhandsvisningen har vattenstämpel, den betalda PDF:en inte', async () => {
  const t = templates.find(x => x.slug === 'generalfullmakt-privatperson-2026')!
  const values = fillTemplate(t)
  const preview = (await pdfTextItems(generatePdf(buildPreviewDocument(t, values, false)).output('arraybuffer'))).flat()
  const paid = (await pdfTextItems(generatePdf(buildPaidDocument(t, values, false)).output('arraybuffer'))).flat()
  assert.ok(preview.includes('FÖRHANDSVISNING'))
  assert.ok(!paid.includes('FÖRHANDSVISNING'))
})
