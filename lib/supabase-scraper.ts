import { supabase, type ScrapingSession, type ScrapingLog } from './supabase'
import { constructionSources } from './sources'
import { summarizeContent } from './gemini'
import { supabaseArticlesStore } from './articles-store'
import type { Article } from './types'
import { createHash } from 'crypto'
import * as cheerio from 'cheerio'

interface ScrapingStats {
  totalSources: number
  processedSources: number
  totalArticles: number
  newArticles: number
  duplicateArticles: number
  failedSources: number
}

interface ScrapingProgress {
  sessionId: string
  currentSource?: string
  message: string
  stats: ScrapingStats
  logs: ScrapingLog[]
  status: 'running' | 'completed' | 'failed' | 'cancelled'
}

class SupabaseScrapingService {
  private currentSessionId: string | null = null
  private isRunning: boolean = false
  private shouldStop: boolean = false
  private progressCallbacks: Set<(progress: ScrapingProgress) => void> = new Set()

  // Subscribe to progress updates
  onProgress(callback: (progress: ScrapingProgress) => void): () => void {
    this.progressCallbacks.add(callback)
    return () => this.progressCallbacks.delete(callback)
  }

  // Start real-time scraping session
  async startScrapingSession(): Promise<string> {
    if (this.isRunning) {
      throw new Error('Scraping session already running')
    }

    this.isRunning = true
    this.shouldStop = false

    try {
      // Call the server-side API to start scraping
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Scraping failed')
      }

      this.currentSessionId = result.sessionId
      
      // Start polling for updates immediately
      setTimeout(() => this.pollSessionProgress(), 1000)

      return result.sessionId

    } catch (error) {
      this.isRunning = false
      this.currentSessionId = null
      throw error
    }
  }

  // Poll for session progress updates
  private async pollSessionProgress(): Promise<void> {
    if (!this.currentSessionId || this.shouldStop) {
      this.isRunning = false
      return
    }

    try {
      const progress = await this.getSessionProgress()
      if (progress) {
        // Always notify progress callbacks for real-time updates
        this.progressCallbacks.forEach(callback => {
          try {
            callback(progress)
          } catch (error) {
            console.error('Error in progress callback:', error)
          }
        })

        // Check if session is complete
        if (progress.status === 'completed' || progress.status === 'failed' || progress.status === 'cancelled') {
          this.isRunning = false
          this.currentSessionId = null
          
          // Refresh articles store
          await supabaseArticlesStore.refreshFromSupabase()
          return
        }
      }

      // Continue polling if still running - poll more frequently for better real-time feel
      if (this.isRunning && !this.shouldStop) {
        setTimeout(() => this.pollSessionProgress(), 1500)
      }

    } catch (error) {
      console.error('Error polling session progress:', error)
      // Don't stop polling on individual errors, just log and continue
      if (this.isRunning && !this.shouldStop) {
        setTimeout(() => this.pollSessionProgress(), 3000)
      }
    }
  }

  // Stop current scraping session
  async stopScrapingSession(): Promise<void> {
    if (!this.isRunning || !this.currentSessionId) {
      return
    }

    this.shouldStop = true
    
    await supabase
      .from('scraping_sessions')
      .update({ 
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('id', this.currentSessionId)

    await this.logMessage('warning', '⏹️ Scraping session cancelled by user')
    
    this.isRunning = false
    this.currentSessionId = null
  }

  // Get current session progress
  async getSessionProgress(): Promise<ScrapingProgress | null> {
    if (!this.currentSessionId) return null

    try {
      // Get session data
      const { data: session } = await supabase
        .from('scraping_sessions')
        .select('*')
        .eq('id', this.currentSessionId)
        .single()

      if (!session) return null

      // Get recent logs
      const { data: logs } = await supabase
        .from('scraping_logs')
        .select('*')
        .eq('session_id', this.currentSessionId)
        .order('timestamp', { ascending: false })
        .limit(50)

      return {
        sessionId: this.currentSessionId,
        message: logs?.[0]?.message || 'Initializing...',
        stats: {
          totalSources: session.total_sources,
          processedSources: session.processed_sources || 0,
          totalArticles: session.total_articles || 0,
          newArticles: session.new_articles || 0,
          duplicateArticles: session.duplicate_articles || 0,
          failedSources: session.failed_sources || 0
        },
        logs: logs || [],
        status: session.status
      }
    } catch (error) {
      console.error('Error getting session progress:', error)
      return null
    }
  }

  // Main scraping logic
  private async runScrapingSession(): Promise<void> {
    if (!this.currentSessionId) return

    let stats: ScrapingStats = {
      totalSources: constructionSources.length,
      processedSources: 0,
      totalArticles: 0,
      newArticles: 0,
      duplicateArticles: 0,
      failedSources: 0
    }

    try {
      // Process each source
      for (const source of constructionSources) {
        if (this.shouldStop) break

        await this.logMessage('info', `📡 Processing source: ${source.organisation}`)
        
        try {
          const articles = await this.scrapeSource(source)
          stats.totalArticles += articles.length

          // Add articles to database
          for (const article of articles) {
            if (this.shouldStop) break

            const wasAdded = await supabaseArticlesStore.addArticle(article)
            if (wasAdded) {
              stats.newArticles++
              await this.logMessage('success', `✅ Added: ${article.title}`)
            } else {
              stats.duplicateArticles++
              await this.logMessage('info', `🔄 Duplicate: ${article.title}`)
            }
          }

          stats.processedSources++
          await this.logMessage('success', `✅ Completed ${source.organisation}: ${articles.length} articles found`)

        } catch (error) {
          stats.failedSources++
          await this.logMessage('error', `❌ Failed to process ${source.organisation}: ${error}`)
        }

        // Update session stats
        await this.updateSessionStats(stats)

        // Notify progress callbacks
        this.notifyProgressCallbacks()

        // Respectful delay between sources
        await this.delay(1500)
      }

      // Complete session
      if (!this.shouldStop) {
        await this.completeSession(stats)
      }

    } catch (error) {
      await this.failSession(error as Error)
    } finally {
      this.isRunning = false
      this.currentSessionId = null
    }
  }

  // Scrape individual source
  private async scrapeSource(source: any): Promise<Article[]> {
    const articles: Article[] = []

    if (!source.rssUrl) {
      throw new Error('No RSS URL provided')
    }

    try {
      // Fetch RSS feed
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'BuildwellAI News Aggregator 1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const rssText = await response.text()
      const parsedItems = this.parseRSSFeed(rssText)

      for (const item of parsedItems) {
        if (this.shouldStop) break

        try {
          // Extract full content
          const fullContent = await this.extractFullContent(item.link)
          
          // Generate summary
          const summary = await this.generateSummary(fullContent, item.title, source.organisation, item.link, item.pubDate, this.extractImageUrl(item.description || '', item.link))

          const article: Article = {
            id: this.generateId(),
            title: this.cleanText(item.title) || 'Untitled',
            excerpt: this.cleanText(item.description || '').slice(0, 200) + '...',
            content: fullContent,
            category: this.categorizeArticle(item.title, fullContent),
            date: this.parseDate(item.pubDate),
            readTime: this.calculateReadTime(fullContent),
            sourceId: source.organisation,
            similarity: 0,
            relatedSources: [],
            url: item.link,
            imageUrl: this.extractImageUrl(item.description || '', item.link),
            scrapedAt: new Date().toISOString(),
            summarizedAt: new Date().toISOString(),
            summary,
            featured: false,
            status: 'published' // Auto-approve scraped articles
          }

          articles.push(article)

        } catch (error) {
          console.error(`Error processing article ${item.title}:`, error)
        }
      }

    } catch (error) {
      throw new Error(`RSS parsing failed: ${error}`)
    }

    return articles
  }

  // Parse RSS feed using regex
  private parseRSSFeed(rssText: string): any[] {
    const items: any[] = []
    
    // Extract items using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi
    let itemMatch

    while ((itemMatch = itemRegex.exec(rssText)) !== null) {
      const itemXml = itemMatch[1]
      
      const title = this.extractXmlContent(itemXml, 'title')
      const link = this.extractXmlContent(itemXml, 'link') || this.extractXmlContent(itemXml, 'guid')
      const description = this.extractXmlContent(itemXml, 'description')
      const pubDate = this.extractXmlContent(itemXml, 'pubDate') || this.extractXmlContent(itemXml, 'dc:date')

      if (title && link) {
        items.push({
          title: this.decodeCDATA(title),
          link: this.decodeCDATA(link),
          description: this.decodeCDATA(description || ''),
          pubDate: this.decodeCDATA(pubDate || '')
        })
      }
    }

    return items.slice(0, 10) // Limit to 10 most recent articles
  }

  // Extract content from XML tags
  private extractXmlContent(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'si')
    const match = xml.match(regex)
    return match ? match[1].trim() : null
  }

  // Decode CDATA sections
  private decodeCDATA(text: string): string {
    return text
      .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }

  // Extract full article content
  private async extractFullContent(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BuildwellAI News Aggregator 1.0'
        }
      })

      if (!response.ok) return ''

      const html = await response.text()
      const $ = cheerio.load(html)

      // Remove unwanted elements
      $('script, style, nav, footer, header, .advertisement, .ads, .social-share').remove()

      // Try to find main content
      const contentSelectors = [
        'article',
        '.article-content',
        '.post-content',
        '.entry-content',
        '.content',
        'main',
        '.main-content'
      ]

      for (const selector of contentSelectors) {
        const element = $(selector)
        if (element.length) {
          return this.cleanText(element.text())
        }
      }

      // Fallback to body content
      return this.cleanText($('body').text()).slice(0, 2000)

    } catch (error) {
      console.error('Error extracting content:', error)
      return ''
    }
  }

  // Generate article summary
  private async generateSummary(content: string, title: string, sourceId: string, url: string, publishedDate: string, imageUrl?: string): Promise<string> {
    try {
      // Create ScrapedContent object for summarizeContent function
      const scrapedContent = {
        url,
        title,
        content,
        publishedDate,
        sourceId,
        imageUrl
      }
      
      const article = await summarizeContent(scrapedContent)
      return article.summary || content.slice(0, 200) + '...'
    } catch (error) {
      console.error('Error generating summary:', error)
      return content.slice(0, 200) + '...'
    }
  }

  // Categorize article based on content
  private categorizeArticle(title: string, content: string): string {
    const text = `${title} ${content}`.toLowerCase()
    
    if (text.includes('safety') || text.includes('regulation') || text.includes('compliance')) {
      return 'safety'
    }
    if (text.includes('technology') || text.includes('innovation') || text.includes('digital')) {
      return 'technology'
    }
    if (text.includes('market') || text.includes('price') || text.includes('economy')) {
      return 'market'
    }
    if (text.includes('housing') || text.includes('residential')) {
      return 'housing'
    }
    if (text.includes('infrastructure') || text.includes('transport')) {
      return 'infrastructure'
    }
    
    return 'general'
  }

  // Utility functions
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?()-]/g, '')
      .trim()
  }

  private parseDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString()
    
    try {
      return new Date(dateStr).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  private calculateReadTime(content: string): string {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  private extractImageUrl(description: string, articleUrl: string): string {
    // Try to extract image from description
    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i)
    if (imgMatch) {
      let imageUrl = imgMatch[1]
      
      // Handle relative URLs
      if (imageUrl.startsWith('/')) {
        const baseUrl = new URL(articleUrl).origin
        imageUrl = baseUrl + imageUrl
      }
      
      return imageUrl
    }

    // Fallback to category-specific placeholder
    return '/placeholder.jpg'
  }

  // Database helper functions
  private async logMessage(level: 'info' | 'success' | 'warning' | 'error', message: string, sourceName?: string, articlesFound?: number): Promise<void> {
    if (!this.currentSessionId) return

    try {
      await supabase
        .from('scraping_logs')
        .insert([{
          session_id: this.currentSessionId,
          level,
          message,
          source_name: sourceName,
          articles_found: articlesFound
        }])
    } catch (error) {
      console.error('Error logging message:', error)
    }
  }

  private async updateSessionStats(stats: ScrapingStats): Promise<void> {
    if (!this.currentSessionId) return

    await supabase
      .from('scraping_sessions')
      .update({
        processed_sources: stats.processedSources,
        total_articles: stats.totalArticles,
        new_articles: stats.newArticles,
        duplicate_articles: stats.duplicateArticles,
        failed_sources: stats.failedSources
      })
      .eq('id', this.currentSessionId)
  }

  private async completeSession(stats: ScrapingStats): Promise<void> {
    if (!this.currentSessionId) return

    await supabase
      .from('scraping_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        ...stats
      })
      .eq('id', this.currentSessionId)

    await this.logMessage('success', `🎉 Scraping completed! Added ${stats.newArticles} new articles, ${stats.duplicateArticles} duplicates filtered`)
  }

  private async failSession(error: Error): Promise<void> {
    if (!this.currentSessionId) return

    await supabase
      .from('scraping_sessions')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error.message
      })
      .eq('id', this.currentSessionId)

    await this.logMessage('error', `💥 Scraping failed: ${error.message}`)
  }

  private notifyProgressCallbacks(): void {
    this.getSessionProgress().then(progress => {
      if (progress) {
        this.progressCallbacks.forEach(callback => callback(progress))
      }
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Public getters
  get isScrapingActive(): boolean {
    return this.isRunning
  }

  get activeSessionId(): string | null {
    return this.currentSessionId
  }
}

export const supabaseScrapingService = new SupabaseScrapingService() 