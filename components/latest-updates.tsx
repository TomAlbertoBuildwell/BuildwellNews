import { ArticleCard } from "@/components/article-card"

interface LatestUpdatesProps {
  activeCategory: string
}

export function LatestUpdates({ activeCategory }: LatestUpdatesProps) {
  const updates = [
    {
      title: "Henry Construction administration extended for two years",
      excerpt: "Family construction firm continues under administration as financial restructuring process continues.",
      category: "industry",
      date: "16/01/2025",
      readTime: "2 min read",
      sourceId: "construction-news",
      similarity: 85,
      relatedSources: ["construction-enquirer"],
    },
    {
      title: "Amey profit jumps 31% as £7.8bn pipeline fuels growth plans",
      excerpt:
        "New frameworks, rising margins and global expansion drive successful turnaround for infrastructure specialist.",
      category: "market",
      date: "15/01/2025",
      readTime: "3 min read",
      sourceId: "construction-enquirer",
      similarity: 78,
      relatedSources: ["building"],
    },
    {
      title: "Problem job sinks Mace construction profits",
      excerpt: "Consultancy division now generating more revenue than larger construction arm as company restructures.",
      category: "industry",
      date: "14/01/2025",
      readTime: "4 min read",
      sourceId: "construction-enquirer",
      similarity: 82,
      relatedSources: ["construction-news", "building"],
    },
    {
      title: "UK's biggest data centre plan breaks cover in Lincolnshire",
      excerpt: "£7.6bn AI hyperscale facility near Scunthorpe represents massive investment in digital infrastructure.",
      category: "technology",
      date: "13/01/2025",
      readTime: "3 min read",
      sourceId: "construction-enquirer",
      similarity: 90,
      relatedSources: ["infrastructure-intelligence", "new-civil-engineer"],
    },
    {
      title: "Government seizes control to fast-track £5bn reservoir plan",
      excerpt:
        "Ministers bypass local planning processes for critical water infrastructure projects in Lincolnshire and Fens.",
      category: "regulation",
      date: "12/01/2025",
      readTime: "4 min read",
      sourceId: "planning-resource",
      similarity: 94,
      relatedSources: ["construction-enquirer", "planning-portal"],
    },
    {
      title: "Thames Water seeks tunnelling contractors for £242m drought resilience scheme",
      excerpt: "Major water infrastructure project launches bidding process for Teddington resilience improvements.",
      category: "industry",
      date: "11/01/2025",
      readTime: "3 min read",
      sourceId: "construction-enquirer",
      similarity: 87,
      relatedSources: ["new-civil-engineer", "infrastructure-intelligence"],
    },
  ]

  const filteredUpdates =
    activeCategory === "All"
      ? updates
      : updates.filter((update) => update.category.toLowerCase() === activeCategory.toLowerCase())

  return (
    <section className="container mx-auto px-4 py-12 bg-white">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Updates</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpdates.map((update, index) => (
          <ArticleCard key={index} {...update} />
        ))}
      </div>
    </section>
  )
}
