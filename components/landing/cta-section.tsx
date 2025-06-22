"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface CTASectionProps {
  onGetStarted: () => void
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-teal-600 to-blue-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <Sparkles className="w-16 h-16 text-white/80 mx-auto mb-6" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to create amazing
          <br />
          color palettes?
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of designers and developers who trust PaletteGenius for their color workflow. Start creating
          beautiful palettes today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
          >
            View Demo
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Free forever plan</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
