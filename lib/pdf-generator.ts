import jsPDF from 'jspdf'

export type PdfLang = 'sv' | 'en'

/**
 * Engelska motsvarigheter till mallens standardtexter. Skickas in för
 * tvåspråkiga mallar och används enbart på den engelska sidan.
 */
export interface PdfTranslation {
  templateName: string
  documentTitle: string
  categoryName: string
  standardText?: string
  legalInfo?: string
}

/** Avsnittet i PDF:en som ett värde hör till. Samma roller som data/field-roles.ts. */
export type PdfRole =
  | 'givare' | 'vardnadshavare' | 'havare' | 'ersattare' | 'barn' | 'avliden'
  | 'forening' | 'djur' | 'resa' | 'objekt' | 'uppdrag' | 'giltighet' | 'begransning' | 'ovrigt'

/** Ett ifyllt (eller tomt) fält. Generatorn placerar det enbart utifrån rollen. */
export interface PdfField {
  id: string
  role: PdfRole
  /** namn/pnr återges i uppdragsmeningen, namn och undertecknare under underskriften. */
  key?: 'namn' | 'pnr' | 'undertecknare'
  person?: 1 | 2
  type: string
  label: string
  /** Etikett på den engelska översättningssidan. Saknas den används den svenska. */
  labelEn?: string
  /** Obligatoriskt i formuläret. Ett tomt frivilligt personnummer lämnar ingen linje i löptexten. */
  required?: boolean
  value: string
}

export interface PdfData {
  templateName: string
  /** Dokumentrubrik, t.ex. FULLMAKT eller MEDGIVANDE. Standard: FULLMAKT. */
  documentTitle?: string
  categoryName: string
  /** Mallens alla fält i mallens ordning, med kundens värden. */
  fields: PdfField[]
  /** Uppdragets innehåll när mallen saknar ett uppdragsfält. */
  uppdragText?: string
  /** Mallens svenska standardklausul (skrivs efter uppdraget). */
  standardText?: string
  /** Mallens juridiska notis på svenska. */
  legalInfo?: string
  /** Lägg till engelsk översättning som extra sida/sidor i samma PDF. */
  bilingual?: boolean
  en?: PdfTranslation
  watermark?: boolean
  /**
   * Framtidsfullmakt enligt lag (2017:310). När den är satt renderas en egen
   * layout med lagstadgade formuleringar och obligatoriskt vittnesavsnitt –
   * fälten ovan används då inte.
   */
  framtidsfullmakt?: FramtidsfullmaktData
}

/* ──────────────────────────────────────────────────────────────────────────
   Framtidsfullmakt (lag 2017:310). Formuleringarna nedan följer lagtexten:
   1 § (när fullmakten gäller), 2 § (vad den får omfatta), 4 § och ärvdabalken
   10 kap. 2 § första stycket och 4 § första stycket (vittnen), 5 § (innehåll),
   6–8 §§ (ändring och återkallelse, via avtalslagen 16 §), 9–10 §§
   (ikraftträdande), 18 § (gåvor), 19 § (arvode), 23 § (granskare).
   ────────────────────────────────────────────────────────────────────────── */

export interface FramtidsfullmaktPerson {
  namn: string
  personnummer: string
  adress?: string
  relation?: string
}

export interface FramtidsfullmaktDokument {
  givare: FramtidsfullmaktPerson
  havare: FramtidsfullmaktPerson
}

export interface FramtidsfullmaktData {
  /** Ett dokument per fullmaktsgivare. Ömsesidig fullmakt för makar = två dokument. */
  dokument: FramtidsfullmaktDokument[]
  ersattare?: FramtidsfullmaktPerson
  /** Vilka angelägenheter fullmakten omfattar (5 § 3). Obligatoriskt. */
  angelagenheter: string
  fastEgendom?: string
  gavor?: string
  /** 'skäligt' = rätt till skäligt arvode, annars inget arvode (19 §). */
  arvode?: 'skäligt' | 'inget'
  granskare?: FramtidsfullmaktPerson
  granskareFarAterkalla?: boolean
  domstolsprovning?: boolean
  ovrigaVillkor?: string
}

/** Kastas när obligatoriska uppgifter saknas. PDF:en skapas då inte alls. */
export class PdfValidationError extends Error {
  missing: string[]
  constructor(missing: string[]) {
    super(`Obligatoriska uppgifter saknas: ${missing.join(', ')}`)
    this.name = 'PdfValidationError'
    this.missing = missing
  }
}

/** Returnerar de obligatoriska uppgifter som saknas (tom lista = OK). */
export function validateFramtidsfullmakt(ff: FramtidsfullmaktData): string[] {
  const missing: string[] = []
  const blank = (v?: string) => !v || !v.trim()
  if (ff.dokument.length === 0) missing.push('fullmaktsgivare')
  ff.dokument.forEach((d, i) => {
    const n = ff.dokument.length > 1 ? ` (dokument ${i + 1})` : ''
    if (blank(d.givare.namn)) missing.push(`fullmaktsgivarens namn${n}`)
    if (blank(d.givare.personnummer)) missing.push(`fullmaktsgivarens personnummer${n}`)
    if (blank(d.havare.namn)) missing.push(`fullmaktshavarens namn${n}`)
    if (blank(d.havare.personnummer)) missing.push(`fullmaktshavarens personnummer${n}`)
  })
  if (blank(ff.angelagenheter)) missing.push('angelägenheter som fullmakten omfattar')
  return missing
}

/* ──────────────────────────────────────────────────────────────────────────
   Standardtexter per språk. Den svenska versionen är originalet; den engelska
   är en översättning avsedd för utländska mottagare (gränskontroll, flygbolag,
   sjukvård, hotell). Endast standardtext översätts – aldrig användarens data.
   ────────────────────────────────────────────────────────────────────────── */

