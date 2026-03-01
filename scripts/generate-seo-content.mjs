#!/usr/bin/env node

/**
 * MaxiAI SEO Content Generator for Fullmakt24.se
 * 
 * Usage:
 *   node scripts/generate-seo-content.mjs [--all] [--slug=fullmakt-bank] [--category=ekonomi-myndigheter]
 * 
 * This script generates the template data that MaxiAI uses to create content.
 * MaxiAI calls this to get the list of templates needing content, then
 * generates JSON files in /content/mallar/
 */

import fs from 'fs'
import path from 'path'

// Template data extracted from the app
const categories = [
  { slug: 'foraldrar-barn', name: 'Föräldrar & Barn' },
  { slug: 'resa-transport', name: 'Resa & Transport' },
  { slug: 'vard-omsorg', name: 'Vård & Omsorg' },
  { slug: 'ekonomi-myndigheter', name: 'Ekonomi, Bank & Myndigheter' },
  { slug: 'boende-vardag', name: 'Boende & Vardag' },
  { slug: 'forening-skola', name: 'Förening, Skola & Fritid' },
  { slug: 'djur-husdjur', name: 'Djur & Husdjur' },
  { slug: 'seniorer-omsorg', name: 'Seniorer & Digital Omsorg' },
  { slug: 'digitalt-dodsbo', name: 'Digitalt & Dödsbo' },
]

