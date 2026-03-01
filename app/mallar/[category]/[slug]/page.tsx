'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { templates, categories, getTemplatesByCategory } from '@/data/templates'

interface SeoContent {
  slug: string
  seo: { title: string; metaDescription: string; h1: string; keywords: string[] }
  content: {
    introduction: string
    legalValidity: string
    howToGuide: string
    commonMistakes: string
    faq: { question: string; answer: string }[]
  }
  internalLinks: { text: string; href: string }[]
}

export default function TemplateDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const t = templates.find(tp => tp.slug === slug)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [seoContent, setSeoContent] = useState<SeoContent | null>(null)

  useEffect(() => {
    if (slug) {
      fetch(`/content/mallar/${slug}.json`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setSeoContent(data))
        .catch(() => setSeoContent(null))
    }
  }, [slug])

  if (!t) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-navy-500 mb-4">Mall hittades inte</h1>
        <Link href="/mallar" className="btn-primary">← Tillbaka till mallar</Link>
      </div>
    )
  }

  const cat = categories.find(c => c.slug === t.categorySlug)
  const related = getTemplatesByCategory(t.categorySlug).filter(r => r.id !== t.id).slice(0, 4)
  const allFaqs = seoContent?.content.faq || t.faq

  return (
    <div className="section-padding py-10 lg:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <Link href="/mallar" className="hover:text-navy-600">Mallar</Link><span>/</span>
        <Link href={`/mallar?category=${t.categorySlug}`} className="hover:text-navy-600">{cat?.name}</Link><span>/</span>
        <span className="text-navy-600 font-medium truncate">{t.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_380px] gap-12">
        {/* Main */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{cat?.icon}</span>
            <span className={t.badge === 'popular' ? 'badge-popular' : t.badge === 'premium' ? 'badge-premium' : 'badge-gratis'}>
              {t.badge === 'popular' ? 'Populär' : t.badge === 'premium' ? 'Premium' : 'Gratis'}
            </span>
            <span className="text-sm text-navy-400">{t.usageCount.toLocaleString('sv-SE')} skapade</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-4">
            {seoContent?.seo.h1 || t.name}
          </h1>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mb-10 p-4 bg-navy-50 rounded-xl">
            {['Fyll i', 'Granska', 'Ladda ner'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-navy-200 text-navy-600 text-xs font-bold flex items-center justify-center">{i + 1}</div>
                <span className="text-sm font-medium text-navy-500">{s}</span>
                {i < 2 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-300 ml-2"><path d="M9 18l6-6-6-6"/></svg>}
              </div>
            ))}
          </div>

          {/* ═══ SEO CONTENT: Introduction ═══ */}
          {seoContent?.content.introduction ? (
            <div className="card p-6 mb-8">
              <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Vad är {t.name.toLowerCase()}?</h2>
              {seoContent.content.introduction.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-navy-500 leading-relaxed mb-3 last:mb-0">{p}</p>
              ))}
            </div>
          ) : (
            <div className="card p-6 mb-8">
              <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Vad används denna fullmakt för?</h2>
              <p className="text-navy-400 leading-relaxed">{t.longDescription}</p>
            </div>
          )}

          {/* ═══ SEO CONTENT: Legal validity ═══ */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-600 shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div>
                <h3 className="font-semibold text-emerald-800 mb-2">Juridisk giltighet</h3>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  {seoContent?.content.legalValidity || t.legalInfo}
                </p>
              </div>
            </div>
          </div>

          {/* ═══ SEO CONTENT: How-to guide ═══ */}
          {seoContent?.content.howToGuide && (
            <div className="card p-6 mb-8">
              <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Så fyller du i fullmakten – steg för steg</h2>
              <div className="space-y-4">
                {seoContent.content.howToGuide.split('\n').filter(Boolean).map((step, i) => (
                  <div key={i} className="flex gap-3">
                    {step.match(/^Steg \d/) && (
                      <div className="w-7 h-7 bg-gold-100 text-gold-700 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                    )}
                    <p className="text-navy-500 text-sm leading-relaxed">
                      {step.replace(/^Steg \d:\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SEO CONTENT: Common mistakes ═══ */}
          {seoContent?.content.commonMistakes && (
            <div className="card p-6 mb-8 border-l-4 border-gold-400">
              <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">⚠️ Vanliga misstag att undvika</h2>
              <div className="space-y-3">
                {seoContent.content.commonMistakes.split('\n').filter(Boolean).map((mistake, i) => (
                  <p key={i} className="text-navy-500 text-sm leading-relaxed">{mistake}</p>
                ))}
              </div>
            </div>
          )}

          {/* ═══ FAQ ═══ */}
          <div className="mb-8">
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Vanliga frågor</h2>
            <div className="card overflow-hidden">
              {allFaqs.map((f, i) => {
                const q = 'question' in f ? f.question : f.q
                const a = 'answer' in f ? f.answer : f.a
                return (
                  <div key={i} className="border-b border-navy-50 last:border-0">
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left group">
                      <span className="font-medium text-navy-600 pr-4 text-sm group-hover:text-gold-600 transition-colors">{q}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-navy-300 shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    {faqOpen === i && <div className="px-5 pb-5 text-sm text-navy-400 leading-relaxed -mt-2">{a}</div>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══ Internal links from SEO content ═══ */}
          {seoContent?.internalLinks && seoContent.internalLinks.length > 0 && (
            <div className="mb-8">
              <h3 className="font-heading font-bold text-navy-500 text-lg mb-3">Relaterade fullmakter</h3>
              <div className="flex flex-wrap gap-2">
                {seoContent.internalLinks.map(link => (
                  <Link key={link.href} href={link.href} className="px-4 py-2 bg-navy-50 text-navy-600 rounded-lg text-sm font-medium hover:bg-gold-50 hover:text-gold-700 transition-colors">
                    {link.text} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related templates from data */}
          {related.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Fler mallar i {cat?.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map(r => (
                  <Link key={r.id} href={`/mallar/${r.categorySlug}/${r.slug}`} className="card-interactive p-4 group">
                    <h3 className="font-heading font-bold text-navy-600 text-sm group-hover:text-gold-600 transition-colors mb-1">{r.name}</h3>
                    <p className="text-xs text-navy-400 line-clamp-2">{r.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar CTA */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="card p-6 border-gold-200 border-2">
              <h3 className="font-heading font-bold text-navy-500 text-lg mb-3">Skapa denna fullmakt</h3>
              <p className="text-sm text-navy-400 mb-6">Fyll i dina uppgifter och ladda ner som PDF direkt. Det tar bara 3 minuter.</p>
              <Link href={`/skapa/${t.slug}`} className="btn-gold w-full text-center">
                Skapa nu →
              </Link>
              <div className="mt-4 space-y-2 text-xs text-navy-400">
                {['Juridiskt granskad mall', 'Klar på 3 minuter', 'Ladda ner som PDF'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-navy-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-400">Pris:</span>
                  <div>
                    <span className="font-bold text-navy-600">49 kr</span>
                    <span className="text-navy-300 text-xs ml-1">/ gratis med vattenstämpel</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO keywords as tags */}
            {seoContent?.seo.keywords && (
              <div className="bg-navy-50 rounded-xl p-5">
                <div className="text-xs font-semibold text-navy-500 mb-3">Relaterade sökord</div>
                <div className="flex flex-wrap gap-1.5">
                  {seoContent.seo.keywords.map(kw => (
                    <span key={kw} className="px-2 py-1 bg-white text-navy-400 rounded text-[10px]">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-navy-50 rounded-xl p-5 text-center">
              <div className="text-sm font-medium text-navy-500 mb-1">Behöver du hjälp?</div>
              <p className="text-xs text-navy-400 mb-3">Vår support hjälper dig gärna.</p>
              <a href="mailto:support@fullmakt24.se" className="text-xs font-semibold text-gold-600 hover:text-gold-700">support@fullmakt24.se</a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-navy-100 z-40">
        <Link href={`/skapa/${t.slug}`} className="btn-gold w-full text-center">
          Skapa {t.name} →
        </Link>
      </div>
    </div>
  )
}
