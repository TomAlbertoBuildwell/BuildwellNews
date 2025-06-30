import { NextRequest, NextResponse } from "next/server"
import { constructionSources } from "@/lib/sources"
import { summarizeContent } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"
import { createHash } from "crypto"
import * as cheerio from "cheerio"

interface ScrapingStats {
  totalSources: number
  processedSources: number
  totalArticles: number
  newArticles: number
  duplicateArticles: number
  failedSources: number
}

// Server-side RSS scraping function
async function scrapeRSSSource(source: any) {
  const articles: any[] = []

  if (!source.rssUrl) {
    throw new Error('No RSS URL provided')
  }

  try {
    // Server-side fetch (no CORS issues)
    const response = await fetch(source.rssUrl, {
      headers: {
        'User-Agent': 'BuildwellAI News Aggregator 1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const rssText = await response.text()
    const parsedItems = parseRSSFeed(rssText)

    for (const item of parsedItems.slice(0, 5)) { // Limit to 5 articles per source
      try {
        // Extract full content
        const { content, imageUrl } = await extractFullContent(item.link)
        
        // Create ScrapedContent object for summarization
        const scrapedContent = {
          url: item.link,
          title: cleanText(item.title) || 'Untitled',
          content: content,
          publishedDate: parseDate(item.pubDate),
          sourceId: source.organisation,
          imageUrl: imageUrl
        }
        
        // Generate summary and full article
        const article = await summarizeContent(scrapedContent)
        
        // Add content hash for duplicate detection
        const contentHash = generateContentHash(article.title, article.content || '', article.sourceId)
        
        articles.push({
          ...article,
          contentHash,
          url: item.link,
          scrapedAt: new Date().toISOString(),
          publishedDateISO: scrapedContent.publishedDate // Store original ISO date for database
        })

      } catch (error) {
        console.error(`Error processing article ${item.title}:`, error)
      }
    }

  } catch (error) {
    throw new Error(`RSS parsing failed: ${error}`)
  }

  return articles
}

// Parse RSS feed using regex (server-side)
function parseRSSFeed(rssText: string): any[] {
  const items: any[] = []
  
  // Extract items using regex
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let itemMatch

  while ((itemMatch = itemRegex.exec(rssText)) !== null) {
    const itemXml = itemMatch[1]
    
    const title = extractXmlContent(itemXml, 'title')
    const link = extractXmlContent(itemXml, 'link') || extractXmlContent(itemXml, 'guid')
    const description = extractXmlContent(itemXml, 'description')
    const pubDate = extractXmlContent(itemXml, 'pubDate') || extractXmlContent(itemXml, 'dc:date')

    if (title && link) {
      items.push({
        title: decodeCDATA(title),
        link: decodeCDATA(link),
        description: decodeCDATA(description || ''),
        pubDate: decodeCDATA(pubDate || '')
      })
    }
  }

  return items
}

// Extract content from XML tags
function extractXmlContent(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'si')
  const match = xml.match(regex)
  return match ? match[1].trim() : null
}

// Decode CDATA sections
function decodeCDATA(text: string): string {
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

// Enhanced image extraction function
const extractImageUrl = (description: string, articleUrl: string, title: string): string => {
  // Try multiple image extraction strategies
  let imageUrl = ''

  // Strategy 1: Look for image tags in description
  const imgTagMatch = description.match(/<img[^>]*src=['"]([^'"]*)['"]/i)
  if (imgTagMatch) {
    imageUrl = imgTagMatch[1]
  }

  // Strategy 2: Look for Open Graph images in description
  if (!imageUrl) {
    const ogImageMatch = description.match(/property=['"]og:image['"][^>]*content=['"]([^'"]*)['"]/i)
    if (ogImageMatch) {
      imageUrl = ogImageMatch[1]
    }
  }

  // Strategy 3: Look for media:content or enclosure tags
  if (!imageUrl) {
    const mediaMatch = description.match(/<media:content[^>]*url=['"]([^'"]*)['"]/i) ||
                       description.match(/<enclosure[^>]*url=['"]([^'"]*)['"]/i)
    if (mediaMatch) {
      imageUrl = mediaMatch[1]
    }
  }

  // Strategy 4: Look for any image URLs in the description text
  if (!imageUrl) {
    const urlMatch = description.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/i)
    if (urlMatch) {
      imageUrl = urlMatch[1]
    }
  }

  // Strategy 5: Check for background-image in style attributes
  if (!imageUrl) {
    const bgImageMatch = description.match(/background-image:\s*url\(['"]?([^'"]*?)['"]?\)/i)
    if (bgImageMatch) {
      imageUrl = bgImageMatch[1]
    }
  }

  // Clean and validate the URL
  if (imageUrl) {
    // Remove any HTML entities
    imageUrl = imageUrl.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    
    // Handle relative URLs
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl
    } else if (imageUrl.startsWith('/')) {
      try {
        const baseUrl = new URL(articleUrl)
        imageUrl = baseUrl.origin + imageUrl
      } catch (e) {
        console.log(`Failed to construct absolute URL for: ${imageUrl}`)
        imageUrl = ''
      }
    }

    // Validate the URL format
    try {
      new URL(imageUrl)
      // Additional validation for image file extensions or common image hosts
      if (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') || imageUrl.includes('.png') || 
          imageUrl.includes('.gif') || imageUrl.includes('.webp') || 
          imageUrl.includes('images') || imageUrl.includes('media') ||
          imageUrl.includes('cdn') || imageUrl.includes('amazonaws')) {
        return imageUrl
      }
    } catch (e) {
      console.log(`Invalid image URL: ${imageUrl}`)
    }
  }

  // Return empty string if no valid image found
  return ''
}

// Enhanced content extraction with better image discovery
const extractFullContent = async (url: string): Promise<{ content: string; imageUrl?: string }> => {
  try {
          const response = await fetch(url, {
        headers: {
          'User-Agent': 'BuildwellAI News Aggregator 1.0 (Mozilla/5.0 compatible)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    let content = ''
    let imageUrl = ''

    // Extract main content - try multiple selectors
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content', 
      '.entry-content',
      '.content',
      'main',
      '.main-content',
      '[role="main"]'
    ]

          for (const selector of contentSelectors) {
        const match = html.match(new RegExp(`<${selector.replace('.', '\\s*class=[^>]*')}[^>]*>([\\s\\S]*?)</${selector.split(/[\s.]/)[0]}>`, 'i'))
        if (match) {
          content = match[1]
          break
        }
      }

      // Fallback: extract from body if no specific content found
      if (!content) {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        if (bodyMatch) {
          content = bodyMatch[1]
        }
      }

    // Extract images from the full HTML with priority order
    const imageSelectors = [
      // Open Graph image
      /<meta\s+property=['"]og:image['"][^>]*content=['"]([^'"]*)['"]/i,
      // Twitter card image
      /<meta\s+name=['"]twitter:image['"][^>]*content=['"]([^'"]*)['"]/i,
      // Article image
      /<img[^>]*class=[^>]*(?:featured|hero|article|main)[^>]*src=['"]([^'"]*)['"]/i,
      // Any image in article content
      /<img[^>]*src=['"]([^'"]*)['"]/i,
    ]

    for (const regex of imageSelectors) {
      const match = html.match(regex)
      if (match && match[1]) {
        imageUrl = match[1]
        
        // Handle relative URLs
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl
        } else if (imageUrl.startsWith('/')) {
          try {
            const baseUrl = new URL(url)
            imageUrl = baseUrl.origin + imageUrl
          } catch (e) {
            continue
          }
        }

        // Validate the image URL
        try {
          new URL(imageUrl)
          // Check if it looks like a valid image
          if (imageUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i) || 
              imageUrl.includes('images') || imageUrl.includes('media')) {
            break
          }
        } catch (e) {
          continue
        }
      }
    }

          // Clean content
      if (content) {
        content = content
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
          .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
          .replace(/<div[^>]*class=[^>]*(?:ad|advertisement|sidebar)[^>]*>[\s\S]*?<\/div>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      }

    return { 
      content: content || 'Content extraction failed',
      imageUrl: imageUrl || undefined
    }

  } catch (error) {
    console.log(`Content extraction failed for ${url}:`, error)
    return { 
      content: 'Content extraction failed',
      imageUrl: undefined
    }
  }
}

// Utility functions
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,!?()-]/g, '')
    .trim()
}

function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString()
  
  try {
    return new Date(dateStr).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function generateContentHash(title: string, content: string, sourceId: string): string {
  const textForHash = `${title.toLowerCase().trim()}_${content.slice(0, 500).toLowerCase().trim()}_${sourceId}`
  return createHash('md5').update(textForHash).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting server-side scraping process...')
    
    // Create new scraping session
    const { data: session, error: sessionError } = await supabase
      .from('scraping_sessions')
      .insert([{
        total_sources: constructionSources.filter(s => s.rssUrl).length,
        status: 'running'
      }])
      .select()
      .single()

    if (sessionError) {
      throw new Error(`Failed to create session: ${sessionError.message}`)
    }

    console.log(`📊 Created session ${session.id} with ${session.total_sources} sources`)

    let stats: ScrapingStats = {
      totalSources: session.total_sources,
      processedSources: 0,
      totalArticles: 0,
      newArticles: 0,
      duplicateArticles: 0,
      failedSources: 0
    }

    // Log session start
    await supabase
      .from('scraping_logs')
      .insert([{
        session_id: session.id,
        level: 'info',
        message: `🚀 Starting scraping session with ${stats.totalSources} sources`
      }])

    // Process each source with RSS URL
    const sourcesWithRss = constructionSources.filter(source => source.rssUrl)
    
    for (const source of sourcesWithRss) {
      console.log(`📡 Processing source: ${source.organisation}`)
      
      // Log current source
      await supabase
        .from('scraping_logs')
        .insert([{
          session_id: session.id,
          level: 'info',
          message: `📡 Processing source: ${source.organisation}`,
          source_name: source.organisation
        }])
      
      try {
        const articles = await scrapeRSSSource(source)
        stats.totalArticles += articles.length

        // Add articles to database
        for (const article of articles) {
          // Check for duplicates using content hash
          const { data: existing } = await supabase
            .from('news_articles')
            .select('id')
            .eq('content_hash', article.contentHash)
            .single()

          if (existing) {
            stats.duplicateArticles++
            await supabase
              .from('scraping_logs')
              .insert([{
                session_id: session.id,
                level: 'info',
                message: `🔄 Duplicate: ${article.title}`,
                source_name: source.organisation
              }])
          } else {
            // Insert new article
            const { error: insertError } = await supabase
              .from('news_articles')
              .insert([{
                title: article.title,
                content: article.content,
                summary: article.summary,
                url: article.url,
                image_url: article.imageUrl,
                published_date: article.publishedDateISO,
                source_name: article.sourceId,
                category: article.category,
                content_hash: article.contentHash,
                status: 'approved',
                is_featured: article.featured || false
              }])

            if (insertError) {
              console.error('Error inserting article:', insertError)
            } else {
              stats.newArticles++
              await supabase
                .from('scraping_logs')
                .insert([{
                  session_id: session.id,
                  level: 'success',
                  message: `✅ Added: ${article.title}`,
                  source_name: source.organisation,
                  articles_found: 1
                }])
            }
          }
        }

        stats.processedSources++
        console.log(`✅ Completed ${source.organisation}: ${articles.length} articles found`)
        
        await supabase
          .from('scraping_logs')
          .insert([{
            session_id: session.id,
            level: 'success',
            message: `✅ Completed ${source.organisation}: ${articles.length} articles found`,
            source_name: source.organisation,
            articles_found: articles.length
          }])

      } catch (error) {
        stats.failedSources++
        console.error(`❌ Failed to process ${source.organisation}:`, error)
        
        await supabase
          .from('scraping_logs')
          .insert([{
            session_id: session.id,
            level: 'error',
            message: `❌ Failed to process ${source.organisation}: ${error}`,
            source_name: source.organisation
          }])
      }

      // Update session stats
      await supabase
        .from('scraping_sessions')
        .update({
          processed_sources: stats.processedSources,
          total_articles: stats.totalArticles,
          new_articles: stats.newArticles,
          duplicate_articles: stats.duplicateArticles,
          failed_sources: stats.failedSources
        })
        .eq('id', session.id)

      // Small delay between sources
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Complete session
    await supabase
      .from('scraping_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', session.id)

    await supabase
      .from('scraping_logs')
      .insert([{
        session_id: session.id,
        level: 'success',
        message: `🎉 Scraping completed! Added ${stats.newArticles} new articles, ${stats.duplicateArticles} duplicates filtered`
      }])

    console.log('✅ Scraping completed successfully')

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      stats,
      message: `Scraping completed! ${stats.newArticles} new articles added, ${stats.duplicateArticles} duplicates filtered`
    })

  } catch (error) {
    console.error('❌ Scraping failed:', error)
    
    return NextResponse.json({
        success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get article counts from Supabase
    const { data: articles, count: totalCount } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact' })
      .limit(3)

    const { count: approvedCount } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    return NextResponse.json({
      message: "BuildwellAI Scraper endpoint active. Use POST to trigger scraping.",
      status: "ready",
      version: "2.0.0",
      sources: "UK Construction RSS feeds with Supabase integration",
      currentArticlesCount: totalCount || 0,
      approvedArticlesCount: approvedCount || 0,
      availableSources: constructionSources.filter(s => s.rssUrl).length,
      sampleArticles: articles?.slice(0, 3).map(article => ({
        id: article.id,
        title: article.title,
        category: article.category,
        source: article.source_name,
        status: article.status,
      })) || [],
      features: [
        "Server-side RSS feed processing",
        "Image extraction and fallbacks",
        "AI summarization with Gemini",
        "Duplicate detection using content hashing",
        "Real-time progress tracking",
        "Supabase database integration",
        "Auto-approval of scraped articles"
      ],
    })
  } catch (error) {
  return NextResponse.json({
      message: "BuildwellAI Scraper endpoint active",
      status: "ready",
      version: "2.0.0",
      error: "Could not fetch article statistics"
  })
  }
}
