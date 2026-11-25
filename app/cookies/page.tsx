import type { Metadata } from 'next'
import { SamtyckeVal } from '@/components/Samtycke'

export const metadata: Metadata = {
  title: 'Cookiepolicy',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
  description: 'Information om hur Fullmakt24.se använder cookies och liknande teknik. Läs om vilka cookies vi använder och hur du hanterar dem.',
}

export default function CookiesPage() {
  return (
    <div className="section-padding py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-2">Cookiepolicy</h1>
        <p className="text-sm text-navy-400 mb-10">Senast uppdaterad: 25 november 2026</p>

        <div className="space-y-8 text-navy-500">
          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Vad är cookies?</h2>
            <p className="text-navy-400 leading-relaxed">
              Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De används för att webbplatsen ska fungera korrekt, för att förbättra din upplevelse och i vissa fall för att samla in statistik.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Cookies vi använder</h2>

            <div className="card p-6 mb-4">
              <h3 className="font-semibold text-navy-600 mb-2">Nödvändiga cookies</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Dessa cookies krävs för att webbplatsen ska fungera korrekt. De hanterar bland annat sessionsdata och formulärinmatning. Dessa cookies kan inte stängas av.
              </p>
              <div className="mt-3 bg-navy-50 rounded-lg p-3 text-xs text-navy-500 space-y-1">
                <p><strong>localStorage (draft_*):</strong> Sparar dina formulärdata lokalt så att du inte förlorar dem om du lämnar sidan och kan ladda ner dokumentet efter betalningen. Lagras enbart på din enhet. Tas bort automatiskt när de inte har ändrats på 30 dagar, vid ditt nästa besök, eller direkt med knappen &rdquo;Rensa mina uppgifter på den här enheten&rdquo; i formuläret.</p>
                <p><strong>localStorage (fm24-samtycke):</strong> Ditt val om statistik, så att vi inte frågar på varje sida. Lagras enbart på din enhet.</p>
              </div>
            </div>

            <div className="card p-6 mb-4">
              <h3 className="font-semibold text-navy-600 mb-2">Funktionella cookies</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Dessa cookies gör det möjligt att komma ihåg dina val och preferenser för en bättre upplevelse.
              </p>
            </div>

            <div id="statistik" className="card p-6 mb-4 scroll-mt-28">
              <h3 className="font-semibold text-navy-600 mb-2">Statistik (Google Analytics)</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Om du godkänner det använder vi Google Analytics från Google Ireland Limited för att se hur
                sajten används, till exempel vilka mallar som visas och hur många som slutför ett köp. Utan
                ditt godkännande laddas ingenting från Google och inga statistikcookies sätts. Sajten fungerar
                likadant oavsett vad du väljer.
              </p>
              <p className="text-sm text-navy-400 leading-relaxed mt-2">
                <strong>Det här skickas till Google om du godkänner:</strong> vilka sidor du besöker (adressen
                utan sökord och betalningsuppgifter) och sidans titel, din enhet och webbläsare, ungefärlig
                plats som Google härleder från din IP-adress, hur många träffar en sökning gav och vilken mall
                du väljer, samt att ett köp har genomförts med belopp och betalningsreferens. Det du fyller i
                formulären och det du skriver i sökrutan skickas aldrig.
              </p>
              <p className="text-sm text-navy-400 leading-relaxed mt-2">
                Google kan behandla uppgifterna i USA. Google omfattas av EU:s och USA:s ramverk för dataskydd
                (EU-U.S. Data Privacy Framework).
              </p>
              <div className="mt-3 bg-navy-50 rounded-lg p-3 text-xs text-navy-500 space-y-1">
                <p><strong>_ga:</strong> Sätts av Google Analytics för att skilja besökare åt. Gäller i upp till 2 år (Googles standardvärde).</p>
                <p><strong>_ga_K5Y04XM2VE:</strong> Sätts av Google Analytics för att hålla ihop ett besök. Gäller i upp till 2 år (Googles standardvärde).</p>
              </div>
              <p className="text-sm text-navy-400 leading-relaxed mt-3">
                Du kan ändra ditt val när som helst. Tar du tillbaka ditt godkännande skickas inget mer till
                Google och cookiesen ovan tas bort.
              </p>
              <SamtyckeVal />
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-navy-600 mb-2">Tredjepartscookies</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Vår betalningsleverantör Stripe kan sätta cookies i samband med betalningsprocessen. Dessa cookies är nödvändiga för att genomföra betalningen säkert och styrs av Stripes cookiepolicy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Hantera cookies</h2>
            <p className="text-navy-400 leading-relaxed">
              Du kan när som helst ändra dina cookie-inställningar i din webbläsare. De flesta webbläsare låter dig blockera eller radera cookies. Observera att om du blockerar nödvändiga cookies kan webbplatsens funktionalitet påverkas.
            </p>
            <p className="text-navy-400 leading-relaxed mt-2">
              Så hanterar du cookies i de vanligaste webbläsarna:
            </p>
            <div className="mt-3 space-y-2 text-sm text-navy-400">
              <p><strong>Chrome:</strong> Inställningar → Sekretess och säkerhet → Cookies</p>
              <p><strong>Safari:</strong> Inställningar → Sekretess → Hantera webbplatsdata</p>
              <p><strong>Firefox:</strong> Inställningar → Sekretess och säkerhet → Cookies och webbplatsdata</p>
              <p><strong>Edge:</strong> Inställningar → Sekretess, sökning och tjänster → Cookies</p>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Ändringar</h2>
            <p className="text-navy-400 leading-relaxed">
              Vi kan uppdatera denna cookiepolicy. Ändringar publiceras på denna sida med uppdaterat datum.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Kontakt</h2>
            <p className="text-navy-400 leading-relaxed">
              Har du frågor om vår användning av cookies? Kontakta oss på <a href="mailto:info@fullmakt24.se" className="text-gold-600 font-semibold hover:underline">info@fullmakt24.se</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
