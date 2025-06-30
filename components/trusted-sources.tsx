import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ExternalLink, Rss } from "lucide-react"
import { getTrustedSources, getSourcesByCategory } from "@/lib/sources"

export function TrustedSources() {
  const trustedSources = getTrustedSources()
  const primarySources = getSourcesByCategory("primary")
  const regulatorySources = getSourcesByCategory("regulatory")
  const technicalSources = getSourcesByCategory("technical")

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "primary":
        return "bg-orange-100 text-orange-800"
      case "regulatory":
        return "bg-red-100 text-red-800"
      case "technical":
        return "bg-blue-100 text-blue-800"
      case "secondary":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted UK Construction Sources</h2>
          <p className="text-lg text-gray-600">
            Our news aggregation draws from the most authoritative sources in the UK construction industry
          </p>
        </div>

        {/* Top Trusted Sources */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Highest Trust Rating (90%+)
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustedSources.map((source) => (
              <Card key={source.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(source.category)}>{source.category}</Badge>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Shield className="w-3 h-3 mr-1" />
                        {source.trustScore}%
                      </Badge>
                      {source.rssAvailable === "Yes" && <Rss className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{source.organisation}</h4>
                  <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                  <a
                    href={source.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Visit Source
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Source Categories */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                Primary News Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {primarySources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{source.organisation}</p>
                      <p className="text-xs text-gray-500">Trust: {source.trustScore}%</p>
                    </div>
                    {source.rssAvailable === "Yes" && <Rss className="w-4 h-4 text-green-600" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Regulatory Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {regulatorySources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{source.organisation}</p>
                      <p className="text-xs text-gray-500">Trust: {source.trustScore}%</p>
                    </div>
                    {source.rssAvailable === "Yes" && <Rss className="w-4 h-4 text-green-600" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Technical Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicalSources.slice(0, 6).map((source) => (
                  <div key={source.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{source.organisation}</p>
                      <p className="text-xs text-gray-500">Trust: {source.trustScore}%</p>
                    </div>
                    {source.rssAvailable === "Yes" && <Rss className="w-4 h-4 text-green-600" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
