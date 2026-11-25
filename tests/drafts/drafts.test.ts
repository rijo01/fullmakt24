// Utkasten i webbläsaren (lib/drafts.ts): tidsstämpel, rensning efter 30 dagar,
// gamla utkast utan tidsstämpel och knappen "Rensa mina uppgifter".

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readDraft, writeDraft, clearDrafts, hasDrafts, purgeOldDrafts, type DraftStorage } from '../../lib/drafts'

const DAY = 24 * 60 * 60 * 1000
const NOW = Date.UTC(2026, 10, 25, 12)

function mem(init: Record<string, string> = {}): DraftStorage & { map: Map<string, string> } {
  const map = new Map(Object.entries(init))
  return {
    map,
    get length() { return map.size },
    key: i => [...map.keys()][i] ?? null,
    getItem: k => map.get(k) ?? null,
    setItem: (k, v) => { map.set(k, v) },
    removeItem: k => { map.delete(k) },
  }
}
const stored = (savedAt: number, data: Record<string, string>) => JSON.stringify({ v: 1, savedAt, data })
const savedAt = (st: DraftStorage, slug: string) => JSON.parse(st.getItem('draft_' + slug)!).savedAt

test('utkast sparas med tidsstämpel och läses tillbaka', () => {
  const st = mem()
  writeDraft('a', { givare_pnr: '19800101-1234' }, { now: NOW }, st)
  assert.deepEqual(readDraft('a', st), { givare_pnr: '19800101-1234' })
  assert.equal(savedAt(st, 'a'), NOW)
})

test('gammalt utkast utan tidsstämpel får dagens datum och behålls', () => {
  const st = mem({ draft_a: JSON.stringify({ givare_namn: 'Anna' }) })
  assert.deepEqual(readDraft('a', st), { givare_namn: 'Anna' }) // läsbart även före rensningen
  purgeOldDrafts(NOW, st)
  assert.deepEqual(readDraft('a', st), { givare_namn: 'Anna' })
  assert.equal(savedAt(st, 'a'), NOW)
})

test('29 dagar behålls, 31 dagar tas bort', () => {
  const st = mem({ draft_ny: stored(NOW - 29 * DAY, { x: '1' }), draft_gammal: stored(NOW - 31 * DAY, { x: '2' }) })
  purgeOldDrafts(NOW, st)
  assert.deepEqual(readDraft('ny', st), { x: '1' })
  assert.equal(readDraft('gammal', st), null)
  assert.equal(st.map.has('draft_gammal'), false)
})

test('tidsstämpel i framtiden räknas som nu', () => {
  const st = mem({ draft_a: stored(NOW + 400 * DAY, { x: '1' }) })
  purgeOldDrafts(NOW, st)
  assert.equal(savedAt(st, 'a'), NOW)
  purgeOldDrafts(NOW + 31 * DAY, st)
  assert.equal(readDraft('a', st), null)
})

test('trasiga utkast tas bort, andra nycklar rörs inte', () => {
  const other = { package_credits: '3', package_processed_sessions: '["cs_test_1"]', 'fm24-samtycke': 'godkant', annat_draft_x: 'kvar' }
  const st = mem({ ...other, draft_trasig: '{inte json', draft_lista: '[1,2]', draft_fel: JSON.stringify({ v: 1, savedAt: 'igår', data: {} }) })
  purgeOldDrafts(NOW, st)
  assert.deepEqual(Object.fromEntries(st.map), other)
})

test('autosparning utan ändring förnyar inte tidsstämpeln, en ändring gör det', () => {
  const st = mem({ draft_a: stored(NOW - 20 * DAY, { x: '1' }) })
  writeDraft('a', { x: '1' }, { now: NOW }, st)
  assert.equal(savedAt(st, 'a'), NOW - 20 * DAY)
  writeDraft('a', { x: '2' }, { now: NOW }, st)
  assert.equal(savedAt(st, 'a'), NOW)
})

test('inför betalning, kredit och kvitto förnyas tidsstämpeln alltid', () => {
  // Ett utkast som inte ändrats på 29,9 dagar får inte försvinna medan kunden är hos Stripe.
  const st = mem({ draft_a: stored(NOW - 29.9 * DAY, { x: '1' }) })
  writeDraft('a', { x: '1' }, { touch: true, now: NOW }, st)
  purgeOldDrafts(NOW + 1 * DAY, st)
  assert.deepEqual(readDraft('a', st), { x: '1' })
})

test('rensa tar bort alla utkast men inte krediter eller samtycke', () => {
  const st = mem({ draft_a: stored(NOW, { x: '1' }), draft_b: JSON.stringify({ y: '2' }), package_credits: '2', 'fm24-samtycke': 'avvisat' })
  assert.equal(hasDrafts(st), true)
  clearDrafts(st)
  assert.equal(hasDrafts(st), false)
  assert.deepEqual(Object.fromEntries(st.map), { package_credits: '2', 'fm24-samtycke': 'avvisat' })
})
