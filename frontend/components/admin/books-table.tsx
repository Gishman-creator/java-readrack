"use client";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBook } from "@/lib/book";
import { Book } from "@/types/book";
import { on } from "events";

interface BooksTableProps {
  books: Book[];
  onDeleteBook: (bookId: number, bookName: string) => void;
}

export default function BooksTable({ books, onDeleteBook }: BooksTableProps) {
  const router = useRouter();

  const handleRowClick = (bookId: number, bookTitle: string) => {
    const titleSlug = bookTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
    router.push(`/admin/book/${bookId}/${titleSlug}`);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, bookId: number, bookName: string) => {
    e.stopPropagation();
    try {
      onDeleteBook(bookId, bookName);
    } catch (error) {
      console.error("Error deleting book:", error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Author(s)</th>
            <th className="px-6 py-3 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.bookId}
              className="bg-white border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(book.bookId, book.name)}
            >
              <td className="px-6 py-4 font-medium text-gray-900">{book.name}</td>
              <td className="px-6 py-4">
                {book.authors.map((author: any, index: number) => (
                  <span key={author.authorId}>
                    {author.name}
                    {index < book.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => handleDelete(e, book.bookId, book.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
