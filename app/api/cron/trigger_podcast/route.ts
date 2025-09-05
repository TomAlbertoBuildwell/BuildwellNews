import { NextResponse } from 'next/server';

export async function GET() {
  // Construct the absolute URL to your podcast generation API route.
  // Using process.env.VERCEL_URL is recommended as it's automatically set by Vercel.
  // For local testing, you'd fall back to localhost.
  const host = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const podcastApiUrl = `${host}/api/podcast`;

  try {
    // We use fetch to call our own API route. 
    // The 'no-cache' option ensures we're always running a fresh generation.
    const response = await fetch(podcastApiUrl, { cache: 'no-cache' });

    if (!response.ok) {
      // If the generation route returns an error, log it.
      const errorData = await response.json();
      throw new Error(errorData.error || 'Podcast generation failed with a non-200 status.');
    }

    const result = await response.json();
    console.log('Cron job triggered podcast generation successfully:', result);

    // Return a success message for the cron job log.
    return NextResponse.json({ success: true, message: 'Podcast generation triggered.', details: result });

  } catch (error) {
    console.error('Cron job failed to trigger podcast generation:', error);
    // If the fetch fails, return an error.
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
