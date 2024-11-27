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
import { Manga, validateMangaArray } from "@/lib/mangaSchema";
import { Link, useNavigate } from "react-router";

// Function to fetch data using Axios
const fetchResults = async (title: string): Promise<Manga[]> => {
  if (!title.trim()) return [];
  const res = await axios.get(
    "https://14ee-132-145-103-138.ngrok-free.app/mangas",
    { 
        params: {
            title : title
        },
        headers: {
            'ngrok-skip-browser-warning': 'true'  // Custom header to skip the warning page
        }
    } // Pass 'title' as the query parameter
  );
  return validateMangaArray(res)
};

export default function CommandWithReactQuery({className}:  {className : string}) {
  const [commandInput, setCommandInput] = useState<string>("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", commandInput], // Cache results per input
    queryFn: () => fetchResults(commandInput), // Pass commandInput to fetchResults
    enabled: commandInput.trim() !== "", // Only fetch when input is not empty
    staleTime: 1000 * 60 * 60, // Cache data for 24 hours
  });

  const navigate = useNavigate();
  const handleKeyDown = (event : {key:string}, id : string) => {
    if (event.key === 'Enter') {
      navigate(`/manga/${id}`);
    }
  };

  return (
    <Command shouldFilter={false} className={cn(className, "bg-[rgba(78, 33, 22, 0.3)]")}>
      <CommandInput
        placeholder="Blue Box"
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
            <CommandItem key={result.id} value={result.title} tabIndex={0} // Make the div focusable
            onKeyDown={(event) => handleKeyDown(event, result.id)}>
              <Link to={`/manga/${result.id}`}>
                {result.title}
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
