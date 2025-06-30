import { ArticleCard } from "@/components/article-card"

export function FeaturedStories() {
  const featuredStory = {
    title: "Nuclear to the fore as Sizewell C gains £14.2bn in public funding",
    excerpt:
      "The UK government has announced a significant £14.2 billion investment in the Sizewell C nuclear power station, marking one of the largest infrastructure investments in recent years. This massive funding injection will support thousands of construction jobs and represents a major step forward in the UK's clean energy strategy. The project is expected to provide reliable low-carbon electricity for over 6 million homes and will require extensive civil engineering, specialized construction techniques, and strict safety protocols.",
    category: "industry",
    date: "16/01/2025",
    readTime: "4 min read",
    sourceId: "construction-news",
    similarity: 95,
    relatedSources: ["building", "construction-enquirer", "infrastructure-intelligence"],
  }

  const otherStories = [
    {
      title: "Laing O'Rourke wins £920m animal health super-lab job",
      excerpt:
        "Major contractor secures flagship laboratory contract as part of £2.8bn DEFRA animal diseases complex rebuild programme.",
      category: "industry",
      date: "15/01/2025",
      readTime: "3 min read",
      sourceId: "construction-enquirer",
      similarity: 88,
      relatedSources: ["building", "construction-news"],
    },
    {
      title: "Scotland eyes £3bn cladding fix as levy targets house builders",
      excerpt:
        "Scottish ministers plan to raise £30m annually from developers to fund comprehensive building safety improvements across the country.",
      category: "safety",
      date: "15/01/2025",
      readTime: "4 min read",
      sourceId: "building",
      similarity: 92,
      relatedSources: ["hse-building-safety", "inside-housing"],
    },
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Featured Story */}
        <div className="lg:col-span-2">
          <ArticleCard {...featuredStory} featured={true} />
        </div>

        {/* Side Stories */}
        <div className="space-y-6">
          {otherStories.map((story, index) => (
            <ArticleCard key={index} {...story} />
          ))}
        </div>
      </div>
    </section>
  )
}
