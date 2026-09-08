import type { Metadata } from 'next'
import { templates, categories } from '@/data/templates'
import fs from 'fs'
import path from 'path'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const t = templates.find(tp => tp.slug === slug)

  if (!t) {
    return { title: 'Mall hittades inte | Fullmakt24.se' }
  }

  const cat = categories.find(c => c.slug === t.categorySlug)

  // Try to read SEO content from JSON file
  let seoTitle = ''
  let seoDescription = ''
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', 'mallar', `${slug}.json`)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    seoTitle = data.seo?.title || ''
    seoDescription = data.seo?.metaDescription || ''
  } catch {
    // No SEO content file, use generated title
  }

  const title = seoTitle || `${t.name} – Mall & Guide 2025 | Fullmakt24.se`

  // Tvåspråkiga mallar säljs som svensk original + engelsk översättning. Det är
  // ett eget sökintresse ("fullmakt på engelska"), så det ska med i beskrivningen
  // även när mallen saknar egen SEO-text.
  const fallbackDescription = t.bilingual
    ? `${t.name} – mall enligt svensk avtalsrätt. Finns på svenska + engelska för utlandsbruk. Klar på 3 minuter, ladda ner som PDF.`
    : `${t.name}: ${t.description} Mall utformad enligt svensk avtalsrätt för ${cat?.name?.toLowerCase() || 'svenska förhållanden'}. Skapa och ladda ner som PDF.`
  const description = seoDescription || fallbackDescription

  // Canonical URL – the single authoritative URL for each mall (template's true
  // category), so duplicate/cross-category paths point back here and Google
  // indexes only one version.
  const canonical = `https://fullmakt24.se/mallar/${t.categorySlug}/${t.slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  }
}

export default function MallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
