// Pakettyper för köp. Delas mellan checkout-API:t (server) och klientsidor.
// Belopp i öre för Stripe. Inga abonnemang – allt är engångsköp.

export type PackageType = 'single' | 'family' | 'estate'

export interface PackageInfo {
  type: PackageType
  name: string
  /** Antal fullmakter/nedladdningar som ingår */
  credits: number
  /** Stripe-belopp i öre */
  amount: number
  /** Pris i kronor (för visning) */
  price: number
  /** Besparing i kronor jämfört med styckpris (99 kr/st) */
  save: number
  /** Kort beskrivning som visas i Stripe-kvittot */
  description: string
}

export const UNIT_PRICE = 99

export const PACKAGES: Record<PackageType, PackageInfo> = {
  single: {
    type: 'single',
    name: 'Enskild fullmakt',
    credits: 1,
    amount: 9900,
    price: 99,
    save: 0,
    description: '1 fullmakt – PDF utan vattenstämpel, klar att signera',
  },
  family: {
    type: 'family',
    name: 'Familjepaket',
    credits: 3,
    amount: 24900,
    price: 249,
    save: 48,
    description: '3 valfria fullmakter – PDF utan vattenstämpel, klara att signera',
  },
  estate: {
    type: 'estate',
    name: 'Dödsbo- & anhörigpaket',
    credits: 5,
    amount: 39900,
    price: 399,
    save: 96,
    description: '5 valfria fullmakter – PDF utan vattenstämpel, klara att signera',
  },
}

export function getPackage(type: unknown): PackageInfo {
  if (typeof type === 'string' && type in PACKAGES) {
    return PACKAGES[type as PackageType]
  }
  return PACKAGES.single
}

/* ──────────────────────────────────────────────────────────────────────────
   Paketkrediter (localStorage). Detta är en bekvämlighetsfunktion på klienten
   – den verkliga betalningssäkerheten ligger i Stripe. En credit dras av per
   nedladdad mall.
   ────────────────────────────────────────────────────────────────────────── */

const CREDITS_KEY = 'package_credits'
const PROCESSED_KEY = 'package_processed_sessions'

export function getCredits(): number {
  if (typeof window === 'undefined') return 0
  const raw = localStorage.getItem(CREDITS_KEY)
  const n = raw ? parseInt(raw, 10) : 0
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function setCredits(n: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CREDITS_KEY, String(Math.max(0, Math.floor(n))))
}

/** Drar av en credit. Returnerar true om en credit fanns och drogs av. */
export function useCredit(): boolean {
  const current = getCredits()
  if (current <= 0) return false
  setCredits(current - 1)
  return true
}

/**
 * Lägger till paketets credits exakt en gång per Stripe-session, så att en
 * omladdning av betald-sidan inte ger fler nedladdningar än man betalat för.
 * Returnerar true om krediterna lades till (första gången för denna session).
 */
export function grantPackageCredits(sessionId: string | null, credits: number): boolean {
  if (typeof window === 'undefined' || !sessionId) return false
  let processed: string[] = []
  try {
    processed = JSON.parse(localStorage.getItem(PROCESSED_KEY) || '[]')
  } catch {
    processed = []
  }
  if (processed.includes(sessionId)) return false
  processed.push(sessionId)
  localStorage.setItem(PROCESSED_KEY, JSON.stringify(processed))
  setCredits(getCredits() + credits)
  return true
}
