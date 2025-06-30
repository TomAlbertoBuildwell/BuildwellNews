import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Get latest scraping session
    const { data: sessions, error: sessionError } = await supabase
      .from('scraping_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (sessionError) {
      throw sessionError
    }

    let logs = []
    if (sessions && sessions.length > 0) {
      // Get logs for the latest session
      const { data: sessionLogs, error: logsError } = await supabase
        .from('scraping_logs')
        .select('*')
        .eq('session_id', sessions[0].id)
        .order('timestamp', { ascending: false })
        .limit(20)

      if (!logsError) {
        logs = sessionLogs || []
      }
    }

    return NextResponse.json({
      success: true,
      currentSession: sessions?.[0] || null,
      recentLogs: logs,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 