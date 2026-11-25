// /betald skapar aldrig en PDF med tomma fält (lib/document-data.ts) och lägger
// tillbaka en paketkredit som dragits för en PDF som inte kunde skapas
// (lib/packages.ts). Sidans beteende i webbläsaren provas separat.

import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { templates } from '../../data/templates'
import { missingRequiredFields } from '../../lib/document-data'
import {
  getCredits, setCredits, markCreditPending, settleCreditPending, refundPendingCredits, creditWasRefunded,
} from '../../lib/packages'
import { fillTemplate } from '../pdf/harness'

/* ── Obligatoriska fält ──────────────────────────────────────────────────── */

test('varje obligatoriskt fält hör till ett av formulärets steg', () => {
  // /skapa spärrar stegen per grupp; /betald kontrollerar alla obligatoriska
  // fält. Kraven är bara desamma om varje obligatoriskt fält har en grupp.
  const utan = templates.flatMap(t =>
    t.fields.filter(f => f.required && !['givare', 'havare', 'detaljer'].includes(f.group || '')).map(f => `${t.slug}:${f.id}`))
  assert.deepEqual(utan, [])
})

test('inget utkast: alla obligatoriska fält saknas, i varje mall', () => {
  for (const t of templates) {
    const missing = missingRequiredFields(t, {})
    assert.ok(missing.length > 0, `${t.slug} har inga obligatoriska fält`)
    assert.deepEqual(missing.map(f => f.id), t.fields.filter(f => f.required).map(f => f.id))
  }
})

test('fullständigt utkast: inget saknas, i varje mall', () => {
  for (const t of templates) assert.deepEqual(missingRequiredFields(t, fillTemplate(t)), [], t.slug)
})

test('blanksteg räknas som tomt, valfria fält krävs inte', () => {
  const t = templates.find(tp => tp.slug === 'generell-fullmakt')!
  const values = fillTemplate(t)
  const req = t.fields.find(f => f.required)!
  const opt = t.fields.find(f => !f.required)!
  values[req.id] = '   '
  delete values[opt.id]
  assert.deepEqual(missingRequiredFields(t, values).map(f => f.id), [req.id])
})

/* ── Paketkrediter ───────────────────────────────────────────────────────── */

const store = new Map<string, string>()
Object.assign(globalThis, {
  window: {},
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, String(v)) },
    removeItem: (k: string) => { store.delete(k) },
  },
})

beforeEach(() => store.clear())

test('dragen kredit utan PDF läggs tillbaka, men bara en gång', () => {
  setCredits(2) // tre köpta, en dragen i /skapa
  markCreditPending('generell-fullmakt')
  assert.equal(refundPendingCredits('generell-fullmakt'), 1)
  assert.equal(getCredits(), 3)
  // Omladdning av /betald: ingen ny kredit.
  assert.equal(refundPendingCredits('generell-fullmakt'), 0)
  assert.equal(getCredits(), 3)
})

test('skapad PDF förbrukar krediten, och en senare omladdning ger ingen tillbaka', () => {
  setCredits(2)
  markCreditPending('generell-fullmakt')
  settleCreditPending('generell-fullmakt')
  assert.equal(refundPendingCredits('generell-fullmakt'), 0)
  assert.equal(getCredits(), 2)
  assert.equal(store.has('package_pending_credits'), false)
})

test('två dragna krediter, en PDF: en kredit läggs tillbaka', () => {
  setCredits(1)
  markCreditPending('generell-fullmakt')
  markCreditPending('generell-fullmakt')
  settleCreditPending('generell-fullmakt')
  assert.equal(refundPendingCredits('generell-fullmakt'), 1)
  assert.equal(getCredits(), 2)
})

test('återbetalning gäller bara den egna mallen och rör inga andra nycklar', () => {
  setCredits(0)
  store.set('draft_generell-fullmakt', '{"givare_namn":"Anna"}')
  store.set('package_processed_sessions', '["cs_test_1"]')
  markCreditPending('fullmakt-handelsbanken')
  assert.equal(refundPendingCredits('generell-fullmakt'), 0)
  assert.equal(getCredits(), 0)
  assert.equal(refundPendingCredits('fullmakt-handelsbanken'), 1)
  assert.equal(store.get('draft_generell-fullmakt'), '{"givare_namn":"Anna"}')
  assert.equal(store.get('package_processed_sessions'), '["cs_test_1"]')
})

test('trasigt eller påhittat innehåll ger inga krediter', () => {
  setCredits(0)
  for (const raw of ['inte json', '[1,2]', '{"generell-fullmakt":-5}', '{"generell-fullmakt":"9"}', '{"generell-fullmakt":null}']) {
    store.set('package_pending_credits', raw)
    assert.equal(refundPendingCredits('generell-fullmakt'), 0, raw)
  }
  assert.equal(getCredits(), 0)
})

test('återlagd kredit syns även efter omladdning, tills en ny kredit dras eller en PDF skapas', () => {
  setCredits(0)
  assert.equal(creditWasRefunded('generell-fullmakt'), false)
  markCreditPending('generell-fullmakt')
  refundPendingCredits('generell-fullmakt')
  assert.equal(creditWasRefunded('generell-fullmakt'), true)
  assert.equal(refundPendingCredits('generell-fullmakt'), 0) // omladdning
  assert.equal(creditWasRefunded('generell-fullmakt'), true)
  assert.equal(creditWasRefunded('fullmakt-handelsbanken'), false)
  markCreditPending('generell-fullmakt')
  assert.equal(creditWasRefunded('generell-fullmakt'), false)
  refundPendingCredits('generell-fullmakt')
  settleCreditPending('generell-fullmakt')
  assert.equal(creditWasRefunded('generell-fullmakt'), false)
  assert.equal(store.has('package_refunded_credits'), false)
})
