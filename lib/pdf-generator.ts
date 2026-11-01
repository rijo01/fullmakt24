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

interface PdfData {
  templateName: string
  /** Dokumentrubrik, t.ex. FULLMAKT eller MEDGIVANDE. Standard: FULLMAKT. */
  documentTitle?: string
  categoryName: string
  givare: {
    namn: string
    personnummer: string
    adress: string
    epost?: string
    telefon?: string
  }
  havare: {
    namn: string
    personnummer: string
    relation: string
    adress?: string
  }
  detaljer: {
    giltigFran?: string
    giltigTill?: string
    syfte?: string
    begransningar?: string
    [key: string]: string | undefined
  }
  /** Mallens svenska standardklausul (skrivs efter användarens egen text). */
  standardText?: string
  /** Mallens juridiska notis på svenska. */
  legalInfo?: string
  /** Övriga ifyllda uppgifter, t.ex. barnets namn – etikett från mallen. */
  extraDetails?: { label: string; labelEn?: string; value: string }[]
  /** Lägg till engelsk översättning som extra sida/sidor i samma PDF. */
  bilingual?: boolean
  en?: PdfTranslation
  watermark?: boolean
  /**
   * Framtidsfullmakt enligt lag (2017:310). När den är satt renderas en egen
   * layout med lagstadgade formuleringar och obligatoriskt vittnesavsnitt –
   * fälten ovan (givare/havare/detaljer) används då inte.
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

interface Strings {
  tagline: string
  defaultTitle: string
  categoryLabel: string
  sectionGivare: string
  sectionHavare: string
  sectionExtra: string
  sectionUppdrag: string
  sectionGiltighet: string
  sectionBegransningar: string
  sectionUnderskrifter: string
  labelNamn: string
  labelPnr: string
  labelPnrHavare: string
  labelAdress: string
  labelEpost: string
  labelTelefon: string
  labelRelation: string
  validity: (from: string, to: string) => string
  mandateIntro: (givare: string, givarePnr: string, havare: string, havarePnr: string) => string
  mandateValidity: (from: string, to: string) => string
  mandateClosing: string
  legalNote: string
  sigGivare: string
  sigHavare: string
  sigPlaceDate: string
  witnessHeader: string
  witness1: string
  witness2: string
  footer: (date: string) => string
  pageOf: (page: number, total: number) => string
  placeholder: string
  purposePlaceholder: string
  givarePlaceholder: string
  havarePlaceholder: string
  pnrPlaceholder: string
  watermark: string
  translationNotice: string
}

const STRINGS: Record<PdfLang, Strings> = {
  sv: {
    tagline: 'Din fullmakt – klar på 3 minuter',
    defaultTitle: 'FULLMAKT',
    categoryLabel: 'Kategori: ',
    sectionGivare: 'FULLMAKTSGIVARE',
    sectionHavare: 'FULLMAKTSHAVARE',
    sectionExtra: 'ÖVRIGA UPPGIFTER',
    sectionUppdrag: 'UPPDRAG OCH BEFOGENHET',
    sectionGiltighet: 'GILTIGHETSTID',
    sectionBegransningar: 'BEGRÄNSNINGAR',
    sectionUnderskrifter: 'UNDERSKRIFTER',
    labelNamn: 'Namn:',
    labelPnr: 'Personnummer:',
    labelPnrHavare: 'Personnummer/Org.nr:',
    labelAdress: 'Adress:',
    labelEpost: 'E-post:',
    labelTelefon: 'Telefon:',
    labelRelation: 'Relation:',
    validity: (from, to) => `Denna handling gäller från ${from} till och med ${to}.`,
    mandateIntro: (givare, givarePnr, havare, havarePnr) =>
      `Härmed ger undertecknad ${givare} (${givarePnr}) fullmakt till ${havare} (${havarePnr}) att för min räkning och i mitt namn:`,
    mandateValidity: (from, to) =>
      `Denna handling gäller från och med ${from} till och med ${to}.`,
    mandateClosing:
      'Fullmaktshavaren har rätt att vidta alla åtgärder som krävs för att utföra ovanstående uppdrag.',
    legalNote:
      'Denna handling är upprättad i enlighet med svensk avtalsrätt. Den kan återkallas när som helst genom skriftligt meddelande till fullmaktshavaren. Fullmaktsgivaren ansvarar för att fullmaktshavaren informeras om eventuella begränsningar.',
    sigGivare: 'Fullmaktsgivare / Principal',
    sigHavare: 'Fullmaktshavare / Attorney-in-fact',
    sigPlaceDate: 'Ort och datum',
    witnessHeader: 'VITTNEN (valfritt men rekommenderas)',
    witness1: 'Vittne 1: Namn, personnummer och underskrift',
    witness2: 'Vittne 2: Namn, personnummer och underskrift',
    footer: date => `Genererad via Fullmakt24.se • ${date}`,
    pageOf: (page, total) => `Sida ${page} av ${total}`,
    placeholder: '________________________________',
    purposePlaceholder: '[uppdragsbeskrivning]',
    givarePlaceholder: '[Fullmaktsgivarens namn]',
    havarePlaceholder: '[Fullmaktshavarens namn]',
    pnrPlaceholder: '[personnummer]',
    watermark: 'FÖRHANDSGRANSKNING',
    translationNotice: '',
  },
  en: {
    tagline: 'Your document – ready in 3 minutes',
    defaultTitle: 'POWER OF ATTORNEY',
    categoryLabel: 'Category: ',
    sectionGivare: 'PRINCIPAL / GUARDIAN',
    sectionHavare: 'ATTORNEY-IN-FACT / AUTHORISED PERSON',
    sectionExtra: 'ADDITIONAL DETAILS',
    sectionUppdrag: 'AUTHORITY GRANTED',
    sectionGiltighet: 'PERIOD OF VALIDITY',
    sectionBegransningar: 'LIMITATIONS',
    sectionUnderskrifter: 'SIGNATURES',
    labelNamn: 'Name:',
    labelPnr: 'Personal identity no.:',
    labelPnrHavare: 'Personal identity no./Company reg. no.:',
    labelAdress: 'Address:',
    labelEpost: 'Email:',
    labelTelefon: 'Phone:',
    labelRelation: 'Relationship:',
    validity: (from, to) => `This document is valid from ${from} up to and including ${to}.`,
    mandateIntro: (givare, givarePnr, havare, havarePnr) =>
      `The undersigned, ${givare} (${givarePnr}), hereby authorises ${havare} (${havarePnr}) to act on my behalf and in my name in order to:`,
    mandateValidity: (from, to) =>
      `This document is valid from ${from} up to and including ${to}.`,
    mandateClosing:
      'The authorised person is entitled to take every measure required to carry out the assignment described above.',
    legalNote:
      'This document has been drawn up in accordance with Swedish contract law. It may be revoked at any time by written notice to the authorised person. The principal is responsible for informing the authorised person of any limitations. This English text is a translation provided for use abroad; the Swedish version is the original and prevails in the event of any discrepancy.',
    sigGivare: 'Fullmaktsgivare / Principal',
    sigHavare: 'Fullmaktshavare / Attorney-in-fact',
    sigPlaceDate: 'Place and date',
    witnessHeader: 'WITNESSES (optional but recommended)',
    witness1: 'Witness 1: name, identity number and signature',
    witness2: 'Witness 2: name, identity number and signature',
    footer: date => `Generated via Fullmakt24.se • ${date}`,
    pageOf: (page, total) => `Page ${page} of ${total}`,
    placeholder: '________________________________',
    purposePlaceholder: '[description of the assignment]',
    givarePlaceholder: '[name of the principal]',
    havarePlaceholder: '[name of the authorised person]',
    pnrPlaceholder: '[identity number]',
    watermark: 'PREVIEW',
    translationNotice:
      'English translation – for use abroad. The Swedish version is the original.',
  },
}

const LOCALE: Record<PdfLang, string> = { sv: 'sv-SE', en: 'en-GB' }

function formatDate(dateStr: string | undefined, lang: PdfLang): string {
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

  // ─── SECTION: FULLMAKTSGIVARE / PRINCIPAL ───
  y = drawSectionHeader(doc, s.sectionGivare, MARGIN_LEFT, y)
  y += 2

  doc.setFillColor(248, 249, 251) // surface color
  doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, 32, 2, 2, 'F')
  y += 6

  y = drawField(doc, s.labelNamn, data.givare.namn, MARGIN_LEFT + 5, y, s)
  y = drawField(doc, s.labelPnr, data.givare.personnummer, MARGIN_LEFT + 5, y, s)
  y = drawField(doc, s.labelAdress, data.givare.adress, MARGIN_LEFT + 5, y, s)
  if (data.givare.epost) {
    y = drawField(doc, s.labelEpost, data.givare.epost, MARGIN_LEFT + 5, y, s)
  }
  if (data.givare.telefon) {
    y = drawField(doc, s.labelTelefon, data.givare.telefon, MARGIN_LEFT + 5, y, s)
  }

  y += 8

  // ─── SECTION: FULLMAKTSHAVARE / ATTORNEY-IN-FACT ───
  y = drawSectionHeader(doc, s.sectionHavare, MARGIN_LEFT, y)
  y += 2

  doc.setFillColor(248, 249, 251)
  doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, 26, 2, 2, 'F')
  y += 6

  y = drawField(doc, s.labelNamn, data.havare.namn, MARGIN_LEFT + 5, y, s)
  y = drawField(doc, s.labelPnrHavare, data.havare.personnummer, MARGIN_LEFT + 5, y, s)
  y = drawField(doc, s.labelRelation, data.havare.relation, MARGIN_LEFT + 5, y, s)
  if (data.havare.adress) {
    y = drawField(doc, s.labelAdress, data.havare.adress, MARGIN_LEFT + 5, y, s)
  }

  y += 8

  // ─── SECTION: ÖVRIGA UPPGIFTER / ADDITIONAL DETAILS ───
  const extras = (data.extraDetails || []).filter(e => e.value?.trim())
  if (extras.length > 0) {
    y = pageBreakIfNeeded(doc, y, 20 + extras.length * 7, pageLangs, lang)
    y = drawSectionHeader(doc, s.sectionExtra, MARGIN_LEFT, y)
    y += 2

    doc.setFillColor(248, 249, 251)
    doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, extras.length * 7 + 5, 2, 2, 'F')
    y += 6

    for (const extra of extras) {
      const label = lang === 'en' ? extra.labelEn || extra.label : extra.label
      y = drawField(doc, `${label}:`, extra.value, MARGIN_LEFT + 5, y, s)
    }
    y += 5
  }

  // ─── SECTION: UPPDRAG / AUTHORITY GRANTED ───
  const mandateText = buildMandateText(data, lang)
  const splitMandate = doc.splitTextToSize(mandateText, CONTENT_WIDTH - 10)
  const mandateHeight = splitMandate.length * 5 + 10

  y = pageBreakIfNeeded(doc, y, mandateHeight + 12, pageLangs, lang)
  y = drawSectionHeader(doc, s.sectionUppdrag, MARGIN_LEFT, y)
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

  // ─── GILTIGHETSTID / PERIOD OF VALIDITY ───
  if (data.detaljer.giltigFran || data.detaljer.giltigTill) {
    y = pageBreakIfNeeded(doc, y, 20, pageLangs, lang)
    y = drawSectionHeader(doc, s.sectionGiltighet, MARGIN_LEFT, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 45, 60)
    const validity = s.validity(
      formatDate(data.detaljer.giltigFran, lang),
      formatDate(data.detaljer.giltigTill, lang),
    )
    const splitValidity = doc.splitTextToSize(validity, CONTENT_WIDTH)
    doc.text(splitValidity, MARGIN_LEFT, y)
    y += splitValidity.length * 5 + 5
  }

  // ─── BEGRÄNSNINGAR / LIMITATIONS ───
  // Användarens egen text skrivs oförändrad – den översätts aldrig.
  if (data.detaljer.begransningar) {
    const splitBegr = doc.splitTextToSize(data.detaljer.begransningar, CONTENT_WIDTH)
    y = pageBreakIfNeeded(doc, y, splitBegr.length * 5 + 15, pageLangs, lang)
    y = drawSectionHeader(doc, s.sectionBegransningar, MARGIN_LEFT, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 45, 60)
    doc.text(splitBegr, MARGIN_LEFT, y)
    y += splitBegr.length * 5 + 5
  }

  // ─── LEGAL NOTICE ───
  const legalNote = legalInfo ? `${s.legalNote} ${legalInfo}` : s.legalNote
  doc.setFontSize(8)
  const splitLegal = doc.splitTextToSize(legalNote, CONTENT_WIDTH)
  y = pageBreakIfNeeded(doc, y, splitLegal.length * 4 + 80, pageLangs, lang)

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
  y = drawSectionHeader(doc, s.sectionUnderskrifter, MARGIN_LEFT, y)
  y += 8

  const sigWidth = (CONTENT_WIDTH - 15) / 2
  const sigX2 = MARGIN_LEFT + sigWidth + 15

  // Signaturblocken är alltid tvåspråkiga så att en utländsk mottagare kan se
  // vem som är vem även på den svenska originalsidan.
  doc.setDrawColor(27, 43, 75)
  doc.setLineWidth(0.4)
  doc.line(MARGIN_LEFT, y + 15, MARGIN_LEFT + sigWidth, y + 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 90, 110)
  doc.text(s.sigGivare, MARGIN_LEFT, y + 20)
  doc.text(data.givare.namn || s.placeholder, MARGIN_LEFT, y + 25)

  doc.line(MARGIN_LEFT, y + 35, MARGIN_LEFT + sigWidth, y + 35)
  doc.text(s.sigPlaceDate, MARGIN_LEFT, y + 40)

  doc.line(sigX2, y + 15, sigX2 + sigWidth, y + 15)
  doc.text(s.sigHavare, sigX2, y + 20)
  doc.text(data.havare.namn || s.placeholder, sigX2, y + 25)

  doc.line(sigX2, y + 35, sigX2 + sigWidth, y + 35)
  doc.text(s.sigPlaceDate, sigX2, y + 40)

  y += 50

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
      [s.labelNamn, p.namn],
      [s.labelPnr, p.personnummer],
    ]
    if (p.relation?.trim()) rows.push([s.labelRelation, p.relation])
    if (p.adress?.trim()) rows.push([s.labelAdress, p.adress])
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
  personBox(s.sectionGivare, d.givare)
  personBox(s.sectionHavare, d.havare)
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

function buildMandateText(data: PdfData, lang: PdfLang): string {
  const s = STRINGS[lang]
  const standardText = lang === 'en' ? data.en?.standardText : data.standardText

  const givare = data.givare.namn || s.givarePlaceholder
  const givarePnr = data.givare.personnummer || s.pnrPlaceholder
  const havare = data.havare.namn || s.havarePlaceholder
  const havarePnr = data.havare.personnummer || s.pnrPlaceholder
  // Användarens egen uppdragsbeskrivning skrivs alltid oförändrad.
  const syfte = data.detaljer.syfte || s.purposePlaceholder

  let text = `${s.mandateIntro(givare, givarePnr, havare, havarePnr)}\n\n${syfte}`

  if (standardText) {
    text += `\n\n${standardText}`
  }

  if (data.detaljer.giltigFran && data.detaljer.giltigTill) {
    text += `\n\n${s.mandateValidity(
      formatDate(data.detaljer.giltigFran, lang),
      formatDate(data.detaljer.giltigTill, lang),
    )}`
  }

  text += `\n\n${s.mandateClosing}`

  return text
}

export function downloadPdf(data: PdfData, filename?: string) {
  const doc = generatePdf(data)
  const name = filename || `fullmakt-${Date.now()}.pdf`
  doc.save(name)
}
