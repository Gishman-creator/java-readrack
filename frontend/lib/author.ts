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

export async function updateAuthor(author: Author, accessToken: string) {
  const res = await fetch(`${config.apiBaseUrl}/authors/${author.authorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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

export async function addAuthor(author: Omit<Author, "authorId">, accessToken: string) {
  const res = await fetch(`${config.apiBaseUrl}/authors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(author),
  });

  if (!res.ok) {
    throw new Error("Failed to add author");
  }

  return res.json();
}

export async function deleteAuthor(id: number, accessToken: string) {
  const res = await fetch(`${config.apiBaseUrl}/authors/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log('accessToken', accessToken)

  if (!res.ok) {
    throw new Error("Failed to delete author");
  }
}
