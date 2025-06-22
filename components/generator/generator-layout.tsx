"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Palette, ArrowLeft, RotateCcw, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface GeneratorLayoutProps {
  user: SupabaseUser | null
  currentStep: number
  onStartOver: () => void
  children: React.ReactNode
}

export function GeneratorLayout({ user, currentStep, onStartOver, children }: GeneratorLayoutProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const steps = [
    { id: 1, title: "Upload Image", description: "Choose an image to extract colors from" },
    { id: 2, title: "Select Color", description: "Pick a dominant color for palette generation" },
    { id: 3, title: "Generate Palettes", description: "View your generated color palettes" },
    { id: 4, title: "Save & Export", description: "Save your favorite palettes" },
  ]

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(user ? "/dashboard" : "/")}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Palette Generator</h1>
                  <p className="text-xs text-gray-500">Create beautiful color palettes from images</p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onStartOver}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>

              {user ? (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600">
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/auth")}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => router.push("/auth")} className="bg-teal-600 hover:bg-teal-700">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </h2>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">{steps[currentStep - 1]?.description}</p>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id
                      ? "bg-teal-600 text-white"
                      : currentStep === step.id
                        ? "bg-teal-100 text-teal-700 border-2 border-teal-600"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 h-0.5 ml-4 ${
                      currentStep > step.id ? "bg-teal-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
