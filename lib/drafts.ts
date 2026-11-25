/**
 * Utkasten (det kunden fyller i, inklusive personnummer) i webbläsarens
 * localStorage, under nyckeln draft_<slug>.
 *
 * Varje utkast sparas med en tidsstämpel: { v: 1, savedAt, data }. Utkast som
 * inte har ändrats på DRAFT_MAX_AGE_DAYS dagar tas bort nästa gång sajten
 * öppnas i webbläsaren (purgeOldDrafts, körs från layouten). Utkast i det
 * gamla formatet, utan tidsstämpel, får dagens datum i stället för att tas
 * bort, så att ingen som är mitt i ett köp när ändringen driftsätts förlorar
 * sina uppgifter.
 *
 * Tidsstämpeln förnyas när innehållet ändras och alltid när kunden går vidare
 * till betalning, kredit eller kvitto (touch). Att bara öppna formuläret
 * förnyar den inte.
 *
 * Inget annat än nycklar som börjar på draft_ rörs här.
 */

export const DRAFT_MAX_AGE_DAYS = 30
const MAX_AGE_MS = DRAFT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
const PREFIX = 'draft_'

export type DraftData = Record<string, string>
type Stored = { v: 1; savedAt: number; data: DraftData }

/** Den lagring som används; utbytbar i tester. */
export interface DraftStorage {
  readonly length: number
  key(index: number): string | null
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function storage(): DraftStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function isData(v: unknown): v is DraftData {
  return !!v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).every(x => typeof x === 'string')
}

/** Tolkar ett lagrat värde. Gammalt format ger savedAt: null. Ogiltigt ger undefined. */
function parse(raw: string): { savedAt: number | null; data: DraftData } | undefined {
  let v: unknown
  try {
    v = JSON.parse(raw)
  } catch {
    return undefined
  }
  if (v && typeof v === 'object' && (v as Stored).v === 1) {
    const s = v as Stored
    return typeof s.savedAt === 'number' && Number.isFinite(s.savedAt) && isData(s.data)
      ? { savedAt: s.savedAt, data: s.data }
      : undefined
  }
  return isData(v) ? { savedAt: null, data: v } : undefined
}

function write(st: DraftStorage, slug: string, data: DraftData, savedAt: number): void {
  try {
    st.setItem(PREFIX + slug, JSON.stringify({ v: 1, savedAt, data } satisfies Stored))
  } catch {
    /* Full eller blockerad lagring: utkastet sparas inte. */
  }
}

/** Alla draft_-nycklar. Listan tas fram innan något tas bort. */
function draftKeys(st: DraftStorage): string[] {
  const keys: string[] = []
  for (let i = 0; i < st.length; i++) {
    const k = st.key(i)
    if (k && k.startsWith(PREFIX)) keys.push(k)
  }
  return keys
}

/** Utkastet för mallen, eller null om det saknas eller är ogiltigt. */
export function readDraft(slug: string, st: DraftStorage | null = storage()): DraftData | null {
  if (!st) return null
  const raw = st.getItem(PREFIX + slug)
  if (raw === null) return null
  return parse(raw)?.data ?? null
}

/**
 * Sparar utkastet. Tidsstämpeln förnyas om innehållet har ändrats, eller
 * alltid med touch (inför betalning, kredit och kvitto).
 */
export function writeDraft(
  slug: string,
  data: DraftData,
  opts: { touch?: boolean; now?: number } = {},
  st: DraftStorage | null = storage(),
): void {
  if (!st) return
  const now = opts.now ?? Date.now()
  const raw = st.getItem(PREFIX + slug)
  const prev = raw === null ? undefined : parse(raw)
  if (!opts.touch && prev && prev.savedAt !== null && JSON.stringify(prev.data) === JSON.stringify(data)) return
  write(st, slug, data, now)
}

/** Finns något utkast alls i den här webbläsaren? */
export function hasDrafts(st: DraftStorage | null = storage()): boolean {
  return !!st && draftKeys(st).length > 0
}

/** Tar bort alla utkast. Paketkrediter och annat lämnas orört. */
export function clearDrafts(st: DraftStorage | null = storage()): void {
  if (!st) return
  for (const k of draftKeys(st)) st.removeItem(k)
}

/**
 * Tar bort utkast som inte har ändrats på DRAFT_MAX_AGE_DAYS dagar, och
 * ogiltiga utkast. Utkast utan tidsstämpel (gammalt format) får tidsstämpeln
 * now. En tidsstämpel i framtiden (fel klocka) räknas som now.
 */
export function purgeOldDrafts(now: number = Date.now(), st: DraftStorage | null = storage()): void {
  if (!st) return
  for (const k of draftKeys(st)) {
    const raw = st.getItem(k)
    const parsed = raw === null ? undefined : parse(raw)
    if (!parsed) {
      st.removeItem(k)
      continue
    }
    const slug = k.slice(PREFIX.length)
    if (parsed.savedAt === null) {
      write(st, slug, parsed.data, now)
    } else if (parsed.savedAt > now) {
      write(st, slug, parsed.data, now)
    } else if (now - parsed.savedAt > MAX_AGE_MS) {
      st.removeItem(k)
    }
  }
}
