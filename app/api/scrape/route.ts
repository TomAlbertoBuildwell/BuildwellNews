import { NextResponse } from "next/server"
import { scrapeAllSources } from "@/lib/scraper"
import { batchSummarizeArticles } from "@/lib/gemini"
import { addArticle } from "@/lib/articles-store"

export async function POST() {
  try {
    console.log("Starting scraping process...")

    // Scrape content from sources
    const scrapedContent = await scrapeAllSources()
    console.log(`Scraped ${scrapedContent.length} articles`)

    if (scrapedContent.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No content scraped",
        count: 0,
      })
    }

    // Summarize with Gemini
    console.log("Summarizing articles with Gemini...")
    const articles = await batchSummarizeArticles(scrapedContent)
    console.log(`Summarized ${articles.length} articles`)

    // Store articles
    articles.forEach((article) => addArticle(article))

    return NextResponse.json({
      success: true,
      message: `Successfully scraped and summarized ${articles.length} articles`,
      count: articles.length,
      articles: articles.map((a) => ({ id: a.id, title: a.title, source: a.sourceId })),
    })
  } catch (error) {
    console.error("Scraping error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Scraper endpoint active. Use POST to trigger scraping.",
  })
}
