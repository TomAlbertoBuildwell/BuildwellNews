"use client"

import { EnhancedArticleCard } from "@/components/enhanced-article-card"
import { getArticlesByCategory } from "@/lib/articles-store"
import { useEffect, useState } from "react"
import type { Article } from "@/lib/types"

interface EnhancedLatestUpdatesProps {
  activeCategory: string
}

export function EnhancedLatestUpdates({ activeCategory }: EnhancedLatestUpdatesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const filteredArticles = getArticlesByCategory(activeCategory)
      setArticles(filteredArticles.filter((article) => !article.featured))
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [activeCategory])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Updates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg h-80 shadow-lg"
            ></div>
          ))}
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Updates</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">
            No articles found for category "{activeCategory}". Try selecting a different category or run the scraper to
            fetch new content.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12 bg-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Latest Updates</h2>
        <div className="text-sm text-gray-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <EnhancedArticleCard key={article.id} {...article} />
        ))}
      </div>
    </section>
  )
}
