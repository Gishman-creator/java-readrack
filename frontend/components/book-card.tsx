import Image from "next/image"
import Link from "next/link"
import AuthorLink from "./author-link"
import { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  role: string;
}

export default function BookCard({ book, role }: BookCardProps) {
  // Create URL-friendly slug from name
  const titleSlug = book.name ? book.name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-") : "";

  const bookUrl = role == "admin" ? `/admin/book/${book.bookId}/${titleSlug}` : `/book/${book.bookId}/${titleSlug}`

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Make the image and title clickable, but not the whole card */}
      <Link href={bookUrl} className="block">
        <div className="relative h-[300px] w-full bg-gray-100">
          <Image
            src="/placeholder.png"
            alt={`Cover of ${book.name}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 pb-1">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors line-clamp-1">
            {book.name}
          </h3>
        </div>
      </Link>

      {/* Authors section is outside the Link component */}
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mt-1">
          {book.authors.map((author, index) => (
            <span key={author.authorId}>
              <AuthorLink author={author} role={role} />
              {index < book.authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