// All 124 templates with their essential data
const allTemplates = [
  { id: 1, slug: 'foraldraredgivande-resa-annan-vuxen', name: 'Föräldramedgivande – resa med annan vuxen', categorySlug: 'foraldrar-barn', description: 'Medgivande för barn att resa med annan vuxen än vårdnadshavare.' },
  { id: 2, slug: 'reseintyg-barn-internationell', name: 'Reseintyg för barn – internationell resa', categorySlug: 'foraldrar-barn', description: 'Intyg som krävs vid internationella resor med barn.' },
  { id: 3, slug: 'resefullmakt-barn-eu', name: 'Resefullmakt för barn inom EU', categorySlug: 'foraldrar-barn', description: 'Fullmakt specifikt anpassad för resor inom EU med barn.' },
  { id: 4, slug: 'medgivande-skolresa', name: 'Medgivande vid skolresa', categorySlug: 'foraldrar-barn', description: 'Medgivande för barn att delta i skolresa.' },
  { id: 5, slug: 'medgivande-lager-kollo', name: 'Medgivande vid läger / kollo', categorySlug: 'foraldrar-barn', description: 'Medgivande för barn att delta i läger eller kolloverksamhet.' },
  { id: 6, slug: 'medgivande-foreningsresa', name: 'Medgivande vid föreningsresa', categorySlug: 'foraldrar-barn', description: 'Medgivande för barn att resa med förening eller lag.' },
  { id: 7, slug: 'medgivande-barn-bo-annan-vuxen', name: 'Medgivande för barn att bo hos annan vuxen', categorySlug: 'foraldrar-barn', description: 'Tillfälligt medgivande för barn att bo hos annan vuxen.' },
  { id: 8, slug: 'medgivande-ensam-resa-minderarig', name: 'Medgivande vid ensam resa för minderårig', categorySlug: 'foraldrar-barn', description: 'Medgivande för minderårig att resa ensam.' },
  { id: 9, slug: 'fullmakt-barns-sjukvard', name: 'Fullmakt för barnets sjukvård', categorySlug: 'foraldrar-barn', description: 'Fullmakt för annan vuxen att hantera barnets sjukvårdskontakter.' },
  { id: 10, slug: 'medgivande-akut-vard', name: 'Medgivande vid akut vård', categorySlug: 'foraldrar-barn', description: 'Akutmedgivande för vård av barn när vårdnadshavare ej är tillgänglig.' },
  { id: 11, slug: 'fullmakt-bonusforalder', name: 'Fullmakt till bonusförälder', categorySlug: 'foraldrar-barn', description: 'Fullmakt som ger bonusförälder rätt att agera för barnets räkning.' },
  { id: 12, slug: 'medgivande-passansokan', name: 'Medgivande för passansökan', categorySlug: 'foraldrar-barn', description: 'Medgivande från vårdnadshavare för passansökan åt barn.' },
  { id: 13, slug: 'medgivande-bankarenden-barn', name: 'Medgivande för bankärenden för barn', categorySlug: 'foraldrar-barn', description: 'Fullmakt för att hantera bankärenden för minderårig.' },
  { id: 14, slug: 'fullmakt-slakting-resa', name: 'Fullmakt till släkting vid resa', categorySlug: 'foraldrar-barn', description: 'Fullmakt till släkting för att resa med barn.' },
  { id: 15, slug: 'medgivande-overnattning-utomlands', name: 'Medgivande för övernattning utomlands', categorySlug: 'foraldrar-barn', description: 'Medgivande för barn att övernatta utomlands.' },
  { id: 16, slug: 'fullmakt-skolarenden', name: 'Fullmakt för skolärenden', categorySlug: 'foraldrar-barn', description: 'Fullmakt för annan person att hantera barnets skolärenden.' },
  { id: 17, slug: 'medgivande-byte-skola', name: 'Medgivande vid byte av skola', categorySlug: 'foraldrar-barn', description: 'Medgivande från bägge vårdnadshavare vid byte av skola.' },
  { id: 18, slug: 'intyg-gemensam-vardnad', name: 'Intyg om gemensam vårdnad', categorySlug: 'foraldrar-barn', description: 'Intyg som bekräftar gemensam vårdnad om barn.' },
  { id: 19, slug: 'intyg-ensam-vardnad', name: 'Intyg om ensam vårdnad', categorySlug: 'foraldrar-barn', description: 'Intyg som bekräftar ensam vårdnad om barn.' },
  { id: 20, slug: 'medgivande-idrottsstavling-utomlands', name: 'Medgivande vid idrottstävling utomlands', categorySlug: 'foraldrar-barn', description: 'Medgivande för barn att delta i idrottstävling utomlands.' },
  { id: 21, slug: 'fullmakt-hamta-ut-fordon', name: 'Fullmakt att hämta ut fordon', categorySlug: 'resa-transport', description: 'Fullmakt för att hämta ut annans fordon.' },
  { id: 22, slug: 'fullmakt-bilforsakring', name: 'Fullmakt för bilförsäkring', categorySlug: 'resa-transport', description: 'Fullmakt att teckna eller ändra bilförsäkring.' },
  { id: 23, slug: 'fullmakt-besiktning', name: 'Fullmakt för besiktning', categorySlug: 'resa-transport', description: 'Fullmakt att besikta annans fordon.' },
  { id: 24, slug: 'resefullmakt-vuxen', name: 'Resefullmakt för vuxen', categorySlug: 'resa-transport', description: 'Generell resefullmakt för vuxen person.' },
  { id: 25, slug: 'fullmakt-agarbyte-bil', name: 'Fullmakt för ägarbyte bil', categorySlug: 'resa-transport', description: 'Fullmakt att genomföra ägarbyte av motorfordon.' },
  { id: 26, slug: 'fullmakt-transportstyrelsen', name: 'Fullmakt för Transportstyrelsen', categorySlug: 'resa-transport', description: 'Fullmakt att företräda person hos Transportstyrelsen.' },
  { id: 27, slug: 'fullmakt-parkeringsbolag', name: 'Fullmakt gentemot parkeringsbolag', categorySlug: 'resa-transport', description: 'Fullmakt att överklaga eller hantera parkeringsärenden.' },
  { id: 28, slug: 'fullmakt-bilverkstad', name: 'Fullmakt för bilverkstad', categorySlug: 'resa-transport', description: 'Fullmakt att lämna in och hämta ut fordon från verkstad.' },
  { id: 29, slug: 'medgivande-hyrbil', name: 'Medgivande för hyrbil', categorySlug: 'resa-transport', description: 'Medgivande att hyra bil för annans räkning.' },
  { id: 30, slug: 'fullmakt-bat-registrering', name: 'Fullmakt för båtregistrering', categorySlug: 'resa-transport', description: 'Fullmakt att registrera eller avregistrera båt.' },
  { id: 31, slug: 'fullmakt-korkort-arende', name: 'Fullmakt för körkortsärende', categorySlug: 'resa-transport', description: 'Fullmakt att hantera körkortsärenden.' },
  { id: 32, slug: 'resefullmakt-grupp', name: 'Resefullmakt för grupp', categorySlug: 'resa-transport', description: 'Fullmakt för gruppresa.' },
  { id: 33, slug: 'fullmakt-tullarende', name: 'Fullmakt för tullärende', categorySlug: 'resa-transport', description: 'Fullmakt att hantera tullärenden.' },
  { id: 34, slug: 'fullmakt-flygbolag', name: 'Fullmakt gentemot flygbolag', categorySlug: 'resa-transport', description: 'Fullmakt att hantera bokning eller reklamation hos flygbolag.' },
  { id: 35, slug: 'medgivande-samakande', name: 'Medgivande för samåkande', categorySlug: 'resa-transport', description: 'Medgivande vid samåkning.' },
  { id: 36, slug: 'fullmakt-sjukvard', name: 'Fullmakt för sjukvård', categorySlug: 'vard-omsorg', description: 'Fullmakt att företräda i sjukvårdskontakter.' },
  { id: 37, slug: 'fullmakt-apotek', name: 'Fullmakt för apotek', categorySlug: 'vard-omsorg', description: 'Fullmakt att hämta ut recept.' },
  { id: 38, slug: 'fullmakt-hemtjanst', name: 'Fullmakt för hemtjänst', categorySlug: 'vard-omsorg', description: 'Fullmakt att ansöka om hemtjänst.' },
  { id: 39, slug: 'fullmakt-tandvard', name: 'Fullmakt för tandvård', categorySlug: 'vard-omsorg', description: 'Fullmakt för tandvårdsärenden.' },
  { id: 40, slug: 'fullmakt-aldrevard', name: 'Fullmakt för äldreomsorg', categorySlug: 'vard-omsorg', description: 'Fullmakt i omsorgsärenden.' },
  { id: 51, slug: 'fullmakt-bank', name: 'Fullmakt för bankärenden', categorySlug: 'ekonomi-myndigheter', description: 'Generell fullmakt för bankärenden.' },
  { id: 52, slug: 'fullmakt-skatteverket', name: 'Fullmakt för Skatteverket', categorySlug: 'ekonomi-myndigheter', description: 'Fullmakt att företräda hos Skatteverket.' },
  { id: 53, slug: 'fullmakt-deklaration', name: 'Fullmakt för deklaration', categorySlug: 'ekonomi-myndigheter', description: 'Fullmakt att lämna in deklaration.' },
  { id: 63, slug: 'generell-fullmakt', name: 'Generell fullmakt', categorySlug: 'ekonomi-myndigheter', description: 'Generell fullmakt utan begränsning.' },
  { id: 72, slug: 'fullmakt-bostadsforening', name: 'Fullmakt för bostadsförening', categorySlug: 'boende-vardag', description: 'Fullmakt för bostadsföreningsstämma.' },
  { id: 76, slug: 'fullmakt-paket-post', name: 'Fullmakt för paket och post', categorySlug: 'boende-vardag', description: 'Fullmakt att hämta ut paket och post.' },
  { id: 86, slug: 'fullmakt-foreningsstamma', name: 'Fullmakt för föreningsstämma', categorySlug: 'forening-skola', description: 'Fullmakt att rösta vid föreningsstämma.' },
  { id: 89, slug: 'medgivande-foto-film', name: 'Medgivande för foto och film', categorySlug: 'forening-skola', description: 'Medgivande att fotografera/filma barn.' },
  { id: 101, slug: 'fullmakt-veterinarbesok', name: 'Fullmakt för veterinärbesök', categorySlug: 'djur-husdjur', description: 'Fullmakt att ta djur till veterinär.' },
  { id: 109, slug: 'fullmakt-internetbank-senior', name: 'Fullmakt för internetbanksärenden (senior)', categorySlug: 'seniorer-omsorg', description: 'Fullmakt att hjälpa äldre med internetbank.' },
  { id: 117, slug: 'fullmakt-digital-dodsboforvaltning', name: 'Fullmakt för digital dödsboförvaltning', categorySlug: 'digitalt-dodsbo', description: 'Fullmakt att hantera dödsboets digitala tillgångar.' },
]

