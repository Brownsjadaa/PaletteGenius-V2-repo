export async function extractDominantColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Resize image for faster processing
        const maxSize = 150
        const ratio = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = extractColorsFromImageData(imageData)

        console.log("Extracted colors:", colors) // Debug log
        resolve(colors)
      } catch (error) {
        console.error("Color extraction error:", error)
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageUrl
  })
}

function extractColorsFromImageData(imageData: ImageData): string[] {
  const data = imageData.data
  const colorCounts = new Map<string, number>()
  const pixelStep = 4 // Sample every 4th pixel for performance

  // Sample pixels and count colors
  for (let i = 0; i < data.length; i += pixelStep * 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const alpha = data[i + 3]

    // Skip transparent pixels
    if (alpha < 128) continue

    // Skip very dark or very light pixels (they're usually not interesting)
    const brightness = (r + g + b) / 3
    if (brightness < 20 || brightness > 235) continue

    // Quantize colors to reduce noise (group similar colors)
    const quantizedR = Math.round(r / 25) * 25
    const quantizedG = Math.round(g / 25) * 25
    const quantizedB = Math.round(b / 25) * 25

    const hexColor = rgbToHex(quantizedR, quantizedG, quantizedB)
    colorCounts.set(hexColor, (colorCounts.get(hexColor) || 0) + 1)
  }

  // Sort by frequency and return top colors
  const sortedColors = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([color]) => color)

  // If we don't have enough colors, add some default ones
  if (sortedColors.length < 3) {
    const fallbackColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
    return [...sortedColors, ...fallbackColors].slice(0, 6)
  }

  return sortedColors
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}
