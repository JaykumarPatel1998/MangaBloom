package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"mangabloom/seed/internal/database"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

var mangadex_api_url string

func sleep(duration time.Duration) {
	time.Sleep(duration)
}

func init() {
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

func main() {
	var migration_table MigrationTable
	fmt.Println("migration starts: ", time.Now())
	MigrationStart(&migration_table)

	//lets just try to query the data and add it to the database
	client := &http.Client{}

	for page := 1; ; page++ {
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

		var db_queries *database.Queries

		for _, manga := range mangaList {
			err := db_queries.InsertManga(context.Background(), database.InsertMangaParams(manga))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		//cleanup
		sleep(200 * time.Millisecond) // Delay after each page fetch
	}

	MigrationEnd(&migration_table)
	fmt.Println("migration ends: ", time.Now())
	fmt.Printf("migration took %v milliseconds", migration_table.MigrationEnd.Time.UnixMilli()-migration_table.MigrationBegin.Time.UnixMilli())
}
