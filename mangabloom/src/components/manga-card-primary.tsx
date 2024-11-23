import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MangaCardProps {
  imageUrl: string
  title: string
  author: string
  genres: string[]
  latestChapter: string
}

export default function MangaCardPrimary({ imageUrl, title, author, genres, latestChapter }: MangaCardProps) {
  return (
    <Card className="w-full max-w-xs mx-auto overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-background">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">by {author}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {genres.map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
      { latestChapter &&
        (<CardFooter className="px-4 py-3 bg-muted/50 flex justify-between items-center">
          <span className="text-sm font-medium">Ch. {latestChapter} (Latest)</span>
          <Button size="sm" variant="secondary">Read</Button>
        </CardFooter>)
      }
    </Card>
  )
}

