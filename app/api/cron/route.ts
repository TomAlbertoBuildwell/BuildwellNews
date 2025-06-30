import { NextResponse } from "next/server"

export async function GET() {
  try {
    // This would be called by a cron service every 24 hours
    console.log("Cron job triggered at:", new Date().toISOString())

    // Trigger the scraping process
    const scrapeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/scrape`, {
      method: "POST",
    })

    const result = await scrapeResponse.json()

    return NextResponse.json({
      success: true,
      message: "Cron job completed",
      timestamp: new Date().toISOString(),
      scrapeResult: result,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
