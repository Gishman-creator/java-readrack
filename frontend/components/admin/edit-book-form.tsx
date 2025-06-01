"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Book } from "@/types/book"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import config from '@/frontend-config.json'
import { updateBook } from "@/lib/book"
import { putFile, downloadImage } from "@/lib/putFile";
import toast from "react-hot-toast";
import { getBookNameFromUrl } from "@/lib/utils";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { File } from "lucide-react"
import PDFFileCard from "../pdf-file-card";

interface EditBookFormProps {
  book: Book,
  authors: AuthorSearchDto[],
  setImageUrl: (imageUrl: string) => void
}

interface AuthorBadge {
  authorId: number
  name: string
}

interface AuthorSearchDto {
  authorId: number;
  name: string;
}

export default function EditBookForm({ book, authors, setImageUrl }: EditBookFormProps) {
  const router = useRouter();
  const [name, setName] = useState(book.name);
  const [readers, setReaders] = useState<number>(book.readers);
  const [selectedAuthors, setSelectedAuthors] = useState<AuthorBadge[]>(book.authors);
  const [description, setDescription] = useState(book.description);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedBookFile, setSelectedBookFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>(book.imageUrl || "");
  const bookName = book.bookUrl ? getBookNameFromUrl(book.bookUrl) : "";

  const removeAuthor = (authorId: number) => {
    setSelectedAuthors(selectedAuthors.filter((author) => author.authorId !== authorId))
  }

  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBookFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);


    try {
      let bookUrl = book.bookUrl;
      if (selectedBookFile) {
        // Upload the new book file
        const bookFileUrl = await putFile(selectedBookFile, "document");
        bookUrl = bookFileUrl;
      }

      let imageUrl = book.imageUrl;
      if (newImageUrl !== book.imageUrl) {
        // Download the image and upload it
        const imageFile = await downloadImage(newImageUrl); // Implement downloadImage function
        if (!imageFile) {
          console.error("Error downloading image");
          toast.error("Error downloading image");
          setIsLoading(false);
          return;
        }
        const newUploadedImageUrl = await putFile(imageFile, "image");
        imageUrl = newUploadedImageUrl;
      }

      const updatedBookData = {
        bookId: book.bookId,
        name: name,
        readers: readers,
        authors: selectedAuthors.map((author) => ({
          authorId: author.authorId,
          name: author.name,
        })),
        authorIds: selectedAuthors.map((author) => author.authorId),
        description: description,
        imageUrl: imageUrl,
        bookUrl: bookUrl
      };

      await updateBook(updatedBookData, localStorage.getItem('accessToken') || "");

      router.refresh();

    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Book Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="readers">Readers</Label>
        <Input
          type="text"
          id="readers"
          value={readers}
          onChange={(e) => e.target.value ? setReaders(parseInt(e.target.value)) : setReaders(0)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          value={newImageUrl}
          onChange={(e) => { setNewImageUrl(e.target.value); setImageUrl(e.target.value) }}
          onFocus={(e) => e.target.select()}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bookFile">Book File (PDF)</Label>
        <Input
          type="file"
          id="bookFile"
          accept=".pdf"
          onChange={handleBookChange}
        />
      </div>

      {book.bookUrl && (
      <PDFFileCard
        fileName={bookName}
      />
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : null}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
