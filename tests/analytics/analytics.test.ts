// Adressen som skickas till Google Analytics (lib/analytics.ts) får aldrig
// innehålla sökord, Stripe-sessioner eller annat utöver de tillåtna parametrarna.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanLocation } from '../../lib/analytics'

test('sökord och personnummer tas bort', () => {
  assert.equal(cleanLocation('https://fullmakt24.se/mallar?search=anna%2019800101-1234'), 'https://fullmakt24.se/mallar')
})

test('Stripe-sessioner, kvitton och mallnamn i /betald tas bort', () => {
  assert.equal(
    cleanLocation('https://fullmakt24.se/betald?session_id=cs_live_abc123&slug=generell-fullmakt&omleverans=1'),
    'https://fullmakt24.se/betald')
  assert.equal(cleanLocation('https://fullmakt24.se/skapa/generell-fullmakt?kvitto=cs_live_abc123'), 'https://fullmakt24.se/skapa/generell-fullmakt')
})

test('kampanjparametrar och kategori behålls, i fast ordning', () => {
  assert.equal(
    cleanLocation('https://fullmakt24.se/mallar?search=x&category=resor&utm_source=nyhetsbrev&gclid=abc'),
    'https://fullmakt24.se/mallar?utm_source=nyhetsbrev&gclid=abc&category=resor')
})

test('#-delen tas bort', () => {
  assert.equal(cleanLocation('https://fullmakt24.se/cookies#statistik'), 'https://fullmakt24.se/cookies')
})
