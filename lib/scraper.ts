import { constructionSources } from "./sources"
import type { ScrapedContent } from "./types"

export async function scrapeWebsite(url: string, sourceId: string): Promise<ScrapedContent | null> {
  try {
    console.log(`Scraping ${url} for source ${sourceId}`)

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
    const title = titleMatch ? titleMatch[1].trim() : "No title found"

    // Extract main content - this is a simplified approach
    const contentMatch =
      html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
      html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
      html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)

    let content = contentMatch ? contentMatch[1] : html.substring(0, 2000)

    // Clean up HTML tags for basic text extraction
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 1500) // Limit content length

    // Try to extract publish date
    const dateMatch =
      html.match(/<time[^>]*datetime="([^"]+)"/i) ||
      html.match(/published[^>]*>([^<]+)</i) ||
      html.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/)

    const publishedDate = dateMatch ? dateMatch[1] : new Date().toISOString()

    return {
      url,
      title,
      content,
      publishedDate,
      sourceId,
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return null
  }
}

export async function scrapeAllSources(): Promise<ScrapedContent[]> {
  const results: ScrapedContent[] = []

  // Get sources with RSS feeds first, then others
  const sourcesToScrape = constructionSources
    .filter((source) => source.rssAvailable === "Yes" || source.rssAvailable === "Partial")
    .slice(0, 5) // Limit to 5 sources for demo

  for (const source of sourcesToScrape) {
    try {
      // For RSS sources, we'd typically parse the RSS feed
      // For demo, we'll scrape the main website
      const scrapedContent = await scrapeWebsite(source.website, source.id)
      if (scrapedContent) {
        results.push(scrapedContent)
      }

      // Add delay to be respectful to servers
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`Failed to scrape ${source.organisation}:`, error)
    }
  }

  return results
}
