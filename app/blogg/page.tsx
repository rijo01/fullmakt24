import Link from 'next/link'

const blogPosts = [
  { slug: 'vad-ar-en-fullmakt', title: 'Vad är en fullmakt? – Komplett guide 2025', excerpt: 'Allt du behöver veta om fullmakter i Sverige. Vi förklarar olika typer, juridisk giltighet och vanliga misstag.', date: '2025-06-10', category: 'Guide', readTime: '8 min' },
  { slug: 'resefullmakt-barn', title: 'Resefullmakt för barn – så gör du rätt', excerpt: 'Planerar du att resa utomlands med barn? Här är allt du behöver veta om resefullmakter och medgivanden.', date: '2025-06-08', category: 'Föräldrar', readTime: '6 min' },
  { slug: 'bankfullmakt-guide', title: 'Bankfullmakt – steg för steg', excerpt: 'Behöver någon annan hantera dina bankärenden? Vi går igenom allt om bankfullmakter.', date: '2025-06-05', category: 'Ekonomi', readTime: '5 min' },
  { slug: 'framtidsfullmakt', title: 'Framtidsfullmakt – planera för framtiden', excerpt: 'En framtidsfullmakt ger trygghet om du blir sjuk eller oförmögen att fatta beslut. Så skriver du en.', date: '2025-06-01', category: 'Juridik', readTime: '10 min' },
  { slug: 'fullmakt-dodsbo', title: 'Fullmakt vid dödsbo – vad gäller?', excerpt: 'När en närstående går bort behövs ofta fullmakter för att hantera den avlidnes ärenden.', date: '2025-05-28', category: 'Dödsbo', readTime: '7 min' },
  { slug: 'digital-signering-bankid', title: 'Digital signering med BankID – så fungerar det', excerpt: 'BankID-signering ger dina dokument extra juridisk tyngd. Vi förklarar hur det fungerar.', date: '2025-05-25', category: 'Digital', readTime: '4 min' },
]

export default function BloggPage() {
  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Blogg</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-3">Juridisk vägledning</h1>
        <p className="text-lg text-navy-400">Guider, tips och juridisk kunskap om fullmakter och medgivanden.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <article key={post.slug} className="card-interactive overflow-hidden group">
            <div className="h-40 bg-gradient-to-br from-navy-100 to-navy-50 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-navy-200">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{post.category}</span>
                <span className="text-xs text-navy-300">{post.readTime}</span>
              </div>
              <h2 className="font-heading font-bold text-navy-600 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-sm text-navy-400 line-clamp-3 mb-3">{post.excerpt}</p>
              <div className="text-xs text-navy-300">{new Date(post.date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
