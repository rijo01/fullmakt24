import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alla fullmaktsmallar – 124 juridiskt granskade mallar | Fullmakt24.se',
  description: 'Bläddra bland 124 fullmaktsmallar och medgivanden. Kategorier: Föräldrar & Barn, Bank & Myndigheter, Vård, Resa, Boende med mera. Skapa och ladda ner som PDF.',
}

export default function MallarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
