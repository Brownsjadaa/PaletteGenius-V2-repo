"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      company: "Figma",
      avatar: "SC",
      content:
        "PaletteGenius has revolutionized my design workflow. I can extract perfect color schemes from inspiration images in seconds. The accessibility checker is a game-changer!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Frontend Developer",
      company: "Vercel",
      avatar: "MR",
      content:
        "The export formats are exactly what I need. CSS variables, Tailwind config, JSON - everything is ready to copy-paste into my projects. Saves me hours every week.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Brand Designer",
      company: "Stripe",
      avatar: "EW",
      content:
        "I love how I can organize palettes into folders for different clients. The folder system keeps everything organized and the export quality is professional-grade.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Creative Director",
      company: "Adobe",
      avatar: "DK",
      content:
        "The AI-powered color extraction is incredibly accurate. It picks up subtle tones that I would miss manually. My team uses this daily for client projects.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Web Designer",
      company: "Shopify",
      avatar: "LT",
      content:
        "Finally, a tool that understands color theory! The complementary and triadic palettes are always harmonious. It's like having a color expert on my team.",
      rating: 5,
    },
    {
      name: "Alex Johnson",
      role: "Product Designer",
      company: "Notion",
      avatar: "AJ",
      content:
        "The mobile experience is fantastic. I can create palettes on the go and sync them across all my devices. The interface is clean and intuitive.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by designers and developers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of creative professionals who trust PaletteGenius for their color workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-teal-600 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Figma</div>
            <div className="text-2xl font-bold text-gray-400">Adobe</div>
            <div className="text-2xl font-bold text-gray-400">Stripe</div>
            <div className="text-2xl font-bold text-gray-400">Vercel</div>
            <div className="text-2xl font-bold text-gray-400">Shopify</div>
            <div className="text-2xl font-bold text-gray-400">Notion</div>
          </div>
        </div>
      </div>
    </section>
  )
}
