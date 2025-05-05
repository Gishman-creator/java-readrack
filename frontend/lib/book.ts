import config from "@/frontend-config.json";
import { Book } from "@/types/book";

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${config.apiBaseUrl}/books`);

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function getBookById(id: number): Promise<Book | undefined> {
  // In a real application, you would fetch the book from your database here
  const res = await fetch(`${config.apiBaseUrl}/books/${id}`);

  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export async function updateBook(book: Book, accessToken: string) {
  const res = await fetch(`${config.apiBaseUrl}/books/${book.bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    throw new Error("Failed to update book");
  }

  return res.json();
}

export async function addBook(book: Omit<Book, 'bookId'>, accessToken: string) {
  const res = await fetch(`${config.apiBaseUrl}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    throw new Error("Failed to add book");
  }

  return res.json();
}

export async function deleteBook(id: number, accessToken: string) {
  const res = await fetch(`${config.apiBaseUrl}/books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete book");
  }
}

export const bookSearch = async (searchTerm: string): Promise<Book[]> => {
  const res = await fetch(`${config.apiBaseUrl}/books/search?term=${searchTerm}`);
  const books = await res.json();
  return books;
};
