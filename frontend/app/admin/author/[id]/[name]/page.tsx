import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import EditAuthorForm from "@/components/admin/edit-author-form";
import { getAuthorById } from "@/lib/author";
import { Book } from "@/types/book";
import config from "@/frontend-config.json";
import { getBookById } from "@/lib/book";
import BookCard from "@/components/book-card";

interface AdminAuthorPageProps {
  params: {
    id: string;
    name: string;
  };
}

export default async function AdminAuthorPage({ params }: AdminAuthorPageProps) {
  const authorId = Number.parseInt(params.id);
  const author = await getAuthorById(authorId);

  if (!author) {
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
          <h1 className="text-2xl font-bold text-gray-800">Edit Author: {author.name}</h1>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 h-[calc(100vh-160px)]">
          {/* Author Image - Left Side (Fixed) */}
          <div className="md:self-start md:sticky md:top-8">
            <div className="relative h-[350px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <Image
                src={author.imageUrl || "/placeholder.png?height=350&width=300"}
                alt={`Photo of ${author.name}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Author Edit Form - Right Side (Scrollable) */}
          <div className="md:overflow-y-auto pr-2 h-full">
            <EditAuthorForm author={author} />

            <h2 className="text-2xl font-semibold mb-4 mt-8">Books by {author.name}</h2>

            {author.bookIds && author.bookIds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {await Promise.all(author.bookIds.map(async (bookId: number) => {
                  const book = await getBookById(bookId);
                  return book;
                })).then(books => books.filter(book => book !== null)).then(books => books.map(book => (
                  book ? (
                    <BookCard key={book.bookId} book={book} role="admin" />
                  ) : null
                )))}
              </div>
            ) : (
              <p>No books found for this author.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
