// Sajtens kanoniska värd. All kod som bygger absoluta adresser (metadataBase,
// canonical, sitemap, robots, JSON-LD, Stripe-återkomstadresser) ska hämta
// adressen härifrån. www.fullmakt24.se omdirigeras med 308 i Vercels
// domäninställningar och ska aldrig förekomma i koden.
export const SITE_URL = 'https://fullmakt24.se'
