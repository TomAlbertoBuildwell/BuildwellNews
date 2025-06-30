# BuildwellAI News - Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Gemini AI API Key (optional - for enhanced summaries)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (Required for real-time scraping)
NEXT_PUBLIC_SUPABASE_URL=https://qulninklpaicfdwdprqe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bG5pbmtscGFpY2Zkd2RwcnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTUwMzQsImV4cCI6MjA1NDQ5MTAzNH0.kxrP9q8Z_L1cQYY5BwTLh8it71gP3ZD-OtQmPw-nOz4
```

## Database Setup

The Supabase database has been automatically configured with the following tables:

### `news_articles`
- Stores all scraped articles with metadata
- Includes title, content, summary, images, categories
- Auto-approval system for scraped content

### `news_sources` 
- Configuration for RSS sources
- Trust scores and categorization
- Enable/disable sources

### `scraping_sessions`
- Track scraping sessions with real-time progress
- Statistics and completion status
- Error handling and logging

### `scraping_logs`
- Detailed logs of scraping operations
- Real-time progress updates
- Source-level success/failure tracking

## Features

### Real-Time Scraping
- Live progress tracking in the UI
- Real-time log streaming
- Session management with start/stop controls
- Auto-refresh articles feed

### Persistent Storage
- All articles stored in Supabase
- Duplicate detection using content hashing
- Automatic categorization and tagging
- Image extraction and fallbacks

### Frontend Updates
- Real-time article updates (5-second refresh)
- Live scraping progress in UI
- Automatic publication workflow
- Mobile-responsive design

## Usage

1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Access Scraping Control**
   - Visit `http://localhost:3000/scraping`
   - Click "Start Scraping" to begin
   - Monitor progress in real-time
   - Articles appear automatically on main page

3. **Monitor Main Page**
   - Visit `http://localhost:3000`
   - See featured stories and latest updates
   - Auto-refreshes every 5 seconds during scraping
   - All articles are auto-approved and published

## Architecture

### Supabase Integration
- Real-time database subscriptions
- Session-based scraping with progress tracking
- Comprehensive logging system
- Article storage with metadata

### Scraping Service
- RSS feed processing for 15+ UK construction sources
- Content extraction and image discovery
- AI-powered summarization with Gemini
- Duplicate detection and filtering

### Frontend Components
- Enhanced header with navigation
- Featured stories grid
- Latest updates feed
- Real-time scraping dashboard

## Troubleshooting

### No Articles Appearing
1. Check that scraping session completed successfully
2. Verify Supabase connection in browser console
3. Use "Refresh Articles" button in scraping control
4. Check scraping logs for errors

### Scraping Failures
1. Check internet connection
2. Verify RSS feed URLs are accessible
3. Review error logs in scraping interface
4. Some sources may be temporarily unavailable

### Real-Time Updates Not Working
1. Ensure Supabase environment variables are correct
2. Check browser console for connection errors
3. Verify articles store subscription in components
4. Try manual refresh in scraping control 