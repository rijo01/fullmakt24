import { notFound, permanentRedirect } from 'next/navigation'
import { templates } from '@/data/templates'
import { loadTemplateContent } from '@/lib/template-seo'
import TemplateDetail from './TemplateDetail'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export default async function TemplateDetailPage({ params }: Props) {
  const { category, slug } = await params
  const t = templates.find(tp => tp.slug === slug)
  // Okänd mall: riktig 404, inte en tom sida med status 200.
  if (!t) notFound()
  // Mallen under fel kategori i adressen: 308 till mallens riktiga kategori.
  if (category !== t.categorySlug) permanentRedirect(`/mallar/${t.categorySlug}/${t.slug}`)
  // Mallens JSON (SEO-texter och FAQ) läses på servern. Den synliga FAQ:n och
  // FAQPage-schemat byggs sedan från samma lista i TemplateDetail.
  const seoContent = await loadTemplateContent(slug)
  return <TemplateDetail slug={slug} seoContent={seoContent} />
}
