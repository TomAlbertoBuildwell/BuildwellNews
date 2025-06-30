import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, Shield, Zap } from "lucide-react"
import { getCategoryColor, getCategoryIcon, getCategoryPlaceholder } from "@/lib/category-utils"
import { getSourceById, type Source } from "@/lib/sources"

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  sourceId: string
  similarity?: number
  relatedSources?: string[]
  featured?: boolean
  imageUrl?: string
  url?: string
}

export function ArticleCard({
  title,
  excerpt,
  category,
  date,
  readTime,
  sourceId,
  similarity = 0,
  relatedSources = [],
  featured = false,
  imageUrl,
  url,
}: ArticleCardProps) {
  const source = getSourceById(sourceId)
  const relatedSourcesData = relatedSources.map((id) => getSourceById(id)).filter(Boolean) as Source[]

  const getTrustBadgeColor = (trustScore: number) => {
    if (trustScore >= 95) return "bg-green-100 text-green-800 border-green-200"
    if (trustScore >= 90) return "bg-blue-100 text-blue-800 border-blue-200"
    if (trustScore >= 85) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-gray-500"
  }

  const handleExternalLink = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card
      className={`border-0 shadow-md hover:shadow-lg transition-all duration-200 ${featured ? "ring-2 ring-orange-200" : ""}`}
    >
      {/* Article Image */}
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl || getCategoryPlaceholder(category)}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = getCategoryPlaceholder(category)
            }}
          />
          {featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-orange-500 text-white">
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-6">
        {/* Header with category and trust indicators */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`${getCategoryColor(category)} flex items-center gap-1`}
            >
              {getCategoryIcon(category)}
              {category}
            </Badge>
            {source && (
              <Badge variant="outline" className={`text-xs ${getTrustBadgeColor(source.trustScore)}`}>
                <Shield className="w-3 h-3 mr-1" />
                Trust: {source.trustScore}%
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">{date}</span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-3 leading-tight ${featured ? "text-xl" : "text-lg"}`}>{title}</h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{excerpt}</p>

        {/* Source Information */}
        {source && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm text-gray-900">{source.organisation}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${source.rssAvailable === "Yes" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {source.rssAvailable === "Yes" ? "Live Feed" : "Manual"}
                </Badge>
              </div>
              {similarity > 0 && (
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs font-medium ${getSimilarityColor(similarity)}`}>{similarity}% match</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600">{source.description}</p>
          </div>
        )}

        {/* Related Sources */}
        {relatedSourcesData.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Also reported by:</p>
            <div className="flex flex-wrap gap-1">
              {relatedSourcesData.map((relatedSource) => (
                <Badge
                  key={relatedSource.id}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {relatedSource.organisation}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
          <button 
            onClick={handleExternalLink}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
          >
            Read More
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
