import { loadTemplateContent } from '@/lib/template-seo'
import TemplateDetail from './TemplateDetail'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params
  // Mallens JSON (SEO-texter och FAQ) läses på servern. Den synliga FAQ:n och
  // FAQPage-schemat byggs sedan från samma lista i TemplateDetail.
  const seoContent = await loadTemplateContent(slug)
  return <TemplateDetail slug={slug} seoContent={seoContent} />
}
