import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import AuthorLink from "@/components/author-link"
import Navbar from "@/components/navbar"
import config from "@/frontend-config.json"
import { getBookById } from "@/lib/book"

interface BookPageProps {
  params: {
    id: string
    name: string
  }
}

export default async function BookPage({ params: { id, name } }: BookPageProps) {
  const bookId = Number.parseInt(id)
  const book = await getBookById(bookId);

  if (!book) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 h-[calc(100vh-120px)]">
          {/* Book Cover - Left Side (Fixed) */}
          <div className="md:self-start md:sticky md:top-8">
            <div className="relative h-[400px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <Image
                src={book.imageUrl || "/placeholder.png"}
                alt={`Cover of ${book.name}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Book Details - Right Side (Scrollable) */}
          <div className="md:overflow-y-auto pr-2 h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.name}</h1>

            <div className="text-lg text-gray-600 mb-6">
              by{" "}
              {book.authors.map((author: any, index: number) => (
                <span key={author.authorId}>
                  <AuthorLink author={author} role="user" />
                  {index < book.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
            </div>

            {/* Reader Count */}
            <div className="flex items-center text-gray-600 ml-2 mb-12">
              <img src="/logo.jpg" alt="ReadRack Logo" className="h-8 w-8" />
              <span>{book.readers.toLocaleString()} readers</span>
            </div>

            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
              ← Back to all books
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
