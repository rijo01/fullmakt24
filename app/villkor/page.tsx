import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Allmänna villkor – Fullmakt24.se',
  description: 'Läs våra allmänna villkor för användning av Fullmakt24.se. Här beskrivs dina rättigheter, priser, ångerrätt och ansvarsbegränsningar.',
}

export default function VillkorPage() {
  return (
    <div className="section-padding py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-2">Allmänna villkor</h1>
        <p className="text-sm text-navy-400 mb-10">Senast uppdaterade: 1 mars 2026</p>

        <div className="space-y-8 text-navy-500">
          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">1. Allmänt</h2>
            <p className="text-navy-400 leading-relaxed">
              Dessa allmänna villkor gäller för alla tjänster som tillhandahålls av Rickard Johansson Invest AB (org.nr 559369-0416) via webbplatsen fullmakt24.se. Genom att använda tjänsten godkänner du dessa villkor.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">2. Tjänsten</h2>
            <p className="text-navy-400 leading-relaxed">
              Fullmakt24.se tillhandahåller digitala mallar för fullmakter och medgivanden. Tjänsten innefattar att fylla i en mall via vår webbplats och ladda ner det färdiga dokumentet som PDF.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Våra mallar är utformade för att vara juridiskt korrekta enligt svensk lag, men utgör inte juridisk rådgivning. Vi rekommenderar att du konsulterar en jurist vid komplexa eller ovanliga ärenden.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">3. Priser och betalning</h2>
            <p className="text-navy-400 leading-relaxed">
              Aktuella priser visas på webbplatsen. Alla priser anges i svenska kronor (SEK) inklusive moms. Betalning sker via vår betalningsleverantör Stripe och kan genomföras med betalkort, Apple Pay eller Klarna.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Standardpriset för ett enskilt dokument är 49 kr. Vi erbjuder även paketpriser och tillfälliga erbjudanden som framgår av prissidan.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">4. Ångerrätt</h2>
            <p className="text-navy-400 leading-relaxed">
              Enligt distansavtalslagen har du som konsument 14 dagars ångerrätt. Eftersom tjänsten avser digitalt innehåll som levereras omedelbart efter köp, samtycker du vid köpet till att ångerrätten upphör när dokumentet görs tillgängligt för nedladdning.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Trots detta erbjuder vi full återbetalning inom 14 dagar om du inte är nöjd med dokumentet. Kontakta support@fullmakt24.se med ditt betalnings-ID.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">5. Ansvarsbegränsning</h2>
            <p className="text-navy-400 leading-relaxed">
              Fullmakt24.se tillhandahåller mallar baserade på allmän juridisk information. Vi garanterar inte att ett specifikt dokument accepteras av en specifik mottagare, då krav kan variera mellan organisationer och myndigheter.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Vi ansvarar inte för eventuella konsekvenser som uppstår till följd av felaktigt ifyllda dokument, användning av dokument i situationer de inte är avsedda för, eller förändringar i lagstiftning som påverkar dokumentens giltighet.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Vårt totala ansvar är begränsat till det belopp du har betalat för det aktuella dokumentet.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">6. Immateriella rättigheter</h2>
            <p className="text-navy-400 leading-relaxed">
              Allt innehåll på fullmakt24.se, inklusive malltexter, design och logotyper, är skyddat av upphovsrätt och tillhör Rickard Johansson Invest AB. Du får använda nedladdade dokument för personligt bruk men får inte vidaredistribuera, sälja eller kopiera mallarna.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">7. Personuppgifter</h2>
            <p className="text-navy-400 leading-relaxed">
              Vi behandlar personuppgifter i enlighet med GDPR och vår <a href="/integritet" className="text-gold-600 font-semibold hover:underline">integritetspolicy</a>. Dokumentdata genereras lokalt i din webbläsare och lagras inte på våra servrar.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">8. Tvister</h2>
            <p className="text-navy-400 leading-relaxed">
              Eventuella tvister som uppstår i anslutning till dessa villkor ska i första hand lösas genom förhandling. Om parterna inte kan komma överens ska tvisten avgöras av svensk domstol med tillämpning av svensk lag.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Du kan även vända dig till Allmänna reklamationsnämnden (ARN) för tvistlösning utanför domstol. Mer information finns på <a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="text-gold-600 font-semibold hover:underline">arn.se</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">9. Ändringar av villkoren</h2>
            <p className="text-navy-400 leading-relaxed">
              Vi förbehåller oss rätten att ändra dessa villkor. Väsentliga ändringar meddelas via webbplatsen. Fortsatt användning av tjänsten efter ändring innebär att du godkänner de uppdaterade villkoren.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">10. Kontakt</h2>
            <div className="bg-navy-50 rounded-xl p-6 text-sm text-navy-500 space-y-1">
              <p><strong>Företag:</strong> Rickard Johansson Invest AB</p>
              <p><strong>Organisationsnummer:</strong> 559369-0416</p>
              <p><strong>E-post:</strong> info@fullmakt24.se</p>
              <p><strong>Support:</strong> support@fullmakt24.se</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
