"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Trash2, RotateCcw } from "lucide-react"

interface PaletteHistoryItem {
  id: string
  dominantColor: string
  palettes: any[]
  timestamp: number
  imageUrl?: string
}

interface PaletteHistoryProps {
  onRestorePalettes: (item: PaletteHistoryItem) => void
}

export function PaletteHistory({ onRestorePalettes }: PaletteHistoryProps) {
  const [history, setHistory] = useState<PaletteHistoryItem[]>([])

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("palette-history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to parse palette history:", error)
      }
    }
  }, [])

  const addToHistory = (dominantColor: string, palettes: any[], imageUrl?: string) => {
    const newItem: PaletteHistoryItem = {
      id: Date.now().toString(),
      dominantColor,
      palettes,
      timestamp: Date.now(),
      imageUrl,
    }

    const updatedHistory = [newItem, ...history.slice(0, 9)] // Keep only last 10 items
    setHistory(updatedHistory)
    localStorage.setItem("palette-history", JSON.stringify(updatedHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("palette-history")
  }

  const removeItem = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem("palette-history", JSON.stringify(updatedHistory))
  }

  // Expose addToHistory function globally so other components can use it
  useEffect(() => {
    ;(window as any).addToPaletteHistory = addToHistory
  }, [history])

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No History Yet</h3>
          <p className="text-gray-500">Your recent palette generations will appear here</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Recent Palettes</h3>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: item.dominantColor }} />
                <div>
                  <p className="font-medium text-sm">Based on {item.dominantColor}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()} at{" "}
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{item.palettes.length} palettes</Badge>
                <Button variant="outline" size="sm" onClick={() => onRestorePalettes(item)}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restore
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview of first palette */}
            {item.palettes.length > 0 && (
              <div className="flex gap-1">
                {item.palettes[0].colors.slice(0, 5).map((color: string, index: number) => (
                  <div key={index} className="w-4 h-4 rounded-sm border" style={{ backgroundColor: color }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
