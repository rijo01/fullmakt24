export interface Template {
  id: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription: string;
  badge: 'gratis' | 'premium' | 'popular';
  usageCount: number;
  fields: TemplateField[];
  faq: { q: string; a: string }[];
  relatedIds: number[];
  legalInfo: string;
  keywords: string[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'select' | 'checkbox' | 'personnummer' | 'email' | 'phone' | 'address';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  group?: 'givare' | 'havare' | 'detaljer';
  helpText?: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  templateCount: number;
}

export const categories: Category[] = [
  {
    slug: 'foraldrar-barn',
    name: 'Föräldrar & Barn',
    icon: '👨‍👩‍👧‍👦',
    description: 'Fullmakter och medgivanden för resor, skola, vård och andra situationer som rör barn och föräldrar.',
    color: '#4F46E5',
    templateCount: 20,
  },
  {
    slug: 'resa-transport',
    name: 'Resa & Transport',
    icon: '✈️',
    description: 'Resefullmakter, fordonsfullmakter och transportrelaterade dokument.',
    color: '#0891B2',
    templateCount: 15,
  },
  {
    slug: 'vard-omsorg',
    name: 'Vård & Omsorg',
    icon: '🏥',
    description: 'Fullmakter för sjukvård, hemtjänst, apotek och övrig omsorg.',
    color: '#DC2626',
    templateCount: 15,
  },
  {
    slug: 'ekonomi-myndigheter',
    name: 'Ekonomi, Bank & Myndigheter',
    icon: '💼',
    description: 'Bank-, skatte- och myndighetsfullmakter för privatpersoner och företag.',
    color: '#059669',
    templateCount: 20,
  },
  {
    slug: 'boende-vardag',
    name: 'Boende & Vardag',
    icon: '🏠',
    description: 'Fullmakter för bostadsaffärer, hyresärenden och vardagliga behov.',
    color: '#D97706',
    templateCount: 15,
  },
  {
    slug: 'forening-skola',
    name: 'Förening, Skola & Fritid',
    icon: '⚽',
    description: 'Fullmakter och medgivanden för föreningsliv, skola och fritidsaktiviteter.',
    color: '#7C3AED',
    templateCount: 15,
  },
  {
    slug: 'djur-husdjur',
    name: 'Djur & Husdjur',
    icon: '🐾',
    description: 'Fullmakter för veterinärvård, djurpassning och husdjursrelaterade ärenden.',
    color: '#BE185D',
    templateCount: 8,
  },
  {
    slug: 'seniorer-omsorg',
    name: 'Seniorer & Digital Omsorg',
    icon: '👴',
    description: 'Fullmakter anpassade för äldre – digitala tjänster, bank och vård.',
    color: '#92400E',
    templateCount: 8,
  },
  {
    slug: 'digitalt-dodsbo',
    name: 'Digitalt & Dödsbo',
    icon: '💻',
    description: 'Fullmakter för digitala tillgångar, dödsboförvaltning och digitalt arv.',
    color: '#475569',
    templateCount: 8,
  },
];

const commonGivareFields: TemplateField[] = [
  { id: 'givare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Andersson', required: true, group: 'givare' },
  { id: 'givare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'givare' },
  { id: 'givare_adress', label: 'Adress', type: 'address', placeholder: 'Storgatan 1, 111 22 Stockholm', required: true, group: 'givare' },
  { id: 'givare_epost', label: 'E-postadress', type: 'email', placeholder: 'anna@exempel.se', required: false, group: 'givare' },
  { id: 'givare_telefon', label: 'Telefonnummer', type: 'phone', placeholder: '070-123 45 67', required: false, group: 'givare' },
];

const commonHavareFields: TemplateField[] = [
  { id: 'havare_namn', label: 'Fullmaktstagarens namn', type: 'text', placeholder: 'Erik Eriksson', required: true, group: 'havare' },
  { id: 'havare_pnr', label: 'Personnummer/Org.nr', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'havare' },
  { id: 'havare_relation', label: 'Relation till fullmaktsgivaren', type: 'select', options: ['Förälder', 'Make/Maka', 'Syskon', 'Annan släkting', 'Vän', 'Kollega', 'Juridiskt ombud', 'Annat'], required: true, group: 'havare' },
  { id: 'havare_adress', label: 'Adress', type: 'address', placeholder: 'Lillgatan 5, 222 33 Göteborg', required: false, group: 'havare' },
];

const dateRangeFields: TemplateField[] = [
  { id: 'giltig_fran', label: 'Giltig från', type: 'date', required: true, group: 'detaljer' },
  { id: 'giltig_till', label: 'Giltig till', type: 'date', required: true, group: 'detaljer' },
];

function generateTemplates(): Template[] {
  const templates: Template[] = [];

  // === FÖRÄLDRAR & BARN (1-20) ===
  const foraldrarTemplates: Partial<Template>[] = [
    { id: 1, slug: 'foraldraredgivande-resa-annan-vuxen', name: 'Föräldramedgivande – resa med annan vuxen', description: 'Medgivande för barn att resa med annan vuxen än vårdnadshavare.', badge: 'popular', usageCount: 12847 },
    { id: 2, slug: 'reseintyg-barn-internationell', name: 'Reseintyg för barn – internationell resa', description: 'Intyg som krävs vid internationella resor med barn.', badge: 'popular', usageCount: 9832 },
    { id: 3, slug: 'resefullmakt-barn-eu', name: 'Resefullmakt för barn inom EU', description: 'Fullmakt specifikt anpassad för resor inom EU med barn.', badge: 'gratis', usageCount: 7641 },
    { id: 4, slug: 'medgivande-skolresa', name: 'Medgivande vid skolresa', description: 'Medgivande för barn att delta i skolresa.', badge: 'gratis', usageCount: 8923 },
    { id: 5, slug: 'medgivande-lager-kollo', name: 'Medgivande vid läger / kollo', description: 'Medgivande för barn att delta i läger eller kolloverksamhet.', badge: 'gratis', usageCount: 6754 },
    { id: 6, slug: 'medgivande-foreningsresa', name: 'Medgivande vid föreningsresa', description: 'Medgivande för barn att resa med förening eller lag.', badge: 'gratis', usageCount: 4532 },
    { id: 7, slug: 'medgivande-barn-bo-annan-vuxen', name: 'Medgivande för barn att bo hos annan vuxen', description: 'Tillfälligt medgivande för barn att bo hos annan vuxen.', badge: 'gratis', usageCount: 3421 },
    { id: 8, slug: 'medgivande-ensam-resa-minderarig', name: 'Medgivande vid ensam resa för minderårig', description: 'Medgivande för minderårig att resa ensam.', badge: 'premium', usageCount: 5678 },
    { id: 9, slug: 'fullmakt-barns-sjukvard', name: 'Fullmakt för barnets sjukvård', description: 'Fullmakt för annan vuxen att hantera barnets sjukvårdskontakter.', badge: 'popular', usageCount: 11234 },
    { id: 10, slug: 'medgivande-akut-vard', name: 'Medgivande vid akut vård', description: 'Akutmedgivande för vård av barn när vårdnadshavare ej är tillgänglig.', badge: 'gratis', usageCount: 8765 },
    { id: 11, slug: 'fullmakt-bonusforalder', name: 'Fullmakt till bonusförälder', description: 'Fullmakt som ger bonusförälder rätt att agera för barnets räkning.', badge: 'popular', usageCount: 9543 },
    { id: 12, slug: 'medgivande-passansokan', name: 'Medgivande för passansökan', description: 'Medgivande från vårdnadshavare för passansökan åt barn.', badge: 'gratis', usageCount: 7654 },
    { id: 13, slug: 'medgivande-bankarenden-barn', name: 'Medgivande för bankärenden för barn', description: 'Fullmakt för att hantera bankärenden för minderårig.', badge: 'premium', usageCount: 4321 },
    { id: 14, slug: 'fullmakt-slakting-resa', name: 'Fullmakt till släkting vid resa', description: 'Fullmakt till släkting för att resa med barn.', badge: 'gratis', usageCount: 5432 },
    { id: 15, slug: 'medgivande-overnattning-utomlands', name: 'Medgivande för övernattning utomlands', description: 'Medgivande för barn att övernatta utomlands.', badge: 'gratis', usageCount: 3456 },
    { id: 16, slug: 'fullmakt-skolarenden', name: 'Fullmakt för skolärenden', description: 'Fullmakt för annan person att hantera barnets skolärenden.', badge: 'gratis', usageCount: 6543 },
    { id: 17, slug: 'medgivande-byte-skola', name: 'Medgivande vid byte av skola', description: 'Medgivande från bägge vårdnadshavare vid byte av skola.', badge: 'gratis', usageCount: 2345 },
    { id: 18, slug: 'intyg-gemensam-vardnad', name: 'Intyg om gemensam vårdnad', description: 'Intyg som bekräftar gemensam vårdnad om barn.', badge: 'gratis', usageCount: 4567 },
    { id: 19, slug: 'intyg-ensam-vardnad', name: 'Intyg om ensam vårdnad', description: 'Intyg som bekräftar ensam vårdnad om barn.', badge: 'gratis', usageCount: 3789 },
    { id: 20, slug: 'medgivande-idrottsstavling-utomlands', name: 'Medgivande vid idrottstävling utomlands', description: 'Medgivande för barn att delta i idrottstävling utomlands.', badge: 'gratis', usageCount: 2678 },
  ];

  foraldrarTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Föräldrar & Barn',
      categorySlug: 'foraldrar-barn',
      longDescription: `Denna mall hjälper dig att snabbt och juridiskt korrekt skapa ${t.name?.toLowerCase()}. Dokumentet är anpassat för svenska förhållanden och uppfyller kraven som ställs av myndigheter och institutioner.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'barn_namn', label: 'Barnets namn', type: 'text', placeholder: 'Lisa Andersson', required: true, group: 'detaljer' },
        { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'detaljer' },
        { id: 'syfte', label: 'Syfte med fullmakten', type: 'textarea', placeholder: 'Beskriv syftet...', required: true, group: 'detaljer' },
        { id: 'begransningar', label: 'Eventuella begränsningar', type: 'textarea', placeholder: 'Ange eventuella begränsningar...', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Är detta dokument juridiskt bindande?', a: 'Ja, dokumentet uppfyller kraven för en giltig fullmakt enligt svensk rätt. Det rekommenderas att bägge parter undertecknar i närvaro av vittnen.' },
        { q: 'Behöver bägge vårdnadshavare skriva under?', a: 'Vid gemensam vårdnad krävs som regel bägge vårdnadshavares medgivande.' },
        { q: 'Hur länge gäller fullmakten?', a: 'Fullmakten gäller under den period du anger i dokumentet. Den kan återkallas när som helst.' },
        { q: 'Accepteras denna av flygbolag?', a: 'Ja, de flesta flygbolag och gränskontroller accepterar denna typ av fullmakt. Vi rekommenderar att ta med en kopia.' },
        { q: 'Kan jag använda fullmakten utomlands?', a: 'Ja, men vi rekommenderar att ha den på både svenska och engelska vid utlandsresor.' },
      ],
      relatedIds: [2, 3, 9, 11, 14],
      legalInfo: 'Denna fullmakt är giltig enligt svensk lag och accepteras av myndigheter, skolor och sjukvård i Sverige.',
      keywords: ['fullmakt barn', 'medgivande barn', 'föräldrafullmakt', 'resa med barn'],
    } as Template);
  });

  // === RESA & TRANSPORT (21-35) ===
  const resaTemplates: Partial<Template>[] = [
    { id: 21, slug: 'fullmakt-hamta-ut-fordon', name: 'Fullmakt att hämta ut fordon', description: 'Fullmakt för att hämta ut annans fordon från verkstad eller parkering.', badge: 'gratis', usageCount: 4532 },
    { id: 22, slug: 'fullmakt-bilforsakring', name: 'Fullmakt för bilförsäkring', description: 'Fullmakt att teckna eller ändra bilförsäkring.', badge: 'gratis', usageCount: 3241 },
    { id: 23, slug: 'fullmakt-besiktning', name: 'Fullmakt för besiktning', description: 'Fullmakt att besikta annans fordon.', badge: 'popular', usageCount: 8765 },
    { id: 24, slug: 'resefullmakt-vuxen', name: 'Resefullmakt för vuxen', description: 'Generell resefullmakt för vuxen person.', badge: 'gratis', usageCount: 5432 },
    { id: 25, slug: 'fullmakt-agarbyte-bil', name: 'Fullmakt för ägarbyte bil', description: 'Fullmakt att genomföra ägarbyte av motorfordon.', badge: 'popular', usageCount: 11432 },
    { id: 26, slug: 'fullmakt-transportstyrelsen', name: 'Fullmakt för Transportstyrelsen', description: 'Fullmakt att företräda person hos Transportstyrelsen.', badge: 'gratis', usageCount: 6543 },
    { id: 27, slug: 'fullmakt-parkeringsbolag', name: 'Fullmakt gentemot parkeringsbolag', description: 'Fullmakt att överklaga eller hantera parkeringsärenden.', badge: 'gratis', usageCount: 2345 },
    { id: 28, slug: 'fullmakt-bilverkstad', name: 'Fullmakt för bilverkstad', description: 'Fullmakt att lämna in och hämta ut fordon från verkstad.', badge: 'gratis', usageCount: 4321 },
    { id: 29, slug: 'medgivande-hyrbil', name: 'Medgivande för hyrbil', description: 'Medgivande att hyra bil för annans räkning.', badge: 'gratis', usageCount: 3456 },
    { id: 30, slug: 'fullmakt-bat-registrering', name: 'Fullmakt för båtregistrering', description: 'Fullmakt att registrera eller avregistrera båt.', badge: 'premium', usageCount: 1234 },
    { id: 31, slug: 'fullmakt-korkort-arende', name: 'Fullmakt för körkortsärende', description: 'Fullmakt att hantera körkortsärenden hos Transportstyrelsen.', badge: 'gratis', usageCount: 5678 },
    { id: 32, slug: 'resefullmakt-grupp', name: 'Resefullmakt för grupp', description: 'Fullmakt för gruppresa med specificerade deltagare.', badge: 'premium', usageCount: 2345 },
    { id: 33, slug: 'fullmakt-tullarende', name: 'Fullmakt för tullärende', description: 'Fullmakt att hantera tullärenden för annans räkning.', badge: 'premium', usageCount: 1567 },
    { id: 34, slug: 'fullmakt-flygbolag', name: 'Fullmakt gentemot flygbolag', description: 'Fullmakt att hantera bokning eller reklamation hos flygbolag.', badge: 'gratis', usageCount: 3456 },
    { id: 35, slug: 'medgivande-samakande', name: 'Medgivande för samåkande', description: 'Medgivande och ansvarsfördelning vid samåkning.', badge: 'gratis', usageCount: 987 },
  ];

  resaTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Resa & Transport',
      categorySlug: 'resa-transport',
      longDescription: `Skapa enkelt ${t.name?.toLowerCase()} med vår juridiskt granskade mall. Anpassad för svenska regler och myndigheter.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'syfte', label: 'Syfte/uppdrag', type: 'textarea', placeholder: 'Beskriv uppdraget...', required: true, group: 'detaljer' },
        { id: 'begransningar', label: 'Begränsningar', type: 'textarea', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Är denna fullmakt giltig hos myndigheter?', a: 'Ja, fullmakten uppfyller kraven enligt svensk lag.' },
        { q: 'Hur länge gäller fullmakten?', a: 'Den gäller under den period du anger, alternativt tills vidare.' },
        { q: 'Behöver fullmakten bevittnas?', a: 'Det är inte ett krav men rekommenderas för extra säkerhet.' },
        { q: 'Kan fullmakten återkallas?', a: 'Ja, fullmakten kan återkallas när som helst av fullmaktsgivaren.' },
        { q: 'Gäller detta utomlands?', a: 'Fullmakten gäller primärt i Sverige. För utlandsbruk rekommenderas en engelsk version.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt svensk avtals- och fullmaktsrätt.',
      keywords: ['fullmakt', 'resa', 'transport', 'fordon'],
    } as Template);
  });

  // === VÅRD & OMSORG (36-50) ===
  const vardTemplates: Partial<Template>[] = [
    { id: 36, slug: 'fullmakt-sjukvard', name: 'Fullmakt för sjukvård', description: 'Fullmakt att företräda person i sjukvårdskontakter.', badge: 'popular', usageCount: 12345 },
    { id: 37, slug: 'fullmakt-apotek', name: 'Fullmakt för apotek', description: 'Fullmakt att hämta ut recept åt annan person.', badge: 'popular', usageCount: 15678 },
    { id: 38, slug: 'fullmakt-hemtjanst', name: 'Fullmakt för hemtjänst', description: 'Fullmakt att ansöka om eller hantera hemtjänst.', badge: 'gratis', usageCount: 5432 },
    { id: 39, slug: 'fullmakt-tandvard', name: 'Fullmakt för tandvård', description: 'Fullmakt att boka och hantera tandvårdsärenden.', badge: 'gratis', usageCount: 3456 },
    { id: 40, slug: 'fullmakt-aldrevard', name: 'Fullmakt för äldreomsorg', description: 'Fullmakt att företräda äldre person i omsorgsärenden.', badge: 'gratis', usageCount: 6789 },
    { id: 41, slug: 'medgivande-medicinsk-behandling', name: 'Medgivande för medicinsk behandling', description: 'Medgivande till specifik medicinsk behandling.', badge: 'premium', usageCount: 4567 },
    { id: 42, slug: 'fullmakt-forsikringskassan', name: 'Fullmakt för Försäkringskassan', description: 'Fullmakt att företräda person hos Försäkringskassan.', badge: 'popular', usageCount: 9876 },
    { id: 43, slug: 'fullmakt-journalhantering', name: 'Fullmakt för journalhantering', description: 'Fullmakt att begära ut journalhandlingar.', badge: 'gratis', usageCount: 3456 },
    { id: 44, slug: 'fullmakt-rehabilitering', name: 'Fullmakt för rehabilitering', description: 'Fullmakt att hantera rehabiliteringsärenden.', badge: 'gratis', usageCount: 2345 },
    { id: 45, slug: 'medgivande-organdonation', name: 'Medgivande för organdonation', description: 'Intyg om önskemål gällande organdonation.', badge: 'gratis', usageCount: 1234 },
    { id: 46, slug: 'fullmakt-psykiatrisk-vard', name: 'Fullmakt för psykiatrisk vård', description: 'Fullmakt att hantera kontakter med psykiatrisk vård.', badge: 'premium', usageCount: 2345 },
    { id: 47, slug: 'fullmakt-privat-vardgivare', name: 'Fullmakt för privat vårdgivare', description: 'Fullmakt gentemot privat vårdgivare.', badge: 'gratis', usageCount: 3456 },
    { id: 48, slug: 'medgivande-delad-journalinfo', name: 'Medgivande för delad journalinformation', description: 'Medgivande att dela journalinformation med annan part.', badge: 'gratis', usageCount: 1567 },
    { id: 49, slug: 'fullmakt-hjalpmedel', name: 'Fullmakt för hjälpmedel', description: 'Fullmakt att hämta ut eller beställa hjälpmedel.', badge: 'gratis', usageCount: 2345 },
    { id: 50, slug: 'fullmakt-vaccin', name: 'Fullmakt för vaccination', description: 'Fullmakt att boka och genomföra vaccination åt annan.', badge: 'gratis', usageCount: 4567 },
  ];

  vardTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Vård & Omsorg',
      categorySlug: 'vard-omsorg',
      longDescription: `Denna mall ger dig en juridiskt korrekt ${t.name?.toLowerCase()}. Anpassad för det svenska sjukvårdssystemet.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'vardgivare', label: 'Vårdgivare/Mottagning', type: 'text', placeholder: 'Namn på vårdgivare', required: false, group: 'detaljer' },
        { id: 'syfte', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv uppdraget...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Accepteras denna av sjukvården?', a: 'Ja, svenska vårdgivare är skyldiga att respektera giltiga fullmakter.' },
        { q: 'Kan fullmaktshavaren ta medicinska beslut?', a: 'Fullmakten ger rätt att inhämta information och företräda i kontakter, men medicinska beslut kräver specifikt medgivande.' },
        { q: 'Behöver den vara bevittnad?', a: 'Rekommenderas men krävs inte för grundläggande vårdkontakter.' },
        { q: 'Gäller den hos alla vårdgivare?', a: 'Ja, den gäller generellt men kan specificeras till viss vårdgivare.' },
        { q: 'Hur återkallar jag fullmakten?', a: 'Meddela fullmaktshavaren och berörda vårdgivare skriftligt.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt patientlagen och svensk hälso- och sjukvårdslagstiftning.',
      keywords: ['fullmakt vård', 'sjukvård', 'apotek', 'medicinsk fullmakt'],
    } as Template);
  });

  // === EKONOMI, BANK & MYNDIGHETER (51-70) ===
  const ekonomiTemplates: Partial<Template>[] = [
    { id: 51, slug: 'fullmakt-bank', name: 'Fullmakt för bankärenden', description: 'Generell fullmakt för bankärenden.', badge: 'popular', usageCount: 18765 },
    { id: 52, slug: 'fullmakt-skatteverket', name: 'Fullmakt för Skatteverket', description: 'Fullmakt att företräda hos Skatteverket.', badge: 'popular', usageCount: 14567 },
    { id: 53, slug: 'fullmakt-deklaration', name: 'Fullmakt för deklaration', description: 'Fullmakt att lämna in deklaration åt annan.', badge: 'popular', usageCount: 11234 },
    { id: 54, slug: 'fullmakt-bolagsverket', name: 'Fullmakt för Bolagsverket', description: 'Fullmakt för ärenden hos Bolagsverket.', badge: 'gratis', usageCount: 5678 },
    { id: 55, slug: 'fullmakt-forsakring', name: 'Fullmakt för försäkringsärenden', description: 'Fullmakt att hantera försäkringar åt annan.', badge: 'gratis', usageCount: 6789 },
    { id: 56, slug: 'fullmakt-inkasso', name: 'Fullmakt gentemot inkassobolag', description: 'Fullmakt att företräda i inkassoärenden.', badge: 'gratis', usageCount: 3456 },
    { id: 57, slug: 'fullmakt-kronofogden', name: 'Fullmakt för Kronofogden', description: 'Fullmakt att företräda hos Kronofogden.', badge: 'gratis', usageCount: 4567 },
    { id: 58, slug: 'fullmakt-pension', name: 'Fullmakt för pensionsärenden', description: 'Fullmakt att hantera pensionsärenden.', badge: 'gratis', usageCount: 5432 },
    { id: 59, slug: 'fullmakt-arbetsformedlingen', name: 'Fullmakt för Arbetsförmedlingen', description: 'Fullmakt att företräda hos Arbetsförmedlingen.', badge: 'gratis', usageCount: 3456 },
    { id: 60, slug: 'fullmakt-bouppteckning', name: 'Fullmakt för bouppteckning', description: 'Fullmakt att företräda vid bouppteckning.', badge: 'premium', usageCount: 7890 },
    { id: 61, slug: 'fullmakt-kontoutdrag', name: 'Fullmakt för kontoutdrag', description: 'Fullmakt att hämta kontoutdrag.', badge: 'gratis', usageCount: 2345 },
    { id: 62, slug: 'fullmakt-lan-kredit', name: 'Fullmakt för lån och kredit', description: 'Fullmakt att företräda i lån- och kreditärenden.', badge: 'premium', usageCount: 4567 },
    { id: 63, slug: 'generell-fullmakt', name: 'Generell fullmakt', description: 'Generell fullmakt utan begränsning till specifikt ärende.', badge: 'popular', usageCount: 21345 },
    { id: 64, slug: 'begransad-fullmakt', name: 'Begränsad fullmakt', description: 'Fullmakt begränsad till specifikt ärende eller tid.', badge: 'gratis', usageCount: 8765 },
    { id: 65, slug: 'fullmakt-arvsarende', name: 'Fullmakt för arvsärende', description: 'Fullmakt att hantera arvsärenden.', badge: 'premium', usageCount: 6543 },
    { id: 66, slug: 'fullmakt-migrationsverket', name: 'Fullmakt för Migrationsverket', description: 'Fullmakt att företräda hos Migrationsverket.', badge: 'gratis', usageCount: 5432 },
    { id: 67, slug: 'fullmakt-tingsratten', name: 'Fullmakt för tingsrätten', description: 'Fullmakt att företräda vid tingsrätten.', badge: 'premium', usageCount: 3456 },
    { id: 68, slug: 'fullmakt-aktiebolag', name: 'Fullmakt för aktiebolagsärenden', description: 'Fullmakt att agera för aktiebolag.', badge: 'premium', usageCount: 4567 },
    { id: 69, slug: 'fullmakt-handelsbanken', name: 'Fullmakt specificerad för Handelsbanken', description: 'Fullmakt anpassad för Handelsbankens krav.', badge: 'gratis', usageCount: 2345 },
    { id: 70, slug: 'fullmakt-csp-konto', name: 'Fullmakt för CSN-ärenden', description: 'Fullmakt att företräda hos CSN.', badge: 'gratis', usageCount: 3456 },
  ];

  ekonomiTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Ekonomi, Bank & Myndigheter',
      categorySlug: 'ekonomi-myndigheter',
      longDescription: `Skapa ${t.name?.toLowerCase()} snabbt och enkelt. Juridiskt granskad och anpassad för svenska banker och myndigheter.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'syfte', label: 'Specifikt uppdrag/ärende', type: 'textarea', placeholder: 'Beskriv ärendet...', required: true, group: 'detaljer' },
        { id: 'begransningar', label: 'Begränsningar', type: 'textarea', required: false, group: 'detaljer' },
        { id: 'myndighet', label: 'Bank/Myndighet', type: 'text', placeholder: 'Namn på mottagande institution', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Accepteras denna av alla banker?', a: 'De flesta banker accepterar en korrekt utformad fullmakt, men vissa banker har egna blanketter som de föredrar.' },
        { q: 'Behövs legitimation?', a: 'Ja, fullmaktshavaren behöver visa giltig legitimation tillsammans med fullmakten.' },
        { q: 'Kan jag begränsa fullmakten?', a: 'Ja, du kan specificera exakt vilka ärenden fullmakten gäller för.' },
        { q: 'Gäller fullmakten direkt?', a: 'Ja, fullmakten gäller från det datum som anges i dokumentet.' },
        { q: 'Vad händer om fullmaktsgivaren blir beslutsoförmögen?', a: 'En vanlig fullmakt upphör om fullmaktsgivaren förlorar sin beslutsförmåga. Överväg en framtidsfullmakt för sådana situationer.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt avtalslagen och tillämplig svensk banklagstiftning.',
      keywords: ['fullmakt bank', 'myndighet', 'ekonomi', 'skatteverket'],
    } as Template);
  });

  // === BOENDE & VARDAG (71-85) ===
  const boendeTemplates: Partial<Template>[] = [
    { id: 71, slug: 'fullmakt-bostadskop', name: 'Fullmakt för bostadsköp', description: 'Fullmakt att köpa bostad för annans räkning.', badge: 'premium', usageCount: 6789 },
    { id: 72, slug: 'fullmakt-bostadsforening', name: 'Fullmakt för bostadsförening', description: 'Fullmakt att företräda vid bostadsföreningsstämma.', badge: 'popular', usageCount: 9876 },
    { id: 73, slug: 'fullmakt-hyreskontrakt', name: 'Fullmakt för hyreskontrakt', description: 'Fullmakt att teckna hyreskontrakt.', badge: 'gratis', usageCount: 5432 },
    { id: 74, slug: 'fullmakt-elbolag', name: 'Fullmakt för elbolag', description: 'Fullmakt att hantera elavtal åt annan.', badge: 'gratis', usageCount: 3456 },
    { id: 75, slug: 'fullmakt-bredbandsleverantor', name: 'Fullmakt för bredbandsleverantör', description: 'Fullmakt att hantera bredbandsabonnemang.', badge: 'gratis', usageCount: 2345 },
    { id: 76, slug: 'fullmakt-paket-post', name: 'Fullmakt för paket och post', description: 'Fullmakt att hämta ut paket och post.', badge: 'popular', usageCount: 13456 },
    { id: 77, slug: 'fullmakt-lagenhetsbyte', name: 'Fullmakt vid lägenhetsbyte', description: 'Fullmakt att genomföra lägenhetsbyte.', badge: 'premium', usageCount: 2345 },
    { id: 78, slug: 'fullmakt-forsakring-boende', name: 'Fullmakt för boendeförsäkring', description: 'Fullmakt att teckna hemförsäkring.', badge: 'gratis', usageCount: 3456 },
    { id: 79, slug: 'fullmakt-renovering', name: 'Fullmakt för renovering', description: 'Fullmakt att godkänna renoveringsarbeten.', badge: 'gratis', usageCount: 2345 },
    { id: 80, slug: 'fullmakt-andrahandsuthyrning', name: 'Fullmakt för andrahandsuthyrning', description: 'Fullmakt att hyra ut bostad i andra hand.', badge: 'gratis', usageCount: 4567 },
    { id: 81, slug: 'fullmakt-vattenavlasning', name: 'Fullmakt för vattenavläsning', description: 'Fullmakt att ge tillträde för vattenavläsning.', badge: 'gratis', usageCount: 1234 },
    { id: 82, slug: 'fullmakt-sophantering', name: 'Fullmakt för sophantering', description: 'Fullmakt att hantera avfallsärenden.', badge: 'gratis', usageCount: 987 },
    { id: 83, slug: 'fullmakt-garage-parkering', name: 'Fullmakt för garage/parkering', description: 'Fullmakt att hantera garageplats/parkering.', badge: 'gratis', usageCount: 2345 },
    { id: 84, slug: 'fullmakt-nycklar-tillgang', name: 'Fullmakt för nycklar och tillgång', description: 'Fullmakt att överlämna nycklar till tredje part.', badge: 'gratis', usageCount: 3456 },
    { id: 85, slug: 'fullmakt-bostadsforsaljning', name: 'Fullmakt för bostadsförsäljning', description: 'Fullmakt att sälja bostad för annans räkning.', badge: 'premium', usageCount: 5678 },
  ];

  boendeTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Boende & Vardag',
      categorySlug: 'boende-vardag',
      longDescription: `Denna mall för ${t.name?.toLowerCase()} är juridiskt granskad och anpassad för svenska bostadsmarknaden.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'syfte', label: 'Specifikt ärende', type: 'textarea', placeholder: 'Beskriv ärendet...', required: true, group: 'detaljer' },
        { id: 'fastighet', label: 'Fastighet/Adress', type: 'address', placeholder: 'Adress till berörd bostad', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Behöver fullmakten registreras?', a: 'Nej, en fullmakt för boende behöver inte registreras men bör förvaras säkert.' },
        { q: 'Gäller denna för bostadsförsäljning?', a: 'Vid fastighetsförsäljning krävs skriftlig fullmakt som uppfyller formkrav i jordabalken.' },
        { q: 'Kan hyresvärden neka?', a: 'En hyresvärd kan inte neka en korrekt utformad fullmakt, men kan kräva att den uppfyller vissa formkrav.' },
        { q: 'Behöver den bevittnas?', a: 'Rekommenderas, särskilt vid fastighetsaffärer.' },
        { q: 'Kan jag ändra fullmakten i efterhand?', a: 'Ja, du kan alltid upprätta en ny fullmakt som ersätter den tidigare.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt jordabalken och hyreslagen.',
      keywords: ['fullmakt bostad', 'hyreskontrakt', 'bostadsrätt', 'boende'],
    } as Template);
  });

  // === FÖRENING, SKOLA & FRITID (86-100) ===
  const foreningTemplates: Partial<Template>[] = [
    { id: 86, slug: 'fullmakt-foreningsstamma', name: 'Fullmakt för föreningsstämma', description: 'Fullmakt att rösta vid föreningsstämma.', badge: 'popular', usageCount: 7654 },
    { id: 87, slug: 'medgivande-skolaktivitet', name: 'Medgivande för skolaktivitet', description: 'Medgivande för barn att delta i skolaktivitet.', badge: 'gratis', usageCount: 8765 },
    { id: 88, slug: 'fullmakt-idrottsforening', name: 'Fullmakt för idrottsförening', description: 'Fullmakt att företräda i idrottsföreningsärenden.', badge: 'gratis', usageCount: 3456 },
    { id: 89, slug: 'medgivande-foto-film', name: 'Medgivande för foto och film', description: 'Medgivande att fotografera/filma barn vid aktivitet.', badge: 'popular', usageCount: 11234 },
    { id: 90, slug: 'fullmakt-styrelsearbete', name: 'Fullmakt för styrelsearbete', description: 'Fullmakt att agera som ställföreträdare i styrelse.', badge: 'gratis', usageCount: 2345 },
    { id: 91, slug: 'medgivande-utflykt', name: 'Medgivande för utflykt', description: 'Medgivande för barn att delta i utflykt.', badge: 'gratis', usageCount: 6543 },
    { id: 92, slug: 'fullmakt-fritidsaktivitet', name: 'Fullmakt för fritidsaktivitet', description: 'Fullmakt att anmäla barn till fritidsaktivitet.', badge: 'gratis', usageCount: 4321 },
    { id: 93, slug: 'medgivande-simskola', name: 'Medgivande för simskola', description: 'Medgivande för barn att delta i simskola.', badge: 'gratis', usageCount: 5432 },
    { id: 94, slug: 'fullmakt-scouterna', name: 'Fullmakt för Scouterna', description: 'Fullmakt för scoutverksamhet.', badge: 'gratis', usageCount: 2345 },
    { id: 95, slug: 'medgivande-musicerande', name: 'Medgivande för musicerande', description: 'Medgivande för barn att delta i musikverksamhet.', badge: 'gratis', usageCount: 1234 },
    { id: 96, slug: 'fullmakt-kulturskola', name: 'Fullmakt för kulturskola', description: 'Fullmakt att hantera kulturskoleärenden.', badge: 'gratis', usageCount: 2345 },
    { id: 97, slug: 'medgivande-tavling', name: 'Medgivande vid tävling', description: 'Medgivande för barn att delta i tävling.', badge: 'gratis', usageCount: 3456 },
    { id: 98, slug: 'fullmakt-foraldrautskott', name: 'Fullmakt för föräldraföreningens utskott', description: 'Fullmakt att företräda i föräldraföreningens utskott.', badge: 'gratis', usageCount: 1234 },
    { id: 99, slug: 'medgivande-skidresa', name: 'Medgivande för skidresa', description: 'Medgivande för barn att delta i skidresa.', badge: 'gratis', usageCount: 4567 },
    { id: 100, slug: 'fullmakt-fritidsgard', name: 'Fullmakt för fritidsgård', description: 'Fullmakt att anmäla barn till fritidsgård.', badge: 'gratis', usageCount: 2345 },
  ];

  foreningTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Förening, Skola & Fritid',
      categorySlug: 'forening-skola',
      longDescription: `${t.name} – en enkel och juridiskt korrekt mall för förenings- och fritidsändamål.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'forening', label: 'Förening/Skola', type: 'text', placeholder: 'Namn', required: false, group: 'detaljer' },
        { id: 'syfte', label: 'Specifik aktivitet/ärende', type: 'textarea', placeholder: 'Beskriv...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Behöver skolan godkänna fullmakten?', a: 'Skolor och föreningar accepterar vanligtvis giltiga fullmakter och medgivanden.' },
        { q: 'Kan bägge vårdnadshavare behöva skriva under?', a: 'Vid gemensam vårdnad kan bägge vårdnadshavares underskrift krävas.' },
        { q: 'Gäller medgivandet automatiskt för framtida aktiviteter?', a: 'Nej, varje aktivitet kräver normalt ett separat medgivande om inget annat anges.' },
        { q: 'Kan föreningen kräva specifik blankett?', a: 'Vissa föreningar har egna blanketter, men denna fullmakt fungerar som komplement.' },
        { q: 'Vad om mitt barn inte vill delta?', a: 'Barnets vilja ska respekteras. Medgivandet kan alltid återkallas.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig för förenings- och skolverksamhet i Sverige.',
      keywords: ['fullmakt förening', 'medgivande skola', 'fritid'],
    } as Template);
  });

  // === DJUR & HUSDJUR (101-108) ===
  const djurTemplates: Partial<Template>[] = [
    { id: 101, slug: 'fullmakt-veterinarbesok', name: 'Fullmakt för veterinärbesök', description: 'Fullmakt att ta annans djur till veterinär.', badge: 'popular', usageCount: 5678 },
    { id: 102, slug: 'medgivande-djurvard', name: 'Medgivande för tillfällig djurvård', description: 'Medgivande för hundvakt eller kattpassning.', badge: 'gratis', usageCount: 4321 },
    { id: 103, slug: 'fullmakt-kennelvistelse', name: 'Fullmakt för kennelvistelse', description: 'Fullmakt att lämna djur på kennel.', badge: 'gratis', usageCount: 2345 },
    { id: 104, slug: 'medgivande-kastration-djur', name: 'Medgivande för kastration/operation av djur', description: 'Medgivande för operation av djur.', badge: 'gratis', usageCount: 1234 },
    { id: 105, slug: 'fullmakt-djurtransport', name: 'Fullmakt för djurtransport', description: 'Fullmakt att transportera annans djur.', badge: 'gratis', usageCount: 987 },
    { id: 106, slug: 'intyg-djur-resa-utomlands', name: 'Intyg för djurets resa utomlands', description: 'Komplement till husdjurspass vid utlandsresa.', badge: 'premium', usageCount: 1567 },
    { id: 107, slug: 'fullmakt-djurforsakring', name: 'Fullmakt för djurförsäkring', description: 'Fullmakt att teckna djurförsäkring.', badge: 'gratis', usageCount: 876 },
    { id: 108, slug: 'medgivande-inkop-djur', name: 'Medgivande vid inköp av djur', description: 'Medgivande att köpa djur för annans räkning.', badge: 'gratis', usageCount: 654 },
  ];

  djurTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Djur & Husdjur',
      categorySlug: 'djur-husdjur',
      longDescription: `${t.name} – för dig som behöver en juridisk handling för djurrelaterade ärenden.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'djur_namn', label: 'Djurets namn', type: 'text', placeholder: 'Fido', required: true, group: 'detaljer' },
        { id: 'djur_art', label: 'Djurart', type: 'select', options: ['Hund', 'Katt', 'Häst', 'Kanin', 'Fågel', 'Reptil', 'Annat'], required: true, group: 'detaljer' },
        { id: 'syfte', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Accepteras fullmakten av veterinärer?', a: 'Ja, de flesta veterinärkliniker accepterar en korrekt utformad fullmakt.' },
        { q: 'Behöver djurets registrering anges?', a: 'Det rekommenderas att ange chipnummer om djuret är chippmärkt.' },
        { q: 'Kan jag ge fullmakt för nödvändiga behandlingar?', a: 'Ja, du kan specificera vilka typer av behandlingar fullmakten omfattar.' },
        { q: 'Gäller fullmakten hos alla veterinärer?', a: 'Ja, fullmakten är generell men kan specificeras till viss klinik.' },
        { q: 'Behöver den bevittnas?', a: 'Nej, men det kan rekommenderas vid omfattande fullmakter.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt svensk djurskyddslagstiftning.',
      keywords: ['fullmakt djur', 'veterinär', 'husdjur'],
    } as Template);
  });

  // === SENIORER & DIGITAL OMSORG (109-116) ===
  const seniorTemplates: Partial<Template>[] = [
    { id: 109, slug: 'fullmakt-internetbank-senior', name: 'Fullmakt för internetbanksärenden (senior)', description: 'Fullmakt att hjälpa äldre med internetbankärenden.', badge: 'popular', usageCount: 6543 },
    { id: 110, slug: 'fullmakt-digital-brevlada', name: 'Fullmakt för digital brevlåda', description: 'Fullmakt att hantera Kivra/e-Boks åt annan.', badge: 'gratis', usageCount: 4321 },
    { id: 111, slug: 'fullmakt-god-man-komplement', name: 'Fullmakt god man-komplement', description: 'Kompletterande fullmakt för god man.', badge: 'premium', usageCount: 3456 },
    { id: 112, slug: 'medgivande-hemtjanst-digital', name: 'Medgivande för hemtjänst digital kommunikation', description: 'Medgivande för digital kommunikation med hemtjänst.', badge: 'gratis', usageCount: 2345 },
    { id: 113, slug: 'fullmakt-abonnemang', name: 'Fullmakt för abonnemang/prenumerationer', description: 'Fullmakt att hantera abonnemang åt annan.', badge: 'gratis', usageCount: 3456 },
    { id: 114, slug: 'intyg-digital-tillganglighet', name: 'Intyg om digital tillgänglighet', description: 'Intyg om behov av hjälp med digitala tjänster.', badge: 'gratis', usageCount: 1234 },
    { id: 115, slug: 'fullmakt-mobiloperator-senior', name: 'Fullmakt för mobiloperatör (senior)', description: 'Fullmakt att hantera mobilabonnemang för äldre.', badge: 'gratis', usageCount: 2345 },
    { id: 116, slug: 'medgivande-digital-halsoapp', name: 'Medgivande för digital hälsoapp', description: 'Medgivande att hantera hälsoapp åt annan.', badge: 'gratis', usageCount: 987 },
  ];

  seniorTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Seniorer & Digital Omsorg',
      categorySlug: 'seniorer-omsorg',
      longDescription: `${t.name} – speciellt framtagen för äldres behov i en digital värld.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'tjanst', label: 'Berörd tjänst/leverantör', type: 'text', placeholder: 'T.ex. Kivra, Handelsbanken', required: false, group: 'detaljer' },
        { id: 'syfte', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Kan denna användas istället för god man?', a: 'Nej, denna fullmakt ersätter inte ett godmanskap men kan komplettera det.' },
        { q: 'Kräver tjänsterna BankID?', a: 'Många digitala tjänster kräver BankID. Fullmakten kan ge tillgång via ombud.' },
        { q: 'Gäller fullmakten hos alla banker?', a: 'De flesta banker accepterar fullmakten, men kan ha egna formulär.' },
        { q: 'Kan jag ge fullmakt för alla digitala tjänster?', a: 'Ja, du kan specificera vilka tjänster fullmakten gäller för.' },
        { q: 'Behöver den förnya?', a: 'Det rekommenderas att se över fullmakten årligen.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig för digitala tjänster i Sverige. Ersätter inte godmanskap.',
      keywords: ['fullmakt senior', 'digital omsorg', 'äldre', 'internetbank'],
    } as Template);
  });

  // === DIGITALT & DÖDSBO (117-124) ===
  const digitaltTemplates: Partial<Template>[] = [
    { id: 117, slug: 'fullmakt-digital-dodsboforvaltning', name: 'Fullmakt för digital dödsboförvaltning', description: 'Fullmakt att hantera dödsboets digitala tillgångar.', badge: 'premium', usageCount: 3456 },
    { id: 118, slug: 'medgivande-sociala-medier-dodsfall', name: 'Medgivande för sociala mediekonton (dödsfall)', description: 'Medgivande att hantera sociala mediekonton vid dödsfall.', badge: 'gratis', usageCount: 2345 },
    { id: 119, slug: 'fullmakt-domanhantering', name: 'Fullmakt för domänhantering', description: 'Fullmakt att hantera domännamn åt annan.', badge: 'gratis', usageCount: 1234 },
    { id: 120, slug: 'medgivande-prenumerationsavslut', name: 'Medgivande för prenumerationsavslut efter dödsfall', description: 'Medgivande att avsluta prenumerationer efter dödsfall.', badge: 'gratis', usageCount: 1567 },
    { id: 121, slug: 'fullmakt-kryptovaluta', name: 'Fullmakt för kryptovaluta/digitala tillgångar', description: 'Fullmakt att hantera kryptovaluta och digitala tillgångar.', badge: 'premium', usageCount: 2345 },
    { id: 122, slug: 'intyg-digital-arvshandling', name: 'Intyg för digital arvshandling', description: 'Intyg avseende digitalt arv.', badge: 'premium', usageCount: 1234 },
    { id: 123, slug: 'fullmakt-epostarkiv', name: 'Fullmakt för e-postarkiv/molntjänster', description: 'Fullmakt att hantera e-post och molntjänster.', badge: 'gratis', usageCount: 987 },
    { id: 124, slug: 'medgivande-digital-minnessida', name: 'Medgivande för digital minnessida', description: 'Medgivande att skapa och hantera digital minnessida.', badge: 'gratis', usageCount: 876 },
    // === TILLAGDA 2026-04-22 ===
    { id: 125, slug: 'framtidsfullmakt-komplett-2026', name: 'Framtidsfullmakt 2026 – komplett mall', description: 'Komplett framtidsfullmakt som träder i kraft om du blir oförmögen att fatta beslut. Täcker ekonomi, vård och bostad.', badge: 'popular', usageCount: 14520 },
    { id: 126, slug: 'generalfullmakt-privatperson-2026', name: 'Generalfullmakt för privatperson', description: 'Bred fullmakt som täcker de flesta rättshandlingar. Lämplig när du behöver en person att agera i ditt ställe.', badge: 'premium', usageCount: 8932 },
    { id: 127, slug: 'dodsbo-fullmakt-arvinge-2026', name: 'Dödsbo – fullmakt för arvinge', description: 'Fullmakt som gör det möjligt för en arvinge att agera för dödsboets räkning i kontakter med banker, myndigheter och fastighetsbolag.', badge: 'popular', usageCount: 11240 },
  ];

  digitaltTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Digitalt & Dödsbo',
      categorySlug: 'digitalt-dodsbo',
      longDescription: `${t.name} – för hantering av digitala tillgångar och dödsboärenden i den moderna världen.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'tjanst', label: 'Berörd digital tjänst', type: 'text', placeholder: 'T.ex. Google, Facebook, Avanza', required: false, group: 'detaljer' },
        { id: 'syfte', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Kan digitala tillgångar ärvas?', a: 'Ja, digitala tillgångar ingår i kvarlåtenskapen men reglerna varierar beroende på tjänst.' },
        { q: 'Hur hanteras kryptovaluta vid dödsfall?', a: 'Kryptovaluta betraktas som egendom och ingår i bouppteckningen.' },
        { q: 'Kan jag ge fullmakt för sociala medier?', a: 'Ja, men varje plattform har egna regler för kontohantering vid dödsfall.' },
        { q: 'Behöver dödsfallsintyg bifogas?', a: 'Ja, de flesta tjänster kräver dödsfallsintyg för att godkänna fullmakten.' },
        { q: 'Gäller fullmakten internationellt?', a: 'Den gäller i Sverige men utländska tjänster kan ha andra krav.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt svensk arvsrätt och tillämplig digital lagstiftning.',
      keywords: ['fullmakt dödsbo', 'digitalt arv', 'kryptovaluta', 'sociala medier'],
    } as Template);
  });


  // Framtidsfullmakt 2026
  templates.push({
    id: 125,
    slug: 'framtidsfullmakt-komplett-2026',
    name: 'Framtidsfullmakt 2026 – komplett mall',
    category: 'Seniorer & Omsorg',
    categorySlug: 'seniorer-omsorg',
    description: 'Komplett framtidsfullmakt som träder i kraft om du blir oförmögen att fatta beslut. Täcker ekonomi, vård och bostad.',
    longDescription: 'En framtidsfullmakt är ett av de viktigaste juridiska dokumenten du kan upprätta. Till skillnad från en vanlig fullmakt träder den i kraft automatiskt om du drabbas av sjukdom, demens eller olycka och inte längre kan fatta egna beslut. Täcker ekonomiska beslut, fastighetsförvaltning, sjukvårdskontakter och personliga frågor.',
    badge: 'popular',
    usageCount: 14520,
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'fullmaktshavare_namn', label: 'Fullmaktshavarens fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'fullmaktshavare_pnr', label: 'Personnummer (fullmaktshavare)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'fullmaktshavare_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, syskon', required: true, group: 'havare' },
      { id: 'ersattare_namn', label: 'Ersättare (valfritt)', type: 'text', placeholder: 'Person som träder in om fullmaktshavaren inte kan', required: false, group: 'havare' },
      { id: 'ekonomi_belopp', label: 'Max engångsbelopp för ekonomiska beslut', type: 'text', placeholder: 'T.ex. 500 000 kr, obegränsat', required: false, group: 'detaljer' },
      { id: 'fastigheter', label: 'Fastigheter som ingår', type: 'textarea', placeholder: 'Fastighetsbeteckning eller "alla ägda fastigheter"', required: false, group: 'detaljer' },
      { id: 'bevittnad_ort', label: 'Ort för bevittning', type: 'text', placeholder: 'Stockholm', required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Vad är skillnaden på framtidsfullmakt och vanlig fullmakt?', a: 'En vanlig fullmakt gäller medan du kan fatta egna beslut. Framtidsfullmakten träder i kraft JUST NÄR du inte längre kan – vid demens, olycka eller allvarlig sjukdom. Den kräver bevittning av två vittnen.' },
      { q: 'Måste en framtidsfullmakt bevittnas?', a: 'Ja. En framtidsfullmakt måste bevittnas av två vuxna vittnen som inte är nära släktingar och inte är fullmaktshavare. Utan korrekt bevittning är den ogiltig.' },
      { q: 'Kan jag ångra en framtidsfullmakt?', a: 'Ja, du kan återkalla framtidsfullmakten när du fortfarande har rättslig handlingsförmåga. Meddela fullmaktshavaren och eventuell ersättare skriftligen.' },
      { q: 'Vad händer om jag inte har en framtidsfullmakt?', a: 'Utan framtidsfullmakt kan domstolen utse en god man eller förvaltare – en process som tar tid och kan leda till att en okänd person hanterar din ekonomi.' },
      { q: 'Gäller framtidsfullmakten utomlands?', a: 'En svensk framtidsfullmakt gäller primärt i Sverige. För ärenden i andra länder kan lokala krav tillkomma – kontakta det landets myndigheter.' },
    ],
    relatedIds: [126, 127],
    legalInfo: 'Regleras av Lag (2017:310) om framtidsfullmakter. Kräver bevittning av två vittnen.',
    keywords: ['framtidsfullmakt', 'fullmakt vid demens', 'fullmakt sjukdom', 'framtidsfullmakt mall', 'lagen om framtidsfullmakter'],
  } as Template);

  // Generalfullmakt 2026
  templates.push({
    id: 126,
    slug: 'generalfullmakt-privatperson-2026',
    name: 'Generalfullmakt för privatperson',
    category: 'Ekonomi & Myndigheter',
    categorySlug: 'ekonomi-myndigheter',
    description: 'Bred fullmakt som täcker de flesta rättshandlingar. Lämplig när du behöver en person att agera i ditt ställe.',
    longDescription: 'En generalfullmakt ger fullmaktshavaren befogenhet att agera på dina vägnar i de flesta situationer – bank, myndigheter, fastighetsaffärer och avtal. Till skillnad från specialfullmakter är den inte begränsad till ett specifikt ärende. Används ofta vid långvarig utlandsresa, sjukdom eller när du av praktiska skäl inte kan närvara.',
    badge: 'premium',
    usageCount: 8932,
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'fullmaktshavare_namn', label: 'Fullmaktshavarens fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'fullmaktshavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
      { id: 'undantag', label: 'Undantag (vad ingår INTE)', type: 'textarea', placeholder: 'T.ex. ej rätt att sälja fast egendom, ej rätt att ge bort egendom', required: false, group: 'detaljer' },
    ],
    faq: [
      { q: 'Vad kan en generalfullmakt användas till?', a: 'En generalfullmakt ger fullmaktshavaren rätt att hantera bankärenden, skriva avtal, företräda dig hos myndigheter, sälja eller köpa lös egendom och mycket mer – om du inte specifikt undantar något.' },
      { q: 'Kan generalfullmakten ge rätt att sälja min bostad?', a: 'Ja, om inget undantag anges kan fullmaktshavaren i princip sälja fast egendom. Vill du förhindra detta, lägg till ett undantag i fullmakten.' },
      { q: 'Måste en generalfullmakt registreras?', a: 'Nej, det finns ingen obligatorisk registrering. Vissa banker och myndigheter kan kräva att fullmakten är bevittnad eller notariellt bekräftad.' },
      { q: 'Hur återkallar man en generalfullmakt?', a: 'Meddela fullmaktshavaren skriftligen och informera berörda institutioner (bank, myndigheter). Generalfullmakten upphör automatiskt om du förlorar rättslig handlingsförmåga – då behövs framtidsfullmakt istället.' },
      { q: 'Är en generalfullmakt giltig efter dödsfall?', a: 'Nej. En fullmakt upphör alltid vid fullmaktsgivarens dödsfall. Dödsboet hanteras av dödsbodelägarna gemensamt eller via boutredningsman.' },
    ],
    relatedIds: [125, 127],
    legalInfo: 'Regleras av avtalslagen (1915:218). Bevittning rekommenderas men krävs ej i alla situationer.',
    keywords: ['generalfullmakt', 'fullmakt privatperson', 'bred fullmakt', 'fullmakt bank', 'fullmakt myndigheter'],
  } as Template);

  // Dödsbo-fullmakt 2026
  templates.push({
    id: 127,
    slug: 'dodsbo-fullmakt-arvinge-2026',
    name: 'Dödsbo – fullmakt för arvinge',
    category: 'Digitalt & Dödsbo',
    categorySlug: 'digitalt-dodsbo',
    description: 'Fullmakt som gör det möjligt för en arvinge att agera för dödsboets räkning i kontakter med banker, myndigheter och fastighetsbolag.',
    longDescription: 'När en närstående går bort behöver dödsboet ofta agera snabbt – avsluta hyresavtal, kontakta banken, avboka abonnemang och sköta fastighetsärenden. Denna fullmakt ger en utsedd arvinge eller anhörig rätt att agera på dödsboets vägnar. Den kräver att alla dödsbodelägare undertecknar om inget annat avtalas.',
    badge: 'popular',
    usageCount: 11240,
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'avliden_pnr', label: 'Personnummer (avliden)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'dodsdatum', label: 'Dödsdatum', type: 'date', required: true, group: 'givare' },
      { id: 'fullmaktshavare_namn', label: 'Fullmaktshavarens fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'fullmaktshavare_pnr', label: 'Personnummer (fullmaktshavare)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'fullmaktshavare_relation', label: 'Relation till den avlidne', type: 'text', placeholder: 'T.ex. son, dotter, make/maka', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'T.ex. avsluta bankkonton, hantera hyreskontrakt, sköta fastighetsförsäljning', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till arvskifte slutförs'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Behöver alla arvingar skriva under dödsbo-fullmakten?', a: 'Som regel ja. Dödsboet ägs gemensamt av alla dödsbodelägare och beslut kräver samtycke. En enskild arvinge kan inte ensam utfärda fullmakt på dödsboets vägnar utan de andras godkännande.' },
      { q: 'Vilka handlingar kan fullmaktshavaren utföra?', a: 'Fullmaktshavaren kan kontakta banker, avsluta abonnemang, hantera hyreskontrakt, kommunicera med Skatteverket och sköta fastighetsärenden – beroende på vad som specificerats i fullmakten.' },
      { q: 'Hur länge gäller dödsbo-fullmakten?', a: 'Den gäller den period som anges i fullmakten, normalt tills arvskiftet är klart. Den upphör automatiskt när dödsboet avvecklats och alla tillgångar fördelats.' },
      { q: 'Kan man ha en boutredningsman istället?', a: 'Ja, om dödsbodelägarna inte är eniga kan tingsrätten utse en boutredningsman som förvaltar dödsboet oberoende. Det är dyrare men löser konflikter.' },
      { q: 'Räcker dödsfallsintyget istället för fullmakt?', a: 'Dödsfallsintyget bevisar dödsfallet men ger inte automatiskt befogenhet att agera. Fullmakt krävs för att en specifik person ska kunna agera för dödsboet.' },
    ],
    relatedIds: [125, 126],
    legalInfo: 'Grundas på ärvdabalken (1958:637). Kräver samtycke från samtliga dödsbodelägare.',
    keywords: ['dödsbo fullmakt', 'fullmakt arvinge', 'hantera dödsbo', 'dödsbodelägare fullmakt', 'arvinge fullmakt bank'],
  } as Template);

  return templates;
}

export const templates = generateTemplates();

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find(t => t.slug === slug);
}

export function getTemplatesByCategory(categorySlug: string): Template[] {
  return templates.filter(t => t.categorySlug === categorySlug);
}

export function getPopularTemplates(count = 8): Template[] {
  return [...templates].sort((a, b) => b.usageCount - a.usageCount).slice(0, count);
}

export function searchTemplates(query: string): Template[] {
  const q = query.toLowerCase();
  return templates.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.includes(q))
  );
}
