import { supabase } from "./supabaseClient";

const COVER_PICS_BUCKET_NAME = "java-readrack-cover-pics";
const BOOKS_BUCKET_NAME = "java-readrack-books";

const generateRandomFileName = (): string => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.toString();
};

export const putFile = async (file: File, fileType: "image" | "document") => {
  const BUCKET_NAME =
    fileType === "image" ? COVER_PICS_BUCKET_NAME : BOOKS_BUCKET_NAME;
  try {
    console.log("Uploading file...");
    const fileName = `${Date.now()}-${file.name}`;
    // const randomFileName = generateRandomFileName();
    // const newFileName = `${randomFileName}.jpg`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${data.path}`;
    console.log("publicUrl", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const downloadImage = async (imageUrl: string): Promise<File | null> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
};
