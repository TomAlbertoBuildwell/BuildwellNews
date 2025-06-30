"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function ScraperStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastScrape, setLastScrape] = useState<string | null>(null)
  const [scrapeResult, setScrapeResult] = useState<any>(null)

  const triggerScrape = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
      })
      const result = await response.json()
      setScrapeResult(result)
      setLastScrape(new Date().toISOString())
    } catch (error) {
      console.error("Scrape failed:", error)
      setScrapeResult({ success: false, error: "Failed to trigger scrape" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 text-orange-500" />
          Content Scraper Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Last scrape: {lastScrape ? new Date(lastScrape).toLocaleString() : "Never"}
              </span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              24h Auto-Sync
            </Badge>
          </div>

          {scrapeResult && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                {scrapeResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium">{scrapeResult.success ? "Success" : "Failed"}</span>
              </div>
              <p className="text-sm text-gray-600">{scrapeResult.message}</p>
              {scrapeResult.count && (
                <p className="text-xs text-gray-500 mt-1">Processed {scrapeResult.count} articles</p>
              )}
            </div>
          )}

          <Button
            onClick={triggerScrape}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scraping & Summarizing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Trigger Manual Scrape
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Automated scraping runs every 24 hours</p>
            <p>• Content summarized using Gemini 2.0 Flash</p>
            <p>• Sources: 20+ UK construction publications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
