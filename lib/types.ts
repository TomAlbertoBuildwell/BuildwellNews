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
  status?: "pending" | "approved" | "rejected" | "published"
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

export interface ScrapingSession {
  id: string
  startTime: string
  endTime?: string
  totalSources: number
  processedSources: number
  totalArticles: number
  uniqueArticles: number
  duplicates: number
  errors: number
  status: "running" | "completed" | "failed" | "stopped"
  articles: Article[]
}

export interface ScrapingProgress {
  sessionId: string
  currentSource?: string
  currentSourceIndex: number
  totalSources: number
  currentArticle?: string
  currentArticleIndex: number
  totalArticlesInSource: number
  message: string
  timestamp: string
  type: "info" | "success" | "error" | "warning"
}
