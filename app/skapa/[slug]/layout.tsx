import type { Metadata } from 'next'
import { templates, categories } from '@/data/templates'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const t = templates.find(tp => tp.slug === slug)

  if (!t) {
    return { title: 'Mall hittades inte | Fullmakt24.se' }
  }

  const cat = categories.find(c => c.slug === t.categorySlug)

  return {
    title: `Skapa ${t.name} – Mall & PDF | Fullmakt24.se`,
    description: `Skapa ${t.name.toLowerCase()} online. Fyll i formuläret, granska och ladda ner som PDF. ${cat?.name || ''} – klar på 3 minuter.`,
    openGraph: {
      title: `Skapa ${t.name} | Fullmakt24.se`,
      description: `Skapa ${t.name.toLowerCase()} online. Mall enligt svensk lag – klar på 3 minuter.`,
    },
  }
}

export default function SkapaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
