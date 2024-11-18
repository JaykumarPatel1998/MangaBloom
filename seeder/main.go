package seeder

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/internal/database"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

type DBConfig struct {
	DB *database.Queries
}

type MangaSeeder struct {
	manga_seed   string
	manga_number int32
}

var mangadex_api_url string

func sleep(duration time.Duration) {
	time.Sleep(duration)
}

func initialize() {
	godotenv.Load(".env")
	db_url := os.Getenv("DB_URL")
	if db_url == "" {
		log.Fatal("msising db_url")
	}

	mangadex_api_url = os.Getenv("MANGADEX_API_BASE_URL")
	if mangadex_api_url == "" {
		log.Fatal("missing mangadex api base url")
	}

	var err error
	db, err = sql.Open("postgres", db_url)
	if err != nil {
		log.Fatalf("failed to connect to database : %v", err)
	}

	db.SetMaxOpenConns(20)
	db.SetConnMaxLifetime(0)
	db.SetMaxIdleConns(5)
}

func SeedDatabase() {
	initialize()
	var migration_table MigrationTable
	fmt.Println("migration starts: ", time.Now())
	MigrationStart(&migration_table)

	//lets just try to query the data and add it to the database
	client := &http.Client{}
	db_cfg := DBConfig{
		DB: database.New(db),
	}

	for page := 0; ; page++ {
		var mangaList []Manga
		var titleList []Title
		var tags []Tag
		var authors []Author
		var artists []Artist
		var manga_authors []MangaAuthor
		var manga_artists []MangaArtist
		var chapters []Chapter
		var cover_images []CoverImage
		var descriptions []Description

		fmt.Println("fetching page number: ", page)
		err := FetchMangaListWithPagination(client, &mangaList, &titleList, &tags, &authors, &artists, &manga_authors, &manga_artists, &chapters, &cover_images, &descriptions, page)
		if err != nil {
			fmt.Println("Error fetching manga list:", err)
			return
		}

		if len(mangaList) <= 0 {
			break
		}

		//insert mangas
		for _, manga := range mangaList {
			err := db_cfg.DB.InsertManga(context.Background(), database.InsertMangaParams(manga))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		//insert titles
		for _, title := range titleList {
			err := db_cfg.DB.InsertTitle(context.Background(), database.InsertTitleParams(title))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert descriptions
		for _, description := range descriptions {
			err := db_cfg.DB.InsertDescription(context.Background(), database.InsertDescriptionParams(description))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// isnert authors
		for _, author := range authors {
			err := db_cfg.DB.InsertAuthor(context.Background(), database.InsertAuthorParams(author))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert artists
		for _, artist := range artists {
			err := db_cfg.DB.InsertArtist(context.Background(), database.InsertArtistParams(artist))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert manga_authors
		for _, manga_author := range manga_authors {
			err := db_cfg.DB.InsertMangaAuthor(context.Background(), database.InsertMangaAuthorParams(manga_author))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert manga_artists
		for _, manga_artist := range manga_artists {
			err := db_cfg.DB.InsertMangaArtist(context.Background(), database.InsertMangaArtistParams(manga_artist))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		//cleanup
		sleep(2000 * time.Millisecond) // Delay after each page fetch
	}

	MigrationEnd(&migration_table)
	fmt.Println("migration ends: ", time.Now())
	fmt.Printf("migration took %v milliseconds", migration_table.MigrationEnd.Time.UnixMilli()-migration_table.MigrationBegin.Time.UnixMilli())
}
