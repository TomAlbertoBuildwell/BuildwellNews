"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, TrendingUp } from "lucide-react"
import { getCategoryColor, getCategoryIcon, getCategoryPlaceholder } from "@/lib/category-utils"
import { supabaseArticlesStore } from "@/lib/articles-store"
import type { Article } from "@/lib/types"

export function EnhancedFeaturedStories() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribe to articles store changes
    const unsubscribe = supabaseArticlesStore.subscribe(() => {
      const featured = supabaseArticlesStore.getFeaturedArticles()
      setFeaturedArticles(featured.slice(0, 3)) // Show top 3 featured stories
      setIsLoading(false)
    })

    // Initial load
    const featured = supabaseArticlesStore.getFeaturedArticles()
    setFeaturedArticles(featured.slice(0, 3))
    setIsLoading(supabaseArticlesStore.isDataLoaded() ? false : true)

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      supabaseArticlesStore.refreshFromSupabase()
    }, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-4" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredArticles.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              Featured Stories
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured stories available yet.</p>
              <p className="text-gray-400 text-sm mt-2">New articles will appear here automatically.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            Featured Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-shadow border border-orange-200">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.imageUrl || getCategoryPlaceholder(article.category)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryPlaceholder(article.category)
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500 text-white border-0">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(article.category)} flex items-center gap-1`}
                      >
                        {getCategoryIcon(article.category)}
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500 truncate max-w-24">{article.sourceId}</span>
                    </div>
                    
                    <Link 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                    >
                      Read more
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {featuredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured stories available.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for the latest construction news.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
