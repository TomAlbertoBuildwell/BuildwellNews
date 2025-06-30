"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.png"
                alt="BuildwellAI"
                width={200}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Curated feed distilling the latest UK building‑safety regulations, case‑law and latent‑defect trends into
              actionable briefs for construction industry professionals.
            </p>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
                onClick={() => window.open("https://buildwellai.com", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit BuildwellAI.com
              </Button>
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white bg-transparent"
                onClick={() => window.open("https://chat.buildwellai.com", "_blank")}
              >
                Try our AI Chat
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href="https://buildwellai.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://buildwellai.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://chat.buildwellai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  AI Chat Assistant
                </a>
              </li>
              <li>
                <a
                  href="https://buildwellai.com/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://buildwellai.com/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://buildwellai.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trusted Sources Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">Trusted UK Construction Sources</h4>
            <p className="text-gray-400 text-sm">
              Our news aggregation draws from 20+ authoritative sources including HSE, CIOB, RICS, Construction News,
              Building Magazine, and more
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>Construction News</span>
            <span>•</span>
            <span>Building Magazine</span>
            <span>•</span>
            <span>Construction Enquirer</span>
            <span>•</span>
            <span>HSE Building Safety</span>
            <span>•</span>
            <span>CIOB</span>
            <span>•</span>
            <span>RICS</span>
            <span>•</span>
            <span>Planning Resource</span>
            <span>•</span>
            <span>And 13+ more trusted sources</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BuildwellAI. All rights reserved. |
              <a
                href="https://buildwellai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hover:text-orange-500 transition-colors"
              >
                buildwellai.com
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-3">
                <a
                  href="https://twitter.com/buildwellai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/company/buildwellai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@buildwellai.com"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
