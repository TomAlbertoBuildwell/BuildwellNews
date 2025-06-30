"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Thank you for subscribing!</h2>
              <p className="text-white/90 mb-4">
                You'll receive the latest UK construction industry news and insights directly in your inbox.
              </p>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
              >
                Try our AI Chat
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-orange-500 to-yellow-500 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Get the latest construction industry news delivered to your inbox
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-orange-500 hover:bg-gray-100 font-medium"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          <div className="text-white/80 text-sm">
            <p className="mb-2">Join thousands of construction professionals staying informed</p>
            <p>
              Want instant answers to building regulations?
              <button
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
                className="ml-1 underline hover:text-white transition-colors"
              >
                Try our AI Chat →
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
