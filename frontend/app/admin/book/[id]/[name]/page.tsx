'use client'
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { use } from 'react';

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import EditBookForm from "@/components/admin/edit-book-form";
import { getBookById } from "@/lib/book";
import { searchAuthors } from "@/lib/author";
import { Book } from "@/types/book";

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

export default function AdminBookPage({ params }: AdminBookPageProps) {
  const { id }: { id: string } = use(params as any);
  const bookId = Number.parseInt(id);
  const [book, setBook] = useState<Book | null>(null);
  const [authors, setAuthors] = useState<AuthorSearchDto[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedBook = await getBookById(bookId);
      const fetchedAuthors = await searchAuthors();

      if (fetchedBook) {
        setBook(fetchedBook);
        setImageUrl(fetchedBook.imageUrl || "");
      } else {
        notFound();
      }

      setAuthors(fetchedAuthors);
    };

    fetchData();
  }, [bookId]);

  if (!book) {
    return <div></div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
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
                src={imageUrl || "/placeholder.png"}
                alt={`Cover of`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Book Edit Form - Right Side (Scrollable) */}
          <div className="md:overflow-y-auto pr-2 h-full">
            <EditBookForm book={book} authors={authors} setImageUrl={setImageUrl} />
          </div>
        </div>
      </div>
    </main>
  );
}
