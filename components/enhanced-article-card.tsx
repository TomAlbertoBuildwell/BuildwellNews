import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, Shield, Zap, Brain, LinkIcon } from "lucide-react"
import { getSourceById, type Source } from "@/lib/sources"
import type { Article } from "@/lib/types"

interface EnhancedArticleCardProps extends Omit<Article, "content" | "scrapedAt" | "summarizedAt"> {
  featured?: boolean
}

export function EnhancedArticleCard({
  title,
  excerpt,
  category,
  date,
  readTime,
  sourceId,
  similarity = 0,
  relatedSources = [],
  imageUrl,
  originalSources = [],
  featured = false,
}: EnhancedArticleCardProps) {
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

  return (
    <Card
      className={`group border-0 transition-all duration-300 hover:scale-[1.02] ${
        featured
          ? "bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 shadow-2xl hover:shadow-3xl ring-1 ring-orange-100"
          : "bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-2xl"
      } backdrop-blur-sm`}
      style={{
        boxShadow: featured
          ? "0 25px 50px -12px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.05)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <CardContent className="p-0">
        {/* Image */}
        {imageUrl && (
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              width={400}
              height={200}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-lg">
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Header with category and trust indicators */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-orange-200"
              >
                {category}
              </Badge>
              {source && (
                <Badge variant="outline" className={`text-xs ${getTrustBadgeColor(source.trustScore)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {source.trustScore}%
                </Badge>
              )}
            </div>
            <span className="text-sm text-gray-500">{date}</span>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-gray-900 mb-3 leading-tight transition-colors group-hover:text-orange-600 ${
              featured ? "text-xl" : "text-lg"
            }`}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{excerpt}</p>

          {/* AI Summary Indicator */}
          {originalSources && originalSources.length > 1 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-900">AI-Summarized from Multiple Sources</span>
              </div>
              <p className="text-xs text-blue-700">
                This story has been intelligently summarized from {originalSources.length} trusted construction industry
                sources
              </p>
            </div>
          )}

          {/* Source Information */}
          {source && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg p-3 mb-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm text-gray-900">{source.organisation}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      source.rssAvailable === "Yes" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
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

          {/* Original Sources Links */}
          {originalSources && originalSources.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center">
                <LinkIcon className="w-3 h-3 mr-1" />
                Read original articles:
              </p>
              <div className="space-y-1">
                {originalSources.map((originalSource, index) => {
                  const sourceData = getSourceById(originalSource.sourceId)
                  return (
                    <a
                      key={index}
                      href={originalSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-xs bg-white rounded p-2 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group/link"
                    >
                      <span className="font-medium text-gray-700 group-hover/link:text-orange-700">
                        {sourceData?.organisation || originalSource.sourceId}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover/link:text-orange-500" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Related Sources */}
          {relatedSourcesData.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Also covered by:</p>
              <div className="flex flex-wrap gap-1">
                {relatedSourcesData.map((relatedSource) => (
                  <Badge
                    key={relatedSource.id}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
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
            <button className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors hover:underline">
              Read Summary
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
