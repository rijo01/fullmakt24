'use client'

import Link from 'next/link'

export default function ApiDocsPage() {
  const planned = [
    'Skapa fullmakter programmatiskt från dina egna system',
    'Hämta mallar och fältscheman',
    'Generera färdiga PDF:er automatiskt',
  ]

  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">API för företag</span>
      </nav>

      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 text-gold-600 text-xs font-bold rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-gold-500" /> Under utveckling
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-4">
          API för företag – kommer snart
        </h1>
        <p className="text-lg text-navy-400 mb-10">
          Vi bygger ett API som låter företag skapa fullmakter direkt från sina egna system.
          Det är inte släppt än – men du kan anmäla intresse så hör vi av oss när det är klart.
        </p>

        <div className="card p-6 lg:p-8 text-left mb-10">
          <h2 className="font-heading font-bold text-navy-500 text-lg mb-4">Det här planerar vi</h2>
          <ul className="space-y-3">
            {planned.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-navy-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold-500 mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <a href="mailto:hej@fullmakt24.se?subject=Intresse%20f%C3%B6r%20API" className="btn-gold">
          Anmäl intresse
        </a>
        <p className="text-xs text-navy-300 mt-4">
          Tills vidare skapar du fullmakter direkt på sajten – 49 kr per mall, klar som PDF.
        </p>
      </div>
    </div>
  )
}
