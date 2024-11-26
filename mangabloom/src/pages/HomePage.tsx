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
import CommandCustomFiltering from "@/components/command-custom-filtering";
import { useState } from "react";

export default function Homepage() {
  const [offset, setOffset] = useState<number>(0);
  const limit = 10
  
  const {isPending, error, data, isFetching} = useQuery({
    queryKey: ["mangalist", offset],
    queryFn : async () => {
        // Make the API request
        const res = await axios.get("https://166f-132-145-103-138.ngrok-free.app/mangas", {
          params : {
            offset : offset * limit,
            limit : limit
          },
          headers: {
            'ngrok-skip-browser-warning': 'true'  // Custom header to skip the warning page
          }
        });

        // Extract the manga data from the response
        const mangasRes = res.data["mangas"]; // Assuming the response is directly the array of mangasRes

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2 relative">
        <h1 className="text-3xl font-bold justify-self-center align-middle">Manga Bloom マンガブルーム</h1>
        {/* search results goes here */}
        <CommandCustomFiltering className="rounded-lg border shadow-md"/>
      </div>

      {/*main content goes here */}
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

      <Pagination className="cursor-pointer">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={()=>{setOffset(offset-1)}}  />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{offset+1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={()=>{setOffset(offset+1)}} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
