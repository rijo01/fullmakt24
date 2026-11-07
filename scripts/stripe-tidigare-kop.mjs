#!/usr/bin/env node
// Listar lyckade köp i Stripe så att tidigare köpare kan få en rättad PDF.
// Varje rad får länken /skapa/<slug>?kvitto=<checkout_session_id>, och det
// markeras om mallen hade kritiska fel enligt docs/pdf-faltmappning-2026-11-07.tsv.
//
// Skriptet LÄSER bara (list-anrop). Kör med en restricted key som har "Read"
// på Checkout Sessions, för det Stripe-konto som produktionen använder:
//
//   STRIPE_KEY=rk_live_... node scripts/stripe-tidigare-kop.mjs
//
// Utdata innehåller kundernas e-post. Den skrivs till en fil UTANFÖR repot
// (standard ~/fullmakt24-tidigare-kop-<datum>.tsv, med rättigheter 600) och får
// aldrig committas. Valfritt:
//   OUT=/sökväg/fil.tsv     annan utdatafil (måste ligga utanför repot)
//   SINCE=2026-01-01        bara köp från och med datumet (standard: alla)

import Stripe from 'stripe'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const key = process.env.STRIPE_KEY
if (!key) {
  console.error('Sätt STRIPE_KEY till en restricted key med läsrättighet på Checkout Sessions.')
  process.exit(1)
}
if (!key.startsWith('rk_')) {
  console.error('Använd en restricted key (rk_live_…) med enbart läsrättigheter, inte en hemlig nyckel.')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const out = path.resolve(process.env.OUT || path.join(os.homedir(), `fullmakt24-tidigare-kop-${today}.tsv`))
if (out === repo || out.startsWith(repo + path.sep)) {
  console.error(`Utdatafilen får inte ligga i repot (${repo}). Välj en annan OUT.`)
  process.exit(1)
}
const since = process.env.SINCE ? Math.floor(new Date(`${process.env.SINCE}T00:00:00Z`).getTime() / 1000) : undefined

// Mallar med fel före rättningen: kritiska fel (platshållare, tomt
// partsavsnitt, partsuppgifter under fel rubrik) och övriga (dubbletter m.m.).
const tsv = fs.readFileSync(path.join(repo, 'docs/pdf-faltmappning-2026-11-07.tsv'), 'utf8').trim().split('\n').slice(1)
const critical = new Map()
const minor = new Set()
for (const line of tsv) {
  const [slug, , , severity, problem] = line.split('\t')
  if (severity === 'kritisk') {
    if (!critical.has(slug)) critical.set(slug, new Set())
    critical.get(slug).add(problem)
  } else minor.add(slug)
}

const stripe = new Stripe(key)
try {
  const acct = await stripe.accounts.retrieve()
  console.log(`Stripe-konto: ${acct.id} (${acct.settings?.dashboard?.display_name || acct.business_profile?.name || 'namn saknas'})`)
} catch {
  console.log('Stripe-konto: kunde inte läsas med nyckeln (kräver läsrätt på kontot). Kontrollera i Dashboard att det är rätt konto.')
}

const site = 'https://fullmakt24.se'
const clean = s => String(s ?? '').replace(/[\t\r\n]+/g, ' ')
const rows = []
let total = 0
const params = { limit: 100, status: 'complete', ...(since ? { created: { gte: since } } : {}) }
try {
for await (const s of stripe.checkout.sessions.list(params)) {
  total++
  if (s.payment_status !== 'paid') continue
  const meta = s.metadata || {}
  const type = meta.packageType || 'single'
  const slug = meta.templateSlug || ''
  const single = type === 'single' || type === 'bilingual'
  const status = !single
    ? 'paket – mallen okänd'
    : !slug
      ? 'mall saknas i metadata'
      : critical.has(slug)
      ? 'kritiskt fel'
      : minor.has(slug)
        ? 'mindre fel'
        : 'inga fel'
  rows.push([
    new Date(s.created * 1000).toISOString().slice(0, 10),
    slug,
    type,
    s.id,
    s.customer_details?.email || '',
    status,
    critical.has(slug) ? [...critical.get(slug)].join('; ') : '',
    single && slug ? `${site}/skapa/${slug}?kvitto=${s.id}` : '',
  ].map(clean))
}
} catch (err) {
  console.error(`Stripe svarade med fel: ${err?.type || ''} ${err?.message || err}`)
  console.error('Kontrollera att nyckeln gäller rätt konto och har läsrätt på Checkout Sessions. Ingen fil skrevs.')
  process.exit(1)
}

const header = ['datum', 'templateSlug', 'pakettyp', 'checkout_session_id', 'epost', 'status', 'kritiska_fel', 'lank_rattad_pdf']
fs.writeFileSync(out, [header, ...rows].map(r => r.join('\t')).join('\n') + '\n', { mode: 0o600 })
fs.chmodSync(out, 0o600)

const count = st => rows.filter(r => r[5] === st).length
console.log(`Genomgångna sessioner (complete): ${total}, betalda: ${rows.length}`)
console.log(`  kritiskt fel: ${count('kritiskt fel')}   mindre fel: ${count('mindre fel')}   inga fel: ${count('inga fel')}   paket: ${count('paket – mallen okänd')}   utan mall: ${count('mall saknas i metadata')}`)
console.log(`Skrev ${out} (innehåller e-postadresser – committa aldrig, radera när utskicket är klart).`)