type Heading = PdfRole | 'underskrifter'

interface IntroParts {
  /** Fullmaktsgivaren/-givarna, t.ex. "Anna (pnr)" eller "Bolag AB (orgnr) genom undertecknad Eva". */
  principal: string
  agent: string
  plural: boolean
  company: boolean
}

interface Strings {
  tagline: string
  defaultTitle: string
  categoryLabel: string
  headings: Record<Heading, string>
  validity: (from: string, to: string) => string
  intro: (p: IntroParts) => string
  consentIntro: (principal: string, plural: boolean) => string
  companyBy: (company: string, signer: string) => string
  and: string
  genericScope: string
  mandateClosing: string
  legalNote: string
  sigLabels: Record<'givare' | 'vardnadshavare' | 'havare', string>
  sigPlaceDate: string
  witnessHeader: string
  witness1: string
  witness2: string
  footer: (date: string) => string
  pageOf: (page: number, total: number) => string
  placeholder: string
  watermark: string
  translationNotice: string
}

// Signaturetiketterna är tvåspråkiga på båda sidorna, så att en utländsk
// mottagare ser vem som är vem även på den svenska originalsidan.
const SIG_LABELS = {
  givare: 'Fullmaktsgivare / Principal',
  vardnadshavare: 'Vårdnadshavare / Parent or guardian',
  havare: 'Fullmaktshavare / Attorney-in-fact',
}

const STRINGS: Record<PdfLang, Strings> = {
  sv: {
    tagline: 'Din fullmakt – klar på 3 minuter',
    defaultTitle: 'FULLMAKT',
    categoryLabel: 'Kategori: ',
    headings: {
      givare: 'FULLMAKTSGIVARE',
      vardnadshavare: 'VÅRDNADSHAVARE',
      havare: 'FULLMAKTSHAVARE',
      ersattare: 'ERSÄTTARE',
      barn: 'BARNET',
      avliden: 'DEN AVLIDNE',
      forening: 'FÖRENING / ORGANISATION',
      djur: 'DJURET',
      resa: 'RESAN',
      objekt: 'AVSER',
      uppdrag: 'UPPDRAG OCH BEFOGENHET',
      giltighet: 'GILTIGHETSTID',
      begransning: 'BEGRÄNSNINGAR OCH VILLKOR',
      ovrigt: 'ÖVRIGA UPPGIFTER',
      underskrifter: 'UNDERSKRIFTER',
    },
    validity: (from, to) => `Denna handling gäller från och med ${from} till och med ${to}.`,
    intro: ({ principal, agent, plural, company }) =>
      company
        ? `Härmed ger ${principal} fullmakt till ${agent} att för bolagets räkning och i bolagets namn:`
        : `Härmed ger undertecknad${plural ? 'e' : ''} ${principal} fullmakt till ${agent} att för ${plural ? 'vår' : 'min'} räkning och i ${plural ? 'vårt' : 'mitt'} namn:`,
    consentIntro: (principal, plural) => `Undertecknad${plural ? 'e' : ''} ${principal} lämnar härmed följande medgivande:`,
    companyBy: (company, signer) => `${company} genom undertecknad ${signer}`,
    and: ' och ',
    genericScope: 'Företräda fullmaktsgivaren i de angelägenheter som anges i denna handling.',
    mandateClosing:
      'Fullmaktshavaren har rätt att vidta alla åtgärder som krävs för att utföra ovanstående uppdrag.',
    legalNote:
      'Denna handling är upprättad i enlighet med svensk avtalsrätt. Den kan återkallas när som helst genom skriftligt meddelande till fullmaktshavaren. Fullmaktsgivaren ansvarar för att fullmaktshavaren informeras om eventuella begränsningar.',
    sigLabels: SIG_LABELS,
    sigPlaceDate: 'Ort och datum',
    witnessHeader: 'VITTNEN (valfritt men rekommenderas)',
    witness1: 'Vittne 1: Namn, personnummer och underskrift',
    witness2: 'Vittne 2: Namn, personnummer och underskrift',
    footer: date => `Genererad via Fullmakt24.se • ${date}`,
    pageOf: (page, total) => `Sida ${page} av ${total}`,
    placeholder: '________________________________',
    watermark: 'FÖRHANDSVISNING',
    translationNotice: '',
  },
  en: {
    tagline: 'Your document – ready in 3 minutes',
    defaultTitle: 'POWER OF ATTORNEY',
    categoryLabel: 'Category: ',
    headings: {
      givare: 'PRINCIPAL / GUARDIAN',
      vardnadshavare: 'PARENT(S) / GUARDIAN(S)',
      havare: 'ATTORNEY-IN-FACT / AUTHORISED PERSON',
      ersattare: 'SUBSTITUTE',
      barn: 'CHILD',
      avliden: 'DECEASED',
      forening: 'ASSOCIATION / ORGANISATION',
      djur: 'ANIMAL',
      resa: 'TRAVEL',
      objekt: 'CONCERNS',
      uppdrag: 'AUTHORITY GRANTED',
      giltighet: 'PERIOD OF VALIDITY',
      begransning: 'LIMITATIONS AND CONDITIONS',
      ovrigt: 'ADDITIONAL DETAILS',
      underskrifter: 'SIGNATURES',
    },
    validity: (from, to) => `This document is valid from ${from} up to and including ${to}.`,
    intro: ({ principal, agent, plural, company }) =>
      company
        ? `${principal} hereby authorises ${agent} to act on the company’s behalf and in its name in order to:`
        : `The undersigned, ${principal}, hereby authorise${plural ? '' : 's'} ${agent} to act on ${plural ? 'our' : 'my'} behalf and in ${plural ? 'our' : 'my'} name in order to:`,
    consentIntro: (principal, plural) => `The undersigned, ${principal}, hereby give${plural ? '' : 's'} the following consent:`,
    companyBy: (company, signer) => `${company}, represented by the undersigned ${signer}`,
    and: ' and ',
    genericScope: 'Represent the principal in the matters set out in this document.',
    mandateClosing:
      'The authorised person is entitled to take every measure required to carry out the assignment described above.',
    legalNote:
      'This document has been drawn up in accordance with Swedish contract law. It may be revoked at any time by written notice to the authorised person. The principal is responsible for informing the authorised person of any limitations. This English text is a translation provided for use abroad; the Swedish version is the original and prevails in the event of any discrepancy.',
    sigLabels: SIG_LABELS,
    sigPlaceDate: 'Place and date',
    witnessHeader: 'WITNESSES (optional but recommended)',
    witness1: 'Witness 1: name, identity number and signature',
    witness2: 'Witness 2: name, identity number and signature',
    footer: date => `Generated via Fullmakt24.se • ${date}`,
    pageOf: (page, total) => `Page ${page} of ${total}`,
    placeholder: '________________________________',
    watermark: 'PREVIEW',
    translationNotice:
      'English translation – for use abroad. The Swedish version is the original.',
  },
}

