import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Priser – Fullmakt från 99 kr, paket från 249 kr | Fullmakt24.se',
  description: 'Enskild fullmakt 99 kr, Familjepaket 3 st för 249 kr och Dödsbo- & anhörigpaket 5 st för 399 kr. Betala med kort eller Klarna. Ingen prenumeration – engångsköp.',
}

export default function PriserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
