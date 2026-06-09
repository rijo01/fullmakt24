import { Suspense } from 'react'
import Link from 'next/link'
import { categories, templates } from '@/data/templates'
import { MallarBrowser } from './MallarBrowser'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://fullmakt24.se' },
    { '@type': 'ListItem', position: 2, name: 'Alla mallar', item: 'https://fullmakt24.se/mallar' },
  ],
}

export default function MallarPage() {
  return (
    <div className="section-padding py-10 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600 transition-colors">Hem</Link>
        <span>/</span>
        <span className="text-navy-600 font-medium">Alla mallar</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-3">
          Alla fullmaktsmallar
        </h1>
        <p className="text-navy-400 text-lg">
          {templates.length} mallar för fullmakter och medgivanden, utformade enligt svensk avtalsrätt.
        </p>
      </div>

      {/* Interactive browser (search / filter / sort) — client-rendered */}
      <Suspense fallback={<div className="py-20 text-center text-navy-400">Laddar mallar...</div>}>
        <MallarBrowser />
      </Suspense>

      {/* Server-rendered index of all templates grouped by category.
          Ensures every mall-länk finns i initial HTML för sökmotorer,
          oberoende av JavaScript och det interaktiva filtret ovan. */}
      <section aria-labelledby="alla-mallar-index" className="mt-20 pt-12 border-t border-navy-100">
        <h2 id="alla-mallar-index" className="text-2xl font-heading font-bold text-navy-500 mb-2">
          Alla fullmaktsmallar per kategori
        </h2>
        <p className="text-navy-400 text-sm mb-8">
          Bläddra bland samtliga {templates.length} mallar, grupperade efter kategori.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(cat => {
            const catTemplates = templates.filter(t => t.categorySlug === cat.slug)
            if (catTemplates.length === 0) return null
            return (
              <nav key={cat.slug} aria-label={cat.name}>
                <h3 className="font-heading font-bold text-navy-600 text-sm mb-3 flex items-center gap-2">
                  <span aria-hidden="true">{cat.icon}</span>
                  <Link href={`/mallar?category=${cat.slug}`} className="hover:text-gold-600 transition-colors">
                    {cat.name}
                  </Link>
                  <span className="text-xs font-normal text-navy-300">({catTemplates.length})</span>
                </h3>
                <ul className="space-y-1.5">
                  {catTemplates.map(t => (
                    <li key={t.id}>
                      <Link
                        href={`/mallar/${t.categorySlug}/${t.slug}`}
                        className="text-sm text-navy-400 hover:text-gold-600 transition-colors"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )
          })}
        </div>
      </section>
    </div>
  )
}
