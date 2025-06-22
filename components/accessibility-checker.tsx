"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface AccessibilityCheckerProps {
  colors: string[]
}

interface ContrastResult {
  color1: string
  color2: string
  ratio: number
  aaPass: boolean
  aaaPass: boolean
}

export function AccessibilityChecker({ colors }: AccessibilityCheckerProps) {
  const [results, setResults] = useState<ContrastResult[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const getContrastRatio = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    if (!rgb1 || !rgb2) return 0

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  }

  const checkAccessibility = () => {
    setIsChecking(true)
    const contrastResults: ContrastResult[] = []

    // Check all color combinations
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const ratio = getContrastRatio(colors[i], colors[j])
        contrastResults.push({
          color1: colors[i],
          color2: colors[j],
          ratio: Math.round(ratio * 100) / 100,
          aaPass: ratio >= 4.5,
          aaaPass: ratio >= 7,
        })
      }
    }

    // Sort by contrast ratio (highest first)
    contrastResults.sort((a, b) => b.ratio - a.ratio)
    setResults(contrastResults)
    setIsChecking(false)
  }

  const getStatusIcon = (result: ContrastResult) => {
    if (result.aaaPass) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (result.aaPass) return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  const getStatusText = (result: ContrastResult) => {
    if (result.aaaPass) return "AAA"
    if (result.aaPass) return "AA"
    return "Fail"
  }

  const getStatusColor = (result: ContrastResult) => {
    if (result.aaaPass) return "bg-green-100 text-green-800"
    if (result.aaPass) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Accessibility Check</h3>
          <p className="text-sm text-gray-600">Check WCAG contrast ratios between colors in your palette</p>
        </div>
        <Button onClick={checkAccessibility} disabled={isChecking || colors.length < 2}>
          {isChecking ? "Checking..." : "Check Accessibility"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>
              <strong>AA:</strong> 4.5:1 ratio (normal text) | <strong>AAA:</strong> 7:1 ratio (enhanced)
            </p>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: result.color1 }} />
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: result.color2 }} />
                  </div>
                  <div className="text-sm">
                    <span className="font-mono">{result.color1}</span>
                    <span className="mx-2">×</span>
                    <span className="font-mono">{result.color2}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{result.ratio}:1</span>
                  <Badge className={getStatusColor(result)}>{getStatusText(result)}</Badge>
                  {getStatusIcon(result)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            Showing {results.length} color combinations.
            {results.filter((r) => r.aaaPass).length} pass AAA,
            {results.filter((r) => r.aaPass && !r.aaaPass).length} pass AA only.
          </div>
        </div>
      )}

      {colors.length < 2 && (
        <div className="text-center py-8 text-gray-500">
          <p>Upload an image and select colors to check accessibility</p>
        </div>
      )}
    </Card>
  )
}
