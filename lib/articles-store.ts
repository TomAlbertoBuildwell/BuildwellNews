import { supabase, type NewsArticle } from './supabase'
import type { Article } from './types'
import { createHash } from "crypto"

// Enhanced articles with images and multiple sources
let articlesStore: Article[] = [
  {
    id: "nuclear-sizewell-c",
    title: "Nuclear to the fore as Sizewell C gains £14.2bn in public funding",
    excerpt:
      "The UK government has announced a significant £14.2 billion investment in the Sizewell C nuclear power station, marking one of the largest infrastructure investments in recent years.",
    content: "Full article content would be here...",
    category: "infrastructure",
    date: "16/01/2025",
    readTime: "4 min read",
    sourceId: "construction-news",
    similarity: 95,
    relatedSources: ["building", "construction-enquirer", "infrastructure-intelligence"],
    url: "https://www.constructionnews.co.uk/nuclear-sizewell-c-funding",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-16T10:00:00Z",
    summarizedAt: "2025-01-16T10:30:00Z",
    summary:
      "Government commits £14.2bn to Sizewell C nuclear project, creating thousands of construction jobs and advancing clean energy strategy.",
    featured: true,
    originalSources: [
      {
        sourceId: "construction-news",
        url: "https://www.constructionnews.co.uk/nuclear-sizewell-c-funding",
        title: "Sizewell C secures massive government backing",
      },
      {
        sourceId: "building",
        url: "https://www.building.co.uk/news/sizewell-c-investment",
        title: "£14.2bn nuclear investment transforms UK energy landscape",
      },
      {
        sourceId: "infrastructure-intelligence",
        url: "https://www.infrastructure-intelligence.com/sizewell-funding",
        title: "Nuclear renaissance: Sizewell C funding confirmed",
      },
    ],
  },
  {
    id: "laing-orourke-lab",
    title: "Laing O'Rourke wins £920m animal health super-lab job",
    excerpt:
      "Major contractor secures flagship laboratory contract as part of £2.8bn DEFRA animal diseases complex rebuild programme.",
    category: "commercial",
    date: "15/01/2025",
    readTime: "3 min read",
    sourceId: "construction-enquirer",
    similarity: 88,
    relatedSources: ["building", "construction-news"],
    url: "https://www.constructionenquirer.com/laing-orourke-lab-contract",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-15T14:00:00Z",
    summarizedAt: "2025-01-15T14:30:00Z",
    summary:
      "Laing O'Rourke secures major £920m laboratory contract for DEFRA's animal health facility rebuild program.",
    originalSources: [
      {
        sourceId: "construction-enquirer",
        url: "https://www.constructionenquirer.com/laing-orourke-lab-contract",
        title: "Laing O'Rourke lands £920m DEFRA super-lab contract",
      },
      {
        sourceId: "building",
        url: "https://www.building.co.uk/news/laing-orourke-defra-lab",
        title: "Major lab contract awarded to Laing O'Rourke",
      },
    ],
  },
  {
    id: "scotland-cladding-fix",
    title: "Scotland eyes £3bn cladding fix as levy targets house builders",
    excerpt:
      "Scottish ministers plan to raise £30m annually from developers to fund comprehensive building safety improvements.",
    category: "safety",
    date: "15/01/2025",
    readTime: "4 min read",
    sourceId: "building",
    similarity: 92,
    relatedSources: ["hse-building-safety", "inside-housing"],
    url: "https://www.building.co.uk/scotland-cladding-levy",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-15T12:00:00Z",
    summarizedAt: "2025-01-15T12:30:00Z",
    summary:
      "Scotland introduces £30m annual levy on developers to fund £3bn building safety improvements including cladding remediation.",
    originalSources: [
      {
        sourceId: "building",
        url: "https://www.building.co.uk/scotland-cladding-levy",
        title: "Scotland targets developers with £3bn cladding levy",
      },
      {
        sourceId: "inside-housing",
        url: "https://www.insidehousing.co.uk/scotland-building-safety",
        title: "Scottish building safety levy to raise £30m annually",
      },
      {
        sourceId: "hse-building-safety",
        url: "https://www.hse.gov.uk/building-safety/scotland-updates",
        title: "Scotland announces comprehensive building safety funding",
      },
    ],
  },
  {
    id: "henry-construction-admin",
    title: "Henry Construction administration extended for two years",
    excerpt: "Family construction firm continues under administration as financial restructuring process continues.",
    category: "commercial",
    date: "16/01/2025",
    readTime: "2 min read",
    sourceId: "construction-news",
    similarity: 85,
    relatedSources: ["construction-enquirer"],
    url: "https://www.constructionnews.co.uk/henry-construction-admin",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-16T09:00:00Z",
    summarizedAt: "2025-01-16T09:30:00Z",
    summary: "Henry Construction's administration period extended by two years as financial restructuring continues.",
    originalSources: [
      {
        sourceId: "construction-news",
        url: "https://www.constructionnews.co.uk/henry-construction-admin",
        title: "Henry Construction administration extended",
      },
    ],
  },
  {
    id: "amey-profit-growth",
    title: "Amey profit jumps 31% as £7.8bn pipeline fuels growth plans",
    excerpt:
      "New frameworks, rising margins and global expansion drive successful turnaround for infrastructure specialist.",
    category: "commercial",
    date: "15/01/2025",
    readTime: "3 min read",
    sourceId: "construction-enquirer",
    similarity: 78,
    relatedSources: ["building"],
    url: "https://www.constructionenquirer.com/amey-profit-growth",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-15T11:00:00Z",
    summarizedAt: "2025-01-15T11:30:00Z",
    summary:
      "Amey reports 31% profit increase driven by £7.8bn project pipeline and improved margins across infrastructure projects.",
    originalSources: [
      {
        sourceId: "construction-enquirer",
        url: "https://www.constructionenquirer.com/amey-profit-growth",
        title: "Amey profits surge 31% on strong pipeline",
      },
      {
        sourceId: "building",
        url: "https://www.building.co.uk/news/amey-financial-results",
        title: "Amey turnaround continues with profit jump",
      },
    ],
  },
  {
    id: "uk-data-centre-lincolnshire",
    title: "UK's biggest data centre plan breaks cover in Lincolnshire",
    excerpt: "£7.6bn AI hyperscale facility near Scunthorpe represents massive investment in digital infrastructure.",
    category: "technology",
    date: "13/01/2025",
    readTime: "3 min read",
    sourceId: "construction-enquirer",
    similarity: 90,
    relatedSources: ["infrastructure-intelligence", "new-civil-engineer"],
    url: "https://www.constructionenquirer.com/uk-data-centre-lincolnshire",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-13T16:00:00Z",
    summarizedAt: "2025-01-13T16:30:00Z",
    summary:
      "£7.6bn AI hyperscale data centre planned for Lincolnshire represents UK's largest digital infrastructure investment.",
    originalSources: [
      {
        sourceId: "construction-enquirer",
        url: "https://www.constructionenquirer.com/uk-data-centre-lincolnshire",
        title: "£7.6bn data centre plan unveiled for Lincolnshire",
      },
      {
        sourceId: "infrastructure-intelligence",
        url: "https://www.infrastructure-intelligence.com/lincolnshire-data-centre",
        title: "Massive AI data centre planned for Scunthorpe",
      },
    ],
  },
  {
    id: "government-reservoir-plan",
    title: "Government seizes control to fast-track £5bn reservoir plan",
    excerpt:
      "Ministers bypass local planning processes for critical water infrastructure projects in Lincolnshire and Fens.",
    category: "regulation",
    date: "12/01/2025",
    readTime: "4 min read",
    sourceId: "planning-resource",
    similarity: 94,
    relatedSources: ["construction-enquirer", "planning-portal"],
    url: "https://www.planningresource.co.uk/government-reservoir-plan",
    imageUrl: "/placeholder.svg?height=200&width=400",
    scrapedAt: "2025-01-12T13:00:00Z",
    summarizedAt: "2025-01-12T13:30:00Z",
    summary:
      "Government bypasses local planning for £5bn reservoir projects in Lincolnshire to accelerate critical water infrastructure.",
    originalSources: [
      {
        sourceId: "planning-resource",
        url: "https://www.planningresource.co.uk/government-reservoir-plan",
        title: "Government fast-tracks £5bn reservoir projects",
      },
      {
        sourceId: "construction-enquirer",
        url: "https://www.constructionenquirer.com/reservoir-planning-bypass",
        title: "Ministers bypass planning for water infrastructure",
      },
    ],
  },
]

