import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Om Fullmakt24.se – Sveriges smartaste fullmaktstjänst',
  description: 'Fullmakt24.se gör det enkelt att skapa juridiskt korrekta fullmakter och medgivanden. Läs mer om oss, vår vision och varför tusentals svenskar väljer oss.',
}

export default function OmPage() {
  return (
    <div className="section-padding py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-6">Om Fullmakt24.se</h1>

        <div className="space-y-6 text-navy-500">
          <p className="text-lg text-navy-400 leading-relaxed">
            Fullmakt24.se är Sveriges ledande digitala plattform för fullmakter och medgivanden. Vi gör det enkelt, snabbt och tryggt att skapa juridiskt korrekta dokument – utan att behöva anlita en jurist.
          </p>

          <div className="card p-8 my-8">
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Vår vision</h2>
            <p className="text-navy-400 leading-relaxed">
              Juridiska dokument ska vara tillgängliga för alla. Vi tror att ingen ska behöva betala tusentals kronor för en enkel fullmakt som tar tre minuter att fylla i. Därför har vi byggt Fullmakt24.se – en tjänst som kombinerar juridisk expertis med modern teknik.
            </p>
          </div>

          <h2 className="font-heading font-bold text-navy-500 text-xl mt-10 mb-4">Vad vi erbjuder</h2>
          <p className="text-navy-400 leading-relaxed">
            Med över 200 professionellt utformade mallar täcker vi de flesta situationer där du behöver en fullmakt eller ett medgivande. Våra mallar är anpassade för svenska förhållanden och uppdateras löpande i enlighet med gällande lagstiftning.
          </p>
          <p className="text-navy-400 leading-relaxed">
            Varje mall har granskats av juridisk expertis och är utformad för att accepteras av banker, myndigheter, vårdgivare och andra mottagare. Du fyller i dina uppgifter, granskar dokumentet och laddar ner en färdig PDF – allt på under tre minuter.
          </p>

          <h2 className="font-heading font-bold text-navy-500 text-xl mt-10 mb-4">Trygghet och kvalitet</h2>
          <p className="text-navy-400 leading-relaxed">
            Alla betalningar hanteras säkert via Stripe med stöd för kort, Apple Pay och Klarna. Vi lagrar aldrig dina betaluppgifter. Dina dokumentdata behandlas konfidentiellt i enlighet med GDPR och vår integritetspolicy.
          </p>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-gold-800 mb-2">Kontakta oss</h3>
            <p className="text-gold-700 text-sm mb-3">Har du frågor, förslag eller behöver hjälp? Vi finns här för dig.</p>
            <p className="text-sm text-gold-700">E-post: <a href="mailto:support@fullmakt24.se" className="font-semibold hover:underline">support@fullmakt24.se</a></p>
          </div>

          <h2 className="font-heading font-bold text-navy-500 text-xl mt-10 mb-4">Företagsinformation</h2>
          <div className="bg-navy-50 rounded-xl p-6 text-sm text-navy-500 space-y-1">
            <p><strong>Företag:</strong> Fullmakt24</p>
                        <p><strong>Webbplats:</strong> fullmakt24.se</p>
            <p><strong>E-post:</strong> info@fullmakt24.se</p>
          </div>
        </div>
      </div>
    </div>
  )
}
