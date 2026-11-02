#!/usr/bin/env node
// Räknar hur många Stripe-objekt som innehåller formulärdata i metadata.
// Skriptet LÄSER bara (list-anrop) och skriver ut antal, aldrig värden.
//
// Kör med en nyckel som bara har läsrättigheter (restricted key med "Read" på
// Checkout Sessions, PaymentIntents och Events):
//
//   STRIPE_KEY=rk_live_... node scripts/stripe-raekna-personuppgifter.mjs
//
// Valfritt: SINCE=2026-03-01 (standard) begränsar till objekt skapade efter datumet.

import Stripe from 'stripe'

const key = process.env.STRIPE_KEY
if (!key) {
  console.error('Sätt STRIPE_KEY (helst en restricted key med enbart läsrättigheter).')
  process.exit(1)
}
const stripe = new Stripe(key)
const since = Math.floor(new Date(process.env.SINCE || '2026-03-01T00:00:00Z').getTime() / 1000)

// Svenskt personnummer/samordningsnummer. "Säkra" träffar har skiljetecken
// (ÅÅMMDD-NNNN) eller sekelsiffror (ÅÅÅÅMMDDNNNN). Tio siffror i följd räknas
// separat, eftersom även mobilnummer (07XXXXXXXX) kan se ut så.
const DATE = '\\d{2}(?:0[1-9]|1[0-2])(?:[0-2]\\d|3[01]|[6-8]\\d|9[01])'
const PNR_SURE = new RegExp(`(?<!\\d)(?:(?:19|20)${DATE}[-+ ]?\\d{4}|${DATE}[-+]\\d{4})(?!\\d)`, 'g')
const PNR_TEN = new RegExp(`(?<![\\d-])${DATE}\\d{4}(?![\\d-])`, 'g')

function scan(metadata) {
  const values = Object.entries(metadata || {})
  const hasFormData = values.some(([k, v]) => k === 'formData' && v)
  let sure = 0, ten = 0
  for (const [, v] of values) {
    sure += (String(v).match(PNR_SURE) || []).length
    ten += (String(v).match(PNR_TEN) || []).length
  }
  return { hasFormData, sure, ten }
}

async function count(label, iterable, getMeta) {
  let total = 0, withFormData = 0, withSure = 0, sureHits = 0, withTen = 0
  const months = {}
  for await (const obj of iterable) {
    total++
    const { hasFormData, sure, ten } = scan(getMeta(obj))
    if (hasFormData) withFormData++
    if (ten) withTen++
    if (sure) {
      withSure++
      sureHits += sure
      const m = new Date(obj.created * 1000).toISOString().slice(0, 7)
      months[m] = (months[m] || 0) + 1
    }
  }
  console.log(`\n${label}`)
  console.log(`  genomgångna:                     ${total}`)
  console.log(`  med metadata.formData:           ${withFormData}`)
  console.log(`  med personnummer (säkra träffar): ${withSure} (träffar totalt: ${sureHits}), per månad:`)
  for (const [m, n] of Object.entries(months).sort()) console.log(`    ${m}: ${n}`)
  console.log(`  med 10 siffror utan bindestreck (personnummer eller telefonnummer): ${withTen}`)
}

const created = { gte: since }

await count('Checkout Sessions',
  stripe.checkout.sessions.list({ created, limit: 100 }), s => s.metadata)

// Sessionens metadata kopieras inte automatiskt till PaymentIntent (koden satte
// aldrig payment_intent_data.metadata). Kontrolleras ändå.
await count('PaymentIntents',
  stripe.paymentIntents.list({ created, limit: 100 }), p => p.metadata)

// Events innehåller en kopia av objektet, inklusive metadata. Stripe returnerar
// bara events från de senaste 30 dagarna via API:t.
await count('Events (checkout.session.*, senaste 30 dagarna)',
  stripe.events.list({ types: ['checkout.session.completed', 'checkout.session.expired',
    'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed'], limit: 100 }),
  e => e.data?.object?.metadata)
