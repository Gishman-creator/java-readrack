"use client"

import Link from "next/link"

interface Author {
  authorId: number
  name: string
}

interface AuthorLinkProps {
  author: Author;
  role: string;
}

export default function AuthorLink({ author, role }: AuthorLinkProps) {
  // Create URL-friendly slug from author name
  const nameSlug = author.name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")

  return (
    <Link
      href={role == "admin" ? `/admin/author/${author.authorId}/${nameSlug}` : `/author/${author.authorId}/${nameSlug}`}
      className="hover:underline hover:text-gray-800 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {author.name}
    </Link>
  )
}
