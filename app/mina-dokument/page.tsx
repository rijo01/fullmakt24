'use client'

import Link from 'next/link'

export default function MinaDokumentPage() {
  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Mina dokument</span>
      </nav>

      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-navy-300">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h1 className="text-2xl font-heading font-bold text-navy-500 mb-3">Så når du dina dokument</h1>
        <p className="text-navy-400 mb-8">När du har betalat laddar du ner din färdiga PDF direkt på bekräftelsesidan. Spara filen lokalt så har du den kvar.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/mallar" className="btn-gold">Skapa en fullmakt</Link>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 gap-6 text-left">
          {[
            { title: 'Ladda ner direkt', desc: 'Efter betalning får du din PDF på en gång – ingen inloggning krävs.' },
            { title: 'Utkast sparas lokalt', desc: 'Medan du fyller i sparas dina uppgifter i din webbläsare så att du kan fortsätta senare.' },
          ].map(f => (
            <div key={f.title} className="card p-5">
              <h3 className="font-heading font-bold text-navy-500 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-navy-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
