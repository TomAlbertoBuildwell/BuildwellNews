"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink, TrendingUp, Building, Zap, Shield, TreePine, FileText, MapPin, Image as ImageIcon } from "lucide-react"
import { getCategoryColor, getCategoryIcon, getCategoryPlaceholder, getCategoryIconSVG } from "@/lib/category-utils"
import type { Article } from "@/lib/types"

interface EnhancedArticleCardProps {
  article: Article
  featured?: boolean
}

export function EnhancedArticleCard({ article, featured = false }: EnhancedArticleCardProps) {
  // Provide default values to prevent undefined errors
  const safeArticle = {
    id: article?.id || '',
    title: article?.title || 'Untitled Article',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'general',
    date: article?.date || new Date().toISOString(),
    readTime: article?.readTime || '1 min read',
    sourceId: article?.sourceId || 'unknown',
    similarity: article?.similarity || 0.8,
    relatedSources: article?.relatedSources || [],
    url: article?.url || '',
    imageUrl: article?.imageUrl,
    scrapedAt: article?.scrapedAt || new Date().toISOString(),
    summarizedAt: article?.summarizedAt,
    summary: article?.summary,
    featured: article?.featured || false,
    status: article?.status || 'pending',
  }

  const handleExternalLink = () => {
    if (safeArticle.url) {
      window.open(safeArticle.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      featured ? 'ring-2 ring-orange-200 border-orange-200' : 'border-gray-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={`${getCategoryColor(safeArticle.category)} flex items-center gap-1`}
              >
                {getCategoryIcon(safeArticle.category, "h-4 w-4")}
                {safeArticle.category}
              </Badge>
              
              {featured && (
                <Badge className="bg-orange-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              
              <Badge variant="outline" className="text-xs">
                {safeArticle.sourceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            
            <h3 className={`font-bold leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors ${
              featured ? 'text-lg' : 'text-base'
            }`}>
              {safeArticle.title}
            </h3>
          </div>
          
          {/* Article Image - Always show */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-20 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={safeArticle.imageUrl || getCategoryPlaceholder(safeArticle.category)}
                alt={safeArticle.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to category-specific placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  const fallbackSrc = getCategoryPlaceholder(safeArticle.category)
                  if (target.src !== fallbackSrc) {
                    target.src = fallbackSrc
                  } else {
                    // If even the fallback fails, show icon
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100">${getCategoryIconSVG(safeArticle.category)}</div>`
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {safeArticle.summary || safeArticle.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {safeArticle.readTime}
            </div>
            <time>
              {new Date(safeArticle.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </time>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExternalLink}
            className="h-8 px-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Read More
          </Button>
        </div>
        
        {/* Progress indicator for similarity score */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Relevance Score</span>
            <span>{Math.round(safeArticle.similarity * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${safeArticle.similarity * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
