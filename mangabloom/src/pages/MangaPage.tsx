import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This would typically come from your API or database
import { validateMangaDetailSchema } from '@/lib/mangaDetailSchema'
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar";

export default function MangaPage() {
  const { id } = useParams<{ id?: string }>();

  const be_url = "https://14ee-132-145-103-138.ngrok-free.app"
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const {isPending, error, data, isFetching} = useQuery({
    queryKey: ["manga", id],
    queryFn : async () => {
        // Make the API request
        const res = await axios.get(be_url+"/manga/"+id, {
          headers: {
            'ngrok-skip-browser-warning': 'true'  // Custom header to skip the warning page
          }
        });
        
        const validResponse = validateMangaDetailSchema(res.data)
        return validResponse
      },
  })

  useEffect(() => {
    let cover_image: string;
    const match = data?.cover_images[0].file_path?.match(/\/([^/]+\.256\.jpg)$/);
    if (match) {
      console.log(match[1]); // Output: be3ea405-a17a-46d1-b0c4-caad9d2df100.jpg
      cover_image = be_url+ "/covers/" + match[1]
    }

    // Function to fetch image with custom headers using axios
    const fetchImageWithHeaders = async () => {
      try {
        const response = await axios.get(cover_image, {
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
    fetchImageWithHeaders();
  }, [data?.cover_images]);

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  if (!data) return <div>no data...</div>

  const mainTitle = data.manga_titles.find(title => title.language_code === data.original_language)?.title || data.manga_titles[0].title

  return (
    <div className="mx-auto px-4 py-8">
      <Navbar/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              <img 
                src={imageSrc?imageSrc : ""} 
                alt={"image"} 
                width={300} 
                height={450} 
                className="w-full h-auto object-cover rounded-lg"
              />
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <Badge variant="outline">{data.status}</Badge>
            <Badge variant="outline">{data.original_language}</Badge>
          </div>
        </div>

        {/* Manga Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{mainTitle}</CardTitle>
              <CardDescription>
                {data.manga_titles.filter(title => title.title !== mainTitle).map((title, index) => (
                  <span key={index} className="block text-sm">
                    {title.title} ({title.language_code})
                  </span>
                ))}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={data.manga_descriptions[0].language_code!}>
                <TabsList>
                  {data.manga_descriptions.map((desc, index) => (
                    <TabsTrigger key={index} value={desc.language_code!}>
                      {desc.language_code}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {data.manga_descriptions.map((desc, index) => (
                  <TabsContent key={index} value={desc.language_code!}>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {desc.description}
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              {data.chapters.some(chapter => chapter.volume !== null) ? (
                <Tabs defaultValue={data.chapters[0].volume || "no-volume"}>
                  <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-32 overflow-y-auto">
                    {Array.from(new Set(data.chapters.map(chapter => chapter.volume))).sort(
                      (volume1, volume2) => {
                        if (volume1 === "no-volume" || volume2 === "no-volume") return -1
                        return parseInt(volume1!) - parseInt(volume2!)
                      }
                    ).map((volume) => (
                      <TabsTrigger key={volume || "no-volume"} value={volume || "no-volume"}>
                        {volume ? `Volume ${volume}` : "Untagged Chapters"}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Array.from(new Set(data.chapters.map(chapter => chapter.volume))).map((volume) => (
                    <TabsContent key={volume || "no-volume"} value={volume || "no-volume"}>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <ul className="space-y-2">
                          {data.chapters
                            .filter(chapter => chapter.volume === volume)
                            .sort((a, b) => parseFloat(a.chapter || "0") - parseFloat(b.chapter || "0"))
                            .map((chapter, index) => (
                              <li key={index} className="flex justify-between items-center">
                                <a target="_blank" href={`https://mangadex.org/chapter/${chapter.chapter_id}`} className="hover:underline">
                                  Chapter {chapter.chapter} &#8627;
                                  {chapter.title && <span className="ml-2 text-sm text-muted-foreground">- {chapter.title}</span>}
                                </a>
                              </li>
                            ))}
                        </ul>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <ul className="space-y-2">
                    {data.chapters
                      .sort((a, b) => parseFloat(b.chapter || "0") - parseFloat(a.chapter || "0"))
                      .map((chapter, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <a target="_blank" href={`https://mangadex.org/chapter/${chapter.chapter_id}`} className="hover:underline">
                            Chapter {chapter.chapter} &#8627;
                            {chapter.title && <span className="ml-2 text-sm text-muted-foreground">- {chapter.title}</span>}
                          </a>
                        </li>
                      ))}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <div>{isFetching ? 'Updating...' : ''}</div>
        </div>
      </div>
    </div>
  )
}

