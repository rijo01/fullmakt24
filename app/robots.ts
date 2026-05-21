import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://fullmakt24.se/sitemap.xml',
    host: 'https://fullmakt24.se',
  }
}
