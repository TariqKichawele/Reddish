'use server';

import { getUser } from "@/sanity/lib/user/getUser";


export type ImageData = {
    base64: string;
    filename: string;
    contentType: string;
} | null;
  

export async function createCommunity(
  name: string,
  imageBase64: string | null | undefined,
  imageFileName: string | null | undefined,
  imageFileType: string | null | undefined,
  slug?: string,
  description?: string,
){
    try {
        const user = await getUser();

        if ("error" in user) {
            return { error: user.error };
        }

        let imageData: ImageData | null = null;
        if (imageBase64 && imageFileName && imageFileType) {
            imageData = {
                base64: imageBase64,
                filename: imageFileName,
                contentType: imageFileType,
            };
        }

        const result = await createSubreddit(
            name,
            imageData,
            slug,
            description,
            user._id,
        );
        
        return result;
    } catch (error) {
        console.error("Failed to create community", error);
        return { error: "Failed to create community" };
    }
}