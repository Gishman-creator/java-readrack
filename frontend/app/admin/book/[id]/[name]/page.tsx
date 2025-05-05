import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import EditBookForm from "@/components/admin/edit-book-form";
import { getBookById } from "@/lib/book";
import { Book } from "@/types/book";
import { searchAuthors } from "@/lib/author";

interface AdminBookPageProps {
  params: {
    id: string;
    name: string;
  };
}

interface AuthorSearchDto {
  authorId: number;
  name: string;
}

interface EditBookFormProps {
  book: Book;
  authors: AuthorSearchDto[];
}

export default async function AdminBookPage({ params }: AdminBookPageProps) {
  const bookId = Number.parseInt(params.id);
  const book = await getBookById(bookId);
  const authors = await searchAuthors();

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Link href="/admin" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Book: {book.name}</h1>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 h-[calc(100vh-160px)]">
          {/* Book Cover - Left Side (Fixed) */}
          <div className="md:self-start md:sticky md:top-8">
            <div className="relative h-[390px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <Image
                src={book.imageUrl || "/placeholder.png"}
                alt={`Cover of`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Book Edit Form - Right Side (Scrollable) */}
          <div className="md:overflow-y-auto pr-2 h-full">
            <EditBookForm book={book} authors={authors} />
          </div>
        </div>
      </div>
    </main>
  );
}
