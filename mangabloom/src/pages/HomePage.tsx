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
import { useState } from "react";
import { validateMangaArray } from "@/lib/mangaSchema";
import Navbar from "@/components/Navbar";

export default function Homepage() {
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["mangalist", offset],
    queryFn: async () => {
      // Make the API request
      const res = await axios.get(
        "https://14ee-132-145-103-138.ngrok-free.app/mangas",
        {
          params: {
            offset: offset * limit,
            limit: limit,
          },
          headers: {
            "ngrok-skip-browser-warning": "true", // Custom header to skip the warning page
          },
        }
      );

      const validResponse = validateMangaArray(res);
      return validResponse;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      {/*main content goes here */}
      <main>
        <Navbar />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-center items-center">
          {data.map((item) => (
            <MangaCardPrimary key={item.id} data={item} />
          ))}
        </div>
        <div>{isFetching ? "Updating..." : ""}</div>
      </main>

      {/* <MangaPage/> */}

      <Pagination className="cursor-pointer">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (offset - 1 < 0) return;
                setOffset(offset - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{offset + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                setOffset(offset + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Hero Section */}
      <section className="hero bg-gray-100 py-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Discover Manga Bloom
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Discover your favorite manga in an ad-free, legal platform. Enjoy a
          vast library of high-quality manga with seamless navigation and the
          latest updates.
        </p>
      </section>

      {/* Features Section */}
      <section className="features bg-white py-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Why Choose Manga Bloom?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <div className="feature-card bg-gray-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-700">
              Ad-Free Experience
            </h3>
            <p className="text-gray-600 mt-2">
              Read manga without interruptions. Our platform is designed for a
              seamless and enjoyable reading experience.
            </p>
          </div>
          <div className="feature-card bg-gray-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-700">
              Legal and Ethical
            </h3>
            <p className="text-gray-600 mt-2">
              Support manga creators by using a platform that prioritizes
              legality and fair use.
            </p>
          </div>
          <div className="feature-card bg-gray-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-700">
              High-Quality Manga
            </h3>
            <p className="text-gray-600 mt-2">
              Browse a library of high-resolution manga chapters, carefully
              curated for manga enthusiasts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
