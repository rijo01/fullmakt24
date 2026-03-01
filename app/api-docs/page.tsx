'use client'

import Link from 'next/link'

export default function ApiDocsPage() {
  const endpoints = [
    { method: 'GET', path: '/api/v1/templates', desc: 'Lista alla mallar med metadata' },
    { method: 'GET', path: '/api/v1/templates/:slug', desc: 'Hämta malldetaljer och fältschema' },
    { method: 'POST', path: '/api/v1/documents/generate', desc: 'Generera PDF från mall + data' },
    { method: 'GET', path: '/api/v1/documents/:id', desc: 'Hämta dokumentstatus/nedladdningslänk' },
    { method: 'POST', path: '/api/v1/articles/create', desc: 'Skapa SEO-artikel för mallsida' },
    { method: 'PUT', path: '/api/v1/articles/:slug', desc: 'Uppdatera artikelinnehåll' },
    { method: 'GET', path: '/api/v1/stats', desc: 'Hämta användarstatistik' },
  ]

  return (
    <div className="section-padding py-10 lg:py-16">
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">API-dokumentation</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> API v1.0 – Live
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-4">
            Fullmakt24 REST API
          </h1>
          <p className="text-lg text-navy-400 mb-6">
            Integrera Fullmakt24 med dina system. Generera fullmakter programmatiskt, hantera mallar och skapa innehåll via vårt REST API.
          </p>
          <div className="flex gap-3">
            <button className="btn-primary text-sm">Skapa API-nyckel</button>
            <a href="mailto:api@fullmakt24.se" className="btn-secondary text-sm">Kontakta oss</a>
          </div>
        </div>

        {/* Quick start */}
        <div className="card p-6 lg:p-8 mb-8">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Snabbstart</h2>
          <div className="bg-navy-500 rounded-xl p-5 overflow-x-auto">
            <pre className="font-mono text-sm text-navy-100 leading-relaxed">
{`# Autentisering
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://fullmakt24.se/api/v1/templates

# Generera dokument
curl -X POST https://fullmakt24.se/api/v1/documents/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_slug": "fullmakt-bank",
    "data": {
      "givare_namn": "Anna Svensson",
      "givare_pnr": "880515-1234",
      "havare_namn": "Erik Johansson",
      "syfte": "Bankärenden hos Handelsbanken"
    }
  }'`}
            </pre>
          </div>
        </div>

        {/* Endpoints */}
        <div className="card overflow-hidden mb-8">
          <div className="px-6 py-4 bg-navy-50 border-b border-navy-100">
            <h2 className="font-heading font-bold text-navy-500 text-lg">Endpoints</h2>
          </div>
          <div className="divide-y divide-navy-50">
            {endpoints.map(ep => (
              <div key={ep.path} className="px-6 py-4 flex items-center gap-4 hover:bg-navy-50/50 transition-colors">
                <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md ${
                  ep.method === 'GET' ? 'bg-emerald-50 text-emerald-700' :
                  ep.method === 'POST' ? 'bg-blue-50 text-blue-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {ep.method}
                </span>
                <code className="font-mono text-sm text-navy-600 flex-1">{ep.path}</code>
                <span className="text-sm text-navy-400 hidden sm:inline">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate limiting */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="font-heading font-bold text-navy-500 text-lg mb-3">Rate Limiting</h3>
            <div className="space-y-2 text-sm text-navy-400">
              <div className="flex justify-between"><span>Standard</span><span className="font-mono text-navy-600">100 req/min</span></div>
              <div className="flex justify-between"><span>MaxiAI/Open Claw</span><span className="font-mono text-navy-600">100 req/min</span></div>
              <div className="flex justify-between"><span>Enterprise</span><span className="font-mono text-navy-600">Anpassad</span></div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-heading font-bold text-navy-500 text-lg mb-3">Autentisering</h3>
            <p className="text-sm text-navy-400 mb-3">Alla anrop kräver en Bearer token i Authorization-headern.</p>
            <div className="bg-navy-50 rounded-lg p-3 font-mono text-xs text-navy-600">
              Authorization: Bearer sk_live_xxxxx
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="card p-6 lg:p-8 mb-8">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Webhooks</h2>
          <p className="text-sm text-navy-400 mb-4">
            Konfigurera en webhook-URL för att få notifikationer vid dokumentskapande, signering och andra händelser.
          </p>
          <div className="bg-navy-500 rounded-xl p-5 overflow-x-auto">
            <pre className="font-mono text-sm text-navy-100 leading-relaxed">
{`// Webhook payload vid dokumentskapande
{
  "event": "document.created",
  "timestamp": "2025-06-15T10:30:00Z",
  "data": {
    "document_id": "doc_abc123",
    "template_slug": "fullmakt-bank",
    "status": "completed",
    "download_url": "https://fullmakt24.se/api/v1/documents/doc_abc123/pdf"
  }
}`}
            </pre>
          </div>
        </div>

        {/* MaxiAI integration */}
        <div className="bg-gradient-to-br from-navy-500 to-navy-600 rounded-3xl p-8 lg:p-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <span className="text-gold-400 text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-white text-xl">MaxiAI / Open Claw Integration</h2>
              <p className="text-navy-200 text-sm">Automatisera innehåll och dokumenthantering</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {[
              'Auto-generera SEO-innehåll för alla 124 mallsidor',
              'Skapa och publicera bloggartiklar automatiskt',
              'Övervaka vilka mallar som trendar',
              'Uppdatera mallbeskrivningar och FAQ',
              'Hantera innehållskalendern',
              'A/B-testa metabeskrivningar',
            ].map(f => (
              <div key={f} className="flex items-start gap-2 text-sm text-navy-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold-400 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
