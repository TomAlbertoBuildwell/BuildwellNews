"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScraperStatus } from "@/components/scraper-status"
import { useState } from "react"
import { Settings } from "lucide-react"

export function EnhancedHeader() {
  const [showStatus, setShowStatus] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="BuildwellAI" width={200} height={40} className="h-8 w-auto" />
            </Link>

            {/* Navigation - News only */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/news" className="text-orange-500 font-medium">
                News
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStatus(!showStatus)}
                className="text-gray-700 hover:text-orange-500"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-orange-500">
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
              >
                Try our AI
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Scraper Status Panel */}
      {showStatus && (
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-md">
              <ScraperStatus />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
