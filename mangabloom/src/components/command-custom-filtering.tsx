import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";

type Mangas = {
    cover_image: string;
    title: string;
    latest_chapter: string;
    tags: string[];
    id: string;
  }

// Function to fetch data using Axios
const fetchResults = async (title: string): Promise<Mangas[]> => {
  if (!title.trim()) return [];
  const res = await axios.get(
    "https://166f-132-145-103-138.ngrok-free.app/mangas",
    { 
        params: {
            title : title
        },
        headers: {
            'ngrok-skip-browser-warning': 'true'  // Custom header to skip the warning page
        }
    } // Pass 'title' as the query parameter
  );
  
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
};

export default function CommandWithReactQuery({className}:  {className : string}) {
  const [commandInput, setCommandInput] = useState<string>("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", commandInput], // Cache results per input
    queryFn: () => fetchResults(commandInput), // Pass commandInput to fetchResults
    enabled: commandInput.trim() !== "", // Only fetch when input is not empty
    staleTime: 1000 * 60, // Cache data for 24 hours
  });

  return (
    <Command shouldFilter={false} className={cn(className)}>
      <CommandInput
        placeholder="Search by title..."
        value={commandInput}
        onValueChange={setCommandInput}
      />
      <CommandList>
        {isLoading && <div>Loading...</div>}
        {isError && (
          <div className="text-red-500">{(error as Error).message}</div>
        )}
        <CommandEmpty>
          {commandInput === ""
            ? "Start typing to load results"
            : "No results found."}
        </CommandEmpty>
        <CommandGroup>
          {data?.map((result) => (
            <CommandItem key={result["id"]} value={result.title}>
              {result.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
