import config from "@/frontend-config.json";
import { Author } from "@/types/author";

export async function getAuthors(): Promise<Author[]> {
  const res = await fetch(`${config.apiBaseUrl}/authors`);

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function getAuthorById(id: number): Promise<Author | undefined> {
  const res = await fetch(`${config.apiBaseUrl}/authors/${id}`);

  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export async function updateAuthor(author: Author) {
  const res = await fetch(`${config.apiBaseUrl}/authors/${author.authorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(author),
  });

  if (!res.ok) {
    throw new Error("Failed to update author");
  }

  return res.json();
}

export async function searchAuthors() {
  const res = await fetch(`${config.apiBaseUrl}/authors/search`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function addAuthor(author: Omit<Author, "authorId">) {
  const res = await fetch(`${config.apiBaseUrl}/authors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(author),
  });

  if (!res.ok) {
    throw new Error("Failed to add author");
  }

  return res.json();
}

export async function deleteAuthor(id: number) {
  const res = await fetch(`${config.apiBaseUrl}/authors/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete author");
  }
}
