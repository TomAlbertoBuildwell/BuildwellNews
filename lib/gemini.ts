import type { ScrapedContent, Article } from "./types"
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const generationConfig = {
  stopSequences: ["\n\n", "\n\n\n"],
  maxOutputTokens: 200,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
};

// Enhanced demo summaries with more variety and realism
const demoSummaries = [
  {
    category: "infrastructure",
    summary: "Major infrastructure development announced with significant investment in sustainable construction practices and green building technologies.",
  },
  {
    category: "housing",
    summary: "New residential development proposal includes affordable housing units and incorporates modern energy-efficient building standards.",
  },
  {
    category: "commercial",
    summary: "Commercial construction project features innovative design elements and sustainable materials, targeting BREEAM Excellent certification.",
  },
  {
    category: "regulation",
    summary: "Updated building regulations focus on enhanced safety standards and environmental compliance requirements for construction projects.",
  },
  {
    category: "technology",
    summary: "Construction technology advancement introduces automated processes and digital tools to improve efficiency and safety on building sites.",
  },
  {
    category: "safety",
    summary: "Construction safety initiative emphasizes worker protection and implements new protocols to reduce workplace accidents and incidents.",
  },
  {
    category: "environment",
    summary: "Environmental construction standards promote sustainable building practices and carbon-neutral development approaches.",
  },
  {
    category: "planning",
    summary: "Planning permission developments streamline approval processes while maintaining rigorous environmental and community impact assessments.",
  },
]

// Convert ISO date to UK format (DD/MM/YYYY)
function formatDateToUK(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (error) {
    // Fallback to current date if parsing fails
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    return `${day}/${month}/${year}`
  }
}

// Generate fallback image URL
function getImageFallback(category: string): string {
  const fallbacks = {
    infrastructure: "/placeholder.svg?height=200&width=400&text=Infrastructure",
    housing: "/placeholder.svg?height=200&width=400&text=Housing",
    commercial: "/placeholder.svg?height=200&width=400&text=Commercial",
    regulation: "/placeholder.svg?height=200&width=400&text=Regulation",
    technology: "/placeholder.svg?height=200&width=400&text=Technology",
    safety: "/placeholder.svg?height=200&width=400&text=Safety",
    environment: "/placeholder.svg?height=200&width=400&text=Environment",
    planning: "/placeholder.svg?height=200&width=400&text=Planning",
    general: "/placeholder.svg?height=200&width=400&text=Construction+News",
  }
  return fallbacks[category as keyof typeof fallbacks] || fallbacks.general
}

function generateDemoSummary(content: ScrapedContent): { summary: string; category: string } {
  const title = content.title.toLowerCase()
  const contentText = content.content.toLowerCase()
  
  // Enhanced keyword-based categorization
  const categoryKeywords = {
    infrastructure: ['infrastructure', 'transport', 'railway', 'bridge', 'tunnel', 'highway', 'energy', 'utility', 'water', 'power', 'nuclear', 'gas', 'electricity'],
    housing: ['housing', 'residential', 'homes', 'apartment', 'estate', 'development', 'affordable', 'social housing', 'travelodge', 'hotel'],
    commercial: ['office', 'retail', 'commercial', 'shopping', 'hotel', 'leisure', 'warehouse', 'industrial', 'factory', 'laboratory', 'lab'],
    regulation: ['regulation', 'building control', 'planning', 'policy', 'compliance', 'standard', 'approval', 'permit', 'government', 'procurement', 'banned'],
    technology: ['technology', 'digital', 'bim', 'automation', 'robot', 'ai', 'software', 'innovation', 'tech', 'iot', 'artificial intelligence'],
    safety: ['safety', 'health', 'accident', 'incident', 'protection', 'hse', 'risk', 'hazard', 'security', 'fire'],
    environment: ['environment', 'sustainable', 'green', 'carbon', 'energy efficient', 'renewable', 'eco', 'climate', 'capture'],
    planning: ['planning', 'permission', 'application', 'approval', 'development', 'proposal', 'scheme', 'appeal'],
  }
  
  let detectedCategory = "general"
  let maxMatches = 0
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => 
      title.includes(keyword) || contentText.includes(keyword)
    ).length
    
    if (matches > maxMatches) {
      maxMatches = matches
      detectedCategory = category
    }
  }
  
  // Generate contextual summary based on category
  const templateSummary = demoSummaries.find(s => s.category === detectedCategory) || demoSummaries[0]
  
  // Create more specific summary based on content
  let summary = templateSummary.summary
  
  // Add specific details based on content
  if (title.includes('£') || title.includes('million') || title.includes('billion')) {
    const valueMatch = title.match(/£(\d+(?:\.\d+)?)\s*(million|billion|m|bn)/i)
    if (valueMatch) {
      summary = `£${valueMatch[1]}${valueMatch[2]} ${summary.toLowerCase()}`
    }
  }
  
  if (title.includes('balfour beatty') || title.includes('kier') || title.includes('costain') || title.includes('morgan sindall')) {
    summary = `Major contractor ${summary.toLowerCase()}`
  }
  
  return {
    summary,
    category: detectedCategory,
  }
}

