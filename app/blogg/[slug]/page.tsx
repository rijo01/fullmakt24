import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getBlogPost } from '@/data/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Guiden hittades inte | Fullmakt24.se' }

  const canonical = `https://fullmakt24.se/blogg/${post.slug}`
  return {
    title: `${post.metaTitle} | Fullmakt24.se`,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: canonical,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateUpdated,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const url = `https://fullmakt24.se/blogg/${post.slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://fullmakt24.se' },
      { '@type': 'ListItem', position: 2, name: 'Blogg', item: 'https://fullmakt24.se/blogg' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.datePublished,
    dateModified: post.dateUpdated,
    author: { '@type': 'Organization', name: 'Fullmakt24.se' },
    publisher: { '@type': 'Organization', name: 'Fullmakt24.se', url: 'https://fullmakt24.se' },
    mainEntityOfPage: url,
  }

  const faqSchema = post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div className="section-padding py-10 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <Link href="/blogg" className="hover:text-navy-600">Blogg</Link><span>/</span>
        <span className="text-navy-600 font-medium truncate">{post.title}</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{post.emoji}</span>
          <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-1 rounded-full">{post.category}</span>
          <span className="text-sm text-navy-400">{post.readingMinutes} min läsning</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-5">{post.title}</h1>

        <p className="text-lg text-navy-500 leading-relaxed mb-8">{post.intro}</p>

        {post.sections.map((section, i) => (
          <section key={i} className="mb-8">
            {section.heading && (
              <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">{section.heading}</h2>
            )}
            {section.paragraphs?.map((p, j) => (
              <p key={j} className="text-navy-500 leading-relaxed mb-3">{p}</p>
            ))}
            {section.list && (
              <ul className="space-y-2 mt-2">
                {section.list.map((item, j) => (
                  <li key={j} className="flex gap-3 text-navy-500 leading-relaxed">
                    <span className="text-gold-500 shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA to template */}
        <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 my-10">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-2">{post.cta.heading}</h2>
          <p className="text-navy-400 leading-relaxed mb-5">{post.cta.text}</p>
          <Link href={post.cta.href} className="btn-gold inline-flex items-center gap-2">
            {post.cta.label}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>

        {/* FAQ */}
        {post.faq.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Vanliga frågor</h2>
            <div className="space-y-3">
              {post.faq.map((f, i) => (
                <div key={i} className="card p-5">
                  <h3 className="font-semibold text-navy-600 text-sm mb-2">{f.q}</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-navy-100 pt-6 mt-10 text-sm text-navy-400">
          <p>
            Den här guiden är allmän information utformad enligt svensk rätt och utgör inte individuell juridisk
            rådgivning. Vid komplexa eller ovanliga ärenden rekommenderar vi att du kontaktar en jurist.
          </p>
          <p className="mt-3">
            <Link href="/blogg" className="text-gold-600 hover:text-gold-700 font-medium">← Tillbaka till alla guider</Link>
          </p>
        </div>
      </article>
    </div>
  )
}
