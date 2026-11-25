/**
 * Google Analytics 4, bara efter samtycke.
 *
 * Tre lägen: "godkant" (gtag laddas), "avvisat" (gtag laddas aldrig) och null
 * (inte svarat: gtag laddas aldrig och rutan visas). Tystnad är inte ja.
 *
 * Valet sparas i localStorage och inte i en cookie: servern behöver det aldrig,
 * eftersom mätningen bara sker i webbläsaren. Serverns HTML innehåller därför
 * aldrig gtag, och servern utgår alltid från "inte svarat".
 *
 * Adressen som skickas till Google rensas från allt utom ett fåtal kända
 * parametrar (cleanLocation). Sökord (?search=), Stripe-sessioner (session_id,
 * kvitto) och annat som kan avslöja vad besökaren skrivit följer aldrig med.
 */

import { moveSearchParamToStash } from '@/lib/search-handoff'

export const GA_ID = 'G-K5Y04XM2VE'

export type ConsentValue = 'godkant' | 'avvisat' | null

/** Byts nyckeln räknas alla tidigare svar som obesvarade. */
const KEY = 'fm24-samtycke'

/** Parametrar som får följa med adressen till Google. Allt annat tas bort. */
const ALLOWED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'category']

/** Sidans adress utan otillåtna parametrar och utan #-del. */
export function cleanLocation(href: string): string {
  const url = new URL(href)
  const kept = new URLSearchParams()
  for (const name of ALLOWED_PARAMS) {
    for (const v of url.searchParams.getAll(name)) kept.append(name, v)
  }
  const qs = kept.toString()
  return `${url.origin}${url.pathname}${qs ? `?${qs}` : ''}`
}

/* ── Samtyckets lagring (useSyncExternalStore) ─────────────────────────── */

function readStored(): ConsentValue {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'godkant' || v === 'avvisat' ? v : null
  } catch {
    // T.ex. Safari i privat läge: inget svar, alltså ingen mätning.
    return null
  }
}

// useSyncExternalStore kräver en stabil ögonblicksbild: värdet cachas tills något skriver.
let cache: ConsentValue = null
let loaded = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(cb => cb())

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return null
  if (!loaded) {
    cache = readStored()
    loaded = true
  }
  return cache
}

/** Servern vet aldrig valet och gissar inte. */
export function getServerConsent(): ConsentValue {
  return null
}

export function subscribeConsent(cb: () => void): () => void {
  listeners.add(cb)
  // `storage` fyras bara i ANDRA flikar; den som skriver meddelar själv i setConsent.
  const fromOtherTab = (e: StorageEvent) => {
    if (e.key !== KEY) return
    loaded = false
    if (getConsent() !== 'godkant') stopAnalytics()
    notify()
  }
  window.addEventListener('storage', fromOtherTab)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', fromOtherTab)
  }
}

/** null nollställer (rutan visas igen). Går lagringen inte att skriva gäller valet resten av besöket. */
export function setConsent(v: ConsentValue): void {
  try {
    if (v === null) window.localStorage.removeItem(KEY)
    else window.localStorage.setItem(KEY, v)
  } catch {
    // Avsiktligt tyst: cachen bär valet.
  }
  cache = v
  loaded = true
  if (v !== 'godkant') stopAnalytics()
  notify()
}

/* ── gtag ──────────────────────────────────────────────────────────────── */

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

let started = false

/**
 * Startar gtag en gång per sidladdning, och bara med samtycke. Kön (dataLayer)
 * får alltid 'js' och 'config' före första händelsen, så en händelse som
 * skickas innan skriptet hunnit laddas (t.ex. purchase på /betald) går inte
 * förlorad.
 */
function startAnalytics(): boolean {
  if (typeof window === 'undefined' || getConsent() !== 'godkant') return false
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false
  if (started) return true
  started = true
  // GA:s sökspårning läser adressen själv: sökord får inte stå där när skriptet laddas.
  moveSearchParamToStash()
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js läser kön som arguments-objekt, inte som vanliga arrayer.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  // Sidvisningar skickas av oss (trackPageView) med rensad adress.
  window.gtag('config', GA_ID, { send_page_view: false, page_location: cleanLocation(window.location.href) })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
  return true
}

/** Samtycket togs tillbaka: inga fler anrop, och GA:s cookies tas bort. */
function stopAnalytics(): void {
  if (typeof window === 'undefined') return
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (name !== '_ga' && !name.startsWith('_ga_')) continue
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
    }
  }
}

/** Händelse till GA, bara med samtycke. Adressen rensas som för sidvisningar. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!startAnalytics()) return
  const page_location = cleanLocation(window.location.href)
  // Sätts också för GA:s egna automatiska händelser (scroll, engagemang m.m.).
  window.gtag!('set', { page_location })
  window.gtag!('event', name, { ...params, page_location })
}

/** Sidvisning med rensad adress. */
export function trackPageView(): void {
  trackEvent('page_view', { page_title: document.title })
}
