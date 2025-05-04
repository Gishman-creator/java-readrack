"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Author } from "@/types/author"
import { addAuthor } from "@/lib/author"

interface AddAuthorModalProps {
  isOpen: boolean
  onClose: () => void
  handleAddAuthor: (author: Author) => void
}

export default function AddAuthorModal({ isOpen, onClose, handleAddAuthor }: AddAuthorModalProps) {
  const [name, setName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [bio, setBio] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    // In a real app, you would save the author to your database here
    console.log("Saving author:", {
      name,
      birthdate,
      bio,
      imageUrl: imagePreview,
    })

    const newAuthor = await addAuthor({
      name,
      birthdate,
      bio,
    });

    handleAddAuthor(newAuthor);

    // Reset form and close modal
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setName("")
    setBirthdate("")
    setBio("")
    setImagePreview(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[70vh] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Author</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 py-2 h-full overflow-hidden">
          {/* Left Column - Image Upload (Fixed) */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-full">
              {imagePreview ? (
                <div className="relative h-[300px] w-full">
                  <Image
                    src={imagePreview || "/placeholder.png"}
                    alt="Author photo preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImagePreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-gray-500 mb-2">Upload author photo</p>
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs mx-auto" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Author Details (Scrollable) */}
          <div className="space-y-4 col-span-2 overflow-y-auto px-1 max-h-[calc(70vh-120px)]">
            <div className="space-y-2">
              <Label htmlFor="name">Author Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter author name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                placeholder="e.g., January 1, 1970"
              />
            </div>

            <div className="space-y-2 pb-4">
              <Label htmlFor="authorBio">Biography</Label>
              <Textarea
                id="authorBio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter author biography"
                rows={7}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Author</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
