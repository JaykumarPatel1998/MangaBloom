import { z } from "zod";

// Define individual schemas for nested objects
const ChapterSchema = z.object({
  chapter_id: z.string().uuid(), // Added this field for chapter ID
  title: z.string().nullable(),
  volume: z.string().nullable(),
  chapter: z.string().nullable(),
  translated_language: z.string().nullable(),
});

const CoverImageSchema = z.object({
  id: z.string().uuid(),
  file_path: z.string().url(),
});

const MangaDescriptionSchema = z.object({
  description: z.string(),
  language_code: z.string(),
});

const MangaTitleSchema = z.object({
  title: z.string(),
  language_code: z.string(),
});

// Main schema for the overall JSON structure
const MangaSchema = z.object({
  artists: z.string(),
  authors: z.string(),
  chapters: z.array(ChapterSchema),
  cover_images: z.array(CoverImageSchema),
  manga_descriptions: z.array(MangaDescriptionSchema),
  manga_id: z.string().uuid(),
  manga_titles: z.array(MangaTitleSchema),
  original_language: z.string(),
  status: z.string(),
});

// Type inference
export type Manga = z.infer<typeof MangaSchema>;

export function validateMangaDetailSchema(exampleData: unknown) {
  try {
    const manga = MangaSchema.parse(exampleData);
    console.log("Validation passed!");
    return manga
  } catch (err) {
    console.error("Validation failed:", err);
  }
}