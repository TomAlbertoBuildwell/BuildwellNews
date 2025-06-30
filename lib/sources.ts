export interface Source {
  id: string
  organisation: string
  description: string
  website: string
  rssAvailable: "Yes" | "No" | "Partial"
  category: "primary" | "secondary" | "regulatory" | "technical"
  trustScore: number
}

export const constructionSources: Source[] = [
  {
    id: "surveyor-magazine",
    organisation: "Surveyor Magazine",
    description: "Weekly technical reporting on planning, highways, environment and county works",
    website: "http://www.surveyormagazine.com",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 85,
  },
  {
    id: "building",
    organisation: "Building",
    description: "Leading UK construction news with deep project, policy and regulatory analysis",
    website: "https://www.building.co.uk",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 95,
  },
  {
    id: "construction-enquirer",
    organisation: "Construction Enquirer",
    description: "Project updates, tenders, and market shifts",
    website: "https://www.constructionenquirer.com",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 90,
  },
  {
    id: "construction-index",
    organisation: "The Construction Index",
    description: "Live tenders, new projects, technical and product news",
    website: "https://www.theconstructionindex.co.uk",
    rssAvailable: "Yes",
    category: "primary",
    trustScore: 88,
  },
  {
    id: "planning-resource",
    organisation: "Planning Resource",
    description: "UK planning system insights and policy updates",
    website: "https://www.planningresource.co.uk",
    rssAvailable: "Yes",
    category: "regulatory",
    trustScore: 92,
  },
  {
    id: "inside-housing",
    organisation: "Inside Housing",
    description: "Social housing policy and construction updates",
    website: "https://www.insidehousing.co.uk",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 87,
  },
  {
    id: "construction-management",
    organisation: "Construction Management (CIOB)",
    description: "Technical and project case studies from the CIOB community",
    website: "https://constructionmanagement.co.uk",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 93,
  },
  {
    id: "infrastructure-intelligence",
    organisation: "Infrastructure Intelligence",
    description: "Engineering and infrastructure sector news",
    website: "https://www.infrastructure-intelligence.com",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 89,
  },
  {
    id: "architects-journal",
    organisation: "Architects' Journal",
    description: "Design, architecture practice news, and building regulations",
    website: "https://www.architectsjournal.co.uk",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 91,
  },
  {
    id: "construction-news",
    organisation: "Construction News",
    description: "UK-wide industry updates on projects, contracts and regulation changes",
    website: "https://www.constructionnews.co.uk",
    rssAvailable: "No",
    category: "primary",
    trustScore: 94,
  },
  {
    id: "new-civil-engineer",
    organisation: "New Civil Engineer (NCE)",
    description: "Specialist infrastructure and civil engineering news from ICE",
    website: "https://www.newcivilengineer.com",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 90,
  },
  {
    id: "riba-journal",
    organisation: "RIBA Journal",
    description: "Practice-led industry updates including regulatory change and design innovation",
    website: "https://www.ribaj.com",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 88,
  },
  {
    id: "building-design",
    organisation: "Building Design (BD)",
    description: "Critical architecture commentary and policy insight",
    website: "https://www.bdonline.co.uk",
    rssAvailable: "Yes",
    category: "technical",
    trustScore: 86,
  },
  {
    id: "property-week",
    organisation: "Property Week",
    description: "Covers commercial/residential property with market, legal, regulatory trends",
    website: "https://www.propertyweek.com",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 84,
  },
  {
    id: "estates-gazette",
    organisation: "Estates Gazette (EG)",
    description: "UK commercial property and built-environment insight and data analysis",
    website: "https://www.estatesgazette.co.uk",
    rssAvailable: "Yes",
    category: "secondary",
    trustScore: 85,
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
  return constructionSources.find((source) => source.id === id)
}

export function getSourcesByCategory(category: string): Source[] {
  return constructionSources.filter((source) => source.category === category)
}

export function getTrustedSources(): Source[] {
  return constructionSources.filter((source) => source.trustScore >= 90).sort((a, b) => b.trustScore - a.trustScore)
}
