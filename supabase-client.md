TypeScript Implementation

1. Using Supabase Client

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
'https://supabase.buildwell.online',
'your-anon-key' // Use ANON_KEY from your .env
)

// Insert a podcast link
async function insertPodcastLink(url: string, filename: string) {
const { data, error } = await supabase
  .from('news_podcasts')
  .insert([
	{
	  minio_url: url,
	  filename: filename
	  // created_at is auto-generated
	  // id is auto-generated
	}
  ])
  .select()

if (error) {
  console.error('Error inserting podcast:', error)
  return null
}

console.log('Podcast inserted:', data)
return data
}

// Example usage
await insertPodcastLink(
'https://minio.example.com/podcasts/episode-123.mp3',
'episode-123.mp3'
)

2. Using Direct PostgreSQL Connection

import { Client } from 'pg'

const client = new Client({
host: 'localhost',
port: 54322,
database: 'postgres',
user: 'postgres',
password: process.env.POSTGRES_PASSWORD
})

async function insertPodcastDirect(url: string, filename: string) {
await client.connect()

try {
  const query = `
	INSERT INTO news_podcasts (minio_url, filename)
	VALUES ($1, $2)
	RETURNING *
  `

  const result = await client.query(query, [url, filename])
  console.log('Inserted podcast:', result.rows[0])
  return result.rows[0]
} catch (error) {
  console.error('Error inserting podcast:', error)
  throw error
} finally {
  await client.end()
}
}

3. Batch Insert Multiple Podcasts

async function insertMultiplePodcasts(podcasts: Array<{url: string, filename: string}>) {
const { data, error } = await supabase
  .from('news_podcasts')
  .insert(
	podcasts.map(p => ({
	  minio_url: p.url,
	  filename: p.filename
	}))
  )
  .select()

if (error) {
  console.error('Error inserting podcasts:', error)
  return null
}

return data
}

// Example
await insertMultiplePodcasts([
{ url: 'https://minio.example.com/podcast1.mp3', filename: 'podcast1.mp3' },
{ url: 'https://minio.example.com/podcast2.mp3', filename: 'podcast2.mp3' }
])

4. With Error Handling and Validation

interface PodcastInsert {
minio_url: string
filename: string
}

async function insertPodcastSafely(podcast: PodcastInsert) {
// Validation
if (!podcast.minio_url || !podcast.filename) {
  throw new Error('URL and filename are required')
}

try {
  const { data, error } = await supabase
	.from('news_podcasts')
	.insert([podcast])
	.select()
	.single()

  if (error) throw error

  return { success: true, data }
} catch (error) {
  console.error('Failed to insert podcast:', error)
  return { success: false, error }
}
}

The table has no RLS policies enabled, so you'll need appropriate authentication (anon key or service role key) to
insert data.