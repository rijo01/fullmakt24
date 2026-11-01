import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

const URL = 'https://fullmakt24.se/framtidsfullmakt'
const TITLE = 'Framtidsfullmakt – mall och guide 2026'
const DESCRIPTION =
  'Så fungerar en framtidsfullmakt: formkrav, vem som får vara vittne, när den träder i kraft och vad banken kräver i praktiken. Guide plus mall – 99 kr, PDF direkt.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'framtidsfullmakt',
    'framtidsfullmakt mall',
    'framtidsfullmakt vittnen',
    'framtidsfullmakt bank',
    'framtidsfullmakt tingsrätt',
    'anhörigbehörighet',
    'framtidsfullmakt eller god man',
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
  paragraphs?: ReactNode[]
  list?: string[]
  listHeading?: string
  list2Heading?: string
  list2?: string[]
  after?: string[]
}

const sections: Section[] = [
  {
    heading: 'Vad en framtidsfullmakt är och när den behövs',
    paragraphs: [
      'En framtidsfullmakt skriver du i dag, men den är tänkt att användas först den dag du inte längre kan sköta dina egna angelägenheter. Lagen (2017:310) om framtidsfullmakter beskriver situationen i 1 §: att fullmaktsgivaren på grund av sjukdom, psykisk störning, försvagat hälsotillstånd eller något liknande förhållande varaktigt och i huvudsak inte längre har förmåga att ha hand om de angelägenheter som fullmakten avser.',
      'Oftast handlar det om demens, men det kan lika gärna vara en stroke eller en olycka. Tidpunkten går inte att planera. Det du kan bestämma är vem som tar över och hur mycket hen får göra.',
      'Enligt 2 § får fullmakten omfatta både ekonomiska och personliga angelägenheter: räkningar, bank, försäkringar, bostad, hemtjänst och boende. Den får inte omfatta vård och tandvård (åtgärder enligt hälso- och sjukvårdslagen och tandvårdslagen), och inte frågor av utpräglat personlig karaktär, som att gifta sig eller skriva testamente.',
    ],
  },
  {
    heading: 'Skillnaden mot en vanlig fullmakt och generalfullmakt',
    paragraphs: [
      'En vanlig fullmakt enligt avtalslagen – till exempel en generalfullmakt – gäller från den dag du skriver den, och bygger på att du själv kan följa vad ombudet gör. Vad som händer med den när du varaktigt förlorar din förmåga säger avtalslagen inte uttryckligen, och rättsläget är oklart. Banker och myndigheter slutar ofta godta den när de får veta hur det ligger till.',
      'Framtidsfullmakten är vilande tills beslutsoförmågan inträder, och har då uttryckligt stöd i lag – med regler om jäv, gåvor, arvode och redovisning som en vanlig fullmakt saknar.',
      <>
        Många har båda: en vanlig fullmakt för i dag, medan de själva kan hålla koll, och en
        framtidsfullmakt för den dag de inte kan. Vad en generalfullmakt klarar och inte klarar går vi
        igenom i guiden om{' '}
        <Link href="/generalfullmakt" className="text-gold-600 hover:text-gold-700 font-medium">
          generalfullmakt
        </Link>
        .
      </>,
    ],
  },
  {
    heading: 'Anhörigbehörighet, god man och förvaltare',
    paragraphs: [
      'Har du ingen framtidsfullmakt står de närmaste inte helt utan verktyg. Enligt föräldrabalken 17 kap. 1 § gäller att om det är uppenbart att någon inte längre har förmåga att ha hand om sina ekonomiska angelägenheter, är en anhörig behörig att vidta ordinära rättshandlingar med anknytning till dennes dagliga livsföring. Turordningen står i 2 §: make eller sambo, barn, barnbarn, föräldrar, syskon och syskonbarn.',
      'Behörigheten räcker till hyran, räkningarna och vardagen, men inte till att sälja en bostad eller flytta om större tillgångar. Den gäller inte heller där personen redan företräds av en god man, förvaltare eller framtidsfullmaktshavare (3 §).',
      'Räcker inte det blir nästa steg god man eller förvaltare. Ett godmanskap ska anordnas för den som på grund av sjukdom eller liknande behöver hjälp med sina ekonomiska eller personliga angelägenheter, om behovet inte kan tillgodoses på ett mindre ingripande sätt (föräldrabalken 11 kap. 4 §). Sedan den 1 juli 2026 prövas frågan av överförmyndaren (11 kap. 4 a §). Förvaltarskap beslutar rätten, och bara om godmanskap inte räcker (11 kap. 7 §). Med förvaltare får du, enligt Sveriges Domstolar, inte längre själv ingå avtal eller hantera dina pengar.',
      'Skillnaden är vem som väljer. En god man eller förvaltare utses av överförmyndaren eller rätten och kan vara någon du aldrig träffat. Och i den utsträckning godmanskap eller förvaltarskap anordnas saknar framtidsfullmakten verkan (27 § lagen om framtidsfullmakter).',
    ],
  },
  {
    heading: 'Formkrav: skriftlighet, vittnen och din förmåga',
    paragraphs: [
      'Det är formkraven som oftast fäller en framtidsfullmakt, och de går inte att förhandla bort. Enligt 9 § träder fullmakten i kraft om den uppfyller kraven i 3 och 4 §§ – uppfylls de inte är dokumentet ingen framtidsfullmakt, hur väl innehållet än är formulerat.',
      'Din förmåga. Den som har fyllt 18 år och har förmåga att ha hand om sina angelägenheter får upprätta en framtidsfullmakt (3 §). Skriv den i god tid. Pågår en demensutredning, eller finns en diagnos, ta juridisk hjälp och be gärna din läkare om ett intyg om din förmåga när du skriver under. Det är inget lagkrav, men kan bli avgörande om fullmakten ifrågasätts.',
      'Skriftlighet och vittnen. Fullmakten ska vara skriftlig. Du ska i två vittnens samtidiga närvaro skriva under den eller intyga att du har skrivit under. Vittnena ska känna till att handlingen är en framtidsfullmakt och bekräfta den med sina underskrifter (4 §).',
      'Vem som får vara vittne. Fullmaktshavaren får inte vara vittne. I övrigt hänvisar 4 § till ärvdabalkens regler för testamentsvittnen. Enligt ärvdabalken 10 kap. 4 § första stycket får den som är under 15 år, eller som på grund av en psykisk störning saknar insikt om betydelsen av vittnesbekräftelsen, inte vara vittne. Inte heller din make eller sambo, den som står i rätt upp- eller nedstigande släktskap eller svågerlag till dig, eller ditt syskon. Barn, barnbarn, föräldrar, svärföräldrar, svärbarn och styvbarn är alltså uteslutna.',
      'Välj två vuxna utan koppling till familjen, och undvik även fullmaktshavarens närmaste. Enligt ärvdabalken 10 kap. 2 § första stycket, som också gäller här, bör vittnena anteckna yrke och hemvist och intyga tiden för bevittnandet och andra omständigheter av betydelse för giltigheten. Låt dem gärna också intyga att du skrev under vid sunt och fullt förstånd och av fri vilja, som i Svenska Bankföreningens blankett.',
      'Elektronisk underskrift. Sedan den 1 juli 2026 får du och vittnena skriva under elektroniskt, men bara med avancerad elektronisk underskrift enligt EU:s eIDAS-förordning (4 a §). Är du osäker på om en tjänst uppfyller kravet, skriv under på papper.',
    ],
  },
  {
    heading: 'Vad fullmakten bör innehålla',
    paragraphs: [
      'Enligt 5 § ska det framgå att det är en framtidsfullmakt, vem eller vilka som är fullmaktshavare, vilka angelägenheter fullmakten omfattar och vilka övriga villkor som gäller. Det är minimikraven. En fullmakt som fungerar i verkligheten innehåller mer.',
      'Fullmaktshavare och ersättare. Utse någon du litar på fullt ut – uppdraget kan pågå i många år – och gärna en ersättare om hen inte kan. Utser du två fullmaktshavare, skriv om de får agera var för sig eller bara tillsammans.',
      'Områden. "Alla mina ekonomiska och personliga angelägenheter" är tillåtet, men konkreta exempel – räkningar, bankkonton och placeringar, deklaration, avtal, myndighetskontakter, boende och hemtjänst – gör det lättare för bank och kommun. Ska bostaden kunna säljas, skriv det.',
      'Gåvor. Säger fullmakten inget om gåvor får fullmaktshavaren, till andra än sig själv, lämna personliga presenter vars värde inte står i missförhållande till dina ekonomiska villkor (18 §). Vill du att fullmaktshavaren ska kunna fortsätta ge pengar till barnbarnen, eller att något inte får ges bort alls, skriv det.',
      'Arvode. Fullmaktshavaren har rätt till arvode bara om det står i fullmakten. Står det att arvode utgår men inte hur mycket, får ett skäligt belopp tas ut (19 §).',
      'Granskare. Du får utse någon som granskar fullmaktshavarens verksamhet, och fullmaktshavaren ska redovisa för granskaren på begäran (23 §). Du kan också ge granskaren rätt att återkalla fullmakten (8 § andra stycket). Utser du ingen granskare kan din make eller sambo och dina närmaste släktingar begära redovisning, dock högst en gång per år (24 §). En granskare är särskilt värdefull om ett av flera syskon blir fullmaktshavare.',
      'Domstolsprövning. Du kan bestämma att tingsrätten ska pröva om fullmakten har trätt i kraft (9 § andra stycket). Det gör starten långsammare men tydligare.',
    ],
  },
  {
    heading: 'När och hur den träder i kraft – och tingsrättens roll',
    paragraphs: [
      'Fullmakten träder i kraft när din situation är den som beskrivs i 1 §. Det är fullmaktshavaren som bedömer om det har skett – inte du, och inte en myndighet. Undantaget är om fullmakten säger att domstol ska pröva saken, eller om fullmaktshavaren själv begär en prövning (9 §).',
      'När fullmaktshavaren bedömer att fullmakten har trätt i kraft ska hen snarast underrätta dig, din make eller sambo och dina närmaste släktingar, och granskaren om det finns en. Av underrättelsen ska det framgå att fullmakten har trätt i kraft och vad den innehåller (10 §).',
      'Går man via tingsrätten är det fullmaktshavaren som ansöker, till tingsrätten där du är folkbokförd (11 §). Fullmakten ska ges in i original eller bestyrkt kopia, tillsammans med kontaktuppgifter till dig och dina närmaste (12 §). Rätten ska inhämta ett läkarintyg eller likvärdig utredning om ditt hälsotillstånd, om det inte är uppenbart obehövligt, och du, dina närmaste och överförmyndaren ska få tillfälle att yttra sig (13 §). Sveriges Domstolar anger att det inte finns någon särskild blankett och att domstolen inte tar ut någon avgift för ansökan.',
      'Fördelen med domstolsvägen är bevisvärdet. Fullmaktshavarens egen bedömning räcker enligt lagen men kan ifrågasättas; ett beslut från tingsrätten är det tydligaste beskedet en bank kan få.',
    ],
  },
  {
    heading: 'Bank och myndigheter i praktiken',
    paragraphs: [
      'Banken gör en egen kontroll. Enligt Svenska Bankföreningens blankett för framtidsfullmakt måste banken, enligt lagen om åtgärder mot penningtvätt, kontrollera fullmaktshavarens identitet och behörighet att företräda dig. Fullmakten ska visas i original varje gång den används i banken, och bankerna förvarar den normalt inte. Räkna med att banken vill se något som styrker att fullmakten har trätt i kraft – ett läkarintyg eller ett beslut från tingsrätten – och att rutinerna skiljer sig mellan banker. Lagen kräver inget läkarintyg för att fullmaktshavaren ska få använda fullmakten, men banken avgör själv vad den behöver för att våga agera.',
      'Bankföreningen har en egen blankett, "Framtidsfullmakt för bankärenden". Enligt den ger fullmakten inte tillgång till digitala banktjänster, och den omfattar inte gåvor och arvode. Ett vanligt upplägg är att skriva en allmän framtidsfullmakt och fråga sin bank, i förväg, om den godtar den eller vill ha sin egen blankett ifylld också.',
      'BankID kan aldrig lämnas över. Fullmaktshavaren ska ha egen behörighet registrerad hos banken eller myndigheten – aldrig dina inloggningsuppgifter.',
      'Myndigheter som Skatteverket och Försäkringskassan har egna rutiner för ombud. Kontrollera vad som krävs innan det blir bråttom.',
      'Överförmyndaren har ingen närmare tillsyn över hur framtidsfullmakter används, men kan begära redovisning (25 §) och besluta att fullmakten helt eller delvis inte längre får användas vid missbruk eller allvarlig försummelse (26 §).',
    ],
  },
  {
    heading: 'Återkallelse och upphörande',
    paragraphs: [
      'En framtidsfullmakt kan inte göras oåterkallelig (6 §). För återkallelse gäller avtalslagen (8 §). En skriftlig fullmakt som du lämnat till fullmaktshavaren återkallar du genom att ta tillbaka eller förstöra handlingen (avtalslagen 16 §). Går den inte att få tillbaka kan tingsrätten förklara den kraftlös (17 §). Har du själv informerat en bank om fullmakten, meddela banken att den är återkallad.',
      'Återkalla medan du kan. En återkallelse är en rättshandling, och om din förmåga redan är ifrågasatt kan den i sin tur ifrågasättas. Ta juridisk hjälp i det läget.',
      'Vill du ändra fullmakten gäller samma formkrav som när den skrevs – utom när ändringen bara begränsar den (7 §).',
      'Fullmakten kan också sluta gälla utan att du gör något: om överförmyndaren förbjuder den (26 §), eller i den utsträckning god man eller förvaltare utses (27 §). Dör du efter att den trätt i kraft gäller avtalslagens regler (28 §), och enligt avtalslagen 21 § gäller en fullmakt i regel även efter fullmaktsgivarens död om inte särskilda omständigheter talar emot. I praktiken tar dödsboet över. Vill du att fullmakten ska upphöra vid din död, skriv det.',
    ],
  },
  {
    heading: 'Passar en framtidsfullmakt dig?',
    listHeading: 'Den passar när:',
    list: [
      'Du vill själv välja vem som tar över, i stället för att överförmyndaren eller rätten utser någon.',
      'Du har en person du litar på fullt ut, gärna med en ersättare.',
      'Din ekonomi är överskådlig: bostad, bankkonton, pension, kanske en fritidsfastighet i Sverige.',
      'Ni är ett par och vill utse varandra. Var och en ger då sin egen framtidsfullmakt.',
    ],
    list2Heading: 'Ta juridisk hjälp, eller välj något annat, när:',
    list2: [
      'Du har en stor förmögenhet, äger ett företag eller har fastigheter i flera länder.',
      'Det finns konflikter i familjen, eller risk för att någon kommer att ifrågasätta valet av fullmaktshavare.',
      'Din förmåga redan kan ifrågasättas. Då kan det vara för sent att skriva fullmakten på egen hand.',
      'Du har ingen du litar på. Då är god man via överförmyndaren ofta det tryggare alternativet.',
      'Syftet är att någon ska bestämma om din vård. Det kan ingen fullmakt omfatta.',
    ],
  },
]

