"use client";
import { Search, Loader2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { bookSearch } from "@/lib/book";
import { Book } from "@/types/book";
import React from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const searchBooks = async () => {
      if (searchTerm) {
        const results = await bookSearch(searchTerm);
        console.log('results', results)
        setSearchResults(results);
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    };

    searchBooks();
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResultsRef]);

  const clearSearchTerm = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsResultsVisible(false);
  };

  const handleResultClick = (book: Book) => {
    // Create URL-friendly slug from name
    const titleSlug = book.name ? book.name
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-") : "";

    const url = `/book/${book.bookId}/${titleSlug}`;

    router.push(url);
  };

  return (
    <div>
      <div className={`w-full md:w-[70%] relative mx-auto`}>
        <div className={`flex items-center w-full h-14 px-4 rounded-full border border-gray-300 shadow-sm ${isFocused ? "ring-2 ring-black" : ""}`}>
          <Search className="text-gray-400" size={25} />
          <input
            type="text"
            placeholder="Search for books, authors, genres..."
            className="w-full px-2 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setIsResultsVisible(true);
            }}
            onBlur={() => setIsFocused(false)}
          />
          {isLoading && searchTerm ? (
            <Loader2 className="animate-spin text-gray-400" size={25} />
          ) : (
            <X className="text-gray-400 hover:text-gray-600 cursor-pointer" size={25} onClick={clearSearchTerm} />
          )}
        </div>
        {isResultsVisible && searchResults.length > 0 && (
          <div ref={searchResultsRef} className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-10">
            {searchResults.map((book) => (
              <div
                key={book.bookId}
                className="flex items-center p-4 hover:bg-gray-100"
                onClick={() => handleResultClick(book)}
              >
                <img
                  src={book.imageUrl || "/placeholder.png"}
                  alt={book.name}
                  className="w-16 h-20 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{book.name}</h3>
                  <p className="text-sm text-gray-500">
                    {book.authors.map((author: any, index: number) => (
                      <span key={author.authorId}>
                        {author.name}
                        {index < book.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {isResultsVisible && !isLoading && searchResults.length === 0 && searchTerm !== "" && (
          <div ref={searchResultsRef} className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 p-4">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
