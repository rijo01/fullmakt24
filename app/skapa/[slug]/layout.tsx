import type { Metadata } from 'next'
import { templates, categories } from '@/data/templates'

const NOINDEX: Metadata['robots'] = { index: false, follow: true }

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const t = templates.find(tp => tp.slug === slug)

  if (!t) {
    return { title: 'Mall hittades inte', robots: NOINDEX, alternates: { canonical: null } }
  }

  const cat = categories.find(c => c.slug === t.categorySlug)

  // "enligt svensk avtalsrätt" eller mallens egen rättsliga grund (t.ex. lag 2017:310).
  const legalBasis = t.legalBasisLabel
    ? t.legalBasisLabel.charAt(0).toLowerCase() + t.legalBasisLabel.slice(1)
    : 'enligt svensk avtalsrätt'

  return {
    // Rotlayoutens titelmall lägger till " | Fullmakt24.se".
    title: `Skapa ${t.name} – Mall & PDF`,
    // /skapa är formuläret, inte en sökingång – mallsidan är den som ska ranka.
    // Rotlayoutens canonical (startsidan) ärvs annars och tas därför bort.
    robots: NOINDEX,
    alternates: { canonical: null },
    description: `Skapa ${t.name.toLowerCase()} online. Fyll i formuläret, granska och ladda ner som PDF. ${cat?.name || ''} – klar på 3 minuter.`,
    openGraph: {
      title: `Skapa ${t.name} | Fullmakt24.se`,
      description: `Skapa ${t.name.toLowerCase()} online. Mall utformad ${legalBasis} – klar på 3 minuter.`,
    },
  }
}

export default function SkapaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
