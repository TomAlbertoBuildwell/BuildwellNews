"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink, Newspaper, ArrowRight, TrendingUp } from "lucide-react"
import { getCategoryColor, getCategoryIcon, getCategoryPlaceholder } from "@/lib/category-utils"
import { supabaseArticlesStore } from "@/lib/articles-store"
import type { Article } from "@/lib/types"

export function EnhancedLatestUpdates() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // Subscribe to articles store changes
    const unsubscribe = supabaseArticlesStore.subscribe(() => {
      const articles = supabaseArticlesStore.getLatestArticles(showAll ? 20 : 6)
      setLatestArticles(articles)
      setIsLoading(false)
    })

    // Initial load
    const articles = supabaseArticlesStore.getLatestArticles(showAll ? 20 : 6)
    setLatestArticles(articles)
    setIsLoading(supabaseArticlesStore.isDataLoaded() ? false : true)

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      supabaseArticlesStore.refreshFromSupabase()
    }, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [showAll])

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Newspaper className="h-8 w-8 text-orange-500" />
              Latest Updates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-32 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-3" />
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

  if (latestArticles.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Newspaper className="h-8 w-8 text-orange-500" />
              Latest Updates
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles available yet.</p>
              <p className="text-gray-400 text-sm mt-2">New articles will appear here automatically as they are scraped.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Newspaper className="h-8 w-8 text-orange-500" />
              Latest Updates
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {latestArticles.length} article{latestArticles.length !== 1 ? "s" : ""}
              </span>
              {!showAll && latestArticles.length >= 6 && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-2"
                >
                  Show more
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={article.imageUrl || getCategoryPlaceholder(article.category)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryPlaceholder(article.category)
                    }}
                  />
                  {article.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500 text-white text-xs border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
                      <span className="text-xs text-gray-500 truncate max-w-24">
                        {article.sourceId}
                      </span>
                    </div>
                    
                    <Link 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-xs transition-colors"
                    >
                      Read
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {showAll && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(false)}
                className="flex items-center gap-2"
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
