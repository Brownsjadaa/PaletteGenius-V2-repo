"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Folder } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onFolderCreated?: () => void
}

export function CreateFolderModal({ isOpen, onClose, user, onFolderCreated }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!folderName.trim()) return

    setIsCreating(true)
    try {
      const { error } = await supabase.from("folders").insert({
        name: folderName.trim(),
        user_id: user.id,
      })

      if (error) throw error

      toast({
        title: "Folder created!",
        description: `"${folderName}" has been created successfully.`,
      })

      setFolderName("")
      onClose()
      if (onFolderCreated) onFolderCreated()
    } catch (error) {
      toast({
        title: "Error creating folder",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-teal-600" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate()
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderName.trim() || isCreating}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            {isCreating ? "Creating..." : "Create Folder"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
