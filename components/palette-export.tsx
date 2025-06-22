"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Clipboard, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PaletteExportProps {
  colors: string[] // Array of HEX strings, e.g. ["#ff0000", "#00ff00", "#0000ff"]
  name?: string
}

export function PaletteExport({ colors, name = "palette" }: PaletteExportProps) {
  const [open, setOpen] = useState(false)

  /* ------------ format helpers ------------- */
  const toHex = () => colors.join(", ")

  const toCssVars = () =>
    colors.map((c, i) => `  --${name.replace(/\s+/g, "-").toLowerCase()}-${i + 1}: ${c};`).join("\n")

  const toTailwind = () => colors.map((c, i) => `  "${name}-${i + 1}": "${c.slice(1)}",`).join("\n")

  const toSvg = () => {
    const swatchWidth = 100
    const svgWidth = swatchWidth * colors.length
    const rects = colors
      .map((c, i) => `<rect x="${i * swatchWidth}" y="0" width="${swatchWidth}" height="100" fill="${c}" />`)
      .join("")
    return `<svg width="${svgWidth}" height="100" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`
  }

  const toGradient = () => `background: linear-gradient(90deg, ${colors.join(", ")});`

  /* ------------ copy / download helpers ------------- */
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast({ title: "Copied to clipboard!" }))
  }

  const download = (text: string, filename: string, mime = "text/plain") => {
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ------------ render ------------- */
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="group relative"
        >
          Export
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        align="end"
        className="w-56"
      >
        {/* HEX */}
        <DropdownMenuItem onClick={() => copy(toHex())}>
          <Clipboard className="mr-2 h-4 w-4" /> HEX
        </DropdownMenuItem>

        {/* CSS VARS */}
        <DropdownMenuItem onClick={() => copy(`:root {\n${toCssVars()}\n}`)}>
          <Clipboard className="mr-2 h-4 w-4" /> CSS&nbsp;Variables
        </DropdownMenuItem>

        {/* Tailwind */}
        <DropdownMenuItem
          onClick={() =>
            copy(
              `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${toTailwind()}\n      },\n    },\n  },\n}`,
            )
          }
        >
          <Clipboard className="mr-2 h-4 w-4" /> Tailwind&nbsp;Config
        </DropdownMenuItem>

        {/* Gradient */}
        <DropdownMenuItem onClick={() => copy(toGradient())}>
          <Clipboard className="mr-2 h-4 w-4" /> Gradient&nbsp;CSS
        </DropdownMenuItem>

        {/* SVG */}
        <DropdownMenuItem onClick={() => download(toSvg(), `${name}.svg`, "image/svg+xml")}>
          <Download className="mr-2 h-4 w-4" /> SVG&nbsp;File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
