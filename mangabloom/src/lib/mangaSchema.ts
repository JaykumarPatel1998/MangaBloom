import { z } from "zod";

const MangaSchema = z.object({
    id : z.string(),
    cover_image: z.string().optional(),
    title: z.string(),
    tags: z.array(z.string()).optional(),
    latest_chapter: z.string().optional(),
});

export type Manga = z.infer<typeof MangaSchema>
  
export function validateMangaArray(res: {data : {mangas : unknown[]}}) {
    const mangasRes = res.data["mangas"];
    const mangas = z.array(MangaSchema).parse(mangasRes);
    return mangas
}