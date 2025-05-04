"use client"
import { useRouter } from "next/navigation"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Author } from "@/types/author";

interface AuthorsTableProps {
  authors: Author[];
  onDeleteAuthor: (authorId: number, authorName: string) => void;
}

export default function AuthorsTable({ authors, onDeleteAuthor }: AuthorsTableProps) {
  const router = useRouter()

  const handleRowClick = (authorId: number, authorName: string) => {
    const nameSlug = authorName
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
    router.push(`/admin/author/${authorId}/${nameSlug}`)
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, authorId: number, authorName: string) => {
    e.stopPropagation();
    try {
      onDeleteAuthor(authorId, authorName);
    } catch (error) {
      console.error("Error deleting author:", error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Date of Birth</th>
            <th className="px-6 py-3 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author: any) => (
            <tr
              key={author.authorId}
              className="bg-white border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(author.authorId, author.name)}
            >
              <td className="px-6 py-4 font-medium text-gray-900">{author.name}</td>
              <td className="px-6 py-4">
                {author.birthdate ? new Date(author.birthdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : "Unknown"}
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => handleDelete(e, author.authorId, author.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
