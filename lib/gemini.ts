import type { ScrapedContent, Article } from "./types"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "demo-key"

export async function summarizeWithGemini(content: ScrapedContent): Promise<string> {
  try {
    // For demo purposes, we'll simulate the Gemini API call
    // In production, you'd use the actual Gemini API

    if (GEMINI_API_KEY === "demo-key") {
      // Simulate API response for demo
      return generateDemoSummary(content)
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Please summarize this UK construction industry article in 1-2 sentences, focusing on key facts, figures, and implications for the construction industry:

Title: ${content.title}
Content: ${content.content}

Summary should be professional, factual, and highlight regulatory changes, project values, company news, or safety implications.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || generateDemoSummary(content)
  } catch (error) {
    console.error("Error with Gemini API:", error)
    return generateDemoSummary(content)
  }
}

function generateDemoSummary(content: ScrapedContent): string {
  // Generate a demo summary based on content keywords
  const text = content.content.toLowerCase()

  if ((text.includes("£") && text.includes("million")) || text.includes("billion")) {
    const valueMatch = content.content.match(/£[\d.,]+\s*(million|billion|m|bn)/i)
    const value = valueMatch ? valueMatch[0] : "significant investment"
    return `Major ${value} construction project announced with implications for UK building industry and regulatory compliance.`
  }

  if (text.includes("safety") || text.includes("regulation")) {
    return `New building safety regulations and compliance requirements announced affecting UK construction industry standards.`
  }

  if (text.includes("contract") || text.includes("tender")) {
    return `Major construction contract awarded with significant implications for industry capacity and project delivery.`
  }

  return `Latest development in UK construction industry with potential impact on building regulations and market conditions.`
}

export async function batchSummarizeArticles(contents: ScrapedContent[]): Promise<Article[]> {
  const articles: Article[] = []

  for (const content of contents) {
    try {
      const summary = await summarizeWithGemini(content)

      const article: Article = {
        id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: content.title,
        excerpt: summary,
        content: content.content,
        category: inferCategory(content.content),
        date: new Date(content.publishedDate).toLocaleDateString("en-GB"),
        readTime: `${Math.ceil(content.content.length / 200)} min read`,
        sourceId: content.sourceId,
        similarity: Math.floor(Math.random() * 20) + 80, // Demo similarity score
        relatedSources: [],
        url: content.url,
        scrapedAt: new Date().toISOString(),
        summarizedAt: new Date().toISOString(),
        summary,
      }

      articles.push(article)

      // Add delay between API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error processing article:", error)
    }
  }

  return articles
}

function inferCategory(content: string): string {
  const text = content.toLowerCase()

  if (text.includes("safety") || text.includes("regulation") || text.includes("hse")) {
    return "safety"
  }
  if (text.includes("technology") || text.includes("digital") || text.includes("ai") || text.includes("bim")) {
    return "technology"
  }
  if (text.includes("market") || text.includes("profit") || text.includes("revenue") || text.includes("financial")) {
    return "market"
  }
  if (text.includes("planning") || text.includes("policy") || text.includes("government")) {
    return "regulation"
  }

  return "industry"
}
