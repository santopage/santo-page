import { FieldValues } from "react-hook-form";

export async function createPage({ saint_slug, images }: FieldValues) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        saint_slug,
        image_urls: images,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create page");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating page:", error);
    return null;
  }
}