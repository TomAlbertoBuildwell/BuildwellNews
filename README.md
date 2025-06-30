# BuildwellAI News - UK Construction Industry News Aggregator

A modern news aggregation platform specifically designed for UK construction professionals, featuring automated RSS scraping, AI-powered summarization, and intelligent duplicate detection.

## 🚀 Features

### Core Functionality
- **RSS Feed Scraping**: Automated scraping from 15+ trusted UK construction news sources
- **AI Summarization**: Gemini AI-powered article summarization for quick insights
- **Duplicate Detection**: Intelligent filtering to avoid duplicate content
- **Real-time Processing**: Live scraping status and progress monitoring
- **Manual Control**: Dedicated scraping control page for on-demand updates

### News Sources
The platform aggregates content from trusted UK construction industry sources including:
- **Primary Sources**: Building Magazine, Construction Enquirer, Construction News, The Construction Index
- **Technical Sources**: Construction Management (CIOB), Architects' Journal, New Civil Engineer
- **Regulatory Sources**: Planning Resource, Inside Housing, RIBA Journal
- **Market Sources**: Property Week, Estates Gazette, Infrastructure Intelligence

### UI Features
- **Modern Design**: Clean, professional interface optimized for construction professionals
- **Responsive Layout**: Mobile-first design that works on all devices
- **Category Filtering**: Filter articles by safety, technology, market, regulation, housing, infrastructure
- **Advanced Search**: Search functionality across all aggregated content
- **Real-time Updates**: Live scraping progress and status monitoring

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with TypeScript
- **UI Components**: Tailwind CSS + Radix UI
- **RSS Parsing**: Custom XML parser with content extraction
- **AI Integration**: Google Gemini API for summarization
- **Duplicate Detection**: Content hashing with MD5
- **State Management**: React hooks with local storage

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/buildwellai-news.git
   cd buildwellai-news
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Add your Gemini API key to .env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

```env
# Required for AI summarization
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Alternative client-side key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Environment
NODE_ENV=development
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file
4. Restart the development server

## 🎯 Usage

### Manual Scraping
1. Navigate to `/scraping` in your browser
2. Click "Start Scraping" to begin the process
3. Monitor real-time progress and logs
4. View summary of processed articles

### Automated Features
- **Duplicate Detection**: Automatically filters out duplicate articles
- **Content Categorization**: Articles are automatically categorized
- **Source Attribution**: Each article tracks its original source
- **Time Tracking**: Processing times and timestamps are recorded

### API Endpoints

#### POST /api/scrape
Triggers the scraping process for all RSS sources
```json
{
  "success": true,
  "count": 25,
  "added": 20,
  "duplicates": 5,
  "summary": {
    "totalProcessed": 25,
    "newArticles": 20,
    "duplicatesFiltered": 5,
    "sources": 8
  }
}
```

#### GET /api/scrape
Returns scraper status and information
```json
{
  "message": "BuildwellAI Scraper endpoint active",
  "status": "ready",
  "version": "1.0.0",
  "sources": "UK Construction RSS feeds"
}
```

## 📊 Scraping Process

### RSS Sources Processing
1. **Source Discovery**: Identifies RSS-enabled sources from curated list
2. **RSS Parsing**: Custom XML parser extracts article metadata
3. **Content Extraction**: Full article content retrieved from source URLs
4. **Duplicate Detection**: MD5 hashing prevents duplicate processing
5. **AI Summarization**: Gemini API generates concise summaries
6. **Categorization**: Automatic category assignment based on content
7. **Storage**: Articles stored with full metadata and relationships

### Performance Optimization
- **Rate Limiting**: Respectful delays between source requests
- **Error Handling**: Graceful fallback for failed sources
- **Content Limits**: Reasonable content length limits for processing
- **Caching**: Duplicate detection prevents reprocessing

## 🔍 Source Categories

- **Primary** (95-90 trust score): Main industry news sources
- **Technical** (93-86 trust score): Specialized technical publications
- **Regulatory** (98-92 trust score): Government and regulatory bodies
- **Secondary** (87-84 trust score): Supporting industry publications

## 🚀 Deployment

### Vercel (Recommended)
```bash
pnpm build
vercel --prod
```

### Docker
```bash
docker build -t buildwellai-news .
docker run -p 3000:3000 buildwellai-news
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [BuildwellAI Main Site](https://buildwellai.com)
- [AI Chat Assistant](https://chat.buildwellai.com)
- [Google Gemini API](https://aistudio.google.com/)

## 📞 Support

For questions, issues, or suggestions:
- Create an issue on GitHub
- Visit [BuildwellAI](https://buildwellai.com) for general support
- Use the integrated AI chat for immediate assistance

---

Built with ❤️ for the UK Construction Industry 