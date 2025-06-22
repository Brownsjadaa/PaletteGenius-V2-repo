"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Palette,
  Upload,
  Download,
  Folder,
  Eye,
  Zap,
  Shield,
  Smartphone,
  Code,
  Sparkles,
  Users,
  BarChart3,
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Smart Image Upload",
      description: "Drag & drop images or load from URLs. Supports PNG, JPG, SVG, and more formats.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Palette,
      title: "5 Palette Types",
      description: "Generate complementary, triadic, analogous, split-complementary, and monochromatic palettes.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Export as CSS, SCSS, JSON, Tailwind config, SVG, or PNG images for any workflow.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Folder,
      title: "Organize with Folders",
      description: "Create folders to organize your palettes by project, client, or theme.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Eye,
      title: "Accessibility Checker",
      description: "Check WCAG contrast ratios to ensure your colors meet accessibility standards.",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Extract colors and generate palettes in seconds with our optimized algorithms.",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your images and palettes are secure. We never store your uploaded images.",
      color: "bg-teal-50 text-teal-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Works perfectly on desktop, tablet, and mobile devices. Create anywhere.",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Export formats designed for developers. Copy-paste ready code snippets.",
      color: "bg-pink-50 text-pink-600",
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to create
            <br />
            <span className="text-teal-600">perfect color palettes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From image upload to final export, we've got every step of your color workflow covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">10,000+</span>
              </div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">500K+</span>
              </div>
              <p className="text-gray-600">Palettes Generated</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">99.9%</span>
              </div>
              <p className="text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
