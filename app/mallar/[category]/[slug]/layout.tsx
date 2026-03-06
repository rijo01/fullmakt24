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
  const description = seoDescription || `${t.name}: ${t.description} Juridiskt granskad mall för ${cat?.name?.toLowerCase() || 'svenska förhållanden'}. Skapa och ladda ner som PDF.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default function MallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
