"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookA, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BooksTable from "./books-table";
import AuthorsTable from "./authors-table";
import AddBookModal from "./add-book-modal";
import AddAuthorModal from "./add-author-modal";
import { getBooks } from "@/lib/book";
import { deleteAuthor, getAuthors } from "@/lib/author";
import { Book } from "@/types/book";
import { Author } from "@/types/author";
import { deleteBook } from "@/lib/book";
import DeleteConfirmationModal from "./delete-confirmation-modal";


export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tab || "books");
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);
  const [itemToDeleteName, setItemToDeleteName] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getBooks();
      setBooks(booksData);
    };

    const fetchAuthors = async () => {
      const authorsData = await getAuthors();
      setAuthors(authorsData);
    };

    fetchBooks();
    fetchAuthors();
  }, []);

  const handleDeleteBook = (bookId: number, bookName: string) => {
    setItemToDeleteId(bookId);
    setItemToDeleteName(bookName);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAuthor = (authorId: number, authorName: string) => {
    setItemToDeleteId(authorId);
    setItemToDeleteName(authorName);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDeleteId || !itemToDeleteName) return;

    try {
      if (activeTab === "books") {
        await deleteBook(itemToDeleteId);
        setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== itemToDeleteId));
      } else {
        await deleteAuthor(itemToDeleteId);
        setAuthors((prevAuthors) => prevAuthors.filter((author) => author.authorId !== itemToDeleteId));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDeleteId(null);
      setItemToDeleteName("");
    }
  };

  const handleAddClick = () => {
    if (activeTab === "books") {
      setIsAddBookModalOpen(true);
    } else {
      setIsAddAuthorModalOpen(true);
    }
  };

  const handleAddBook = (newBook: Book) => {
    console.log('newBook', newBook)
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleAddAuthor = (newAuthor: Author) => {
    console.log('newAuthor', newAuthor)
    setAuthors((prevAuthors) => [...prevAuthors, newAuthor]);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gray-100">
              <BookA className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Books</p>
              <h3 className="text-2xl font-bold text-gray-800">{books.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gray-100">
              <Users className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Authors</p>
              <h3 className="text-2xl font-bold text-gray-800">{authors.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <Tabs value={activeTab} className="w-full" onValueChange={(value) => {
            setActiveTab(value);
            router.push(`?tab=${value}`);
          }}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="authors">Authors</TabsTrigger>
              </TabsList>

              <Button onClick={handleAddClick}>Add {activeTab === "books" ? "Book" : "Author"}</Button>
            </div>

            <TabsContent value="books" className="mt-4">
              <BooksTable books={books} onDeleteBook={handleDeleteBook} />
            </TabsContent>

            <TabsContent value="authors" className="mt-4">
              <AuthorsTable authors={authors} onDeleteAuthor={handleDeleteAuthor} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <AddBookModal isOpen={isAddBookModalOpen} onClose={() => setIsAddBookModalOpen(false)} handleAddBook={handleAddBook} />
      <AddAuthorModal isOpen={isAddAuthorModalOpen} onClose={() => setIsAddAuthorModalOpen(false)} handleAddAuthor={handleAddAuthor} />
       <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDeleteName}
      />
    </div>
  );
}
