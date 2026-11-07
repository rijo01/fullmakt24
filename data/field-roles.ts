// Uttrycklig roll för varje formulärfält. PDF-generatorn placerar ett värde
// enbart utifrån rollen – aldrig utifrån fält-id:t. Ett fält utan roll gör att
// malldatan inte laddas (se applyFieldRoles i templates.ts), så en ny mall kan
// inte tyst hamna fel i PDF:en.

/** Avsnittet i PDF:en som fältet skrivs ut i. */
export type FieldRole =
  | 'givare' // fullmaktsgivaren (person, företag, patient, ägare …)
  | 'vardnadshavare' // vårdnadshavare som ger fullmakt/medgivande för ett barn
  | 'havare' // fullmaktshavaren/ombudet
  | 'ersattare' // ersättare för fullmaktshavaren
  | 'barn' // barnet som handlingen gäller
  | 'avliden' // den avlidne
  | 'forening' // förening, skola eller annan organisation
  | 'djur' // djuret som handlingen gäller
  | 'resa' // resan: flyg, avgång, destination, period, mötande vuxen
  | 'objekt' // det handlingen avser: myndighet, bank, fordon, fastighet, tjänst …
  | 'uppdrag' // uppdragets innehåll – skrivs i uppdragsrutan
  | 'giltighet' // giltighetstid
  | 'begransning' // begränsningar och villkor (undantag, maxbelopp, lägsta pris)
  | 'ovrigt' // övriga uppgifter (nödkontakt, allergier …)

/**
 * Var värdet dessutom återges i löptext:
 * - namn: i uppdragsmeningen och under underskriftslinjen
 * - pnr: i uppdragsmeningen, inom parentes efter namnet
 * - undertecknare: den som skriver under för ett företag ("AB genom X")
 */
export type FieldKey = 'namn' | 'pnr' | 'undertecknare'

export interface FieldRoleSpec {
  role: FieldRole
  key?: FieldKey
  /** Vilken person i rollen fältet hör till, när rollen har två (vårdnadshavare 1 och 2). */
  person?: 1 | 2
}

const r = (role: FieldRole, key?: FieldKey, person?: 1 | 2): FieldRoleSpec => ({ role, key, person })

