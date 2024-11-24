import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MangaCardPrimary from "@/components/manga-card-primary";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export type Manga = {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  genres: string[];
  latestChapter: string;
};

export default function Homepage() {
  const {isPending, error, data, isFetching} = useQuery({
    queryKey : ['mangas'],
    queryFn : async () => {
        // Make the API request
        const res = await axios.get("https://07cf-132-145-103-138.ngrok-free.app/mangas", {
          headers: {
            'ngrok-skip-browser-warning': 'true'  // Custom header to skip the warning page
          }
        });


        // Extract the manga data from the response
        const mangasRes = res.data["mangas"]; // Assuming the response is directly the array of mangasRes

        console.log(res.data)
        // console.log(mangasRes)

        return [
            ...mangasRes.map(
              (manga: {
                cover_image: string;
                title: string;
                latest_chapter: string;
                tags: string[];
                id: string;
              }) => ({
                id: manga.id,
                imageUrl: manga.cover_image,
                title: manga.title, // Assuming you'd want to store title as well
                latestChapter: parseInt(manga.latest_chapter) || null,
                genres: manga.tags,
              })
            ),
          ]
      },
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item: Manga) => (
            <MangaCardPrimary
              key={item.id}
              imageUrl={item.imageUrl}
              title={item.title}
              author={item.author}
              genres={item.genres}
              latestChapter={item.latestChapter}
            />
          ))}
        </div>
        <div>{isFetching ? 'Updating...' : ''}</div>
      </main>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