const faq = [
  {
    q: 'När börjar en framtidsfullmakt gälla?',
    a: 'När du på grund av sjukdom, psykisk störning, försvagat hälsotillstånd eller liknande varaktigt och i huvudsak inte längre kan ha hand om det fullmakten gäller. Det är fullmaktshavaren som bedömer när det har skett, om du inte har skrivit i fullmakten att tingsrätten ska pröva saken, enligt lagen (2017:310) om framtidsfullmakter 1 och 9 §§.',
  },
  {
    q: 'Vem får vara vittne till en framtidsfullmakt?',
    a: 'Två personer som är minst 15 år och förstår vad de bekräftar. Fullmaktshavaren får inte vara vittne, och inte heller din make, sambo, syskon eller den som är släkt eller besvågrad med dig i rakt upp- eller nedstigande led (4 § och ärvdabalken 10 kap. 4 §). Välj två vuxna utan koppling till familjen.',
  },
  {
    q: 'Måste en framtidsfullmakt registreras?',
    a: 'Nej, lagen ställer inget krav på registrering. Förvara originalet säkert och se till att fullmaktshavaren vet var det finns – banken vill se originalet varje gång fullmakten används, och vid en ansökan till tingsrätten krävs original eller bestyrkt kopia.',
  },
  {
    q: 'Kan jag skriva under framtidsfullmakten digitalt?',
    a: 'Ja, sedan den 1 juli 2026, men både du och vittnena måste använda en avancerad elektronisk underskrift enligt EU:s eIDAS-förordning (4 a §). Är du osäker på om en tjänst uppfyller kravet, skriv under på papper i vittnenas samtidiga närvaro.',
  },
  {
    q: 'Behövs ett läkarintyg för att fullmakten ska börja gälla?',
    a: 'Inte enligt lagen, om fullmaktshavaren själv bedömer att den har trätt i kraft. Prövar tingsrätten frågan ska rätten inhämta läkarintyg eller likvärdig utredning, om det inte är uppenbart obehövligt (13 §). Räkna med att banker gör en egen kontroll och kan vilja se intyg eller tingsrättens beslut.',
  },
  {
    q: 'Kan fullmaktshavaren sälja min bostad?',
    a: 'Ja, om fullmakten omfattar det – skriv det uttryckligen. Fullmaktshavaren får däremot inte företräda dig om hen själv, hens make eller sambo eller hens barn är motpart, till exempel köpare. Då utser överförmyndaren en god man för den affären (17 §).',
  },
  {
    q: 'Vad händer om fullmaktshavaren missbrukar fullmakten?',
    a: 'Granskaren, eller om ingen finns dina närmaste, kan kräva redovisning (23–24 §§). Överförmyndaren kan begära redovisning och besluta att fullmakten helt eller delvis inte längre får användas vid missbruk eller allvarlig försummelse (25–26 §§). Kontakta kommunens överförmyndare om du misstänker missbruk.',
  },
  {
    q: 'Hur återkallar jag en framtidsfullmakt?',
    a: 'Ta tillbaka originalet och förstör det, och meddela fullmaktshavaren och de banker eller andra som känner till fullmakten. Återkallelse följer avtalslagen (8 §), och en fullmakt som inte går att få tillbaka kan förklaras kraftlös av tingsrätten. Gör det medan din förmåga inte kan ifrågasättas.',
  },
]

