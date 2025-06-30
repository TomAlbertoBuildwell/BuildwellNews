import { constructionSources } from "./sources"
import type { ScrapedContent } from "./types"
import { createHash } from "crypto"

// Simple RSS Parser without external dependencies
async function parseRSSFeed(rssUrl: string): Promise<any[]> {
  try {
    console.log(`🔍 Attempting to fetch RSS from: ${rssUrl}`)
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "BuildwellAI News Aggregator 1.0 (https://buildwellai.com)",
        Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml",
      },
    })

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`)
    }

    const xmlText = await response.text()
    
    // Simple XML parsing for RSS items
    const items = []
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
    let match

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1]
      
      const titleMatch = itemXml.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i)
      const linkMatch = itemXml.match(/<link[^>]*>(.*?)<\/link>/i)
      const descMatch = itemXml.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i)
      const pubDateMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i)
      
      // Try to extract image from content:encoded or description
      const contentMatch = itemXml.match(/<content:encoded[^>]*><!\[CDATA\[(.*?)\]\]><\/content:encoded>/i)
      const imageMatch = (contentMatch?.[1] || itemXml).match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i) ||
                        itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
                        itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i)

      const title = titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : 'No title'
      const link = linkMatch ? linkMatch[1].trim() : ''
      const description = descMatch ? (descMatch[1] || descMatch[2]).trim() : ''
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString()
      const imageUrl = imageMatch ? imageMatch[1].trim() : null

      if (title && link) {
        items.push({
          title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#124;/g, '|'),
          link: link,
          description: description.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          pubDate: pubDate,
          imageUrl: imageUrl,
        })
      }
    }

    console.log(`✅ Found ${items.length} items in RSS feed`)
    return items.slice(0, 10) // Limit to 10 most recent items
  } catch (error) {
    console.error(`❌ Error parsing RSS feed ${rssUrl}:`, error)
    return []
  }
}

// Extract image URL from HTML content
function extractImageFromContent(html: string, baseUrl?: string): string | null {
  // Try multiple image extraction strategies
  const imagePatterns = [
    // Open Graph image
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    // Twitter card image
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    // Article image
    /<img[^>]+class="[^"]*article[^"]*"[^>]+src=["']([^"']+)["']/i,
    // Featured image
    /<img[^>]+class="[^"]*featured[^"]*"[^>]+src=["']([^"']+)["']/i,
    // First img tag with reasonable size attributes
    /<img[^>]+src=["']([^"']+)["'][^>]*(?:width|height)=["'][^"']*[1-9]\d{2,}[^"']*["']/i,
    // Any img tag in article/content area
    /<article[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i,
    // Any img tag
    /<img[^>]+src=["']([^"']+)["']/i,
  ]

  for (const pattern of imagePatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      let imageUrl = match[1].trim()
      
      // Skip very small images, icons, or logos
      if (imageUrl.includes('logo') || imageUrl.includes('icon') || 
          imageUrl.includes('avatar') || imageUrl.includes('1x1') ||
          imageUrl.includes('tracking') || imageUrl.includes('pixel')) {
        continue
      }
      
      // Handle relative URLs
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl
      } else if (imageUrl.startsWith('/') && baseUrl) {
        try {
          const base = new URL(baseUrl)
          imageUrl = base.origin + imageUrl
        } catch {
          // If baseUrl is invalid, skip this image
          continue
        }
      } else if (!imageUrl.startsWith('http')) {
        // Skip invalid URLs
        continue
      }
      
      return imageUrl
    }
  }
  return null
}

export async function scrapeWebsite(url: string, sourceId: string): Promise<ScrapedContent | null> {
  try {
    console.log(`🌐 Scraping article: ${url}`)

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()

    // Basic HTML parsing - in production, use a proper HTML parser like Cheerio
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim().replace(/&[^;]+;/g, '') : "No title found"

    // Extract main content - this is a simplified approach
    const contentMatch =
      html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
      html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
      html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
      html.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
      html.match(/<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i)

    let content = contentMatch ? contentMatch[1] : html.substring(0, 2000)

    // Extract image from content (pass base URL for relative URL resolution)
    const imageUrl = extractImageFromContent(html, url)

    // Clean up HTML tags for basic text extraction
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/&[^;]+;/g, " ") // Remove HTML entities
      .trim()
      .substring(0, 1500) // Limit content length

    // Try to extract publish date
    const dateMatch =
      html.match(/<time[^>]*datetime="([^"]+)"/i) ||
      html.match(/published[^>]*>([^<]+)</i) ||
      html.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/) ||
      html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i)

    const publishedDate = dateMatch ? dateMatch[1] : new Date().toISOString()

    return {
      url,
      title,
      content,
      publishedDate,
      sourceId,
      imageUrl: imageUrl || undefined,
    }
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error)
    return null
  }
}

export async function scrapeRSSSource(sourceId: string, onProgress?: (message: string) => void): Promise<ScrapedContent[]> {
  const source = constructionSources.find(s => s.id === sourceId)
  if (!source?.rssUrl) {
    console.log(`⚠️  No RSS URL for source ${sourceId}`)
    onProgress?.(`⚠️  No RSS URL for source ${source?.organisation || sourceId}`)
    return []
  }

  try {
    onProgress?.(`📡 Fetching RSS feed for ${source.organisation}...`)
    console.log(`📡 Scraping RSS feed for ${source.organisation}: ${source.rssUrl}`)
    
    const rssItems = await parseRSSFeed(source.rssUrl)
    
    if (rssItems.length === 0) {
      onProgress?.(`⚠️  No items found in RSS feed for ${source.organisation}`)
      return []
    }

    onProgress?.(`📰 Found ${rssItems.length} articles from ${source.organisation}`)
    
    const scrapedContents: ScrapedContent[] = []
    
    for (const [index, item] of rssItems.entries()) {
      onProgress?.(`🔍 Processing article ${index + 1}/${rssItems.length}: ${item.title.substring(0, 50)}...`)
      
      // Try to get full content by scraping the article URL
      let fullContent = item.description || ''
      let articleImageUrl = item.imageUrl
      
      if (item.link && item.link.startsWith('http')) {
        const scrapedArticle = await scrapeWebsite(item.link, sourceId)
        if (scrapedArticle) {
          fullContent = scrapedArticle.content || item.description || ''
          // Use scraped image if no RSS image or if scraped image is better
          if (scrapedArticle.imageUrl && (!articleImageUrl || scrapedArticle.imageUrl.length > articleImageUrl.length)) {
            articleImageUrl = scrapedArticle.imageUrl
          }
        }
        // Add small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      scrapedContents.push({
        url: item.link || source.website,
        title: item.title,
        content: fullContent,
        publishedDate: item.pubDate,
        sourceId: sourceId,
        imageUrl: articleImageUrl || undefined,
      })
    }

    onProgress?.(`✅ Completed scraping ${scrapedContents.length} articles from ${source.organisation}`)
    return scrapedContents
  } catch (error) {
    console.error(`❌ Error scraping RSS for ${sourceId}:`, error)
    onProgress?.(`❌ Error scraping ${source.organisation}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return []
  }
}

