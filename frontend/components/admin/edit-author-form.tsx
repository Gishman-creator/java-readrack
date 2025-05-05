"use client"

import type React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Author } from "@/types/author";
import { updateAuthor } from "@/lib/author";

interface EditAuthorFormProps {
  author: Author;
}

export default function EditAuthorForm({ author }: EditAuthorFormProps) {
  console.log('author', author)
  const router = useRouter();
  const [name, setName] = useState(author.name);
  const [birthdate, setBirthdate] = useState(author.birthdate || "");
  const [bio, setBio] = useState(author.bio);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the author using the updateAuthor function from lib/author.ts
      const updatedAuthorData = {
        authorId: author.authorId,
        name,
        birthdate,
        bio,
        imageUrl: author.imageUrl
      };

      console.log('updatedAuthorData', updatedAuthorData)

      await updateAuthor(updatedAuthorData,  localStorage.getItem('accessToken') || '');
      router.refresh();

    } catch (error) {
      console.error("Error updating author:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Author Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthdate">Date of Birth</Label>
        <Input id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} placeholder="e.g., January 1, 1970" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={10}
          required
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
