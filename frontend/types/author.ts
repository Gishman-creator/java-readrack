export interface Author {
  authorId: number;
  name: string;
  birthdate?: string;
  bio: string;
  imageUrl: string | null;
  bookIds?: number[];
}
