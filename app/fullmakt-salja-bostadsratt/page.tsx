import type { Metadata } from 'next'
import Link from 'next/link'

const URL = 'https://fullmakt24.se/fullmakt-salja-bostadsratt'
const TITLE = 'Fullmakt sälja bostadsrätt, lägenhet eller hus – mall 2026'
const DESCRIPTION =
  'Så skriver du en fullmakt för att sälja bostadsrätt, lägenhet eller hus: vad den måste innehålla, bevittning, lägsta pris och vad mäklaren kontrollerar. Mall 99 kr, PDF direkt.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'fullmakt sälja bostadsrätt',
    'fullmakt sälja bostadsrätt mall',
    'fullmakt försäljning lägenhet',
    'fullmakt sälja lägenhet',
    'fullmakt sälja hus mall',
    'fullmakt försäljning bostadsrätt',
    'säljfullmakt bostad',
    'fullmakt mäklare',
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
    heading: 'När behövs en fullmakt vid bostadsförsäljning?',
    paragraphs: [
      'En fullmakt behövs inte för att lagen kräver ett ombud vid bostadsaffärer. Den behövs för att en konkret handling ska kunna utföras av någon annan än ägaren – oftast en underskrift, en viss dag, på en viss plats. Fyra situationer står för det stora flertalet.',
    ],
    list: [
      'Säljaren bor utomlands. Kontraktsskrivning, tillträde och nyckelöverlämning ligger ofta med veckors mellanrum. Att flyga hem tre gånger är varken praktiskt eller billigt; ett ombud på plats löser det.',
      'Dödsbo. Ett dödsbo agerar bara genom sina delägare, och de måste vara eniga. I praktiken utser delägarna en av sig själva till ombud genom en fullmakt som samtliga skriver under.',
      'Äldre anhörig. Föräldern äger bostaden, bestämmer fortfarande själv och vill sälja, men orkar inte med visningar och kontraktsmöten. Har föräldern förlorat sin beslutsförmåga är det en annan fråga – se avsnittet om giltighetstid.',
      'Flera ägare, en på plats. Två sambor äger hälften var, men bara den ena kan komma till kontraktsskrivningen. Den andra ger fullmakt. Vanligt och oproblematiskt, så länge fullmakten är tydlig.',
    ],
    after: [
      'Gemensamt för alla fyra: mäklaren ber om fullmakten i god tid före kontraktsskrivningen, inte samma morgon. Räkna med att den ska vara framme minst en vecka innan.',
    ],
  },
  {
    heading: 'Bostadsrätt eller hus – skillnaden avgör vad som gäller',
    paragraphs: [
      'Juridiskt är det här inte samma sak. En villa, ett fritidshus eller en tomt är fast egendom. En bostadsrätt är det inte – den är en andel i en ekonomisk förening med nyttjanderätt till en viss lägenhet, och räknas som lös egendom. En hyresrätt säljs inte alls; den överlåts genom byte eller med hyresvärdens godkännande.',
      'För fast egendom finns ett uttryckligt formkrav på själva fullmakten. Avtalslagen (1915:218) 27 § andra stycket säger att en fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig. En muntlig fullmakt att sälja ett hus är alltså inte giltig. Samma paragraf hänvisar till 16 och 17 §§ för hur en sådan fullmakt återkallas eller förklaras kraftlös.',
      'Köpehandlingen har egna formkrav i jordabalken (1970:994) 4 kap. 1 §: köpet sluts genom en köpehandling som skrivs under av säljaren och köparen, och den ska innehålla uppgift om köpeskillingen och en förklaring från säljaren att egendomen överlåts på köparen. Skriver ombudet under i säljarens ställe är det fullmakten som bär hela affären.',
      'För bostadsrätt gäller inte 27 § andra stycket formellt – skriftlighetskravet där är skrivet för fast egendom. Men slutsatsen "då räcker en muntlig fullmakt" är fel i praktiken. Bostadsrättslagen (1991:614) 6 kap. 4 § kräver att ett avtal om överlåtelse av en bostadsrätt genom köp upprättas skriftligen och skrivs under av säljaren och köparen, med uppgift om lägenheten och om ett pris. Mäklaren, föreningen och banken godtar aldrig ett muntligt påstående om att någon får skriva under åt en annan. Skriftlig fullmakt är därför ett absolut krav i verkligheten.',
    ],
  },
  {
    heading: 'Vad fullmakten måste innehålla',
    paragraphs: [
      'En fullmakt som stoppar en affär är nästan alltid för vag. Mäklarens uppgift är inte att gissa vad fullmaktsgivaren menade – står det inte i dokumentet finns det inte.',
    ],
    list: [
      'Parterna. Fullmaktsgivarens och ombudets fullständiga namn, personnummer och adress. Namn ensamt duger inte som identifiering.',
      'Objektet, exakt. För bostadsrätt: föreningens namn och organisationsnummer, lägenhetsnumret och adressen. För fastighet: fastighetsbeteckningen med kommun, till exempel "Sundbyberg Lyktan 3", plus gatuadressen. "Min lägenhet" duger inte.',
      'Priset. Ett lägsta accepterat pris i kronor, eller en uttrycklig rätt att sälja till fritt pris. Se nästa avsnitt.',
      'Rätt att underteckna överlåtelseavtalet. Skriv ut vilka handlingar som omfattas: köpekontrakt, för fastighet även köpebrev, likvidavräkning och överlåtelseanmälan till föreningen.',
      'Tillträde och nycklar. Rätt att komma överens om tillträdesdag, göra avflyttningsbesiktning, läsa av mätare och lämna över nycklar.',
      'Likviden. Ange till vilket konto köpeskillingen ska betalas – normalt fullmaktsgivarens eget. Ge inte ombudet rätt att ta emot pengarna på sitt eget konto utan mycket goda skäl.',
      'Kontakterna. Rätt att företräda dig gentemot mäklaren, bostadsrättsföreningen, köparen, banken som ska lösa lånen och, för fastighet, inskrivningsmyndigheten.',
      'Formalia. Giltighetstid, ort, datum, underskrift med namnförtydligande – och plats för två vittnen.',
    ],
  },
  {
    heading: 'Lägsta pris eller fritt pris',
    paragraphs: [
      'Det här är det enda valet i fullmakten som verkligen kan kosta dig pengar.',
      'Sätter du ett lägsta pris får ombudet inte skriva under den nivån. Du är skyddad mot underpris, men affären kan stanna: kommer högsta budet in några tusenlappar under gränsen måste ombudet få tag på dig, och sitter du på andra sidan jordklotet kan budgivaren hinna ändra sig.',
      'Skriver du i stället att ombudet får sälja till fritt pris blir affären smidig, men du lägger stor makt i någon annans händer. En mellanväg som fungerar bra: ange ett lägsta pris och lägg till att ombudet får acceptera ett lägre bud efter din uttryckliga bekräftelse. Ta beslutet innan objektet går ut i marknadsföring, inte mitt under en budgivning.',
    ],
  },
  {
    heading: 'Bevittning – vad lagen kräver och vad praktiken kräver',
    paragraphs: [
      'Ingen bestämmelse i avtalslagen kräver vittnen på en fullmakt. Kravet i 27 § andra stycket är skriftlighet, inget mer. Bevittna ändå, av två skäl.',
      'Det första är praktiskt: mäklare och banker vill se bevittnade underskrifter, och en obevittnad fullmakt leder ofta till en extra vända dagarna före kontraktsskrivning.',
      'Det andra gäller fast egendom. Huvudregeln för att lagfart ska beviljas är att överlåtarens underskrift på fångeshandlingen är styrkt av två vittnen. Skriver ett ombud under åt säljaren är det ombudets underskrift som ska bevittnas, och inskrivningsmyndigheten vill dessutom se fullmakten, normalt i original. Är kedjan otydlig kan lagfartsansökan förklaras vilande tills bristerna är avhjälpta.',
      'Vittnena ska vara två myndiga personer, båda närvarande vid underskriften, och får inte vara ombudet, köparen eller någon annan med del i affären. Skriv ut namn, personnummer och telefonnummer – ett vittne som inte går att nå är i praktiken inget vittne.',
    ],
  },
  {
    heading: 'Mäklaren kontrollerar ombudets behörighet',
    paragraphs: [
      'Många blir överraskade av hur noga mäklaren granskar en fullmakt. Det beror inte på misstänksamhet utan på att kontrollen är mäklarens lagstadgade uppgift.',
      'Enligt fastighetsmäklarlagen (2021:516) 3 kap. 1 § ska en fastighetsmäklare utföra sitt uppdrag omsorgsfullt och i allt iaktta god fastighetsmäklarsed. I 3 kap. 13 § finns kontrollskyldigheten: mäklaren ska kontrollera vem som har rätt att förfoga över fastigheten och vilka inteckningar, servitut och andra rättigheter som belastar den. Vid förmedling av en bostadsrätt gäller motsvarande – vem som får förfoga över bostadsrätten och om den är pantsatt.',
      'Ett ombud som dyker upp med ett papper är alltså något mäklaren måste bedöma, inte bara ta emot. Räkna med att mäklaren vill ha fullmakten i original eller som en komplett skanning, en kopia av fullmaktsgivarens legitimation och möjlighet att ringa och bekräfta uppdraget. Vid dödsbo tillkommer registrerad bouppteckning – eller dödsfallsintyg med släktutredning – och en fullmakt undertecknad av samtliga delägare.',
      'Skicka allt i god tid. Den vanligaste orsaken till att en kontraktsskrivning skjuts upp är inte att fullmakten är fel, utan att den kom fram för sent för att hinna kontrolleras.',
    ],
  },
  {
    heading: 'Giltighetstid och återkallelse',
    paragraphs: [
      'Sätt en bortre gräns. "Gäller tills vidare" på ett dokument som ger någon rätt att sälja din bostad är onödigt riskabelt. Använd ett kalenderdatum, eller "till dess försäljningen är fullbordad och tillträde skett" – det senare är oftast smidigast, eftersom bostadsaffärer gärna drar ut på tiden.',
      'Vill du återkalla en skriftlig fullmakt är grundregeln att du tar tillbaka och förstör handlingen. Avtalslagens 27 § andra stycket hänvisar till 16 och 17 §§ för återkallelse och kraftlöshetsförklaring av fullmakter som rör fast egendom. Det räcker inte att säga till ombudet: meddela också mäklaren och, om ett kontrakt är på gång, köparen – skriftligt, och spara meddelandet.',
      'Om fullmaktsgivaren avlider gäller fullmakten enligt avtalslagen 21 § ändå, om inte särskilda omständigheter medför att den ska anses förfallen. I verkligheten stoppar mäklare och bank ändå affären, eftersom bostaden nu ingår i ett dödsbo som delägarna förfogar över gemensamt. Räkna med en ny fullmakt från samtliga delägare.',
      'Får fullmaktsgivaren en förvaltare enligt föräldrabalken följer av avtalslagen 22 § att en rättshandling som ombudet företar, och som omfattas av förvaltarens uppdrag, inte får större verkan än om fullmaktsgivaren själv hade företagit den.',
      'Vad som gäller när fullmaktsgivaren varaktigt förlorar sin beslutsförmåga utan att få förvaltare är däremot inte uttryckligen reglerat i avtalslagen. Den osäkerheten var ett av skälen till att lagen (2017:310) om framtidsfullmakter infördes. Ska fullmakten fungera även om ägaren blir svårt sjuk: upprätta en framtidsfullmakt i stället för, eller vid sidan av, den vanliga fullmakten.',
    ],
  },
  {
    heading: 'Passar det här dig?',
    listHeading: 'En mall räcker gott när:',
    list: [
      'Du äger bostaden själv, eller tillsammans med någon som också skriver under, och ni är överens.',
      'Du är beslutskapabel och vet exakt vad ombudet ska få göra.',
      'Det handlar om ett objekt, en normal försäljning på öppna marknaden och ett ombud du litar på.',
      'Det är ett dödsbo där samtliga delägare är eniga och undertecknar samma fullmakt.',
    ],
    list2Heading: 'Ta juridisk hjälp när:',
    list2: [
      'Dödsboet har flera delägare som inte är överens, eller där någon delägare är omyndig eller har god man – då är överförmyndaren och i förlängningen tingsrätten inblandade.',
      'Det pågår en tvist om bostaden, till exempel en skilsmässa där bodelningen inte är klar.',
      'Säljaren har förlorat sin beslutsförmåga. En vanlig fullmakt är då fel verktyg – det som gäller är framtidsfullmakt, god man eller förvaltare.',
      'Det finns utländska förhållanden: säljaren undertecknar utomlands, fullmakten ska användas i ett annat land, eller bostaden ligger utomlands. Krav på notarisering, apostille och översättning varierar kraftigt mellan länder.',
      'Överlåtelsen i själva verket är en gåva eller ett generationsskifte. Då är skatte- och arvsfrågorna viktigare än fullmakten.',
    ],
    after: [
      'I de fallen är en timme hos en jurist billig försäkring i förhållande till vad en bostadsaffär är värd.',
    ],
  },
]

