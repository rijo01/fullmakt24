import jsPDF from 'jspdf'

interface PdfData {
  templateName: string
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
  watermark?: boolean
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '________________'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function generatePdf(data: PdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = 210
  const marginLeft = 25
  const marginRight = 25
  const contentWidth = pageWidth - marginLeft - marginRight
  let y = 25

  // ─── HEADER BAR ───
  doc.setFillColor(27, 43, 75) // navy-500
  doc.rect(0, 0, pageWidth, 18, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(232, 160, 32) // gold-500
  doc.text('Fullmakt24.se', marginLeft, 11)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(180, 190, 210)
  doc.text('Din fullmakt – klar på 3 minuter', pageWidth - marginRight, 11, { align: 'right' })

  y = 32

  // ─── DOCUMENT TITLE ───
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(27, 43, 75)
  doc.text('FULLMAKT', pageWidth / 2, y, { align: 'center' })
  y += 10

  // Subtitle / template name
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(80, 90, 110)
  doc.text(data.templateName, pageWidth / 2, y, { align: 'center' })
  y += 5

  // Category
  doc.setFontSize(9)
  doc.setTextColor(140, 150, 165)
  doc.text(`Kategori: ${data.categoryName}`, pageWidth / 2, y, { align: 'center' })
  y += 10

  // Separator line
  doc.setDrawColor(27, 43, 75)
  doc.setLineWidth(0.5)
  doc.line(marginLeft, y, pageWidth - marginRight, y)
  y += 10

  // ─── SECTION: FULLMAKTSGIVARE ───
  y = drawSectionHeader(doc, 'FULLMAKTSGIVARE', marginLeft, y)
  y += 2

  doc.setFillColor(248, 249, 251) // surface color
  doc.roundedRect(marginLeft, y, contentWidth, 32, 2, 2, 'F')
  y += 6

  y = drawField(doc, 'Namn:', data.givare.namn, marginLeft + 5, y, contentWidth - 10)
  y = drawField(doc, 'Personnummer:', data.givare.personnummer, marginLeft + 5, y, contentWidth - 10)
  y = drawField(doc, 'Adress:', data.givare.adress, marginLeft + 5, y, contentWidth - 10)
  if (data.givare.epost) {
    y = drawField(doc, 'E-post:', data.givare.epost, marginLeft + 5, y, contentWidth - 10)
  }
  if (data.givare.telefon) {
    y = drawField(doc, 'Telefon:', data.givare.telefon, marginLeft + 5, y, contentWidth - 10)
  }

  y += 8

  // ─── SECTION: FULLMAKTSHAVARE ───
  y = drawSectionHeader(doc, 'FULLMAKTSHAVARE', marginLeft, y)
  y += 2

  doc.setFillColor(248, 249, 251)
  doc.roundedRect(marginLeft, y, contentWidth, 26, 2, 2, 'F')
  y += 6

  y = drawField(doc, 'Namn:', data.havare.namn, marginLeft + 5, y, contentWidth - 10)
  y = drawField(doc, 'Personnummer/Org.nr:', data.havare.personnummer, marginLeft + 5, y, contentWidth - 10)
  y = drawField(doc, 'Relation:', data.havare.relation, marginLeft + 5, y, contentWidth - 10)
  if (data.havare.adress) {
    y = drawField(doc, 'Adress:', data.havare.adress, marginLeft + 5, y, contentWidth - 10)
  }

  y += 8

  // ─── SECTION: UPPDRAG ───
  y = drawSectionHeader(doc, 'UPPDRAG OCH BEFOGENHET', marginLeft, y)
  y += 2

  // Gold-tinted background for the mandate text
  doc.setFillColor(253, 245, 230) // gold-50
  const mandateText = buildMandateText(data)
  const splitMandate = doc.splitTextToSize(mandateText, contentWidth - 10)
  const mandateHeight = splitMandate.length * 5 + 10

  doc.roundedRect(marginLeft, y, contentWidth, mandateHeight, 2, 2, 'F')
  doc.setDrawColor(232, 160, 32)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginLeft, y, contentWidth, mandateHeight, 2, 2, 'S')

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(40, 45, 60)
  doc.text(splitMandate, marginLeft + 5, y)
  y += mandateHeight - 2

  y += 5

  // ─── GILTIGHETSTID ───
  if (data.detaljer.giltigFran || data.detaljer.giltigTill) {
    y = drawSectionHeader(doc, 'GILTIGHETSTID', marginLeft, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 45, 60)
    doc.text(`Denna fullmakt gäller från ${formatDate(data.detaljer.giltigFran)} till och med ${formatDate(data.detaljer.giltigTill)}.`, marginLeft, y)
    y += 10
  }

  // ─── BEGRÄNSNINGAR ───
  if (data.detaljer.begransningar) {
    y = drawSectionHeader(doc, 'BEGRÄNSNINGAR', marginLeft, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 45, 60)
    const splitBegr = doc.splitTextToSize(data.detaljer.begransningar, contentWidth)
    doc.text(splitBegr, marginLeft, y)
    y += splitBegr.length * 5 + 5
  }

  // ─── CHECK: PAGE BREAK IF NEEDED ───
  if (y > 230) {
    doc.addPage()
    y = 25
  }

  // ─── LEGAL NOTICE ───
  y += 5
  doc.setDrawColor(200, 205, 215)
  doc.setLineWidth(0.3)
  doc.line(marginLeft, y, pageWidth - marginRight, y)
  y += 8

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(130, 140, 155)
  const legalNote = 'Denna fullmakt är upprättad i enlighet med svensk avtalsrätt. Fullmakten kan återkallas när som helst genom skriftligt meddelande till fullmaktshavaren. Fullmaktsgivaren ansvarar för att fullmaktshavaren informeras om eventuella begränsningar.'
  const splitLegal = doc.splitTextToSize(legalNote, contentWidth)
  doc.text(splitLegal, marginLeft, y)
  y += splitLegal.length * 4 + 8

  // ─── SIGNATURES ───
  y = drawSectionHeader(doc, 'UNDERSKRIFTER', marginLeft, y)
  y += 8

  const sigWidth = (contentWidth - 15) / 2

  // Givare signature
  doc.setDrawColor(27, 43, 75)
  doc.setLineWidth(0.4)
  doc.line(marginLeft, y + 15, marginLeft + sigWidth, y + 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 90, 110)
  doc.text('Fullmaktsgivarens underskrift', marginLeft, y + 20)
  doc.text(data.givare.namn || '________________________________', marginLeft, y + 25)

  // Date
  doc.line(marginLeft, y + 35, marginLeft + sigWidth, y + 35)
  doc.text('Ort och datum', marginLeft, y + 40)

  // Havare signature
  const sigX2 = marginLeft + sigWidth + 15
  doc.line(sigX2, y + 15, sigX2 + sigWidth, y + 15)
  doc.text('Fullmaktstagarens underskrift', sigX2, y + 20)
  doc.text(data.havare.namn || '________________________________', sigX2, y + 25)

  doc.line(sigX2, y + 35, sigX2 + sigWidth, y + 35)
  doc.text('Ort och datum', sigX2, y + 40)

  y += 50

  // ─── WITNESSES (optional) ───
  if (y < 250) {
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(130, 140, 155)
    doc.text('VITTNEN (valfritt men rekommenderas)', marginLeft, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setLineWidth(0.3)
    doc.setDrawColor(180, 190, 200)

    // Witness 1
    doc.line(marginLeft, y + 8, marginLeft + sigWidth, y + 8)
    doc.setFontSize(8)
    doc.text('Vittne 1: Namn, personnummer och underskrift', marginLeft, y + 13)

    // Witness 2
    doc.line(sigX2, y + 8, sigX2 + sigWidth, y + 8)
    doc.text('Vittne 2: Namn, personnummer och underskrift', sigX2, y + 13)
  }

  // ─── FOOTER ───
  const footerY = 285
  doc.setDrawColor(220, 225, 230)
  doc.setLineWidth(0.2)
  doc.line(marginLeft, footerY - 5, pageWidth - marginRight, footerY - 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(160, 168, 180)
  doc.text(`Genererad via Fullmakt24.se • ${todayFormatted()}`, marginLeft, footerY)
  doc.text('Sida 1 av 1', pageWidth - marginRight, footerY, { align: 'right' })

  // ─── WATERMARK ───
  if (data.watermark) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(50)
    doc.setTextColor(200, 200, 200)
    const gstate015 = new (doc as any).GState({ opacity: 0.15 });
    doc.setGState(gstate015);

    // Diagonal watermark
    doc.text('FÖRHANDSGRANSKNING', pageWidth / 2, 150, {
      align: 'center',
      angle: 45,
    })

    // Reset opacity
    const gstate1 = new (doc as any).GState({ opacity: 1 });
    doc.setGState(gstate1);
  }

  return doc
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

function drawField(doc: jsPDF, label: string, value: string, x: number, y: number, _maxWidth: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(120, 130, 145)
  doc.text(label, x, y)

  const labelWidth = doc.getTextWidth(label) + 2
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(30, 35, 50)
  doc.text(value || '________________________________', x + labelWidth, y)

  return y + 7
}

function buildMandateText(data: PdfData): string {
  const givare = data.givare.namn || '[Fullmaktsgivarens namn]'
  const givarePnr = data.givare.personnummer || '[personnummer]'
  const havare = data.havare.namn || '[Fullmaktstagarens namn]'
  const havarePnr = data.havare.personnummer || '[personnummer]'
  const syfte = data.detaljer.syfte || '[uppdragsbeskrivning]'

  let text = `Härmed ger undertecknad ${givare} (${givarePnr}) fullmakt till ${havare} (${havarePnr}) `
  text += `att för min räkning och i mitt namn:\n\n`
  text += syfte

  if (data.detaljer.giltigFran && data.detaljer.giltigTill) {
    text += `\n\nDenna fullmakt gäller från och med ${formatDate(data.detaljer.giltigFran)} till och med ${formatDate(data.detaljer.giltigTill)}.`
  }

  text += `\n\nFullmaktshavaren har rätt att vidta alla åtgärder som krävs för att utföra ovanstående uppdrag.`

  return text
}

export function downloadPdf(data: PdfData, filename?: string) {
  const doc = generatePdf(data)
  const name = filename || `fullmakt-${Date.now()}.pdf`
  doc.save(name)
}
