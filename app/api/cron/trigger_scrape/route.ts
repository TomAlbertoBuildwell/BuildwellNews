import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Scrape cron job triggered at:", new Date().toISOString());

    // Use the VERCEL_URL environment variable provided by Vercel for production,
    // and fall back to localhost for local development. This is more robust.
    const host = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    
    const scrapeApiUrl = `${host}/api/scrape`;

    // Trigger the main scraping process by making a POST request
    const scrapeResponse = await fetch(scrapeApiUrl, {
      method: "POST",
      headers: {
        // It's good practice to add an authorization header to prevent
        // unauthorized users from triggering your scrape endpoint.
        // The key should be stored as an environment variable.
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });

    if (!scrapeResponse.ok) {
      const errorResult = await scrapeResponse.json();
      throw new Error(errorResult.error || `Scraping endpoint failed with status ${scrapeResponse.status}`);
    }

    const result = await scrapeResponse.json();

    return NextResponse.json({
      success: true,
      message: "Scrape cron job completed successfully",
      scrapeResult: result,
    });

  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
