"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight, Sparkles, Zap, Users } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 bg-[size:20px_20px] opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-100/20 to-blue-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100">
            <Sparkles className="w-3 h-3 mr-1" />
            New: AI-Powered Color Harmony Detection
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Beautiful
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Color Palettes
            </span>
            <br />
            in Seconds
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload any image and instantly extract dominant colors. Generate harmonious palettes with complementary,
            triadic, and monochromatic schemes. Perfect for designers, developers, and creative professionals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button onClick={onGetStarted} size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 group">
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 mb-16">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Trusted by 10,000+ designers</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>500,000+ palettes generated</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>99.9% uptime</span>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-500">PaletteGenius - Color Palette Generator</span>
                </div>
              </div>
              <div className="p-8">
                {/* Mock interface */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600 font-medium">Drop your image here</p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Generated Palettes</h3>
                    <div className="space-y-3">
                      {/* Mock palette */}
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-red-400 rounded"></div>
                        <div className="w-8 h-8 bg-orange-400 rounded"></div>
                        <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                        <div className="w-8 h-8 bg-green-400 rounded"></div>
                        <div className="w-8 h-8 bg-blue-400 rounded"></div>
                        <span className="text-sm text-gray-600 ml-2">Complementary</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-purple-400 rounded"></div>
                        <div className="w-8 h-8 bg-pink-400 rounded"></div>
                        <div className="w-8 h-8 bg-red-400 rounded"></div>
                        <div className="w-8 h-8 bg-orange-400 rounded"></div>
                        <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                        <span className="text-sm text-gray-600 ml-2">Triadic</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-teal-200 rounded"></div>
                        <div className="w-8 h-8 bg-teal-300 rounded"></div>
                        <div className="w-8 h-8 bg-teal-400 rounded"></div>
                        <div className="w-8 h-8 bg-teal-500 rounded"></div>
                        <div className="w-8 h-8 bg-teal-600 rounded"></div>
                        <span className="text-sm text-gray-600 ml-2">Monochromatic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
