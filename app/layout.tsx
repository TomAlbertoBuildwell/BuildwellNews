import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BuildwellAI News - UK Construction Industry News',
  description: 'Curated feed of UK construction industry news, building safety regulations, and latest updates from trusted sources. Powered by AI-driven content analysis.',
  keywords: 'UK construction news, building safety, construction industry, building regulations, infrastructure, housing development',
  authors: [{ name: 'BuildwellAI' }],
  creator: 'BuildwellAI',
  publisher: 'BuildwellAI',
  applicationName: 'BuildwellAI News',
  generator: 'BuildwellAI News Platform',
  category: 'news',
  classification: 'Construction Industry News',
  openGraph: {
    title: 'BuildwellAI News - UK Construction Industry News',
    description: 'Stay updated with the latest UK construction industry news, building safety regulations, and infrastructure developments.',
    url: 'https://buildwellai.com',
    siteName: 'BuildwellAI News',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildwellAI News - UK Construction Industry News',
    description: 'Stay updated with the latest UK construction industry news and building safety regulations.',
    creator: '@buildwellai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />
      </head>
      <body>{children}</body>
    </html>
  )
}
