"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { extractDominantColors } from "@/lib/color-extraction"
import Image from "next/image"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  onColorsExtracted: (colors: string[]) => void
}

export function ImageUpload({ onImageUpload, onColorsExtracted }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PNG, JPG, JPEG, or SVG image")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("Image size must be less than 10MB")
        return
      }

      setIsProcessing(true)
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      onImageUpload(imageUrl)

      try {
        console.log("Starting color extraction for:", imageUrl) // Debug log
        const colors = await extractDominantColors(imageUrl)
        console.log("Extracted colors:", colors) // Debug log

        if (colors && colors.length > 0) {
          onColorsExtracted(colors)
        } else {
          console.error("No colors extracted")
          alert("Could not extract colors from this image. Please try a different image.")
        }
      } catch (error) {
        console.error("Error extracting colors:", error)
        alert("Error processing image. Please try again with a different image.")
      } finally {
        setIsProcessing(false)
      }
    },
    [onImageUpload, onColorsExtracted],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile],
  )

  const clearImage = () => {
    setUploadedImage(null)
    onImageUpload("")
    onColorsExtracted([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="p-8">
      {!uploadedImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload an image to get started</h3>
              <p className="text-gray-600 mb-4">Drag and drop your image here, or click to browse</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
            <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG, SVG (max 10MB)</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Uploaded Image</h3>
            <Button variant="outline" size="sm" onClick={clearImage}>
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
          <div className="relative max-w-md mx-auto">
            <Image
              src={uploadedImage || "/placeholder.svg"}
              alt="Uploaded image"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Extracting colors...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
