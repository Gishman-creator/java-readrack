"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { downloadImage, putFile } from "@/lib/putFile";
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
import { set } from "date-fns";
import toast from "react-hot-toast";

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
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<AuthorSearchDto[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAuthors = async () => {
      const data = await searchAuthors()
      console.log('data', data)
      setAuthors(data)
    }

    fetchAuthors()
  }, [])

  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookFile(file);
    }
  };


  const removeAuthor = (authorId: number) => {
    setSelectedAuthors(selectedAuthors.filter((author) => author.authorId !== authorId))
  }

  const resetForm = () => {
    setName("")
    setSelectedAuthors([])
    setReaders(0)
    setDescription("")
    setImagePreview(null)
    setBookFile(null)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    let bookUrl: string | null = null;
    let imageUrl: string | null = null;

    try {
      if (imagePreview) {
        const imageFile = await downloadImage(imagePreview);
        if (imageFile) {
          const uploadedImageUrl = await putFile(imageFile, 'image');
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
          } else {
            console.error('Error uploading image');
            return;
          }
        } else {
          console.error('Error downloading image');
          return;
        }
      }

      if (bookFile) {
        const uploadedBookUrl = await putFile(bookFile, 'document');
        if (uploadedBookUrl) {
          bookUrl = uploadedBookUrl;
        } else {
          console.error('Error uploading book');
          return;
        }
      }

      const newBook = await addBook({
        name,
        authors: selectedAuthors,
        authorIds: selectedAuthors.map((author) => author.authorId),
        readers: readers || 0,
        description,
        imageUrl: imageUrl,
        bookUrl: bookUrl
      }, localStorage.getItem('accessToken') || '');

      handleAddBook(newBook);

      setIsLoading(false);
      resetForm();
      onClose();
      toast.success('Book added successfully!');
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error('Error adding book!');
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
          <div className="space-y-4 overflow-y-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-[400px]">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={imagePreview || "/placeholder.png"}
                    alt="Book cover preview"
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
                  <p className="text-gray-500 text-center mb-2">Upload book cover image</p>
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

          {/* Right Column - Book Details (Scrollable) */}
          <div className="space-y-4 col-span-2 overflow-y-auto px-1 max-h-[calc(70vh-120px)]">
            <div className="space-y-2">
              <Label htmlFor="name">Book Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter book name"
                required
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
                    required
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2 pb-4">
              <Label htmlFor="bookFile">Book File (PDF)</Label>
              <Input
                id="bookFile"
                type="file"
                accept="application/pdf"
                onChange={handleBookChange}
                className={`max-w ${bookFile ? 'bg-[#FFF5F5]' : ''}`}
                required
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            Add Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
