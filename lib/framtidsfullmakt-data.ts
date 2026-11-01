import type { Template } from '@/data/templates'
import type { FramtidsfullmaktData, FramtidsfullmaktPerson } from '@/lib/pdf-generator'

/**
 * Översätter formulärdata för framtidsfullmakt-mallarna (id 125 och 149) till
 * PDF-generatorns format. Den ömsesidiga mallen ger två dokument – ett per
 * fullmaktsgivare – eftersom varje person måste ge sin egen framtidsfullmakt.
 */
export function buildFramtidsfullmaktData(
  t: Pick<Template, 'mutual'>,
  formData: Record<string, string | undefined>,
): FramtidsfullmaktData {
  const v = (id: string) => formData[id]?.trim() || ''
  const person = (prefix: string): FramtidsfullmaktPerson => ({
    namn: v(`${prefix}_namn`),
    personnummer: v(`${prefix}_pnr`),
    adress: v(`${prefix}_adress`),
  })

  let dokument: FramtidsfullmaktData['dokument']
  if (t.mutual) {
    const make1 = person('make1')
    const make2 = person('make2')
    const relation = v('parrelation') === 'Sambor' ? 'Sambo' : v('parrelation') === 'Makar' ? 'Make/maka' : ''
    dokument = [
      { givare: make1, havare: { ...make2, relation } },
      { givare: make2, havare: { ...make1, relation } },
    ]
  } else {
    dokument = [{
      givare: person('fullmaktsgivare'),
      havare: { ...person('fullmaktshavare'), relation: v('fullmaktshavare_relation') },
    }]
  }

  const granskareNamn = v('granskare_namn')
  return {
    dokument,
    ersattare: v('ersattare_namn') ? { namn: v('ersattare_namn'), personnummer: v('ersattare_pnr') } : undefined,
    angelagenheter: v('uppdrag'),
    fastEgendom: v('fastigheter'),
    gavor: v('gavor'),
    arvode: v('arvode') === 'Skäligt arvode' ? 'skäligt' : 'inget',
    granskare: granskareNamn ? { namn: granskareNamn, personnummer: v('granskare_pnr') } : undefined,
    granskareFarAterkalla: !!granskareNamn && formData.granskare_aterkalla === 'true',
    domstolsprovning: formData.domstolsprovning === 'true',
    ovrigaVillkor: v('ovriga_villkor'),
  }
}
