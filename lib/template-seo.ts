/**
 * SEO-metadata (title, metaDescription, h1) för mallsidorna.
 *
 * JSON-filerna i public/content/mallar läses via import() med en mall-literal
 * i stället för fs.readFileSync. Bundlern löser då alla filer i katalogen vid
 * build och lägger dem i serverbundlen, så de finns alltid i serverfunktionen
 * – oavsett hur Vercel spårar filer. Tidigare lästes filerna från disk vid
 * körning, men public/ följer inte med till serverfunktionen, så läsningen
 * misslyckades tyst och reservtiteln visades på alla mallsidor.
 */
export interface TemplateSeo {
  title?: string
  metaDescription?: string
  h1?: string
}

export interface TemplateContent {
  slug?: string
  seo?: TemplateSeo & { keywords?: string[] }
  content?: {
    introduction?: string
    legalValidity?: string
    howToGuide?: string
    commonMistakes?: string
    faq?: { question: string; answer: string }[]
  }
  internalLinks?: { text: string; href: string }[]
}

const SLUG_RE = /^[a-z0-9-]+$/

/** Hela mall-JSON:en (SEO-texter, FAQ, länkar), eller null om mallen saknar fil. */
export async function loadTemplateContent(slug: string): Promise<TemplateContent | null> {
  if (!SLUG_RE.test(slug)) return null
  try {
    const mod = await import(`../public/content/mallar/${slug}.json`)
    return (mod.default ?? mod) as TemplateContent
  } catch {
    // Ingen JSON-fil för mallen.
    return null
  }
}

export async function loadTemplateSeo(slug: string): Promise<TemplateSeo | null> {
  return (await loadTemplateContent(slug))?.seo ?? null
}
