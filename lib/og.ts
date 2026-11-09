import type { Metadata } from 'next'

// Gemensamma Open Graph-fält. Next.js ersätter hela openGraph-objektet när en
// sida sätter ett eget, så sidor som behöver og:url bygger på det här.
// Ingen url här: då ärvde alla sidor startsidans og:url. og:url sätts bara
// på sidor som har en canonical och pekar då på samma adress.
export const baseOpenGraph = {
  type: 'website',
  locale: 'sv_SE',
  siteName: 'Fullmakt24.se',
  title: 'Fullmakt24.se – Din fullmakt klar på 3 minuter',
  description: 'Över 200 mallar för fullmakter och medgivanden, utformade enligt svensk avtalsrätt.',
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
} satisfies Metadata['openGraph']

// canonical och og:url till samma adress (relativ mot metadataBase).
export function canonicalWithOg(path: string): Pick<Metadata, 'alternates' | 'openGraph'> {
  return { alternates: { canonical: path }, openGraph: { ...baseOpenGraph, url: path } }
}
