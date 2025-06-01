"use client"

import React from 'react';



import { useState } from "react"
import { putFile, downloadImage } from "@/lib/putFile";
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Author } from "@/types/author"
import { addAuthor } from "@/lib/author"
import toast from 'react-hot-toast';

interface AddAuthorModalProps {
  isOpen: boolean
  onClose: () => void
  handleAddAuthor: (author: Author) => void
}

export default function AddAuthorModal({ isOpen, onClose, handleAddAuthor }: AddAuthorModalProps) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    let imageUrl: string | null = null;

    try {
      if (imagePreview) {
        const imageFile = await downloadImage(imagePreview);
        if (!imageFile) {
          console.error("Error downloading image");
          setLoading(false);
          return;
        }
        const uploadedImageUrl = await putFile(imageFile, "image");
        if (!uploadedImageUrl) {
          console.error("Error uploading image");
          setLoading(false);
          return;
        }
        imageUrl = uploadedImageUrl;
      }

      const newAuthor = await addAuthor({
        name,
        birthdate,
        bio,
        imageUrl: imageUrl,
      }, localStorage.getItem("accessToken") || "");

      handleAddAuthor(newAuthor);

      resetForm();
      onClose();
      toast.success("Author added successfully");
    } catch (error) {
      console.error("Error adding author:", error);
      toast.error("Error adding author");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setBirthdate("");
    setBio("");
    setImagePreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[70vh] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Author</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 py-2 h-full overflow-hidden">
          {/* Left Column - Image Upload (Fixed) */}
          <div className="space-y-4 overflow-y-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-[400px]">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={imagePreview || "/placeholder.png"}
                    alt="Author cover preview"
                    fill
                    className="object-cover h-[500px] rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-1 right-1 opacity-70 hover:opacity-90"
                    onClick={() => setImagePreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-gray-500 text-center mb-2">Upload author cover image</p>
                </div>
              )}
            </div>
            <div className="mt-2 p-1">
              <Label htmlFor="pictureUrl">
                Picture URL
              </Label>
              <Input
                id="pictureUrl"
                type="text"
                className="col-span-3 mt-2"
                value={imagePreview || ""}
                onChange={(e) => {
                  const url = e.target.value;
                  setImagePreview(url);
                }}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Right Column - Author Details (Scrollable) */}
          <div className="space-y-4 col-span-2 overflow-y-auto px-1 max-h-[calc(70vh-120px)]">
            <div className="space-y-2">
              <Label htmlFor="name">Author Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter author name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                placeholder="e.g., January 1, 1970"
                required
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
                required
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            Add Author
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
