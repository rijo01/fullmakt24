export interface BlogSection {
  heading?: string
  paragraphs?: string[]
  list?: string[]
}

export interface BlogFaq {
  q: string
  a: string
}

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  category: string
  emoji: string
  datePublished: string
  dateUpdated: string
  readingMinutes: number
  intro: string
  sections: BlogSection[]
  faq: BlogFaq[]
  cta: { heading: string; text: string; label: string; href: string }
  relatedTemplateSlug: string
  keywords: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'resa-med-barn-inom-eu-2026',
    title: 'Resa med barn inom EU 2026 – komplett guide',
    metaTitle: 'Resa med barn inom EU 2026 – guide',
    metaDescription: 'Ska du resa med barn inom EU 2026? Guide om pass, vårdnadshavares samtycke och när du behöver en resefullmakt eller medgivande. Tydliga råd och mall.',
    excerpt: 'Allt du behöver veta inför en EU-resa med barn 2026 – pass, vårdnadshavarnas samtycke och när en resefullmakt behövs.',
    category: 'Föräldrar & Barn',
    emoji: '✈️',
    datePublished: '2026-06-23',
    dateUpdated: '2026-06-23',
    readingMinutes: 6,
    intro: 'Att resa med barn inom EU är oftast enkelt, men det finns några saker som är bra att ha koll på innan avresa – framför allt giltigt pass, och vid behov ett skriftligt medgivande eller en resefullmakt. Den här guiden går igenom vad som gäller 2026 när barn reser med en förälder, en annan vuxen eller på egen hand, och hur du undviker problem vid gränskontroll och incheckning.',
    sections: [
      {
        heading: 'Barn behöver eget pass – även inom EU',
        paragraphs: [
          'Varje barn måste ha en egen giltig resehandling för att resa utomlands, även inom EU och Schengenområdet. Ett barn kan inte längre resa på en förälders pass. Ansök i god tid, eftersom handläggningstiden kan variera under högsäsong.',
          'Inom Schengenområdet görs normalt inga systematiska gränskontroller, men kontroller kan förekomma, och flygbolag kräver alltid godkänd id-handling vid incheckning. Ta därför alltid med barnets pass, oavsett resmål inom EU.',
        ],
      },
      {
        heading: 'Vårdnadshavarnas samtycke vid utlandsresa',
        paragraphs: [
          'Vid gemensam vårdnad krävs som huvudregel båda vårdnadshavarnas samtycke för att resa utomlands med barnet. Det följer av att beslut av ingripande betydelse för barnet ska fattas gemensamt enligt föräldrabalken (6 kap. 13 §). En kortare semesterresa inom EU räknas oftast inte som ingripande, men om vårdnadshavarna är oense bör resan inte genomföras utan överenskommelse.',
          'I praktiken är ett skriftligt medgivande från den andra vårdnadshavaren värdefullt att ha med, särskilt om barnet och den medföljande föräldern har olika efternamn, om vårdnaden är ensam, eller om barnet reser med en annan vuxen än sina vårdnadshavare. Gränspolis och flygbolag kan ställa frågor, och ett undertecknat dokument gör situationen enkel att reda ut.',
        ],
      },
      {
        heading: 'När barnet reser med en annan vuxen',
        paragraphs: [
          'Reser barnet med en mor- eller farförälder, en kompis familj eller en annan vuxen är det starkt rekommenderat att ha en resefullmakt eller ett medgivande som visar att vårdnadshavarna godkänt resan. Dokumentet bör ange vem barnet reser med, resmål, datum och vårdnadshavarnas kontaktuppgifter.',
          'Ett tydligt dokument underlättar inte bara vid gränskontroll, utan ger också den medföljande vuxna en grund för att kunna agera om något oförutsett händer under resan – exempelvis vid kontakt med vården.',
        ],
      },
      {
        heading: 'Praktisk checklista inför resan',
        list: [
          'Giltigt pass för varje barn – kontrollera utgångsdatum i god tid.',
          'Europeiskt sjukförsäkringskort (EU-kortet) från Försäkringskassan för vård inom EU.',
          'Skriftligt medgivande eller resefullmakt vid ensam vårdnad, olika efternamn eller resa med annan vuxen.',
          'Kontaktuppgifter till båda vårdnadshavarna, gärna på dokumentet.',
          'Eventuell reseförsäkring som täcker barnen.',
        ],
      },
      {
        heading: 'Mellanlandning eller resmål utanför Schengen',
        paragraphs: [
          'Tänk på att resan kan beröra länder med andra inresekrav även om slutmålet ligger inom EU. Gör du en mellanlandning utanför Schengenområdet, eller reser till ett EU-land som inte ingår i Schengen, kan det förekomma gränskontroll där pass alltid ska visas upp. Vissa länder rekommenderar dessutom att en medföljande vuxen har ett skriftligt medgivande från barnets vårdnadshavare.',
          'Kontrollera därför inresekraven för samtliga länder ni passerar i god tid före avresan, exempelvis via Sweden Abroad eller respektive lands ambassad. Reglerna kan ändras, och det är ditt ansvar som resenär att ha rätt handlingar med dig. Ett medgivande på både svenska och engelska underlättar om du reser till eller via ett land där svenska inte talas.',
        ],
      },
      {
        heading: 'Tips för en smidig gränspassage',
        list: [
          'Ha barnets pass och eventuellt medgivande lättillgängligt, inte längst ner i väskan.',
          'Skriv medgivandet på både svenska och engelska vid resor utanför Norden.',
          'Se till att den medföljande vuxnas namn stämmer med biljetten och dokumentet.',
          'Spara en digital kopia i mobilen som komplement till pappersoriginalet.',
        ],
      },
      {
        heading: 'Ärligt om vad ett dokument kan och inte kan',
        paragraphs: [
          'Ett medgivande eller en resefullmakt är inget myndighetsbeslut och garanterar inte att resan godkänns om vårdnadshavarna är oense – men det är ett tydligt bevis på samtycke som underlättar i mötet med gränspolis och flygbolag. Dokumentet är utformat enligt svensk avtalsrätt. Vid en pågående vårdnadstvist eller andra komplicerade förhållanden rekommenderar vi att du kontaktar en jurist eller familjerätten i din kommun.',
        ],
      },
    ],
    faq: [
      { q: 'Behöver barnet eget pass för att resa inom EU?', a: 'Ja. Varje barn måste ha en egen giltig resehandling, även inom EU och Schengen. Ett barn kan inte resa på en förälders pass.' },
      { q: 'Krävs båda vårdnadshavarnas samtycke?', a: 'Vid gemensam vårdnad krävs som huvudregel båda vårdnadshavarnas samtycke för utlandsresa. Ett skriftligt medgivande från den andra vårdnadshavaren är värdefullt att ha med, särskilt vid olika efternamn eller resa med annan vuxen.' },
      { q: 'Måste jag visa medgivandet vid gränsen?', a: 'Det är inget absolut krav inom Schengen, men gränspolis och flygbolag kan ställa frågor. Ett undertecknat medgivande gör det enkelt att visa att resan är godkänd.' },
      { q: 'Vad gäller om barnet reser med mormor eller en kompis familj?', a: 'Då rekommenderas en resefullmakt eller ett medgivande som visar att vårdnadshavarna godkänt resan och anger vem barnet reser med, resmål och datum.' },
    ],
    cta: {
      heading: 'Skapa en resefullmakt för barn inom EU',
      text: 'Vår mall är anpassad för EU-resor och hjälper dig att fylla i samtycke, resmål och kontaktuppgifter på några minuter.',
      label: 'Till mallen: Resefullmakt för barn inom EU',
      href: '/mallar/foraldrar-barn/resefullmakt-barn-eu',
    },
    relatedTemplateSlug: 'resefullmakt-barn-eu',
    keywords: ['resa med barn inom EU', 'resefullmakt barn', 'medgivande resa barn', 'pass barn EU', 'samtycke utlandsresa barn'],
  },
  {
    slug: 'hamta-ut-fordon-at-nagon-annan',
    title: 'Hämta ut fordon åt någon annan – så fungerar fullmakten',
    metaTitle: 'Hämta ut fordon åt någon – fullmakt',
    metaDescription: 'Ska du hämta ut någon annans bil från verkstad, parkering eller förvar? Så fungerar fullmakten, vad den ska innehålla och när den behövs. Guide och mall.',
    excerpt: 'Så hämtar du ut en bil åt någon annan med en korrekt fullmakt – från verkstad, parkering eller polisens fordonsförvar.',
    category: 'Resa & Transport',
    emoji: '🚗',
    datePublished: '2026-06-23',
    dateUpdated: '2026-06-23',
    readingMinutes: 5,
    intro: 'Ibland behöver någon annan än ägaren hämta ut en bil – kanske från en verkstad, en parkering eller ett fordonsförvar. För att den som lämnar ut fordonet ska kunna vara säker på att rätt person hämtar det krävs oftast en skriftlig fullmakt. Den här guiden förklarar hur en fullmakt att hämta ut fordon fungerar, vad den bör innehålla och vad du ska tänka på.',
    sections: [
      {
        heading: 'När behövs en fullmakt för att hämta ut ett fordon?',
        paragraphs: [
          'En verkstad, ett parkeringsbolag eller en bärgningsfirma lämnar normalt bara ut ett fordon till ägaren eller till någon som kan visa att hen har ägarens tillstånd. Om du ska hämta en bil åt en familjemedlem, vän eller kollega behöver du därför kunna styrka din behörighet med en fullmakt.',
          'Fullmakten gör det tydligt för den som lämnar ut fordonet att ägaren har gett dig rätt att hämta just det fordonet. Det skyddar både ägaren och utlämnaren mot att fel person får tillgång till bilen.',
        ],
      },
      {
        heading: 'Vad ska fullmakten innehålla?',
        list: [
          'Ägarens (fullmaktsgivarens) namn, personnummer och kontaktuppgifter.',
          'Ombudets (den som hämtar) namn och personnummer.',
          'Fordonets registreringsnummer och gärna märke och modell.',
          'Var fordonet ska hämtas – verkstad, parkering eller förvar.',
          'Eventuella begränsningar, till exempel att ombudet inte får betala mer än en viss summa.',
          'Datum, ägarens underskrift och gärna två vittnen.',
        ],
      },
      {
        heading: 'Tänk på betalning och retentionsrätt',
        paragraphs: [
          'Om bilen står på en verkstad har verkstaden normalt rätt att hålla kvar fordonet tills reparationen är betald, så kallad retentionsrätt. Klargör därför i förväg vem som betalar och hur. Vill du att ombudet ska kunna betala åt ägaren bör det framgå av fullmakten, gärna med en beloppsgräns.',
          'Ta också reda på vilken legitimation som krävs vid utlämningen. De flesta verkstäder och förvar vill se ombudets id-handling tillsammans med fullmakten i original.',
        ],
      },
      {
        heading: 'Vanliga situationer där fullmakten används',
        paragraphs: [
          'Behovet av att hämta ut ett fordon åt någon annan dyker upp i många vardagssituationer. En klassisk situation är att en familjemedlem lämnat in bilen på verkstad men inte själv hinner hämta den när reparationen är klar. Då kan en partner eller vuxet barn hämta fordonet med en fullmakt som styrker att ägaren godkänt det.',
          'Andra exempel är att hämta en bil som flyttats av ett parkeringsbolag, att lösa ut ett fordon ur polisens eller en kommuns fordonsförvar, eller att ta emot en bil som transporterats med biltransport. I samtliga fall vill den som lämnar ut fordonet kunna identifiera att rätt person hämtar, och en skriftlig fullmakt är det enklaste sättet att visa detta.',
        ],
      },
      {
        heading: 'Om ägaren inte själv kan skriva under',
        paragraphs: [
          'Ibland är ägaren förhindrad att skriva under en vanlig fullmakt, till exempel på grund av sjukdom. Är det fråga om en tillfällig situation går det oftast att lösa genom att ägaren undertecknar i förväg eller på distans. Handlar det om att ägaren mer varaktigt förlorat förmågan att fatta beslut räcker inte en vanlig fullmakt – då kan en framtidsfullmakt eller god man behövas, beroende på omständigheterna. Är du osäker, kontakta den som förvarar fordonet och beskriv situationen innan du åker dit.',
        ],
      },
      {
        heading: 'Skillnaden mot ägarbyte och andra fordonsärenden',
        paragraphs: [
          'En fullmakt att hämta ut ett fordon ger bara rätt att fysiskt hämta bilen – den överför inte äganderätten och ger inte rätt att sälja eller registrera om fordonet. Ska du i stället genomföra ett ägarbyte hanteras det separat hos Transportstyrelsen, och då behövs en annan typ av fullmakt. Håll uppdraget avgränsat till just det du ska göra.',
          'Fullmakten är utformad enligt svensk avtalsrätt. Vid mer omfattande eller oklara situationer – exempelvis om ägaren är okontaktbar eller fordonet är belagt med kvarstad – rekommenderar vi att du stämmer av med den som förvarar fordonet eller med en jurist.',
        ],
      },
    ],
    faq: [
      { q: 'Måste jag ha en fullmakt för att hämta någon annans bil?', a: 'Ja, oftast. Verkstäder, parkeringsbolag och fordonsförvar lämnar normalt bara ut ett fordon till ägaren eller till någon som kan visa ägarens skriftliga tillstånd.' },
      { q: 'Vad behöver fullmakten innehålla?', a: 'Ägarens och ombudets uppgifter, fordonets registreringsnummer, var det ska hämtas, eventuella begränsningar samt datum och underskrift. Två vittnen höjer bevisvärdet.' },
      { q: 'Får ombudet betala verkstadsräkningen?', a: 'Bara om fullmakten tillåter det. Vill du att ombudet ska kunna betala bör det framgå tydligt, gärna med en beloppsgräns. Tänk på att verkstaden kan hålla kvar bilen tills betalning skett.' },
      { q: 'Kan jag genomföra ägarbyte med samma fullmakt?', a: 'Nej. Att hämta ut ett fordon och att byta ägare är olika ärenden. Ägarbyte hanteras separat hos Transportstyrelsen och kräver en annan fullmakt.' },
    ],
    cta: {
      heading: 'Skapa en fullmakt att hämta ut fordon',
      text: 'Fyll i ägarens och ombudets uppgifter samt fordonets registreringsnummer och ladda ner en färdig fullmakt som PDF.',
      label: 'Till mallen: Fullmakt att hämta ut fordon',
      href: '/mallar/resa-transport/fullmakt-hamta-ut-fordon',
    },
    relatedTemplateSlug: 'fullmakt-hamta-ut-fordon',
    keywords: ['hämta ut fordon fullmakt', 'fullmakt hämta bil', 'fullmakt verkstad', 'hämta bil åt någon annan', 'fullmakt fordon'],
  },
  {
    slug: 'fotografera-filma-barn-i-forening',
    title: 'Fotografera och filma barn i förening – vad gäller?',
    metaTitle: 'Foto och film på barn i förening',
    metaDescription: 'Vad gäller när en förening fotograferar och filmar barn? Guide om GDPR, samtycke från vårdnadshavare och hur ett medgivande för foto och film bör se ut.',
    excerpt: 'Får föreningen fotografera och publicera bilder på barn? Så fungerar GDPR och samtycke – och så skriver ni ett tydligt medgivande.',
    category: 'Förening, Skola & Fritid',
    emoji: '📷',
    datePublished: '2026-06-23',
    dateUpdated: '2026-06-23',
    readingMinutes: 6,
    intro: 'Många idrottsföreningar, scoutkårer och kulturskolor vill kunna fotografera och filma sin verksamhet – för att lägga ut på sociala medier, i medlemsblad eller på hemsidan. När bilderna föreställer barn finns det viktiga regler att förhålla sig till. Den här guiden förklarar vad som gäller enligt dataskyddsreglerna och hur ett tydligt medgivande för foto och film bör se ut.',
    sections: [
      {
        heading: 'Bilder på barn är personuppgifter',
        paragraphs: [
          'En bild eller film där en person går att känna igen är en personuppgift. När en förening samlar in, lagrar eller publicerar sådant material gäller dataskyddsförordningen (GDPR, EU 2016/679). Barn anses särskilt skyddsvärda, vilket innebär att föreningen behöver vara extra noggrann med hur bilder hanteras.',
          'Det betyder inte att all fotografering är förbjuden, men att föreningen behöver ha en laglig grund för att behandla bilderna – och ofta är den lagliga grunden ett samtycke, särskilt när bilderna ska publiceras.',
        ],
      },
      {
        heading: 'Samtycke från vårdnadshavare',
        paragraphs: [
          'För yngre barn är det vårdnadshavarna som lämnar samtycke å barnets vägnar. Samtycket ska vara frivilligt, tydligt och informerat – det vill säga att vårdnadshavaren förstår vad bilderna ska användas till. Ett samtycke kan också återkallas när som helst, och då ska föreningen sluta använda de aktuella bilderna framåt.',
          'Ju äldre barnet är, desto större hänsyn bör tas till barnets egen vilja. Många föreningar väljer att inhämta samtycke från både vårdnadshavare och äldre barn. Det är god praxis att skilja på olika användningsområden – exempelvis internt bruk, hemsida och sociala medier – så att vårdnadshavaren kan godkänna det ena men inte det andra.',
        ],
      },
      {
        heading: 'Vad ett medgivande bör innehålla',
        list: [
          'Barnets och vårdnadshavarens namn.',
          'Vilken förening eller verksamhet det gäller.',
          'Vad bilderna och filmerna ska användas till, uppdelat på till exempel hemsida, sociala medier och tryckt material.',
          'Hur länge samtycket gäller och att det kan återkallas.',
          'Kontaktuppgift för att återkalla samtycket eller ställa frågor.',
          'Datum och vårdnadshavarens underskrift.',
        ],
      },
      {
        heading: 'Sociala medier kräver extra eftertanke',
        paragraphs: [
          'Att publicera bilder på barn i sociala medier innebär att materialet kan spridas snabbt och bli svårt att ta tillbaka. Även om en bild tas bort kan den redan ha kopierats eller sparats av andra. Därför bör en förening vara särskilt restriktiv med vad som läggs ut på öppna plattformar och se till att samtycket uttryckligen omfattar just sociala medier, inte bara intern användning.',
          'Ett bra arbetssätt är att i förväg bestämma vilka kanaler föreningen använder och vad som får publiceras i var och en. Undvik att tagga barn med fullständigt namn, och fråga er alltid om en bild verkligen behöver publiceras eller om den lika gärna kan stanna internt. Tänk också på att gruppbilder där ett enskilt barn inte är i fokus ofta är mindre integritetskänsliga än närbilder.',
        ],
      },
      {
        heading: 'Praktiska råd för föreningen',
        paragraphs: [
          'Samla in medgivanden i början av säsongen och håll ordning på vilka barn som har respektive inte har samtycke. Undvik att publicera bilder där enskilda barn pekas ut med fullständigt namn tillsammans med känsliga uppgifter. Var särskilt försiktig med närbilder och med material som kan spridas vidare okontrollerat.',
          'Integritetsskyddsmyndigheten (IMY) är tillsynsmyndighet och har vägledning för föreningar som behandlar personuppgifter. Den här mallen är utformad enligt svensk rätt och dataskyddsreglerna, men vid mer omfattande behandling – till exempel kameraövervakning eller systematisk publicering – kan det vara klokt att läsa IMY:s vägledning eller ta hjälp av en jurist.',
        ],
      },
    ],
    faq: [
      { q: 'Får en förening fotografera barn utan samtycke?', a: 'Att fotografera kan vara tillåtet, men för att publicera bilder på barn behöver föreningen oftast en laglig grund enligt GDPR – vanligen samtycke från vårdnadshavaren. Barn anses särskilt skyddsvärda.' },
      { q: 'Vem lämnar samtycke för barnet?', a: 'För yngre barn är det vårdnadshavarna som lämnar samtycke. Ju äldre barnet är, desto mer bör barnets egen vilja vägas in. Många föreningar inhämtar samtycke från både vårdnadshavare och äldre barn.' },
      { q: 'Kan ett samtycke återkallas?', a: 'Ja. Ett samtycke är frivilligt och kan återkallas när som helst. Då ska föreningen sluta använda de aktuella bilderna framåt.' },
      { q: 'Bör samtycket dela upp olika användningsområden?', a: 'Ja, det är god praxis. Skilj på till exempel internt bruk, hemsida och sociala medier så att vårdnadshavaren kan godkänna ett användningsområde men inte ett annat.' },
    ],
    cta: {
      heading: 'Skapa ett medgivande för foto och film',
      text: 'Vår mall hjälper föreningen att inhämta tydligt samtycke från vårdnadshavare, uppdelat på olika användningsområden.',
      label: 'Till mallen: Medgivande för foto och film',
      href: '/mallar/forening-skola/medgivande-foto-film',
    },
    relatedTemplateSlug: 'medgivande-foto-film',
    keywords: ['fotografera barn förening', 'medgivande foto film', 'GDPR bilder barn', 'samtycke foto barn', 'publicera bilder barn förening'],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}
