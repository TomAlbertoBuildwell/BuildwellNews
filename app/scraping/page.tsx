"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  Clock
} from "lucide-react"
import { EnhancedHeader } from "@/components/enhanced-header"
import { supabaseArticlesStore } from "@/lib/articles-store"
import { supabase } from "@/lib/supabase"

interface ScrapingStats {
  totalSources: number
  processedSources: number
  totalArticles: number
  newArticles: number
  duplicateArticles: number
  failedSources: number
}

interface ScrapingLog {
  id: string
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
  source_name?: string
  articles_found?: number
  timestamp: string
}

interface ScrapingSession {
  id: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  completed_at?: string
  total_sources: number
  processed_sources: number
  total_articles: number
  new_articles: number
  duplicate_articles: number
  failed_sources: number
}

export default function ScrapingPage() {
  const [isScrapingActive, setIsScrapingActive] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentSession, setCurrentSession] = useState<ScrapingSession | null>(null)
  const [logs, setLogs] = useState<ScrapingLog[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Auto-refresh session status and logs
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isScrapingActive || currentSession) {
      interval = setInterval(async () => {
        await fetchLatestSession()
        await fetchLatestLogs()
      }, 2000) // Poll every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScrapingActive])

  // Initial load
  useEffect(() => {
    fetchLatestSession()
    fetchLatestLogs()
  }, [])

  const fetchLatestSession = async () => {
    try {
      const { data: session } = await supabase
        .from('scraping_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (session) {
        setCurrentSession(session)
        setIsScrapingActive(session.status === 'running')
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching session:', error)
    }
  }

  const fetchLatestLogs = async () => {
    if (!currentSession) return

    try {
      const { data: sessionLogs } = await supabase
        .from('scraping_logs')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('timestamp', { ascending: false })
        .limit(20)

      if (sessionLogs) {
        setLogs(sessionLogs)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const handleStartScraping = async () => {
    try {
      setIsScrapingActive(true)
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Scraping failed')
      }

      // Start polling for updates
      setTimeout(() => {
        fetchLatestSession()
        fetchLatestLogs()
      }, 1000)

    } catch (error) {
      console.error('Failed to start scraping:', error)
      setIsScrapingActive(false)
      alert(`Failed to start scraping: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleStopScraping = async () => {
    if (!currentSession) return

    try {
      await supabase
        .from('scraping_sessions')
        .update({ 
          status: 'cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('id', currentSession.id)

      setIsScrapingActive(false)
    } catch (error) {
      console.error('Failed to stop scraping:', error)
    }
  }

  const handleRefreshArticles = async () => {
    setRefreshing(true)
    try {
      await supabaseArticlesStore.refreshFromSupabase()
    } catch (error) {
      console.error('Failed to refresh articles:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getProgressPercentage = () => {
    if (!currentSession || currentSession.total_sources === 0) return 0
    return Math.round((currentSession.processed_sources / currentSession.total_sources) * 100)
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLogTextColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-700'
      case 'error': return 'text-red-700'
      case 'warning': return 'text-yellow-700'
      default: return 'text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Scraping Control Center</h1>
            <p className="text-gray-600">
              Monitor and control the real-time scraping of UK construction news sources. 
              All scraped articles are automatically published and appear on the main page.
            </p>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Scraping Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Scraping Controls
                </CardTitle>
                <CardDescription>
                  Start or stop the RSS scraping process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleStartScraping}
                    disabled={isScrapingActive}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isScrapingActive ? 'Scraping Active...' : 'Start Scraping'}
                  </Button>
                  
                  <Button
                    onClick={handleStopScraping}
                    disabled={!isScrapingActive}
                    variant="destructive"
                    className="w-full"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Scraping
                  </Button>

                  <Button
                    onClick={handleRefreshArticles}
                    disabled={refreshing}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Articles
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status:</span>
                    <div className="flex items-center gap-2">
                      {isScrapingActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      <Badge variant={isScrapingActive ? "default" : "secondary"}>
                        {isScrapingActive ? 'Active' : 'Idle'}
                      </Badge>
                    </div>
                  </div>
                  {currentSession && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Session: {currentSession.id.slice(0, 8)}...</div>
                      {lastUpdate && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last update: {lastUpdate.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  Real-time scraping progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentSession ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sources Processed</span>
                        <span>{currentSession.processed_sources}/{currentSession.total_sources}</span>
                      </div>
                      <Progress value={getProgressPercentage()} className="h-2" />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div>Status: <span className="font-medium capitalize">{currentSession.status}</span></div>
                      <div className="mt-1 text-xs bg-gray-100 p-2 rounded">
                        Started: {new Date(currentSession.started_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active scraping session</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>
                  Current session statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentSession ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{currentSession.total_articles}</div>
                      <div className="text-gray-500">Total Articles</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">{currentSession.new_articles}</div>
                      <div className="text-gray-500">Published Articles</div>
                    </div>
                    <div>
                      <div className="font-medium text-yellow-600">{currentSession.duplicate_articles}</div>
                      <div className="text-gray-500">Duplicates Filtered</div>
                    </div>
                    <div>
                      <div className="font-medium text-red-600">{currentSession.failed_sources}</div>
                      <div className="text-gray-500">Failed Sources</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-2xl font-bold">0</div>
                    <p>No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Live Scraping Logs</CardTitle>
                <CardDescription>
                  Real-time progress updates and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {logs && logs.length > 0 ? (
                    <div className="space-y-2">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2 p-2 rounded-md bg-gray-50">
                          {getLogIcon(log.level)}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm ${getLogTextColor(log.level)}`}>
                              {log.message}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleTimeString()}
                              {log.source_name && ` • ${log.source_name}`}
                              {log.articles_found !== undefined && ` • ${log.articles_found} articles`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No logs available</p>
                        <p className="text-xs">Start scraping to see live updates</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* RSS Sources Status */}
            <Card>
              <CardHeader>
                <CardTitle>RSS Sources Status</CardTitle>
                <CardDescription>
                  Current status of all RSS feed sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {logs
                      .filter(log => log.source_name)
                      .reduce((acc, log) => {
                        const existing = acc.find(item => item.source_name === log.source_name)
                        if (!existing || new Date(log.timestamp) > new Date(existing.timestamp)) {
                          return [...acc.filter(item => item.source_name !== log.source_name), log]
                        }
                        return acc
                      }, [] as ScrapingLog[])
                      .map((log) => (
                        <div key={log.source_name} className="flex items-center justify-between p-2 rounded border">
                          <div className="flex items-center gap-2">
                            {getLogIcon(log.level)}
                            <span className="text-sm font-medium">{log.source_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {log.articles_found !== undefined && (
                              <Badge variant="outline" className="text-xs">
                                {log.articles_found} articles
                              </Badge>
                            )}
                            <Badge variant={log.level === 'success' ? 'default' : log.level === 'error' ? 'destructive' : 'secondary'}>
                              {log.level === 'success' ? 'Success' : log.level === 'error' ? 'Failed' : 'Processing'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 