const faq = [
  {
    q: 'Måste en fullmakt för att sälja en bostadsrätt vara skriftlig?',
    a: 'Skriftlighetskravet i avtalslagen 27 § andra stycket är skrivet för fast egendom och gäller formellt inte bostadsrätter. I praktiken krävs skriftlig fullmakt ändå: mäklaren ska enligt fastighetsmäklarlagen kontrollera vem som får förfoga över bostadsrätten, föreningen ska notera överlåtelsen och banken ska lösa lånet. Ingen av dem godtar en muntlig fullmakt. Skriv alltid.',
  },
  {
    q: 'Krävs vittnen på fullmakten?',
    a: 'Ingen lag kräver vittnen på själva fullmakten. Gör det ändå. Mäklare och banker vill se bevittnade underskrifter, och vid försäljning av fast egendom är huvudregeln för lagfart att överlåtarens underskrift på fångeshandlingen är styrkt av två vittnen. Använd två myndiga vittnen som inte är part i affären och skriv ut deras kontaktuppgifter.',
  },
  {
    q: 'Kan jag ge fullmakt till mäklaren själv?',
    a: 'Det bör du undvika. Mäklaren ska vara en opartisk mellanman som tar tillvara både säljarens och köparens intressen. Att samtidigt vara säljarens ombud med rätt att bestämma pris och skriva under skapar en uppenbar intressekonflikt. Välj en anhörig, en vän eller ett juridiskt ombud i stället.',
  },
  {
    q: 'Vad ska stå om priset i fullmakten?',
    a: 'Antingen ett lägsta accepterat pris i kronor, eller en uttrycklig rätt för ombudet att sälja till fritt pris. Att vara tyst om priset är det sämsta alternativet – då får ombudet och mäklaren tolka, och du har ingen kontroll. En bra mellanväg är lägsta pris plus rätt att gå under det efter din uttryckliga bekräftelse.',
  },
  {
    q: 'Vi är tre syskon i ett dödsbo – hur gör vi?',
    a: 'Ett dödsbo förfogar över bostaden gemensamt. Skriv en fullmakt som samtliga dödsbodelägare undertecknar och som utser en av er till ombud. Mäklaren vill dessutom se registrerad bouppteckning, eller dödsfallsintyg med släktutredning innan bouppteckningen är klar. Är ni oense – ta juridisk hjälp innan objektet läggs ut.',
  },
  {
    q: 'Gäller fullmakten om jag blir sjuk?',
    a: 'Det är osäkert, och det är just därför framtidsfullmakter finns. Avtalslagen reglerar inte uttryckligen vad som händer med en vanlig fullmakt när fullmaktsgivaren varaktigt förlorar sin beslutsförmåga. Vill du att någon ska kunna sälja bostaden i det läget ska du upprätta en framtidsfullmakt enligt lagen (2017:310) – skriftligen och undertecknad i två vittnens samtidiga närvaro.',
  },
  {
    q: 'Hur återkallar jag fullmakten?',
    a: 'Ta tillbaka och förstör originalet – det är grundregeln för en skriftlig fullmakt. Meddela sedan ombudet, mäklaren och en eventuell köpare skriftligt, och spara meddelandena. Går originalet inte att få tillbaka finns möjligheten att få fullmakten förklarad kraftlös; avtalslagen 27 § andra stycket hänvisar till 16 och 17 §§ för det.',
  },
  {
    q: 'Jag bor utomlands – kan jag skriva under fullmakten där?',
    a: 'Ja. Underskriften kan ske utomlands, men ordna bevittning på plats och fråga mäklaren i förväg vad de kräver. Ska fullmakten användas vid en fastighetsaffär vill inskrivningsmyndigheten normalt se originalet. Vid utländska förhållanden kan notarisering, apostille och auktoriserad översättning tillkomma – räkna med extra tid.',
  },
]

