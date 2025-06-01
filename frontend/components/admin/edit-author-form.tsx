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
import { downloadImage, putFile } from "@/lib/putFile";
import toast from "react-hot-toast";

interface EditAuthorFormProps {
  author: Author;
  setImageUrl: (imageUrl: string) => void
}

export default function EditAuthorForm({ author, setImageUrl }: EditAuthorFormProps) {
  console.log('author', author)
  const router = useRouter();
  const [name, setName] = useState(author.name);
  const [birthdate, setBirthdate] = useState(author.birthdate || "");
  const [bio, setBio] = useState(author.bio);
  const [isLoading, setIsLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string>(author.imageUrl || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = author.imageUrl;
      if (newImageUrl !== author.imageUrl) {
        // Download the image and upload it
        const imageFile = await downloadImage(newImageUrl); // Implement downloadImage function
        if (!imageFile) {
          console.error("Error downloading image");
          toast.error("Error downloading image");
          setIsLoading(false);
          return;
        }
        const newUploadedImageUrl = await putFile(imageFile, "image");
        imageUrl = newUploadedImageUrl;
      }

      // Update the author using the updateAuthor function from lib/author.ts
      const updatedAuthorData = {
        authorId: author.authorId,
        name,
        birthdate,
        bio,
        imageUrl: imageUrl
      };

      console.log('updatedAuthorData', updatedAuthorData)

      await updateAuthor(updatedAuthorData, localStorage.getItem('accessToken') || '');
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

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          value={newImageUrl}
          onChange={(e) => { setNewImageUrl(e.target.value); setImageUrl(e.target.value) }}
          onFocus={(e) => e.target.select()}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : null}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
