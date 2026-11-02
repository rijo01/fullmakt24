'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { categories, templates, searchTemplates } from '@/data/templates'
import { trackEvent } from '@/components/GoogleAnalytics'

export function MallarBrowser() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'az' | 'new'>('az')

  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    if (urlSearch) setSearch(urlSearch)
    if (urlCategory) setSelectedCategory(urlCategory)
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = search.length > 1 ? searchTemplates(search) : templates
    if (selectedCategory) result = result.filter(t => t.categorySlug === selectedCategory)
    switch (sortBy) {
      case 'az': return [...result].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
      case 'new': return [...result].sort((a, b) => b.id - a.id)
      default: return result
    }
  }, [search, selectedCategory, sortBy])

  useEffect(() => {
    if (search.length < 2) return
    const handle = setTimeout(() => {
      trackEvent('search', { search_term: search })
    }, 500)
    return () => clearTimeout(handle)
  }, [search])

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          {/* Search */}
          <div>
            <label className="text-sm font-semibold text-navy-600 mb-2 block">Sök mall</label>
            <input
              type="text"
              placeholder="T.ex. bankfullmakt..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field text-sm"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="text-sm font-semibold text-navy-600 mb-3 block">Kategorier</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-navy-50 text-navy-600 font-semibold' : 'text-navy-400 hover:bg-navy-50'}`}
              >
                Alla kategorier ({templates.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${cat.slug === selectedCategory ? 'bg-navy-50 text-navy-600 font-semibold' : 'text-navy-400 hover:bg-navy-50'}`}
                >
                  <span>{cat.icon}</span>
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-xs text-navy-300">{cat.templateCount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div>
        {/* Mobile search + filters */}
        <div className="lg:hidden mb-6 space-y-3">
          <input
            type="text"
            placeholder="Sök bland mallar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
          />
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!selectedCategory ? 'bg-navy-500 text-white' : 'bg-navy-50 text-navy-400'}`}
            >
              Alla
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${cat.slug === selectedCategory ? 'bg-navy-500 text-white' : 'bg-navy-50 text-navy-400'}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-navy-400">
            Visar <span className="font-semibold text-navy-600">{filtered.length}</span> mallar
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-navy-400 hidden sm:inline">Sortera:</span>
            {[
              { key: 'az' as const, label: 'A–Ö' },
              { key: 'new' as const, label: 'Nyast' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${sortBy === s.key ? 'bg-navy-500 text-white' : 'bg-navy-50 text-navy-400 hover:bg-navy-100'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <Link
              key={t.id}
              href={`/mallar/${t.categorySlug}/${t.slug}`}
              onClick={() => trackEvent('select_content', { content_type: 'template', item_id: t.slug, item_name: t.name, item_category: t.category })}
              className="card-interactive p-5 group flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{categories.find(c => c.slug === t.categorySlug)?.icon}</span>
              </div>
              <h3 className="font-heading font-bold text-navy-600 text-sm mb-2 group-hover:text-gold-600 transition-colors line-clamp-2 flex-1">
                {t.name}
              </h3>
              <p className="text-xs text-navy-400 line-clamp-2 mb-4">{t.description}</p>
              <div className="flex items-center justify-end mt-auto pt-3 border-t border-navy-50">
                <span className="text-xs font-semibold text-gold-500 group-hover:text-gold-600">
                  Skapa nu →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-heading font-bold text-navy-500 text-lg mb-2">Inga mallar hittades</h3>
            <p className="text-navy-400 text-sm">Försök med andra sökord eller ändra filtren.</p>
          </div>
        )}
      </div>
    </div>
  )
}
