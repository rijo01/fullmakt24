import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/data/blog'

export const metadata: Metadata = {
  title: 'Guider & juridisk vägledning – Blogg | Fullmakt24.se',
  description: 'Tydliga guider om fullmakter och medgivanden – resa med barn inom EU, hämta ut fordon åt någon annan och foto och film på barn i förening. Utformat enligt svensk rätt.',
  alternates: { canonical: 'https://fullmakt24.se/blogg' },
}

export default function BloggPage() {
  const posts = [...blogPosts].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))

  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Blogg</span>
      </nav>

      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-4">
          Guider &amp; juridisk vägledning
        </h1>
        <p className="text-lg text-navy-400 leading-relaxed">
          Praktiska guider om fullmakter och medgivanden – skrivna för vanliga situationer i vardagen
          och utformade enligt svensk rätt. Varje guide länkar till en färdig mall du kan fylla i på minuter.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blogg/${post.slug}`}
            className="card p-6 flex flex-col hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{post.emoji}</span>
              <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-1 rounded-full">{post.category}</span>
            </div>
            <h2 className="font-heading font-bold text-navy-500 text-lg mb-2 group-hover:text-gold-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-navy-400 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
            <span className="text-sm font-medium text-navy-500 inline-flex items-center gap-1">
              Läs guiden
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
