import { supabase } from "./supabaseClient";

const BUCKET_NAME = "java-readrack-cover-pics";

const generateRandomFileName = (): string => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.toString();
};

export const putFile = async (file: File) => {
  try {
    console.log("Uploading image...");
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