const relatedTemplates = [
  { name: 'Fullmakt för bostadsförsäljning', href: '/mallar/boende-vardag/fullmakt-bostadsforsaljning', note: 'Generell säljfullmakt för bostad.' },
  { name: 'Fullmakt för försäljning av lägenhet', href: '/mallar/boende-vardag/fullmakt-hyreslagenh-forsalj-2026', note: 'Skriven för bostadsrätt och lägenhet.' },
  { name: 'Fullmakt fastighetsförsäljning villa', href: '/mallar/boende-vardag/fullmakt-fastighetsforsaljning-villa', note: 'För villa, tomt och fritidshus.' },
  { name: 'Fullmakt för bostadsköp', href: '/mallar/boende-vardag/fullmakt-bostadskop', note: 'När ombudet ska köpa i stället för sälja.' },
  { name: 'Fullmakt till BRF-stämma', href: '/mallar/boende-vardag/fullmakt-bostadsratt-stamma-2026', note: 'Företräda dig på föreningsstämman.' },
  { name: 'Fullmakt vid lägenhetsbyte', href: '/mallar/boende-vardag/fullmakt-lagenhetsbyte', note: 'För byte i stället för försäljning.' },
  { name: 'Fullmakt hyresrätt överlåtelse', href: '/mallar/boende-vardag/fullmakt-hyresratt-overlatelse-2026', note: 'Hyresrätter säljs inte – de överlåts.' },
  { name: 'Fullmakt försäljning lantbruksfastighet', href: '/mallar/boende-vardag/fullmakt-forsaljning-lantbruk', note: 'Gård, skog och jordbruksmark.' },
  { name: 'Fullmakt tomträtt', href: '/mallar/boende-vardag/fullmakt-tomtratt-ombud', note: 'Tomträtt har egna regler.' },
  { name: 'Fullmakt fastighetsavstyckning', href: '/mallar/boende-vardag/fullmakt-fastighetsavstyckning', note: 'När en del av fastigheten ska styckas av.' },
  { name: 'Fullmakt utländsk fastighet', href: '/mallar/ekonomi-myndigheter/fullmakt-utlandsk-fastighet', note: 'Bostad utomlands – extra krav gäller.' },
]

