import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integritetspolicy – Fullmakt24.se',
  description: 'Läs om hur Fullmakt24.se behandlar dina personuppgifter i enlighet med GDPR. Vi värnar om din integritet.',
}

export default function IntegritetPage() {
  return (
    <div className="section-padding py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-2">Integritetspolicy</h1>
        <p className="text-sm text-navy-400 mb-10">Senast uppdaterad: 1 mars 2026</p>

        <div className="space-y-8 text-navy-500">
          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">1. Personuppgiftsansvarig</h2>
            <p className="text-navy-400 leading-relaxed">
              Fullmakt24, nedan kallat &quot;vi&quot; eller &quot;Fullmakt24.se&quot;, är personuppgiftsansvarig för behandlingen av dina personuppgifter på fullmakt24.se.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">Kontakt: info@fullmakt24.se</p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">2. Vilka uppgifter vi samlar in</h2>
            <p className="text-navy-400 leading-relaxed">Vi samlar in följande typer av personuppgifter:</p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Dokumentdata:</strong> De uppgifter du fyller i när du skapar ett dokument, såsom namn, personnummer och adresser. Dessa uppgifter behandlas enbart för att generera ditt dokument och lagras inte på våra servrar efter att PDF:en har genererats.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Betalningsuppgifter:</strong> Betalningar hanteras av vår betalningsleverantör Stripe. Vi har aldrig tillgång till dina kortuppgifter. Stripe lagrar betalningsinformation i enlighet med PCI DSS-standarden.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Teknisk data:</strong> IP-adress, webbläsartyp, operativsystem och besöksmönster samlas in via cookies för att förbättra tjänsten. Se vår cookiepolicy för mer information.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">3. Rättslig grund</h2>
            <p className="text-navy-400 leading-relaxed">Vi behandlar dina personuppgifter baserat på följande rättsliga grunder:</p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Avtal:</strong> Behandling av dokumentdata är nödvändig för att fullgöra vårt avtal med dig, det vill säga att generera det dokument du beställt.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Berättigat intresse:</strong> Teknisk data samlas in för att säkerställa tjänstens funktion, säkerhet och för att förbättra användarupplevelsen.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Samtycke:</strong> Cookies för marknadsföring och analys sätts enbart efter ditt aktiva samtycke.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">4. Lagring och säkerhet</h2>
            <p className="text-navy-400 leading-relaxed">
              Dokumentdata genereras lokalt i din webbläsare och skickas inte till våra servrar. PDF-filen skapas på klientsidan och laddas ner direkt till din enhet. Vi lagrar inga kopior av dina färdiga dokument.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              All kommunikation med vår webbplats sker via HTTPS-kryptering. Betalningsdata skyddas av Stripes PCI DSS Level 1-certifiering.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">5. Delning med tredje part</h2>
            <p className="text-navy-400 leading-relaxed">
              Vi säljer aldrig dina personuppgifter. Vi delar information enbart med följande parter, och enbart i den utsträckning som krävs:
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Stripe:</strong> Betalningshantering. Stripe behandlar betalningsdata i enlighet med sin egen integritetspolicy och PCI DSS.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Vercel:</strong> Hosting av webbplatsen. Vercel behandlar teknisk data (IP-adresser, förfrågningsloggar) i enlighet med sin integritetspolicy.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">6. Dina rättigheter</h2>
            <p className="text-navy-400 leading-relaxed">Enligt GDPR har du följande rättigheter:</p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Rätt till tillgång:</strong> Du har rätt att begära information om vilka personuppgifter vi behandlar om dig.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Rätt till rättelse:</strong> Du har rätt att begära rättelse av felaktiga uppgifter.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Rätt till radering:</strong> Du har rätt att begära att vi raderar dina personuppgifter.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              <strong>Rätt att klaga:</strong> Du har rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).
            </p>
            <p className="text-navy-400 leading-relaxed mt-3">
              Kontakta oss på <a href="mailto:info@fullmakt24.se" className="text-gold-600 font-semibold hover:underline">info@fullmakt24.se</a> för att utöva dina rättigheter.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">7. Ändringar</h2>
            <p className="text-navy-400 leading-relaxed">
              Vi kan komma att uppdatera denna integritetspolicy. Väsentliga ändringar meddelas via webbplatsen. Vi rekommenderar att du regelbundet läser igenom policyn.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
