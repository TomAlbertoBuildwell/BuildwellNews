import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL; //'https://qulninklpaicfdwdprqe.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bG5pbmtscGFpY2Zkd2RwcnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTUwMzQsImV4cCI6MjA1NDQ5MTAzNH0.kxrP9q8Z_L1cQYY5BwTLh8it71gP3ZD-OtQmPw-nOz4'

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLIC_URL is not defined in lib/supabase.ts');
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in lib/supabase.ts');
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);


// Database types
export interface NewsArticle {
  id: string
  title: string
  content?: string
  summary?: string
  url: string
  image_url?: string
  published_date?: string
  source_name: string
  source_url?: string
  category: string
  tags?: string[]
  content_hash?: string
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  priority: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface NewsSource {
  id: string
  name: string
  url: string
  rss_url?: string
  category: string
  trust_score: number
  is_active: boolean
  last_scraped_at?: string
  scrape_count: number
  success_count: number
  created_at: string
  updated_at: string
}

export interface ScrapingSession {
  id: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  total_sources: number
  processed_sources: number
  total_articles: number
  new_articles: number
  duplicate_articles: number
  failed_sources: number
  started_at: string
  completed_at?: string
  error_message?: string
}

export interface ScrapingLog {
  id: string
  session_id: string
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
  source_name?: string
  articles_found?: number
  timestamp: string
} 