/**
 * Sökordet från startsidan till /mallar, utan att det hamnar i adressen.
 *
 * Google Analytics läser sidans adress direkt ur webbläsaren vid sidbyten och
 * för sin egen sökspårning, oavsett vilken adress vi själva skickar. En
 * besökare kan skriva namn eller personnummer i sökrutan, så sökordet får
 * aldrig stå i adressen. Det lämnas i stället över i sessionStorage.
 *
 * Gamla länkar med /mallar?search=… (t.ex. från sökmotorer) fungerar fortfarande:
 * parametern flyttas till sessionStorage och tas bort ur adressen, senast innan
 * Google Analytics laddas (lib/analytics.ts).
 */

const KEY = 'mallar-sok'

/** Sparar sökordet inför navigering till /mallar. */
export function stashSearch(term: string): void {
  try {
    window.sessionStorage.setItem(KEY, term)
  } catch {
    /* Utan sessionStorage visas /mallar utan sökning. */
  }
}

/** Hämtar och tar bort det sparade sökordet. */
export function takeSearch(): string | null {
  try {
    const v = window.sessionStorage.getItem(KEY)
    window.sessionStorage.removeItem(KEY)
    return v
  } catch {
    return null
  }
}

/** Flyttar ?search= från adressen till sessionStorage. */
export function moveSearchParamToStash(): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!url.searchParams.has('search')) return
  const term = url.searchParams.get('search')?.trim()
  if (term) stashSearch(term)
  url.searchParams.delete('search')
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}
