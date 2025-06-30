export interface Source {
  id: string
  organisation: string
  description: string
  website: string
  rssUrl?: string
  rssAvailable: "Yes" | "No" | "Partial"
  category: "primary" | "secondary" | "regulatory" | "technical"
  trustScore: number
}

export const constructionSources: Source[] = [
  {
    id: "surveyor-magazine",
    organisation: "Surveyor Magazine",
    description: "Professional surveying insights and regulatory updates for construction",
    website: "https://www.surveyormagazine.co.uk",
    rssUrl: "https://www.surveyormagazine.co.uk/feed/",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 88,
  },
  {
    id: "building",
    organisation: "Building",
    description: "Leading UK construction news with deep project, policy and regulatory analysis",
    website: "https://www.building.co.uk",
    rssUrl: "https://www.building.co.uk/feed",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 95,
  },
  {
    id: "construction-enquirer",
    organisation: "Construction Enquirer",
    description: "Breaking construction industry news and market intelligence",
    website: "https://www.constructionenquirer.com",
    rssUrl: "https://www.constructionenquirer.com/feed/",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 92,
  },
  {
    id: "the-construction-index",
    organisation: "The Construction Index",
    description: "Comprehensive UK construction project news and tenders",
    website: "https://www.theconstructionindex.co.uk",
    rssUrl: "https://www.theconstructionindex.co.uk/news/rss",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 90,
  },
  {
    id: "planning-resource",
    organisation: "Planning Resource",
    description: "UK planning system insights and policy updates",
    website: "https://www.planningresource.co.uk",
    rssUrl: "https://www.planningresource.co.uk/rss",
    rssAvailable: "Yes",
    category: "regulatory",
    trustScore: 92,
  },
  {
    id: "inside-housing",
    organisation: "Inside Housing",
    description: "Social housing policy and construction updates", 
    website: "https://www.insidehousing.co.uk",
    rssUrl: "https://www.insidehousing.co.uk/rss/news",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 87,
  },
  {
    id: "construction-management",
    organisation: "Construction Management (CIOB)",
    description: "Professional construction management insights from CIOB",
    website: "https://www.constructionmanagermagazine.com",
    rssUrl: "https://www.constructionmanagermagazine.com/feed/",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 94,
  },
  {
    id: "infrastructure-intelligence",
    organisation: "Infrastructure Intelligence",
    description: "UK infrastructure policy, projects and investment analysis",
    website: "https://www.infrastructure-intelligence.com",
    rssUrl: "https://www.infrastructure-intelligence.com/rss/news",
    rssAvailable: "Partial",
    category: "secondary",
    trustScore: 89,
  },
  {
    id: "architects-journal",
    organisation: "Architects' Journal",
    description: "Architecture and design news with construction industry insights",
    website: "https://www.architectsjournal.co.uk",
    rssUrl: "https://www.architectsjournal.co.uk/rss/all",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 86,
  },
  {
    id: "construction-news",
    organisation: "Construction News",
    description: "Leading weekly construction news covering major UK projects",
    website: "https://www.constructionnews.co.uk",
    rssUrl: "https://www.constructionnews.co.uk/rss",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 93,
  },
  {
    id: "new-civil-engineer",
    organisation: "New Civil Engineer (NCE)",
    description: "Civil engineering projects, infrastructure and technical innovation",
    website: "https://www.newcivilengineer.com",
    rssUrl: "https://www.newcivilengineer.com/rss",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 95,
  },
  {
    id: "riba-journal",
    organisation: "RIBA Journal",
    description: "Architecture profession news from Royal Institute of British Architects",
    website: "https://www.ribaj.com",
    rssUrl: "https://www.ribaj.com/rss",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 85,
  },
  {
    id: "building-design",
    organisation: "Building Design (BD)",
    description: "Architecture and construction design news and analysis",
    website: "https://www.bdonline.co.uk",
    rssUrl: "https://www.bdonline.co.uk/rss",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 84,
  },
  {
    id: "property-week",
    organisation: "Property Week",
    description: "Commercial property development and construction market news",
    website: "https://www.propertyweek.com",
    rssUrl: "https://www.propertyweek.com/rss",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 82,
  },
  {
    id: "estates-gazette",
    organisation: "Estates Gazette (EG)",
    description: "Property industry news including development and construction",
    website: "https://www.estatesgazette.com",
    rssUrl: "https://www.estatesgazette.com/rss",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 81,
  },
  {
    id: "ciob",
    organisation: "CIOB",
    description: "Updates on construction management, quality, and safety",
    website: "https://www.ciob.org",
    rssAvailable: "Partial",
    category: "regulatory",
    trustScore: 96,
  },
  {
    id: "hse-building-safety",
    organisation: "HSE Building Safety Updates",
    description: "Regulations, safety case requirements, accountable persons",
    website: "https://www.hse.gov.uk/building-safety",
    rssAvailable: "No",
    category: "regulatory",
    trustScore: 98,
  },
  {
    id: "planning-portal",
    organisation: "Planning Portal",
    description: "Official building control and planning regulations",
    website: "https://www.planningportal.co.uk",
    rssAvailable: "No",
    category: "regulatory",
    trustScore: 97,
  },
  {
    id: "rics",
    organisation: "RICS",
    description: "Building safety, technical advice, industry standards",
    website: "https://www.rics.org/news-insights",
    rssAvailable: "No",
    category: "regulatory",
    trustScore: 95,
  },
  {
    id: "nbs",
    organisation: "NBS",
    description: "Building regulations, BIM standards, and technical articles",
    website: "https://www.thenbs.com",
    rssAvailable: "No",
    category: "technical",
    trustScore: 92,
  },
]

export function getSourceById(id: string): Source | undefined {
  return constructionSources.find(source => source.id === id)
}

export function getSourcesByCategory(category: string): Source[] {
  return constructionSources.filter(source => source.category === category)
}

export function getSourcesByTrustScore(minScore: number): Source[] {
  return constructionSources.filter(source => source.trustScore >= minScore)
}