const sources = [
  { label: 'Lag (1915:218) om avtal och andra rättshandlingar på förmögenhetsrättens område', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1915218-om-avtal-och-andra-rattshandlingar_sfs-1915-218/' },
  { label: 'Jordabalk (1970:994)', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jordabalk-1970994_sfs-1970-994/' },
  { label: 'Bostadsrättslag (1991:614)', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/bostadsrattslag-1991614_sfs-1991-614/' },
  { label: 'Fastighetsmäklarlag (2021:516)', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/fastighetsmaklarlag-2021516_sfs-2021-516/' },
  { label: 'Lag (2017:310) om framtidsfullmakter', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017310-om-framtidsfullmakter_sfs-2017-310/' },
]

export default function FullmaktSaljaBostadsrattPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://fullmakt24.se' },
      { '@type': 'ListItem', position: 2, name: 'Fullmakt vid bostadsförsäljning', item: URL },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Fullmakt för att sälja bostadsrätt, lägenhet eller hus – mall 2026',
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
        <span className="text-navy-600 font-medium">Fullmakt vid bostadsförsäljning</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-1 rounded-full">Boende &amp; Vardag</span>
          <span className="text-sm text-navy-400">9 min läsning</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-5">
          Fullmakt för att sälja bostadsrätt, lägenhet eller hus – mall 2026
        </h1>

        <p className="text-lg text-navy-500 leading-relaxed mb-4">
          Det här är en av de vanligaste frågorna vi får: bostaden ska säljas, men den som äger den kan
          inte vara på plats när kontraktet skrivs under. Kanske bor säljaren i Spanien halva året. Kanske
          är det ett dödsbo där tre syskon bor i tre olika städer. Kanske är det en äldre förälder som
          fortfarande bestämmer själv, men som inte orkar med visningar och kontraktsmöten.
        </p>
        <p className="text-lg text-navy-500 leading-relaxed mb-8">
          Lösningen är en fullmakt: ett skriftligt dokument där ägaren ger någon annan rätt att företräda
          sig i affären. Den här guiden går igenom vad fullmakten måste innehålla för att mäklaren,
          bostadsrättsföreningen och banken faktiskt ska godta den, varför reglerna skiljer sig mellan en
          bostadsrätt och ett hus, och var det brukar gå fel. Vi säger också rakt ut när du inte ska nöja
          dig med en mall.
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
            Vi har mallar för både bostadsrätt och fast egendom, med fälten ovan förifyllda. Du anger
            objekt, pris och befogenheter, laddar ner som PDF och skriver under. 99 kr per dokument.
          </p>
          <Link href="/mallar/boende-vardag/fullmakt-hyreslagenh-forsalj-2026" className="btn-gold inline-flex items-center gap-2">
            Fullmakt för försäljning av lägenhet
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>

        {/* Relaterade mallar */}
        <div className="mb-10">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Mallar för bostads- och fastighetsaffärer</h2>
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
            Paragrafhänvisningarna ovan är kontrollerade mot lagtexten hos Sveriges riksdag. Där vi inte
            kunnat verifiera en exakt paragraf beskriver vi regeln utan paragrafnummer.
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
            juridisk rådgivning. Rör affären ett dödsbo med flera delägare, en pågående tvist eller
            utländska förhållanden bör du anlita en jurist innan du undertecknar något.
          </p>
          <p className="mt-3">
            <Link href="/blogg" className="text-gold-600 hover:text-gold-700 font-medium">← Fler guider</Link>
          </p>
        </div>
      </article>
    </div>
  )
}
