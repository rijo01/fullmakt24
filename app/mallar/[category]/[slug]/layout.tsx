import type { Metadata } from 'next'
import { templates } from '@/data/templates'
import { loadTemplateSeo } from '@/lib/template-seo'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const t = templates.find(tp => tp.slug === slug)

  if (!t) {
    return { title: 'Mall hittades inte', robots: null }
  }

  const seo = await loadTemplateSeo(slug)

  // JSON-titeln används precis som den är skriven (absolute = ingen extra
  // titelmall från rotlayouten). Reservtexten används bara när mallen saknar
  // JSON eller SEO-titel, och innehåller varken årtal eller påståenden om
  // rättslig grund.
  const title = seo?.title?.trim() || `${t.name} – mall att fylla i | Fullmakt24.se`

  // Tvåspråkiga mallar säljs som svensk original + engelsk översättning. Det är
  // ett eget sökintresse ("fullmakt på engelska"), så det ska med i beskrivningen
  // även när mallen saknar egen SEO-text.
  const fallbackDescription = t.bilingual
    ? `${t.name} – svensk mall med engelsk översättning för utlandsbruk. Fyll i uppgifterna och ladda ner som PDF.`
    : `${t.name}: ${t.description} Fyll i uppgifterna och ladda ner som PDF.`
  const description = seo?.metaDescription?.trim() || fallbackDescription

  // Canonical URL – the single authoritative URL for each mall (template's true
  // category), so duplicate/cross-category paths point back here and Google
  // indexes only one version.
  const canonical = `https://fullmakt24.se/mallar/${t.categorySlug}/${t.slug}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
    },
    // openGraph och twitter ersätter rotlayoutens objekt helt, så de fält som
    // ska ärvas (bild, sajtnamn, korttyp) måste anges här också.
    openGraph: {
      type: 'website',
      locale: 'sv_SE',
      siteName: 'Fullmakt24.se',
      title,
      description,
      url: canonical,
      images: [{ url: 'https://fullmakt24.se/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function MallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
