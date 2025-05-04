export interface Book {
  bookId: number;
  name: string;
  authors: Array<{
    authorId: number;
    name: string;
  }>;
  authorIds?: Array<number>;
  description: string;
  readers: number;
}