const templateLinks = [
  {
    name: 'Framtidsfullmakt 2026 – komplett mall',
    href: '/mallar/seniorer-omsorg/framtidsfullmakt-komplett-2026',
    note: 'Fullmaktshavare, ersättare och de angelägenheter fullmakten ska omfatta.',
  },
  {
    name: 'Ömsesidig framtidsfullmakt för makar och sambor',
    href: '/mallar/seniorer-omsorg/framtidsfullmakt-omsesidig-makar',
    note: 'Två separata framtidsfullmakter, en för var och en av er, där ni utser varandra.',
  },
  {
    name: 'Guide: generalfullmakt',
    href: '/generalfullmakt',
    note: 'När du vill ge någon fullmakt redan i dag.',
  },
]

const sources = [
  { label: 'Lag (2017:310) om framtidsfullmakter', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017310-om-framtidsfullmakter_sfs-2017-310/' },
  { label: 'Föräldrabalk (1949:381), 11 och 17 kap.', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/foraldrabalk-1949381_sfs-1949-381/' },
  { label: 'Ärvdabalk (1958:637), 10 kap.', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/arvdabalk-1958637_sfs-1958-637/' },
  { label: 'Lag (1915:218) om avtal och andra rättshandlingar på förmögenhetsrättens område', href: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1915218-om-avtal-och-andra-rattshandlingar_sfs-1915-218/' },
  { label: 'Sveriges Domstolar: Framtidsfullmakt', href: 'https://www.domstol.se/amnen/familj/forvaltare-och-framtidsfullmakt/framtidsfullmakt/' },
  { label: 'Sveriges Domstolar: Ansök om att framtidsfullmakt ska börja gälla', href: 'https://www.domstol.se/amnen/familj/forvaltare-och-framtidsfullmakt/ansok-om-att-framtidsfullmakt-ska-borja-galla/' },
  { label: 'Sveriges Domstolar: Olika ställföreträdare', href: 'https://www.domstol.se/amnen/familj/forvaltare-och-framtidsfullmakt/olika-stallforetradare/' },
  { label: 'Svenska Bankföreningen: Framtidsfullmakt för bankärenden (blankett)', href: 'https://www.financesweden.se/media/iowallgg/2601_framtidsfullmakt-blankett.pdf' },
]

export default function FramtidsfullmaktPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://fullmakt24.se' },
      { '@type': 'ListItem', position: 2, name: 'Framtidsfullmakt', item: URL },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: '2026-11-01',
    dateModified: '2026-11-01',
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
        <span className="text-navy-600 font-medium">Framtidsfullmakt</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🕰️</span>
          <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-1 rounded-full">Seniorer &amp; Omsorg</span>
          <span className="text-sm text-navy-400">10 min läsning</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-navy-500 mb-5">
          Framtidsfullmakt – mall och guide 2026
        </h1>

        <p className="text-lg text-navy-500 leading-relaxed mb-4">
          En framtidsfullmakt är ditt sätt att själv bestämma vem som ska sköta din ekonomi och dina
          personliga angelägenheter om du en dag inte längre kan. Utan en sådan blir det anhöriga med
          begränsad behörighet, eller en god man eller förvaltare som någon annan väljer.
        </p>
        <p className="text-lg text-navy-500 leading-relaxed mb-8">
          Dokumentet är kort, men reglerna runt det är stränga. Formkraven måste vara uppfyllda,
          vittnena måste vara rätt personer, och banken gör sin egen bedömning när fullmakten väl ska
          användas. Här går vi igenom vad lagen faktiskt säger och vad som händer i praktiken.
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
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-2">Mallar för framtidsfullmakt</h2>
          <p className="text-navy-400 leading-relaxed mb-5">
            Du fyller i uppgifterna och laddar ner en PDF med rader för din underskrift och för två
            vittnen. Skriv under i vittnenas samtidiga närvaro. Läs igenom dokumentet innan du skriver
            under och kontrollera att det uppfyller kraven ovan. 99 kr per mall; den ömsesidiga mallen
            innehåller två fullmakter, en för var och en av er.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/mallar/seniorer-omsorg/framtidsfullmakt-komplett-2026" className="btn-gold inline-flex items-center gap-2">
              Framtidsfullmakt – komplett mall
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
            <Link href="/mallar/seniorer-omsorg/framtidsfullmakt-omsesidig-makar" className="btn-primary inline-flex items-center gap-2">
              Ömsesidig för makar
            </Link>
          </div>
        </div>

        {/* Relaterade mallar */}
        <div className="mb-10">
          <h2 className="font-heading font-bold text-navy-500 text-xl mb-4">Relaterade mallar och guider</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {templateLinks.map(t => (
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
            Paragrafhänvisningarna är kontrollerade mot lagtexten hos Sveriges riksdag i lydelsen efter
            ändringarna som trädde i kraft den 1 juli 2026. Uppgifterna om bankernas hantering bygger på
            Svenska Bankföreningens blankett och kan skilja sig mellan banker.
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
            Den här guiden är allmän information och utgör inte individuell juridisk rådgivning. Har du en
            stor förmögenhet, äger du ett företag eller fastigheter i flera länder, eller finns det risk
            för konflikt i familjen, bör du anlita en jurist innan du skriver under.
          </p>
          <p className="mt-3">
            <Link href="/blogg" className="text-gold-600 hover:text-gold-700 font-medium">← Fler guider</Link>
          </p>
        </div>
      </article>
    </div>
  )
}
