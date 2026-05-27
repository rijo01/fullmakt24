import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alla fullmaktsmallar – 136 juridiskt granskade mallar | Fullmakt24.se',
  description: 'Bläddra bland 136 fullmaktsmallar och medgivanden. Kategorier: Föräldrar & Barn, Bank & Myndigheter, Vård, Resa, Boende med mera. Skapa och ladda ner som PDF för 49 kr.',
}

export default function MallarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
