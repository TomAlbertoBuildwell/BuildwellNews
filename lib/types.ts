export interface Article {
  id: string
  title: string
  excerpt: string
  content?: string
  category: string
  date: string
  readTime: string
  sourceId: string
  similarity: number
  relatedSources: string[]
  url: string
  imageUrl?: string
  scrapedAt: string
  summarizedAt?: string
  summary?: string
  featured?: boolean
  originalSources?: {
    sourceId: string
    url: string
    title: string
  }[]
}

export interface ScrapedContent {
  url: string
  title: string
  content: string
  publishedDate: string
  sourceId: string
  imageUrl?: string
}