const contentDir = path.join(process.cwd(), 'content', 'mallar')

// Ensure directory exists
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}

function getExistingContent() {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'))
  return files.map(f => f.replace('.json', ''))
}

function getTemplatesNeedingContent() {
  const existing = getExistingContent()
  return allTemplates.filter(t => !existing.includes(t.slug))
}

function generatePromptForTemplate(template) {
  const category = categories.find(c => c.slug === template.categorySlug)
  const year = new Date().getFullYear()

  return `Generera SEO-innehåll för följande fullmaktsmall på Fullmakt24.se.

MALL-DATA:
- Namn: ${template.name}
- Slug: ${template.slug}
- Kategori: ${category?.name || ''}
- Kategori-slug: ${template.categorySlug}
- Beskrivning: ${template.description}
- År: ${year}

Följ instruktionerna i MAXIAI_SEO_PROMPT.md och returnera ENBART giltig JSON (inget annat).`
}

// Main
const args = process.argv.slice(2)
const mode = args.includes('--all') ? 'all' : args.find(a => a.startsWith('--slug=')) ? 'single' : 'missing'

if (mode === 'all') {
  console.log(`📝 Genererar prompter för alla ${allTemplates.length} mallar...`)
  allTemplates.forEach(t => {
    console.log(`\n--- ${t.name} (${t.slug}) ---`)
    console.log(generatePromptForTemplate(t))
  })
} else if (mode === 'single') {
  const slug = args.find(a => a.startsWith('--slug=')).replace('--slug=', '')
  const template = allTemplates.find(t => t.slug === slug)
  if (template) {
    console.log(generatePromptForTemplate(template))
  } else {
    console.error(`❌ Mall "${slug}" hittades inte`)
    process.exit(1)
  }
} else {
  const missing = getTemplatesNeedingContent()
  console.log(`📊 Status: ${allTemplates.length - missing.length}/${allTemplates.length} mallar har innehåll`)
  console.log(`📝 ${missing.length} mallar saknar SEO-innehåll\n`)

  // Output first 5 that need content
  const batch = missing.slice(0, 5)
  console.log(`🚀 Nästa batch (${batch.length} mallar):`)
  batch.forEach(t => {
    console.log(`  - ${t.name} (${t.slug})`)
  })

  console.log('\n--- PROMPTER FÖR DENNA BATCH ---\n')
  batch.forEach(t => {
    console.log(`\n=== ${t.slug} ===`)
    console.log(generatePromptForTemplate(t))
  })
}
