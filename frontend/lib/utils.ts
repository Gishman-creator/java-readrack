import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBookNameFromUrl(url: string): string {
  try {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return "Unknown Book Name";
  }
}
