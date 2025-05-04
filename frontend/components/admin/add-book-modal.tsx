"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchAuthors } from "@/lib/author"
import { addBook } from "@/lib/book"

import { Book } from "@/types/book";

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  handleAddBook: (book: Book) => void
}

interface AuthorBadge {
  authorId: number
  name: string
}

interface AuthorSearchDto {
  authorId: number;
  name: string;
}

export default function AddBookModal({ isOpen, onClose, handleAddBook }: AddBookModalProps) {
  const [name, setName] = useState("")
  const [selectedAuthors, setSelectedAuthors] = useState<AuthorBadge[]>([])
  const [readers, setReaders] = useState(0)
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [authors, setAuthors] = useState<AuthorSearchDto[]>([])
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const fetchAuthors = async () => {
      const data = await searchAuthors()
      console.log('data', data)
      setAuthors(data)
    }

    fetchAuthors()
  }, [])

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

  const removeAuthor = (authorId: number) => {
    setSelectedAuthors(selectedAuthors.filter((author) => author.authorId !== authorId))
  }

  const resetForm = () => {
    setName("")
    setSelectedAuthors([])
    setReaders(0)
    setDescription("")
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    // In a real app, you would save the book to your database here
    console.log("Saving book:", {
      name,
      authors: selectedAuthors,
      authorIds: selectedAuthors.map((author) => author.authorId),
      readers: readers || 0,
      description,
    });

    try {
      const newBook = await addBook({
        name,
        authors: selectedAuthors,
        authorIds: selectedAuthors.map((author) => author.authorId),
        readers: readers || 0,
        description
      });

      handleAddBook(newBook);

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[70vh] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 py-2 h-full overflow-hidden">
          {/* Left Column - Image Upload (Fixed) */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-full">
              {imagePreview ? (
                <div className="relative h-[300px] w-full">
                  <Image
                    src={imagePreview || "/placeholder.png"}
                    alt="Book cover preview"
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
                  <p className="text-gray-500 mb-2">Upload book cover image</p>
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs mx-auto" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Book Details (Scrollable) */}
          <div className="space-y-4 col-span-2 overflow-y-auto px-1 max-h-[calc(70vh-120px)]">
            <div className="space-y-2">
              <Label htmlFor="name">Book Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter book name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authors">Authors</Label>
              <Select onValueChange={(value) => {
                const author = authors.find((author) => author.authorId.toString() === value)
                if (author) {
                  setSelectedAuthors([...selectedAuthors, author])
                }
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    placeholder="Search authors..."
                    className="p-2 border-b border-gray-200 rounded-none focus:ring-0 focus:border-gray-300"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  {authors.filter((author) =>
                    author.name.toLowerCase().includes(searchValue.toLowerCase())
                  ).map((author) => (
                    <SelectItem key={author.authorId} value={author.authorId.toString()}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
        </Select>

        {selectedAuthors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAuthors.map((author) => (
              <div key={author.authorId} className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1">
                <span>{author.name}</span>
                <button
                  type="button"
                  onClick={() => removeAuthor(author.authorId)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="readers">Number of Readers</Label>
              <Input
                id="readers"
                type="text"
                value={readers}
                onChange={(e) => e.target.value ? setReaders(parseInt(e.target.value)) : setReaders(0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2 pb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={5}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Book</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
