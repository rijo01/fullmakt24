import { templates, categories } from '@/data/templates'
import { blogPosts } from '@/data/blog'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fullmakt24.se'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/mallar`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/priser`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/om`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/kontakt`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blogg`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/fullmakt-salja-bostadsratt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/generalfullmakt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/framtidsfullmakt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blogg/${post.slug}`,
    lastModified: new Date(post.dateUpdated),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/mallar?category=${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // /skapa-sidorna, villkor, integritet, cookies och api-docs har noindex och
  // hör inte hemma i sitemapen.
  const templatePages: MetadataRoute.Sitemap = templates.map(t => ({
    url: `${baseUrl}/mallar/${t.categorySlug}/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticPages, ...categoryPages, ...templatePages, ...blogPages]
}
