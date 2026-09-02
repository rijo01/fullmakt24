import type { Metadata } from 'next'
import Link from 'next/link'

const URL = 'https://fullmakt24.se/generalfullmakt'
const TITLE = 'Generalfullmakt – mall och guide 2026'
const DESCRIPTION =
  'Vad en generalfullmakt omfattar, vad banken faktiskt godtar och när du i stället behöver en framtidsfullmakt. Guide plus färdig mall – 99 kr, PDF direkt.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'generalfullmakt',
    'generalfullmakt mall',
    'enkel fullmakt',
    'fullmakt till privatpersoner',
    'fullmakt privatperson',
    'generalfullmakt privatperson',
    'generalfullmakt eller framtidsfullmakt',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'article',
    locale: 'sv_SE',
    siteName: 'Fullmakt24.se',
    images: [{ url: 'https://fullmakt24.se/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

interface Section {
  heading: string
  paragraphs?: string[]
  list?: string[]
  listHeading?: string
  list2Heading?: string
  list2?: string[]
  after?: string[]
}

const sections: Section[] = [
  {
    heading: 'Vad en generalfullmakt är och vad den omfattar',
    paragraphs: [
      'Svensk rätt har ingen legaldefinition av ordet generalfullmakt. Det är en praktisk benämning på en fullmakt som inte begränsats till ett visst ärende, till skillnad från en fullmakt att hämta ut ett paket eller sälja en bil. Reglerna om fullmakt finns i avtalslagen (1915:218) 2 kap., och där finns inga formkrav alls för en vanlig fullmakt. Den kan i teorin vara muntlig. I praktiken ska den vara skriftlig, av det enkla skälet att ingen motpart agerar på ett muntligt påstående.',
      'En generalfullmakt omfattar normalt rätten att företräda fullmaktsgivaren i ekonomiska och rättsliga angelägenheter: ta emot post, betala räkningar, säga upp abonnemang, teckna och avsluta avtal, och sköta kontakten med myndigheter, hyresvärd, försäkringsbolag och leverantörer.',
      'Två gränser gäller alltid. Den ena är formkrav i speciallagstiftning – en fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska enligt avtalslagen 27 § andra stycket vara skriftlig. Den andra är att vissa beslut är för personliga för att lämnas över till någon annan över huvud taget: att gifta sig, att skriva testamente, att samtycka till en operation.',
    ],
  },
  {
    heading: 'Generalfullmakt eller framtidsfullmakt?',
    paragraphs: [
      'Det här är den viktigaste skillnaden på hela sidan, och den missförstås ständigt.',
      'En generalfullmakt gäller från den dag du skriver den. En framtidsfullmakt gör tvärtom. Enligt lagen (2017:310) om framtidsfullmakter 1 § är den en fullmakt som någon ger åt en fysisk person att företräda fullmaktsgivaren för det fall han eller hon på grund av sjukdom, psykisk störning, försvagat hälsotillstånd eller något liknande förhållande varaktigt och i huvudsak inte längre har förmåga att ha hand om de angelägenheter som fullmakten avser. Enligt 9 § träder den i kraft när den situationen inträffar.',
      'Vad händer då med en vanlig generalfullmakt om du blir svårt sjuk? Här ska man vara ärlig: avtalslagen ger inget klart svar. I förarbetena till lagen om framtidsfullmakter (prop. 2016/17:30) skriver regeringen rakt ut att "det är osäkert vilken giltighet en fullmakt enligt avtalslagen … har när fullmaktsgivaren inte längre har förutsättningar att upprätthålla sin roll i fullmaktsförhållandet", och att fullmaktsgivaren i praktiken saknar möjlighet att kontrollera fullmaktshavarens handlande, vilket skapar en risk för missbruk. Just den osäkerheten var ett av huvudskälen till att framtidsfullmakter infördes.',
      'Avtalslagen reglerar två närliggande situationer, men inte denna. Enligt 21 § gäller fullmakten i regel även efter fullmaktsgivarens död, om inte särskilda omständigheter medför att den ska anses förfallen. Enligt 22 § får en rättshandling som ombudet företar inte större verkan än om fullmaktsgivaren själv företagit den, om fullmaktsgivaren fått en förvaltare enligt föräldrabalken och handlingen omfattas av förvaltarens uppdrag.',
      'Slutsatsen är praktisk snarare än juridisk: banker, vårdgivare och myndigheter vill inte hamna i den osäkerheten, och slutar i regel godta fullmakten om de får veta att fullmaktsgivaren inte längre kan bestämma själv. Ska någon kunna hjälpa dig den dagen – skriv en framtidsfullmakt. Vill du ha hjälp redan nu, medan du är fullt beslutskapabel – då är generalfullmakten rätt. Många skriver båda.',
      'Framtidsfullmakten har dessutom formkrav som generalfullmakten saknar. Enligt 4 § ska den vara skriftlig och undertecknas i två vittnens samtidiga närvaro. Enligt 2 § får den omfatta ekonomiska och personliga angelägenheter, men inte åtgärder enligt hälso- och sjukvårdslagen eller tandvårdslagen och inte frågor av utpräglat personlig karaktär. Och enligt 6 § kan en framtidsfullmakt inte göras oåterkallelig.',
    ],
  },
  {
    heading: 'Generalfullmakt eller begränsad fullmakt?',
    paragraphs: [
      'En begränsad fullmakt anger ett bestämt uppdrag: hämta ut ett paket, företräda mig på föreningsstämman den 12 maj, sköta mitt sjukärende hos Försäkringskassan. Den är smalare, och det är oftast en fördel.',
      'Motparter godtar en begränsad fullmakt lättare, eftersom det är enkelt att se att uppdraget täcker just det som ska göras. En generalfullmakt tvingar handläggaren att själv bedöma om "alla mina angelägenheter" innefattar det här ärendet – och många väljer då den försiktiga tolkningen.',
      'Tumregeln: skriv en begränsad fullmakt när du vet vad som ska göras, och en generalfullmakt när du inte kan förutse vilka ärenden som dyker upp – till exempel inför ett halvår utomlands. Även då bör du sätta en giltighetstid och räkna upp de viktigaste befogenheterna som exempel, i stället för att bara skriva "alla mina angelägenheter".',
    ],
  },
  {
    heading: 'Vad bank, myndighet och vård faktiskt godtar',
    paragraphs: [
      'Det är här förväntningarna oftast krockar med verkligheten.',
      'Bank. Räkna med att din bank kräver sin egen fullmaktsblankett för att ett ombud ska få göra något på ditt konto. Det hänger ihop med bankens skyldigheter kring kundkännedom och penningtvätt: den måste kunna identifiera både dig och ombudet och registrera behörigheten i sina system. En generalfullmakt kan fungera som underlag och som bevis på din vilja, men den ersätter inte bankens rutin. Ring kontoret och fråga vilken blankett som gäller innan du skriver något.',
      'BankID. En generalfullmakt ger inte, och kan inte ge, tillgång till ditt BankID. BankID är en personlig elektronisk legitimation som enligt utfärdarnas villkor inte får överlåtas eller användas av någon annan, och lämnar du ut dina koder kan du bli ansvarig för det som görs med dem. Ett ombud som behöver agera digitalt ska ha egen behörighet registrerad hos banken eller myndigheten – aldrig dina inloggningsuppgifter.',
      'Myndigheter. Skatteverket, Försäkringskassan, Pensionsmyndigheten och Kronofogden tar emot fullmakter, men flera har egna blanketter eller e-tjänster för ombud. Kontrollera på myndighetens egen sida först – det tar fem minuter och sparar en vända.',
      'Vård. Här är begränsningarna störst. Rätten att samtycka till vård är personlig och kan inte lämnas över genom fullmakt. Däremot kan en fullmakt användas för det administrativa runt omkring: begära journalkopior, boka och omboka tider, hämta ut läkemedel på apotek. Att en framtidsfullmakt uttryckligen inte får omfatta åtgärder enligt hälso- och sjukvårdslagen eller tandvårdslagen säger något om var gränsen går även för vanliga fullmakter.',
    ],
  },
  {
    heading: 'Riskerna – och när du inte ska ge en generalfullmakt',
    paragraphs: [
      'En generalfullmakt är ett av de mest kraftfulla dokument en privatperson kan skriva under, och den saknar helt de kontrollmekanismer som omger god man och förvaltare. Ingen myndighet granskar ombudet, ingen redovisning krävs och det finns inget register.',
    ],
    list: [
      'Ombudet gör något du inte tänkt dig, och motparten är i god tro. Rättshandlingen kan då ändå bli bindande för dig.',
      'Ett obegränsat dokument blir kvar hos någon långt efter att uppdraget är slut.',
      'Släktkonflikter. Ett syskon med generalfullmakt över en förälders ekonomi är en klassisk startpunkt för en familjetvist.',
      'Påtryckningar. Om någon i din närhet driver på för att du ska skriva en generalfullmakt är det i sig ett skäl att vänta och fråga någon utomstående till råds.',
    ],
    after: [
      'Skriv inte en generalfullmakt om du inte litar på personen fullt ut, om du är osäker på vad du skriver under, eller om det redan finns en konflikt i familjen om din ekonomi.',
    ],
  },
  {
    heading: 'Bevittning',
    paragraphs: [
      'Avtalslagen ställer inga krav på vittnen för en vanlig fullmakt, och alltså inte heller för en generalfullmakt. Bevittna ändå.',
      'Skälet är bevisning. En generalfullmakt används ofta lång tid efter att den skrevs, ibland i lägen där någon ifrågasätter om fullmaktsgivaren förstod vad hen undertecknade. Två vittnen som var på plats gör den frågan lättare att besvara, och många motparter frågar efter bevittning även om de inte kan kräva det.',
      'Använd två myndiga vittnen som inte är ombudet, inte ombudets make eller sambo och inte någon annan som berörs av fullmakten. Skriv ut namn, personnummer och telefonnummer. Jämför med framtidsfullmakten, där undertecknande i två vittnens samtidiga närvaro är ett formkrav enligt 4 § – uppfylls det inte är dokumentet ingen giltig framtidsfullmakt.',
    ],
  },
  {
    heading: 'Återkallelse och giltighetstid',
    paragraphs: [
      'En fullmakt gäller tills den återkallas eller löper ut. Sätt därför alltid ett slutdatum. En generalfullmakt utan bortre gräns är svår att hålla reda på och ännu svårare att bli av med.',
      'Grundregeln för en skriftlig fullmakt är att du återkallar den genom att ta tillbaka och förstöra handlingen. Har originalet lämnats vidare, eller vet du inte var det finns, blir det svårare. Avtalslagens 27 § andra stycket hänvisar till 16 och 17 §§ om återkallelse och kraftlöshetsförklaring för fullmakter som rör fast egendom.',
      'Gör tre saker samtidigt: begär tillbaka originalet, meddela ombudet skriftligt, och meddela de motparter som känner till fullmakten – bank, hyresvärd, försäkringsbolag. Spara kopior. Den som glömmer det sista riskerar att fullmakten fortsätter fungera i praktiken långt efter att den återkallats.',
    ],
  },
  {
    heading: 'Passar det här dig?',
    listHeading: 'En generalfullmakt passar när:',
    list: [
      'Du är fullt beslutskapabel och vill att någon sköter dina löpande ärenden under en avgränsad period.',
      'Du ska vara utomlands, sjukskriven eller på annat sätt otillgänglig och kan inte förutse vilka ärenden som dyker upp.',
      'Du litar helt på ombudet och sätter ett slutdatum.',
      'Du kompletterar med bankens egen blankett för de konton som faktiskt ska hanteras.',
    ],
    list2Heading: 'Välj något annat när:',
    list2: [
      'Syftet är att någon ska kunna hjälpa dig om du blir dement eller svårt sjuk. Skriv en framtidsfullmakt.',
      'Du vet exakt vilket ärende det gäller. Skriv en begränsad fullmakt – den godtas lättare.',
      'Ombudet ska agera digitalt i ditt namn med ditt BankID. Det går inte, oavsett vad fullmakten säger.',
      'Personen är redan så påverkad av sjukdom att beslutsförmågan kan ifrågasättas. Då är det god man eller förvaltare via överförmyndaren som gäller.',
      'Det finns en konflikt eller en tvist om ekonomin, eller utländska förhållanden. Ta juridisk hjälp innan något undertecknas.',
    ],
  },
]

const faq = [
  {
    q: 'Vad är skillnaden mellan generalfullmakt och framtidsfullmakt?',
    a: 'En generalfullmakt gäller direkt, från den dag den skrivs. En framtidsfullmakt börjar gälla först när fullmaktsgivaren på grund av sjukdom eller liknande varaktigt inte längre kan sköta sina angelägenheter, enligt lagen (2017:310) om framtidsfullmakter 1 och 9 §§. Framtidsfullmakten har dessutom formkrav: skriftlig och undertecknad i två vittnens samtidiga närvaro.',
  },
  {
    q: 'Godkänner banken min generalfullmakt?',
    a: 'Var beredd på nej. De flesta banker kräver sin egen fullmaktsblankett för konto- och betalningsåtgärder, eftersom de måste identifiera dig och ombudet och registrera behörigheten i sina system. Generalfullmakten fungerar som underlag och viljeyttring, men ring bankkontoret och fråga vad som krävs innan du planerar något runt den.',
  },
  {
    q: 'Kan ombudet använda mitt BankID med en generalfullmakt?',
    a: 'Nej. BankID är en personlig elektronisk legitimation som enligt utfärdarnas villkor inte får överlåtas eller användas av någon annan, och ingen fullmakt ändrar det. Lämnar du ut dina koder kan du dessutom bli ansvarig för vad som görs med dem. Ombudet ska ha egen behörighet registrerad hos banken eller myndigheten.',
  },
  {
    q: 'Måste en generalfullmakt bevittnas?',
    a: 'Nej, avtalslagen kräver inte vittnen för en vanlig fullmakt. Gör det ändå. Bevittning höjer bevisvärdet om någon senare ifrågasätter underskriften eller fullmaktsgivarens förståelse, och många motparter frågar efter det. Använd två myndiga vittnen som inte berörs av fullmakten och skriv ut deras kontaktuppgifter.',
  },
  {
    q: 'Slutar generalfullmakten gälla om jag blir dement?',
    a: 'Rättsläget är oklart. Avtalslagen reglerar inte uttryckligen vad som händer med en vanlig fullmakt när fullmaktsgivaren varaktigt förlorar sin beslutsförmåga, och den osäkerheten lyfts fram i förarbetena till lagen om framtidsfullmakter. I praktiken slutar banker och myndigheter godta fullmakten. Vill du täcka den situationen behöver du en framtidsfullmakt.',
  },
  {
    q: 'Hur återkallar jag en generalfullmakt?',
    a: 'Begär tillbaka originalet och förstör det – det är grundregeln för en skriftlig fullmakt. Meddela sedan ombudet skriftligt och informera de motparter som känner till fullmakten, så att de slutar godta den. Spara kopior på meddelandena. Går originalet inte att få tillbaka kan fullmakten behöva förklaras kraftlös.',
  },
  {
    q: 'Gäller fullmakten efter min död?',
    a: 'Enligt avtalslagen 21 § gäller en fullmakt i regel även efter fullmaktsgivarens död, om inte särskilda omständigheter medför att den ska anses förfallen. I praktiken slutar banker och andra motparter ändå att godta den, eftersom tillgångarna nu ingår i ett dödsbo som delägarna förfogar över gemensamt.',
  },
  {
    q: 'Kan en generalfullmakt användas för att sälja min bostad?',
    a: 'Möjligen, men gör det inte. En fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska enligt avtalslagen 27 § andra stycket vara skriftlig, och mäklare, bostadsrättsförening och bank vill se en fullmakt som uttryckligen nämner objektet, priset och rätten att underteckna överlåtelseavtalet. Skriv en särskild säljfullmakt i stället.',
  },
]

const relatedTemplates = [
  { name: 'Generalfullmakt för privatperson', href: '/mallar/ekonomi-myndigheter/generalfullmakt-privatperson-2026', note: 'Den breda mallen – fyll i och skriv under.' },
  { name: 'Begränsad fullmakt', href: '/mallar/ekonomi-myndigheter/begransad-fullmakt', note: 'När uppdraget är avgränsat i tid eller ärende.' },
  { name: 'Framtidsfullmakt 2026 – komplett mall', href: '/mallar/seniorer-omsorg/framtidsfullmakt-komplett-2026', note: 'Träder i kraft vid beslutsoförmåga.' },
  { name: 'Ömsesidig framtidsfullmakt för makar', href: '/mallar/seniorer-omsorg/framtidsfullmakt-omsesidig-makar', note: 'Två framtidsfullmakter i ett dokumentpaket.' },
  { name: 'Fullmakt för bankärenden', href: '/mallar/ekonomi-myndigheter/fullmakt-bank', note: 'Komplement till bankens egen blankett.' },
  { name: 'Guide: fullmakt vid bostadsförsäljning', href: '/fullmakt-salja-bostadsratt', note: 'Ska bostaden säljas krävs en särskild säljfullmakt.' },
]

const sources = [
  { label: 'Lag (1915:218) om avtal och andra rättshandlingar på förmögenhetsrättens område', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1915218-om-avtal-och-andra-rattshandlingar_sfs-1915-218/' },
  { label: 'Lag (2017:310) om framtidsfullmakter', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017310-om-framtidsfullmakter_sfs-2017-310/' },
  { label: 'Prop. 2016/17:30 Framtidsfullmakter – en ny form av ställföreträdarskap för vuxna', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/framtidsfullmakter-en-ny-form-av_h40330/html/' },
]

export default function GeneralfullmaktPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://fullmakt24.se' },
      { '@type': 'ListItem', position: 2, name: 'Generalfullmakt', item: URL },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Generalfullmakt – mall och guide 2026',
    description: DESCRIPTION,
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    inLanguage: 'sv-SE',
    author: { '@type': 'Organization', name: 'Fullmakt24.se' },
    publisher: { '@type': 'Organization', name: 'Fullmakt24.se', url: 'https://fullmakt24.se' },
    mainEntityOfPage: URL,
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="section-padding py-10 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-navy-600">Hem</Link><span>/</span>
        <span className="text-navy-600 font-medium">Generalfullmakt</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📜</span>
          <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-1 rounded-full">Ekonomi, Bank &amp; Myndigheter</span>
          <span className="text-sm text-navy-400">8 min läsning</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-5">
          Generalfullmakt – mall och guide 2026
        </h1>

        <p className="text-lg text-navy-500 leading-relaxed mb-4">
          En generalfullmakt är den bredaste fullmakt du kan skriva: ett dokument där du ger någon annan
          rätt att företräda dig i i princip alla dina angelägenheter. Den är enkel att upprätta och
          används flitigt – och just därför är det värt att veta vad den faktiskt duger till.
        </p>
        <p className="text-lg text-navy-500 leading-relaxed mb-8">
          Kortversionen: en generalfullmakt fungerar bra under avgränsad tid, för någon som är fullt
          beslutskapabel och vill slippa vara på plats. Den fungerar sämre än folk tror mot banker, den ger
          ingen tillgång till BankID, och den är fel verktyg om syftet är att någon ska kunna hjälpa dig
          den dag du inte längre kan bestämma själv. Här går vi igenom var gränserna går – och vilket
          dokument du egentligen borde skriva.
        </p>

        {sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">{section.heading}</h2>
            {section.paragraphs?.map((p, j) => (
              <p key={j} className="text-navy-500 leading-relaxed mb-3">{p}</p>
            ))}
            {section.listHeading && (
              <h3 className="font-semibold text-navy-600 mt-4 mb-2">{section.listHeading}</h3>
            )}
            {section.list && (
              <ul className="space-y-2 mt-2">
                {section.list.map((item, j) => (
                  <li key={j} className="flex gap-3 text-navy-500 leading-relaxed">
                    <span className="text-gold-500 shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.list2Heading && (
              <h3 className="font-semibold text-navy-600 mt-6 mb-2">{section.list2Heading}</h3>
            )}
            {section.list2 && (
              <ul className="space-y-2 mt-2">
                {section.list2.map((item, j) => (
                  <li key={j} className="flex gap-3 text-navy-500 leading-relaxed">
                    <span className="text-gold-500 shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.after?.map((p, j) => (
              <p key={j} className="text-navy-500 leading-relaxed mt-3">{p}</p>
            ))}
          </section>
        ))}

        {/* CTA */}
        <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 my-10">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-2">Färdig mall att fylla i</h2>
          <p className="text-navy-400 leading-relaxed mb-5">
            Generalfullmakten för privatperson har befogenheter, giltighetstid och vittnesrader förberedda.
            Du fyller i uppgifterna, laddar ner som PDF och skriver under. 99 kr per dokument.
          </p>
          <Link href="/mallar/ekonomi-myndigheter/generalfullmakt-privatperson-2026" className="btn-gold inline-flex items-center gap-2">
            Generalfullmakt för privatperson
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>

        {/* Relaterade mallar */}
        <div className="mb-10">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Relaterade mallar och guider</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {relatedTemplates.map(t => (
              <li key={t.href}>
                <Link href={t.href} className="card p-4 block hover:shadow-lg transition-shadow h-full">
                  <span className="font-semibold text-navy-600 text-sm block mb-1">{t.name}</span>
                  <span className="text-xs text-navy-400">{t.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Vanliga frågor</h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <div key={i} className="card p-5">
                <h3 className="font-semibold text-navy-600 text-sm mb-2">{f.q}</h3>
                <p className="text-sm text-navy-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Källor */}
        <div className="mb-8">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-3">Källor</h2>
          <p className="text-sm text-navy-400 leading-relaxed mb-3">
            Paragrafhänvisningarna ovan är kontrollerade mot lagtext och förarbeten hos Sveriges riksdag.
            Där vi inte kunnat verifiera en exakt paragraf beskriver vi regeln utan paragrafnummer.
          </p>
          <ul className="space-y-1.5">
            {sources.map(s => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gold-600 hover:text-gold-700">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-navy-100 pt-6 mt-10 text-sm text-navy-400">
          <p>
            Den här guiden är allmän information utformad enligt svensk rätt och utgör inte individuell
            juridisk rådgivning. Rör frågan ett dödsbo med flera delägare, en pågående tvist, nedsatt
            beslutsförmåga eller utländska förhållanden bör du anlita en jurist innan du undertecknar något.
          </p>
          <p className="mt-3">
            <Link href="/blogg" className="text-gold-600 hover:text-gold-700 font-medium">← Fler guider</Link>
          </p>
        </div>
      </article>
    </div>
  )
}
