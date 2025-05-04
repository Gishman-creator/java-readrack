import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Navbar from "@/components/navbar"
import { getAuthorById } from "@/lib/author";
import { getBookById } from "@/lib/book";
import { Book } from "@/types/book";
import BookCard from "@/components/book-card";

interface AuthorPageProps {
  params: {
    id: string
    name: string
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const authorId = Number.parseInt(params.id)
  const author = await getAuthorById(authorId);

  if (!author) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 h-[calc(100vh-120px)]">
          {/* Author Image - Left Side (Fixed) */}
          <div className="relative h-[350px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <Image
              src={author.imageUrl || "/placeholder.png?height=350&width=300"}
              alt={`Photo of ${author.name}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Author Details - Right Side (Scrollable) */}
          <div className="md:overflow-y-auto pr-2 h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{author.name}</h1>

            {author.birthdate && (
              <div className="text-lg text-gray-600 mb-6">
                Born: {new Date(author.birthdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">About the Author</h2>
              <p className="text-gray-700 whitespace-pre-line">{author.bio}</p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Books by {author.name}</h2>

            {author.bookIds && author.bookIds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {await Promise.all(author.bookIds.map(async (bookId: number) => {
                  const book = await getBookById(bookId);
                  return book;
                })).then(books => books.filter(book => book !== null)).then(books => books.map(book => (
                  book ? (
                    <BookCard key={book.bookId} book={book} role="user" />
                  ) : null
                )))}
              </div>
            ) : (
              <p>No books found for this author.</p>
            )}

            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
              ← Back to all books
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
