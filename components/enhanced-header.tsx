"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Menu, X, Database, Home } from "lucide-react"

// Removed under Home:
/*<Link 
href="/scraping" 
className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
>
<Database className="h-4 w-4" />
Scraping Control
</Link>
*/


export function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">BuildwellAI News</h1>
                <p className="text-xs text-gray-600 leading-tight">UK Construction Industry</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search construction news..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                  3
                </Badge>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>

              {/* CTA Button */}
              <Button
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
                className="hidden sm:flex bg-orange-500 hover:bg-orange-600 text-white"
              >
                AI Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

              {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 container mx-auto px-4">
            <nav className="space-y-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                href="/scraping" 
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Database className="h-4 w-4" />
                Scraping Control
              </Link>
              <div className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search news..."
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              <Button
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                AI Chat Assistant
              </Button>
            </nav>
          </div>
        )}


    </>
  )
}
