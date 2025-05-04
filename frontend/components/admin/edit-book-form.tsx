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

interface EditBookFormProps {
  book: Book,
  authors: AuthorSearchDto[]
}

interface AuthorBadge {
  authorId: number
  name: string
}

interface AuthorSearchDto {
  authorId: number;
  name: string;
}

export default function EditBookForm({ book, authors }: EditBookFormProps) {
  const router = useRouter();
  const [name, setName] = useState(book.name);
  const [readers, setReaders] = useState<number>(book.readers);
  const [selectedAuthors, setSelectedAuthors] = useState<AuthorBadge[]>(book.authors);
  const [description, setDescription] = useState(book.description);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const removeAuthor = (authorId: number) => {
    setSelectedAuthors(selectedAuthors.filter((author) => author.authorId !== authorId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
      };

      await updateBook(updatedBookData);

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

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
