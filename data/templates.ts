import { fieldRoleFor, type FieldKey, type FieldRole } from './field-roles';

export interface Template {
  id: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription: string;
  fields: TemplateField[];
  faq: { q: string; a: string }[];
  relatedIds: number[];
  legalInfo: string;
  keywords: string[];
  /** Mallen kan köpas som tvåspråkig PDF – svensk original + engelsk översättning. */
  bilingual?: boolean;
  /** Dokumentrubrik i PDF:en (FULLMAKT, MEDGIVANDE, INTYG …). Standard: FULLMAKT. */
  documentTitle?: string;
  /** Mallens svenska standardklausul, skrivs ut i uppdragsrutan i PDF:en. */
  standardText?: string;
  /** Engelska motsvarigheter till mallens standardtexter (endast tvåspråkiga mallar). */
  en?: TemplateTranslation;
  /**
   * Dokumenttyp med egen PDF-layout. 'framtidsfullmakt' = lag (2017:310):
   * lagstadgade formuleringar, obligatoriskt vittnesavsnitt, ingen giltighetstid.
   */
  documentKind?: 'framtidsfullmakt';
  /** Ömsesidig framtidsfullmakt: två dokument i samma PDF, ett per fullmaktsgivare. */
  mutual?: boolean;
  /** Egna rubriker för formulärets partsavsnitt. */
  groupLabels?: { givare: string; givareHelp: string; havare: string; havareHelp: string };
  /** Rättslig grund som visas i köprutan på mallsidan. Standard: "Enligt svensk avtalsrätt". */
  legalBasisLabel?: string;
  /**
   * Uppdragets innehåll i PDF:en för mallar som saknar ett eget uppdragsfält.
   * Skrivs efter "att för min räkning och i mitt namn:".
   */
  uppdragText?: string;
}

/** Engelsk version av en malls standardtexter. Användarens egna uppgifter översätts aldrig. */
export interface TemplateTranslation {
  name: string;
  /** Dokumentrubrik på engelska, t.ex. POWER OF ATTORNEY eller PARENTAL CONSENT FOR TRAVEL. */
  documentTitle: string;
  category: string;
  description: string;
  longDescription: string;
  legalInfo: string;
  /** Engelsk motsvarighet till mallens svenska standardklausul. */
  standardText: string;
}

/** Ett formulärfält som det skrivs i malldatan nedan, före rolltilldelningen. */
export interface TemplateFieldInput {
  id: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'select' | 'checkbox' | 'personnummer' | 'email' | 'phone' | 'address';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  group?: 'givare' | 'havare' | 'detaljer';
  helpText?: string;
}

/** En mall som den skrivs i malldatan, före rolltilldelningen. */
type TemplateInput = Omit<Template, 'fields'> & { fields: TemplateFieldInput[] };

