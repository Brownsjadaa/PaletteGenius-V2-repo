"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GeneratorLayout } from "@/components/generator/generator-layout"
import { ImageUploadSection } from "@/components/generator/image-upload-section"
import { ColorExtractionSection } from "@/components/generator/color-extraction-section"
import { PaletteGenerationSection } from "@/components/generator/palette-generation-section"
import { PaletteSaveSection } from "@/components/generator/palette-save-section"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function GeneratorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [generatedPalettes, setGeneratedPalettes] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setCurrentStep(2)
  }

  const handleColorsExtracted = (colors: string[]) => {
    setExtractedColors(colors)
    setCurrentStep(2)
  }

  const handleColorSelected = (color: string) => {
    setSelectedColor(color)
    setCurrentStep(3)
  }

  const handlePalettesGenerated = useCallback((palettes: any[]) => {
    setGeneratedPalettes(palettes)
    setCurrentStep(4)
  }, [])

  const handleStartOver = () => {
    setCurrentStep(1)
    setUploadedImage(null)
    setExtractedColors([])
    setSelectedColor(null)
    setGeneratedPalettes([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <GeneratorLayout user={user} currentStep={currentStep} onStartOver={handleStartOver}>
      <div className="space-y-8">
        {/* Step 1: Image Upload */}
        {currentStep >= 1 && (
          <ImageUploadSection
            onImageUpload={handleImageUpload}
            onColorsExtracted={handleColorsExtracted}
            uploadedImage={uploadedImage}
            isActive={currentStep === 1}
          />
        )}

        {/* Step 2: Color Extraction */}
        {currentStep >= 2 && extractedColors.length > 0 && (
          <ColorExtractionSection
            colors={extractedColors}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelected}
            onPalettesGenerated={handlePalettesGenerated}
            isActive={currentStep === 2}
          />
        )}

        {/* Step 3: Palette Generation - NOW PASSING USER PROP */}
        {currentStep >= 3 && generatedPalettes.length > 0 && (
          <PaletteGenerationSection
            palettes={generatedPalettes}
            dominantColor={selectedColor}
            isActive={currentStep === 3}
            user={user}
          />
        )}

        {/* Step 4: Save Palettes */}
        {currentStep >= 4 && user && (
          <PaletteSaveSection
            palettes={generatedPalettes}
            dominantColor={selectedColor}
            user={user}
            isActive={currentStep === 4}
          />
        )}
      </div>
    </GeneratorLayout>
  )
}
