"use client"

import { useState } from "react"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFeaturedStories } from "@/components/enhanced-featured-stories"
import { EnhancedLatestUpdates } from "@/components/enhanced-latest-updates"
import { Newsletter } from "@/components/newsletter"
import { CategoryFilter } from "@/components/category-filter"
import { TrustedSources } from "@/components/trusted-sources"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Construction Industry News</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Curated feed distilling the latest UK building‑safety regulations, case‑law and latent‑defect trends into
              actionable briefs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
                className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Try our AI Chat Assistant
              </button>
              <a
                href="https://buildwellai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white underline text-sm"
              >
                Learn more about BuildwellAI →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      {/* Featured Stories */}
      <EnhancedFeaturedStories />

      {/* Latest Updates */}
      <EnhancedLatestUpdates activeCategory={activeCategory} />

      {/* Trusted Sources */}
      <TrustedSources />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  )
}
