export function generateColorPalettes(baseColor: string) {
  console.log("Generating palettes for color:", baseColor) // Debug log

  const hsl = hexToHsl(baseColor)
  console.log("HSL values:", hsl) // Debug log

  const palettes = [
    {
      type: "analogous",
      description: "Colors adjacent on the color wheel",
      colors: generateAnalogous(hsl),
    },
    {
      type: "complementary",
      description: "Colors opposite on the color wheel",
      colors: generateComplementary(hsl),
    },
    {
      type: "triadic",
      description: "Three colors equally spaced on the color wheel",
      colors: generateTriadic(hsl),
    },
    {
      type: "split-complementary",
      description: "Base color plus two colors adjacent to its complement",
      colors: generateSplitComplementary(hsl),
    },
    {
      type: "monochromatic",
      description: "Variations of the same hue with different saturation and lightness",
      colors: generateMonochromatic(hsl),
    },
  ]

  console.log("Generated palettes:", palettes) // Debug log
  return palettes
}

function hexToHsl(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substr(0, 2), 16) / 255
  const g = Number.parseInt(hex.substr(2, 2), 16) / 255
  const b = Number.parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  // Normalize values
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  const toHex = (n: number) => {
    const hex = n.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function generateAnalogous([h, s, l]: [number, number, number]): string[] {
  return [
    hslToHex(h - 30, s, l),
    hslToHex(h - 15, s, l),
    hslToHex(h, s, l),
    hslToHex(h + 15, s, l),
    hslToHex(h + 30, s, l),
  ]
}

function generateComplementary([h, s, l]: [number, number, number]): string[] {
  const complement = (h + 180) % 360
  return [
    hslToHex(h, s, Math.max(10, l - 20)),
    hslToHex(h, s, l),
    hslToHex(h, s, Math.min(90, l + 20)),
    hslToHex(complement, s, l),
    hslToHex(complement, s, Math.min(90, l + 20)),
  ]
}

function generateTriadic([h, s, l]: [number, number, number]): string[] {
  return [
    hslToHex(h, s, l),
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
    hslToHex(h, Math.max(20, s - 20), Math.min(90, l + 15)),
    hslToHex((h + 120) % 360, Math.max(20, s - 20), Math.min(90, l + 15)),
  ]
}

function generateSplitComplementary([h, s, l]: [number, number, number]): string[] {
  const complement = (h + 180) % 360
  return [
    hslToHex(h, s, l),
    hslToHex((complement - 30 + 360) % 360, s, l),
    hslToHex((complement + 30) % 360, s, l),
    hslToHex(h, Math.max(20, s - 20), Math.min(90, l + 20)),
    hslToHex(h, Math.max(30, s - 10), Math.max(10, l - 15)),
  ]
}

function generateMonochromatic([h, s, l]: [number, number, number]): string[] {
  return [
    hslToHex(h, s, Math.max(10, l - 30)),
    hslToHex(h, s, Math.max(20, l - 15)),
    hslToHex(h, s, l),
    hslToHex(h, s, Math.min(85, l + 15)),
    hslToHex(h, s, Math.min(95, l + 30)),
  ]
}