/** Ett formulärfält med uttrycklig roll (se data/field-roles.ts). */
export interface TemplateField extends TemplateFieldInput {
  /** Avsnittet i PDF:en. */
  role: FieldRole;
  /** Var värdet återges i löptext (uppdragsmeningen, underskrifter). */
  key?: FieldKey;
  /** Person 1 eller 2 när rollen har två personer. */
  person?: 1 | 2;
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

const commonGivareFields: TemplateFieldInput[] = [
  { id: 'givare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Andersson', required: true, group: 'givare' },
  { id: 'givare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'givare' },
  { id: 'givare_adress', label: 'Adress', type: 'address', placeholder: 'Storgatan 1, 111 22 Stockholm', required: true, group: 'givare' },
  { id: 'givare_epost', label: 'E-postadress', type: 'email', placeholder: 'anna@exempel.se', required: false, group: 'givare' },
  { id: 'givare_telefon', label: 'Telefonnummer', type: 'phone', placeholder: '070-123 45 67', required: false, group: 'givare' },
];

const commonHavareFields: TemplateFieldInput[] = [
  { id: 'havare_namn', label: 'Fullmaktstagarens namn', type: 'text', placeholder: 'Erik Eriksson', required: true, group: 'havare' },
  { id: 'havare_pnr', label: 'Personnummer/Org.nr', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'havare' },
  { id: 'havare_relation', label: 'Relation till fullmaktsgivaren', type: 'select', options: ['Förälder', 'Make/Maka', 'Syskon', 'Annan släkting', 'Vän', 'Kollega', 'Juridiskt ombud', 'Annat'], required: true, group: 'havare' },
  { id: 'havare_adress', label: 'Adress', type: 'address', placeholder: 'Lillgatan 5, 222 33 Göteborg', required: false, group: 'havare' },
];

const dateRangeFields: TemplateFieldInput[] = [
  { id: 'giltig_fran', label: 'Giltig från', type: 'date', required: true, group: 'detaljer' },
  { id: 'giltig_till', label: 'Giltig till', type: 'date', required: true, group: 'detaljer' },
];

function generateTemplates(): TemplateInput[] {
  const templates: TemplateInput[] = [];

  // === FÖRÄLDRAR & BARN (1-20) ===
  const foraldrarTemplates: Partial<TemplateInput>[] = [
    { id: 1, slug: 'foraldraredgivande-resa-annan-vuxen', name: 'Föräldramedgivande – resa med annan vuxen', description: 'Medgivande för barn att resa med annan vuxen än vårdnadshavare.' },
    { id: 2, slug: 'reseintyg-barn-internationell', name: 'Reseintyg för barn – internationell resa', description: 'Intyg som krävs vid internationella resor med barn.' },
    { id: 3, slug: 'resefullmakt-barn-eu', name: 'Resefullmakt för barn inom EU', description: 'Fullmakt specifikt anpassad för resor inom EU med barn.' },
    { id: 4, slug: 'medgivande-skolresa', name: 'Medgivande vid skolresa', description: 'Medgivande för barn att delta i skolresa.' },
    { id: 5, slug: 'medgivande-lager-kollo', name: 'Medgivande vid läger / kollo', description: 'Medgivande för barn att delta i läger eller kolloverksamhet.' },
    { id: 6, slug: 'medgivande-foreningsresa', name: 'Medgivande vid föreningsresa', description: 'Medgivande för barn att resa med förening eller lag.' },
    { id: 7, slug: 'medgivande-barn-bo-annan-vuxen', name: 'Medgivande för barn att bo hos annan vuxen', description: 'Tillfälligt medgivande för barn att bo hos annan vuxen.' },
    { id: 8, slug: 'medgivande-ensam-resa-minderarig', name: 'Medgivande vid ensam resa för minderårig', description: 'Medgivande för minderårig att resa ensam.' },
    { id: 9, slug: 'fullmakt-barns-sjukvard', name: 'Fullmakt för barnets sjukvård', description: 'Fullmakt för annan vuxen att hantera barnets sjukvårdskontakter.' },
    { id: 10, slug: 'medgivande-akut-vard', name: 'Medgivande vid akut vård', description: 'Akutmedgivande för vård av barn när vårdnadshavare ej är tillgänglig.' },
    { id: 11, slug: 'fullmakt-bonusforalder', name: 'Fullmakt till bonusförälder', description: 'Fullmakt som ger bonusförälder rätt att agera för barnets räkning.' },
    { id: 12, slug: 'medgivande-passansokan', name: 'Medgivande för passansökan', description: 'Medgivande från vårdnadshavare för passansökan åt barn.' },
    { id: 13, slug: 'medgivande-bankarenden-barn', name: 'Medgivande för bankärenden för barn', description: 'Fullmakt för att hantera bankärenden för minderårig.' },
    { id: 14, slug: 'fullmakt-slakting-resa', name: 'Fullmakt till släkting vid resa', description: 'Fullmakt till släkting för att resa med barn.' },
    { id: 15, slug: 'medgivande-overnattning-utomlands', name: 'Medgivande för övernattning utomlands', description: 'Medgivande för barn att övernatta utomlands.' },
    { id: 16, slug: 'fullmakt-skolarenden', name: 'Fullmakt för skolärenden', description: 'Fullmakt för annan person att hantera barnets skolärenden.' },
    { id: 17, slug: 'medgivande-byte-skola', name: 'Medgivande vid byte av skola', description: 'Medgivande från bägge vårdnadshavare vid byte av skola.' },
    { id: 18, slug: 'intyg-gemensam-vardnad', name: 'Intyg om gemensam vårdnad', description: 'Intyg som bekräftar gemensam vårdnad om barn.' },
    { id: 19, slug: 'intyg-ensam-vardnad', name: 'Intyg om ensam vårdnad', description: 'Intyg som bekräftar ensam vårdnad om barn.' },
    { id: 20, slug: 'medgivande-idrottsstavling-utomlands', name: 'Medgivande vid idrottstävling utomlands', description: 'Medgivande för barn att delta i idrottstävling utomlands.' },
  ];

  foraldrarTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Föräldrar & Barn',
      categorySlug: 'foraldrar-barn',
      longDescription: `Denna mall hjälper dig att snabbt och enkelt skapa ${t.name?.toLowerCase()}. Dokumentet är utformat enligt svensk avtalsrätt och anpassat för svenska förhållanden och de situationer där myndigheter och institutioner vanligtvis efterfrågar en fullmakt.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'barn_namn', label: 'Barnets namn', type: 'text', placeholder: 'Lisa Andersson', required: true, group: 'detaljer' },
        { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'detaljer' },
        { id: 'syfte', label: 'Syfte med fullmakten', type: 'textarea', placeholder: 'Beskriv syftet...', required: true, group: 'detaljer' },
        { id: 'begransningar', label: 'Eventuella begränsningar', type: 'textarea', placeholder: 'Ange eventuella begränsningar...', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Är detta dokument juridiskt bindande?', a: 'En fullmakt eller ett medgivande har i regel inget formkrav, men vissa ärenden har särskilda krav. Det är mottagaren som avgör om dokumentet godtas, så kontrollera med mottagaren i förväg.' },
        { q: 'Behöver bägge vårdnadshavare skriva under?', a: 'Vid gemensam vårdnad krävs som regel bägge vårdnadshavares medgivande.' },
        { q: 'Hur länge gäller fullmakten?', a: 'Fullmakten gäller under den period du anger i dokumentet. Den kan återkallas när som helst.' },
        { q: 'Godtar flygbolag den här handlingen?', a: 'Det avgör varje flygbolag och gränskontroll. Kontrollera med flygbolaget före resan och ta med en kopia.' },
        { q: 'Kan jag använda fullmakten utomlands?', a: 'Ja, men vi rekommenderar att ha den på både svenska och engelska vid utlandsresor.' },
      ],
      relatedIds: [2, 3, 9, 11, 14],
      legalInfo: 'Denna fullmakt är utformad enligt svensk avtalsrätt. Mottagaren, till exempel en myndighet, skola eller vårdgivare, avgör själv om den godtar fullmakten. Vid komplexa eller ovanliga ärenden rekommenderar vi att du kontaktar en jurist.',
      keywords: ['fullmakt barn', 'medgivande barn', 'föräldrafullmakt', 'resa med barn'],
    } as TemplateInput);
  });

  // === RESA & TRANSPORT (21-35) ===
  const resaTemplates: Partial<TemplateInput>[] = [
    { id: 21, slug: 'fullmakt-hamta-ut-fordon', name: 'Fullmakt att hämta ut fordon', description: 'Fullmakt för att hämta ut annans fordon från verkstad eller parkering.' },
    { id: 22, slug: 'fullmakt-bilforsakring', name: 'Fullmakt för bilförsäkring', description: 'Fullmakt att teckna eller ändra bilförsäkring.' },
    { id: 23, slug: 'fullmakt-besiktning', name: 'Fullmakt för besiktning', description: 'Fullmakt att besikta annans fordon.' },
    { id: 24, slug: 'resefullmakt-vuxen', name: 'Resefullmakt för vuxen', description: 'Generell resefullmakt för vuxen person.' },
    { id: 25, slug: 'fullmakt-agarbyte-bil', name: 'Fullmakt för ägarbyte bil', description: 'Fullmakt att genomföra ägarbyte av motorfordon.' },
    { id: 26, slug: 'fullmakt-transportstyrelsen', name: 'Fullmakt för Transportstyrelsen', description: 'Fullmakt att företräda person hos Transportstyrelsen.' },
    { id: 27, slug: 'fullmakt-parkeringsbolag', name: 'Fullmakt gentemot parkeringsbolag', description: 'Fullmakt att överklaga eller hantera parkeringsärenden.' },
    { id: 28, slug: 'fullmakt-bilverkstad', name: 'Fullmakt för bilverkstad', description: 'Fullmakt att lämna in och hämta ut fordon från verkstad.' },
    { id: 29, slug: 'medgivande-hyrbil', name: 'Medgivande för hyrbil', description: 'Medgivande att hyra bil för annans räkning.' },
    { id: 30, slug: 'fullmakt-bat-registrering', name: 'Fullmakt för båtregistrering', description: 'Fullmakt att registrera eller avregistrera båt.' },
    { id: 31, slug: 'fullmakt-korkort-arende', name: 'Fullmakt för körkortsärende', description: 'Fullmakt att hantera körkortsärenden hos Transportstyrelsen.' },
    { id: 32, slug: 'resefullmakt-grupp', name: 'Resefullmakt för grupp', description: 'Fullmakt för gruppresa med specificerade deltagare.' },
    { id: 33, slug: 'fullmakt-tullarende', name: 'Fullmakt för tullärende', description: 'Fullmakt att hantera tullärenden för annans räkning.' },
    { id: 34, slug: 'fullmakt-flygbolag', name: 'Fullmakt gentemot flygbolag', description: 'Fullmakt att hantera bokning eller reklamation hos flygbolag.' },
    { id: 35, slug: 'medgivande-samakande', name: 'Medgivande för samåkande', description: 'Medgivande och ansvarsfördelning vid samåkning.' },
  ];

  resaTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Resa & Transport',
      categorySlug: 'resa-transport',
      longDescription: `Skapa enkelt ${t.name?.toLowerCase()} med vår mall som är utformad enligt svensk avtalsrätt. Mottagaren avgör själv om den godtar fullmakten och kan ha egna blanketter.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'syfte', label: 'Syfte/uppdrag', type: 'textarea', placeholder: 'Beskriv uppdraget...', required: true, group: 'detaljer' },
        { id: 'begransningar', label: 'Begränsningar', type: 'textarea', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Är denna fullmakt giltig hos myndigheter?', a: 'Fullmakten är utformad enligt svensk avtalsrätt. De flesta myndigheter godtar en tydligt ifylld och undertecknad fullmakt, men vissa har egna blanketter eller krav – kontrollera gärna med mottagaren i förväg.' },
        { q: 'Hur länge gäller fullmakten?', a: 'Den gäller under den period du anger, alternativt tills vidare.' },
        { q: 'Behöver fullmakten bevittnas?', a: 'Det är inte ett krav men rekommenderas för extra säkerhet.' },
        { q: 'Kan fullmakten återkallas?', a: 'Ja, fullmakten kan återkallas när som helst av fullmaktsgivaren.' },
        { q: 'Gäller detta utomlands?', a: 'Fullmakten gäller primärt i Sverige. För utlandsbruk rekommenderas en engelsk version.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig enligt svensk avtals- och fullmaktsrätt.',
      keywords: ['fullmakt', 'resa', 'transport', 'fordon'],
    } as TemplateInput);
  });

  // === VÅRD & OMSORG (36-50) ===
  const vardTemplates: Partial<TemplateInput>[] = [
    { id: 36, slug: 'fullmakt-sjukvard', name: 'Fullmakt för sjukvård', description: 'Fullmakt att företräda person i sjukvårdskontakter.' },
    { id: 37, slug: 'fullmakt-apotek', name: 'Fullmakt för apotek', description: 'Fullmakt att hämta ut recept åt annan person.' },
    { id: 38, slug: 'fullmakt-hemtjanst', name: 'Fullmakt för hemtjänst', description: 'Fullmakt att ansöka om eller hantera hemtjänst.' },
    { id: 39, slug: 'fullmakt-tandvard', name: 'Fullmakt för tandvård', description: 'Fullmakt att boka och hantera tandvårdsärenden.' },
    { id: 40, slug: 'fullmakt-aldrevard', name: 'Fullmakt för äldreomsorg', description: 'Fullmakt att företräda äldre person i omsorgsärenden.' },
    { id: 41, slug: 'medgivande-medicinsk-behandling', name: 'Medgivande för medicinsk behandling', description: 'Medgivande till specifik medicinsk behandling.' },
    { id: 42, slug: 'fullmakt-forsikringskassan', name: 'Fullmakt för Försäkringskassan', description: 'Fullmakt att företräda person hos Försäkringskassan.' },
    { id: 43, slug: 'fullmakt-journalhantering', name: 'Fullmakt för journalhantering', description: 'Fullmakt att begära ut journalhandlingar.' },
    { id: 44, slug: 'fullmakt-rehabilitering', name: 'Fullmakt för rehabilitering', description: 'Fullmakt att hantera rehabiliteringsärenden.' },
    { id: 46, slug: 'fullmakt-psykiatrisk-vard', name: 'Fullmakt för psykiatrisk vård', description: 'Fullmakt att hantera kontakter med psykiatrisk vård.' },
    { id: 47, slug: 'fullmakt-privat-vardgivare', name: 'Fullmakt för privat vårdgivare', description: 'Fullmakt gentemot privat vårdgivare.' },
    { id: 48, slug: 'medgivande-delad-journalinfo', name: 'Medgivande för delad journalinformation', description: 'Medgivande att dela journalinformation med annan part.' },
    { id: 49, slug: 'fullmakt-hjalpmedel', name: 'Fullmakt för hjälpmedel', description: 'Fullmakt att hämta ut eller beställa hjälpmedel.' },
    { id: 50, slug: 'fullmakt-vaccin', name: 'Fullmakt för vaccination', description: 'Fullmakt att boka och genomföra vaccination åt annan.' },
  ];

  vardTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Vård & Omsorg',
      categorySlug: 'vard-omsorg',
      longDescription: `Denna mall ger dig en tydligt utformad ${t.name?.toLowerCase()}, utformad enligt svensk avtalsrätt. Vårdgivaren avgör själv om den godtar fullmakten.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'vardgivare', label: 'Vårdgivare/Mottagning', type: 'text', placeholder: 'Namn på vårdgivare', required: false, group: 'detaljer' },
        { id: 'syfte', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv uppdraget...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Godtar vården den här fullmakten?', a: 'Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg.' },
        { q: 'Kan fullmaktshavaren ta medicinska beslut?', a: 'Fullmakten ger rätt att inhämta information och företräda i kontakter, men medicinska beslut kräver specifikt medgivande.' },
        { q: 'Behöver den vara bevittnad?', a: 'Rekommenderas men krävs inte för grundläggande vårdkontakter.' },
        { q: 'Gäller den hos alla vårdgivare?', a: 'Ja, den gäller generellt men kan specificeras till viss vårdgivare.' },
        { q: 'Hur återkallar jag fullmakten?', a: 'Meddela fullmaktshavaren och berörda vårdgivare skriftligt.' },
      ],
      relatedIds: [],
      legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
      keywords: ['fullmakt vård', 'sjukvård', 'apotek', 'medicinsk fullmakt'],
    } as TemplateInput);
  });

  // === EKONOMI, BANK & MYNDIGHETER (51-70) ===
  const ekonomiTemplates: Partial<TemplateInput>[] = [
    { id: 51, slug: 'fullmakt-bank', name: 'Fullmakt för bankärenden', description: 'Generell fullmakt för bankärenden.' },
    { id: 52, slug: 'fullmakt-skatteverket', name: 'Fullmakt för Skatteverket', description: 'Fullmakt att företräda hos Skatteverket.' },
    { id: 53, slug: 'fullmakt-deklaration', name: 'Fullmakt för deklaration', description: 'Fullmakt att lämna in deklaration åt annan.' },
    { id: 54, slug: 'fullmakt-bolagsverket', name: 'Fullmakt för Bolagsverket', description: 'Fullmakt för ärenden hos Bolagsverket.' },
    { id: 55, slug: 'fullmakt-forsakring', name: 'Fullmakt för försäkringsärenden', description: 'Fullmakt att hantera försäkringar åt annan.' },
    { id: 56, slug: 'fullmakt-inkasso', name: 'Fullmakt gentemot inkassobolag', description: 'Fullmakt att företräda i inkassoärenden.' },
    { id: 57, slug: 'fullmakt-kronofogden', name: 'Fullmakt för Kronofogden', description: 'Fullmakt att företräda hos Kronofogden.' },
    { id: 58, slug: 'fullmakt-pension', name: 'Fullmakt för pensionsärenden', description: 'Fullmakt att hantera pensionsärenden.' },
    { id: 59, slug: 'fullmakt-arbetsformedlingen', name: 'Fullmakt för Arbetsförmedlingen', description: 'Fullmakt att företräda hos Arbetsförmedlingen.' },
    { id: 60, slug: 'fullmakt-bouppteckning', name: 'Fullmakt för bouppteckning', description: 'Fullmakt att företräda vid bouppteckning.' },
    { id: 61, slug: 'fullmakt-kontoutdrag', name: 'Fullmakt för kontoutdrag', description: 'Fullmakt att hämta kontoutdrag.' },
    { id: 62, slug: 'fullmakt-lan-kredit', name: 'Fullmakt för lån och kredit', description: 'Fullmakt att företräda i lån- och kreditärenden.' },
    { id: 63, slug: 'generell-fullmakt', name: 'Generell fullmakt', description: 'Generell fullmakt utan begränsning till specifikt ärende.' },
    { id: 64, slug: 'begransad-fullmakt', name: 'Begränsad fullmakt', description: 'Fullmakt begränsad till specifikt ärende eller tid.' },
    { id: 65, slug: 'fullmakt-arvsarende', name: 'Fullmakt för arvsärende', description: 'Fullmakt att hantera arvsärenden.' },
    { id: 66, slug: 'fullmakt-migrationsverket', name: 'Fullmakt för Migrationsverket', description: 'Fullmakt att företräda hos Migrationsverket.' },
    { id: 67, slug: 'fullmakt-tingsratten', name: 'Fullmakt för tingsrätten', description: 'Fullmakt att företräda vid tingsrätten.' },
    { id: 68, slug: 'fullmakt-aktiebolag', name: 'Fullmakt för aktiebolagsärenden', description: 'Fullmakt att agera för aktiebolag.' },
    { id: 69, slug: 'fullmakt-handelsbanken', name: 'Fullmakt specificerad för Handelsbanken', description: 'Fullmakt anpassad för Handelsbankens krav.' },
    { id: 70, slug: 'fullmakt-csp-konto', name: 'Fullmakt för CSN-ärenden', description: 'Fullmakt att företräda hos CSN.' },
  ];

  ekonomiTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Ekonomi, Bank & Myndigheter',
      categorySlug: 'ekonomi-myndigheter',
      longDescription: `Skapa ${t.name?.toLowerCase()} snabbt och enkelt. Utformad enligt svensk avtalsrätt. Banker och myndigheter har ofta egna blanketter och avgör själva om de godtar fullmakten.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'syfte', label: 'Specifikt uppdrag/ärende', type: 'textarea', placeholder: 'Beskriv ärendet...', required: true, group: 'detaljer' },
        { id: 'begransningar', label: 'Begränsningar', type: 'textarea', required: false, group: 'detaljer' },
        { id: 'myndighet', label: 'Bank/Myndighet', type: 'text', placeholder: 'Namn på mottagande institution', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Accepteras denna av alla banker?', a: 'Det avgör varje bank. Många banker har egna blanketter eller krav för fullmakter, så kontrollera med banken i förväg.' },
        { q: 'Behövs legitimation?', a: 'Ja, fullmaktshavaren behöver visa giltig legitimation tillsammans med fullmakten.' },
        { q: 'Kan jag begränsa fullmakten?', a: 'Ja, du kan specificera exakt vilka ärenden fullmakten gäller för.' },
        { q: 'Gäller fullmakten direkt?', a: 'Ja, fullmakten gäller från det datum som anges i dokumentet.' },
        { q: 'Vad händer om fullmaktsgivaren blir beslutsoförmögen?', a: 'En vanlig fullmakt upphör om fullmaktsgivaren förlorar sin beslutsförmåga. Överväg en framtidsfullmakt för sådana situationer.' },
      ],
      relatedIds: [],
      legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
      keywords: ['fullmakt bank', 'myndighet', 'ekonomi', 'skatteverket'],
    } as TemplateInput);
  });

  // === BOENDE & VARDAG (71-85) ===
  const boendeTemplates: Partial<TemplateInput>[] = [
    { id: 71, slug: 'fullmakt-bostadskop', name: 'Fullmakt för bostadsköp', description: 'Fullmakt att köpa bostad för annans räkning.' },
    { id: 72, slug: 'fullmakt-bostadsforening', name: 'Fullmakt för bostadsförening', description: 'Fullmakt att företräda vid bostadsföreningsstämma.' },
    { id: 73, slug: 'fullmakt-hyreskontrakt', name: 'Fullmakt för hyreskontrakt', description: 'Fullmakt att teckna hyreskontrakt.' },
    { id: 74, slug: 'fullmakt-elbolag', name: 'Fullmakt för elbolag', description: 'Fullmakt att hantera elavtal åt annan.' },
    { id: 75, slug: 'fullmakt-bredbandsleverantor', name: 'Fullmakt för bredbandsleverantör', description: 'Fullmakt att hantera bredbandsabonnemang.' },
    { id: 76, slug: 'fullmakt-paket-post', name: 'Fullmakt för paket och post', description: 'Fullmakt att hämta ut paket och post.' },
    { id: 77, slug: 'fullmakt-lagenhetsbyte', name: 'Fullmakt vid lägenhetsbyte', description: 'Fullmakt att genomföra lägenhetsbyte.' },
    { id: 78, slug: 'fullmakt-forsakring-boende', name: 'Fullmakt för boendeförsäkring', description: 'Fullmakt att teckna hemförsäkring.' },
    { id: 79, slug: 'fullmakt-renovering', name: 'Fullmakt för renovering', description: 'Fullmakt att godkänna renoveringsarbeten.' },
    { id: 80, slug: 'fullmakt-andrahandsuthyrning', name: 'Fullmakt för andrahandsuthyrning', description: 'Fullmakt att hyra ut bostad i andra hand.' },
    { id: 81, slug: 'fullmakt-vattenavlasning', name: 'Fullmakt för vattenavläsning', description: 'Fullmakt att ge tillträde för vattenavläsning.' },
    { id: 82, slug: 'fullmakt-sophantering', name: 'Fullmakt för sophantering', description: 'Fullmakt att hantera avfallsärenden.' },
    { id: 83, slug: 'fullmakt-garage-parkering', name: 'Fullmakt för garage/parkering', description: 'Fullmakt att hantera garageplats/parkering.' },
    { id: 84, slug: 'fullmakt-nycklar-tillgang', name: 'Fullmakt för nycklar och tillgång', description: 'Fullmakt att överlämna nycklar till tredje part.' },
    { id: 85, slug: 'fullmakt-bostadsforsaljning', name: 'Fullmakt för bostadsförsäljning', description: 'Fullmakt att sälja bostad för annans räkning.' },
  ];

  boendeTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Boende & Vardag',
      categorySlug: 'boende-vardag',
      longDescription: `Denna mall för ${t.name?.toLowerCase()} är utformad enligt svensk avtalsrätt och anpassad för svenska bostadsmarknaden.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'syfte', label: 'Specifikt ärende', type: 'textarea', placeholder: 'Beskriv ärendet...', required: true, group: 'detaljer' },
        { id: 'fastighet', label: 'Fastighet/Adress', type: 'address', placeholder: 'Adress till berörd bostad', required: false, group: 'detaljer' },
      ],
      faq: [
        { q: 'Behöver fullmakten registreras?', a: 'Nej, en fullmakt för boende behöver inte registreras men bör förvaras säkert.' },
        { q: 'Gäller denna för bostadsförsäljning?', a: 'En fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Gäller det en bostadsrätt kan du läsa mer om [fullmakt för att sälja bostadsrätt](https://fullmakt24.se/fullmakt-salja-bostadsratt). Mäklaren, köparen och föreningen avgör själva om de godtar fullmakten, så kontrollera med dem i förväg.' },
        { q: 'Kan hyresvärden neka?', a: 'Det avgör hyresvärden. Många hyresvärdar har egna rutiner eller blanketter för ombud, så kontrollera med hyresvärden i förväg.' },
        { q: 'Behöver den bevittnas?', a: 'Rekommenderas, särskilt vid fastighetsaffärer.' },
        { q: 'Kan jag ändra fullmakten i efterhand?', a: 'Ja, du kan alltid upprätta en ny fullmakt som ersätter den tidigare.' },
      ],
      relatedIds: [],
      legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
      keywords: ['fullmakt bostad', 'hyreskontrakt', 'bostadsrätt', 'boende'],
    } as TemplateInput);
  });

  // === FÖRENING, SKOLA & FRITID (86-100) ===
  const foreningTemplates: Partial<TemplateInput>[] = [
    { id: 86, slug: 'fullmakt-foreningsstamma', name: 'Fullmakt för föreningsstämma', description: 'Fullmakt att rösta vid föreningsstämma.' },
    { id: 87, slug: 'medgivande-skolaktivitet', name: 'Medgivande för skolaktivitet', description: 'Medgivande för barn att delta i skolaktivitet.' },
    { id: 88, slug: 'fullmakt-idrottsforening', name: 'Fullmakt för idrottsförening', description: 'Fullmakt att företräda i idrottsföreningsärenden.' },
    { id: 89, slug: 'medgivande-foto-film', name: 'Medgivande för foto och film', description: 'Medgivande att fotografera/filma barn vid aktivitet.' },
    { id: 90, slug: 'fullmakt-styrelsearbete', name: 'Fullmakt för styrelsearbete', description: 'Fullmakt att agera som ställföreträdare i styrelse.' },
    { id: 91, slug: 'medgivande-utflykt', name: 'Medgivande för utflykt', description: 'Medgivande för barn att delta i utflykt.' },
    { id: 92, slug: 'fullmakt-fritidsaktivitet', name: 'Fullmakt för fritidsaktivitet', description: 'Fullmakt att anmäla barn till fritidsaktivitet.' },
    { id: 93, slug: 'medgivande-simskola', name: 'Medgivande för simskola', description: 'Medgivande för barn att delta i simskola.' },
    { id: 94, slug: 'fullmakt-scouterna', name: 'Fullmakt för Scouterna', description: 'Fullmakt för scoutverksamhet.' },
    { id: 95, slug: 'medgivande-musicerande', name: 'Medgivande för musicerande', description: 'Medgivande för barn att delta i musikverksamhet.' },
    { id: 96, slug: 'fullmakt-kulturskola', name: 'Fullmakt för kulturskola', description: 'Fullmakt att hantera kulturskoleärenden.' },
    { id: 97, slug: 'medgivande-tavling', name: 'Medgivande vid tävling', description: 'Medgivande för barn att delta i tävling.' },
    { id: 98, slug: 'fullmakt-foraldrautskott', name: 'Fullmakt för föräldraföreningens utskott', description: 'Fullmakt att företräda i föräldraföreningens utskott.' },
    { id: 99, slug: 'medgivande-skidresa', name: 'Medgivande för skidresa', description: 'Medgivande för barn att delta i skidresa.' },
    { id: 100, slug: 'fullmakt-fritidsgard', name: 'Fullmakt för fritidsgård', description: 'Fullmakt att anmäla barn till fritidsgård.' },
  ];

  foreningTemplates.forEach(t => {
    templates.push({
      ...t,
      category: 'Förening, Skola & Fritid',
      categorySlug: 'forening-skola',
      longDescription: `${t.name} – en enkel mall utformad enligt svensk avtalsrätt för förenings- och fritidsändamål.`,
      fields: [...commonGivareFields, ...commonHavareFields, ...dateRangeFields,
        { id: 'forening', label: 'Förening/Skola', type: 'text', placeholder: 'Namn', required: false, group: 'detaljer' },
        { id: 'syfte', label: 'Specifik aktivitet/ärende', type: 'textarea', placeholder: 'Beskriv...', required: true, group: 'detaljer' },
      ],
      faq: [
        { q: 'Behöver skolan godkänna fullmakten?', a: 'Det avgör skolan eller föreningen. Kontrollera i förväg vilka uppgifter och underskrifter de behöver.' },
        { q: 'Kan bägge vårdnadshavare behöva skriva under?', a: 'Vid gemensam vårdnad kan bägge vårdnadshavares underskrift krävas.' },
        { q: 'Gäller medgivandet automatiskt för framtida aktiviteter?', a: 'Nej, varje aktivitet kräver normalt ett separat medgivande om inget annat anges.' },
        { q: 'Kan föreningen kräva specifik blankett?', a: 'Vissa föreningar har egna blanketter, men denna fullmakt fungerar som komplement.' },
        { q: 'Vad om mitt barn inte vill delta?', a: 'Barnets vilja ska respekteras. Medgivandet kan alltid återkallas.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig för förenings- och skolverksamhet i Sverige.',
      keywords: ['fullmakt förening', 'medgivande skola', 'fritid'],
    } as TemplateInput);
  });

  // === DJUR & HUSDJUR (101-108) ===
  const djurTemplates: Partial<TemplateInput>[] = [
    { id: 101, slug: 'fullmakt-veterinarbesok', name: 'Fullmakt för veterinärbesök', description: 'Fullmakt att ta annans djur till veterinär.' },
    { id: 102, slug: 'medgivande-djurvard', name: 'Medgivande för tillfällig djurvård', description: 'Medgivande för hundvakt eller kattpassning.' },
    { id: 103, slug: 'fullmakt-kennelvistelse', name: 'Fullmakt för kennelvistelse', description: 'Fullmakt att lämna djur på kennel.' },
    { id: 104, slug: 'medgivande-kastration-djur', name: 'Medgivande för kastration/operation av djur', description: 'Medgivande för operation av djur.' },
    { id: 105, slug: 'fullmakt-djurtransport', name: 'Fullmakt för djurtransport', description: 'Fullmakt att transportera annans djur.' },
    { id: 106, slug: 'intyg-djur-resa-utomlands', name: 'Intyg för djurets resa utomlands', description: 'Komplement till husdjurspass vid utlandsresa.' },
    { id: 107, slug: 'fullmakt-djurforsakring', name: 'Fullmakt för djurförsäkring', description: 'Fullmakt att teckna djurförsäkring.' },
    { id: 108, slug: 'medgivande-inkop-djur', name: 'Medgivande vid inköp av djur', description: 'Medgivande att köpa djur för annans räkning.' },
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
        { q: 'Godtar veterinären fullmakten?', a: 'Det avgör kliniken. Kontakta kliniken i förväg för att höra vad den behöver.' },
        { q: 'Behöver djurets registrering anges?', a: 'Det rekommenderas att ange chipnummer om djuret är chippmärkt.' },
        { q: 'Kan jag ge fullmakt för nödvändiga behandlingar?', a: 'Ja, du kan specificera vilka typer av behandlingar fullmakten omfattar.' },
        { q: 'Gäller fullmakten hos alla veterinärer?', a: 'Ja, fullmakten är generell men kan specificeras till viss klinik.' },
        { q: 'Behöver den bevittnas?', a: 'Nej, men det kan rekommenderas vid omfattande fullmakter.' },
      ],
      relatedIds: [],
      legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
      keywords: ['fullmakt djur', 'veterinär', 'husdjur'],
    } as TemplateInput);
  });

  // === SENIORER & DIGITAL OMSORG (109-116) ===
  const seniorTemplates: Partial<TemplateInput>[] = [
    { id: 109, slug: 'fullmakt-internetbank-senior', name: 'Fullmakt för internetbanksärenden (senior)', description: 'Fullmakt att hjälpa äldre med internetbankärenden.' },
    { id: 110, slug: 'fullmakt-digital-brevlada', name: 'Fullmakt för digital brevlåda', description: 'Fullmakt att hantera Kivra/e-Boks åt annan.' },
    { id: 111, slug: 'fullmakt-god-man-komplement', name: 'Fullmakt god man-komplement', description: 'Kompletterande fullmakt för god man.' },
    { id: 112, slug: 'medgivande-hemtjanst-digital', name: 'Medgivande för hemtjänst digital kommunikation', description: 'Medgivande för digital kommunikation med hemtjänst.' },
    { id: 113, slug: 'fullmakt-abonnemang', name: 'Fullmakt för abonnemang/prenumerationer', description: 'Fullmakt att hantera abonnemang åt annan.' },
    { id: 114, slug: 'intyg-digital-tillganglighet', name: 'Intyg om digital tillgänglighet', description: 'Intyg om behov av hjälp med digitala tjänster.' },
    { id: 115, slug: 'fullmakt-mobiloperator-senior', name: 'Fullmakt för mobiloperatör (senior)', description: 'Fullmakt att hantera mobilabonnemang för äldre.' },
    { id: 116, slug: 'medgivande-digital-halsoapp', name: 'Medgivande för digital hälsoapp', description: 'Medgivande att hantera hälsoapp åt annan.' },
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
        { q: 'Gäller fullmakten hos alla banker?', a: 'Det avgör varje bank, och många har egna blanketter för fullmakter. Kontrollera med banken i förväg.' },
        { q: 'Kan jag ge fullmakt för alla digitala tjänster?', a: 'Ja, du kan specificera vilka tjänster fullmakten gäller för.' },
        { q: 'Behöver den förnya?', a: 'Det rekommenderas att se över fullmakten årligen.' },
      ],
      relatedIds: [],
      legalInfo: 'Giltig för digitala tjänster i Sverige. Ersätter inte godmanskap.',
      keywords: ['fullmakt senior', 'digital omsorg', 'äldre', 'internetbank'],
    } as TemplateInput);
  });

  // === DIGITALT & DÖDSBO (117-124) ===
  const digitaltTemplates: Partial<TemplateInput>[] = [
    { id: 117, slug: 'fullmakt-digital-dodsboforvaltning', name: 'Fullmakt för digital dödsboförvaltning', description: 'Fullmakt att hantera dödsboets digitala tillgångar.' },
    { id: 118, slug: 'medgivande-sociala-medier-dodsfall', name: 'Medgivande för sociala mediekonton (dödsfall)', description: 'Medgivande att hantera sociala mediekonton vid dödsfall.' },
    { id: 119, slug: 'fullmakt-domanhantering', name: 'Fullmakt för domänhantering', description: 'Fullmakt att hantera domännamn åt annan.' },
    { id: 120, slug: 'medgivande-prenumerationsavslut', name: 'Medgivande för prenumerationsavslut efter dödsfall', description: 'Medgivande att avsluta prenumerationer efter dödsfall.' },
    { id: 121, slug: 'fullmakt-kryptovaluta', name: 'Fullmakt för kryptovaluta/digitala tillgångar', description: 'Fullmakt att hantera kryptovaluta och digitala tillgångar.' },
    { id: 122, slug: 'intyg-digital-arvshandling', name: 'Intyg för digital arvshandling', description: 'Intyg avseende digitalt arv.' },
    { id: 123, slug: 'fullmakt-epostarkiv', name: 'Fullmakt för e-postarkiv/molntjänster', description: 'Fullmakt att hantera e-post och molntjänster.' },
    { id: 124, slug: 'medgivande-digital-minnessida', name: 'Medgivande för digital minnessida', description: 'Medgivande att skapa och hantera digital minnessida.' },
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
        { q: 'Behöver dödsfallsintyg bifogas?', a: 'Det avgör varje tjänst. Många har egna rutiner och begär intyg om dödsfallet, så kontrollera med tjänsten i förväg.' },
        { q: 'Gäller fullmakten internationellt?', a: 'Den gäller i Sverige men utländska tjänster kan ha andra krav.' },
      ],
      relatedIds: [],
      legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
      keywords: ['fullmakt dödsbo', 'digitalt arv', 'kryptovaluta', 'sociala medier'],
    } as TemplateInput);
  });



  // Fullmakt för överlåtelse eller byte av hyreslägenhet. Sluggen är kvar från
  // den tidigare mallen "försäljning av lägenhet" (betalda köp och länkar).
  // En hyresrätt kan inte säljas: överlåtelse kräver hyresvärdens samtycke eller
  // hyresnämndens tillstånd (12 kap. 32–35 §§ jordabalken), och ersättning för
  // överlåtelsen är straffbar (12 kap. 65 §). Kontrollerat på riksdagen.se 2026-11-07.
  templates.push({
    id: 128,
    slug: 'fullmakt-hyreslagenh-forsalj-2026',
    name: 'Fullmakt för överlåtelse eller byte av hyreslägenhet',
    category: 'Boende & Vardag',
    categorySlug: 'boende-vardag',
    description: 'Fullmakt för ett ombud att söka hyresvärdens samtycke eller hyresnämndens tillstånd och genomföra överlåtelse eller byte av din hyreslägenhet.',
    longDescription: 'En hyresrätt kan inte säljas. Den kan överlåtas med hyresvärdens samtycke (12 kap. 32 § jordabalken) eller, med hyresnämndens tillstånd, till en närstående som varaktigt bor med dig (34 §) eller genom byte mot en annan bostadslägenhet (35 §). Med den här fullmakten sköter ett ombud ansökan, kontakterna med hyresvärden och hyresnämnden och undertecknar överlåtelse- eller bytesavtalet åt dig, till exempel om du är utomlands eller sjuk. Det är straffbart att begära, avtala om eller ta emot ersättning för att överlåta en hyresrätt (12 kap. 65 §), och fullmakten ger ingen rätt till det.',
    uppdragText: 'Företräda mig i ärendet om överlåtelse eller byte av den hyresrätt som anges under Avser. Ombudet får begära hyresvärdens samtycke, ansöka om tillstånd hos hyresnämnden och företräda mig där i ärendet, samt underteckna överlåtelse- eller bytesavtal och andra handlingar som behövs för att genomföra överlåtelsen eller bytet. Fullmakten ger inte rätt att begära, avtala om eller ta emot någon ersättning för överlåtelsen eller bytet (12 kap. 65 § jordabalken).',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Hyresgästens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Din nuvarande adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'fullmaktshavare_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'fullmaktshavare_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'objekt', label: 'Hyreslägenheten och hyresvärden', type: 'textarea', placeholder: 'T.ex. Lägenhet nr 1102, Storgatan 5, 111 22 Stockholm. Hyresvärd: Bostadsbolaget AB', required: true, group: 'detaljer' },
      { id: 'overlatelsetyp', label: 'Vad gäller ärendet', type: 'select', options: ['Byte mot en annan bostadslägenhet (12 kap. 35 § jordabalken)', 'Överlåtelse till närstående som varaktigt bor med mig (12 kap. 34 § jordabalken)', 'Överlåtelse med hyresvärdens samtycke (12 kap. 32 § jordabalken)'], required: true, group: 'detaljer' },
      { id: 'ny_hyresgast', label: 'Den som ska ta över lägenheten (om känt)', type: 'text', placeholder: 'T.ex. Maria Svensson, eller bytespartens namn och lägenhet', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Fullmaktens giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Tills överlåtelsen eller bytet är genomfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan man sälja en hyresrätt?', a: 'Nej. Den som begär, avtalar om eller tar emot särskild ersättning för att överlåta hyresrätten till en bostadslägenhet kan dömas till fängelse i högst två år, och ett avtalsvillkor om sådan ersättning är ogiltigt (12 kap. 65 § jordabalken). Även den som betalar kan dömas (65 b §). Det som går är att överlåta hyresrätten med hyresvärdens samtycke eller hyresnämndens tillstånd.' },
      { q: 'När får jag överlåta min hyresrätt?', a: 'Med hyresvärdens samtycke (12 kap. 32 § jordabalken). Utan samtycke kan hyresnämnden ge tillstånd till överlåtelse till en närstående som varaktigt bor med dig, om du själv inte ska använda lägenheten (34 §), och till byte mot en annan bostadslägenhet om du har beaktansvärda skäl och bytet kan ske utan påtaglig olägenhet för hyresvärden (35 §).' },
      { q: 'Vad får ombudet göra?', a: 'Begära hyresvärdens samtycke, ansöka om tillstånd hos hyresnämnden och företräda dig där, och underteckna överlåtelse- eller bytesavtalet. Ombudet får inte begära, avtala om eller ta emot någon ersättning för överlåtelsen.' },
      { q: 'Vad händer om hyresvärden säger nej?', a: 'Vid byte och vid överlåtelse till en närstående som bor med dig kan du ansöka om tillstånd hos hyresnämnden. Vägrar hyresvärden samtycke utan skälig anledning, eller lämnar inget besked inom tre veckor, får du säga upp hyresavtalet (12 kap. 32 § andra stycket jordabalken).' },
      { q: 'Gäller mallen för bostadsrätt?', a: 'Nej. Mallen gäller hyreslägenheter. För att sälja en bostadsrätt behövs en säljfullmakt, till exempel Fullmakt för bostadsförsäljning.' },
    ],
    relatedIds: [77, 131, 80],
    legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap. Överlåtelse av hyresrätt kräver hyresvärdens samtycke eller hyresnämndens tillstånd (12 kap. 32–35 §§ jordabalken (1970:994)). Ersättning för överlåtelse av hyresrätt är förbjuden (12 kap. 65 §).',
    keywords: ['fullmakt överlåtelse hyresrätt', 'fullmakt lägenhetsbyte', 'fullmakt byte hyreslägenhet', 'fullmakt hyresnämnden'],
  } as TemplateInput);

  // Bankfullmakt 2026
  templates.push({
    id: 129,
    slug: 'fullmakt-bankkonto-uttag-2026',
    name: 'Fullmakt för bankkonto och uttag',
    category: 'Ekonomi & Myndigheter',
    categorySlug: 'ekonomi-myndigheter',
    description: 'Fullmakt för annan person att utföra banktransaktioner, ta ut pengar och hantera ditt konto.',
    longDescription: 'En bankfullmakt ger din utvalda person rätt att sköta dina bankärenden – ta ut pengar, göra betalningar, kontrollera saldo och kommunicera med banken. Varje bank har egna regler för hur bankfullmakter ska vara utformade – vissa kräver en blankett i bankens eget format. Denna mall ger en juridisk grund som komplement.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'bank', label: 'Bank och kontonummer', type: 'text', placeholder: 'T.ex. Swedbank, konto 8123-1234567', required: true, group: 'givare' },
      { id: 'fullmaktshavare_namn', label: 'Fullmaktshavarens fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'fullmaktshavare_pnr', label: 'Personnummer (fullmaktshavare)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befoggenheter', label: 'Befogenheter', type: 'select', options: ['Uttag och insättningar', 'Betalningar och överföringar', 'Kontroll av saldo och transaktioner', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max belopp per transaktion (kr)', type: 'text', placeholder: 'T.ex. 10 000, eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Accepterar banker denna fullmakt?', a: 'De flesta svenska banker accepterar externa bankfullmakter men kan kräva kompletterande dokument eller en intern bankblankett. Kontakta alltid banken i förväg och fråga vad de kräver.' },
      { q: 'Kan fullmaktshavaren ta ut hur mycket som helst?', a: 'Ange ett maxbelopp per transaktion om du vill begränsa dispositionsrätten. Utan begränsning kan fullmaktshavaren i princip hantera hela kontot.' },
      { q: 'Kan jag ge bankfullmakt till ett barn?', a: 'Fullmaktshavaren måste vara myndig (18+) för att ha rättskapacitet att agera som ombud. Omyndiga kan inte vara fullmaktshavare.' },
      { q: 'Hur återkallar jag en bankfullmakt?', a: 'Meddela banken skriftligen och meddela fullmaktshavaren. Banken upphör att respektera fullmakten omedelbart. Be om bekräftelse från banken att fullmakten är återkallad.' },
      { q: 'Gäller bankfullmakten vid dödsfall?', a: 'Nej. En fullmakt upphör alltid vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna eller en boutredningsman.' },
    ],
    relatedIds: [126, 127, 128],
    legalInfo: 'Komplement till bankens egna blanketter. Varje bank har egna krav – kontakta banken i förväg.',
    keywords: ['bankfullmakt', 'fullmakt bank', 'uttag fullmakt', 'kontohantering fullmakt'],
  } as TemplateInput);

  // Fordonsfullmakt 2026
  templates.push({
    id: 130,
    slug: 'fullmakt-fordon-forsaljning-2026',
    name: 'Fullmakt för fordonsförsäljning',
    category: 'Resa & Transport',
    categorySlug: 'resa-transport',
    description: 'Fullmakt för att sälja, registrera eller avregistrera ett fordon åt dig hos Transportstyrelsen.',
    longDescription: 'Ska någon annan sälja din bil åt dig, registrera ett fordon eller hantera ägarbytet hos Transportstyrelsen? Denna fullmakt ger ombudet rätt att agera för dig i alla fordonsrelaterade ärenden. Krävs av köpare eller mäklare om du inte kan närvara vid ägarbytet.',
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer (ägaren)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Fordonets registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordonstyp', label: 'Fordonstyp', type: 'select', options: ['Personbil', 'Lastbil', 'Motorcykel', 'Husbil', 'Husvagn', 'Släpvagn', 'Annat'], required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Personnummer (ombudet)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Avregistrering', 'Registrering', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris vid försäljning (kr)', type: 'text', placeholder: 'T.ex. 85 000', required: false, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan jag ge någon fullmakt att sälja min bil?', a: 'Ja. En fordonsfullmakt ger ombudet rätt att underteckna köpeavtalet och anmäla ägarbytet till Transportstyrelsen. Ange ett minimipris om du vill ha kontroll på prisnivån.' },
      { q: 'Hur anmäler man ägarbyte till Transportstyrelsen?', a: 'Via Transportstyrelsens e-tjänst (transportstyrelsen.se) med BankID, eller per post. Ombudet med fullmakt kan göra detta åt dig. Ägarbytet ska anmälas inom 3 dagar.' },
      { q: 'Behöver jag bevittna fordonsfullmakten?', a: 'Rekommenderas men är inte ett lagkrav för lös egendom som bilar. Transportstyrelsen och köparen kan kräva bevittning för extra säkerhet – kontrollera i förväg.' },
      { q: 'Gäller fullmakten för export av fordon?', a: 'En exportfullmakt kan kräva ytterligare dokument (tullhandlingar, registreringsbevis). Kontakta Transportstyrelsen och Tullverket för exakta krav vid export.' },
      { q: 'Vad händer om bilen säljs under minimipriset?', a: 'Om du angett ett minimipris och ombudet accepterar ett lägre bud utan din tillåtelse handlar ombudet utanför fullmaktens befogenhet. Köpeavtalet kan i så fall angripas juridiskt.' },
    ],
    relatedIds: [126, 130],
    legalInfo: 'Avser lös egendom (fordon). Transportstyrelsen kan ha specifika krav – kontrollera på transportstyrelsen.se.',
    keywords: ['fordonsfullmakt', 'fullmakt sälja bil', 'ägarbyte fullmakt', 'transportstyrelsen fullmakt'],
  } as TemplateInput);

  // Framtidsfullmakt 2026
  templates.push({
    id: 125,
    slug: 'framtidsfullmakt-komplett-2026',
    name: 'Framtidsfullmakt 2026 – komplett mall',
    category: 'Seniorer & Omsorg',
    categorySlug: 'seniorer-omsorg',
    description: 'Framtidsfullmakt enligt lag (2017:310) som gäller om du varaktigt inte längre kan sköta dina angelägenheter. Omfattar de ekonomiska och personliga angelägenheter du själv anger.',
    longDescription: 'Med en framtidsfullmakt bestämmer du i förväg vem som ska företräda dig om du på grund av sjukdom, psykisk störning, försvagat hälsotillstånd eller liknande varaktigt och i huvudsak inte längre kan ha hand om dina angelägenheter. Fullmakten får omfatta ekonomiska och personliga angelägenheter, till exempel bank, bostad, boende och myndighetskontakter, men inte vård, tandvård eller frågor av utpräglat personlig karaktär. Mallen har rader för de två vittnen som lagen kräver.',
    documentTitle: 'FRAMTIDSFULLMAKT',
    documentKind: 'framtidsfullmakt',
    legalBasisLabel: 'Enligt lag (2017:310) om framtidsfullmakter',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'fullmaktshavare_namn', label: 'Fullmaktshavarens fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'fullmaktshavare_pnr', label: 'Personnummer (fullmaktshavare)', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'fullmaktshavare_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, syskon', required: false, group: 'havare' },
      { id: 'fullmaktshavare_adress', label: 'Fullmaktshavarens adress (valfritt)', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: false, group: 'havare' },
      { id: 'ersattare_namn', label: 'Ersättare – namn (valfritt)', type: 'text', required: false, group: 'havare', placeholder: 'Träder in om fullmaktshavaren inte kan eller vill' },
      { id: 'ersattare_pnr', label: 'Ersättarens personnummer (valfritt)', type: 'personnummer', required: false, group: 'havare', placeholder: 'ÅÅÅÅMMDD-XXXX' },
      { id: 'uppdrag', label: 'Angelägenheter som fullmakten omfattar', type: 'textarea', required: true, group: 'detaljer',
        placeholder: 'T.ex.: Samtliga mina ekonomiska angelägenheter, bland annat att betala räkningar, sköta mina bankkonton och placeringar, deklarera och företräda mig hos myndigheter. Mina personliga angelägenheter, bland annat frågor om boende, hemtjänst och kontakter med kommunen.',
        helpText: 'Obligatoriskt (5 § lagen om framtidsfullmakter). Får omfatta ekonomiska och personliga angelägenheter. Får inte omfatta vård, tandvård eller frågor av utpräglat personlig karaktär, som äktenskap eller testamente.' },
      { id: 'fastigheter', label: 'Fast egendom och bostadsrätter (valfritt)', type: 'textarea', required: false, group: 'detaljer',
        placeholder: 'T.ex.: Fullmaktshavaren får förvalta, pantsätta och sälja fastigheten Uppsala Kåbo 1:23 och bostadsrätten på Storgatan 1 i Uppsala.',
        helpText: 'Skriv uttryckligen vad fullmaktshavaren får göra med egendomen, till exempel förvalta eller sälja.' },
      { id: 'gavor', label: 'Gåvor (valfritt)', type: 'textarea', required: false, group: 'detaljer',
        placeholder: 'T.ex.: Fullmaktshavaren får ge barnbarnen gåvor vid födelsedagar och jul med högst 2 000 kr per barnbarn och år.',
        helpText: 'Lämnar du fältet tomt får fullmaktshavaren bara ge personliga presenter av rimligt värde till andra än sig själv (18 §).' },
      { id: 'arvode', label: 'Arvode till fullmaktshavaren', type: 'select', required: false, group: 'detaljer',
        options: ['Inget arvode', 'Skäligt arvode'],
        helpText: 'Fullmaktshavaren har rätt till arvode bara om det står i fullmakten (19 §). Väljer du inget blir det inget arvode.' },
      { id: 'granskare_namn', label: 'Granskare – namn (valfritt)', type: 'text', required: false, group: 'detaljer', placeholder: 'T.ex. ett syskon eller en vän',
        helpText: 'En granskare kan begära redovisning av fullmaktshavaren (23 §).' },
      { id: 'granskare_pnr', label: 'Granskarens personnummer (valfritt)', type: 'personnummer', required: false, group: 'detaljer', placeholder: 'ÅÅÅÅMMDD-XXXX' },
      { id: 'granskare_aterkalla', label: 'Granskaren får återkalla fullmakten', type: 'checkbox', required: false, group: 'detaljer',
        helpText: 'Gäller bara om du har utsett en granskare (8 § andra stycket).' },
      { id: 'domstolsprovning', label: 'Tingsrätten ska pröva om fullmakten har trätt i kraft', type: 'checkbox', required: false, group: 'detaljer',
        helpText: 'Annars är det fullmaktshavaren som bedömer det (9 §).' },
      { id: 'ovriga_villkor', label: 'Övriga villkor (valfritt)', type: 'textarea', required: false, group: 'detaljer',
        placeholder: 'T.ex. att fullmaktshavaren ska samråda med mina barn innan bostaden säljs.' },
    ],
    faq: [
      { q: 'Vad är skillnaden på framtidsfullmakt och vanlig fullmakt?', a: 'En vanlig fullmakt gäller från den dag du skriver den. En framtidsfullmakt gäller för det fall du på grund av sjukdom, psykisk störning, försvagat hälsotillstånd eller liknande varaktigt och i huvudsak inte längre kan ha hand om dina angelägenheter (1 § lagen om framtidsfullmakter).' },
      { q: 'Måste en framtidsfullmakt bevittnas?', a: 'Ja, det är ett lagkrav. Du ska skriva under i två vittnens samtidiga närvaro, och vittnena ska känna till att handlingen är en framtidsfullmakt (4 §). Fullmaktshavaren får inte vara vittne, och inte heller din make, sambo, syskon eller den som är släkt eller besvågrad med dig i rakt upp- eller nedstigande led.' },
      { q: 'Kan jag ångra en framtidsfullmakt?', a: 'Ja. En framtidsfullmakt kan inte göras oåterkallelig (6 §). Har du lämnat handlingen till fullmaktshavaren återkallar du den genom att ta tillbaka eller förstöra den (8 § och avtalslagen 16 §). Meddela också banker och andra som känner till fullmakten.' },
      { q: 'Vad händer om jag inte har en framtidsfullmakt?', a: 'Dina anhöriga kan sköta vardagliga ekonomiska ärenden med stöd av anhörigbehörigheten i föräldrabalken 17 kap. Räcker inte det kan överförmyndaren anordna godmanskap, eller rätten besluta om förvaltarskap. Då är det inte du som väljer vem som företräder dig.' },
      { q: 'Gäller framtidsfullmakten utomlands?', a: 'Den är upprättad enligt svensk lag. Har du tillgångar i andra länder kan lokala regler gälla där – ta juridisk hjälp om det gäller fastigheter eller större tillgångar utomlands.' },
    ],
    relatedIds: [126, 127],
    legalInfo: 'Lag (2017:310) om framtidsfullmakter. Ska undertecknas i två vittnens samtidiga närvaro (4 §).',
    keywords: ['framtidsfullmakt', 'fullmakt vid demens', 'fullmakt sjukdom', 'framtidsfullmakt mall', 'lagen om framtidsfullmakter'],
  } as TemplateInput);

  // Generalfullmakt 2026
  templates.push({
    id: 126,
    slug: 'generalfullmakt-privatperson-2026',
    name: 'Generalfullmakt för privatperson',
    category: 'Ekonomi & Myndigheter',
    categorySlug: 'ekonomi-myndigheter',
    description: 'Bred fullmakt som täcker de flesta rättshandlingar. Lämplig när du behöver en person att agera i ditt ställe.',
    longDescription: 'En generalfullmakt ger fullmaktshavaren befogenhet att agera på dina vägnar i de flesta situationer – bank, myndigheter, fastighetsaffärer och avtal. Till skillnad från specialfullmakter är den inte begränsad till ett specifikt ärende. Används ofta vid långvarig utlandsresa, sjukdom eller när du av praktiska skäl inte kan närvara.',
    uppdragText: 'Företräda mig och för min räkning vidta alla rättshandlingar och andra åtgärder, med de undantag som anges under Begränsningar och villkor.',
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
      { q: 'Måste en generalfullmakt registreras?', a: 'Nej, det finns ingen obligatorisk registrering. Vissa banker och myndigheter kan kräva att fullmakten är bevittnad eller bestyrkt.' },
      { q: 'Hur återkallar man en generalfullmakt?', a: 'Meddela fullmaktshavaren skriftligen och informera berörda institutioner (bank, myndigheter). Generalfullmakten upphör automatiskt om du förlorar rättslig handlingsförmåga – då behövs framtidsfullmakt istället.' },
      { q: 'Är en generalfullmakt giltig efter dödsfall?', a: 'Nej. En fullmakt upphör alltid vid fullmaktsgivarens dödsfall. Dödsboet hanteras av dödsbodelägarna gemensamt eller via boutredningsman.' },
    ],
    relatedIds: [125, 127],
    legalInfo: 'Regleras av avtalslagen (1915:218). Bevittning rekommenderas men krävs ej i alla situationer.',
    keywords: ['generalfullmakt', 'fullmakt privatperson', 'bred fullmakt', 'fullmakt bank', 'fullmakt myndigheter'],
  } as TemplateInput);

  // Dödsbo-fullmakt 2026
  templates.push({
    id: 127,
    slug: 'dodsbo-fullmakt-arvinge-2026',
    name: 'Dödsbo – fullmakt för arvinge',
    category: 'Digitalt & Dödsbo',
    categorySlug: 'digitalt-dodsbo',
    description: 'Fullmakt som gör det möjligt för en arvinge att agera för dödsboets räkning i kontakter med banker, myndigheter och fastighetsbolag.',
    longDescription: 'När en närstående går bort behöver dödsboet ofta agera snabbt – avsluta hyresavtal, kontakta banken, avboka abonnemang och sköta fastighetsärenden. Denna fullmakt ger en utsedd arvinge eller anhörig rätt att agera på dödsboets vägnar. Den kräver att alla dödsbodelägare undertecknar om inget annat avtalas.',
    fields: [
      // Fullmakten ges av dödsbodelägarna, inte av den avlidne (18 kap. 1 § ärvdabalken).
      { id: 'dodsbodelagare1_namn', label: 'Dödsbodelägarens fullständiga namn', type: 'text', placeholder: 'Karin Svensson', required: true, group: 'givare' },
      { id: 'dodsbodelagare1_pnr', label: 'Dödsbodelägarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'dodsbodelagare2_namn', label: 'Dödsbodelägare 2 – namn (valfritt)', type: 'text', placeholder: 'Per Svensson', required: false, group: 'givare' },
      { id: 'dodsbodelagare2_pnr', label: 'Dödsbodelägare 2 – personnummer (valfritt)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
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
    legalInfo: 'Dödsbodelägarna förvaltar gemensamt den dödes egendom under boets utredning (18 kap. 1 § ärvdabalken (1958:637)).',
    keywords: ['dödsbo fullmakt', 'fullmakt arvinge', 'hantera dödsbo', 'dödsbodelägare fullmakt', 'arvinge fullmakt bank'],
  } as TemplateInput);

  // === TILLAGDA 2026-05-06 ===
  templates.push({
    id: 131, slug: 'fullmakt-hyresratt-overlatelse-2026',
    name: 'Fullmakt hyresrätt överlåtelse',
    category: 'Boende & Vardag', categorySlug: 'boende-vardag',
    description: 'Fullmakt för att ansöka om byte eller överlåtelse av hyresrätt hos hyresvärden.',
    longDescription: 'Ger ditt ombud rätt att ansöka om andrahandsuthyrning, lägenhetsbyte och överlåtelse. Hyresvärden kommuniceras via ombudet.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Hyresgaestens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'lagenhet', label: 'Lägenhetens adress', type: 'address', placeholder: 'Gatuadress, våning', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Personnummer (ombudet)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Ansökan om andrahandsuthyrning', 'Ansökan om lägenhetsbyte', 'Överlåtelse till närstående', 'Alla hyresrättsärenden'], required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan man ge fullmakt att ansöka om andrahandsuthyrning?', a: 'Ja. Ombudet kan ansöka och kommunicera med hyresvärden. Vissa hyresvärdar kräver egna blanketter – kontrollera i förväg.' },
      { q: 'Godtar hyresvärden en fullmakt?', a: 'Det avgör hyresvärden, och vissa har egna krav. Kontakta alltid hyresvärden först.' },
      { q: 'Kan ombudet skriva under ett hyreskontrakt?', a: 'Ja, om fullmakten specificerar detta. Ange att ombudet får underteckna hyresrelaterade handlingar.' },
      { q: 'Måste fullmakten bevittnas?', a: 'Rekommenderas men är inte lagkrav. Några hyresvärdar kan kräva det – fråga i förväg.' },
      { q: 'Vad händer om hyresvärden nekar trots fullmakt?', a: 'Fullmakten ger representationsrätt, inte rätt att få ansökan bifören. Vid felaktigt avslag: vänd dig till Hyresnämnden.' },
    ],
    relatedIds: [128, 130],
    legalInfo: 'Hyreslagen (12 kap. jordabalken (1970:994)) reglerar hyresgästens rättigheter.',
    keywords: ['fullmakt hyresrätt', 'lägenhetsbyte fullmakt', 'andrahandsuthyrning fullmakt'],
  } as TemplateInput);

  templates.push({
    id: 132, slug: 'fullmakt-sjukvard-behandling-2026',
    name: 'Fullmakt för sjukvård och behandling',
    category: 'Vård & Omsorg', categorySlug: 'vard-omsorg',
    description: 'Fullmakt för närstående att företräda dig vid sjukvårdskontakter, hämta ut medicin och ta del av journaler.',
    longDescription: 'Ger ditt ombud rätt att kommunicera med vårdgivare, boka/avboka tider, hämta ut medicin och ta del av journal. Används vid kortvarig sjukdom, ålderdom eller planerad operation.',
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Personnummer (ombudet)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befögenheter', type: 'select', options: ['Boka och avboka vårdtider', 'Hämta ut medicin på apotek', 'Ta del av journalanteckningar', 'Kommunicera med vårdpersonal', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Vårdcentral', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Godtar vårdcentralen en sjukvårdsfullmakt?', a: 'Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg. Ta med fullmakten vid varje besök.' },
      { q: 'Kan ombudet ta del av min journal?', a: 'Om det anges i fullmakten: ja, för de delar du specificerat.' },
      { q: 'Vad skiljer sjukvårdsfullmakt från framtidsfullmakt?', a: 'Sjukvårdsfullmakt gäller när du är beslutskompetent. Framtidsfullmakt aktiveras när du INTE längre kan fatta egna beslut.' },
      { q: 'Kan ombudet fatta medicinska beslut?', a: 'Ombudet kan kommunicera och informeras. Medicinska beslut kräver din samtycke så länge du är beslutskompetent.' },
      { q: 'Måste fullmakten bevittnas för sjukvård?', a: 'Rekommenderas. För känsliga uppgifter kan vårdgivaren kräva bevittning.' },
    ],
    relatedIds: [125, 126],
    legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap. Patientdatalagen (2008:355) innehåller bestämmelser om skyldighet att föra patientjournal (1 kap. 1 §).',
    keywords: ['sjukvårdsfullmakt', 'fullmakt vård', 'fullmakt apotek'],
  } as TemplateInput);

  templates.push({
    id: 133, slug: 'medgivande-barn-ensamresa-flyg-2026',
    name: 'Medgivande barn ensam flyresa',
    category: 'Föräldrar & Barn', categorySlug: 'foraldrar-barn',
    description: 'Medgivande för minderarigt barn att flyga ensamt. Specificerar flygbolag, ruttinformation och nödkontakt.',
    longDescription: 'Vårdnadshavarens skriftliga medgivande när ett barn reser ensamt. Varje flygbolag har egna regler och ofta en egen blankett för barn som reser ensamma, så kontrollera med flygbolaget före bokning.',
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_foddatum', label: 'Barnets födelsedatum', type: 'date', required: true, group: 'givare' },
      { id: 'vardnadshavare1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vardnadshavare1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vardnadshavare2_namn', label: 'Vårdnadshavare 2 (valfritt)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'flygbolag', label: 'Flygbolag', type: 'text', placeholder: 'T.ex. SAS, Norwegian', required: true, group: 'detaljer' },
      { id: 'avgangsplats', label: 'Avgångsplats och datum', type: 'text', placeholder: 'Stockholm Arlanda, 2026-07-15', required: true, group: 'detaljer' },
      { id: 'destination', label: 'Destination', type: 'text', placeholder: 'T.ex. Barcelona El Prat', required: true, group: 'detaljer' },
      { id: 'motande_vuxen', label: 'Mötande vuxen vid destination', type: 'text', placeholder: 'Namn, telefon och relation', required: true, group: 'detaljer' },
      { id: 'nodkontakt', label: 'Nödkontakt under resan', type: 'phone', placeholder: '+46701234567', required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kräver alla flygbolag detta medgivande?', a: 'De flesta europeiska flygbolag kräver det för barn under 15–16 år. SAS kräver det för barn under 18 vid internationella flyg. Kontrollera flygbolagets policy.' },
      { q: 'Måste båda vårdnadshavarna signera?', a: 'Vid gemensam vårdnad rekommenderas att båda signerar. Vid ensam vårdnad räcker en underskrift.' },
      { q: 'Behövs medgivande inom Schengen?', a: 'Schengenländer kräver normalt inte inresehandlingar, men flygbolagen har egna regler. Kontrollera alltid.' },
      { q: 'Hur överlämnas medgivandet?', a: 'Ge originalet till barnet. Skicka digital kopia till mötande vuxen och nödkontakt. Incheckningspersonalen kan begära att se det.' },
      { q: 'Vad är Unaccompanied Minor-tjänst?', a: 'UM är en betald tjänst där flygbolaget säkerställer att barnet följs och överlämnas korrekt. Kräver bokning och extra avgift men rekommenderas för yngre barn.' },
    ],
    relatedIds: [1, 2, 14],
    legalInfo: 'Krav varierar per flygbolag. Kontrollera aktuell policy.',
    keywords: ['medgivande ensam resa barn', 'barn flyga ensamt', 'flygresemedgivande'],
  } as TemplateInput);

  // Pensionsärenden fullmakt 2026
  templates.push({
    id: 134, slug: 'fullmakt-pensionsarenden-2026',
    name: 'Fullmakt för pensionsärenden',
    category: 'Seniorer & Omsorg', categorySlug: 'seniorer-omsorg',
    description: 'Fullmakt för att hantera pensionsärenden hos Försäkringskassan, Pensionsmyndigheten och tjänstefond.',
    longDescription: 'Ger ditt ombud rätt att kommunicera med Pensionsmyndigheten, Försäkringskassan och din tjänstepensionsleverantör. Används av äldre som behöver hjälp att navigera pensionssystemet, eller av personer som är sjuka eller bor utomlands.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Personnummer (ombudet)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'myndigheter', label: 'Berörda myndigheter/företag', type: 'select', options: ['Pensionsmyndigheten', 'Försäkringskassan', 'Tjänstepensionsleverantör', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befögenheter', type: 'select', options: ['Begära information och kontoutdrag', 'Göra ändringar i pensionsuttag', 'Ansöka om ersättningar', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Godtar Pensionsmyndigheten en fullmakt?', a: 'Det avgör Pensionsmyndigheten, som kan ha egna blanketter. Kontakta dem i förväg för att få veta vad de kräver.' },
      { q: 'Kan ombudet ändra mina pensionsuttag?', a: 'Bara om det anges i fullmakten. Specificera tydligt vilka befögenheter ombudet har – informationsätkomst eller även rätt att göra ändringar.' },
      { q: 'Kan jag ge fullmakt för tjänstepension?', a: 'Ja, varje tjänstepensionsleverantör (AMF, SPP, Alecta etc.) hanterar fullmakter. Kontakta din leverantör för deras specifika krav.' },
      { q: 'Måste fullmakten bevittnas för pensionsärenden?', a: 'Rekommenderas men krävs inte alltid. Pensionsmyndigheten kan kräva legalisering vid större ändringar. Fråga myndigheten i förväg.' },
      { q: 'Vad gör jag om Pensionsmyndigheten nekar ombudet?', a: 'Kontakta Pensionsmyndigheten direkt och fråga vad de kräver. De kan ha en intern blankett som komplement till fullmakten.' },
    ],
    relatedIds: [125, 126],
    legalInfo: 'Pensionsmyndigheten och Försäkringskassan kan ha specifika krav. Kontakta respektive myndighet.',
    keywords: ['pensionsfullmakt', 'fullmakt pensionsmyndigheten', 'fullmakt försäkringskassan'],
  } as TemplateInput);

  // BRF-stämmefullmakt 2026
  templates.push({
    id: 135, slug: 'fullmakt-bostadsratt-stamma-2026',
    name: 'Fullmakt till BRF-stämma',
    category: 'Boende & Vardag', categorySlug: 'boende-vardag',
    description: 'Fullmakt för en representant att rösta och agera på bostadsrättsföreningens årliga eller extra stämma.',
    longDescription: 'Kan du inte delta på årsstämman eller extrastämman i din BRF? Denna fullmakt ger en annan bostadsrättshavare eller anhörig rätt att rösta och agera i ditt ställe. Bostadsrättslagen reglerar vem som kan vara fullmaktshavare.',
    uppdragText: 'Företräda mig och rösta för min räkning vid den föreningsstämma som anges under Avser.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Bostadsrättshavaren (du)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'lagenhet_nr', label: 'Lägenhetsnummer', type: 'text', placeholder: 'T.ex. 1201', required: true, group: 'givare' },
      { id: 'forening', label: 'BRF:ens namn', type: 'text', placeholder: 'BRF Solsidan', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'stamma_datum', label: 'Stämmans datum', type: 'date', required: true, group: 'detaljer' },
      { id: 'stammatyp', label: 'Typ av stämma', type: 'select', options: ['Årsstämma', 'Extrastämma', 'Båda'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan vem som helst vara mitt ombud på BRF-stämman?', a: 'Nej. Enligt bostadsrättslagen måste ombudet vara en annan bostadsrättshavare i föreningen, en make/maka/sambo, eller en juridisk representant. Grannens barn (om de inte bor i föreningen) kan inte vara ombud.' },
      { q: 'Kan ett ombud representera fler än en lägenhetsägare?', a: 'Ja, men normalt max en person per ombud. Kontrollera föreningens stadgar – de kan sätta egna gränser.' },
      { q: 'Måste fullmakten visas upp på stämman?', a: 'Ja, alltid. Ta med originalet eller en bevittnad kopia. Styrelsen/mötesordföranden kan kräva att se det.' },
      { q: 'Kan ombudet rösta hur det vill?', a: 'Ja, om du inte specificerat hur. Du kan ange röstningsinstruktioner i fullmakten (t.ex. "rösta ja på alla förslag" eller "rösta nej till årsbudgeten").' },
      { q: 'Vad händer om fullmakten inte godkänns av styrelsen?', a: 'Om styrelsen anser att fullmakten är ogiltigt utställd (fel person, fel form) kan de neka ombudet att delta. Överklaga mötesbeslutet via styrelsen eller hänskjut till hyresnämnden.' },
    ],
    relatedIds: [126, 131],
    legalInfo: 'Bostadsrättslagen (1991:614) 9 kap. 14 § reglerar rätten att använda ombud vid föreningsstämma.',
    keywords: ['fullmakt BRF stämma', 'årsstämma fullmakt', 'bostadsrättsförening fullmakt'],
  } as TemplateInput);

  // Skatteverket fullmakt 2026
  templates.push({
    id: 136, slug: 'fullmakt-skatt-deklaration-2026',
    name: 'Fullmakt för skatt och deklaration',
    category: 'Ekonomi & Myndigheter', categorySlug: 'ekonomi-myndigheter',
    description: 'Fullmakt för ombud att hantera dina skattedeklarationer, ändra uppgifter och kommunicera med Skatteverket.',
    longDescription: 'Denna fullmakt ger ditt ombud rätt att kommunicera med Skatteverket, göra ändringar i deklarationen, överklaga beslut och hantera skattefrågor i ditt ställe. Används av privatpersoner som är utomlands, sjuka eller av företagare som låter en redovisningskonsult söta sina ärenden.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer / Organisationsnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Redovisningskonsult AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befögenheter', type: 'select', options: ['Kommunicera med Skatteverket', 'Lämna och ändra deklaration', 'Överklaga Skatteverkets beslut', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'arstal', label: 'Taxeringsår', type: 'text', placeholder: 'T.ex. 2025 och 2026, eller Alla år', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 år', '2 år', '3 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan Skatteverket kräva en specifik blankett istället för denna fullmakt?', a: 'Ja. Skatteverket har en egen ombudsregistrering (ombudstjänsten) via Mina sidor. External fullmakt fungerar vid telefon och besök men för digital åtkomst behöver ombudet registreras i Skatteverkets e-tjänst.' },
      { q: 'Kan ett bokföringsbolag använda denna fullmakt?', a: 'Ja. Redovisningskonsulter och revisorer använder ofta externa fullmakter. Men för full digital åtkomst via Skatteverkets API:er behövs också e-legitimation-auktorisering.' },
      { q: 'Gäller fullmakten för både privatperson och företag?', a: 'Ja, men specificera personnummer eller organisationsnummer tydligt. Företagets deklarationer kräver att ombudet är registrerat som företagets ombud hos Skatteverket.' },
      { q: 'Kan ombudet överklaga ett Skatteverket-beslut?', a: 'Ja, om det anges i fullmakten. Överklaganden ska lämnas inom 60 dagar från Skatteverkets beslutsdatum. Ombudet kan förberedä och lämna in överklagandet.' },
      { q: 'Hur långe bör skattefullmakten gälla?', a: 'För löpande redovisning: tillsvidare eller 3 år med årlig förnyelse. För ett specifikt ärende: 1 år räcker normalt.' },
    ],
    relatedIds: [126, 129],
    legalInfo: 'Komplement till Skatteverkets ombudsregistrering. Kontakta Skatteverket för digital åtkomst via e-tjänster.',
    keywords: ['skattefullmakt', 'fullmakt skatteverket', 'deklaration fullmakt', 'redovisningskonsult fullmakt'],
  } as TemplateInput);


  // ═══════════ NYA MALLAR 2026 (137–236) ═══════════

  // Fullmakt firmateckning ensam
  templates.push({
    id: 137,
    slug: 'fullmakt-firmateckning-ensam',
    name: "Fullmakt firmateckning ensam",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för en person att teckna firma ensam för aktiebolaget.",
    longDescription: "Med denna fullmakt får ombudet rätt att ensam teckna firma för bolagets räkning – t.ex. underteckna avtal, betalningar och officiella handlingar. Lämplig när VD eller styrelseledamot inte är tillgänglig.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [138, 139, 144],
    legalInfo: "Regleras av aktiebolagslagen (2005:551) och prokuralagen (1974:158). Behörig företrädare ska utfärda fullmakten.",
    keywords: ["firmateckning", "fullmakt företag", "firmateckningsrätt", "aktiebolag fullmakt", "fullmakt VD"],
  } as TemplateInput);

  // Fullmakt firmateckning i förening
  templates.push({
    id: 138,
    slug: 'fullmakt-firmateckning-gemensam',
    name: "Fullmakt firmateckning i förening",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för två eller flera personer att gemensamt teckna firma.",
    longDescription: "Ger två eller fler personer rätt att teckna firma i förening – alla angivna ombud måste underteckna gemensamt för att rättshandlingen ska vara giltig. Standard vid större affärer.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 139, 144],
    legalInfo: "Regleras av aktiebolagslagen (2005:551) och prokuralagen (1974:158). Behörig företrädare ska utfärda fullmakten.",
    keywords: ["firmateckning gemensam", "firmateckning i förening", "fullmakt aktiebolag", "fullmakt företag"],
  } as TemplateInput);

  // Fullmakt till bolagsstämma
  templates.push({
    id: 139,
    slug: 'fullmakt-bolagsstamma',
    name: "Fullmakt till bolagsstämma",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att rösta åt aktieägare vid bolagsstämma.",
    longDescription: "Ger ombudet rätt att rösta för dina aktier vid årsstämma eller extra bolagsstämma. Du kan ge ombudet fria händer eller specifika röstinstruktioner per punkt.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten visas upp på stämman?", a: "Ja, ombudet ska visa original eller styrkt kopia av fullmakten samt giltig ID-handling vid inregistreringen." },
      { q: "Kan ombudet rösta som det vill?", a: "Ja, om du inte angett röstningsinstruktioner. För att skydda dina intressen kan du specificera röstning per punkt." },
      { q: "Behöver fullmakten bevittnas?", a: "Aktiebolagslagen kräver det inte, men många bolagsordningar gör det. Kontrollera bolagets stadgar." },
      { q: "Hur länge gäller stämmofullmakten?", a: "Som regel max ett år från utfärdandet. Bolagsordningen kan ange annat." },
      { q: "Kan ett ombud representera flera aktieägare?", a: "Ja, det är vanligt med samlade ombud (depåförvaltare) som röstar för många aktieägare." },
    ],
    relatedIds: [137, 138, 143],
    legalInfo: "Regleras av aktiebolagslagen (2005:551) 7 kap. om bolagsstämma och rösträtt.",
    keywords: ["fullmakt bolagsstämma", "fullmakt aktieägare", "årsstämma fullmakt", "rösta för aktier"],
  } as TemplateInput);

  // Fullmakt till revisor
  templates.push({
    id: 140,
    slug: 'fullmakt-revisor',
    name: "Fullmakt till revisor",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för revisor att företräda bolaget i revisionsärenden.",
    longDescription: "Ger den auktoriserade revisorn rätt att inhämta information, kommunicera med Skatteverket och företräda bolaget i revisionsrelaterade ärenden.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 140, 142],
    legalInfo: "Regleras av revisorslagen (2001:883) och Aktiebolagslagen (2005:551) 9 kap.",
    keywords: ["fullmakt revisor", "revisionsfullmakt", "fullmakt bolag", "auktoriserad revisor"],
  } as TemplateInput);

  // Fullmakt handelsbolag
  templates.push({
    id: 141,
    slug: 'fullmakt-handelsbolag',
    name: "Fullmakt handelsbolag",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för bolagsman att företräda handelsbolaget.",
    longDescription: "Ger en bolagsman eller utomstående rätt att handla för handelsbolagets räkning. Eftersom bolagsmännen har personligt ansvar är detta särskilt viktigt vid större affärer.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 142, 143],
    legalInfo: "Regleras av lagen om handelsbolag och enkla bolag (1980:1102).",
    keywords: ["fullmakt handelsbolag", "fullmakt HB", "bolagsman fullmakt"],
  } as TemplateInput);

  // Fullmakt enskild firma
  templates.push({
    id: 142,
    slug: 'fullmakt-enskild-firma',
    name: "Fullmakt enskild firma",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för innehavaren av enskild firma att låta annan agera.",
    longDescription: "Eftersom enskild firma inte är en juridisk person agerar du som privatperson. Fullmakten ger ombudet rätt att hantera firmans löpande ärenden – fakturering, bankärenden, myndighetskontakter.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [141, 143, 144],
    legalInfo: "Enskild näringsverksamhet regleras av enskild näringsidkares ansvar – ingen separat juridisk person.",
    keywords: ["fullmakt enskild firma", "fullmakt EF", "fullmakt företagare"],
  } as TemplateInput);

  // VD-fullmakt
  templates.push({
    id: 143,
    slug: 'fullmakt-vd-arenden',
    name: "VD-fullmakt",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för VD att binda bolaget i specifika ärenden.",
    longDescription: "Specificerad fullmakt för VD att fatta beslut utöver den löpande förvaltningen, t.ex. större investeringar eller strategiska avtal. Kompletterar den allmänna VD-behörigheten.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 138, 142],
    legalInfo: "Aktiebolagslagen (2005:551) 8 kap. om bolagets ledning.",
    keywords: ["VD-fullmakt", "VD fullmakt", "fullmakt verkställande direktör"],
  } as TemplateInput);

  // Prokura
  templates.push({
    id: 144,
    slug: 'fullmakt-prokura',
    name: "Prokura",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Bred näringsrättslig fullmakt enligt prokuralagen.",
    longDescription: "Prokura är en omfattande näringsfullmakt som ger ombudet rätt att utföra alla rättshandlingar inom näringsverksamheten – med undantag för fastighetsförsäljning och pantsättning. Ska registreras hos Bolagsverket.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 143, 145],
    legalInfo: "Regleras av prokuralagen (1974:158). Om registrering av prokura finns bestämmelser i handelsregisterlagen (1974:157) (1 § prokuralagen).",
    keywords: ["prokura", "fullmakt prokura", "näringsfullmakt", "prokuralagen"],
  } as TemplateInput);

  // Fullmakt vid likvidation
  templates.push({
    id: 145,
    slug: 'fullmakt-likvidation',
    name: "Fullmakt vid likvidation",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för likvidator eller ombud vid bolagslikvidation.",
    longDescription: "Ger ombudet rätt att företräda bolagsmännen eller styrelsen under likvidationsförfarandet. Hanterar avveckling av tillgångar, betalning av skulder och slutreglering.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [144, 146, 147],
    legalInfo: "Aktiebolagslagen (2005:551) 25 kap. om likvidation och konkurs.",
    keywords: ["fullmakt likvidation", "likvidator fullmakt", "avveckling bolag"],
  } as TemplateInput);

  // Fullmakt vid konkurs
  templates.push({
    id: 146,
    slug: 'fullmakt-konkurs-ombud',
    name: "Fullmakt vid konkurs",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för konkursförvaltarens eller bolagsmännens ombud.",
    longDescription: "Vid konkurs behöver bolaget ofta företrädas mot konkursförvaltaren, fordringsägare och tingsrätten. Denna fullmakt ger ombudet rätt att agera i dessa ärenden.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [145, 147, 148],
    legalInfo: "Konkurslagen (1987:672) reglerar konkursförfarandet.",
    keywords: ["fullmakt konkurs", "konkurs ombud", "konkursförvaltare fullmakt"],
  } as TemplateInput);

  // Fullmakt patentärende
  templates.push({
    id: 147,
    slug: 'fullmakt-patent-arende',
    name: "Fullmakt patentärende",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för patentombud att hantera patentansökan.",
    longDescription: "Ger patentombudet (auktoriserat patentkonsult) rätt att lämna in patentansökan, kommunicera med PRV och företräda dig i patentärenden.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [148, 137, 142],
    legalInfo: "Regleras av patentlagen (2024:945) och Patent- och registreringsverkets (PRV) föreskrifter.",
    keywords: ["fullmakt patent", "patentombud", "PRV fullmakt", "patentansökan ombud"],
  } as TemplateInput);

  // Fullmakt varumärkesregistrering
  templates.push({
    id: 148,
    slug: 'fullmakt-varumarke-registrering',
    name: "Fullmakt varumärkesregistrering",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att registrera varumärke hos PRV.",
    longDescription: "Ger ombudet (vanligtvis varumärkesbyrå) rätt att ansöka om, försvara och underhålla varumärket hos PRV eller EUIPO.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [147, 137, 142],
    legalInfo: "Varumärkeslagen (2010:1877) och PRV:s regelverk.",
    keywords: ["fullmakt varumärke", "varumärkesregistrering", "PRV varumärke", "EUIPO fullmakt"],
  } as TemplateInput);

  // Ömsesidig framtidsfullmakt för makar
  templates.push({
    id: 149,
    slug: 'framtidsfullmakt-omsesidig-makar',
    name: 'Ömsesidig framtidsfullmakt för makar och sambor',
    category: 'Seniorer & Digital Omsorg',
    categorySlug: 'seniorer-omsorg',
    description: 'Två separata framtidsfullmakter i samma PDF – en för var och en av er, där ni utser varandra. Var och en skriver under sin egen inför två vittnen.',
    longDescription: 'Lagen känner inte till någon gemensam framtidsfullmakt: varje person ger sin egen. Den här mallen skapar därför två fristående framtidsfullmakter enligt lag (2017:310) i samma PDF – i den ena är du fullmaktsgivare och din partner fullmaktshavare, i den andra tvärtom. Båda får samma omfattning och villkor. Var och en skriver under sitt eget dokument i två vittnens samtidiga närvaro, och den andra parten får inte vara vittne till det.',
    documentTitle: 'FRAMTIDSFULLMAKT',
    documentKind: 'framtidsfullmakt',
    legalBasisLabel: 'Enligt lag (2017:310) om framtidsfullmakter',
    mutual: true,
    groupLabels: {
      givare: 'Make, maka eller sambo 1',
      givareHelp: 'Fullmaktsgivare i dokument 1 och fullmaktshavare i dokument 2.',
      havare: 'Make, maka eller sambo 2',
      havareHelp: 'Fullmaktshavare i dokument 1 och fullmaktsgivare i dokument 2.',
    },
    fields: [
      { id: 'make1_namn', label: 'Fullständigt namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'make1_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'make1_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'make2_namn', label: 'Fullständigt namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'make2_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'make2_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'havare' },
      { id: 'parrelation', label: 'Ni är', type: 'select', options: ['Makar', 'Sambor'], required: false, group: 'havare' },
      { id: 'ersattare_namn', label: 'Ersättare – namn (valfritt)', type: 'text', required: false, group: 'havare', placeholder: 'Träder in om fullmaktshavaren inte kan eller vill' },
      { id: 'ersattare_pnr', label: 'Ersättarens personnummer (valfritt)', type: 'personnummer', required: false, group: 'havare', placeholder: 'ÅÅÅÅMMDD-XXXX' },
      { id: 'uppdrag', label: 'Angelägenheter som fullmakten omfattar', type: 'textarea', required: true, group: 'detaljer',
        placeholder: 'T.ex.: Samtliga mina ekonomiska angelägenheter, bland annat att betala räkningar, sköta mina bankkonton och placeringar, deklarera och företräda mig hos myndigheter. Mina personliga angelägenheter, bland annat frågor om boende, hemtjänst och kontakter med kommunen.',
        helpText: 'Obligatoriskt (5 § lagen om framtidsfullmakter). Får omfatta ekonomiska och personliga angelägenheter. Får inte omfatta vård, tandvård eller frågor av utpräglat personlig karaktär, som äktenskap eller testamente.' },
      { id: 'fastigheter', label: 'Fast egendom och bostadsrätter (valfritt)', type: 'textarea', required: false, group: 'detaljer',
        placeholder: 'T.ex.: Fullmaktshavaren får förvalta, pantsätta och sälja fastigheten Uppsala Kåbo 1:23 och bostadsrätten på Storgatan 1 i Uppsala.',
        helpText: 'Skriv uttryckligen vad fullmaktshavaren får göra med egendomen, till exempel förvalta eller sälja.' },
      { id: 'gavor', label: 'Gåvor (valfritt)', type: 'textarea', required: false, group: 'detaljer',
        placeholder: 'T.ex.: Fullmaktshavaren får ge barnbarnen gåvor vid födelsedagar och jul med högst 2 000 kr per barnbarn och år.',
        helpText: 'Lämnar du fältet tomt får fullmaktshavaren bara ge personliga presenter av rimligt värde till andra än sig själv (18 §).' },
      { id: 'arvode', label: 'Arvode till fullmaktshavaren', type: 'select', required: false, group: 'detaljer',
        options: ['Inget arvode', 'Skäligt arvode'],
        helpText: 'Fullmaktshavaren har rätt till arvode bara om det står i fullmakten (19 §). Väljer du inget blir det inget arvode.' },
      { id: 'granskare_namn', label: 'Granskare – namn (valfritt)', type: 'text', required: false, group: 'detaljer', placeholder: 'T.ex. ett syskon eller en vän',
        helpText: 'En granskare kan begära redovisning av fullmaktshavaren (23 §).' },
      { id: 'granskare_pnr', label: 'Granskarens personnummer (valfritt)', type: 'personnummer', required: false, group: 'detaljer', placeholder: 'ÅÅÅÅMMDD-XXXX' },
      { id: 'granskare_aterkalla', label: 'Granskaren får återkalla fullmakten', type: 'checkbox', required: false, group: 'detaljer',
        helpText: 'Gäller bara om du har utsett en granskare (8 § andra stycket).' },
      { id: 'domstolsprovning', label: 'Tingsrätten ska pröva om fullmakten har trätt i kraft', type: 'checkbox', required: false, group: 'detaljer',
        helpText: 'Annars är det fullmaktshavaren som bedömer det (9 §).' },
      { id: 'ovriga_villkor', label: 'Övriga villkor (valfritt)', type: 'textarea', required: false, group: 'detaljer',
        placeholder: 'T.ex. att fullmaktshavaren ska samråda med mina barn innan bostaden säljs.' },
    ],
    faq: [
      { q: 'Måste fullmakterna bevittnas?', a: 'Ja, det är ett lagkrav. Var och en skriver under sin egen framtidsfullmakt i två vittnens samtidiga närvaro, och vittnena ska känna till att handlingen är en framtidsfullmakt (4 § lagen om framtidsfullmakter). Din make, maka eller sambo är fullmaktshavare och får därför inte vara vittne till din fullmakt.' },
      { q: 'Kan vi skriva en gemensam framtidsfullmakt?', a: 'Nej. Varje person ger sin egen framtidsfullmakt. Mallen skapar därför två separata dokument i samma PDF – ett där du är fullmaktsgivare och ett där din partner är det.' },
      { q: 'Kan vi använda samma vittnen?', a: 'Ja, samma två personer kan bevittna båda dokumenten, om de inte är släkt med någon av er i rakt upp- eller nedstigande led, syskon eller besvågrade. Varje dokument ska undertecknas i båda vittnenas samtidiga närvaro.' },
      { q: 'Hur återkallar jag min fullmakt?', a: 'En framtidsfullmakt kan inte göras oåterkallelig (6 §). Du återkallar din egen genom att ta tillbaka eller förstöra handlingen (8 § och avtalslagen 16 §). Din partners fullmakt påverkas inte.' },
      { q: 'Vad händer om ingen av oss kan längre?', a: 'Därför är det klokt att utse en ersättare, till exempel ett vuxet barn, som träder in om fullmaktshavaren inte kan eller vill fullgöra uppdraget.' },
    ],
    relatedIds: [137, 138, 139],
    legalInfo: 'Lag (2017:310) om framtidsfullmakter. Varje dokument ska undertecknas i två vittnens samtidiga närvaro (4 §).',
    keywords: ['framtidsfullmakt makar', 'ömsesidig framtidsfullmakt', 'framtidsfullmakt äkta makar', 'framtidsfullmakt sambo'],
  } as TemplateInput);

  // Fullmakt begravning för anhörig
  templates.push({
    id: 150,
    slug: 'fullmakt-begravning-anhorig',
    name: "Fullmakt begravning för anhörig",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för anhörig att ordna begravning för den avlidne.",
    longDescription: "Ger en utvald anhörig rätt att teckna avtal med begravningsbyrån, ordna ceremonin, gravsten och annat praktiskt kring begravningen. Bör utfärdas av samtliga dödsbodelägare.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [226, 227, 228],
    legalInfo: "Begravningslagen (1990:1144) och ärvdabalken (1958:637).",
    keywords: ["fullmakt begravning", "begravning anhörig", "fullmakt begravningsbyrå"],
  } as TemplateInput);

  // Fullmakt skilsmässa
  templates.push({
    id: 151,
    slug: 'fullmakt-skilsmassa-ombud',
    name: "Fullmakt skilsmässa",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för ombud (ofta advokat) att företräda i skilsmässoärende.",
    longDescription: "Ger ombudet rätt att lämna in ansökan om skilsmässa, företräda dig i bodelning och kommunicera med tingsrätten. Mycket användbart om du är utomlands eller vill ha juridisk företrädare.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [150, 151, 152],
    legalInfo: "Äktenskapsbalken (1987:230) reglerar skilsmässa och bodelning.",
    keywords: ["fullmakt skilsmässa", "fullmakt äktenskapsskillnad", "skilsmässa ombud"],
  } as TemplateInput);

  // Fullmakt adoption
  templates.push({
    id: 152,
    slug: 'fullmakt-adoption-arende',
    name: "Fullmakt adoption",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för ombud att hantera adoptionsärende hos socialnämnden eller MFoF.",
    longDescription: "Ger ombudet (ofta adoptionsbyrå eller advokat) rätt att kommunicera med socialnämnden, MFoF, tingsrätten och utländska myndigheter under adoptionsprocessen.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [151, 153, 154],
    legalInfo: "Föräldrabalken (1949:381) 4 kap. om adoption och lag (1997:191) med anledning av Sveriges tillträde till Haagkonventionen om skydd av barn och samarbete vid internationella adoptioner.",
    keywords: ["fullmakt adoption", "adoption ombud", "MFoF fullmakt"],
  } as TemplateInput);

  // Medgivande för regelbunden barnpassning
  templates.push({
    id: 153,
    slug: 'medgivande-barnpassning-regelbunden',
    name: "Medgivande för regelbunden barnpassning",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Medgivande för barnvakt, mor-/farförälder eller dagbarnvårdare att passa barnet regelbundet.",
    longDescription: "Specificerar omfattning, ansvar och tidsperiod för regelbunden barnpassning. Ger barnvakten rätt att fatta vissa vardagliga beslut, hämta från skola, akut sjukvård etc.",
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vh1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh2_namn', label: 'Vårdnadshavare 2 (om gemensam vårdnad)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'vh2_pnr', label: 'Vårdnadshavare 2 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets/utförarens namn', type: 'text', placeholder: 'T.ex. mor- eller farförälder, läkare', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'havare' },
      { id: 'syfte', label: 'Syfte/specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv ändamålet...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs båda vårdnadshavares underskrift?", a: "Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en." },
      { q: "Hur länge gäller medgivandet?", a: "Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet." },
      { q: "Kan medgivandet återkallas?", a: "Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart." },
      { q: "Behöver medgivandet bevittnas?", a: "Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas." },
      { q: "Vad om vårdnadshavarna är osams?", a: "Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden." },
    ],
    relatedIds: [149, 153, 154],
    legalInfo: "Vårdnadshavaren har rätt och skyldighet att bestämma i frågor som rör barnets personliga angelägenheter (6 kap. 11 § föräldrabalken (1949:381)).",
    keywords: ["medgivande barnpassning", "fullmakt barnvakt", "fullmakt mor-/farförälder barn"],
  } as TemplateInput);

  // Fullmakt umgängesrätt
  templates.push({
    id: 154,
    slug: 'fullmakt-umgangesratt-ombud',
    name: "Fullmakt umgängesrätt",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för ombud i umgängesrättstvister.",
    longDescription: "Ger advokat eller annat ombud rätt att företräda en vårdnadshavare i tvister om umgänge, vårdnad eller boende. Kommunicerar med tingsrätt, socialnämnd och motparten.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [150, 151, 154],
    legalInfo: "Föräldrabalken (1949:381) 6 kap. om vårdnad, boende och umgänge.",
    keywords: ["fullmakt umgänge", "fullmakt vårdnadstvist", "umgängesrätt ombud"],
  } as TemplateInput);

  // Fullmakt vårdnadshavare bistånd
  templates.push({
    id: 155,
    slug: 'fullmakt-vardnadshavare-bistand',
    name: "Fullmakt vårdnadshavare bistånd",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för annan vuxen att bistå vårdnadshavaren tillfälligt.",
    longDescription: "Vid sjukdom, resa eller annan tillfällig frånvaro ger denna fullmakt en annan vuxen rätt att bistå med vardagliga beslut, hämta från skola och vid behov söka vård.",
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vh1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh2_namn', label: 'Vårdnadshavare 2 (om gemensam vårdnad)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'vh2_pnr', label: 'Vårdnadshavare 2 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets/utförarens namn', type: 'text', placeholder: 'T.ex. mor- eller farförälder, läkare', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'havare' },
      { id: 'syfte', label: 'Syfte/specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv ändamålet...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs båda vårdnadshavares underskrift?", a: "Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en." },
      { q: "Hur länge gäller medgivandet?", a: "Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet." },
      { q: "Kan medgivandet återkallas?", a: "Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart." },
      { q: "Behöver medgivandet bevittnas?", a: "Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas." },
      { q: "Vad om vårdnadshavarna är osams?", a: "Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden." },
    ],
    relatedIds: [153, 152, 149],
    legalInfo: "Vårdnadshavaren har rätt och skyldighet att bestämma i frågor som rör barnets personliga angelägenheter (6 kap. 11 § föräldrabalken (1949:381)).",
    keywords: ["fullmakt vårdnadshavare", "tillfällig vårdnad fullmakt", "medgivande barn bistånd"],
  } as TemplateInput);

  // Fullmakt sambo-avtal
  templates.push({
    id: 156,
    slug: 'fullmakt-sambo-avtal-ombud',
    name: "Fullmakt sambo-avtal",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för ombud att upprätta eller företräda i sambolagens ärenden.",
    longDescription: "Ger ombudet rätt att förhandla, upprätta sambo-avtal eller företräda dig i bodelning enligt sambolagen. Lämpligt om du är utomlands eller vill ha juridisk företrädare.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [150, 151, 152],
    legalInfo: "Sambolagen (2003:376) reglerar samboegendom och bodelning vid separation.",
    keywords: ["fullmakt sambo", "sambo-avtal ombud", "sambolagen fullmakt", "samboegendom fullmakt"],
  } as TemplateInput);

  // Fullmakt föräldraledighet myndighet
  templates.push({
    id: 157,
    slug: 'fullmakt-foraldraledighet-myndighet',
    name: "Fullmakt föräldraledighet myndighet",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för partner eller ombud att hantera föräldraledighetsärenden.",
    longDescription: "Ger ombudet rätt att kommunicera med Försäkringskassan, arbetsgivare och kommunen om föräldrapenning, VAB och föräldraledighet.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [152, 153, 154],
    legalInfo: "Föräldraledighetslagen (1995:584) och socialförsäkringsbalken (2010:110).",
    keywords: ["fullmakt föräldraledighet", "fullmakt föräldrapenning", "försäkringskassan föräldraledighet"],
  } as TemplateInput);

  // Fullmakt familjerådgivning
  templates.push({
    id: 158,
    slug: 'fullmakt-familjeradgivning-ombud',
    name: "Fullmakt familjerådgivning",
    category: "Föräldrar & Barn",
    categorySlug: 'foraldrar-barn',
    description: "Fullmakt för ombud att begära familjerådgivning hos kommunen.",
    longDescription: "Ger ombudet rätt att initiera, boka och kommunicera med familjerådgivningen i din kommun. Kan användas vid uppslitande situationer.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [152, 150, 156],
    legalInfo: "Socialtjänstlagen (2025:400) 13 kap. 4 § reglerar familjerådgivning som kommunens ansvar.",
    keywords: ["fullmakt familjerådgivning", "kommunal familjerådgivning fullmakt"],
  } as TemplateInput);

  // Fullmakt kommunärende
  templates.push({
    id: 159,
    slug: 'fullmakt-kommun-arende',
    name: "Fullmakt kommunärende",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Allmän fullmakt för att företräda dig hos kommunen.",
    longDescription: "Ger ombudet rätt att kommunicera med kommunen i bygglov, bostadsfrågor, försörjningsstöd, äldreomsorg eller annat. Specificera vilken nämnd eller ärendetyp.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [158, 159, 160],
    legalInfo: "Kommunallagen (2017:725) och förvaltningslagen (2017:900) reglerar kommunens ärendehantering.",
    keywords: ["fullmakt kommun", "kommunärende ombud", "fullmakt kommunala myndigheter"],
  } as TemplateInput);

  // Fullmakt Lantmäteriet
  templates.push({
    id: 160,
    slug: 'fullmakt-lantmateriet',
    name: "Fullmakt Lantmäteriet",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera ärenden hos Lantmäteriet.",
    longDescription: "Ger ombudet rätt att ansöka om lagfart, inteckningar, fastighetsbildning och andra Lantmäteri-ärenden. Vanligt vid bostadsköp där köparen inte kan närvara.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [157, 171, 172],
    legalInfo: "Jordabalken (1970:994) och fastighetsbildningslagen (1970:988).",
    keywords: ["fullmakt Lantmäteriet", "lagfart fullmakt", "fastighetsbildning fullmakt"],
  } as TemplateInput);

  // Fullmakt polisanmälan
  templates.push({
    id: 161,
    slug: 'fullmakt-polisanmalan-ombud',
    name: "Fullmakt polisanmälan",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att göra polisanmälan i ditt namn.",
    longDescription: "Ger ombudet rätt att göra polisanmälan, lämna in handlingar och företräda dig i polisärenden. Lämpligt om du är skadad, utomlands eller saknar förmåga.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [157, 160, 170],
    legalInfo: "Rättegångsbalken (1942:740) reglerar förundersökning och polisanmälan.",
    keywords: ["fullmakt polisanmälan", "polisanmälan ombud", "fullmakt polisen"],
  } as TemplateInput);

  // Fullmakt passförnyelse vuxen
  templates.push({
    id: 162,
    slug: 'fullmakt-passfornyelse-vuxen',
    name: "Fullmakt passförnyelse vuxen",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för annan person att ansöka om passförnyelse för vuxen.",
    longDescription: "Ger ombudet rätt att hjälpa till med passansökan i begränsade fall – t.ex. vid sjukdom. Notera att passansökan kräver personlig inställelse för fingeravtryck och foto.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [157, 160, 162],
    legalInfo: "Passlagen (1978:302). Observera: sökanden är skyldig att inställa sig personligen (6 §).",
    keywords: ["fullmakt pass vuxen", "passförnyelse fullmakt", "fullmakt passansökan vuxen"],
  } as TemplateInput);

  // Fullmakt CSN-ärenden
  templates.push({
    id: 163,
    slug: 'fullmakt-csn-ansokan',
    name: "Fullmakt CSN-ärenden",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera ärenden hos CSN.",
    longDescription: "Ger ombudet rätt att ansöka om studielån, kommunicera med CSN och hantera återbetalningsärenden. Vanligt för studenter utomlands eller anhöriga som hjälper.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [157, 163, 164],
    legalInfo: "Studiestödslagen (1999:1395) reglerar CSN-stöd.",
    keywords: ["fullmakt CSN", "CSN ombud", "studielån fullmakt"],
  } as TemplateInput);

  // Fullmakt Försäkringskassan sjukpenning
  templates.push({
    id: 164,
    slug: 'fullmakt-fk-sjukpenning',
    name: "Fullmakt Försäkringskassan sjukpenning",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för anhörig att hantera sjukpenningärenden hos Försäkringskassan.",
    longDescription: "Ger ombudet rätt att ansöka om sjukpenning, kommunicera med Försäkringskassan och överklaga beslut. Lämpligt vid längre sjukskrivningar.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [162, 164, 178],
    legalInfo: "Socialförsäkringsbalken (2010:110) reglerar sjukpenning och Försäkringskassans handläggning.",
    keywords: ["fullmakt FK sjukpenning", "fullmakt försäkringskassan", "sjukpenning ombud"],
  } as TemplateInput);

  // Fullmakt arbetslöshet (a-kassa)
  templates.push({
    id: 165,
    slug: 'fullmakt-arbetsloshet-arende',
    name: "Fullmakt arbetslöshet (a-kassa)",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera a-kasseärende.",
    longDescription: "Ger ombudet rätt att kommunicera med a-kassan, Arbetsförmedlingen och hantera ersättningsfrågor. Lämpligt vid utlandsvistelse eller sjukdom.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [162, 163, 178],
    legalInfo: "Lag (2024:506) om arbetslöshetsförsäkring.",
    keywords: ["fullmakt a-kassa", "fullmakt arbetslöshet", "fullmakt arbetsförmedlingen"],
  } as TemplateInput);

  // Fullmakt Jordbruksverket
  templates.push({
    id: 166,
    slug: 'fullmakt-jordbruksverket',
    name: "Fullmakt Jordbruksverket",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera ärenden hos Jordbruksverket.",
    longDescription: "Ger ombudet rätt att söka EU-stöd, hantera djurregistrering och kommunicera med Jordbruksverket. Vanligt för lantbruksföretagare.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [165, 167, 168],
    legalInfo: "Den som är part i ett ärende får anlita ombud (14 § förvaltningslagen (2017:900)).",
    keywords: ["fullmakt Jordbruksverket", "lantbruksstöd fullmakt", "EU-stöd fullmakt"],
  } as TemplateInput);

  // Fullmakt Skogsstyrelsen
  templates.push({
    id: 167,
    slug: 'fullmakt-skogsstyrelsen',
    name: "Fullmakt Skogsstyrelsen",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera skogsbruksärenden hos Skogsstyrelsen.",
    longDescription: "Ger ombudet rätt att lämna avverkningsanmälan, ansöka om skogsbruksbidrag och kommunicera med Skogsstyrelsen.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [164, 166, 168],
    legalInfo: "Skogsvårdslagen (1979:429) och Skogsstyrelsens föreskrifter.",
    keywords: ["fullmakt Skogsstyrelsen", "avverkningsanmälan fullmakt", "skogsbruk ombud"],
  } as TemplateInput);

  // Fullmakt statlig tjänsteanvisning
  templates.push({
    id: 168,
    slug: 'fullmakt-statlig-tjanst-anvisning',
    name: "Fullmakt statlig tjänsteanvisning",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera kontakt med statlig myndighet vid utnämning eller tjänsteanvisning.",
    longDescription: "Ger ombudet rätt att kommunicera med statlig myndighet i tillsättningsärenden, lönefrågor och placering.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [162, 163, 168],
    legalInfo: "Lag (1994:260) om offentlig anställning.",
    keywords: ["fullmakt statlig anställning", "tjänsteanvisning fullmakt"],
  } as TemplateInput);

  // Fullmakt vapenlicens
  templates.push({
    id: 169,
    slug: 'fullmakt-vapenlicens-ombud',
    name: "Fullmakt vapenlicens",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att hantera vapenlicensärende hos polisen.",
    longDescription: "Ger ombudet rätt att ansöka om eller förnya vapenlicens, lämna in handlingar och kommunicera med polisens tillståndsenhet.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [159, 170, 178],
    legalInfo: "Vapenlagen (2026:408) reglerar vapentillstånd, och Polismyndigheten prövar frågor om tillstånd (1 kap. 11 §).",
    keywords: ["fullmakt vapenlicens", "fullmakt polisen vapen", "vapenlicens ombud"],
  } as TemplateInput);

  // Fullmakt hemvärnet anmälan
  templates.push({
    id: 170,
    slug: 'fullmakt-hemvarnet-anmalan',
    name: "Fullmakt hemvärnet anmälan",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för anhörig vid anmälan eller avanmälan från hemvärnet.",
    longDescription: "Ger ombudet rätt att kommunicera med Försvarsmakten/hemvärnet om tjänstgöring, avanmälan eller praktiska frågor.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [167, 170, 168],
    legalInfo: "Hemvärnsförordningen (1997:146).",
    keywords: ["fullmakt hemvärnet", "fullmakt Försvarsmakten", "hemvärnsärende ombud"],
  } as TemplateInput);

  // Fullmakt fastighetsförsäljning villa
  templates.push({
    id: 171,
    slug: 'fullmakt-fastighetsforsaljning-villa',
    name: "Fullmakt fastighetsförsäljning villa",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för att sälja villa, fritidshus eller annan fast egendom.",
    longDescription: "Mycket viktig fullmakt – ger ombudet rätt att underteckna köpekontrakt och köpebrev för fast egendom. Kräver bevittning av två vittnen enligt jordabalken.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [170, 171, 172],
    legalInfo: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Är säljarens underskrift på köpehandlingen inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken (1970:994)).",
    keywords: ["fullmakt fastighetsförsäljning", "fullmakt sälja villa", "fastighetsförsäljning ombud", "fullmakt köpekontrakt"],
  } as TemplateInput);

  // Fullmakt lagfart
  templates.push({
    id: 172,
    slug: 'fullmakt-lagfart-ansokan',
    name: "Fullmakt lagfart",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för ombud att ansöka om lagfart hos Lantmäteriet.",
    longDescription: "Ger ombudet (ofta jurist eller mäklare) rätt att lämna in lagfartsansökan, betala stämpelskatt och företräda dig i Lantmäteriet-ärendet.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [169, 171, 172],
    legalInfo: "Jordabalken (1970:994) 20 kap. om lagfart.",
    keywords: ["fullmakt lagfart", "lagfart ombud", "fullmakt Lantmäteriet"],
  } as TemplateInput);

  // Fullmakt inteckning och pantbrev
  templates.push({
    id: 173,
    slug: 'fullmakt-inteckning-pantbrev',
    name: "Fullmakt inteckning och pantbrev",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för bank eller mäklare att ansöka om inteckning.",
    longDescription: "Ger ombudet rätt att ansöka om inteckning hos Lantmäteriet och ta emot pantbrev. Standardförfarande vid bolåneprocessen.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [169, 170, 172],
    legalInfo: "Jordabalken (1970:994) 22 kap. om inteckning.",
    keywords: ["fullmakt inteckning", "fullmakt pantbrev", "bolån fullmakt"],
  } as TemplateInput);

  // Fullmakt tomträtt
  templates.push({
    id: 174,
    slug: 'fullmakt-tomtratt-ombud',
    name: "Fullmakt tomträtt",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för ombud att hantera tomträttsärenden hos kommunen eller Lantmäteriet.",
    longDescription: "Ger ombudet rätt att förhandla, förnya eller överlåta tomträtt åt dig.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [171, 169, 170],
    legalInfo: "Jordabalken (1970:994) 13 kap. om tomträtt.",
    keywords: ["fullmakt tomträtt", "tomträtt ombud", "fullmakt kommun tomt"],
  } as TemplateInput);

  // Fullmakt arrende
  templates.push({
    id: 175,
    slug: 'fullmakt-arrende-avtal',
    name: "Fullmakt arrende",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för ombud att teckna eller förhandla arrendeavtal.",
    longDescription: "Ger ombudet rätt att förhandla, teckna och säga upp arrendeavtal (jordbruks-, anläggnings-, bostads- eller lägenhetsarrende).",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [173, 174, 175],
    legalInfo: "Jordabalken (1970:994) 8–11 kap. om arrende.",
    keywords: ["fullmakt arrende", "arrende ombud", "jordbruksarrende fullmakt"],
  } as TemplateInput);

  // Fullmakt servitut
  templates.push({
    id: 176,
    slug: 'fullmakt-servitut-anlaggning',
    name: "Fullmakt servitut",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för ombud att förhandla eller registrera servitut.",
    longDescription: "Ger ombudet rätt att förhandla servitutsavtal och ansöka om officialservitut hos Lantmäteriet.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [169, 172, 174],
    legalInfo: "Jordabalken (1970:994) 14 kap. om servitut och fastighetsbildningslagen.",
    keywords: ["fullmakt servitut", "officialservitut fullmakt", "servitut Lantmäteriet"],
  } as TemplateInput);

  // Fullmakt strandskyddsdispens
  templates.push({
    id: 177,
    slug: 'fullmakt-strandskyddsdispens',
    name: "Fullmakt strandskyddsdispens",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för ombud att ansöka om strandskyddsdispens.",
    longDescription: "Ger ombudet rätt att förbereda och lämna in ansökan om dispens från strandskyddet hos kommunens eller länsstyrelsens miljönämnd.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [175, 172, 169],
    legalInfo: "Miljöbalken (1998:808) 7 kap. om strandskydd.",
    keywords: ["fullmakt strandskydd", "strandskyddsdispens ombud", "fullmakt länsstyrelsen miljö"],
  } as TemplateInput);

  // Fullmakt bygglov
  templates.push({
    id: 178,
    slug: 'fullmakt-bygglov-ansokan',
    name: "Fullmakt bygglov",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för arkitekt eller ombud att ansöka om bygglov.",
    longDescription: "Ger ombudet (arkitekt, byggfirma) rätt att lämna in bygglovsansökan, kommunicera med byggnadsnämnden och fatta beslut om mindre justeringar.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [174, 169, 172],
    legalInfo: "Plan- och bygglagen (2010:900).",
    keywords: ["fullmakt bygglov", "bygglov ombud", "arkitekt fullmakt bygglov"],
  } as TemplateInput);

  // Fullmakt fastighetsavstyckning
  templates.push({
    id: 179,
    slug: 'fullmakt-fastighetsavstyckning',
    name: "Fullmakt fastighetsavstyckning",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för ombud att ansöka om avstyckning hos Lantmäteriet.",
    longDescription: "Ger ombudet rätt att begära avstyckning, sammanläggning eller klyvning av fastighet hos Lantmäteriet.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [169, 172, 170],
    legalInfo: "Fastighetsbildningslagen (1970:988).",
    keywords: ["fullmakt avstyckning", "fastighetsbildning fullmakt", "fullmakt Lantmäteriet"],
  } as TemplateInput);

  // Fullmakt försäljning lantbruksfastighet
  templates.push({
    id: 180,
    slug: 'fullmakt-forsaljning-lantbruk',
    name: "Fullmakt försäljning lantbruksfastighet",
    category: "Boende & Vardag",
    categorySlug: 'boende-vardag',
    description: "Fullmakt för att sälja lantbruks- eller skogsfastighet.",
    longDescription: "Specifik fullmakt för försäljning av lantbruksfastighet med skog, jordbruk eller andra tillhörande rättigheter. Kräver bevittning enligt jordabalken.",
    fields: [
      { id: 'agare_namn', label: 'Fastighetsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', type: 'text', placeholder: 'T.ex. Stockholm Vasastaden 1:23', required: true, group: 'detaljer' },
      { id: 'fastighet_adress', label: 'Fastighetens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'textarea', placeholder: 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta accepterade pris (om relevant)', type: 'text', placeholder: 'T.ex. 4 500 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs bevittning för fastighetsfullmakt?", a: "Fullmakt att sluta avtal om köp, byte eller gåva av fast egendom ska vara skriftlig (27 § andra stycket avtalslagen (1915:218)). Köpehandlingen ska skrivas under av säljaren och köparen (4 kap. 1 § jordabalken (1970:994)), och är säljarens underskrift inte bevittnad av två vittnen förklaras lagfartsansökan vilande (20 kap. 7 § 1 jordabalken)." },
      { q: "Kan ombudet skriva under köpekontrakt?", a: "Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav." },
      { q: "Hur länge gäller fastighetsfullmakten?", a: "Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns." },
      { q: "Vad händer om priset blir lägre än önskat?", a: "Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten." },
      { q: "Behöver fullmakten lagföras?", a: "Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden." },
    ],
    relatedIds: [167, 169, 170],
    legalInfo: "Jordabalken (1970:994) och jordförvärvslagen (1979:230) som reglerar förvärv av lantbruksfastighet.",
    keywords: ["fullmakt lantbruk", "fullmakt skogsfastighet", "försäljning lantbruk ombud"],
  } as TemplateInput);

  // Livstestamente
  templates.push({
    id: 181,
    slug: 'fullmakt-livstestamente',
    name: "Livstestamente",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Skriftlig viljeyttring om livsuppehållande behandling vid svår sjukdom.",
    longDescription: "Anger din vilja om vård i livets slutskede – t.ex. om livsuppehållande behandling ska sättas in eller avstås. Är inte juridiskt bindande i Sverige men respekteras starkt av vårdpersonal.",
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Patientens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'patient_adress', label: 'Patientens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn, vårdnadshavare', required: true, group: 'havare' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Universitetssjukhuset', required: false, group: 'detaljer' },
      { id: 'behandling', label: 'Specifik behandling/ärende', type: 'textarea', placeholder: 'Beskriv vad medgivandet/fullmakten gäller...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Godtar vården ett ombud?", a: "Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg." },
      { q: "Kan ombudet fatta medicinska beslut?", a: "Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke." },
      { q: "Får ombudet ta del av journalen?", a: "Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355)." },
      { q: "Behöver fullmakten bevittnas?", a: "Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd." },
      { q: "Vad är skillnaden mot en framtidsfullmakt?", a: "En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut." },
    ],
    relatedIds: [179, 180, 181],
    legalInfo: "Patientlagen (2014:821) 4 kap. om samtycke och 5 kap. om delaktighet.",
    keywords: ["livstestamente", "fullmakt vård i livets slut", "palliativ vård fullmakt"],
  } as TemplateInput);

  // Fullmakt vårdönskemål
  templates.push({
    id: 182,
    slug: 'fullmakt-vardonskemal',
    name: "Fullmakt vårdönskemål",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Fullmakt med detaljerade önskemål om medicinsk behandling.",
    longDescription: "Komplement till livstestamente – specificerar dina vårdönskemål för olika scenarier och utser ett ombud som ska företräda dig om du blir oförmögen.",
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Patientens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'patient_adress', label: 'Patientens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn, vårdnadshavare', required: true, group: 'havare' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Universitetssjukhuset', required: false, group: 'detaljer' },
      { id: 'behandling', label: 'Specifik behandling/ärende', type: 'textarea', placeholder: 'Beskriv vad medgivandet/fullmakten gäller...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Godtar vården ett ombud?", a: "Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg." },
      { q: "Kan ombudet fatta medicinska beslut?", a: "Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke." },
      { q: "Får ombudet ta del av journalen?", a: "Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355)." },
      { q: "Behöver fullmakten bevittnas?", a: "Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd." },
      { q: "Vad är skillnaden mot en framtidsfullmakt?", a: "En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut." },
    ],
    relatedIds: [178, 180, 181],
    legalInfo: "Patientlagen (2014:821) reglerar samråd och samtycke.",
    keywords: ["fullmakt vårdönskemål", "vårddirektiv", "patient direktiv"],
  } as TemplateInput);

  // Medgivande tandreglering barn
  templates.push({
    id: 183,
    slug: 'medgivande-tandreglering-barn',
    name: "Medgivande tandreglering barn",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Vårdnadshavares medgivande för tandreglering av barn under 18.",
    longDescription: "Medgivande som krävs av tandläkaren innan tandreglering (ortodontisk behandling) påbörjas för minderårig. Specificerar behandling, omfattning och kostnad.",
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vh1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh2_namn', label: 'Vårdnadshavare 2 (om gemensam vårdnad)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'vh2_pnr', label: 'Vårdnadshavare 2 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets/utförarens namn', type: 'text', placeholder: 'T.ex. mor- eller farförälder, läkare', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'havare' },
      { id: 'syfte', label: 'Syfte/specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv ändamålet...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs båda vårdnadshavares underskrift?", a: "Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en." },
      { q: "Hur länge gäller medgivandet?", a: "Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet." },
      { q: "Kan medgivandet återkallas?", a: "Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart." },
      { q: "Behöver medgivandet bevittnas?", a: "Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas." },
      { q: "Vad om vårdnadshavarna är osams?", a: "Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden." },
    ],
    relatedIds: [182, 184, 183],
    legalInfo: "Tandvårdslagen (1985:125) och patientlagen (2014:821).",
    keywords: ["medgivande tandreglering", "tandreglering barn fullmakt", "ortodonti barn samtycke"],
  } as TemplateInput);

  // Medgivande blodprov barn
  templates.push({
    id: 184,
    slug: 'medgivande-blodprov-barn',
    name: "Medgivande blodprov barn",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Medgivande för blodprov eller annan provtagning på minderårig.",
    longDescription: "Vårdnadshavares medgivande till blodprov, urinprov eller annan provtagning på barn. Krävs vid icke-akut provtagning eller forskning.",
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vh1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh2_namn', label: 'Vårdnadshavare 2 (om gemensam vårdnad)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'vh2_pnr', label: 'Vårdnadshavare 2 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets/utförarens namn', type: 'text', placeholder: 'T.ex. mor- eller farförälder, läkare', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'havare' },
      { id: 'syfte', label: 'Syfte/specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv ändamålet...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs båda vårdnadshavares underskrift?", a: "Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en." },
      { q: "Hur länge gäller medgivandet?", a: "Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet." },
      { q: "Kan medgivandet återkallas?", a: "Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart." },
      { q: "Behöver medgivandet bevittnas?", a: "Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas." },
      { q: "Vad om vårdnadshavarna är osams?", a: "Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden." },
    ],
    relatedIds: [180, 182, 184],
    legalInfo: "Patientlagen (2014:821) 4 kap. och lag (2003:460) om etikprövning av forskning som avser människor.",
    keywords: ["medgivande blodprov barn", "provtagning barn samtycke", "forskning på barn medgivande"],
  } as TemplateInput);

  // Medgivande fertilitetsbehandling
  templates.push({
    id: 185,
    slug: 'medgivande-fertilitetsbehandling',
    name: "Medgivande fertilitetsbehandling",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Medgivande från par eller individ till assisterad befruktning.",
    longDescription: "Skriftligt medgivande från partner och eventuella donatorer vid IVF, insemination eller annan assisterad befruktning. Krävs av vårdgivaren.",
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Patientens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'patient_adress', label: 'Patientens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn, vårdnadshavare', required: true, group: 'havare' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Universitetssjukhuset', required: false, group: 'detaljer' },
      { id: 'behandling', label: 'Specifik behandling/ärende', type: 'textarea', placeholder: 'Beskriv vad medgivandet/fullmakten gäller...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Godtar vården ett ombud?", a: "Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg." },
      { q: "Kan ombudet fatta medicinska beslut?", a: "Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke." },
      { q: "Får ombudet ta del av journalen?", a: "Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355)." },
      { q: "Behöver fullmakten bevittnas?", a: "Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd." },
      { q: "Vad är skillnaden mot en framtidsfullmakt?", a: "En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut." },
    ],
    relatedIds: [179, 183, 185],
    legalInfo: "Lag (2006:351) om genetisk integritet m.m. 6 kap. (insemination) och 7 kap. (befruktning utanför kroppen).",
    keywords: ["medgivande IVF", "medgivande fertilitetsbehandling", "assisterad befruktning samtycke"],
  } as TemplateInput);

  // Medgivande organdonation levande
  templates.push({
    id: 186,
    slug: 'medgivande-organdonation-levande',
    name: "Medgivande organdonation levande",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Medgivande från levande donator vid njure- eller leverdonation.",
    longDescription: "Skriftligt medgivande från levande organdonator (oftast närstående). Genomgår strikt etisk prövning och kräver upprepad bekräftelse.",
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Patientens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'patient_adress', label: 'Patientens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn, vårdnadshavare', required: true, group: 'havare' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Universitetssjukhuset', required: false, group: 'detaljer' },
      { id: 'behandling', label: 'Specifik behandling/ärende', type: 'textarea', placeholder: 'Beskriv vad medgivandet/fullmakten gäller...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Godtar vården ett ombud?", a: "Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg." },
      { q: "Kan ombudet fatta medicinska beslut?", a: "Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke." },
      { q: "Får ombudet ta del av journalen?", a: "Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355)." },
      { q: "Behöver fullmakten bevittnas?", a: "Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd." },
      { q: "Vad är skillnaden mot en framtidsfullmakt?", a: "En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut." },
    ],
    relatedIds: [178, 179, 185],
    legalInfo: "Lag (1995:831) om transplantation m.m.",
    keywords: ["medgivande organdonation", "levande donator samtycke", "njurdonation fullmakt"],
  } as TemplateInput);

  // Medgivande vaccination barn
  templates.push({
    id: 187,
    slug: 'medgivande-vaccin-barn',
    name: "Medgivande vaccination barn",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Vårdnadshavares medgivande för vaccination av minderårig.",
    longDescription: "Specificerar vilka vacciner barnet får ta och under vilka omständigheter. Användbart när annan vuxen följer med barnet till vården.",
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vh1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh2_namn', label: 'Vårdnadshavare 2 (om gemensam vårdnad)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'vh2_pnr', label: 'Vårdnadshavare 2 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets/utförarens namn', type: 'text', placeholder: 'T.ex. mor- eller farförälder, läkare', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'havare' },
      { id: 'syfte', label: 'Syfte/specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv ändamålet...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs båda vårdnadshavares underskrift?", a: "Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en." },
      { q: "Hur länge gäller medgivandet?", a: "Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet." },
      { q: "Kan medgivandet återkallas?", a: "Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart." },
      { q: "Behöver medgivandet bevittnas?", a: "Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas." },
      { q: "Vad om vårdnadshavarna är osams?", a: "Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden." },
    ],
    relatedIds: [181, 182, 184],
    legalInfo: "Smittskyddslagen (2004:168) och patientlagen (2014:821).",
    keywords: ["medgivande vaccin barn", "vaccination samtycke", "fullmakt vaccinera barn"],
  } as TemplateInput);

  // Medgivande operation barn
  templates.push({
    id: 188,
    slug: 'medgivande-operation-barn',
    name: "Medgivande operation barn",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Vårdnadshavares medgivande för planerad operation av minderårig.",
    longDescription: "Skriftligt medgivande från båda vårdnadshavare för icke-akut operation. Krävs av sjukhuset innan ingreppet kan genomföras.",
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_pnr', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vh1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vh2_namn', label: 'Vårdnadshavare 2 (om gemensam vårdnad)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'vh2_pnr', label: 'Vårdnadshavare 2 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets/utförarens namn', type: 'text', placeholder: 'T.ex. mor- eller farförälder, läkare', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'havare' },
      { id: 'syfte', label: 'Syfte/specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv ändamålet...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Krävs båda vårdnadshavares underskrift?", a: "Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en." },
      { q: "Hur länge gäller medgivandet?", a: "Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet." },
      { q: "Kan medgivandet återkallas?", a: "Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart." },
      { q: "Behöver medgivandet bevittnas?", a: "Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas." },
      { q: "Vad om vårdnadshavarna är osams?", a: "Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden." },
    ],
    relatedIds: [179, 181, 184],
    legalInfo: "Patientlagen (2014:821) 4 kap. om samtycke och 5 kap. 1 § om samråd.",
    keywords: ["medgivande operation barn", "operation barn samtycke", "kirurgi barn fullmakt"],
  } as TemplateInput);

  // Medgivande genetisk testning
  templates.push({
    id: 189,
    slug: 'medgivande-genetisk-testning',
    name: "Medgivande genetisk testning",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Medgivande till genetisk testning eller DNA-analys.",
    longDescription: "Skriftligt informerat samtycke till genetisk testning, fosterdiagnostik eller DNA-analys. Inkluderar information om hantering av resultat.",
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Patientens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'patient_adress', label: 'Patientens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn, vårdnadshavare', required: true, group: 'havare' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Universitetssjukhuset', required: false, group: 'detaljer' },
      { id: 'behandling', label: 'Specifik behandling/ärende', type: 'textarea', placeholder: 'Beskriv vad medgivandet/fullmakten gäller...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Godtar vården ett ombud?", a: "Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg." },
      { q: "Kan ombudet fatta medicinska beslut?", a: "Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke." },
      { q: "Får ombudet ta del av journalen?", a: "Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355)." },
      { q: "Behöver fullmakten bevittnas?", a: "Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd." },
      { q: "Vad är skillnaden mot en framtidsfullmakt?", a: "En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut." },
    ],
    relatedIds: [181, 185, 186],
    legalInfo: "Lag (2006:351) om genetisk integritet m.m. 2 kap. om genetisk undersökning och information.",
    keywords: ["medgivande genetisk test", "DNA-test samtycke", "fosterdiagnostik samtycke"],
  } as TemplateInput);

  // Medgivande estetisk behandling
  templates.push({
    id: 190,
    slug: 'medgivande-estetisk-behandling',
    name: "Medgivande estetisk behandling",
    category: "Vård & Omsorg",
    categorySlug: 'vard-omsorg',
    description: "Medgivande till estetisk eller kosmetisk behandling.",
    longDescription: "Informerat samtycke till estetiska ingrepp – t.ex. botox, fillers eller plastikkirurgi. Bekräftar att du fått information om risker och alternativ.",
    fields: [
      { id: 'patient_namn', label: 'Patientens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'patient_pnr', label: 'Patientens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'patient_adress', label: 'Patientens adress', type: 'address', placeholder: 'Gatuadress, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till patienten', type: 'text', placeholder: 'T.ex. make/maka, barn, vårdnadshavare', required: true, group: 'havare' },
      { id: 'vardgivare', label: 'Vårdgivare (om specifik)', type: 'text', placeholder: 'T.ex. Karolinska Universitetssjukhuset', required: false, group: 'detaljer' },
      { id: 'behandling', label: 'Specifik behandling/ärende', type: 'textarea', placeholder: 'Beskriv vad medgivandet/fullmakten gäller...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Godtar vården ett ombud?", a: "Det avgör vårdgivaren. I offentligt driven vård gäller som huvudregel sekretess för uppgifter om patientens hälsotillstånd och andra personliga förhållanden (25 kap. 1 § offentlighets- och sekretesslagen (2009:400)), och patienten kan helt eller delvis häva sekretessen genom samtycke (12 kap. 2 § samma lag). Det är vårdgivaren som avgör vilka uppgifter som kan lämnas ut, så kontrollera med vården i förväg." },
      { q: "Kan ombudet fatta medicinska beslut?", a: "Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke." },
      { q: "Får ombudet ta del av journalen?", a: "Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355)." },
      { q: "Behöver fullmakten bevittnas?", a: "Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd." },
      { q: "Vad är skillnaden mot en framtidsfullmakt?", a: "En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut." },
    ],
    relatedIds: [178, 179, 184],
    legalInfo: "Patientsäkerhetslagen (2010:659) och Inspektionen för vård och omsorgs (IVO) tillsyn.",
    keywords: ["medgivande estetisk behandling", "samtycke skönhetsbehandling", "plastikkirurgi samtycke"],
  } as TemplateInput);

  // Fullmakt MC ägarbyte
  templates.push({
    id: 191,
    slug: 'fullmakt-mc-agarbyte',
    name: "Fullmakt MC ägarbyte",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för att sälja eller registrera motorcykel.",
    longDescription: "Ger ombudet rätt att hantera ägarbyte, registrering och försäkring för motorcykeln hos Transportstyrelsen.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [192, 193, 194],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt MC", "motorcykel ägarbyte", "fullmakt sälja MC"],
  } as TemplateInput);

  // Fullmakt husbil
  templates.push({
    id: 192,
    slug: 'fullmakt-husbil-arende',
    name: "Fullmakt husbil",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för försäljning, registrering eller besiktning av husbil.",
    longDescription: "Ger ombudet rätt att hantera alla husbils-relaterade ärenden – ägarbyte, registrering, försäkring och besiktning.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [191, 193, 194],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt husbil", "husbil försäljning", "husbil registrering ombud"],
  } as TemplateInput);

  // Fullmakt husvagn försäljning
  templates.push({
    id: 193,
    slug: 'fullmakt-husvagn-forsaljning',
    name: "Fullmakt husvagn försäljning",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för försäljning eller registrering av husvagn.",
    longDescription: "Ger ombudet rätt att sälja, anmäla ägarbyte och registrera/avregistrera husvagn hos Transportstyrelsen.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [191, 192, 194],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt husvagn", "husvagn försäljning", "husvagn ägarbyte"],
  } as TemplateInput);

  // Fullmakt snöskoter ägarbyte
  templates.push({
    id: 194,
    slug: 'fullmakt-snoskoter-agarbyte',
    name: "Fullmakt snöskoter ägarbyte",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för försäljning eller ägarbyte av snöskoter.",
    longDescription: "Ger ombudet rätt att anmäla ägarbyte, ansöka om registrering och hantera snöskoter-relaterade ärenden.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [191, 195, 196],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt snöskoter", "snöskoter ägarbyte", "fullmakt snowmobile"],
  } as TemplateInput);

  // Fullmakt traktor registrering
  templates.push({
    id: 195,
    slug: 'fullmakt-traktor-registrering',
    name: "Fullmakt traktor registrering",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för registrering, besiktning eller försäljning av traktor.",
    longDescription: "Ger ombudet rätt att hantera traktor-relaterade ärenden hos Transportstyrelsen, inklusive registrering och besiktning.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [195, 196, 190],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt traktor", "traktor registrering", "traktor ägarbyte"],
  } as TemplateInput);

  // Fullmakt EPA-traktor
  templates.push({
    id: 196,
    slug: 'fullmakt-epa-traktor',
    name: "Fullmakt EPA-traktor",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för EPA-traktor (A-traktor) – ägarbyte och registrering.",
    longDescription: "Ger ombudet rätt att hantera EPA-traktor / A-traktor-ärenden hos Transportstyrelsen. Vanligt för förälder som hjälper ungdom.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [194, 191, 190],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt EPA-traktor", "A-traktor fullmakt", "EPA-traktor ägarbyte"],
  } as TemplateInput);

  // Fullmakt båtregistrering 2026
  templates.push({
    id: 197,
    slug: 'fullmakt-bat-registrering-2026',
    name: "Fullmakt båtregistrering 2026",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för registrering av båt hos Transportstyrelsen.",
    longDescription: "Ger ombudet rätt att registrera båt eller anmäla ägarbyte i båtregistret. Krävs för båtar över 5 m längd.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [193, 195, 194],
    legalInfo: "Lag (1979:377) om registrering av båtar.",
    keywords: ["fullmakt båt", "båtregistrering 2026", "båt ägarbyte"],
  } as TemplateInput);

  // Fullmakt ATV
  templates.push({
    id: 198,
    slug: 'fullmakt-atv-arende',
    name: "Fullmakt ATV",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för ATV (terränghjuling) – registrering, ägarbyte, försäljning.",
    longDescription: "Ger ombudet rätt att hantera ATV-/terränghjulings-ärenden hos Transportstyrelsen.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [191, 193, 194],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt ATV", "fullmakt terränghjuling", "ATV ägarbyte"],
  } as TemplateInput);

  // Fullmakt lastbil företag
  templates.push({
    id: 199,
    slug: 'fullmakt-lastbil-foretag',
    name: "Fullmakt lastbil företag",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för företag att låta anställd hantera lastbils-ärenden.",
    longDescription: "Ger anställd eller speditör rätt att hantera lastbil/tunga fordon hos Transportstyrelsen – registrering, ägarbyte, kontrollbesiktning.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [191, 141, 196],
    legalInfo: "Yrkestrafiklagen (2012:210) och Transportstyrelsens föreskrifter.",
    keywords: ["fullmakt lastbil", "lastbil företag", "tunga fordon ombud"],
  } as TemplateInput);

  // Fullmakt veteranfordon
  templates.push({
    id: 200,
    slug: 'fullmakt-veteranfordon-arende',
    name: "Fullmakt veteranfordon",
    category: "Resa & Transport",
    categorySlug: 'resa-transport',
    description: "Fullmakt för försäljning, besiktning eller registrering av veteranfordon.",
    longDescription: "Ger ombudet rätt att hantera veteranfordon (över 30 år) hos Transportstyrelsen och försäkringsbolaget.",
    fields: [
      { id: 'agare_namn', label: 'Fordonsägarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'agare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'regnr', label: 'Registreringsnummer', type: 'text', placeholder: 'ABC 123', required: true, group: 'detaljer' },
      { id: 'fordon_beskrivning', label: 'Fordonsmodell och årsmodell', type: 'text', placeholder: 'T.ex. Volvo XC60 2020', required: true, group: 'detaljer' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Uppdragets art', type: 'select', options: ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], required: true, group: 'detaljer' },
      { id: 'min_pris', label: 'Lägsta pris vid försäljning (om relevant)', type: 'text', placeholder: 'T.ex. 75 000 kr', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Var anmäls ägarbyte?", a: "Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången." },
      { q: "Behöver fordonsfullmakten bevittnas?", a: "Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det." },
      { q: "Kan ombudet sälja fordonet under marknadsvärde?", a: "Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig." },
      { q: "Vad behövs vid besiktning?", a: "Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2." },
      { q: "Gäller fullmakten för export utomlands?", a: "Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket." },
    ],
    relatedIds: [191, 192, 193],
    legalInfo: "Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.",
    keywords: ["fullmakt veteranfordon", "veteranbil ägarbyte", "historiskt fordon fullmakt"],
  } as TemplateInput);

  // Fullmakt Google-konto dödsbo
  templates.push({
    id: 201,
    slug: 'fullmakt-google-konto-dodsbo',
    name: "Fullmakt Google-konto dödsbo",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för att hantera den avlidnes Google-konto.",
    longDescription: "Ger ombudet rätt att begära åtkomst, ladda ner data eller stänga den avlidnes Google-konto via Googles \"Inactive Account Manager\" eller anhörig-process.",
    fields: [
      { id: 'kontoinnehavare_namn', label: 'Kontoinnehavarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'kontoinnehavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'kontoinnehavare_epost', label: 'E-postadress (kopplad till tjänsten)', type: 'email', placeholder: 'anna@exempel.se', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till kontoinnehavaren', type: 'text', placeholder: 'T.ex. make/maka, arvinge, barn', required: true, group: 'havare' },
      { id: 'tjanst', label: 'Digital tjänst', type: 'text', placeholder: 'T.ex. Google, Apple, Spotify, Microsoft', required: true, group: 'detaljer' },
      { id: 'syfte', label: 'Vad ska göras med kontot', type: 'textarea', placeholder: 'T.ex. avsluta, övertaga, ladda ner data...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar Google eller Apple svenska fullmakter?", a: "Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg." },
      { q: "Vad händer med en avliden persons konto?", a: "Många tjänster erbjuder en \"legacy\"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet." },
      { q: "Kan jag ge ombud rätt att se min mejl?", a: "Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering." },
      { q: "Behövs översättning?", a: "För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt." },
      { q: "Hur lång tid tar det att avsluta ett digitalt konto?", a: "Från några dagar till flera månader beroende på leverantör. Google har en särskild \"Inactive Account Manager\"-process." },
    ],
    relatedIds: [202, 203, 204],
    legalInfo: "Saknar enhetlig svensk reglering. Tjänsteleverantörers villkor och internationella riktlinjer gäller parallellt.",
    keywords: ["fullmakt Google", "Google-konto dödsbo", "Google legacy", "Gmail dödsbo"],
  } as TemplateInput);

  // Fullmakt Apple ID dödsbo
  templates.push({
    id: 202,
    slug: 'fullmakt-apple-id-dodsbo',
    name: "Fullmakt Apple ID dödsbo",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för att hantera den avlidnes Apple ID och iCloud.",
    longDescription: "Ger ombudet rätt att begära åtkomst till den avlidnes Apple ID via Apples \"Legacy Contact\"-process. Krävs ofta även domstolsbeslut.",
    fields: [
      { id: 'kontoinnehavare_namn', label: 'Kontoinnehavarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'kontoinnehavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'kontoinnehavare_epost', label: 'E-postadress (kopplad till tjänsten)', type: 'email', placeholder: 'anna@exempel.se', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till kontoinnehavaren', type: 'text', placeholder: 'T.ex. make/maka, arvinge, barn', required: true, group: 'havare' },
      { id: 'tjanst', label: 'Digital tjänst', type: 'text', placeholder: 'T.ex. Google, Apple, Spotify, Microsoft', required: true, group: 'detaljer' },
      { id: 'syfte', label: 'Vad ska göras med kontot', type: 'textarea', placeholder: 'T.ex. avsluta, övertaga, ladda ner data...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar Google eller Apple svenska fullmakter?", a: "Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg." },
      { q: "Vad händer med en avliden persons konto?", a: "Många tjänster erbjuder en \"legacy\"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet." },
      { q: "Kan jag ge ombud rätt att se min mejl?", a: "Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering." },
      { q: "Behövs översättning?", a: "För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt." },
      { q: "Hur lång tid tar det att avsluta ett digitalt konto?", a: "Från några dagar till flera månader beroende på leverantör. Google har en särskild \"Inactive Account Manager\"-process." },
    ],
    relatedIds: [201, 203, 204],
    legalInfo: "Saknar enhetlig svensk reglering. Tjänsteleverantörers villkor och internationella riktlinjer gäller parallellt.",
    keywords: ["fullmakt Apple ID", "Apple legacy contact", "iCloud dödsbo", "Apple konto avliden"],
  } as TemplateInput);

  // Fullmakt Spotify-abonnemang
  templates.push({
    id: 203,
    slug: 'fullmakt-spotify-abonnemang',
    name: "Fullmakt Spotify-abonnemang",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för att avsluta eller överta Spotify-abonnemang.",
    longDescription: "Ger ombudet rätt att kontakta Spotify för att avsluta abonnemang, hämta uppspelningshistorik eller överta familjekonto.",
    fields: [
      { id: 'kontoinnehavare_namn', label: 'Kontoinnehavarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'kontoinnehavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'kontoinnehavare_epost', label: 'E-postadress (kopplad till tjänsten)', type: 'email', placeholder: 'anna@exempel.se', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till kontoinnehavaren', type: 'text', placeholder: 'T.ex. make/maka, arvinge, barn', required: true, group: 'havare' },
      { id: 'tjanst', label: 'Digital tjänst', type: 'text', placeholder: 'T.ex. Google, Apple, Spotify, Microsoft', required: true, group: 'detaljer' },
      { id: 'syfte', label: 'Vad ska göras med kontot', type: 'textarea', placeholder: 'T.ex. avsluta, övertaga, ladda ner data...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar Google eller Apple svenska fullmakter?", a: "Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg." },
      { q: "Vad händer med en avliden persons konto?", a: "Många tjänster erbjuder en \"legacy\"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet." },
      { q: "Kan jag ge ombud rätt att se min mejl?", a: "Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering." },
      { q: "Behövs översättning?", a: "För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt." },
      { q: "Hur lång tid tar det att avsluta ett digitalt konto?", a: "Från några dagar till flera månader beroende på leverantör. Google har en särskild \"Inactive Account Manager\"-process." },
    ],
    relatedIds: [201, 202, 204],
    legalInfo: "Saknar enhetlig svensk reglering. Tjänsteleverantörers villkor och internationella riktlinjer gäller parallellt.",
    keywords: ["fullmakt Spotify", "Spotify dödsbo", "avsluta abonnemang fullmakt"],
  } as TemplateInput);

  // Fullmakt bankapp tillgång
  templates.push({
    id: 204,
    slug: 'fullmakt-bankapp-tillgang',
    name: "Fullmakt bankapp tillgång",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för anhörig att hantera bankapp och digitala bankärenden.",
    longDescription: "Specifik fullmakt för digital bankåtkomst – internetbank, bank-app och Mobilt BankID. Notera att BankID är personligt och inte kan delegeras direkt.",
    fields: [
      { id: 'kontoinnehavare_namn', label: 'Kontoinnehavarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'kontoinnehavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'kontoinnehavare_epost', label: 'E-postadress (kopplad till tjänsten)', type: 'email', placeholder: 'anna@exempel.se', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till kontoinnehavaren', type: 'text', placeholder: 'T.ex. make/maka, arvinge, barn', required: true, group: 'havare' },
      { id: 'tjanst', label: 'Digital tjänst', type: 'text', placeholder: 'T.ex. Google, Apple, Spotify, Microsoft', required: true, group: 'detaljer' },
      { id: 'syfte', label: 'Vad ska göras med kontot', type: 'textarea', placeholder: 'T.ex. avsluta, övertaga, ladda ner data...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar Google eller Apple svenska fullmakter?", a: "Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg." },
      { q: "Vad händer med en avliden persons konto?", a: "Många tjänster erbjuder en \"legacy\"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet." },
      { q: "Kan jag ge ombud rätt att se min mejl?", a: "Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering." },
      { q: "Behövs översättning?", a: "För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt." },
      { q: "Hur lång tid tar det att avsluta ett digitalt konto?", a: "Från några dagar till flera månader beroende på leverantör. Google har en särskild \"Inactive Account Manager\"-process." },
    ],
    relatedIds: [204, 164, 145],
    legalInfo: "Avtalslagen (1915:218) och bankernas digitala tjänstevillkor.",
    keywords: ["fullmakt bankapp", "fullmakt internetbank", "digital bank fullmakt"],
  } as TemplateInput);

  // Fullmakt e-legitimation
  templates.push({
    id: 205,
    slug: 'fullmakt-e-legitimation',
    name: "Fullmakt e-legitimation",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt rörande e-legitimation / Mobilt BankID.",
    longDescription: "Klargör att Mobilt BankID och Freja eID inte kan överlåtas – fullmakten reglerar istället att ombudet kan göra ärenden på fullmaktsgivarens vägnar mot myndigheter och banker.",
    fields: [
      { id: 'kontoinnehavare_namn', label: 'Kontoinnehavarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'kontoinnehavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'kontoinnehavare_epost', label: 'E-postadress (kopplad till tjänsten)', type: 'email', placeholder: 'anna@exempel.se', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till kontoinnehavaren', type: 'text', placeholder: 'T.ex. make/maka, arvinge, barn', required: true, group: 'havare' },
      { id: 'tjanst', label: 'Digital tjänst', type: 'text', placeholder: 'T.ex. Google, Apple, Spotify, Microsoft', required: true, group: 'detaljer' },
      { id: 'syfte', label: 'Vad ska göras med kontot', type: 'textarea', placeholder: 'T.ex. avsluta, övertaga, ladda ner data...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar Google eller Apple svenska fullmakter?", a: "Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg." },
      { q: "Vad händer med en avliden persons konto?", a: "Många tjänster erbjuder en \"legacy\"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet." },
      { q: "Kan jag ge ombud rätt att se min mejl?", a: "Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering." },
      { q: "Behövs översättning?", a: "För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt." },
      { q: "Hur lång tid tar det att avsluta ett digitalt konto?", a: "Från några dagar till flera månader beroende på leverantör. Google har en särskild \"Inactive Account Manager\"-process." },
    ],
    relatedIds: [204, 164, 169],
    legalInfo: "BankID-koden är personlig enligt avtal med utfärdaren. Fullmakter ersätter inte e-legitimation utan kompletterar.",
    keywords: ["fullmakt e-legitimation", "fullmakt BankID", "Freja eID fullmakt"],
  } as TemplateInput);

  // Fullmakt Microsoft-konto
  templates.push({
    id: 206,
    slug: 'fullmakt-microsoft-konto',
    name: "Fullmakt Microsoft-konto",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för att hantera Microsoft-konto, OneDrive eller Office 365.",
    longDescription: "Ger ombudet rätt att kontakta Microsoft för åtkomst eller avslut av konto, OneDrive-data och Office-licens.",
    fields: [
      { id: 'kontoinnehavare_namn', label: 'Kontoinnehavarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'kontoinnehavare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'kontoinnehavare_epost', label: 'E-postadress (kopplad till tjänsten)', type: 'email', placeholder: 'anna@exempel.se', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till kontoinnehavaren', type: 'text', placeholder: 'T.ex. make/maka, arvinge, barn', required: true, group: 'havare' },
      { id: 'tjanst', label: 'Digital tjänst', type: 'text', placeholder: 'T.ex. Google, Apple, Spotify, Microsoft', required: true, group: 'detaljer' },
      { id: 'syfte', label: 'Vad ska göras med kontot', type: 'textarea', placeholder: 'T.ex. avsluta, övertaga, ladda ner data...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar Google eller Apple svenska fullmakter?", a: "Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg." },
      { q: "Vad händer med en avliden persons konto?", a: "Många tjänster erbjuder en \"legacy\"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet." },
      { q: "Kan jag ge ombud rätt att se min mejl?", a: "Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering." },
      { q: "Behövs översättning?", a: "För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt." },
      { q: "Hur lång tid tar det att avsluta ett digitalt konto?", a: "Från några dagar till flera månader beroende på leverantör. Google har en särskild \"Inactive Account Manager\"-process." },
    ],
    relatedIds: [201, 202, 207],
    legalInfo: "Saknar enhetlig svensk reglering. Tjänsteleverantörers villkor och internationella riktlinjer gäller parallellt.",
    keywords: ["fullmakt Microsoft", "Microsoft-konto fullmakt", "OneDrive dödsbo"],
  } as TemplateInput);

  // Fullmakt sociala medier företag
  templates.push({
    id: 207,
    slug: 'fullmakt-sociala-medier-foretag',
    name: "Fullmakt sociala medier företag",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för anställd att hantera företagets sociala mediekonton.",
    longDescription: "Ger en marknadsförare eller anställd rätt att hantera företagets Instagram, Facebook, LinkedIn, TikTok och YouTube. Inkluderar inloggningar, annonsbudgetar och innehåll.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 207, 142],
    legalInfo: "Regleras av aktiebolagslagen (2005:551) och prokuralagen (1974:158). Behörig företrädare ska utfärda fullmakten.",
    keywords: ["fullmakt sociala medier företag", "fullmakt Instagram företag", "fullmakt Facebook ads"],
  } as TemplateInput);

  // Fullmakt molntjänst företag
  templates.push({
    id: 208,
    slug: 'fullmakt-molntjanst-foretag',
    name: "Fullmakt molntjänst företag",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för IT-personal att administrera företagets molntjänster.",
    longDescription: "Ger ombudet rätt att administrera AWS, Azure, Google Cloud eller andra molntjänster för företagets räkning – inklusive användarhantering, fakturering och säkerhetskonfiguration.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [206, 137, 142],
    legalInfo: "Regleras av aktiebolagslagen (2005:551) och prokuralagen (1974:158). Behörig företrädare ska utfärda fullmakten.",
    keywords: ["fullmakt molntjänst", "fullmakt AWS", "fullmakt Azure", "IT-admin fullmakt"],
  } as TemplateInput);

  // Fullmakt apostille
  templates.push({
    id: 209,
    slug: 'fullmakt-apostille-ansokan',
    name: "Fullmakt apostille",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att ansöka om apostille hos Notarius Publicus.",
    longDescription: "Ger ombudet rätt att lämna in handlingar för apostille (intyg om dokumentens äkthet) hos Notarius Publicus. Krävs ofta vid utlandsstudier, arbete eller affärer.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [210, 211, 212],
    legalInfo: "Apostille regleras i Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar och används mellan anslutna länder. Notarius Publicus utfärdar apostille i Sverige.",
    keywords: ["fullmakt apostille", "apostille ombud", "Notarius Publicus fullmakt"],
  } as TemplateInput);

  // Fullmakt konsulat
  templates.push({
    id: 210,
    slug: 'fullmakt-konsulat-arende',
    name: "Fullmakt konsulat",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att företräda dig hos svenska eller utländska konsulat.",
    longDescription: "Ger ombudet rätt att kommunicera med Sveriges utlandsmyndigheter (ambassad, konsulat) eller utländska konsulat i Sverige.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [209, 211, 212],
    legalInfo: "Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.",
    keywords: ["fullmakt konsulat", "fullmakt ambassad", "konsulärt ärende ombud"],
  } as TemplateInput);

  // Fullmakt legalisering dokument
  templates.push({
    id: 211,
    slug: 'fullmakt-legalisering-dokument',
    name: "Fullmakt legalisering dokument",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att legalisera dokument hos UD eller ambassad.",
    longDescription: "Används när en handling ska godtas i ett land som inte har anslutit sig till Haagkonventionen om apostille (1961). Ombudet hanterar processen via Sveriges UD och mottagarlandets ambassad.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [209, 210, 212],
    legalInfo: "Apostille regleras i Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar och används mellan anslutna länder. Notarius Publicus utfärdar apostille i Sverige.",
    keywords: ["fullmakt legalisering", "legalisering UD", "fullmakt ambassad legalisering"],
  } as TemplateInput);

  // Översatt internationell fullmakt (Power of Attorney)
  templates.push({
    id: 212,
    slug: 'fullmakt-oversatt-internationell',
    name: "Översatt internationell fullmakt (Power of Attorney)",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Bilingual svensk/engelsk fullmakt för internationellt bruk.",
    longDescription: "Tvåspråkig fullmakt på svenska och engelska. Lämplig för utlandsärenden där en engelsk version krävs. Bör kompletteras med apostille eller legalisering.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [209, 210, 211],
    legalInfo: "Apostille regleras i Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar och används mellan anslutna länder. Notarius Publicus utfärdar apostille i Sverige.",
    keywords: ["Power of Attorney Swedish", "internationell fullmakt", "engelsk fullmakt", "bilingual fullmakt"],
  } as TemplateInput);

  // Fullmakt utlandsflytt
  templates.push({
    id: 213,
    slug: 'fullmakt-utlandsflytt-myndighet',
    name: "Fullmakt utlandsflytt",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för att hantera utlandsflytt – Skatteverket, FK, kommun.",
    longDescription: "Ger ombudet rätt att anmäla utflyttning hos Skatteverket, hantera ärenden hos Försäkringskassan och avsluta löpande abonnemang.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [162, 178, 209],
    legalInfo: "Apostille regleras i Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar och används mellan anslutna länder. Notarius Publicus utfärdar apostille i Sverige.",
    keywords: ["fullmakt utlandsflytt", "fullmakt utvandring", "utflyttningsanmälan ombud"],
  } as TemplateInput);

  // Fullmakt EES-arbetstillstånd
  templates.push({
    id: 214,
    slug: 'fullmakt-ees-arbete-tillstand',
    name: "Fullmakt EES-arbetstillstånd",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att ansöka om EES-/EU-arbetstillstånd.",
    longDescription: "Ger ombudet (ofta arbetsgivare eller jurist) rätt att hantera EES- eller EU-blå kort-ansökan hos Migrationsverket.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [213, 162, 142],
    legalInfo: "Utlänningslagen (2005:716) 6 kap. om arbetstillstånd och 6 a kap. om EU-blåkort.",
    keywords: ["fullmakt arbetstillstånd", "EU-blå kort ombud", "Migrationsverket fullmakt arbete"],
  } as TemplateInput);

  // Fullmakt internationell adoption
  templates.push({
    id: 215,
    slug: 'fullmakt-internationell-adoption',
    name: "Fullmakt internationell adoption",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för adoptionsbyrå att hantera internationell adoption.",
    longDescription: "Ger en auktoriserad adoptionsbyrå rätt att hantera adoptionsprocessen mot ursprungslandets myndigheter, MFoF och svenska socialnämnden.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [150, 209, 212],
    legalInfo: "Lag (1997:191) med anledning av Sveriges tillträde till Haagkonventionen om skydd av barn och samarbete vid internationella adoptioner och lag (1997:192) om internationell adoptionsförmedling.",
    keywords: ["fullmakt internationell adoption", "utlandsadoption ombud", "MFoF fullmakt"],
  } as TemplateInput);

  // Fullmakt utländsk fastighet
  templates.push({
    id: 216,
    slug: 'fullmakt-utlandsk-fastighet',
    name: "Fullmakt utländsk fastighet",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för förvärv eller försäljning av fastighet utomlands.",
    longDescription: "Internationell fullmakt för att köpa, sälja eller förvalta fastighet utomlands. Kräver normalt apostille eller legalisering plus översättning till lokalt språk.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pass', label: 'Passnummer', type: 'text', placeholder: '12345678', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer eller utländskt ID', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller utländskt ID-nummer', required: true, group: 'havare' },
      { id: 'land', label: 'Berört land', type: 'text', placeholder: 'T.ex. Spanien, Tyskland, USA', required: true, group: 'detaljer' },
      { id: 'myndighet', label: 'Berörd myndighet eller dokument', type: 'text', placeholder: 'T.ex. Apostille, Konsulat, Notarius Publicus', required: true, group: 'detaljer' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten avser...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vad är en apostille?", a: "En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter." },
      { q: "Var ansöker jag om apostille?", a: "Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument." },
      { q: "Behöver fullmakten översättas?", a: "Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska." },
      { q: "Vad är skillnaden mellan apostille och legalisering?", a: "Apostille används mellan länder som har anslutit sig till Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar. I Sverige utfärdas apostille av notarius publicus. För andra länder används i stället ofta legalisering via Utrikesdepartementet och vanligen landets ambassad. Mottagaren avgör vad som krävs, så kontrollera i förväg." },
      { q: "Kan svensk fullmakt användas direkt utomlands?", a: "Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg." },
    ],
    relatedIds: [209, 210, 167],
    legalInfo: "Apostille regleras i Haagkonventionen den 5 oktober 1961 om slopande av kravet på legalisering av utländska allmänna handlingar och används mellan anslutna länder. Notarius Publicus utfärdar apostille i Sverige.",
    keywords: ["fullmakt utländsk fastighet", "fastighet utomlands fullmakt", "köpa hus Spanien fullmakt"],
  } as TemplateInput);

  // Fullmakt aktiehandel
  templates.push({
    id: 217,
    slug: 'fullmakt-aktiehandel',
    name: "Fullmakt aktiehandel",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för rådgivare eller anhörig att handla med dina aktier.",
    longDescription: "Ger ombudet rätt att köpa, sälja och förvalta aktier på din värdepappersdepå. Specificera om det rör enstaka köp eller löpande diskretionär förvaltning.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [218, 219, 220],
    legalInfo: "Lag (2007:528) om värdepappersmarknaden.",
    keywords: ["fullmakt aktiehandel", "aktiefullmakt", "fullmakt Avanza Nordnet", "diskretionär förvaltning"],
  } as TemplateInput);

  // Fullmakt fondbyten
  templates.push({
    id: 218,
    slug: 'fullmakt-fondbyten',
    name: "Fullmakt fondbyten",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för rådgivare att göra fondbyten i ditt sparande.",
    longDescription: "Ger ombudet rätt att byta fonder inom din ISK, KF eller pensionssparande. Vanlig vid diskretionär förvaltning eller assistans från anhörig.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [217, 219, 220],
    legalInfo: "Lag (2004:46) om värdepappersfonder.",
    keywords: ["fullmakt fondbyte", "fondrörelse fullmakt", "PPM fullmakt"],
  } as TemplateInput);

  // Fullmakt bolåneansökan
  templates.push({
    id: 219,
    slug: 'fullmakt-bolaneansokan',
    name: "Fullmakt bolåneansökan",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att förbereda och lämna in bolåneansökan.",
    longDescription: "Ger ombudet (oftast mäklare eller bolånerådgivare) rätt att förbereda underlag och lämna in bolåneansökan hos banker.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [220, 221, 222],
    legalInfo: "Konsumentkreditlagen (2010:1846), som ersätts av konsumentkreditlagen (2026:1011) den 20 november 2026, och lag (2016:1024) om verksamhet med bostadskrediter.",
    keywords: ["fullmakt bolån", "bolåneansökan ombud", "fullmakt bank lån"],
  } as TemplateInput);

  // Fullmakt borgensåtagande
  templates.push({
    id: 220,
    slug: 'fullmakt-borgensatagande',
    name: "Fullmakt borgensåtagande",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt vid borgensförhandling – ombud agerar för borgensman.",
    longDescription: "Ger ombudet rätt att förhandla och underteckna borgensåtagande åt dig. Eftersom borgen är personligt ansvarstung bör fullmakten vara mycket specifik.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [219, 221, 222],
    legalInfo: "Handelsbalken (1736:0123 2) 10 kap. om pant och borgen och avtalslagen (1915:218).",
    keywords: ["fullmakt borgen", "borgensåtagande ombud", "fullmakt bank borgen"],
  } as TemplateInput);

  // Fullmakt skuldsanering
  templates.push({
    id: 221,
    slug: 'fullmakt-skuldsanering-ombud',
    name: "Fullmakt skuldsanering",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för advokat eller jurist att hantera skuldsanering.",
    longDescription: "Ger ombudet rätt att ansöka om skuldsanering hos Kronofogden, kommunicera med borgenärer och företräda dig i ärendet.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [222, 224, 164],
    legalInfo: "Skuldsaneringslagen (2016:675).",
    keywords: ["fullmakt skuldsanering", "fullmakt Kronofogden skuldsanering", "skuldsanering ombud"],
  } as TemplateInput);

  // Fullmakt kreditupplysning
  templates.push({
    id: 222,
    slug: 'fullmakt-kreditupplysning',
    name: "Fullmakt kreditupplysning",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att inhämta kreditupplysning.",
    longDescription: "Ger ombudet rätt att inhämta kreditupplysning från UC, Bisnode eller annan kreditupplysningsbyrå för din räkning.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [219, 221, 142],
    legalInfo: "Kreditupplysningslagen (1973:1173).",
    keywords: ["fullmakt kreditupplysning", "UC fullmakt", "fullmakt Bisnode"],
  } as TemplateInput);

  // Fullmakt pensionssparande
  templates.push({
    id: 223,
    slug: 'fullmakt-pensionssparande',
    name: "Fullmakt pensionssparande",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för rådgivare att hantera ditt pensionssparande.",
    longDescription: "Ger ombudet rätt att förvalta IPS, traditionell pension eller tjänstepensionen via diskretionär förvaltning eller specifika instruktioner.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [218, 221, 142],
    legalInfo: "Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.",
    keywords: ["fullmakt pension", "pensionssparande ombud", "PPM fullmakt"],
  } as TemplateInput);

  // Fullmakt sparkonto överföring
  templates.push({
    id: 224,
    slug: 'fullmakt-sparkonto-overforing',
    name: "Fullmakt sparkonto överföring",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för specifik överföring mellan sparkonton.",
    longDescription: "Specificerad fullmakt för att genomföra en eller flera överföringar från ditt sparkonto. Vanligt vid utlandsvistelse.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [219, 220, 142],
    legalInfo: "Avtalslagen (1915:218) reglerar fullmakter. Banker och finansinstitut kan ha egna krav.",
    keywords: ["fullmakt sparkonto", "fullmakt överföring bank", "sparkonto ombud"],
  } as TemplateInput);

  // Fullmakt crowdfunding-investering
  templates.push({
    id: 225,
    slug: 'fullmakt-crowdfunding-investering',
    name: "Fullmakt crowdfunding-investering",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för rådgivare att göra crowdfunding-investeringar åt dig.",
    longDescription: "Ger ombudet rätt att investera i crowdfunding-projekt (FundedByMe, Kameo, Tessin etc.) inom angivna ramar och belopp.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [217, 219, 142],
    legalInfo: "Lag (2021:899) med kompletterande bestämmelser till EU:s förordning om gräsrotsfinansiering. Finansinspektionen är behörig myndighet (2 §).",
    keywords: ["fullmakt crowdfunding", "investering ombud", "fullmakt Kameo Tessin"],
  } as TemplateInput);

  // Fullmakt privatlån
  templates.push({
    id: 226,
    slug: 'fullmakt-privatlan-ansokan',
    name: "Fullmakt privatlån",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för ombud att ansöka om privatlån.",
    longDescription: "Ger ombudet rätt att förbereda och lämna in ansökan om privatlån eller konsumentkredit. Lånebeslutet är personligt och baserat på dina inkomstuppgifter.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [219, 221, 222],
    legalInfo: "Konsumentkreditlagen (2010:1846), som ersätts av konsumentkreditlagen (2026:1011) den 20 november 2026.",
    keywords: ["fullmakt privatlån", "fullmakt konsumentkredit", "privatlån ombud"],
  } as TemplateInput);

  // Fullmakt företagslån
  templates.push({
    id: 227,
    slug: 'fullmakt-foretagslan-ansokan',
    name: "Fullmakt företagslån",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Fullmakt för företrädare att ansöka om företagslån.",
    longDescription: "Ger ombudet rätt att lämna in ansökan om företagslån, presentera affärsplan och förhandla villkor med bank.",
    fields: [
      { id: 'foretag_namn', label: 'Företagets namn', type: 'text', placeholder: 'Exempel AB', required: true, group: 'givare' },
      { id: 'orgnr', label: 'Organisationsnummer', type: 'text', placeholder: '556677-1122', required: true, group: 'givare' },
      { id: 'foretradare_namn', label: 'Behörig företrädares namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'foretradare_pnr', label: 'Företrädarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'foretradare_roll', label: 'Roll i bolaget', type: 'select', options: ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Specificera vilka rättshandlingar ombudet får utföra...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem får utfärda fullmakt för ett aktiebolag?", a: "Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning." },
      { q: "Behöver fullmakten registreras hos Bolagsverket?", a: "Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen." },
      { q: "Kan fullmakten gälla flera år?", a: "Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull." },
      { q: "Hur återkallas en företagsfullmakt?", a: "Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter." },
      { q: "Gäller fullmakten vid VD-byte?", a: "Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte." },
    ],
    relatedIds: [137, 219, 141],
    legalInfo: "Regleras av aktiebolagslagen (2005:551) och prokuralagen (1974:158). Behörig företrädare ska utfärda fullmakten.",
    keywords: ["fullmakt företagslån", "företagsfullmakt lån", "företagslån ombud"],
  } as TemplateInput);

  // Fullmakt försäkringsärende utökad
  templates.push({
    id: 228,
    slug: 'fullmakt-forsakringsarende-utokad',
    name: "Fullmakt försäkringsärende utökad",
    category: "Ekonomi, Bank & Myndigheter",
    categorySlug: 'ekonomi-myndigheter',
    description: "Utökad fullmakt för försäkringsärenden – flera bolag och produkter.",
    longDescription: "Ger ombudet rätt att hantera alla dina försäkringar – hem, bil, liv, sjuk- och olycksfall – hos flera försäkringsbolag.",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson eller Rådgivare AB', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer/orgnr', type: 'text', placeholder: 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', required: true, group: 'havare' },
      { id: 'institution', label: 'Berörd bank/institution', type: 'text', placeholder: 'T.ex. Avanza, SEB, Handelsbanken', required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befogenheter', type: 'textarea', placeholder: 'Beskriv vilka transaktioner och ärenden som ingår...', required: true, group: 'detaljer' },
      { id: 'maxbelopp', label: 'Max engångsbelopp (om begränsning önskas)', type: 'text', placeholder: 'T.ex. 100 000 kr eller "Obegränsat"', required: false, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Accepterar alla banker fullmakten?", a: "De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg." },
      { q: "Kan ombudet ta lån i mitt namn?", a: "Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt." },
      { q: "Hur skyddas jag mot missbruk?", a: "Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört." },
      { q: "Måste bankfullmakten bevittnas?", a: "Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen." },
      { q: "Gäller fullmakten utomlands?", a: "Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas." },
    ],
    relatedIds: [219, 164, 142],
    legalInfo: "Försäkringsavtalslagen (2005:104).",
    keywords: ["fullmakt försäkring", "fullmakt försäkringsbolag", "försäkringsärende ombud"],
  } as TemplateInput);

  // Begravningsönskemål
  templates.push({
    id: 229,
    slug: 'fullmakt-begravningsonskemal',
    name: "Begravningsönskemål",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Skriftliga önskemål om din egen begravning.",
    longDescription: "Skriftliga önskemål om begravningsform, ceremoni, gravplats och eventuella sånger eller texter. Inte juridiskt bindande men respekteras vanligen av anhöriga.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [230, 231, 232],
    legalInfo: "Begravningslagen (1990:1144). Kan de efterlevande inte enas ska länsstyrelsen särskilt beakta önskemål som den avlidne kan ha haft (5 kap. 4 §).",
    keywords: ["begravningsönskemål", "fullmakt egen begravning", "min begravning vilja"],
  } as TemplateInput);

  // Fullmakt testamentsexekutor
  templates.push({
    id: 230,
    slug: 'fullmakt-testamentsexekutor',
    name: "Fullmakt testamentsexekutor",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Utseende av testamentsexekutor som ska verkställa testamentet.",
    longDescription: "Utser en testamentsexekutor (ofta advokat eller familjemedlem) som ansvarar för att förvalta dödsboet och verkställa testamentet enligt din vilja.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [229, 231, 232],
    legalInfo: "Ärvdabalken (1958:637) 19 kap. om testamentsexekutor.",
    keywords: ["testamentsexekutor", "fullmakt verkställa testamente", "testamente exekutor"],
  } as TemplateInput);

  // Fullmakt bouppteckningsförrättare
  templates.push({
    id: 231,
    slug: 'fullmakt-bouppteckningsforrattare',
    name: "Fullmakt bouppteckningsförrättare",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Utseende av bouppteckningsförrättare för dödsboet.",
    longDescription: "Utser en bouppteckningsförrättare (ofta jurist eller revisor) som upprättar bouppteckningen för dödsboet och lämnar in den till Skatteverket.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [230, 229, 232],
    legalInfo: "Ärvdabalken (1958:637) 20 kap. om bouppteckning.",
    keywords: ["bouppteckningsförrättare", "fullmakt bouppteckning", "fullmakt Skatteverket bouppteckning"],
  } as TemplateInput);

  // Fullmakt donation välgörenhet
  templates.push({
    id: 232,
    slug: 'fullmakt-donation-valgorenhet',
    name: "Fullmakt donation välgörenhet",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt eller önskemål om donation till välgörenhet vid dödsfall.",
    longDescription: "Skriftliga instruktioner om att del av kvarlåtenskapen ska gå till välgörenhet, alternativt fullmakt för anhörig att donera i ditt namn.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [229, 230, 232],
    legalInfo: "Ärvdabalken (1958:637). Testamente ska upprättas skriftligen med två vittnen (10 kap. 1 §).",
    keywords: ["fullmakt donation", "donera arv välgörenhet", "fullmakt välgörenhet"],
  } as TemplateInput);

  // Fullmakt konstvärdering vid arvskifte
  templates.push({
    id: 233,
    slug: 'fullmakt-konst-vardering-arvskifte',
    name: "Fullmakt konstvärdering vid arvskifte",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för värderingsman att värdera konst eller antikviteter inför arvskifte.",
    longDescription: "Ger en auktoriserad värderingsman rätt att värdera konstverk, antikviteter eller andra dyrbarheter i dödsboet.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [230, 231, 232],
    legalInfo: "Ärvdabalken (1958:637) 23 kap. om arvskifte.",
    keywords: ["fullmakt värdering konst", "arvskifte värderingsman", "fullmakt antikviteter"],
  } as TemplateInput);

  // Fullmakt husdjur vid dödsfall
  templates.push({
    id: 234,
    slug: 'fullmakt-husdjur-dodsfall',
    name: "Fullmakt husdjur vid dödsfall",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Önskemål och fullmakt om vad som ska hända med husdjuren vid dödsfall.",
    longDescription: "Specificerar vem som ska ta över husdjur, hur mycket pengar som avsätts för vård och eventuella veterinärinstruktioner.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [229, 230, 234],
    legalInfo: "Djurskyddslagen (2018:1192) och ärvdabalken (1958:637).",
    keywords: ["fullmakt husdjur dödsfall", "husdjur vid dödsfall", "fullmakt hund katt"],
  } as TemplateInput);

  // Fullmakt begravningsbyrå
  templates.push({
    id: 235,
    slug: 'fullmakt-begravningsbyra-ombud',
    name: "Fullmakt begravningsbyrå",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för anhörig att teckna avtal med begravningsbyrå.",
    longDescription: "Ger ombudet rätt att teckna avtal med begravningsbyrå, välja kista, blommor, ceremoni och hantera fakturering. Bör utfärdas av samtliga dödsbodelägare.",
    fields: [
      { id: 'avliden_namn', label: 'Den avlidnes namn (om relevant)', type: 'text', placeholder: 'Anna Svensson', required: false, group: 'givare' },
      { id: 'avliden_pnr', label: 'Avlidens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: false, group: 'givare' },
      { id: 'utstallare_namn', label: 'Utställarens namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'utstallare_pnr', label: 'Utställarens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Utseddes namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Utseddes personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation', type: 'text', placeholder: 'T.ex. barn, vän, advokat', required: true, group: 'havare' },
      { id: 'uppdrag', label: 'Detaljerat uppdrag', type: 'textarea', placeholder: 'Beskriv ansvarsområden och uppdragets omfattning...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Vem kan utses till testamentsexekutor?", a: "En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem." },
      { q: "Måste bouppteckning göras?", a: "Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader." },
      { q: "Vem är dödsbodelägare?", a: "Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in." },
      { q: "Kan jag bestämma min egen begravning?", a: "Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga." },
      { q: "Hur länge gäller fullmakt för dödsboet?", a: "Vanligen tills arvskiftet är slutfört och dödsboet upplöst." },
    ],
    relatedIds: [187, 229, 230],
    legalInfo: "Begravningslagen (1990:1144).",
    keywords: ["fullmakt begravningsbyrå", "begravningsbyrå ombud", "fullmakt begravning ordna"],
  } as TemplateInput);

  // Fullmakt andelar samfällighet
  templates.push({
    id: 236,
    slug: 'fullmakt-andelar-samfallighet',
    name: "Fullmakt andelar samfällighet",
    category: "Digitalt & Dödsbo",
    categorySlug: 'digitalt-dodsbo',
    description: "Fullmakt för andelsägare att rösta i samfällighetsföreningens stämma.",
    longDescription: "Ger ombudet rätt att rösta åt dig vid samfällighetsföreningens stämma – vanligt vid gemensamhetsanläggningar (vägar, vatten, badplatser).",
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_adress', label: 'Adress', type: 'address', placeholder: 'Gatuadress, postnummer, ort', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Ombudets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, barn, vän', required: false, group: 'havare' },
      { id: 'uppdrag', label: 'Specifikt uppdrag', type: 'textarea', placeholder: 'Beskriv vad fullmakten omfattar...', required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: "Måste fullmakten bevittnas?", a: "Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten." },
      { q: "Hur återkallar jag fullmakten?", a: "Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart." },
      { q: "Vad händer vid dödsfall?", a: "En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna." },
      { q: "Kan ombudet ge fullmakten vidare?", a: "Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution)." },
      { q: "Behöver fullmakten registreras?", a: "Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar." },
    ],
    relatedIds: [186, 139, 173],
    legalInfo: "Lag (1973:1150) om förvaltning av samfälligheter.",
    keywords: ["fullmakt samfällighet", "samfällighetsförening stämma", "andelsägare fullmakt"],
  } as TemplateInput);

  // === TILLAGDA 2026-05-27 ===

  // Fullmakt för arbetsgivarintyg och löneinformation
  templates.push({
    id: 237, slug: 'fullmakt-arbetsgivarintyg-lon-2026',
    name: 'Fullmakt för arbetsgivarintyg och löneinformation',
    category: 'Ekonomi & Myndigheter', categorySlug: 'ekonomi-myndigheter',
    description: 'Ger ombud rätt att hämta arbetsgivarintyg, lönespecifikationer och anställningsuppgifter från arbetsgivaren.',
    longDescription: 'Denna fullmakt ger ditt ombud rätt att hämta ut arbetsgivarintyg, lönespecifikationer, anställningsbevis och övriga anställningsuppgifter direkt från din arbetsgivare. Används av personer som är sjukskrivna, föräldralediga, bor utomlands eller söker bolån och behöver dokumentation utan att själva kunna närvara. Ombudet kan agera gentemot HR-avdelning, lönekontor och Försäkringskassan.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'arbetsgivare', label: 'Arbetsgivare (företagsnamn)', type: 'text', placeholder: 'T.ex. Volvo AB', required: true, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Personnummer (ombudet)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ombud_relation', label: 'Relation till fullmaktsgivaren', type: 'text', placeholder: 'T.ex. make/maka, förälder, bank', required: true, group: 'havare' },
      { id: 'befogenheter', label: 'Handlingar att hämta', type: 'select', options: ['Arbetsgivarintyg', 'Lönespecifikationer', 'Anställningsbevis', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'andamal', label: 'Ändamål', type: 'select', options: ['Bolåneansökan', 'Försäkringskassans krav', 'A-kasseansökan', 'Övrigt'], required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['1 månad', '3 månader', '6 månader', '1 år'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan ett ombud hämta mitt arbetsgivarintyg?', a: 'Ja. Med en giltig fullmakt kan ombudet vända sig till arbetsgivarens HR-avdelning eller lönekontor och begära ut de angivna handlingarna. Arbetsgivaren är skyldig att utfärda arbetsgivarintyg enligt LAS.' },
      { q: 'Vad innehåller ett arbetsgivarintyg?', a: 'Arbetsgivarintyget innehåller uppgifter om anställningstid, tjänstgöringsgrad, löneinformation och anställningsform. Det krävs bland annat av a-kassan och banker vid bolåneansökan.' },
      { q: 'Måste arbetsgivaren godkänna fullmakten?', a: 'Arbetsgivaren är skyldig att utfärda arbetsgivarintyg på begäran. Fullmakten visar att ombudet har rätt att agera för din räkning. Kontakta HR-avdelningen i förväg för att kontrollera eventuella rutiner.' },
      { q: 'Gäller fullmakten även för lönespecifikationer?', a: 'Ja, om det anges i fullmakten. Lönespecifikationer innehåller personuppgifter. Specificera tydligt vilka handlingar och vilken tidsperiod ombudet har rätt att ta del av.' },
      { q: 'Kan en bank använda fullmakten vid bolåneansökan?', a: 'Det avgör banken. Kontrollera med din bank vilken form av dokumentation den godtar – en del kräver stämplad kopia.' },
    ],
    relatedIds: [126, 136],
    legalInfo: 'Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
    keywords: ['fullmakt arbetsgivarintyg', 'hämta arbetsgivarintyg ombud', 'fullmakt löneinformation', 'arbetsgivarintyg bolån fullmakt'],
  } as TemplateInput);

  // Fullmakt för försäkringsskadeanmälan
  templates.push({
    id: 238, slug: 'fullmakt-forsakring-skadesanmalan-2026',
    name: 'Fullmakt för försäkringsskadeanmälan',
    category: 'Ekonomi & Myndigheter', categorySlug: 'ekonomi-myndigheter',
    description: 'Ger ombud rätt att anmäla skada, följa upp ärendet och ta emot ersättning från försäkringsbolag.',
    longDescription: 'Denna fullmakt ger ditt ombud rätt att anmäla skada, kommunicera med försäkringsbolaget, följa upp ärenden och ta emot skadeersättning för din räkning. Täcker bil-, hem- och olycksfallsförsäkring. Används när du är skadad, utomlands, sjuk eller av annan anledning inte kan hantera skadeanmälan själv. Ombudet kan agera gentemot försäkringsbolagets skadehanteringsavdelning.',
    fields: [
      { id: 'fullmaktsgivare_namn', label: 'Fullmaktsgivarens fullständiga namn', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'fullmaktsgivare_pnr', label: 'Personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'forsakringsbolag', label: 'Försäkringsbolag', type: 'text', placeholder: 'T.ex. Folksam, If, Trygg-Hansa', required: true, group: 'givare' },
      { id: 'forsakringsnummer', label: 'Försäkringsnummer (om känt)', type: 'text', placeholder: 'T.ex. 123456-7', required: false, group: 'givare' },
      { id: 'ombud_namn', label: 'Ombudets fullständiga namn', type: 'text', placeholder: 'Erik Svensson', required: true, group: 'havare' },
      { id: 'ombud_pnr', label: 'Personnummer (ombudet)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'forsakringstyp', label: 'Typ av försäkring', type: 'select', options: ['Bilförsäkring', 'Hemförsäkring', 'Olycksfallsförsäkring', 'Alla försäkringar'], required: true, group: 'detaljer' },
      { id: 'befogenheter', label: 'Befögenheter', type: 'select', options: ['Anmäla skada', 'Följa upp skadeärende', 'Ta emot ersättning', 'Alla ovanstående'], required: true, group: 'detaljer' },
      { id: 'giltighetstid', label: 'Giltighetstid', type: 'select', options: ['3 månader', '6 månader', '1 år', 'Tillsvidare'], required: true, group: 'detaljer' },
    ],
    faq: [
      { q: 'Kan ett ombud anmäla en försäkringsskada åt mig?', a: 'Ja. Med en giltig fullmakt kan ombudet kontakta försäkringsbolaget, fylla i skadeanmälan och kommunicera med skadehandläggaren. Försäkringsbolaget avgör självt vad det godtar, så kontrollera med bolaget i förväg.' },
      { q: 'Kan ombudet ta emot skadeersättning?', a: 'Ja, om det anges tydligt i fullmakten. Observera att försäkringsbolag ofta kräver att ersättning betalas ut till den försäkrades bankkonto. Ange detta i fullmakten och kontrollera med försäkringsbolaget i förväg.' },
      { q: 'Vad gäller för bilförsäkring och skadeanmälan?', a: 'Försäkringsavtalslagen 7 kap. reglerar rätten att företrädas av ombud. Ombudet kan anmäla vagnskada, stöld och trafikskada. Vid tredjepartsskada kan polisrapport krävas.' },
      { q: 'Gäller fullmakten för hemförsäkring och inbrott?', a: 'Ja. Ombudet kan anmäla stöld, vattenskada och brandskada, kommunicera med värderare och följa upp utbetalningar. Försäkringsbolagets egna rutiner kan kräva kompletterande dokumentation.' },
      { q: 'Kan jag använda en fullmakt om jag befinner mig utomlands?', a: 'Ja, det är ett vanligt användningsfall. Se till att fullmakten är undertecknad med vittne och att ombudet har tillgång till relevanta försäkringsdokument. Kontakta försäkringsbolaget på förhand för att informera om fullmakten.' },
    ],
    relatedIds: [126, 131],
    legalInfo: 'Försäkringsavtalslagen (2005:104). Fullmakten bygger på fullmaktsreglerna i avtalslagen (1915:218) 2 kap.',
    keywords: ['fullmakt försäkring', 'skadeanmälan fullmakt', 'fullmakt försäkringsbolag', 'ombud försäkringsskada'],
  } as TemplateInput);

  // Medgivande för medicinsk behandling utomlands (minderårig)
  templates.push({
    id: 239, slug: 'medgivande-medicinsk-behandling-utomlands-2026',
    name: 'Medgivande för medicinsk behandling utomlands (minderårig)',
    category: 'Föräldrar & Barn', categorySlug: 'foraldrar-barn',
    description: 'Medgivande från vårdnadshavare att annan vuxen kan ge tillstånd för medicinsk behandling av barn under 18 år vid akut behov utomlands.',
    longDescription: 'Detta medgivande ger en angiven vuxen person (t.ex. lärare, ledare eller annan anhörig) rätt att ge tillstånd för medicinsk behandling av ett minderårigt barn vid akut behov utomlands. Viktigt vid skolresor, lägerverksamhet och längre utlandsvistelse utan vårdnadshavare. Utländsk sjukvård kräver ofta skriftligt medgivande från vårdnadshavare vid behandling av minderåriga. Dokumentet är avfattat på svenska och engelska för att fungera i internationella sammanhang.',
    uppdragText: 'Lämna samtycke till nödvändig medicinsk undersökning och behandling av barnet vid akut behov under den vistelse som anges under Resan, när vårdnadshavarna inte kan nås.',
    fields: [
      { id: 'barn_namn', label: 'Barnets fullständiga namn', type: 'text', placeholder: 'Maja Svensson', required: true, group: 'givare' },
      { id: 'barn_foddatum', label: 'Barnets födelsedatum', type: 'date', required: true, group: 'givare' },
      { id: 'barn_personnummer', label: 'Barnets personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vardnadshavare1_namn', label: 'Vårdnadshavare 1 (namn)', type: 'text', placeholder: 'Anna Svensson', required: true, group: 'givare' },
      { id: 'vardnadshavare1_pnr', label: 'Vårdnadshavare 1 (personnummer)', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'givare' },
      { id: 'vardnadshavare1_telefon', label: 'Vårdnadshavare 1 (telefon)', type: 'phone', placeholder: '+46701234567', required: true, group: 'givare' },
      { id: 'vardnadshavare2_namn', label: 'Vårdnadshavare 2 (valfritt)', type: 'text', placeholder: 'Erik Svensson', required: false, group: 'givare' },
      { id: 'ansvarig_vuxen_namn', label: 'Ansvarig vuxens fullständiga namn', type: 'text', placeholder: 'Maria Lindgren', required: true, group: 'havare' },
      { id: 'ansvarig_vuxen_pnr', label: 'Ansvarig vuxens personnummer', type: 'personnummer', placeholder: 'ÅÅMMDD-XXXX', required: true, group: 'havare' },
      { id: 'ansvarig_vuxen_relation', label: 'Relation till barnet', type: 'text', placeholder: 'T.ex. klasslärare, reseledare, moster', required: true, group: 'havare' },
      { id: 'destination', label: 'Land/destination', type: 'text', placeholder: 'T.ex. Italien, Spanien', required: true, group: 'detaljer' },
      { id: 'period', label: 'Vistelsens period', type: 'text', placeholder: 'T.ex. 2026-06-10 till 2026-06-17', required: true, group: 'detaljer' },
      { id: 'kanda_allergier', label: 'Kända allergier/medicinska tillstånd', type: 'text', placeholder: 'T.ex. penicillinallergi, diabetes', required: false, group: 'detaljer' },
      { id: 'nodkontakt', label: 'Nödkontakt (utöver vårdnadshavare)', type: 'phone', placeholder: '+46701234567', required: false, group: 'detaljer' },
    ],
    faq: [
      { q: 'Varför behövs medgivande för medicinsk behandling utomlands?', a: 'Sjukvården i många länder kräver skriftligt tillstånd från vårdnadshavare för att behandla minderåriga. Utan medgivande kan ett barn i nödsituationer nekas behandling eller att behandlingen fördröjs. Medgivandet löser denna situation när vårdnadshavare inte är på plats.' },
      { q: 'Vilka länder kräver detta medgivande?', a: 'Krav varierar. EU-länder som Spanien, Italien och Frankrike tillämpar ofta striktare regler för minderåriga utan föräldrar. USA kräver i regel skriftligt medgivande vid icke-akut behandling. Vid akut livsfara kan behandling alltid ges utan tillstånd.' },
      { q: 'Kan en lärare använda detta medgivande?', a: 'Ja. Medgivandet är utformat för att kunna användas av skolpersonal, reseledare och andra vuxna som ansvarar för barn utomlands. Lärarens eller ledarens fullständiga namn och relation till barnet anges i dokumentet.' },
      { q: 'Behöver medgivandet vara på engelska?', a: 'Rekommenderas starkt. Mallen producerar ett dokument på svenska och engelska. Vid vistelse utanför Norden är en engelsk version i princip nödvändig för att sjukvårdspersonal ska förstå dokumentet.' },
      { q: 'Vad är skillnaden mot en fullmakt för sjukvård?', a: 'En sjukvårdsfullmakt (mall 132) gäller i Sverige och aktiveras när du som vuxen inte kan besluta själv. Detta medgivande är specifikt för att låta en annan vuxen ge tillstånd för behandling av ett BARN utomlands. Det bygger på vårdnadshavarens rätt och skyldighet att bestämma i frågor som rör barnets personliga angelägenheter (6 kap. 11 § föräldrabalken (1949:381)).' },
    ],
    relatedIds: [133, 132],
    legalInfo: 'Vårdnadshavaren har rätt och skyldighet att bestämma i frågor som rör barnets personliga angelägenheter (6 kap. 11 § föräldrabalken (1949:381)).',
    keywords: ['medgivande medicinsk behandling barn', 'tillstånd behandling utomlands minderårig', 'skolresa medgivande sjukvård', 'vårdnadshavare medgivande utomlands'],
  } as TemplateInput);

  // Gemensamma FAQ-frågor som följer med kategorins forEach men inte gäller
  // mallens ämne (granskning 2026-11-02). Frågorna tas bort per mall.
  const BANK = 'Accepteras denna av alla banker?';
  const FAQ_EXCLUDE: Record<string, string[]> = {
    // Föräldrar & barn
    'medgivande-barn-bo-annan-vuxen': ['Godtar flygbolag den här handlingen?'],
    'medgivande-bankarenden-barn': ['Godtar flygbolag den här handlingen?', 'Kan jag använda fullmakten utomlands?'],
    'medgivande-byte-skola': ['Godtar flygbolag den här handlingen?', 'Kan jag använda fullmakten utomlands?'],
    // Ekonomi & myndigheter: bankfrågan på mallar som inte gäller bank
    'fullmakt-bolagsverket': [BANK],
    'fullmakt-forsakring': [BANK],
    'fullmakt-kronofogden': [BANK],
    'fullmakt-pension': [BANK],
    'fullmakt-arbetsformedlingen': [BANK],
    'fullmakt-bouppteckning': [BANK],
    'fullmakt-migrationsverket': [BANK],
    'fullmakt-tingsratten': [BANK],
    'fullmakt-csp-konto': [BANK],
    'fullmakt-skatteverket': [BANK],
    'fullmakt-deklaration': [BANK],
    'fullmakt-inkasso': [BANK],
    'fullmakt-aktiebolag': [BANK],
    // Resa & transport: myndighetsfrågan på mallar mot privata mottagare
    'fullmakt-bilforsakring': ['Är denna fullmakt giltig hos myndigheter?'],
    'fullmakt-parkeringsbolag': ['Är denna fullmakt giltig hos myndigheter?'],
    'fullmakt-bilverkstad': ['Är denna fullmakt giltig hos myndigheter?'],
    'medgivande-hyrbil': ['Är denna fullmakt giltig hos myndigheter?'],
    'fullmakt-flygbolag': ['Är denna fullmakt giltig hos myndigheter?'],
    'medgivande-samakande': ['Är denna fullmakt giltig hos myndigheter?'],
    // Boende & vardag
    'fullmakt-bostadskop': ['Kan hyresvärden neka?'],
    'fullmakt-bostadsforsaljning': ['Kan hyresvärden neka?'],
    'fullmakt-hyreskontrakt': ['Gäller denna för bostadsförsäljning?'],
    'fullmakt-lagenhetsbyte': ['Gäller denna för bostadsförsäljning?'],
    'fullmakt-andrahandsuthyrning': ['Gäller denna för bostadsförsäljning?'],
    'fullmakt-garage-parkering': ['Gäller denna för bostadsförsäljning?'],
    'fullmakt-nycklar-tillgang': ['Gäller denna för bostadsförsäljning?'],
    'fullmakt-elbolag': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    'fullmakt-bredbandsleverantor': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    'fullmakt-forsakring-boende': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    'fullmakt-renovering': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    'fullmakt-vattenavlasning': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    'fullmakt-paket-post': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    'fullmakt-sophantering': ['Gäller denna för bostadsförsäljning?', 'Kan hyresvärden neka?'],
    // Förening & skola
    'fullmakt-idrottsforening': ['Behöver skolan godkänna fullmakten?'],
    'fullmakt-scouterna': ['Behöver skolan godkänna fullmakten?'],
    'fullmakt-fritidsgard': ['Behöver skolan godkänna fullmakten?'],
    'fullmakt-foreningsstamma': ['Behöver skolan godkänna fullmakten?', 'Kan bägge vårdnadshavare behöva skriva under?', 'Gäller medgivandet automatiskt för framtida aktiviteter?', 'Vad om mitt barn inte vill delta?'],
    'fullmakt-styrelsearbete': ['Behöver skolan godkänna fullmakten?', 'Kan bägge vårdnadshavare behöva skriva under?', 'Gäller medgivandet automatiskt för framtida aktiviteter?', 'Vad om mitt barn inte vill delta?'],
    'fullmakt-foraldrautskott': ['Kan bägge vårdnadshavare behöva skriva under?', 'Gäller medgivandet automatiskt för framtida aktiviteter?', 'Vad om mitt barn inte vill delta?'],
    // Djur: veterinärfrågor på mallar som inte gäller veterinär
    'fullmakt-djurtransport': ['Godtar veterinären fullmakten?', 'Kan jag ge fullmakt för nödvändiga behandlingar?', 'Gäller fullmakten hos alla veterinärer?'],
    'intyg-djur-resa-utomlands': ['Godtar veterinären fullmakten?', 'Kan jag ge fullmakt för nödvändiga behandlingar?', 'Gäller fullmakten hos alla veterinärer?'],
    'fullmakt-djurforsakring': ['Godtar veterinären fullmakten?', 'Kan jag ge fullmakt för nödvändiga behandlingar?', 'Gäller fullmakten hos alla veterinärer?'],
    'medgivande-inkop-djur': ['Godtar veterinären fullmakten?', 'Kan jag ge fullmakt för nödvändiga behandlingar?', 'Gäller fullmakten hos alla veterinärer?'],
    // Seniorer: bankfrågan på mallar som inte gäller bank
    'fullmakt-digital-brevlada': ['Gäller fullmakten hos alla banker?'],
    'medgivande-hemtjanst-digital': ['Gäller fullmakten hos alla banker?'],
    'fullmakt-abonnemang': ['Gäller fullmakten hos alla banker?'],
    'intyg-digital-tillganglighet': ['Gäller fullmakten hos alla banker?'],
    'fullmakt-mobiloperator-senior': ['Gäller fullmakten hos alla banker?'],
    'medgivande-digital-halsoapp': ['Gäller fullmakten hos alla banker?'],
    // Digitalt dödsbo
    'medgivande-sociala-medier-dodsfall': ['Hur hanteras kryptovaluta vid dödsfall?'],
    'medgivande-digital-minnessida': ['Hur hanteras kryptovaluta vid dödsfall?'],
    'fullmakt-domanhantering': ['Hur hanteras kryptovaluta vid dödsfall?', 'Kan jag ge fullmakt för sociala medier?'],
    'medgivande-prenumerationsavslut': ['Hur hanteras kryptovaluta vid dödsfall?', 'Kan jag ge fullmakt för sociala medier?'],
    'fullmakt-epostarkiv': ['Hur hanteras kryptovaluta vid dödsfall?', 'Kan jag ge fullmakt för sociala medier?'],
    'fullmakt-kryptovaluta': ['Kan jag ge fullmakt för sociala medier?'],
    // Bank och lån (dold bakom JSON-FAQ)
    'fullmakt-skuldsanering-ombud': ['Accepterar alla banker fullmakten?', 'Kan ombudet ta lån i mitt namn?', 'Måste bankfullmakten bevittnas?'],
    'fullmakt-kreditupplysning': ['Accepterar alla banker fullmakten?', 'Kan ombudet ta lån i mitt namn?', 'Måste bankfullmakten bevittnas?'],
    'fullmakt-crowdfunding-investering': ['Accepterar alla banker fullmakten?', 'Kan ombudet ta lån i mitt namn?', 'Måste bankfullmakten bevittnas?'],
    'fullmakt-forsakringsarende-utokad': ['Accepterar alla banker fullmakten?', 'Kan ombudet ta lån i mitt namn?', 'Måste bankfullmakten bevittnas?'],
    // Fastighet: försäljningsfrågor på mallar som inte gäller försäljning (dold)
    'fullmakt-lantmateriet': ['Kan ombudet skriva under köpekontrakt?', 'Vad händer om priset blir lägre än önskat?'],
    'fullmakt-lagfart-ansokan': ['Kan ombudet skriva under köpekontrakt?', 'Vad händer om priset blir lägre än önskat?'],
    'fullmakt-inteckning-pantbrev': ['Kan ombudet skriva under köpekontrakt?', 'Vad händer om priset blir lägre än önskat?'],
    'fullmakt-tomtratt-ombud': ['Kan ombudet skriva under köpekontrakt?', 'Vad händer om priset blir lägre än önskat?'],
    'fullmakt-servitut-anlaggning': ['Kan ombudet skriva under köpekontrakt?', 'Vad händer om priset blir lägre än önskat?'],
    'fullmakt-fastighetsavstyckning': ['Kan ombudet skriva under köpekontrakt?', 'Vad händer om priset blir lägre än önskat?'],
    // Digitala konton (dold)
    'fullmakt-spotify-abonnemang': ['Accepterar Google eller Apple svenska fullmakter?', 'Kan jag ge ombud rätt att se min mejl?'],
    'fullmakt-bankapp-tillgang': ['Accepterar Google eller Apple svenska fullmakter?', 'Kan jag ge ombud rätt att se min mejl?'],
    'fullmakt-e-legitimation': ['Accepterar Google eller Apple svenska fullmakter?', 'Kan jag ge ombud rätt att se min mejl?'],
    'fullmakt-microsoft-konto': ['Accepterar Google eller Apple svenska fullmakter?'],
  };
  for (const t of templates) {
    const exclude = FAQ_EXCLUDE[t.slug];
    if (exclude && t.faq) t.faq = t.faq.filter(f => !exclude.includes(f.q));
  }

  // Defensive dedup by slug — last write wins
  const bySlug = new Map<string, TemplateInput>();
  for (const t of templates) bySlug.set(t.slug, t);
  return Array.from(bySlug.values());
}


/* ══════════════════════════════════════════════════════════════════════════
   TVÅSPRÅKIGA MALLAR (svenska + engelska)
   ──────────────────────────────────────────────────────────────────────────
   Rese- och barnmallar köps ofta för utlandsbruk: gränskontroll, flygbolag,
   utländsk sjukvård och hotell vill kunna läsa handlingen. Dessa mallar kan
   därför köpas som tvåspråkig PDF där den svenska versionen är originalet och
   den engelska översättningen följer som extra sida i samma dokument.

   `standardText` är mallens svenska standardklausul och `en.standardText`
   dess engelska motsvarighet – översatt till naturlig juridisk engelska, inte
   ord för ord. Användarens egna ifyllda uppgifter översätts aldrig.
   ══════════════════════════════════════════════════════════════════════════ */

interface BilingualContent {
  /** Svensk dokumentrubrik i PDF:en (FULLMAKT / MEDGIVANDE / RESEINTYG / INTYG) */
  documentTitle: string;
  /** Svensk standardklausul som skrivs ut i uppdragsrutan */
  standardText: string;
  en: TemplateTranslation;
}

const EN_LEGAL_CHILD =
  'This document is drawn up under Swedish contract law and is intended for use with authorities, schools, airlines and health services. Outside Sweden it serves as evidence of the guardian’s consent; the country of destination may impose additional requirements.';
const EN_LEGAL_TRAVEL =
  'Valid under Swedish contract law and the Swedish law of agency (avtalslagen 1915:218).';
const EN_LEGAL_ANIMAL =
  'Based on the rules on agency in chapter 2 of the Swedish Contracts Act (avtalslagen (1915:218)).';

const bilingualContent: Record<string, BilingualContent> = {
  'foraldraredgivande-resa-annan-vuxen': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger härmed att ovan angivet barn får resa tillsammans med den angivna vuxna under den period som anges i denna handling. Medgivandet omfattar resa till och från destinationen, in- och utresa över gränser samt att den angivna vuxna fattar de beslut om barnets omvårdnad som behövs under resan. Vårdnadshavaren är anträffbar på de kontaktuppgifter som anges ovan.',
    en: {
      name: 'Parental consent – travel with another adult',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a child to travel with an adult who is not the guardian.',
      longDescription:
        'A parental consent letter for a child travelling with an adult other than the guardian. Border control officers, airlines and hotels regularly ask for this document, and the English translation lets them read it without a sworn translator.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian hereby consents to the child named above travelling with the authorised person named above during the period stated in this document. The consent covers travel to and from the destination, the crossing of international borders, and the authorised person taking any decisions needed for the child’s day-to-day care during the journey. The guardian can be reached at the contact details given above.',
    },
  },

  'reseintyg-barn-internationell': {
    documentTitle: 'RESEINTYG',
    standardText:
      'Detta intyg utfärdas för att styrka att undertecknad vårdnadshavare känner till och godkänner barnets internationella resa. Intyget är avsett att visas upp för flygbolag, gränskontroll och andra myndigheter i avrese- och ankomstlandet tillsammans med barnets pass eller nationella id-handling.',
    en: {
      name: 'Travel certificate for a child – international travel',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'The certificate required when a child travels internationally.',
      longDescription:
        'A travel certificate for a child on an international journey. It is presented together with the child’s passport at check-in and at border control, and the English page makes it usable at any border.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'This certificate is issued to confirm that the undersigned guardian is aware of and approves the child’s international journey. It is intended to be presented to airlines, border control authorities and other authorities in the countries of departure and arrival, together with the child’s passport or national identity document.',
    },
  },

  'resefullmakt-barn-eu': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger fullmaktshavaren rätt att resa med barnet inom EU och EES och att företräda barnet i praktiska frågor under resan, såsom incheckning, boende, transport och kontakt med lokala myndigheter. Fullmakten ger inte rätt att ändra barnets stadigvarande bosättning.',
    en: {
      name: 'Travel authorisation for a child within the EU',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Parents & Children',
      description: 'A power of attorney written for travel with a child inside the EU.',
      longDescription:
        'A power of attorney for travelling with a child inside the EU and the EEA. Free movement does not remove the need to show that the accompanying adult has the guardian’s permission.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'This power of attorney authorises the attorney-in-fact to travel with the child within the EU and the EEA and to represent the child in practical matters during the journey, such as check-in, accommodation, transport and contact with local authorities. It confers no right to change the child’s habitual residence.',
    },
  },

  'medgivande-skolresa': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet deltar i den skolresa som anges ovan. Medgivandet omfattar transport, boende och de aktiviteter som ingår i resans program samt att ansvarig personal fattar de beslut om barnets omvårdnad som behövs om vårdnadshavaren inte kan nås.',
    en: {
      name: 'Consent for a school trip',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a child to take part in a school trip.',
      longDescription:
        'A consent form for a school trip, covering transport, accommodation and the activities in the programme. Schools travelling abroad usually need it in English as well.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the child taking part in the school trip stated above. The consent covers transport, accommodation and the activities included in the programme, and authorises the responsible staff to take any decisions needed for the child’s care if the guardian cannot be reached.',
    },
  },

  'medgivande-lager-kollo': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet deltar i angivet läger eller kolloverksamhet. Medgivandet omfattar resa till och från lägret, boende och deltagande i lägrets aktiviteter samt att lägerledningen fattar de beslut om barnets omvårdnad som behövs under vistelsen.',
    en: {
      name: 'Consent for a summer camp',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a child to attend a camp or summer camp.',
      longDescription:
        'A consent form for a camp or summer camp, covering the journey there and back, accommodation and the activities of the camp. Camps abroad ask for an English version.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the child attending the camp stated above. The consent covers travel to and from the camp, accommodation and participation in the activities of the camp, and authorises the camp management to take any decisions needed for the child’s care during the stay.',
    },
  },

  'medgivande-foreningsresa': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet följer med på föreningens resa enligt ovan. Medgivandet omfattar transport, boende och deltagande i resans aktiviteter samt att ansvarig ledare företräder barnet i praktiska frågor under resan.',
    en: {
      name: 'Consent for a club trip',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a child to travel with a club or team.',
      longDescription:
        'A consent form for a trip with a club or team, covering transport, accommodation and the activities of the trip, and naming the team leader who represents the child.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the child taking part in the club trip stated above. The consent covers transport, accommodation and participation in the activities of the trip, and authorises the responsible team leader to represent the child in practical matters during the journey.',
    },
  },

  'medgivande-ensam-resa-minderarig': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att den minderårige reser ensam enligt de uppgifter som anges ovan. Vårdnadshavaren ansvarar för att den minderårige lämnas av och möts upp av behörig vuxen och är anträffbar på angivna kontaktuppgifter under hela resan.',
    en: {
      name: 'Consent for a minor travelling alone',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a minor to travel unaccompanied.',
      longDescription:
        'A consent form for a minor travelling unaccompanied. Airlines and border control ask to see the guardian’s written permission and contact details, in a language they can read.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the minor travelling unaccompanied as stated above. The guardian is responsible for ensuring that the minor is seen off and met by an authorised adult, and undertakes to be reachable at the contact details given above throughout the journey.',
    },
  },

  'fullmakt-barns-sjukvard': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger fullmaktshavaren rätt att företräda barnet i kontakter med hälso- och sjukvården, ta emot information om barnets hälsotillstånd och lämna samtycke till sedvanlig undersökning och behandling. Vid livshotande tillstånd får nödvändig vård ges utan att vårdnadshavaren först kontaktas.',
    en: {
      name: 'Power of attorney for a child’s medical care',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Parents & Children',
      description: 'Authorises another adult to handle a child’s medical care.',
      longDescription:
        'A power of attorney allowing another adult to deal with health services on behalf of a child. It is the document foreign clinics and hospitals ask for when a child falls ill while travelling without a guardian.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'This power of attorney authorises the attorney-in-fact to represent the child in contacts with health services, to receive information about the child’s state of health and to give consent to routine examination and treatment. In life-threatening situations, necessary care may be given without the guardian being contacted first.',
    },
  },

  'medgivande-akut-vard': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att den angivna vuxna får söka akut vård för barnet och lämna samtycke till den behandling som vårdpersonalen bedömer nödvändig när vårdnadshavaren inte är anträffbar. Vårdnadshavaren ska underrättas så snart det är möjligt.',
    en: {
      name: 'Consent to emergency medical care',
      documentTitle: 'PARENTAL CONSENT',
      category: 'Parents & Children',
      description: 'Emergency consent to medical care for a child when the guardian is unavailable.',
      longDescription:
        'An emergency consent allowing a named adult to seek urgent medical care for a child when the guardian cannot be reached – the situation it is written for is most often one that arises abroad.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the authorised person seeking emergency care for the child and giving consent to the treatment that the medical staff consider necessary when the guardian cannot be reached. The guardian shall be informed as soon as possible.',
    },
  },

  'fullmakt-slakting-resa': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger den angivna släktingen rätt att resa med barnet under den period som anges ovan och att företräda barnet i praktiska frågor under resan, såsom transport, boende och kontakt med myndigheter i destinationslandet.',
    en: {
      name: 'Power of attorney for a relative travelling with a child',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Parents & Children',
      description: 'Authorises a relative to travel with a child.',
      longDescription:
        'A power of attorney for a grandparent, aunt, uncle or other relative travelling with a child. A shared surname is not proof of permission – border officers ask for the document.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'This power of attorney authorises the relative named above to travel with the child during the period stated and to represent the child in practical matters during the journey, such as transport, accommodation and contact with the authorities of the destination country.',
    },
  },

  'medgivande-overnattning-utomlands': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet övernattar utomlands hos den angivna vuxna under den period som anges ovan. Medgivandet omfattar boende, kost och tillsyn samt att den angivna vuxna fattar de beslut om barnets omvårdnad som behövs.',
    en: {
      name: 'Consent for a child to stay overnight abroad',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a child to stay overnight abroad.',
      longDescription:
        'A consent form for a child staying overnight abroad with a host family or another named adult, covering accommodation, meals and supervision.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the child staying overnight abroad with the authorised person named above during the period stated. The consent covers accommodation, meals and supervision, and authorises that person to take any decisions needed for the child’s care.',
    },
  },

  'medgivande-idrottsstavling-utomlands': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet deltar i den idrottstävling utomlands som anges ovan. Medgivandet omfattar resa, boende, deltagande i tävling och träning samt att ansvarig ledare företräder barnet i praktiska och medicinska frågor under vistelsen.',
    en: {
      name: 'Consent for a sports competition abroad',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a child to take part in a sports competition abroad.',
      longDescription:
        'A consent form for a child competing abroad, covering the journey, accommodation, training and the competition itself, and naming the leader who represents the child.',
      legalInfo: EN_LEGAL_CHILD,
      standardText:
        'The undersigned guardian consents to the child taking part in the sports competition abroad stated above. The consent covers travel, accommodation, participation in training and in the competition, and authorises the responsible team leader to represent the child in practical and medical matters during the stay.',
    },
  },

  'medgivande-barn-ensamresa-flyg-2026': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet flyger ensamt med angivet flygbolag och enligt angiven resväg. Medgivandet omfattar flygbolagets tjänst för ensamresande barn (UM). Barnet lämnas av och möts upp av angiven vuxen, och angiven nödkontakt är anträffbar under hela resan.',
    en: {
      name: 'Consent for a child flying unaccompanied',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Parents & Children',
      description: 'Consent for a minor to fly alone, stating airline, route and emergency contact.',
      longDescription:
        'A consent form for a child flying unaccompanied. Most airlines require the guardian’s written consent for passengers under 15–18, and ground staff abroad need to be able to read it.',
      legalInfo:
        'Requirements differ between airlines. Check the airline’s current unaccompanied minor policy before travelling.',
      standardText:
        'The undersigned guardian consents to the child flying unaccompanied with the airline and on the route stated above. The consent covers the airline’s unaccompanied minor (UM) service. The child will be seen off and met by the adult named above, and the emergency contact stated will be reachable throughout the journey.',
    },
  },

  'resefullmakt-vuxen': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger fullmaktshavaren rätt att företräda fullmaktsgivaren i frågor som rör den aktuella resan, såsom bokning, ombokning, avbokning, incheckning, uthämtning av handlingar och kontakt med resebolag, flygbolag och försäkringsbolag.',
    en: {
      name: 'Travel power of attorney for an adult',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Travel & Transport',
      description: 'A general travel power of attorney for an adult.',
      longDescription:
        'A general travel power of attorney: the attorney-in-fact books, rebooks, checks in and deals with travel operators and insurers on the principal’s behalf.',
      legalInfo: EN_LEGAL_TRAVEL,
      standardText:
        'This power of attorney authorises the attorney-in-fact to represent the principal in matters relating to the journey concerned, such as bookings, rebookings, cancellations, check-in, collection of documents and contact with travel operators, airlines and insurance companies.',
    },
  },

  'resefullmakt-grupp': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger fullmaktshavaren rätt att företräda gruppens deltagare i frågor som rör den gemensamma resan, såsom bokning, ombokning, incheckning, hotellregistrering och kontakt med resebolag och transportörer. Deltagarna anges i uppdragsbeskrivningen.',
    en: {
      name: 'Travel power of attorney for a group',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Travel & Transport',
      description: 'A power of attorney for a group journey with named participants.',
      longDescription:
        'A travel power of attorney for a group, letting one person handle bookings, check-in and hotel registration for every named participant.',
      legalInfo: EN_LEGAL_TRAVEL,
      standardText:
        'This power of attorney authorises the attorney-in-fact to represent the members of the group in matters relating to the joint journey, such as bookings, rebookings, check-in, hotel registration and contact with travel operators and carriers. The participants are listed in the description of the assignment.',
    },
  },

  'fullmakt-flygbolag': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger fullmaktshavaren rätt att företräda fullmaktsgivaren gentemot flygbolaget i frågor om bokning, ombokning och avbokning samt att framställa och ta emot krav på ersättning vid försenad, inställd eller överbokad flygning, inklusive ersättning enligt EU-förordning 261/2004.',
    en: {
      name: 'Power of attorney for dealings with an airline',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Travel & Transport',
      description: 'Authorises another person to handle a booking or a claim with an airline.',
      longDescription:
        'A power of attorney for dealings with an airline – bookings, rebookings and compensation claims for delayed, cancelled or overbooked flights. Foreign airlines will not act on a Swedish-only document.',
      legalInfo: EN_LEGAL_TRAVEL,
      standardText:
        'This power of attorney authorises the attorney-in-fact to represent the principal in dealings with the airline concerning bookings, rebookings and cancellations, and to submit and receive claims for compensation for a delayed, cancelled or overbooked flight, including compensation under EU Regulation 261/2004.',
    },
  },

  'fullmakt-djurtransport': {
    documentTitle: 'FULLMAKT',
    standardText:
      'Fullmakten ger fullmaktshavaren rätt att transportera det angivna djuret för ägarens räkning och att under transporten fatta de beslut om djurets omvårdnad som behövs, inklusive att uppsöka veterinär vid akut behov.',
    en: {
      name: 'Power of attorney for transporting an animal',
      documentTitle: 'POWER OF ATTORNEY',
      category: 'Animals & Pets',
      description: 'Authorises another person to transport someone else’s animal.',
      longDescription:
        'A power of attorney for transporting an animal on the owner’s behalf, including the right to contact a veterinarian in an emergency during the journey.',
      legalInfo: EN_LEGAL_ANIMAL,
      standardText:
        'This power of attorney authorises the attorney-in-fact to transport the animal named above on behalf of the owner and, during transport, to take any decisions needed for the animal’s welfare, including contacting a veterinarian in an emergency.',
    },
  },

  'intyg-djur-resa-utomlands': {
    documentTitle: 'INTYG',
    standardText:
      'Detta intyg utfärdas som komplement till djurets pass och visar att undertecknad ägare godkänner att djuret reser utomlands tillsammans med den angivna personen. Intyget ersätter inte krav på husdjurspass, id-märkning, vaccinationer eller övriga införselregler i destinationslandet.',
    en: {
      name: 'Certificate for a pet travelling abroad',
      documentTitle: 'PET TRAVEL CERTIFICATE',
      category: 'Animals & Pets',
      description: 'A supplement to the pet passport for travel abroad.',
      longDescription:
        'A certificate to accompany the pet passport when an animal travels abroad with someone other than its owner. Border and customs officers read it at the point of entry.',
      legalInfo: EN_LEGAL_ANIMAL,
      standardText:
        'This certificate is issued as a supplement to the animal’s pet passport and confirms that the undersigned owner approves the animal travelling abroad with the person named above. It does not replace the requirements for a pet passport, microchipping, vaccinations or any other import rules of the country of destination.',
    },
  },

  'medgivande-skidresa': {
    documentTitle: 'MEDGIVANDE',
    standardText:
      'Undertecknad vårdnadshavare medger att barnet deltar i den skidresa som anges ovan. Medgivandet omfattar transport, boende, skidåkning och övriga aktiviteter i resans program samt att ansvarig ledare fattar de beslut om barnets omvårdnad som behövs under resan.',
    en: {
      name: 'Consent for a ski trip',
      documentTitle: 'PARENTAL CONSENT FOR TRAVEL',
      category: 'Clubs, School & Leisure',
      description: 'Consent for a child to take part in a ski trip.',
      longDescription:
        'A consent form for a ski trip, covering transport, accommodation, skiing and the rest of the programme. Ski trips usually cross a border, so the English page travels with it.',
      legalInfo:
        'Written for club and school activities in Sweden. Outside Sweden it serves as evidence of the guardian’s consent.',
      standardText:
        'The undersigned guardian consents to the child taking part in the ski trip stated above. The consent covers transport, accommodation, skiing and the other activities in the programme, and authorises the responsible leader to take any decisions needed for the child’s care during the trip.',
    },
  },
};

/** Engelska etiketter på PDF:ens översättningssida. Varje fält i en tvåspråkig mall måste ha en (testas). */
export const fieldLabelsEn: Record<string, string> = {
  givare_namn: 'Principal’s full name',
  givare_pnr: 'Personal identity number',
  givare_adress: 'Address',
  givare_epost: 'Email',
  givare_telefon: 'Phone',
  havare_namn: 'Authorised person’s full name',
  havare_pnr: 'Personal identity no./Company reg. no.',
  havare_relation: 'Relationship to the principal',
  havare_adress: 'Address',
  giltig_fran: 'Valid from',
  giltig_till: 'Valid until',
  syfte: 'Purpose and assignment',
  begransningar: 'Limitations',
  barn_namn: 'Child’s full name',
  barn_pnr: 'Child’s personal identity number',
  barn_foddatum: 'Child’s date of birth',
  vardnadshavare1_namn: 'Guardian 1 – full name',
  vardnadshavare1_pnr: 'Guardian 1 – personal identity number',
  vardnadshavare2_namn: 'Guardian 2 – full name',
  vardnadshavare2_pnr: 'Guardian 2 – personal identity number',
  flygbolag: 'Airline',
  avgangsplats: 'Place of departure',
  destination: 'Destination',
  motande_vuxen: 'Adult meeting the child',
  nodkontakt: 'Emergency contact',
  djur_namn: 'Name of the animal',
  djur_art: 'Species and breed',
  forening: 'Club or association',
  vardgivare: 'Healthcare provider',
  myndighet: 'Authority or institution',
  resmal: 'Destination',
};

/** Slugs som säljs som tvåspråkig PDF. */
export const bilingualSlugs = Object.keys(bilingualContent);

export function isBilingual(slug: string): boolean {
  return slug in bilingualContent;
}

function applyBilingual(list: TemplateInput[]): TemplateInput[] {
  for (const t of list) {
    const b = bilingualContent[t.slug];
    if (!b) continue;
    t.bilingual = true;
    t.documentTitle = b.documentTitle;
    t.standardText = b.standardText;
    t.en = b.en;
  }
  return list;
}

/**
 * Lägger fältets uttryckliga roll på varje fält. Fälten kopieras, eftersom de
 * delade fältlistorna (commonGivareFields m.fl.) är samma objekt i många mallar.
 * Ett fält utan roll stoppar laddningen – det får aldrig gissas.
 */
function applyFieldRoles(list: TemplateInput[]): Template[] {
  return list.map(t => ({
    ...t,
    fields: t.fields.map(f => {
      const spec = fieldRoleFor(t.slug, f.id);
      if (!spec) throw new Error(`Fältet "${f.id}" i mallen "${t.slug}" saknar roll i data/field-roles.ts`);
      return { ...f, role: spec.role, key: spec.key, person: spec.person };
    }),
  }));
}

export const templates = applyFieldRoles(applyBilingual(generateTemplates()));

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find(t => t.slug === slug);
}

export function getTemplatesByCategory(categorySlug: string): Template[] {
  return templates.filter(t => t.categorySlug === categorySlug);
}

export function searchTemplates(query: string): Template[] {
  const q = query.toLowerCase().trim();
  if (!q) return templates;

  return templates.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );
}
