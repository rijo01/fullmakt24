import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/mina-dokument/'] },
    sitemap: 'https://fullmakt24.se/sitemap.xml',
  }
}
