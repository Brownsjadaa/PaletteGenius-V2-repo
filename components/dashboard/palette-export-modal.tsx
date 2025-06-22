"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Palette {
  id: string
  name: string
  colors: string[]
}

interface PaletteExportModalProps {
  isOpen: boolean
  onClose: () => void
  palette: Palette
}

export function PaletteExportModal({ isOpen, onClose, palette }: PaletteExportModalProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(format)
      toast({
        title: "Copied!",
        description: `${format} format copied to clipboard`,
      })
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const generateHEX = () => {
    return palette.colors.join(", ")
  }

  const generateCSS = () => {
    const cssVars = palette.colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")
    return `:root {\n${cssVars}\n}`
  }

  const generateTailwind = () => {
    const tailwindColors = palette.colors.reduce(
      (acc, color, index) => {
        acc[`palette-${index + 1}`] = color
        return acc
      },
      {} as Record<string, string>,
    )

    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(tailwindColors, null, 8)}\n    }\n  }\n}`
  }

  const generateSVG = () => {
    const swatchWidth = 50
    const totalWidth = palette.colors.length * swatchWidth

    return `<svg width="${totalWidth}" height="50" xmlns="http://www.w3.org/2000/svg">
${palette.colors
  .map(
    (color, index) => `  <rect x="${index * swatchWidth}" y="0" width="${swatchWidth}" height="50" fill="${color}"/>`,
  )
  .join("\n")}
</svg>`
  }

  const generateRGB = () => {
    const rgbColors = palette.colors.map((hex) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgb(${r}, ${g}, ${b})`
    })

    return `linear-gradient(90deg, ${rgbColors.join(", ")})`
  }

  const exportFormats = [
    { id: "hex", label: "HEX", content: generateHEX() },
    { id: "css", label: "CSS", content: generateCSS() },
    { id: "tailwind", label: "Tailwind", content: generateTailwind() },
    { id: "svg", label: "SVG", content: generateSVG() },
    { id: "rgb", label: "RGB Gradient", content: generateRGB() },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export "{palette.name}"</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex gap-1 rounded-lg overflow-hidden">
            {palette.colors.map((color, index) => (
              <div key={index} className="flex-1 h-16" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <Tabs defaultValue="hex" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {exportFormats.map((format) => (
              <TabsTrigger key={format.id} value={format.id}>
                {format.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {exportFormats.map((format) => (
            <TabsContent key={format.id} value={format.id} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{format.content}</pre>
              </div>
              <Button onClick={() => copyToClipboard(format.content, format.label)} className="w-full">
                {copied === format.label ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy {format.label}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
