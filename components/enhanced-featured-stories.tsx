"use client"

import { EnhancedArticleCard } from "@/components/enhanced-article-card"
import { getFeaturedArticles } from "@/lib/articles-store"
import { useEffect, useState } from "react"
import type { Article } from "@/lib/types"

export function EnhancedFeaturedStories() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])

  useEffect(() => {
    setFeaturedArticles(getFeaturedArticles())
  }, [])

  if (featuredArticles.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">
            No featured articles available. Try running the scraper to fetch latest content.
          </p>
        </div>
      </section>
    )
  }

  const mainFeatured = featuredArticles[0]
  const sideFeatured = featuredArticles.slice(1, 3)

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Featured Story */}
        <div className="lg:col-span-2">
          <EnhancedArticleCard {...mainFeatured} featured={true} />
        </div>

        {/* Side Stories */}
        <div className="space-y-6">
          {sideFeatured.map((article) => (
            <EnhancedArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  )
}
