'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { getConsent, getServerConsent, setConsent, subscribeConsent, trackPageView } from '@/lib/analytics'

function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsent, getServerConsent)
}

/**
 * Rutan om statistik och sidvisningarna till GA. Utan godkännande laddas
 * ingenting från Google (lib/analytics.ts). Rutan ligger fast längst ner men
 * får ett lika högt tomrum efter sidfoten, så att den aldrig döljer något
 * permanent, t.ex. betalknappen.
 */
export function Samtycke() {
  const pathname = usePathname()
  const consent = useConsent()
  // Servern vet inte valet. Rutan visas först i webbläsaren, så att den inte
  // blinkar till för den som redan svarat.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // En sidvisning per sida, och direkt när besökaren godkänner.
  useEffect(() => {
    if (consent === 'godkant') trackPageView()
  }, [pathname, consent])

  if (!mounted || consent !== null) return null

  return (
    <>
      <div aria-hidden="true" className="h-56 sm:h-28" />
      <aside
        role="region"
        aria-label="Samtycke till statistik"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-100 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="section-padding flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-6">
          <p className="flex-1 text-sm leading-relaxed text-navy-600">
            Vi vill se hur sajten används med Google Analytics. Det sätter cookies och skickar
            uppgifter om ditt besök till Google, men aldrig något du fyller i eller söker efter.
            Väljer du Avvisa mäts ingenting, och sajten fungerar likadant.{' '}
            <Link href="/cookies#statistik" className="font-semibold underline">Läs mer</Link>
          </p>
          {/* Knapparna är identiska i form och färg; bara etiketten skiljer. */}
          <div className="flex shrink-0 gap-3">
            <button type="button" className="btn-secondary flex-1 sm:w-32 sm:flex-none" onClick={() => setConsent('avvisat')}>
              Avvisa
            </button>
            <button type="button" className="btn-secondary flex-1 sm:w-32 sm:flex-none" onClick={() => setConsent('godkant')}>
              Godkänn
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

/** Valet på /cookies: kan ändras eller tas tillbaka när som helst. */
export function SamtyckeVal() {
  const consent = useConsent()
  const state =
    consent === 'godkant'
      ? 'Du har godkänt statistik. Google Analytics laddas på sidorna du besöker.'
      : consent === 'avvisat'
        ? 'Du har avvisat statistik. Ingenting laddas från Google och ingenting skickas dit.'
        : 'Du har inte svarat än. Tills du gör det mäts ingenting.'
  return (
    <div className="mt-4 rounded-xl border border-navy-100 bg-navy-50 p-4">
      <p className="mb-3 text-sm text-navy-600" role="status">{state}</p>
      <div className="flex flex-wrap gap-3">
        {consent !== 'avvisat' && (
          <button type="button" className="btn-secondary" onClick={() => setConsent('avvisat')}>
            Avvisa statistik
          </button>
        )}
        {consent !== 'godkant' && (
          <button type="button" className="btn-secondary" onClick={() => setConsent('godkant')}>
            Godkänn statistik
          </button>
        )}
      </div>
    </div>
  )
}
