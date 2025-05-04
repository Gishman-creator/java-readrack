import BookCard from "@/components/book-card";
import Navbar from "@/components/navbar";
import { getBooks } from "@/lib/book";
import SearchBar from "@/components/search-bar";

export default async function Home() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-16">
          <SearchBar />
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookCard key={book.bookId} book={book} role="user" />
          ))}
        </div>
      </div>
    </main>
  )
}
