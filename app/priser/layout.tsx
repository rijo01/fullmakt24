import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Priser – Fullmakt från 49 kr | Fullmakt24.se',
  description: 'Skapa fullmakter och medgivanden från 49 kr. Betala med kort, Apple Pay eller Klarna. Ingen prenumeration – betala per dokument.',
}

export default function PriserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