let isDefaultData = true // Track if we're using default data

function generateContentHash(title: string, content: string, sourceId: string): string {
  const textForHash = `${title.toLowerCase().trim()}_${content.slice(0, 500).toLowerCase().trim()}_${sourceId}`
  return createHash('md5').update(textForHash).digest('hex')
}

// Convert between our local Article type and Supabase NewsArticle type
function toNewsArticle(article: Article): Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: article.title,
    content: article.content,
    summary: article.summary,
    url: article.url,
    image_url: article.imageUrl,
    published_date: article.date,
    source_name: article.sourceId,
    source_url: article.originalSources?.[0]?.url || '',
    category: article.category,
    tags: [],
    content_hash: generateContentHash(article.title, article.content || '', article.sourceId),
    status: article.status === 'published' ? 'approved' : (article.status || 'approved'),
    is_featured: article.featured || false,
    priority: 0,
    view_count: 0
  }
}

function fromNewsArticle(newsArticle: NewsArticle): Article {
  return {
    id: newsArticle.id,
    title: newsArticle.title,
    content: newsArticle.content || '',
    excerpt: newsArticle.summary || '',
    summary: newsArticle.summary || '',
    url: newsArticle.url,
    imageUrl: newsArticle.image_url || '',
    date: newsArticle.published_date || newsArticle.created_at,
    readTime: '3 min read',
    sourceId: newsArticle.source_name,
    similarity: 0,
    relatedSources: [],
    category: newsArticle.category,
    scrapedAt: newsArticle.created_at,
    summarizedAt: newsArticle.updated_at,
    status: newsArticle.status === 'approved' ? 'published' : newsArticle.status,
    featured: newsArticle.is_featured,
    originalSources: newsArticle.source_url ? [{
      sourceId: newsArticle.source_name,
      url: newsArticle.source_url,
      title: newsArticle.source_name
    }] : []
  }
}

