import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Get latest 10 articles from database
    const { data: articles, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      count: articles?.length || 0,
      articles: articles?.map(article => ({
        id: article.id,
        title: article.title,
        source: article.source_name,
        published_date: article.published_date,
        created_at: article.created_at,
        status: article.status,
        category: article.category
      })) || []
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 