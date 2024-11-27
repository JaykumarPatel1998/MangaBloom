import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Manga } from "@/lib/mangaSchema";

// I have decided to use useEffect just for this particular component because the cache control on this particular cove rimage is set by the server
export default function MangaCardPrimary({ data }: {data : Manga}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!data.cover_image || data.cover_image === "") {
      setImageSrc(null);  // If the cover_image is empty, clear the imageSrc
      return;
    }

    // Function to fetch image with custom headers using axios
    const fetchImageWithHeaders = async (cover_image: string) => {
      try {
        const response = await axios.get("https://47c9-132-145-103-138.ngrok-free.app" + "/covers/" + cover_image, {
          headers: {
            'ngrok-skip-browser-warning': 'true',  // Custom header to skip ngrok browser warning
          },
          responseType: 'blob',  // Important: specify the response type as blob for image data
        });

        // Convert the response to a URL object
        const imageObjectURL = URL.createObjectURL(response.data);
        setImageSrc(imageObjectURL);  // Set the image source for rendering
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageSrc(null);  // Fallback in case of error
      }
    };

    // Fetch the image when the component mounts or cover_image changes
    fetchImageWithHeaders(data.cover_image);
  }, [data.cover_image]);

  return (
    <Card className="w-full max-w-xs mx-auto overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-background">
      <div className="w-full">
        <img
          src={imageSrc? imageSrc : ""}  // Use the state image source
          alt={data.title}
          className="w-full transition-transform duration-300 hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{data.title}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {data.tags?.map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
      {data.latest_chapter && (
        <CardFooter className="px-4 py-3 bg-muted/50 flex justify-between items-center">
          <span className="text-sm font-medium">Ch. {data.latest_chapter} (Latest)</span>
          <Button size="sm" variant="secondary">Read</Button>
        </CardFooter>
      )}
    </Card>
  );
}