/** Roll per fält-id. Gäller alla mallar som inte överstyr fältet nedan. */
export const FIELD_ROLES: Record<string, FieldRoleSpec> = {
  // Fullmaktsgivare
  givare_namn: r('givare', 'namn'),
  givare_pnr: r('givare', 'pnr'),
  givare_adress: r('givare'),
  givare_epost: r('givare'),
  givare_telefon: r('givare'),
  fullmaktsgivare_namn: r('givare', 'namn'),
  fullmaktsgivare_pnr: r('givare', 'pnr'),
  fullmaktsgivare_adress: r('givare'),
  fullmaktsgivare_pass: r('givare'),
  utstallare_namn: r('givare', 'namn'),
  utstallare_pnr: r('givare', 'pnr'),
  agare_namn: r('givare', 'namn'),
  agare_pnr: r('givare', 'pnr'),
  patient_namn: r('givare', 'namn'),
  patient_pnr: r('givare', 'pnr'),
  patient_adress: r('givare'),
  kontoinnehavare_namn: r('givare', 'namn'),
  kontoinnehavare_pnr: r('givare', 'pnr'),
  kontoinnehavare_epost: r('givare'),
  foretag_namn: r('givare', 'namn'),
  orgnr: r('givare', 'pnr'),
  foretradare_namn: r('givare', 'undertecknare'),
  foretradare_pnr: r('givare'),
  foretradare_roll: r('givare'),
  lagenhet_nr: r('givare'),
  make1_namn: r('givare', 'namn'),
  make1_pnr: r('givare', 'pnr'),
  make1_adress: r('givare'),
  dodsbodelagare1_namn: r('givare', 'namn', 1),
  dodsbodelagare1_pnr: r('givare', 'pnr', 1),
  dodsbodelagare2_namn: r('givare', 'namn', 2),
  dodsbodelagare2_pnr: r('givare', 'pnr', 2),

  // Vårdnadshavare (fullmaktsgivare för barnet)
  vh1_namn: r('vardnadshavare', 'namn', 1),
  vh1_pnr: r('vardnadshavare', 'pnr', 1),
  vh2_namn: r('vardnadshavare', 'namn', 2),
  vh2_pnr: r('vardnadshavare', 'pnr', 2),
  vardnadshavare1_namn: r('vardnadshavare', 'namn', 1),
  vardnadshavare1_pnr: r('vardnadshavare', 'pnr', 1),
  vardnadshavare1_telefon: r('vardnadshavare', undefined, 1),
  vardnadshavare2_namn: r('vardnadshavare', 'namn', 2),
  vardnadshavare2_pnr: r('vardnadshavare', 'pnr', 2),

  // Fullmaktshavare
  havare_namn: r('havare', 'namn'),
  havare_pnr: r('havare', 'pnr'),
  havare_relation: r('havare'),
  havare_adress: r('havare'),
  ombud_namn: r('havare', 'namn'),
  ombud_pnr: r('havare', 'pnr'),
  ombud_relation: r('havare'),
  fullmaktshavare_namn: r('havare', 'namn'),
  fullmaktshavare_pnr: r('havare', 'pnr'),
  fullmaktshavare_relation: r('havare'),
  fullmaktshavare_adress: r('havare'),
  ansvarig_vuxen_namn: r('havare', 'namn'),
  ansvarig_vuxen_pnr: r('havare', 'pnr'),
  ansvarig_vuxen_relation: r('havare'),
  make2_namn: r('havare', 'namn'),
  make2_pnr: r('havare', 'pnr'),
  make2_adress: r('havare'),
  parrelation: r('havare'),

  // Ersättare
  ersattare_namn: r('ersattare', 'namn'),
  ersattare_pnr: r('ersattare', 'pnr'),

  // Barnet, den avlidne, föreningen, djuret
  barn_namn: r('barn'),
  barn_pnr: r('barn'),
  barn_personnummer: r('barn'),
  barn_foddatum: r('barn'),
  avliden_namn: r('avliden'),
  avliden_pnr: r('avliden'),
  dodsdatum: r('avliden'),
  forening: r('forening'),
  djur_namn: r('djur'),
  djur_art: r('djur'),

  // Resan
  flygbolag: r('resa'),
  avgangsplats: r('resa'),
  destination: r('resa'),
  motande_vuxen: r('resa'),
  period: r('resa'),

  // Det handlingen avser
  myndighet: r('objekt'),
  myndigheter: r('objekt'),
  tjanst: r('objekt'),
  vardgivare: r('objekt'),
  institution: r('objekt'),
  bank: r('objekt'),
  fastighet: r('objekt'),
  fastighetsbeteckning: r('objekt'),
  fastighet_adress: r('objekt'),
  lagenhet: r('objekt'),
  objekt: r('objekt'),
  regnr: r('objekt'),
  fordon_beskrivning: r('objekt'),
  fordonstyp: r('objekt'),
  land: r('objekt'),
  arbetsgivare: r('objekt'),
  forsakringsbolag: r('objekt'),
  forsakringsnummer: r('objekt'),
  forsakringstyp: r('objekt'),
  stamma_datum: r('objekt'),
  stammatyp: r('objekt'),
  arstal: r('objekt'),
  overlatelsetyp: r('objekt'),
  ny_hyresgast: r('objekt'),

  // Uppdraget
  syfte: r('uppdrag'),
  uppdrag: r('uppdrag'),
  befogenheter: r('uppdrag'),
  befoggenheter: r('uppdrag'),
  behandling: r('uppdrag'),
  andamal: r('uppdrag'),

  // Giltighet, begränsningar, övrigt
  giltig_fran: r('giltighet'),
  giltig_till: r('giltighet'),
  giltighetstid: r('giltighet'),
  begransningar: r('begransning'),
  undantag: r('begransning'),
  maxbelopp: r('begransning'),
  min_pris: r('begransning'),
  pris_min: r('begransning'),
  nodkontakt: r('ovrigt'),
  kanda_allergier: r('ovrigt'),

  // Framtidsfullmakt (lag 2017:310) har egen layout via lib/framtidsfullmakt-data.ts.
  fastigheter: r('uppdrag'),
  gavor: r('uppdrag'),
  arvode: r('uppdrag'),
  granskare_namn: r('ovrigt'),
  granskare_pnr: r('ovrigt'),
  granskare_aterkalla: r('ovrigt'),
  domstolsprovning: r('ovrigt'),
  ovriga_villkor: r('ovrigt'),
}

/** Mallar där ett fält-id har en annan roll än standard. Tom i dag. */
export const FIELD_ROLE_OVERRIDES: Record<string, Record<string, FieldRoleSpec>> = {}

export function fieldRoleFor(slug: string, fieldId: string): FieldRoleSpec | undefined {
  return FIELD_ROLE_OVERRIDES[slug]?.[fieldId] || FIELD_ROLES[fieldId]
}
