import Link from 'next/link'

export default function BloggPage() {
  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Blogg</span>
      </nav>

      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 text-gold-600 text-xs font-bold rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-gold-500" /> Under arbete
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-4">
          Juridisk vägledning – kommer snart
        </h1>
        <p className="text-lg text-navy-400 mb-10">
          Vi arbetar på guider och artiklar om fullmakter och medgivanden. Tills dess hittar du
          tydlig vägledning direkt på varje mallsida.
        </p>
        <Link href="/mallar" className="btn-gold">Utforska mallarna</Link>
      </div>
    </div>
  )
}
