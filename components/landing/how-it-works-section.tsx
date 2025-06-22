"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Upload, Palette, Download, ArrowRight } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Upload Your Image",
      description:
        "Drag and drop any image or paste a URL. We support all major image formats including PNG, JPG, and SVG.",
      color: "bg-blue-500",
    },
    {
      step: "02",
      icon: Palette,
      title: "Extract & Generate",
      description:
        "Our AI analyzes your image to extract dominant colors and generates 5 different palette types automatically.",
      color: "bg-purple-500",
    },
    {
      step: "03",
      icon: Download,
      title: "Export & Use",
      description:
        "Download your palettes in multiple formats: CSS, SCSS, JSON, Tailwind, SVG, or PNG for any project.",
      color: "bg-teal-500",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create beautiful color palettes in just three simple steps. No design experience required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gray-300 -translate-y-1/2 z-0"></div>
          <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gray-300 -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                    <span className="text-2xl font-bold text-gray-600">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-xl mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-6">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Demo CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to try it yourself?</h3>
            <p className="text-gray-600 mb-6">See how easy it is to create beautiful color palettes</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Try Free Demo
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Watch Tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
