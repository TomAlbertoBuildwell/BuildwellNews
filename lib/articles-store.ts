import type { Article } from "./types"

// Enhanced articles with images and multiple sources
const articlesStore: Article[] = [
  {
    id: "nuclear-sizewell-c",
    title: "Nuclear to the fore as Sizewell C gains £14.2bn in public funding",
    excerpt:
      "The UK government has announced a significant £14.2 billion investment in the Sizewell C nuclear power station, marking one of the largest infrastructure investments in recent years.",
    content: "Full article content would be here...",
    category: "industry",
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
    category: "industry",
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
    category: "industry",
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
    category: "market",
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

export function getAllArticles(): Article[] {
  return articlesStore.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === "All") return getAllArticles()
  return articlesStore
    .filter((article) => article.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getFeaturedArticles(): Article[] {
  return articlesStore.filter((article) => article.featured).slice(0, 3)
}

export function addArticle(article: Article): void {
  articlesStore.push(article)
}

export function updateArticle(id: string, updates: Partial<Article>): void {
  const index = articlesStore.findIndex((article) => article.id === id)
  if (index !== -1) {
    articlesStore[index] = { ...articlesStore[index], ...updates }
  }
}

export function getArticleById(id: string): Article | undefined {
  return articlesStore.find((article) => article.id === id)
}
