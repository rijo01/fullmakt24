import type { Metadata } from 'next'
import { templates } from '@/data/templates'

export const metadata: Metadata = {
  title: `Alla fullmaktsmallar – ${templates.length} mallar enligt svensk avtalsrätt | Fullmakt24.se`,
  description: `Bläddra bland ${templates.length} fullmaktsmallar och medgivanden. Kategorier: Föräldrar & Barn, Bank & Myndigheter, Vård, Resa, Boende med mera. Skapa och ladda ner som PDF för 49 kr.`,
}

export default function MallarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