async function generateSummary(content: ScrapedContent): Promise<{ summary: string; category: string }> {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is not configured.");
    return { summary: "Summarization service unavailable.", category: "general" };
  }

  const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});
  // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001", safetySettings, generationConfig });

  const prompt = `
  Please summarize the following article and provide a category from the following list: infrastructure, housing, commercial, regulation, technology, safety, environment, planning, general.
  Do not refer to the article as "the article" or "the content". Do not use the word "article" in your response. Only summarize the content.
  
  Respond in JSON format with "summary" and "category" fields.
  Example: {"summary": "This is a summary.", "category": "infrastructure"}

  Article Title: ${content.title}
  Article Content: ${content.content}
  `;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result.text;

    if (!text) {
      console.error("Gemini API returned an empty response.");
      return { summary: "Summarization failed: Empty response.", category: "general" };
    }

    // Extract JSON string from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let jsonString = text;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    const parsedResponse = JSON.parse(jsonString);

    return {
      summary: parsedResponse.summary,
      category: parsedResponse.category,
    };
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return { summary: "Summarization service error.", category: "general" };
  }
}


export async function summarizeContent(content: ScrapedContent): Promise<Article> {
  const articleId = `${content.sourceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Generate summary and category
  const { summary, category } = await generateSummary(content)
  
  // Calculate read time (average 200 words per minute)
  const wordCount = content.content.split(/\s+/).length
  const readTime = Math.max(1, Math.round(wordCount / 200))
  
  // Format date to UK format
  const ukDate = formatDateToUK(content.publishedDate || new Date().toISOString())
  
  // Ensure we have a proper image URL
  const imageUrl = content.imageUrl && content.imageUrl.startsWith('http') 
    ? content.imageUrl 
    : getImageFallback(category)
  
  return {
    id: articleId,
        title: content.title,
    excerpt: content.content.substring(0, 200) + (content.content.length > 200 ? "..." : ""),
        content: content.content,
    category,
    date: ukDate, // UK format date
    readTime: `${readTime} min read`,
        sourceId: content.sourceId,
    similarity: Math.random() * 0.3 + 0.7, // Random similarity between 0.7 and 1.0
    relatedSources: [content.sourceId],
        url: content.url,
    imageUrl: imageUrl,
        scrapedAt: new Date().toISOString(),
        summarizedAt: new Date().toISOString(),
        summary,
    featured: Math.random() > 0.8, // 20% chance of being featured
    status: "approved", // Auto-approve scraped articles so they appear on main page
  }
}

export async function batchSummarizeArticles(
  contents: ScrapedContent[], 
  onProgress?: (message: string) => void
): Promise<Article[]> {
  onProgress?.("🤖 Starting batch summarization...")
  console.log(`🤖 Starting batch summarization of ${contents.length} articles...`)
  
  const articles: Article[] = []
  
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i]
    
    try {
      onProgress?.(`✅ Processing ${i + 1}/${contents.length}: ${content.title.substring(0, 50)}...`)
      console.log(`✅ Processed ${i + 1}/${contents.length}: ${content.title.substring(0, 50)}...`)
      
      const article = await summarizeContent(content)
      articles.push(article)

      // Small delay to simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      onProgress?.(`❌ Error processing article ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error(`Error summarizing article ${i + 1}:`, error)
      // Continue with other articles even if one fails
    }
  }
  
  onProgress?.(`🎉 Batch summarization completed! ${articles.length} articles processed`)
  console.log(`✅ Batch summarization completed: ${articles.length} articles`)

  return articles
}