/** Rubriken för ett avsnitt. Används av testet för att dela upp PDF:en i avsnitt. */
export function sectionHeading(role: Heading, lang: PdfLang): string {
  return STRINGS[lang].headings[role]
}

/** Alla avsnittsrubriker på ett språk. */
export function sectionHeadings(lang: PdfLang): string[] {
  return Object.values(STRINGS[lang].headings)
}

const LOCALE: Record<PdfLang, string> = { sv: 'sv-SE', en: 'en-GB' }

/** Datum som det skrivs i PDF:en, t.ex. "1 december 2026". */
export function formatDate(dateStr: string | undefined, lang: PdfLang): string {
  if (!dateStr) return '________________'
  try {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString(LOCALE[lang], { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function todayFormatted(lang: PdfLang): string {
  return new Date().toLocaleDateString(LOCALE[lang], { year: 'numeric', month: 'long', day: 'numeric' })
}

const PAGE_WIDTH = 210
const MARGIN_LEFT = 25
const MARGIN_RIGHT = 25
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT

export function generatePdf(data: PdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Vilket språk varje sida är skriven på – styr sidfoten längst ner.
  const pageLangs: PdfLang[] = []

  if (data.framtidsfullmakt) {
    const missing = validateFramtidsfullmakt(data.framtidsfullmakt)
    if (missing.length > 0) throw new PdfValidationError(missing)
    renderFramtidsfullmakt(doc, data.framtidsfullmakt, pageLangs)
    drawFooters(doc, pageLangs)
    if (data.watermark) drawWatermarks(doc, pageLangs)
    doc.setPage(1)
    return doc
  }

  renderVersion(doc, data, 'sv', pageLangs)

  if (data.bilingual && data.en) {
    doc.addPage()
    renderVersion(doc, data, 'en', pageLangs)
  }

  drawFooters(doc, pageLangs)

  if (data.watermark) {
    drawWatermarks(doc, pageLangs)
  }

  // Tillbaka till första sidan så att PDF-läsare öppnar originalet.
  doc.setPage(1)

  return doc
}

/**
 * Renderar en språkversion av dokumentet med start på aktuell sida. Layouten är
 * identisk för båda språken – bara texten byts ut.
 */
function renderVersion(doc: jsPDF, data: PdfData, lang: PdfLang, pageLangs: PdfLang[]): void {
  const s = STRINGS[lang]
  const en = data.en
  const firstPage = doc.getNumberOfPages()

  const templateName = lang === 'en' && en ? en.templateName : data.templateName
  const categoryName = lang === 'en' && en ? en.categoryName : data.categoryName
  const documentTitle =
    lang === 'en'
      ? en?.documentTitle || s.defaultTitle
      : data.documentTitle || s.defaultTitle
  const legalInfo = lang === 'en' && en ? en.legalInfo : data.legalInfo

  let y = 25

  // ─── HEADER BAR ───
  doc.setFillColor(27, 43, 75) // navy-500
  doc.rect(0, 0, PAGE_WIDTH, 18, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(232, 160, 32) // gold-500
  doc.text('Fullmakt24.se', MARGIN_LEFT, 11)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(180, 190, 210)
  doc.text(s.tagline, PAGE_WIDTH - MARGIN_RIGHT, 11, { align: 'right' })

  y = 32

  // ─── TRANSLATION NOTICE (endast engelsk version) ───
  if (lang === 'en') {
    doc.setFillColor(243, 246, 251)
    doc.roundedRect(MARGIN_LEFT, y - 6, CONTENT_WIDTH, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(80, 90, 110)
    doc.text(s.translationNotice, PAGE_WIDTH / 2, y, { align: 'center' })
    y += 12
  }

  // ─── DOCUMENT TITLE ───
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(documentTitle.length > 24 ? 16 : 22)
  doc.setTextColor(27, 43, 75)
  doc.text(documentTitle, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 10

  // Subtitle / template name
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(80, 90, 110)
  doc.text(templateName, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 5

  // Category
  doc.setFontSize(9)
  doc.setTextColor(140, 150, 165)
  doc.text(`${s.categoryLabel}${categoryName}`, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 10

  // Separator line
  doc.setDrawColor(27, 43, 75)
  doc.setLineWidth(0.5)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  y += 10

  // ─── AVSNITT PER ROLL ───
  // Varje värde placeras enbart utifrån fältets roll, med mallens egen etikett.
  for (const role of LEADING_ROLES) y = drawRoleSection(doc, data, role, lang, y, pageLangs)

  // ─── UPPDRAG / AUTHORITY GRANTED ───
  const mandateText = buildMandateText(data, lang)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const splitMandate: string[] = doc.splitTextToSize(mandateText, CONTENT_WIDTH - 10)
  const mandateHeight = splitMandate.length * 5 + 10

  y = pageBreakIfNeeded(doc, y, mandateHeight + 12, pageLangs, lang)
  y = drawSectionHeader(doc, s.headings.uppdrag, MARGIN_LEFT, y)
  y += 2

  // Gold-tinted background for the mandate text
  doc.setFillColor(253, 245, 230) // gold-50
  doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, mandateHeight, 2, 2, 'F')
  doc.setDrawColor(232, 160, 32)
  doc.setLineWidth(0.3)
  doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, mandateHeight, 2, 2, 'S')

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(40, 45, 60)
  doc.text(splitMandate, MARGIN_LEFT + 5, y)
  y += mandateHeight - 2

  y += 5

  // ─── GILTIGHETSTID, BEGRÄNSNINGAR, ÖVRIGT ───
  for (const role of TRAILING_ROLES) y = drawRoleSection(doc, data, role, lang, y, pageLangs)

  // ─── LEGAL NOTICE ───
  const legalNote = legalInfo ? `${s.legalNote} ${legalInfo}` : s.legalNote
  doc.setFontSize(8)
  const splitLegal = doc.splitTextToSize(legalNote, CONTENT_WIDTH)
  y = pageBreakIfNeeded(doc, y, splitLegal.length * 4 + 20, pageLangs, lang)

  y += 5
  doc.setDrawColor(200, 205, 215)
  doc.setLineWidth(0.3)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  y += 8

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(130, 140, 155)
  doc.text(splitLegal, MARGIN_LEFT, y)
  y += splitLegal.length * 4 + 8

  // ─── SIGNATURES ───
  // En underskrift per fullmaktsgivare/vårdnadshavare och per fullmaktshavare.
  const signers = [
    ...principalSigners(data, lang),
    ...persons(data, 'havare').map(p => ({ label: s.sigLabels.havare, name: p.namn })),
  ]
  const sigWidth = (CONTENT_WIDTH - 15) / 2
  const rows = Math.ceil(signers.length / 2)
  y = pageBreakIfNeeded(doc, y, 14 + rows * 48, pageLangs, lang)
  y = drawSectionHeader(doc, s.headings.underskrifter, MARGIN_LEFT, y)
  y += 8

  signers.forEach((signer, i) => {
    const x = i % 2 === 0 ? MARGIN_LEFT : MARGIN_LEFT + sigWidth + 15
    const top = y + Math.floor(i / 2) * 48
    doc.setDrawColor(27, 43, 75)
    doc.setLineWidth(0.4)
    doc.line(x, top + 15, x + sigWidth, top + 15)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 90, 110)
    doc.text(signer.label, x, top + 20)
    doc.text(doc.splitTextToSize(signer.name || s.placeholder, sigWidth), x, top + 25)
    doc.line(x, top + 35, x + sigWidth, top + 35)
    doc.text(s.sigPlaceDate, x, top + 40)
  })
  y += rows * 48 + 2

  // ─── WITNESSES (optional) ───
  if (y < 250) {
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(130, 140, 155)
    doc.text(s.witnessHeader, MARGIN_LEFT, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setLineWidth(0.3)
    doc.setDrawColor(180, 190, 200)

    const sigX2 = MARGIN_LEFT + sigWidth + 15
    doc.line(MARGIN_LEFT, y + 8, MARGIN_LEFT + sigWidth, y + 8)
    doc.setFontSize(8)
    doc.text(s.witness1, MARGIN_LEFT, y + 13)

    doc.line(sigX2, y + 8, sigX2 + sigWidth, y + 8)
    doc.text(s.witness2, sigX2, y + 13)
  }

  // Registrera språket för varje sida som den här versionen upptar.
  for (let p = firstPage; p <= doc.getNumberOfPages(); p++) {
    pageLangs[p - 1] = lang
  }
}

/* ─── FRAMTIDSFULLMAKT ─────────────────────────────────────────────────── */

/** Lägsta y-position för innehåll; sidfoten ligger på 280–285. */
const FF_BOTTOM = 268

const FF_TEXT = {
  title: 'FRAMTIDSFULLMAKT',
  subtitle: 'enligt lagen (2017:310) om framtidsfullmakter',
  mutual: (i: number, total: number) => `Ömsesidig framtidsfullmakt – dokument ${i} av ${total}`,
  grant: (g: FramtidsfullmaktPerson, h: FramtidsfullmaktPerson) =>
    `Jag, ${g.namn} (${g.personnummer}), ger härmed ${h.namn} (${h.personnummer}) framtidsfullmakt enligt lagen (2017:310) om framtidsfullmakter att företräda mig i de angelägenheter som anges nedan.`,
  substitute: (h: FramtidsfullmaktPerson, e: FramtidsfullmaktPerson) =>
    `Om ${h.namn} avlider eller av annat skäl inte kan eller vill fullgöra uppdraget, ska ${e.namn}${e.personnummer ? ` (${e.personnummer})` : ''} vara fullmaktshavare i dennes ställe.`,
  // 1 § – lagens ordalydelse.
  condition:
    'Framtidsfullmakten gäller för det fall jag på grund av sjukdom, psykisk störning, försvagat hälsotillstånd eller något liknande förhållande varaktigt och i huvudsak inte längre har förmåga att ha hand om de angelägenheter som fullmakten avser.',
  // 9 § andra stycket.
  assessHolder:
    'Det är fullmaktshavaren som bedömer om framtidsfullmakten har trätt i kraft. Fullmaktshavaren kan begära att tingsrätten prövar frågan.',
  assessCourt: 'Frågan om framtidsfullmakten har trätt i kraft ska prövas av tingsrätten.',
  // 2 § andra stycket.
  scopeLimit:
    'Fullmakten omfattar inte åtgärder som avses i 2 kap. 1 § första stycket hälso- och sjukvårdslagen (2017:30) eller 1 § tandvårdslagen (1985:125), och inte frågor av utpräglat personlig karaktär (2 § lagen om framtidsfullmakter).',
  realEstate: 'Fast egendom och bostadsrätter:',
  // 18 §.
  giftsDefault:
    'Fullmakten reglerar inte gåvor. Fullmaktshavaren får därmed, till andra än sig själv, lämna personliga presenter vars värde inte står i missförhållande till mina ekonomiska villkor (18 §).',
  // 19 §.
  feeNone: 'Fullmaktshavaren har inte rätt till arvode (19 §).',
  feeReasonable:
    'Fullmaktshavaren har rätt till ett med hänsyn till uppdragets art och omfattning skäligt arvode (19 §).',
  // 23 § och 8 § andra stycket.
  reviewer: (r: FramtidsfullmaktPerson) =>
    `Jag utser ${r.namn}${r.personnummer ? ` (${r.personnummer})` : ''} att granska fullmaktshavarens verksamhet. Fullmaktshavaren ska på granskarens begäran lämna redovisning för sitt uppdrag (23 §).`,
  reviewerRevoke: 'Granskaren har rätt att återkalla framtidsfullmakten (8 § andra stycket).',
  // 6, 7, 8 och 10 §§ samt avtalslagen 16 §.
  legal:
    'Framtidsfullmakten är upprättad enligt lagen (2017:310) om framtidsfullmakter. Den kan inte göras oåterkallelig (6 §). För återkallelse gäller lagen (1915:218) om avtal och andra rättshandlingar på förmögenhetsrättens område (8 §): en skriftlig fullmakt som lämnats till fullmaktshavaren återkallas genom att fullmaktsgivaren tar tillbaka eller förstör handlingen (avtalslagen 16 §). Tillägg och andra ändringar kräver samma form som när fullmakten upprättades, utom när ändringen enbart består i en begränsning av fullmakten (7 §). När fullmaktshavaren bedömer att fullmakten har trätt i kraft ska han eller hon snarast underrätta fullmaktsgivaren, dennes make eller sambo och närmaste släktingar samt en eventuell granskare om det och om vad fullmakten innehåller (10 §).',
  // 4 § och ärvdabalken 10 kap. 2 § första stycket.
  attestation: (g: FramtidsfullmaktPerson) =>
    `Vi intygar att ${g.namn} i vår samtidiga närvaro har skrivit under denna handling eller intygat att han eller hon har skrivit under den, och att vi känner till att handlingen är en framtidsfullmakt. Fullmaktsgivaren var vid undertecknandet vid sunt och fullt förstånd och handlade av fri vilja.`,
  // 4 § tredje stycket och ärvdabalken 10 kap. 4 § första stycket.
  witnessRules:
    'Får inte vara vittne: fullmaktshavaren (4 § lagen om framtidsfullmakter); den som är under 15 år eller på grund av en psykisk störning saknar insikt om betydelsen av vittnesbekräftelsen; fullmaktsgivarens make, sambo eller syskon, eller den som står i rätt upp- eller nedstigande släktskap eller svågerlag till fullmaktsgivaren (10 kap. 4 § första stycket ärvdabalken). Välj helst vittnen utan koppling till någon av parterna.',
}

function renderFramtidsfullmakt(doc: jsPDF, ff: FramtidsfullmaktData, pageLangs: PdfLang[]): void {
  const total = ff.dokument.length
  ff.dokument.forEach((d, i) => {
    if (i > 0) doc.addPage()
    renderFramtidsfullmaktDokument(doc, ff, d, i + 1, total)
  })
  for (let p = 1; p <= doc.getNumberOfPages(); p++) pageLangs[p - 1] = 'sv'
}

function renderFramtidsfullmaktDokument(
  doc: jsPDF,
  ff: FramtidsfullmaktData,
  d: FramtidsfullmaktDokument,
  index: number,
  total: number,
): void {
  const s = STRINGS.sv
  const T = FF_TEXT
  let y = 0

  const newPage = () => {
    doc.addPage()
    y = 25
  }
  const ensure = (needed: number) => {
    if (y + needed > FF_BOTTOM) newPage()
  }
  /** Radbruten text som bryter sida rad för rad – aldrig utanför sidan. */
  const para = (
    text: string,
    opts: { size?: number; style?: 'normal' | 'bold' | 'italic'; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const size = opts.size ?? 10
    const lineH = size * 0.5
    const [r, g, b] = opts.color ?? [40, 45, 60]
    doc.setFont('helvetica', opts.style ?? 'normal')
    doc.setFontSize(size)
    doc.setTextColor(r, g, b)
    const lines: string[] = doc.splitTextToSize(text, CONTENT_WIDTH)
    for (const line of lines) {
      if (y + lineH > FF_BOTTOM) {
        newPage()
        doc.setFont('helvetica', opts.style ?? 'normal')
        doc.setFontSize(size)
        doc.setTextColor(r, g, b)
      }
      doc.text(line, MARGIN_LEFT, y)
      y += lineH
    }
    y += opts.gap ?? 3
  }
  const heading = (title: string) => {
    ensure(18) // rubrik + minst två rader text
    y = drawSectionHeader(doc, title, MARGIN_LEFT, y) + 1
  }
  const personBox = (title: string, p: FramtidsfullmaktPerson) => {
    const rows: [string, string][] = [
      ['Namn:', p.namn],
      ['Personnummer:', p.personnummer],
    ]
    if (p.relation?.trim()) rows.push(['Relation:', p.relation])
    if (p.adress?.trim()) rows.push(['Adress:', p.adress])
    const h = rows.length * 7 + 4
    ensure(h + 10)
    y = drawSectionHeader(doc, title, MARGIN_LEFT, y) + 2
    doc.setFillColor(248, 249, 251)
    doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, h, 2, 2, 'F')
    y += 6
    for (const [label, value] of rows) y = drawField(doc, label, value, MARGIN_LEFT + 5, y, s)
    y += 5
  }
  const signLine = (x: number, width: number, label: string, value?: string) => {
    doc.setDrawColor(27, 43, 75)
    doc.setLineWidth(0.3)
    doc.line(x, y, x + width, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 110, 125)
    doc.text(label, x, y + 3.5)
    if (value) {
      doc.setFontSize(9)
      doc.setTextColor(30, 35, 50)
      doc.text(value, x, y - 1.5)
    }
  }

  // ─── Sidhuvud ───
  doc.setFillColor(27, 43, 75)
  doc.rect(0, 0, PAGE_WIDTH, 18, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(232, 160, 32)
  doc.text('Fullmakt24.se', MARGIN_LEFT, 11)

  y = 34
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(27, 43, 75)
  doc.text(T.title, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(80, 90, 110)
  doc.text(T.subtitle, PAGE_WIDTH / 2, y, { align: 'center' })
  if (total > 1) {
    y += 5.5
    doc.setFontSize(9)
    doc.setTextColor(140, 150, 165)
    doc.text(T.mutual(index, total), PAGE_WIDTH / 2, y, { align: 'center' })
  }
  y += 7
  doc.setDrawColor(27, 43, 75)
  doc.setLineWidth(0.5)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  y += 9

  // ─── Parter (5 § 2) ───
  personBox(s.headings.givare, d.givare)
  personBox(s.headings.havare, d.havare)
  if (ff.ersattare?.namn?.trim()) personBox('ERSÄTTARE FÖR FULLMAKTSHAVAREN', ff.ersattare)

  // ─── Förordnande (5 § 1) ───
  heading('FÖRORDNANDE')
  para(T.grant(d.givare, d.havare))
  if (ff.ersattare?.namn?.trim()) para(T.substitute(d.havare, ff.ersattare))

  // ─── När fullmakten gäller (1 och 9 §§) ───
  heading('NÄR FULLMAKTEN GÄLLER')
  para(T.condition)
  para(ff.domstolsprovning ? T.assessCourt : T.assessHolder)

  // ─── Angelägenheter (2 § och 5 § 3) ───
  heading('ANGELÄGENHETER SOM FULLMAKTEN OMFATTAR')
  para(ff.angelagenheter.trim())
  if (ff.fastEgendom?.trim()) {
    para(T.realEstate, { style: 'bold', size: 9, gap: 1 })
    para(ff.fastEgendom.trim())
  }
  para(T.scopeLimit, { size: 8.5, style: 'italic', color: [90, 100, 115] })

  // ─── Övriga villkor (5 § 4) ───
  heading('ÖVRIGA VILLKOR')
  para('Gåvor', { style: 'bold', size: 9, gap: 1 })
  para(ff.gavor?.trim() || T.giftsDefault)
  para('Arvode', { style: 'bold', size: 9, gap: 1 })
  para(ff.arvode === 'skäligt' ? T.feeReasonable : T.feeNone)
  if (ff.granskare?.namn?.trim()) {
    para('Granskare', { style: 'bold', size: 9, gap: 1 })
    para(T.reviewer(ff.granskare) + (ff.granskareFarAterkalla ? ` ${T.reviewerRevoke}` : ''))
  }
  if (ff.ovrigaVillkor?.trim()) {
    para('Övrigt', { style: 'bold', size: 9, gap: 1 })
    para(ff.ovrigaVillkor.trim())
  }

  // ─── Lagstadgade upplysningar ───
  ensure(14)
  doc.setDrawColor(200, 205, 215)
  doc.setLineWidth(0.3)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  y += 5
  para(T.legal, { size: 8, style: 'italic', color: [110, 120, 135], gap: 5 })

  // ─── Underskrift och bevittning hålls samman på samma sida ───
  // Vittnena intygar fullmaktsgivarens underskrift, så båda ska stå på samma
  // sida. Blocket flyttas i sin helhet till en ny sida om det inte får plats.
  const half = (CONTENT_WIDTH - 15) / 2
  const col2 = MARGIN_LEFT + half + 15
  doc.setFontSize(10)
  const attLines = doc.splitTextToSize(T.attestation(d.givare), CONTENT_WIDTH).length
  doc.setFontSize(7.5)
  const ruleLines = doc.splitTextToSize(T.witnessRules, CONTENT_WIDTH).length
  const signBlock = 7 + 12 + 14 + 10
  const witnessBlock = 7 + attLines * 5 + 3 + 9 + 12 + 11 + 5 * 11 + 2 + ruleLines * 3.75
  ensure(signBlock + witnessBlock)

  // ─── Fullmaktsgivarens underskrift ───
  heading('FULLMAKTSGIVARENS UNDERSKRIFT')
  y += 12
  signLine(MARGIN_LEFT, half, 'Ort och datum')
  signLine(col2, half, 'Namnteckning')
  y += 14
  signLine(MARGIN_LEFT, half, 'Namnförtydligande', d.givare.namn)
  y += 10

  // ─── Bevittning (4 § – obligatorisk, skrivs alltid ut) ───
  ensure(witnessBlock)
  heading('BEVITTNING')
  para(T.attestation(d.givare))
  y += 9
  signLine(MARGIN_LEFT, CONTENT_WIDTH, 'Ort och datum för bevittningen')
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(27, 43, 75)
  doc.text('Vittne 1', MARGIN_LEFT, y)
  doc.text('Vittne 2', col2, y)
  y += 11
  for (const label of ['Namnteckning', 'Namnförtydligande', 'Personnummer', 'Yrke', 'Adress (hemvist)']) {
    signLine(MARGIN_LEFT, half, label)
    signLine(col2, half, label)
    y += 11
  }
  y += 1
  para(T.witnessRules, { size: 7.5, color: [90, 100, 115], gap: 0 })
}

/** Bryter till ny sida om innehållet inte får plats. Returnerar ny y-position. */
function pageBreakIfNeeded(
  doc: jsPDF,
  y: number,
  needed: number,
  pageLangs: PdfLang[],
  lang: PdfLang,
): number {
  if (y + needed > 265) {
    doc.addPage()
    pageLangs[doc.getNumberOfPages() - 1] = lang
    return 25
  }
  return y
}

function drawFooters(doc: jsPDF, pageLangs: PdfLang[]): void {
  const total = doc.getNumberOfPages()
  const footerY = 285

  for (let p = 1; p <= total; p++) {
    const s = STRINGS[pageLangs[p - 1] || 'sv']
    doc.setPage(p)
    doc.setDrawColor(220, 225, 230)
    doc.setLineWidth(0.2)
    doc.line(MARGIN_LEFT, footerY - 5, PAGE_WIDTH - MARGIN_RIGHT, footerY - 5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(160, 168, 180)
    doc.text(s.footer(todayFormatted(pageLangs[p - 1] || 'sv')), MARGIN_LEFT, footerY)
    doc.text(s.pageOf(p, total), PAGE_WIDTH - MARGIN_RIGHT, footerY, { align: 'right' })
  }
}

function drawWatermarks(doc: jsPDF, pageLangs: PdfLang[]): void {
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    const s = STRINGS[pageLangs[p - 1] || 'sv']
    doc.setPage(p)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(50)
    doc.setTextColor(200, 200, 200)
    const gstate015 = new (doc as unknown as { GState: new (o: object) => object }).GState({ opacity: 0.15 })
    doc.setGState(gstate015)

    doc.text(s.watermark, PAGE_WIDTH / 2, 150, {
      align: 'center',
      angle: 45,
    })

    const gstate1 = new (doc as unknown as { GState: new (o: object) => object }).GState({ opacity: 1 })
    doc.setGState(gstate1)
  }
}

function drawSectionHeader(doc: jsPDF, title: string, x: number, y: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(27, 43, 75)
  doc.text(title, x, y)

  // Small gold underline
  const textWidth = doc.getTextWidth(title)
  doc.setDrawColor(232, 160, 32)
  doc.setLineWidth(0.8)
  doc.line(x, y + 1.5, x + textWidth, y + 1.5)

  return y + 6
}

/** En rad "etikett värde" utan radbrytning. Används av framtidsfullmaktens personrutor. */
function drawField(doc: jsPDF, label: string, value: string, x: number, y: number, s: Strings): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(120, 130, 145)
  doc.text(label, x, y)

  const labelWidth = doc.getTextWidth(label) + 2
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(30, 35, 50)
  doc.text(value || s.placeholder, x + labelWidth, y)

  return y + 7
}

/* ─── Avsnitt och löptext utifrån fältens roller ───────────────────────── */

/** Avsnitt före uppdragsrutan, i den ordning de skrivs ut. */
const LEADING_ROLES: PdfRole[] = ['givare', 'vardnadshavare', 'barn', 'avliden', 'havare', 'ersattare', 'forening', 'djur', 'resa', 'objekt']
/** Avsnitt efter uppdragsrutan. */
const TRAILING_ROLES: PdfRole[] = ['giltighet', 'begransning', 'ovrigt']
/** Partsavsnitt visar även tomma fält, med en linje att fylla i för hand. */
const PARTY_ROLES = new Set<PdfRole>(['givare', 'vardnadshavare', 'havare', 'ersattare'])

const filled = (f: PdfField) => !!f.value?.trim() && f.type !== 'checkbox'

function labelFor(f: PdfField, lang: PdfLang): string {
  return lang === 'en' && f.labelEn ? f.labelEn : f.label
}

function displayValue(f: PdfField, lang: PdfLang): string {
  return f.type === 'date' ? formatDate(f.value, lang) : f.value.trim()
}

interface Person { namn: string; pnr: string; hasPnr: boolean; undertecknare: string }

/** Personerna i en roll (person 1 och 2), med namn, personnummer och undertecknare. */
function persons(data: PdfData, role: PdfRole): Person[] {
  const byIndex = new Map<number, Person>()
  for (const f of data.fields) {
    if (f.role !== role || !f.key) continue
    const p = byIndex.get(f.person || 1) || { namn: '', pnr: '', hasPnr: false, undertecknare: '' }
    if (f.key === 'namn') p.namn = f.value.trim()
    if (f.key === 'pnr') { p.pnr = f.value.trim(); p.hasPnr = f.required !== false || !!p.pnr }
    if (f.key === 'undertecknare') p.undertecknare = f.value.trim()
    byIndex.set(f.person || 1, p)
  }
  // Person 2 är valfri (t.ex. vårdnadshavare 2) och tas bara med om den fyllts i.
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .filter(([i, p]) => i === 1 || p.namn || p.pnr)
    .map(([, p]) => p)
}

/** Fullmaktsgivarens roll: givare, annars vårdnadshavare. */
function principalRole(data: PdfData): 'givare' | 'vardnadshavare' {
  return data.fields.some(f => f.role === 'givare' && f.key === 'namn') ? 'givare' : 'vardnadshavare'
}

function personText(p: Person, s: Strings): string {
  const name = p.namn || s.placeholder
  if (!p.hasPnr) return name
  return `${name} (${p.pnr || '________________'})`
}

function principalSigners(data: PdfData, lang: PdfLang): { label: string; name: string }[] {
  const s = STRINGS[lang]
  const role = principalRole(data)
  return persons(data, role).map(p => ({
    label: s.sigLabels[role],
    name: p.undertecknare ? `${p.namn || s.placeholder}, ${p.undertecknare}` : p.namn,
  }))
}

function buildMandateText(data: PdfData, lang: PdfLang): string {
  const s = STRINGS[lang]
  const principals = persons(data, principalRole(data))
  const agents = persons(data, 'havare')
  const company = principals.some(p => p.undertecknare)

  const principalText = company
    ? principals.map(p => s.companyBy(personText(p, s), p.undertecknare)).join(s.and)
    : principals.map(p => personText(p, s)).join(s.and)
  const plural = principals.length > 1

  let text = agents.length > 0
    ? s.intro({ principal: principalText, agent: agents.map(p => personText(p, s)).join(s.and), plural, company })
    : s.consentIntro(principalText, plural)

  // Uppdraget: mallens uppdragsfält, annars mallens uppdragstext. Kundens egen
  // text skrivs alltid oförändrad och översätts aldrig.
  const uppdrag = data.fields.filter(f => f.role === 'uppdrag' && filled(f))
  if (uppdrag.length === 1) text += `\n\n${displayValue(uppdrag[0], lang)}`
  else if (uppdrag.length > 1) text += `\n\n${uppdrag.map(f => `${labelFor(f, lang)}: ${displayValue(f, lang)}`).join('\n')}`
  else if (lang === 'sv' && data.uppdragText) text += `\n\n${data.uppdragText}`
  else if (!(lang === 'en' ? data.en?.standardText : data.standardText)) text += `\n\n${s.genericScope}`

  const standardText = lang === 'en' ? data.en?.standardText : data.standardText
  if (standardText) text += `\n\n${standardText}`

  if (agents.length > 0) text += `\n\n${s.mandateClosing}`
  return text
}

/** Ett avsnitt med fälten i en roll. Returnerar ny y-position. */
function drawRoleSection(doc: jsPDF, data: PdfData, role: PdfRole, lang: PdfLang, y: number, pageLangs: PdfLang[]): number {
  const s = STRINGS[lang]
  const inRole = data.fields.filter(f => f.role === role && f.type !== 'checkbox')
  const shown = PARTY_ROLES.has(role) ? inRole : inRole.filter(filled)
  if (shown.length === 0) return y

  // Giltig från/till skrivs som en mening, övriga fält som etikett: värde.
  const lines: { label: string; value: string }[] = []
  let sentence = ''
  if (role === 'giltighet') {
    const from = shown.find(f => f.id === 'giltig_fran')
    const to = shown.find(f => f.id === 'giltig_till')
    if (from && to) sentence = s.validity(displayValue(from, lang), displayValue(to, lang))
    for (const f of shown) if (!(sentence && (f === from || f === to))) lines.push({ label: `${labelFor(f, lang)}:`, value: displayValue(f, lang) })
  } else {
    for (const f of shown) lines.push({ label: `${labelFor(f, lang)}:`, value: filled(f) ? displayValue(f, lang) : s.placeholder })
  }

  // Mät raderna: värdet bryts inom bredden till höger om etiketten, eller på
  // en egen rad under etiketten när etiketten är lång.
  const innerX = MARGIN_LEFT + 5
  const innerW = CONTENT_WIDTH - 10
  const measured = lines.map(l => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    const labelW = doc.getTextWidth(l.label) + 2
    const below = labelW > innerW * 0.45
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const valueLines: string[] = doc.splitTextToSize(l.value, below ? innerW : innerW - labelW)
    return { ...l, labelW, below, valueLines, height: (below ? 5 : 0) + valueLines.length * 5 + 2 }
  })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const sentenceLines: string[] = sentence ? doc.splitTextToSize(sentence, innerW) : []
  const boxH = 5 + sentenceLines.length * 5 + measured.reduce((h, m) => h + m.height, 0) + 2

  y = pageBreakIfNeeded(doc, y, boxH + 10, pageLangs, lang)
  y = drawSectionHeader(doc, s.headings[role], MARGIN_LEFT, y)
  y += 2
  doc.setFillColor(248, 249, 251)
  doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, boxH, 2, 2, 'F')
  y += 6

  if (sentenceLines.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(30, 35, 50)
    doc.text(sentenceLines, innerX, y)
    y += sentenceLines.length * 5 + 2
  }
  for (const m of measured) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(120, 130, 145)
    doc.text(m.label, innerX, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(30, 35, 50)
    if (m.below) {
      doc.text(m.valueLines, innerX, y + 5)
    } else {
      doc.text(m.valueLines, innerX + m.labelW, y)
    }
    y += m.height
  }
  return y + 8
}

export function downloadPdf(data: PdfData, filename?: string) {
  const doc = generatePdf(data)
  const name = filename || `fullmakt-${Date.now()}.pdf`
  doc.save(name)
}