class SupabaseArticlesStore {
  private articles: Article[] = []
  private listeners: Set<() => void> = new Set()
  private isLoaded: boolean = false

  constructor() {
    this.loadFromSupabase()
  }

  private async loadFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      this.articles = data.map(fromNewsArticle)
      this.isLoaded = true
      this.notifyListeners()
    } catch (error) {
      console.error('Error loading articles from Supabase:', error)
      // Fallback to localStorage if Supabase fails
      this.loadFromLocalStorage()
    }
  }

  private loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('buildwellai-articles')
      if (saved) {
        this.articles = JSON.parse(saved)
        this.isLoaded = true
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Error loading articles from localStorage:', error)
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('buildwellai-articles', JSON.stringify(this.articles))
    } catch (error) {
      console.error('Error saving articles to localStorage:', error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getArticles(): Article[] {
    return this.articles
  }

  getApprovedArticles(): Article[] {
    return this.articles.filter(article => 
      article.status === 'approved' || article.status === 'published'
    )
  }

  getFeaturedArticles(): Article[] {
    return this.articles.filter(article => 
      article.featured && (article.status === 'approved' || article.status === 'published')
    )
  }

  getLatestArticles(limit: number = 10): Article[] {
    return this.getApprovedArticles()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  getArticlesByCategory(category: string): Article[] {
    if (category === 'All') return this.getApprovedArticles()
    return this.getApprovedArticles().filter(article => article.category === category)
  }

  async addArticle(article: Article): Promise<boolean> {
    // Generate content hash for duplicate detection
    const contentHash = generateContentHash(article.title, article.content || '', article.sourceId)
    
    // Check for duplicates by content hash or URL
    if (this.articles.some(a => 
      (contentHash && a.url === article.url) || 
      (contentHash && generateContentHash(a.title, a.content || '', a.sourceId) === contentHash)
    )) {
      return false // Duplicate found
    }

    try {
      const newsArticleData = toNewsArticle(article)
      const { data, error } = await supabase
        .from('news_articles')
        .insert([newsArticleData])
        .select()
        .single()

      if (error) throw error

      const newArticle = fromNewsArticle(data)
      this.articles.unshift(newArticle)
      this.saveToLocalStorage() // Keep localStorage in sync
      this.notifyListeners()
      return true
    } catch (error) {
      console.error('Error adding article to Supabase:', error)
      
      // Fallback to localStorage
      const newId = Date.now().toString()
      const newArticle = { ...article, id: newId }
      this.articles.unshift(newArticle)
      this.saveToLocalStorage()
      this.notifyListeners()
      return true
    }
  }

  async addArticles(articles: Article[]): Promise<{ added: number; duplicates: number }> {
    let added = 0
    let duplicates = 0

    for (const article of articles) {
      const wasAdded = await this.addArticle(article)
      if (wasAdded) {
        added++
      } else {
        duplicates++
      }
    }

    return { added, duplicates }
  }

  async approveArticle(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({ status: 'approved' })
        .eq('id', id)

      if (error) throw error

      const article = this.articles.find(a => a.id === id)
      if (article) {
        article.status = 'published'
        this.saveToLocalStorage()
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Error approving article:', error)
    }
  }

  async rejectArticle(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      const article = this.articles.find(a => a.id === id)
      if (article) {
        article.status = 'rejected'
        this.saveToLocalStorage()
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Error rejecting article:', error)
    }
  }

  async toggleFeatured(id: string): Promise<void> {
    try {
      const article = this.articles.find(a => a.id === id)
      if (!article) return

      const newFeaturedStatus = !article.featured
      const { error } = await supabase
        .from('news_articles')
        .update({ is_featured: newFeaturedStatus })
        .eq('id', id)

      if (error) throw error

      article.featured = newFeaturedStatus
      this.saveToLocalStorage()
      this.notifyListeners()
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  async refreshFromSupabase(): Promise<void> {
    await this.loadFromSupabase()
  }

  clearAll() {
    this.articles = []
    localStorage.removeItem('buildwellai-articles')
    this.notifyListeners()
  }

  isDataLoaded(): boolean {
    return this.isLoaded
  }

  // Legacy support - these functions maintain compatibility with existing code
  push(article: Article) {
    this.addArticle(article)
  }

  unshift(article: Article) {
    this.addArticle(article)
  }

  *[Symbol.iterator]() {
    yield* this.articles
  }
}

// Create singleton instance
export const supabaseArticlesStore = new SupabaseArticlesStore()

// Legacy functions for compatibility
export function getAllArticles(): Article[] {
  return supabaseArticlesStore.getApprovedArticles()
    .sort((a, b) => new Date(b.scrapedAt || 0).getTime() - new Date(a.scrapedAt || 0).getTime())
}

export function getApprovedArticles(): Article[] {
  return supabaseArticlesStore.getApprovedArticles()
    .sort((a, b) => new Date(b.scrapedAt || 0).getTime() - new Date(a.scrapedAt || 0).getTime())
}

export function getFeaturedArticles(): Article[] {
  return supabaseArticlesStore.getFeaturedArticles()
}

export function getLatestArticles(limit: number = 5): Article[] {
  return supabaseArticlesStore.getLatestArticles(limit)
}

export function getArticlesByCategory(category: string): Article[] {
  return supabaseArticlesStore.getArticlesByCategory(category)
}

export function addArticle(article: Article): boolean {
  // Legacy implementation - check for duplicates first
  const existingArticles = supabaseArticlesStore.getArticles()
  const isDuplicate = existingArticles.some(existing => existing.url === article.url)
  
  if (isDuplicate) {
    console.log(`🔄 Duplicate article skipped: ${article.title}`)
    return false
  }

  console.log(`✅ Added new article: ${article.title} (status: ${article.status || 'pending'})`)
  supabaseArticlesStore.addArticle(article)
  return true
}

export async function addArticles(articles: Article[]): Promise<{ added: number; duplicates: number }> {
  return await supabaseArticlesStore.addArticles(articles)
}

export function approveArticle(id: string): void {
  supabaseArticlesStore.approveArticle(id)
}

export function rejectArticle(id: string): void {
  supabaseArticlesStore.rejectArticle(id)
}

export function publishArticle(id: string): void {
  supabaseArticlesStore.approveArticle(id)
}

export function subscribeToArticles(callback: () => void): () => void {
  return supabaseArticlesStore.subscribe(callback)
}

export function refreshArticles(): void {
  supabaseArticlesStore.refreshFromSupabase()
}
