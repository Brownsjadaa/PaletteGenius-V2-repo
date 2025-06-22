"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ImageIcon, X, Link, Sparkles } from "lucide-react"
import { extractDominantColors } from "@/lib/color-extraction"
import Image from "next/image"

interface ImageUploadSectionProps {
  onImageUpload: (imageUrl: string) => void
  onColorsExtracted: (colors: string[]) => void
  uploadedImage: string | null
  isActive: boolean
}

export function ImageUploadSection({
  onImageUpload,
  onColorsExtracted,
  uploadedImage,
  isActive,
}: ImageUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [urlError, setUrlError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PNG, JPG, JPEG, SVG, or WebP image")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("Image size must be less than 10MB")
        return
      }

      setIsProcessing(true)
      const imageUrl = URL.createObjectURL(file)
      onImageUpload(imageUrl)

      try {
        const colors = await extractDominantColors(imageUrl)
        if (colors && colors.length > 0) {
          onColorsExtracted(colors)
        } else {
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

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return

    setIsProcessing(true)
    setUrlError("")

    try {
      new URL(urlInput)

      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
      const hasImageExtension = imageExtensions.some((ext) => urlInput.toLowerCase().includes(ext))

      if (!hasImageExtension && !urlInput.includes("unsplash.com") && !urlInput.includes("imgur.com")) {
        setUrlError("Please provide a direct link to an image file")
        return
      }

      onImageUpload(urlInput)

      const colors = await extractDominantColors(urlInput)
      onColorsExtracted(colors)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("Invalid URL")) {
        setUrlError("Please enter a valid URL")
      } else {
        setUrlError("Failed to load image. Please check the URL and try again.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const clearImage = () => {
    onImageUpload("")
    onColorsExtracted([])
    setUrlInput("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className={`transition-all duration-300 ${isActive ? "ring-2 ring-teal-500 shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-teal-600" />
          Upload Your Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!uploadedImage ? (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your image here</h3>
                    <p className="text-gray-600 mb-4">or click to browse your files</p>
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-teal-600 hover:bg-teal-700">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG, SVG, WebP (max 10MB)</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-6">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className={`pl-10 ${urlError ? "border-red-500" : ""}`}
                    />
                  </div>
                  {urlError && <p className="text-sm text-red-600 mt-1">{urlError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing || !urlInput.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      Loading Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Load from URL
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500">
                  <p>
                    <strong>Tip:</strong> Works best with direct image links from Unsplash, Imgur, or other image
                    hosting services.
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Uploaded Image</h3>
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
                className="rounded-lg object-cover w-full h-auto border border-gray-200"
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
      </CardContent>
    </Card>
  )
}