// Generate content hash for duplicate detection
export function generateContentHash(content: ScrapedContent): string {
  const textForHash = `${content.title}${content.content.substring(0, 500)}${content.sourceId}`
  return createHash('md5').update(textForHash).digest('hex')
}

// Store for tracking processed content hashes
const processedHashes = new Set<string>()

export function isDuplicate(content: ScrapedContent): boolean {
  const hash = generateContentHash(content)
  if (processedHashes.has(hash)) {
    return true
  }
  processedHashes.add(hash)
  return false
}

export async function scrapeAllSources(onProgress?: (message: string) => void): Promise<ScrapedContent[]> {
  const results: ScrapedContent[] = []

  // Get sources with RSS feeds first
  const rssSourcesIds = constructionSources
    .filter((source) => source.rssAvailable === "Yes" && source.rssUrl)
    .map(source => source.id)

  onProgress?.(`🚀 Starting RSS scraping for ${rssSourcesIds.length} sources`)
  console.log(`Starting RSS scraping for ${rssSourcesIds.length} sources`)

  for (const [index, sourceId] of rssSourcesIds.entries()) {
    try {
      onProgress?.(`📊 Processing source ${index + 1}/${rssSourcesIds.length}: ${sourceId}`)
      console.log(`Processing RSS source: ${sourceId}`)
      
      const scrapedContents = await scrapeRSSSource(sourceId, onProgress)
      
      // Filter out duplicates
      const uniqueContents = scrapedContents.filter(content => !isDuplicate(content))
      results.push(...uniqueContents)
      
      onProgress?.(`📝 Added ${uniqueContents.length} unique articles (${scrapedContents.length - uniqueContents.length} duplicates filtered)`)
      console.log(`Scraped ${scrapedContents.length} items (${uniqueContents.length} unique) from ${sourceId}`)
      
      // Add delay between sources
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`Failed to scrape RSS source ${sourceId}:`, error)
      onProgress?.(`❌ Failed to scrape source ${sourceId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  onProgress?.(`🎉 Scraping completed! Total unique articles: ${results.length}`)
  console.log(`Total unique articles scraped: ${results.length}`)
  return results
}

export function clearProcessedHashes(): void {
  processedHashes.clear()
}
