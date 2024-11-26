import { z } from "zod";

const MangaSchema = z.object({
    id : z.string(),
    imageUrl: z.string(),
    title: z.string(),
    genres: z.array(z.string()),
    latestChapter: z.string(),
});

export type Manga = z.infer<typeof MangaSchema>
  
export function validateMangaArray(res: {data : {mangas : unknown[]}}) {
    const mangasRes = res.data["mangas"];
    const mangas = z.array(MangaSchema).parse(mangasRes);
    return mangas
}