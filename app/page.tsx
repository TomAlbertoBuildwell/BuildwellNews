"use client"

import { useState } from "react"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFeaturedStories } from "@/components/enhanced-featured-stories"
import { EnhancedLatestUpdates } from "@/components/enhanced-latest-updates"
import { Newsletter } from "@/components/newsletter"
import { CategoryFilter } from "@/components/category-filter"
import { TrustedSources } from "@/components/trusted-sources"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main>
        <EnhancedFeaturedStories />
        <EnhancedLatestUpdates />
      </main>

      {/* Trusted Sources */}
      <TrustedSources />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  )
}
