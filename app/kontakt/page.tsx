import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakta oss – Fullmakt24.se',
  description: 'Har du frågor om fullmakter eller behöver hjälp med vår tjänst? Kontakta Fullmakt24.se via e-post. Vi svarar normalt inom 24 timmar.',
}

export default function KontaktPage() {
  return (
    <div className="section-padding py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-6">Kontakta oss</h1>

        <p className="text-lg text-navy-400 leading-relaxed mb-10">
          Vi finns här för att hjälpa dig. Oavsett om du har frågor om en specifik mall, behöver teknisk support eller vill ge feedback – tveka inte att höra av dig.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card p-6">
            <div className="text-3xl mb-3">📧</div>
            <h2 className="font-heading font-bold text-navy-500 text-lg mb-2">E-post</h2>
            <p className="text-sm text-navy-400 mb-3">Generella frågor och feedback.</p>
            <a href="mailto:info@fullmakt24.se" className="text-gold-600 font-semibold hover:text-gold-700">info@fullmakt24.se</a>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">🛟</div>
            <h2 className="font-heading font-bold text-navy-500 text-lg mb-2">Support</h2>
            <p className="text-sm text-navy-400 mb-3">Teknisk hjälp och betalningsfrågor.</p>
            <a href="mailto:support@fullmakt24.se" className="text-gold-600 font-semibold hover:text-gold-700">support@fullmakt24.se</a>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Vanliga frågor</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-navy-600 text-sm mb-1">Hur snabbt svarar ni?</h3>
              <p className="text-sm text-navy-400">Vi strävar efter att svara på alla e-postmeddelanden inom 24 timmar under vardagar.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-600 text-sm mb-1">Jag har betalat men inte fått mitt dokument – vad gör jag?</h3>
              <p className="text-sm text-navy-400">Kontakta support@fullmakt24.se med ditt betalnings-ID så hjälper vi dig omedelbart. Ditt betalnings-ID hittar du i bekräftelsemailet från Stripe.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-600 text-sm mb-1">Kan jag få en återbetalning?</h3>
              <p className="text-sm text-navy-400">Ja, vi erbjuder full återbetalning inom 14 dagar om du inte är nöjd med ditt dokument. Kontakta oss via support@fullmakt24.se.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-600 text-sm mb-1">Erbjuder ni juridisk rådgivning?</h3>
              <p className="text-sm text-navy-400">Nej, Fullmakt24.se tillhandahåller mallar och generell information. Vi erbjuder inte juridisk rådgivning. Vid komplexa juridiska frågor rekommenderar vi alltid att kontakta en jurist.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-navy-50 rounded-xl p-6 text-sm text-navy-500 space-y-1">
          <p><strong>Företag:</strong> Rickard Johansson Invest AB</p>
          <p><strong>Organisationsnummer:</strong> 559369-0416</p>
          <p><strong>E-post:</strong> info@fullmakt24.se</p>
        </div>
      </div>
    </div>
  )
}
